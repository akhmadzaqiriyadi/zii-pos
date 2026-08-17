"use client";

import {
  AlertCircle,
  Check,
  CheckCircle2,
  Edit2,
  KeyRound,
  Loader2,
  Plus,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Users,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import {
  FormError,
  FormGroup,
  FormHelperText,
  FormLabel,
} from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { useRoles } from "../hooks/useRoles";
import type { PermissionItem, Role } from "../types/role.types";

export function RoleManagement() {
  const {
    roles,
    isLoadingRoles,
    catalog,
    isLoadingCatalog,
    createRole,
    isCreating,
    updateRole,
    isUpdating,
    deleteRole,
    isDeleting,
  } = useRoles();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  // Form State
  const [roleName, setRoleName] = useState("");
  const [roleCode, setRoleCode] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [formError, setFormError] = useState("");

  // Group catalog by category
  const groupedCatalog = catalog.reduce<Record<string, PermissionItem[]>>(
    (acc, item) => {
      const cat = item.category || "Lainnya";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    },
    {},
  );

  const handleOpenCreateModal = () => {
    setEditingRole(null);
    setRoleName("");
    setRoleCode("");
    setRoleDescription("");
    setSelectedPermissions(["pos:access"]);
    setFormError("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (role: Role) => {
    if (role.isSystem) return;
    setEditingRole(role);
    setRoleName(role.name);
    setRoleCode(role.code);
    setRoleDescription(role.description || "");
    setSelectedPermissions(role.permissions || []);
    setFormError("");
    setIsModalOpen(true);
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
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
      if (editingRole) {
        await updateRole({
          id: editingRole.id,
          data: {
            name: roleName.trim(),
            description: roleDescription.trim(),
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
      setIsModalOpen(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFormError(err.message);
      }
    }
  };

  const handleDeleteRole = async (role: Role) => {
    if (role.isSystem) return;
    if (
      confirm(
        `Apakah Anda yakin ingin menghapus role '${role.name}'? Pastikan tidak ada staf yang menggunakan role ini.`,
      )
    ) {
      await deleteRole(role.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <Card className="rounded-2xl border border-slate-200 bg-linear-to-r from-emerald-50/60 via-white to-slate-50 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge
                variant="emerald"
                className="font-bold uppercase text-[11px]"
              >
                Enterprise RBAC
              </Badge>
              <span className="text-xs font-semibold text-slate-500">
                Manajemen Role Dinamis & Hak Akses
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">
              Role & Hak Akses Staf Toko
            </h3>
            <p className="text-xs text-slate-500 max-w-2xl">
              Buat role kustom (contoh: <em>Supervisor</em>,{" "}
              <em>Admin Gudang</em>, <em>Kasir Senior</em>) dan atur izin
              granular mulai dari diskon penjualan, void struk, edit harga,
              hingga rekap transaksi.
            </p>
          </div>

          <Button
            onClick={handleOpenCreateModal}
            className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-5 px-5 rounded-xl cursor-pointer shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Buat Role Baru</span>
          </Button>
        </div>
      </Card>

      {/* Role Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Shield className="h-4 w-4 text-emerald-600" />
            <span>Daftar Role Aktif ({roles.length})</span>
          </h4>
        </div>

        {isLoadingRoles ? (
          <div className="flex items-center justify-center py-16 text-slate-400 gap-2 text-sm">
            <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
            <span>Memuat daftar role & hak akses...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roles.map((role) => {
              const isOwner = role.code === "owner";
              const isCashier = role.code === "cashier";
              const isSuper = role.code === "superadmin";

              return (
                <Card
                  key={role.id}
                  className={`rounded-2xl border transition-all hover:shadow-md flex flex-col justify-between ${
                    role.isSystem
                      ? "bg-slate-50/70 border-slate-200"
                      : "bg-white border-emerald-200/80 shadow-xs"
                  }`}
                >
                  <CardHeader className="p-5 pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-base font-bold text-slate-900">
                            {role.name}
                          </CardTitle>
                          {role.isSystem ? (
                            <Badge
                              variant="slate"
                              className="text-[10px] uppercase font-bold bg-slate-200 text-slate-700"
                            >
                              Sistem
                            </Badge>
                          ) : (
                            <Badge
                              variant="emerald"
                              className="text-[10px] uppercase font-bold bg-emerald-100 text-emerald-800"
                            >
                              Kustom
                            </Badge>
                          )}
                        </div>
                        <p className="text-[11px] font-mono text-slate-400">
                          code: {role.code}
                        </p>
                      </div>

                      {!role.isSystem && (
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenEditModal(role)}
                            className="h-8 w-8 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg"
                            title="Edit Role & Izin"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={isDeleting}
                            onClick={() => handleDeleteRole(role)}
                            className="h-8 w-8 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                            title="Hapus Role"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                      {role.description || "Tidak ada deskripsi tambahan."}
                    </p>
                  </CardHeader>

                  <CardContent className="p-5 pt-3 border-t border-slate-100/80 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-semibold">Hak Akses:</span>
                      <span className="font-bold text-slate-700">
                        {role.permissions.includes("*")
                          ? "Semua Akses (Superadmin)"
                          : `${role.permissions.length} Izin Terpilih`}
                      </span>
                    </div>

                    {/* Permission Chips */}
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                      {role.permissions.includes("*") ? (
                        <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-md">
                          ⚡ Universal Wildcard Access (*)
                        </span>
                      ) : (
                        role.permissions.map((p) => (
                          <span
                            key={p}
                            className="text-[10.5px] font-medium text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md"
                          >
                            {p}
                          </span>
                        ))
                      )}
                    </div>

                    <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>
                          {role._count?.users !== undefined
                            ? `${role._count.users} staf ditugaskan`
                            : "Role aktif"}
                        </span>
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Buat / Edit Role */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
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
              Tentukan nama role dan pilih izin yang diberikan kepada staf
              dengan role ini.
            </p>
          </DialogHeader>

          {formError && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-600 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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
                <FormLabel
                  required
                  className="text-sm font-bold text-slate-900"
                >
                  Matriks Hak Akses Granular ({selectedPermissions.length}{" "}
                  Dipilih)
                </FormLabel>
              </div>

              {isLoadingCatalog ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  Memuat katalog hak akses...
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(groupedCatalog).map(([category, items]) => {
                    const allSelected = items.every((i) =>
                      selectedPermissions.includes(i.code),
                    );

                    return (
                      <div
                        key={category}
                        className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3"
                      >
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                          <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">
                            {category}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                allSelected
                                  ? deselectAllInCategory(items)
                                  : selectAllInCategory(items)
                              }
                              className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
                            >
                              {allSelected ? "Batalkan Semua" : "Pilih Semua"}
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {items.map((item) => {
                            const isChecked = selectedPermissions.includes(
                              item.code,
                            );
                            return (
                              <label
                                key={item.code}
                                className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-all select-none ${
                                  isChecked
                                    ? "bg-white border-emerald-500 shadow-xs ring-1 ring-emerald-500/20"
                                    : "bg-white/80 border-slate-200 hover:border-slate-300"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => togglePermission(item.code)}
                                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                />
                                <div className="space-y-0.5">
                                  <p className="text-xs font-bold text-slate-900 leading-tight">
                                    {item.name}
                                  </p>
                                  <p className="text-[11px] text-slate-500 leading-snug">
                                    {item.description}
                                  </p>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                disabled={isCreating || isUpdating}
                className="rounded-xl"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isCreating || isUpdating}
                className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
              >
                {isCreating || isUpdating ? (
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
    </div>
  );
}
