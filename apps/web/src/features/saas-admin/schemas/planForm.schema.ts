import { z } from "zod";

export const planFormSchema = z.object({
  code: z
    .string()
    .min(2, "Kode paket minimal 2 karakter.")
    .regex(/^[a-z0-9-]+$/, "Kode hanya boleh huruf kecil, angka, dan minus."),
  name: z.string().min(3, "Nama paket minimal 3 karakter."),
  price: z.number().min(0, "Harga tidak boleh negatif."),
  billingCycle: z.enum(["monthly", "yearly"]),
  maxCashiers: z.number().min(1, "Batas kasir minimal 1 user."),
  allowWhiteLabel: z.boolean(),
  allowExportExcel: z.boolean(),
  featuresText: z.string().min(3, "Daftar fitur minimal 1 baris."),
  isActive: z.boolean(),
});

export type PlanFormData = z.infer<typeof planFormSchema>;

export const defaultPlanFormValues: PlanFormData = {
  code: "",
  name: "",
  price: 0,
  billingCycle: "monthly",
  maxCashiers: 1,
  allowWhiteLabel: false,
  allowExportExcel: false,
  featuresText: "1 Akun Kasir\nLaporan Transaksi Harian\nCetak Struk Thermal",
  isActive: true,
};

export function parseInitialFeaturesText(jsonStr?: string): string {
  if (!jsonStr) return "";
  try {
    const arr = JSON.parse(jsonStr);
    if (Array.isArray(arr)) return arr.join("\n");
    return jsonStr;
  } catch {
    return jsonStr;
  }
}
