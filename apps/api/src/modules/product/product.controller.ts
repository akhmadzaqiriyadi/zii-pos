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

  static async createProduct(req: AuthenticatedRequest, res: Response) {
    try {
      const tenantId = req.tenantId || "demo-tenant-01";
      const product = await ProductService.createProduct(tenantId, req.body);
      return ApiResponse.success(
        res,
        "Berhasil menambahkan produk baru",
        product,
        201,
      );
    } catch (error: unknown) {
      return ApiResponse.error(
        res,
        "Gagal menambahkan produk baru",
        error,
        400,
      );
    }
  }

  static async updateProduct(req: AuthenticatedRequest, res: Response) {
    try {
      const tenantId = req.tenantId || "demo-tenant-01";
      const id = req.params.id as string;
      const product = await ProductService.updateProduct(
        tenantId,
        id,
        req.body,
      );
      return ApiResponse.success(
        res,
        "Berhasil memperbarui data produk",
        product,
        200,
      );
    } catch (error: unknown) {
      return ApiResponse.error(
        res,
        "Gagal memperbarui data produk",
        error,
        400,
      );
    }
  }

  static async deleteProduct(req: AuthenticatedRequest, res: Response) {
    try {
      const tenantId = req.tenantId || "demo-tenant-01";
      const id = req.params.id as string;
      await ProductService.deleteProduct(tenantId, id);
      return ApiResponse.success(res, "Berhasil menghapus produk", { id }, 200);
    } catch (error: unknown) {
      return ApiResponse.error(res, "Gagal menghapus produk", error, 400);
    }
  }
}
