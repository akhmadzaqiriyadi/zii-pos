"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { parseApiErrorMessage } from "../../../lib/form-helpers";
import {
  type TenantSettingsFormData,
  tenantSettingsSchema,
} from "../schemas/tenant.schema";
import { useTenant } from "./useTenant";

export function useTenantSettingsForm() {
  const { tenant, updateTenant, isUpdating } = useTenant();
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const form = useForm<TenantSettingsFormData>({
    resolver: zodResolver(tenantSettingsSchema),
    defaultValues: {
      storeName: "",
      logoUrl: "",
      phone: "",
      address: "",
      receiptFooter: "",
    },
  });

  const { reset, register, watch, formState } = form;
  const currentLogoUrl = watch("logoUrl");

  useEffect(() => {
    if (tenant) {
      reset({
        storeName: tenant.name || "",
        logoUrl: tenant.logoUrl || "",
        phone: tenant.phone || "",
        address: tenant.address || "",
        receiptFooter: tenant.receiptFooter || "Terima kasih telah berbelanja!",
      });
    }
  }, [tenant, reset]);

  const onSubmit = form.handleSubmit(async (data) => {
    setSuccessMsg("");
    setErrorMsg("");

    try {
      await updateTenant({
        name: data.storeName,
        logoUrl: data.logoUrl || undefined,
        phone: data.phone,
        address: data.address,
        receiptFooter: data.receiptFooter,
      });
      const msg = "Pengaturan White-Label Merchant berhasil disimpan!";
      setSuccessMsg(msg);
      toast.success(msg);
    } catch (err: unknown) {
      const msg = parseApiErrorMessage(
        err,
        "Gagal menyimpan pengaturan merchant.",
      );
      setErrorMsg(msg);
      toast.error(msg);
    }
  });

  return {
    form,
    onSubmit,
    isUpdating,
    successMsg,
    errorMsg,
    register,
    currentLogoUrl,
    errors: formState.errors,
  };
}
