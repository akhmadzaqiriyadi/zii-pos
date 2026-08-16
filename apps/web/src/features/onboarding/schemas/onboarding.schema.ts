import { z } from "zod";

export const stepStoreInfoSchema = z.object({
  tenantName: z
    .string()
    .min(3, "Nama toko minimal 3 karakter.")
    .max(50, "Nama toko maksimal 50 karakter."),
  subdomain: z
    .string()
    .min(3, "Subdomain minimal 3 karakter.")
    .max(30, "Subdomain maksimal 30 karakter.")
    .regex(
      /^[a-z0-9-]+$/,
      "Subdomain hanya boleh huruf kecil, angka, dan tanda hubung (-).",
    )
    .optional()
    .or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export const stepOwnerAccountSchema = z
  .object({
    ownerName: z
      .string()
      .min(3, "Nama owner minimal 3 karakter.")
      .max(50, "Nama owner maksimal 50 karakter."),
    email: z.string().email("Format email tidak valid."),
    password: z.string().min(6, "Password minimal 6 karakter."),
    confirmPassword: z.string().min(6, "Konfirmasi password minimal 6 karakter."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok.",
    path: ["confirmPassword"],
  });

export const stepPlanSelectionSchema = z.object({
  planId: z.string().min(1, "Silakan pilih salah satu paket langganan."),
});

export type StepStoreInfoData = z.infer<typeof stepStoreInfoSchema>;
export type StepOwnerAccountData = z.infer<typeof stepOwnerAccountSchema>;
export type StepPlanSelectionData = z.infer<typeof stepPlanSelectionSchema>;

export interface FullOnboardingData {
  tenantName: string;
  subdomain?: string;
  phone?: string;
  address?: string;
  ownerName: string;
  email: string;
  password: string;
  planId: string;
}
