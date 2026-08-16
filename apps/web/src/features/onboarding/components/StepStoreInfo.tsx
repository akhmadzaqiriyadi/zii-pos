"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Globe, MapPin, Phone, Store } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  type StepStoreInfoData,
  stepStoreInfoSchema,
} from "../schemas/onboarding.schema";

interface StepStoreInfoProps {
  initialData: StepStoreInfoData;
  onSubmit: (data: StepStoreInfoData) => void;
}

export function StepStoreInfo({ initialData, onSubmit }: StepStoreInfoProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<StepStoreInfoData>({
    resolver: zodResolver(stepStoreInfoSchema),
    defaultValues: initialData,
  });

  const tenantNameValue = watch("tenantName");
  const subdomainValue = watch("subdomain");

  // Auto-generate subdomain suggestion if empty
  const autoSubdomain = subdomainValue
    ? subdomainValue.toLowerCase().replace(/[^a-z0-9-]/g, "")
    : (tenantNameValue || "")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")
        .slice(0, 20);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <header className="space-y-1">
        <h2 className="text-xl font-bold text-slate-900">
          Langkah 1: Identitas & Branding Toko
        </h2>
        <p className="text-xs text-slate-500">
          Masukkan informasi usaha atau merchant toko Anda yang akan ditampilkan pada struk & invoice.
        </p>
      </header>

      <div className="space-y-4">
        {/* Nama Toko */}
        <div className="space-y-1.5">
          <label
            className="text-xs font-semibold text-slate-700 block"
            htmlFor="tenantName"
          >
            Nama Toko / Merchant *
          </label>
          <div className="relative">
            <Store className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 z-10" />
            <Input
              id="tenantName"
              type="text"
              placeholder="Contoh: Barber Premium Studio"
              {...register("tenantName")}
              className={`pl-10 ${errors.tenantName ? "border-red-500" : ""}`}
            />
          </div>
          {errors.tenantName && (
            <p className="text-[11px] text-red-500 font-medium mt-1">
              {errors.tenantName.message}
            </p>
          )}
        </div>

        {/* Custom Subdomain Suggestion */}
        <div className="space-y-1.5">
          <label
            className="text-xs font-semibold text-slate-700 block"
            htmlFor="subdomain"
          >
            Preferensi Subdomain Usaha (White-Label)
          </label>
          <div className="relative flex items-center">
            <Globe className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 z-10" />
            <Input
              id="subdomain"
              type="text"
              placeholder="ziidistro"
              {...register("subdomain")}
              className="pl-10 pr-28"
            />
            <span className="absolute right-3 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
              .ziipos.com
            </span>
          </div>
          {autoSubdomain && (
            <p className="text-[11px] text-slate-500 font-medium">
              Domain toko kamu nanti:{" "}
              <span className="font-extrabold text-emerald-700">
                {autoSubdomain}.ziipos.com
              </span>
            </p>
          )}
          {errors.subdomain && (
            <p className="text-[11px] text-red-500 font-medium mt-1">
              {errors.subdomain.message}
            </p>
          )}
        </div>

        {/* Telepon & Alamat */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label
              className="text-xs font-semibold text-slate-700 block"
              htmlFor="phone"
            >
              Nomor Telepon Toko
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 z-10" />
              <Input
                id="phone"
                type="text"
                placeholder="Contoh: 0812XXXXXXXX"
                {...register("phone")}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              className="text-xs font-semibold text-slate-700 block"
              htmlFor="address"
            >
              Alamat Usaha
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 z-10" />
              <Input
                id="address"
                type="text"
                placeholder="Kota / Alamat lengkap toko"
                {...register("address")}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <Button
          type="submit"
          className="h-11 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-md shadow-emerald-600/20 gap-2 cursor-pointer transition"
        >
          <span>Lanjut ke Akun Owner</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
