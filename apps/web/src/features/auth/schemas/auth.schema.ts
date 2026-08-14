import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Format email tidak valid." }),
  password: z.string().min(6, { message: "Password minimal 6 karakter." }),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  tenantName: z.string().min(2, { message: "Nama toko minimal 2 karakter." }),
  phone: z.string().optional(),
  address: z.string().optional(),
  ownerName: z.string().min(2, { message: "Nama owner minimal 2 karakter." }),
  email: z.string().email({ message: "Format email tidak valid." }),
  password: z.string().min(6, { message: "Password minimal 6 karakter." }),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
