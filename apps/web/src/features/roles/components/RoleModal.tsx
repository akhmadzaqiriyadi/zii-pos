"use client";

import { AlertCircle, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import {
  FormGroup,
  FormHelperText,
  FormLabel,
} from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import type { PermissionItem, Role } from "../types/role.types";
import { PermissionMatrix } from "./PermissionMatrix";

interface RoleModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingRole: Role | null;
  catalog: PermissionItem[];
  isLoadingCatalog?: boolean;
  onSubmit: (data: {
    name: string;
    code: string;
    description: string;
    permissions: string[];
  }) => Promise<void>;
  isSubmitting?: boolean;
}

export function RoleModal({
  isOpen,
  onOpenChange,
  editingRole,
  catalog,
  isLoadingCatalog = false,
  onSubmit,
  isSubmitting = false,
}: RoleModalProps) {
  const [roleName, setRoleName] = useState("");
  const [roleCode, setRoleCode] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (editingRole) {
      setRoleName(editingRole.name);
      setRoleCode(editingRole.code);
      setRoleDescription(editingRole.description || "");
      setSelectedPermissions(editingRole.permissions || []);
    } else {
      setRoleName("");
      setRoleCode("");
      setRoleDescription("");
      setSelectedPermissions(["pos:access"]);
    }
    setFormError("");
  }, [editingRole]);

  const togglePermission = (code: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(code) ? prev.filter((p) => p !== code) : [...prev, code],
    );
  };

  const selectAllInCategory = (items: PermissionItem[]) => {
    const codes = items.map((i) => i.code);
    setSelectedPermissions((prev) => Array.from(new Set([...prev, ...codes])));
  };

  const deselectAllInCategory = (items: PermissionItem[]) => {
    const codes = new Set(items.map((i) => i.code));
    setSelectedPermissions((prev) => prev.filter((c) => !codes.has(c)));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!roleName.trim()) {
      setFormError("Nama role wajib diisi.");
      return;
    }

    if (!editingRole && !roleCode.trim()) {
      setFormError("Kode unik role wajib diisi.");
      return;
    }

    if (selectedPermissions.length === 0) {
      setFormError("Pilih minimal 1 hak akses (permission) untuk role ini.");
      return;
    }

    try {
      await onSubmit({
        name: roleName.trim(),
        code: roleCode
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9_]/g, "_"),
        description: roleDescription.trim(),
        permissions: selectedPermissions,
      });
      onOpenChange(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFormError(err.message);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            <span>
              {editingRole
                ? `Edit Role '${editingRole.name}'`
                : "Buat Role Kustom Baru"}
            </span>
          </DialogTitle>
          <p className="text-xs text-slate-500">
            Tentukan nama role dan pilih izin yang diberikan kepada staf dengan
            role ini.
          </p>
        </DialogHeader>

        {formError && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-600 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="space-y-5">
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
                  if (!editingRole && !roleCode) {
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
                disabled={!!editingRole}
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
              placeholder="Jelaskan tanggung jawab dan batasan wewenang role ini..."
              value={roleDescription}
              onChange={(e) => setRoleDescription(e.target.value)}
              className="h-16 resize-none text-xs"
            />
          </FormGroup>

          {/* Permissions Matrix */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <FormLabel required className="text-sm font-bold text-slate-900">
                Matriks Hak Akses Granular ({selectedPermissions.length}{" "}
                Dipilih)
              </FormLabel>
            </div>

            <PermissionMatrix
              catalog={catalog}
              selectedPermissions={selectedPermissions}
              onTogglePermission={togglePermission}
              onSelectAllInCategory={selectAllInCategory}
              onDeselectAllInCategory={deselectAllInCategory}
              isLoading={isLoadingCatalog}
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="rounded-xl"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
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
                    {editingRole ? "Simpan Perubahan Role" : "Buat Role Baru"}
                  </span>
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
