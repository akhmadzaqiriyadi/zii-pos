"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { parseApiErrorMessage } from "../../../lib/form-helpers";
import { type RegisterFormData, registerSchema } from "../schemas/auth.schema";
import { useAuth } from "./useAuth";

export function useRegisterForm() {
  const { register: registerAuth } = useAuth();
  const [formError, setFormError] = useState("");

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      tenantName: "",
      ownerName: "",
      email: "",
      password: "",
      phone: "",
      address: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterFormData) => {
      setFormError("");
      await registerAuth({
        tenantName: data.tenantName,
        ownerName: data.ownerName,
        email: data.email,
        password: data.password,
        phone: data.phone || undefined,
        address: data.address || undefined,
      });
    },
    onSuccess: () => {
      toast.success("Registrasi merchant baru berhasil!");
      window.location.href = "/pos";
    },
    onError: (err: unknown) => {
      const msg = parseApiErrorMessage(
        err,
        "Gagal melakukan registrasi merchant.",
      );
      setFormError(msg);
      toast.error(msg);
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    registerMutation.mutate(data);
  });

  return {
    form,
    onSubmit,
    formError,
    isSubmitting: registerMutation.isPending,
    errors: form.formState.errors,
    register: form.register,
  };
}
