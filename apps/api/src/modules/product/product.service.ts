import { db } from "@zii/db";
import {
  type PaginationQuery,
  createPaginationMeta,
  parsePaginationParams,
} from "../../utils/pagination";

export interface ProductFilterQuery extends PaginationQuery {
  isService?: string | boolean;
  lowStock?: string | boolean;
  minPrice?: string | number;
  maxPrice?: string | number;
}

export interface CreateProductInput {
  name: string;
  price: number;
  stock: number;
  isService?: boolean;
}

export class ProductService {
  static async getProducts(tenantId: string, query: ProductFilterQuery = {}) {
    const { page, limit, skip, search, sortBy, sortOrder } =
      parsePaginationParams(query);
    const { isService, lowStock, minPrice, maxPrice } = query;

    const isServiceBool =
      typeof isService === "boolean"
        ? isService
        : isService === "true"
          ? true
          : isService === "false"
            ? false
            : undefined;

    const isLowStockBool = lowStock === "true" || lowStock === true;

    const priceFilter =
      minPrice || maxPrice
        ? {
            price: {
              ...(minPrice ? { gte: Number(minPrice) } : {}),
              ...(maxPrice ? { lte: Number(maxPrice) } : {}),
            },
          }
        : {};

    const whereClause = {
      tenantId,
      ...(isServiceBool !== undefined ? { isService: isServiceBool } : {}),
      ...(isLowStockBool ? { isService: false, stock: { lte: 5 } } : {}),
      ...priceFilter,
      ...(search
        ? {
            name: {
              contains: search,
              mode: "insensitive" as const,
            },
          }
        : {}),
    };

    const validSortFields = ["name", "price", "stock", "createdAt"];
    const actualSortBy = validSortFields.includes(sortBy)
      ? sortBy
      : "createdAt";

    const [products, totalItems] = await Promise.all([
      db.product.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { [actualSortBy]: sortOrder },
      }),
      db.product.count({ where: whereClause }),
    ]);

    const meta = createPaginationMeta(page, limit, totalItems);
    const formattedProducts = products.map((p) => ({
      ...p,
      price: Number(p.price),
    }));

    return { data: formattedProducts, meta };
  }

  static async createProduct(tenantId: string, data: CreateProductInput) {
    const product = await db.product.create({
      data: {
        tenantId,
        name: data.name,
        price: data.price,
        stock: data.isService ? 999 : data.stock,
        isService: data.isService ?? false,
      },
    });
    return { ...product, price: Number(product.price) };
  }

  static async updateProduct(
    tenantId: string,
    id: string,
    data: Partial<CreateProductInput>,
  ) {
    const product = await db.product.update({
      where: { id, tenantId },
      data,
    });
    return { ...product, price: Number(product.price) };
  }

  static async deleteProduct(tenantId: string, id: string) {
    await db.product.delete({
      where: { id, tenantId },
    });
    return { id };
  }
}
