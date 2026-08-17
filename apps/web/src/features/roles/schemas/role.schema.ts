import { z } from "zod";

export const roleSchema = z.object({
  name: z
    .string()
    .min(2, "Nama role minimal 2 karakter.")
    .max(50, "Nama role maksimal 50 karakter."),
  code: z
    .string()
    .min(2, "Kode role minimal 2 karakter.")
    .max(30, "Kode role maksimal 30 karakter.")
    .regex(
      /^[a-z0-9_]+$/,
      "Kode role hanya boleh huruf kecil, angka, dan underscore (_).",
    ),
  description: z
    .string()
    .max(200, "Deskripsi maksimal 200 karakter.")
    .optional(),
  permissions: z
    .array(z.string())
    .min(1, "Pilih minimal 1 hak akses (permission) untuk role ini."),
});

export type RoleFormData = z.infer<typeof roleSchema>;
