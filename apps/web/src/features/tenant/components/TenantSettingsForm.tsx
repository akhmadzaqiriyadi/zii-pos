"use client";

import { CheckCircle2, ImageIcon, Loader2, Save, Store } from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  FormError,
  FormGroup,
  FormHelperText,
  FormLabel,
} from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { useTenantSettingsForm } from "../hooks/useTenantSettingsForm";

export function TenantSettingsForm() {
  const {
    onSubmit,
    isUpdating,
    successMsg,
    errorMsg,
    register,
    currentLogoUrl,
    errors,
  } = useTenantSettingsForm();

  return (
    <Card className="w-full rounded-2xl border border-slate-200 p-6">
      <CardHeader className="px-0 pt-0 mb-4 border-b border-slate-100 pb-4">
        <CardTitle className="flex items-center gap-2 text-slate-900 text-lg">
          <Store className="h-5 w-5 text-emerald-600" />
          <span>Profil Merchant, Logo & Struk Cetak / WA</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="px-0 pt-0">
        <form onSubmit={onSubmit} className="space-y-5">
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

          {/* Logo Toko White-Label */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
            <FormGroup>
              <FormLabel htmlFor="logoUrl">
                Logo Toko White-Label (URL Gambar)
              </FormLabel>
              <div className="flex items-center gap-4">
                {currentLogoUrl ? (
                  <div className="h-16 w-16 shrink-0 rounded-xl border border-slate-200 bg-white p-1 shadow-xs flex items-center justify-center overflow-hidden">
                    <img
                      src={currentLogoUrl}
                      alt="Logo Toko"
                      className="h-full w-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  </div>
                ) : (
                  <div className="h-16 w-16 shrink-0 rounded-xl border border-dashed border-slate-300 bg-white flex flex-col items-center justify-center text-slate-400">
                    <ImageIcon className="h-6 w-6" />
                    <span className="text-[9px] font-bold mt-0.5">No Logo</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <Input
                    id="logoUrl"
                    placeholder="https://contoh.com/logo-toko.png"
                    {...register("logoUrl")}
                  />
                  <FormHelperText className="mt-1">
                    Masukkan URL gambar logo tokomu (PNG/JPG). Logo akan
                    otomatis muncul di header cetak struk thermal dan WhatsApp.
                  </FormHelperText>
                </div>
              </div>
              <FormError message={errors.logoUrl?.message} />
            </FormGroup>
          </div>

          <FormGroup>
            <FormLabel htmlFor="storeName" required>
              Nama Toko Merchant
            </FormLabel>
            <Input
              id="storeName"
              placeholder="Contoh: ZII Distro & Laundry Studio"
              {...register("storeName")}
            />
            <FormError message={errors.storeName?.message} />
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="phone">Nomor WhatsApp Toko</FormLabel>
            <Input
              id="phone"
              placeholder="Contoh: 0812-9988-7766"
              {...register("phone")}
            />
            <FormError message={errors.phone?.message} />
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="address">Alamat Toko</FormLabel>
            <Input
              id="address"
              placeholder="Contoh: Jl. Merdeka Raya No. 45, Jakarta"
              {...register("address")}
            />
            <FormError message={errors.address?.message} />
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="receiptFooter">
              Pesan Footer Struk Belanja
            </FormLabel>
            <Textarea
              id="receiptFooter"
              rows={3}
              placeholder="Terima kasih telah berbelanja di ZII Store! Simpan nota ini sebagai bukti garansi."
              {...register("receiptFooter")}
            />
            <FormError message={errors.receiptFooter?.message} />
          </FormGroup>

          <Button
            type="submit"
            disabled={isUpdating}
            className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-5 px-6 rounded-xl cursor-pointer"
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
