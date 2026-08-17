import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  type PlanFormData,
  defaultPlanFormValues,
  parseInitialFeaturesText,
  planFormSchema,
} from "../schemas/planForm.schema";
import type {
  CreatePlanPayload,
  SaaSPlanAdmin,
  UpdatePlanPayload,
} from "../services/saasAdminApi";

interface UsePlanFormModalProps {
  planToEdit: SaaSPlanAdmin | null;
  onSubmitCreate: (data: CreatePlanPayload) => void;
  onSubmitUpdate: (id: string, data: UpdatePlanPayload) => void;
}

export function usePlanFormModal({
  planToEdit,
  onSubmitCreate,
  onSubmitUpdate,
}: UsePlanFormModalProps) {
  const isEditing = !!planToEdit;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PlanFormData>({
    resolver: zodResolver(planFormSchema),
    defaultValues: defaultPlanFormValues,
  });

  useEffect(() => {
    if (planToEdit) {
      reset({
        code: planToEdit.code,
        name: planToEdit.name,
        price: Number(planToEdit.price),
        billingCycle: planToEdit.billingCycle as "monthly" | "yearly",
        maxCashiers: planToEdit.maxCashiers,
        allowWhiteLabel: planToEdit.allowWhiteLabel,
        allowExportExcel: planToEdit.allowExportExcel,
        featuresText: parseInitialFeaturesText(planToEdit.featuresJson),
        isActive: planToEdit.isActive,
      });
    } else {
      reset(defaultPlanFormValues);
    }
  }, [planToEdit, reset]);

  const onFormSubmit = (data: PlanFormData) => {
    const featuresList = data.featuresText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      code: data.code,
      name: data.name,
      price: Number(data.price),
      billingCycle: data.billingCycle,
      maxCashiers: Number(data.maxCashiers),
      allowWhiteLabel: data.allowWhiteLabel,
      allowExportExcel: data.allowExportExcel,
      featuresJson: JSON.stringify(featuresList),
      isActive: data.isActive,
    };

    if (isEditing && planToEdit) {
      onSubmitUpdate(planToEdit.id, payload);
    } else {
      onSubmitCreate(payload);
    }
  };

  return {
    register,
    handleSubmit,
    watch,
    setValue,
    onFormSubmit,
    errors,
    isEditing,
  };
}
