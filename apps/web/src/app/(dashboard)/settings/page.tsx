"use client";

import { Save, Store } from "lucide-react";
import { useEffect, useState } from "react";
import { DashboardLayout } from "../../../components/layout/dashboard-layout";
import { Button } from "../../../components/ui/button";
import { Card, CardHeader, CardTitle } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { useAuth } from "../../../features/auth/hooks/useAuth";

export default function SettingsPage() {
  const { tenant } = useAuth();
  const [storeName, setStoreName] = useState("ZII Distro & Laundry Studio");
  const [phone, setPhone] = useState("0812-9988-7766");
  const [address, setAddress] = useState("Jl. Merdeka Raya No. 45, Jakarta");
  const [footerText, setFooterText] = useState(
    "Terima kasih telah berbelanja di ZII Store! Simpan nota ini sebagai bukti garansi.",
  );

  useEffect(() => {
    if (tenant) {
      setStoreName(tenant.name);
      setPhone(tenant.phone || "");
      setAddress(tenant.address || "");
      if (tenant.receiptFooter) {
        setFooterText(tenant.receiptFooter);
      }
    }
  }, [tenant]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Pengaturan White-Label Struk berhasil disimpan!");
  };

  return (
    <DashboardLayout requiredRole="owner">
      <main className="p-8 max-w-4xl w-full mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Pengaturan White-Label Merchant
          </h1>
          <p className="text-sm text-slate-500">
            Atur nama toko, alamat, dan tampilan header/footer struk belanja
            merchant kamu.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5 text-emerald-600" />
              <span>Profil Toko & Struk Cetak / WA</span>
            </CardTitle>
          </CardHeader>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label
                htmlFor="storeName"
                className="block text-xs font-bold text-slate-700 mb-1"
              >
                Nama Toko Merchant
              </label>
              <Input
                id="storeName"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                required
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-xs font-bold text-slate-700 mb-1"
              >
                Nomor WhatsApp Toko
              </label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div>
              <label
                htmlFor="address"
                className="block text-xs font-bold text-slate-700 mb-1"
              >
                Alamat Toko
              </label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            <div>
              <label
                htmlFor="footerText"
                className="block text-xs font-bold text-slate-700 mb-1"
              >
                Pesan Footer Struk
              </label>
              <textarea
                id="footerText"
                value={footerText}
                onChange={(e) => setFooterText(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <Button type="submit" className="gap-2">
              <Save className="h-4 w-4" />
              <span>Simpan Pengaturan</span>
            </Button>
          </form>
        </Card>
      </main>
    </DashboardLayout>
  );
}
