import { z } from "zod";

export const transactionFilterSchema = z.object({
  search: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  paymentMethod: z.enum(["all", "cash", "qris", "transfer"]).default("all"),
  status: z.enum(["all", "completed", "pending", "cancelled"]).default("all"),
  page: z.number().default(1),
  limit: z.number().default(10),
});

export type TransactionFilterFormData = z.infer<typeof transactionFilterSchema>;
