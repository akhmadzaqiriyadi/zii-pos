"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
      phone: "",
      address: "",
      receiptFooter: "",
    },
  });

  const { reset, register, formState } = form;

  useEffect(() => {
    if (tenant) {
      reset({
        storeName: tenant.name || "",
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
        phone: data.phone,
        address: data.address,
        receiptFooter: data.receiptFooter,
      });
      setSuccessMsg(
        "Pengaturan White-Label Merchant berhasil disimpan secara permanen!",
      );
    } catch (err: unknown) {
      setErrorMsg(
        parseApiErrorMessage(err, "Gagal menyimpan pengaturan merchant."),
      );
    }
  });

  return {
    form,
    onSubmit,
    isUpdating,
    successMsg,
    errorMsg,
    register,
    errors: formState.errors,
  };
}
