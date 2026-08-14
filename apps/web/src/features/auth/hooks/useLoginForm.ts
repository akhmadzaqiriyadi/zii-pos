"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { parseApiErrorMessage } from "../../../lib/form-helpers";
import { type LoginFormData, loginSchema } from "../schemas/auth.schema";
import { useAuth } from "./useAuth";

export function useLoginForm() {
  const { login } = useAuth();
  const [formError, setFormError] = useState("");

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      setFormError("");
      await login(data.email, data.password);
    },
    onSuccess: () => {
      toast.success("Berhasil masuk ke ZII POS!");
      window.location.href = "/pos";
    },
    onError: (err: unknown) => {
      const msg = parseApiErrorMessage(err, "Email atau password salah.");
      setFormError(msg);
      toast.error(msg);
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    loginMutation.mutate(data);
  });

  return {
    form,
    onSubmit,
    formError,
    isSubmitting: loginMutation.isPending,
    errors: form.formState.errors,
    register: form.register,
  };
}
