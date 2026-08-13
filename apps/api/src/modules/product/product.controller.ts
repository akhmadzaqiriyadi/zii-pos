import type { Response } from "express";
import type { AuthenticatedRequest } from "../../middlewares/tenant.middleware";
import { ApiResponse } from "../../utils/api-response";
import { ProductService } from "./product.service";

export class ProductController {
  static async getProducts(req: AuthenticatedRequest, res: Response) {
    try {
      const tenantId = req.tenantId || "demo-tenant-01";
      const {
        page,
        limit,
        search,
        sortBy,
        sortOrder,
        isService,
        lowStock,
        minPrice,
        maxPrice,
      } = req.query;

      const { data, meta } = await ProductService.getProducts(tenantId, {
        page: page as string,
        limit: limit as string,
        search: search as string,
        sortBy: sortBy as string,
        sortOrder: sortOrder as "asc" | "desc",
        isService: isService as string,
        lowStock: lowStock as string,
        minPrice: minPrice as string,
        maxPrice: maxPrice as string,
      });

      return ApiResponse.paginated(
        res,
        "Berhasil mengambil katalog produk",
        data,
        meta,
      );
    } catch (error: unknown) {
      return ApiResponse.error(
        res,
        "Gagal mengambil katalog produk",
        error,
        500,
      );
    }
  }
}
