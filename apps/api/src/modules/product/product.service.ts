import { db } from "@zii/db";
import {
  type PaginationQuery,
  createPaginationMeta,
  parsePaginationParams,
} from "../../utils/pagination";

export class ProductService {
  static async getProducts(tenantId: string, query: PaginationQuery = {}) {
    const { page, limit, skip, search } = parsePaginationParams(query);

    const fallbackProducts = [
      {
        id: "p1",
        tenantId,
        name: "Kaos Polos Cotton 30s",
        price: 65000,
        stock: 45,
        isService: false,
      },
      {
        id: "p2",
        tenantId,
        name: "Kemeja Flanel Premium",
        price: 145000,
        stock: 20,
        isService: false,
      },
      {
        id: "p3",
        tenantId,
        name: "Jasa Potong & Styling",
        price: 40000,
        stock: 999,
        isService: true,
      },
      {
        id: "p4",
        tenantId,
        name: "Parfum Sepatu Premium 100ml",
        price: 35000,
        stock: 15,
        isService: false,
      },
    ];

    try {
      const whereClause = {
        tenantId,
        ...(search
          ? {
              name: {
                contains: search,
                mode: "insensitive" as const,
              },
            }
          : {}),
      };

      const [products, totalItems] = await Promise.all([
        db.product.findMany({
          where: whereClause,
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
        }),
        db.product.count({ where: whereClause }),
      ]);

      if (totalItems > 0) {
        const meta = createPaginationMeta(page, limit, totalItems);
        return { data: products, meta };
      }
    } catch {
      // Fallback handling when DB is in demo state
    }

    const filtered = search
      ? fallbackProducts.filter((p) =>
          p.name.toLowerCase().includes(search.toLowerCase()),
        )
      : fallbackProducts;

    const paginated = filtered.slice(skip, skip + limit);
    const meta = createPaginationMeta(page, limit, filtered.length);

    return { data: paginated, meta };
  }
}
