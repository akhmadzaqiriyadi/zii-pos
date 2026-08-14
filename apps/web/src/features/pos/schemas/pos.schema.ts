import { z } from "zod";

export const paymentSchema = z.object({
  customerName: z.string().optional(),
  customerPhone: z.string().optional(),
  paymentMethod: z.enum(["cash", "qris", "transfer"]).default("cash"),
  cashReceived: z.coerce.number().min(0).default(0),
});

export type PaymentFormData = z.infer<typeof paymentSchema>;
