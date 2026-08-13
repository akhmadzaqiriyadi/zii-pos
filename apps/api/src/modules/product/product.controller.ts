import type { Response } from "express";
import type { AuthenticatedRequest } from "../../middlewares/tenant.middleware";
import { ApiResponse } from "../../utils/api-response";
import { ProductService } from "./product.service";

export class ProductController {
  static async getProducts(req: AuthenticatedRequest, res: Response) {
    try {
      const tenantId = req.tenantId || "demo-tenant-01";
      const products = await ProductService.getProductsByTenant(tenantId);
      return ApiResponse.success(
        res,
        "Berhasil mengambil katalog produk",
        products,
      );
    } catch (error) {
      return ApiResponse.error(res, "Gagal mengambil data produk", error, 500);
    }
  }
}
