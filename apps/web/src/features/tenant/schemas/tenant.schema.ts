import { z } from "zod";

export const tenantSettingsSchema = z.object({
  storeName: z.string().min(2, { message: "Nama toko minimal 2 karakter." }),
  logoUrl: z
    .string()
    .url({ message: "URL logo harus berupa link URL yang valid." })
    .or(z.literal(""))
    .optional(),
  phone: z.string().min(5, { message: "Nomor telepon minimal 5 karakter." }),
  address: z.string().min(5, { message: "Alamat minimal 5 karakter." }),
  receiptFooter: z
    .string()
    .min(2, { message: "Pesan footer minimal 2 karakter." }),
});

export type TenantSettingsFormData = z.infer<typeof tenantSettingsSchema>;
