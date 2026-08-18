import { MapPin, Phone, Receipt, Store } from "lucide-react";
import React from "react";
import type { MerchantTenantDetail } from "../services/saasAdminApi";

interface TenantDetailProfileProps {
  detail: MerchantTenantDetail;
}

export function TenantDetailProfile({ detail }: TenantDetailProfileProps) {
  return (
    <section
      aria-label="Informasi Toko"
      className="rounded-2xl border border-slate-200/80 bg-white p-6 space-y-4 shadow-xs"
    >
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
        <Store className="h-4 w-4 text-emerald-600" />
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-800">
          Informasi & Profil Toko
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs">
        <div className="space-y-1 bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
          <div className="flex items-center gap-1.5 text-slate-400 font-semibold">
            <Phone className="h-3.5 w-3.5" />
            <span>No. WhatsApp / Telepon</span>
          </div>
          <p className="font-extrabold text-slate-800 text-sm">
            {detail.phone || "-"}
          </p>
        </div>

        <div className="space-y-1 bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
          <div className="flex items-center gap-1.5 text-slate-400 font-semibold">
            <MapPin className="h-3.5 w-3.5" />
            <span>Alamat Usaha / Toko</span>
          </div>
          <p className="font-extrabold text-slate-800 text-sm">
            {detail.address || "-"}
          </p>
        </div>

        <div className="space-y-1 bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
          <div className="flex items-center gap-1.5 text-slate-400 font-semibold">
            <Receipt className="h-3.5 w-3.5" />
            <span>Catatan Footer Struk</span>
          </div>
          <p className="font-extrabold text-slate-800 text-sm italic">
            "{detail.receiptFooter || "Terima kasih telah berbelanja!"}"
          </p>
        </div>
      </div>
    </section>
  );
}
