"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Globe,
  Loader2,
  MapPin,
  Phone,
  Store,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../../components/ui/button";
import {
  FormError,
  FormGroup,
  FormHelperText,
  FormLabel,
} from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import {
  type StepStoreInfoData,
  stepStoreInfoSchema,
} from "../schemas/onboarding.schema";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface StepStoreInfoProps {
  initialData: StepStoreInfoData;
  onSubmit: (data: StepStoreInfoData) => void;
}

export function StepStoreInfo({ initialData, onSubmit }: StepStoreInfoProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<StepStoreInfoData>({
    resolver: zodResolver(stepStoreInfoSchema),
    defaultValues: initialData,
  });

  const tenantNameValue = watch("tenantName");
  const subdomainValue = watch("subdomain");

  // Real-time Subdomain Validation State
  const [subdomainStatus, setSubdomainStatus] = useState<
    "idle" | "checking" | "available" | "unavailable"
  >("idle");
  const [subdomainMessage, setSubdomainMessage] = useState<string>("");

  // Determine effective subdomain candidate
  const candidateSubdomain = (
    subdomainValue ||
    (tenantNameValue || "")
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "")
      .slice(0, 20)
  ).trim();

  // Debounced Real-Time Subdomain Availability Check
  useEffect(() => {
    if (!candidateSubdomain || candidateSubdomain.length < 3) {
      setSubdomainStatus("idle");
      setSubdomainMessage("");
      return;
    }

    setSubdomainStatus("checking");
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/v1/auth/check-subdomain?subdomain=${encodeURIComponent(
            candidateSubdomain,
          )}`,
        );
        const body = await res.json();

        if (res.ok && body.success && body.data?.isAvailable) {
          setSubdomainStatus("available");
          setSubdomainMessage(
            body.message || `Subdomain '${candidateSubdomain}' tersedia!`,
          );
        } else {
          setSubdomainStatus("unavailable");
          setSubdomainMessage(
            body.message ||
              body.error?.details ||
              "Subdomain tidak tersedia atau sudah digunakan.",
          );
        }
      } catch {
        setSubdomainStatus("idle");
        setSubdomainMessage("");
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [candidateSubdomain]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <header className="space-y-1">
        <h2 className="text-xl font-bold text-slate-900">
          Langkah 1: Identitas & Branding Toko
        </h2>
        <p className="text-xs text-slate-500">
          Masukkan informasi usaha atau merchant toko Anda yang akan ditampilkan
          pada struk & invoice.
        </p>
      </header>

      <div className="space-y-4">
        {/* Nama Toko */}
        <FormGroup>
          <FormLabel htmlFor="tenantName" required>
            Nama Toko / Merchant
          </FormLabel>
          <div className="relative">
            <Store className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <Input
              id="tenantName"
              type="text"
              placeholder="Contoh: Barber Premium Studio"
              {...register("tenantName")}
              onChange={(e) => {
                setValue("tenantName", e.target.value);
                if (!subdomainValue) {
                  setValue(
                    "subdomain",
                    e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9-]/g, "")
                      .slice(0, 20),
                  );
                }
              }}
              className={`bg-slate-50 pl-10 pr-3.5 ${
                errors.tenantName
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                  : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20"
              }`}
            />
          </div>
          <FormError message={errors.tenantName?.message} />
        </FormGroup>

        {/* Custom Subdomain Suggestion with Real-time Check */}
        <FormGroup>
          <FormLabel htmlFor="subdomain">
            Preferensi Subdomain Usaha (White-Label)
          </FormLabel>
          <div className="relative flex items-center">
            <Globe className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <Input
              id="subdomain"
              type="text"
              placeholder="ziidistro"
              {...register("subdomain")}
              className={`bg-slate-50 pl-10 pr-28 transition-colors ${
                subdomainStatus === "available"
                  ? "border-emerald-500 focus:border-emerald-600 focus:ring-emerald-500/20"
                  : subdomainStatus === "unavailable"
                    ? "border-rose-500 focus:border-rose-600 focus:ring-rose-500/20"
                    : "border-slate-200"
              }`}
            />
            <span className="absolute right-3 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
              .ziipos.com
            </span>
          </div>

          {/* Subdomain Status Feedback */}
          {candidateSubdomain && (
            <div className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold transition-all">
              {subdomainStatus === "checking" && (
                <div className="flex items-center gap-1.5 text-slate-500 animate-pulse">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Memeriksa ketersediaan subdomain...</span>
                </div>
              )}
              {subdomainStatus === "available" && (
                <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/80">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>
                    Subdomain <strong>{candidateSubdomain}.ziipos.com</strong>{" "}
                    tersedia!
                  </span>
                </div>
              )}
              {subdomainStatus === "unavailable" && (
                <div className="flex items-center gap-1.5 text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                  <AlertCircle className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                  <span>{subdomainMessage}</span>
                </div>
              )}
              {subdomainStatus === "idle" && candidateSubdomain.length >= 3 && (
                <FormHelperText>
                  Domain toko kamu nanti:{" "}
                  <span className="font-extrabold text-emerald-700">
                    {candidateSubdomain}.ziipos.com
                  </span>
                </FormHelperText>
              )}
            </div>
          )}
          <FormError message={errors.subdomain?.message} />
        </FormGroup>

        {/* Telepon & Alamat */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <FormGroup>
            <FormLabel htmlFor="phone">Nomor Telepon Toko</FormLabel>
            <div className="relative">
              <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <Input
                id="phone"
                type="text"
                placeholder="Contoh: 0812XXXXXXXX"
                {...register("phone")}
                className="bg-slate-50 pl-10 pr-3.5"
              />
            </div>
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="address">Alamat Usaha</FormLabel>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <Input
                id="address"
                type="text"
                placeholder="Kota / Alamat lengkap toko"
                {...register("address")}
                className="bg-slate-50 pl-10 pr-3.5"
              />
            </div>
          </FormGroup>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <Button
          type="submit"
          disabled={
            subdomainStatus === "checking" || subdomainStatus === "unavailable"
          }
          className="h-11 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-md shadow-emerald-600/20 gap-2 cursor-pointer transition disabled:opacity-50"
        >
          <span>Lanjut ke Akun Owner</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
