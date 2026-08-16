import { getCookie } from "../../../lib/cookies";

export interface CurrentSubscriptionPlan {
  id: string;
  code: string;
  name: string;
  price: number;
  billingCycle: string;
  maxCashiers: number;
  allowWhiteLabel: boolean;
  allowExportExcel: boolean;
  features: string[];
}

export interface CurrentSubscriptionData {
  subscriptionId: string;
  tenantId: string;
  status: "active" | "trial" | "expired" | "suspended";
  tenantStatus: string;
  startsAt: string;
  expiresAt: string;
  daysRemaining: number;
  isExpired: boolean;
  autoRenew: boolean;
  plan: CurrentSubscriptionPlan | null;
}

export interface CheckoutResult {
  invoiceId: string;
  subscriptionId: string;
  tenantId: string;
  planName: string;
  billingCycle: string;
  amount: number;
  status: string;
  paymentUrl: string;
  qrisString: string;
  createdAt: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function getAuthHeaders() {
  const token = getCookie("zii_auth_token");
  const tenantId = getCookie("zii_tenant_id");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
    "x-tenant-id": tenantId || "",
  };
}

export class SubscriptionApiService {
  static async getCurrentSubscription(): Promise<CurrentSubscriptionData> {
    const res = await fetch(`${API_BASE_URL}/api/v1/subscriptions/current`, {
      headers: getAuthHeaders(),
    });
    const body = await res.json();
    if (!res.ok || !body.success) {
      throw new Error(body.message || "Gagal memuat detail lisensi langganan.");
    }
    return body.data;
  }

  static async checkoutSubscription(
    planId: string,
    billingCycle: "monthly" | "yearly" = "monthly",
  ): Promise<CheckoutResult> {
    const res = await fetch(`${API_BASE_URL}/api/v1/subscriptions/checkout`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ planId, billingCycle }),
    });
    const body = await res.json();
    if (!res.ok || !body.success) {
      throw new Error(body.message || "Gagal memproses checkout langganan.");
    }
    return body.data;
  }

  static async simulatePaymentWebhook(
    invoiceId: string,
    amount: number,
  ): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/api/v1/subscriptions/webhook`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        order_id: invoiceId,
        transaction_status: "settlement",
        fraud_status: "accept",
        gross_amount: String(amount),
        payment_type: "qris",
        transaction_time: new Date().toISOString(),
      }),
    });
    const body = await res.json();
    if (!res.ok || !body.success) {
      throw new Error(body.message || "Gagal mensimulasikan webhook pembayaran.");
    }
  }
}
