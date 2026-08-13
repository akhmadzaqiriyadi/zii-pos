export interface Tenant {
  id: string;
  name: string;
  logoUrl?: string | null;
  phone?: string | null;
  address?: string | null;
  receiptFooter: string;
  createdAt: Date;
}

export interface User {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  role: "owner" | "cashier";
  createdAt: Date;
}

export interface Product {
  id: string;
  tenantId: string;
  name: string;
  price: number;
  stock: number;
  isService: boolean;
  createdAt: Date;
}

export interface TransactionItem {
  id?: string;
  transactionId?: string;
  productId: string;
  productName: string;
  price: number;
  qty: number;
  subtotal: number;
}

export interface Transaction {
  id: string;
  tenantId: string;
  userId: string;
  customerName?: string | null;
  customerPhone?: string | null;
  totalAmount: number;
  paymentMethod: "cash" | "qris" | "transfer";
  status: "completed" | "cancelled";
  items?: TransactionItem[];
  createdAt: Date;
}

export interface CreateTransactionInput {
  customerName?: string;
  customerPhone?: string;
  paymentMethod: "cash" | "qris" | "transfer";
  items: {
    productId: string;
    qty: number;
  }[];
}
