"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { Product } from "@zii/types";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { type ProductFormData, productSchema } from "../schemas/product.schema";
import { useProductMutations } from "./useProductMutations";

export function useProductForm(
  productToEdit?: Product | null,
  onSuccessCallback?: () => void,
  onCloseModal?: (open: boolean) => void,
) {
  const isEditing = !!productToEdit;
  const { createMutation, updateMutation } = useProductMutations();

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      price: 0,
      stock: 10,
      isService: false,
    },
  });

  const { watch, reset, setValue, register, formState } = form;
  const isService = watch("isService");

  useEffect(() => {
    if (productToEdit) {
      reset({
        name: productToEdit.name,
        price: Number(productToEdit.price),
        stock: productToEdit.stock,
        isService: productToEdit.isService,
      });
    } else {
      reset({
        name: "",
        price: 0,
        stock: 10,
        isService: false,
      });
    }
  }, [productToEdit, reset]);

  const onSubmit = form.handleSubmit((data) => {
    const payload = {
      name: data.name.trim(),
      price: data.price,
      stock: data.isService ? 999 : data.stock,
      isService: data.isService,
    };

    if (isEditing && productToEdit) {
      updateMutation.mutate(
        { id: productToEdit.id, data: payload },
        {
          onSuccess: () => {
            if (onCloseModal) onCloseModal(false);
            if (onSuccessCallback) onSuccessCallback();
          },
        },
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          if (onCloseModal) onCloseModal(false);
          if (onSuccessCallback) onSuccessCallback();
        },
      });
    }
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  return {
    form,
    onSubmit,
    isEditing,
    isService,
    isPending,
    setValue,
    register,
    errors: formState.errors,
  };
}
