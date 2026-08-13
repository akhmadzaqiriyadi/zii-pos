import { ApiResponse } from "../../utils/api-response";
import { TenantService } from "./tenant.service";
export class TenantController {
    static async getProfile(req, res) {
        try {
            const tenantId = req.tenantId || "demo-tenant-01";
            const tenant = await TenantService.getTenantProfile(tenantId);
            return ApiResponse.success(res, "Berhasil mengambil profil merchant", tenant);
        }
        catch (error) {
            return ApiResponse.error(res, "Gagal mengambil profil merchant", error, 500);
        }
    }
    static async updateProfile(req, res) {
        try {
            const tenantId = req.tenantId || "demo-tenant-01";
            const { name, logoUrl, phone, address, receiptFooter } = req.body;
            const updated = await TenantService.updateTenantProfile(tenantId, {
                name,
                logoUrl,
                phone,
                address,
                receiptFooter,
            });
            return ApiResponse.success(res, "Pengaturan White-Label merchant berhasil disimpan!", updated);
        }
        catch (error) {
            return ApiResponse.error(res, "Gagal menyimpan pengaturan merchant", error, 500);
        }
    }
}
