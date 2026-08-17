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
      const res = await login(data.email, data.password);
      return res;
    },
    onSuccess: (result) => {
      toast.success("Berhasil masuk ke ZII POS!");

      const role = result?.user?.role;
      const subdomain = result?.tenant?.subdomain;

      if (typeof window !== "undefined") {
        const protocol = window.location.protocol;
        const hostname = window.location.hostname;
        const port = window.location.port ? `:${window.location.port}` : "";

        if (role === "superadmin") {
          window.location.href = "/saas-admin";
          return;
        }

        // If user logged in from root domain (localhost:3000) and has a tenant subdomain (e.g. ziidistro)
        if (
          subdomain &&
          (hostname === "localhost" || hostname === "127.0.0.1")
        ) {
          window.location.href = `${protocol}//${subdomain}.localhost${port}/pos`;
          return;
        }

        if (
          subdomain &&
          (hostname === "ziipos.com" || hostname === "www.ziipos.com")
        ) {
          window.location.href = `${protocol}//${subdomain}.ziipos.com/pos`;
          return;
        }

        window.location.href = "/pos";
      }
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
