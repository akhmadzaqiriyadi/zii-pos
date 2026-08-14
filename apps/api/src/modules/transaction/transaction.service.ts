import { db } from "@zii/db";
import {
  type PaginationQuery,
  createPaginationMeta,
  parsePaginationParams,
} from "../../utils/pagination";

export interface CreateTransactionItemInput {
  productId: string;
  qty: number;
}

export interface CreateTransactionInput {
  userId?: string;
  customerName?: string;
  customerPhone?: string;
  paymentMethod: "cash" | "qris" | "transfer";
  items: CreateTransactionItemInput[];
}

export interface TransactionFilterQuery extends PaginationQuery {
  startDate?: string;
  endDate?: string;
  paymentMethod?: string;
  status?: string;
}

export class TransactionService {
  static async createTransaction(
    tenantId: string,
    input: CreateTransactionInput,
  ) {
    if (!input.items || input.items.length === 0) {
      throw new Error("Item transaksi tidak boleh kosong.");
    }

    // Fetch DB products for real price & name calculations
    const productIds = input.items.map((i) => i.productId);
    const dbProducts = await db.product.findMany({
      where: {
        id: { in: productIds },
        tenantId,
      },
    });

    let totalAmount = 0;
    const itemsToCreate = input.items.map((item) => {
      const prod = dbProducts.find((p) => p.id === item.productId);
      const price = prod ? Number(prod.price) : 0;
      const productName = prod ? prod.name : "Produk Kasir";
      const subtotal = price * item.qty;
      totalAmount += subtotal;

      return {
        productId: item.productId,
        productName,
        price,
        qty: item.qty,
        subtotal,
      };
    });

    return await db.$transaction(async (tx) => {
      // Create transaction entry
      const transaction = await tx.transaction.create({
        data: {
          tenantId,
          userId: input.userId || "user-default",
          customerName: input.customerName || "Umum",
          customerPhone: input.customerPhone,
          paymentMethod: input.paymentMethod,
          totalAmount,
          status: "completed",
          items: {
            create: itemsToCreate,
          },
        },
        include: { items: true },
      });

      // Deduct inventory stock for non-service products
      for (const item of input.items) {
        await tx.product.updateMany({
          where: {
            id: item.productId,
            tenantId,
            isService: false,
          },
          data: {
            stock: {
              decrement: item.qty,
            },
          },
        });
      }

      return {
        ...transaction,
        totalAmount: Number(transaction.totalAmount),
        items: transaction.items.map((i) => ({
          ...i,
          price: Number(i.price),
          subtotal: Number(i.subtotal),
        })),
      };
    });
  }

  static async getTransactions(
    tenantId: string,
    query: TransactionFilterQuery = {},
  ) {
    const { page, limit, skip, search, sortBy, sortOrder } =
      parsePaginationParams(query);
    const { startDate, endDate, paymentMethod, status } = query;

    const dateFilter =
      startDate || endDate
        ? {
            createdAt: {
              ...(startDate ? { gte: new Date(startDate) } : {}),
              ...(endDate ? { lte: new Date(endDate) } : {}),
            },
          }
        : {};

    const whereClause = {
      tenantId,
      ...dateFilter,
      ...(paymentMethod ? { paymentMethod } : {}),
      ...(status ? { status } : {}),
      ...(search
        ? {
            OR: [
              { id: { contains: search, mode: "insensitive" as const } },
              {
                customerName: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
              {
                customerPhone: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
            ],
          }
        : {}),
    };

    const [transactions, totalItems] = await Promise.all([
      db.transaction.findMany({
        where: whereClause,
        include: { items: true },
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      db.transaction.count({ where: whereClause }),
    ]);

    const meta = createPaginationMeta(page, limit, totalItems);
    const formattedTransactions = transactions.map((t) => ({
      ...t,
      totalAmount: Number(t.totalAmount),
      items: t.items.map((i) => ({
        ...i,
        price: Number(i.price),
        subtotal: Number(i.subtotal),
      })),
    }));
    return { data: formattedTransactions, meta };
  }
}
