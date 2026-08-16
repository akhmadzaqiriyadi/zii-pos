export interface Tenant {
  id: string;
  subdomain?: string | null;
  name: string;
  logoUrl?: string | null;
  phone?: string | null;
  address?: string | null;
  receiptFooter: string;
  status: "trial" | "active" | "expired" | "suspended" | string;
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

export interface Plan {
  id: string;
  code: string;
  name: string;
  price: number;
  billingCycle: "monthly" | "yearly" | string;
  maxCashiers: number;
  allowWhiteLabel: boolean;
  allowExportExcel: boolean;
  featuresJson: string;
  isActive: boolean;
  createdAt: Date;
}

export interface CreatePlanInput {
  code: string;
  name: string;
  price: number;
  billingCycle?: "monthly" | "yearly";
  maxCashiers?: number;
  allowWhiteLabel?: boolean;
  allowExportExcel?: boolean;
  featuresJson: string | string[];
  isActive?: boolean;
}

export interface UpdatePlanInput {
  name?: string;
  price?: number;
  billingCycle?: "monthly" | "yearly";
  maxCashiers?: number;
  allowWhiteLabel?: boolean;
  allowExportExcel?: boolean;
  featuresJson?: string | string[];
  isActive?: boolean;
}

export interface Subscription {
  id: string;
  tenantId: string;
  planId: string;
  status: "trial" | "active" | "expired" | "suspended" | string;
  startsAt: Date;
  expiresAt: Date;
  autoRenew: boolean;
  createdAt: Date;
  plan?: Plan;
  tenant?: Tenant;
  invoices?: SubscriptionInvoice[];
}

export interface SubscriptionInvoice {
  id: string;
  subscriptionId: string;
  amount: number;
  paymentGatewayTxId?: string | null;
  status: "unpaid" | "paid" | "failed" | string;
  paidAt?: Date | null;
  createdAt: Date;
}

export interface CheckoutSubscriptionInput {
  planId: string;
  billingCycle?: "monthly" | "yearly";
}

export interface PaymentWebhookPayload {
  orderId: string; // SubscriptionInvoice.id
  transactionStatus:
    | "settlement"
    | "capture"
    | "pending"
    | "expire"
    | "cancel"
    | "deny";
  fraudStatus?: string;
  grossAmount: string | number;
  signatureKey: string;
  paymentType?: string;
  transactionTime?: string;
}

export interface SaaSMetrics {
  totalMerchants: number;
  activeTrials: number;
  activePaidMerchants: number;
  expiredMerchants: number;
  suspendedMerchants: number;
  mrr: number;
  churnRate: number;
}
