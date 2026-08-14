"use client";

import { CheckCircle2, Loader2, Save, Store } from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { useTenantSettingsForm } from "../hooks/useTenantSettingsForm";

export function TenantSettingsForm() {
  const { onSubmit, isUpdating, successMsg, errorMsg, register, errors } =
    useTenantSettingsForm();

  return (
    <Card className="rounded-2xl border border-slate-200 p-6">
      <CardHeader className="px-0 pt-0 mb-4 border-b border-slate-100 pb-4">
        <CardTitle className="flex items-center gap-2 text-slate-900 text-lg">
          <Store className="h-5 w-5 text-emerald-600" />
          <span>Profil Merchant & Struk Cetak / WA</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="px-0 pt-0">
        <form onSubmit={onSubmit} className="space-y-4">
          {successMsg && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3.5 text-xs text-emerald-700 font-semibold">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="rounded-xl bg-rose-50 border border-rose-200 p-3.5 text-xs text-rose-600 font-semibold">
              {errorMsg}
            </div>
          )}

          <div className="space-y-1">
            <label
              htmlFor="storeName"
              className="block text-xs font-bold text-slate-700"
            >
              Nama Toko Merchant
            </label>
            <Input
              id="storeName"
              placeholder="Contoh: ZII Distro & Laundry Studio"
              {...register("storeName")}
            />
            {errors.storeName && (
              <p className="text-[11px] text-red-500 font-medium mt-1">
                {errors.storeName.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label
              htmlFor="phone"
              className="block text-xs font-bold text-slate-700"
            >
              Nomor WhatsApp Toko
            </label>
            <Input
              id="phone"
              placeholder="Contoh: 0812-9988-7766"
              {...register("phone")}
            />
            {errors.phone && (
              <p className="text-[11px] text-red-500 font-medium mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label
              htmlFor="address"
              className="block text-xs font-bold text-slate-700"
            >
              Alamat Toko
            </label>
            <Input
              id="address"
              placeholder="Contoh: Jl. Merdeka Raya No. 45, Jakarta"
              {...register("address")}
            />
            {errors.address && (
              <p className="text-[11px] text-red-500 font-medium mt-1">
                {errors.address.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label
              htmlFor="receiptFooter"
              className="block text-xs font-bold text-slate-700"
            >
              Pesan Footer Struk Belanja
            </label>
            <Textarea
              id="receiptFooter"
              rows={3}
              placeholder="Terima kasih telah berbelanja di ZII Store! Simpan nota ini sebagai bukti garansi."
              {...register("receiptFooter")}
            />
            {errors.receiptFooter && (
              <p className="text-[11px] text-red-500 font-medium mt-1">
                {errors.receiptFooter.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isUpdating}
            className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-5 px-6 rounded-xl"
          >
            {isUpdating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Simpan Pengaturan Permanen</span>
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
