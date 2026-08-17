"use client";

import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import {
  FormGroup,
  FormHelperText,
  FormLabel,
} from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { useRoles } from "../hooks/useRoles";
import type { Role } from "../types/role.types";
import { PermissionMatrix } from "./PermissionMatrix";

interface RoleFormProps {
  initialRole?: Role | null;
  isEditMode?: boolean;
}

export function RoleForm({ initialRole, isEditMode = false }: RoleFormProps) {
  const router = useRouter();
  const {
    catalog,
    isLoadingCatalog,
    createRole,
    isCreating,
    updateRole,
    isUpdating,
  } = useRoles();

  const [roleName, setRoleName] = useState("");
  const [roleCode, setRoleCode] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (initialRole) {
      setRoleName(initialRole.name);
      setRoleCode(initialRole.code);
      setRoleDescription(initialRole.description || "");
      setSelectedPermissions(initialRole.permissions || []);
    } else {
      setRoleName("");
      setRoleCode("");
      setRoleDescription("");
      setSelectedPermissions(["pos:access"]);
    }
  }, [initialRole]);

  const togglePermission = (code: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(code) ? prev.filter((p) => p !== code) : [...prev, code],
    );
  };

  const selectAllInCategory = (items: { code: string }[]) => {
    const codes = items.map((i) => i.code);
    setSelectedPermissions((prev) => Array.from(new Set([...prev, ...codes])));
  };

  const deselectAllInCategory = (items: { code: string }[]) => {
    const codes = new Set(items.map((i) => i.code));
    setSelectedPermissions((prev) => prev.filter((c) => !codes.has(c)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!roleName.trim()) {
      setFormError("Nama role wajib diisi.");
      return;
    }

    if (!isEditMode && !roleCode.trim()) {
      setFormError("Kode unik role wajib diisi.");
      return;
    }

    if (selectedPermissions.length === 0) {
      setFormError("Pilih minimal 1 hak akses (permission) untuk role ini.");
      return;
    }

    try {
      if (isEditMode && initialRole) {
        await updateRole({
          id: initialRole.id,
          data: {
            name: roleName.trim(),
            description: roleDescription.trim() || undefined,
            permissions: selectedPermissions,
          },
        });
      } else {
        await createRole({
          name: roleName.trim(),
          code: roleCode
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9_]/g, "_"),
          description: roleDescription.trim() || undefined,
          permissions: selectedPermissions,
        });
      }
      router.push("/settings/roles");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFormError(err.message);
      }
    }
  };

  const isSubmitting = isCreating || isUpdating;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Top Header & Breadcrumb Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div className="space-y-1">
          <Link
            href="/settings/roles"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-700 transition mb-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Kembali ke Daftar Role</span>
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-emerald-600" />
            <span>
              {isEditMode
                ? `Edit Role '${initialRole?.name}'`
                : "Buat Role Kustom Baru"}
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {isEditMode
              ? "Perbarui wewenang dan izin akses granular untuk role ini."
              : "Definisikan nama role dan pilih izin granular yang diberikan kepada staf."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/settings/roles">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              className="rounded-xl px-4"
            >
              Batal
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl px-5 shadow-md shadow-emerald-600/20"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>
                  {isEditMode ? "Simpan Perubahan Role" : "Buat Role Sekarang"}
                </span>
              </>
            )}
          </Button>
        </div>
      </div>

      {formError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-600 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {/* Basic Role Information */}
      <Card className="rounded-2xl border border-slate-200 shadow-xs">
        <CardContent className="p-6 space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">
            Informasi Dasar Role
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormGroup>
              <FormLabel htmlFor="role-name" required>
                Nama Role
              </FormLabel>
              <Input
                id="role-name"
                placeholder="Contoh: Supervisor Toko"
                value={roleName}
                onChange={(e) => {
                  setRoleName(e.target.value);
                  if (!isEditMode && !roleCode) {
                    setRoleCode(
                      e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9]/g, "_")
                        .slice(0, 20),
                    );
                  }
                }}
                required
              />
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="role-code" required>
                Kode Unik Role (Slug)
              </FormLabel>
              <Input
                id="role-code"
                placeholder="contoh: supervisor"
                value={roleCode}
                onChange={(e) =>
                  setRoleCode(
                    e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "_"),
                  )
                }
                disabled={isEditMode}
                required
              />
              <FormHelperText>
                Hanya huruf kecil, angka, dan underscore.
              </FormHelperText>
            </FormGroup>
          </div>

          <FormGroup>
            <FormLabel htmlFor="role-desc">Deskripsi Role</FormLabel>
            <Textarea
              id="role-desc"
              placeholder="Jelaskan wewenang, batasan, dan tanggung jawab staf yang memiliki role ini..."
              value={roleDescription}
              onChange={(e) => setRoleDescription(e.target.value)}
              className="h-20 resize-none text-xs"
            />
          </FormGroup>
        </CardContent>
      </Card>

      {/* Permissions Matrix */}
      <Card className="rounded-2xl border border-slate-200 shadow-xs">
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Matriks Hak Akses Granular
              </h3>
              <p className="text-xs text-slate-500">
                Pilih wewenang yang diizinkan untuk role ini.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {selectedPermissions.length} Izin Dipilih
            </span>
          </div>

          <PermissionMatrix
            catalog={catalog}
            selectedPermissions={selectedPermissions}
            onTogglePermission={togglePermission}
            onSelectAllInCategory={selectAllInCategory}
            onDeselectAllInCategory={deselectAllInCategory}
            isLoading={isLoadingCatalog}
          />
        </CardContent>
      </Card>

      {/* Bottom Form Actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Link href="/settings/roles">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            className="rounded-xl px-5"
          >
            Batal
          </Button>
        </Link>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl px-6 py-5 shadow-md shadow-emerald-600/20"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Menyimpan...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4" />
              <span>
                {isEditMode ? "Simpan Perubahan Role" : "Buat Role Sekarang"}
              </span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
