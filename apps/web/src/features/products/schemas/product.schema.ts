import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, { message: "Nama produk minimal 2 karakter." }),
  price: z
    .number({ message: "Harga harus berupa angka." })
    .min(0, { message: "Harga produk tidak boleh negatif." }),
  stock: z
    .number({ message: "Stok harus berupa angka." })
    .min(0, { message: "Stok tidak boleh negatif." }),
  isService: z.boolean(),
});

export type ProductFormData = z.infer<typeof productSchema>;
