"use client";

import { AlertCircle, CheckCircle2, Loader2, UserPlus } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import {
  FormGroup,
  FormHelperText,
  FormLabel,
} from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import type { Role } from "../../roles/types/role.types";

interface CashierModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  roles: Role[];
  onSubmit: (data: {
    name: string;
    email: string;
    password: string;
    roleId?: string;
    role?: string;
  }) => Promise<void>;
  isSubmitting?: boolean;
}

export function CashierModal({
  isOpen,
  onOpenChange,
  roles,
  onSubmit,
  isSubmitting = false,
}: CashierModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState<string>("cashier");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setName("");
      setEmail("");
      setPassword("");
      setSelectedRoleId("cashier");
      setFormError("");
    }
  }, [isOpen]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!name.trim() || !email.trim() || !password.trim()) {
      setFormError("Nama, email, dan password staf wajib diisi.");
      return;
    }

    if (password.length < 6) {
      setFormError("Password staf minimal 6 karakter.");
      return;
    }

    try {
      await onSubmit({
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
        roleId: selectedRoleId !== "cashier" ? selectedRoleId : undefined,
        role: selectedRoleId === "cashier" ? "cashier" : undefined,
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
      <DialogContent className="max-w-md p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-emerald-600" />
            <span>Tambah Akun Staf / Kasir Baru</span>
          </DialogTitle>
          <DialogDescription>
            Buatkan akun login untuk staf tokomu dan pilih role akses wewenang
            yang sesuai.
          </DialogDescription>
        </DialogHeader>

        {formError && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-600 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <FormGroup>
            <FormLabel htmlFor="cashier-name" required>
              Nama Lengkap Staf
            </FormLabel>
            <Input
              id="cashier-name"
              placeholder="Contoh: Siti Rahma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="cashier-email" required>
              Email Login Staf
            </FormLabel>
            <Input
              id="cashier-email"
              type="email"
              placeholder="siti.kasir@tokokamu.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <FormHelperText>
              Email ini digunakan staf untuk login ke sistem POS toko.
            </FormHelperText>
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="cashier-password" required>
              Password Login
            </FormLabel>
            <Input
              id="cashier-password"
              type="password"
              placeholder="Minimal 6 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="role-select" required>
              Role & Hak Akses (Wewenang)
            </FormLabel>
            <select
              id="role-select"
              value={selectedRoleId}
              onChange={(e) => setSelectedRoleId(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="cashier">
                Kasir Standar (POS & Transaksi Saja)
              </option>
              {roles
                .filter(
                  (r) =>
                    !r.isSystem && r.code !== "owner" && r.code !== "cashier",
                )
                .map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.permissions.length} Izin Kustom)
                  </option>
                ))}
            </select>
            <FormHelperText>
              Kamu bisa membuat role baru di menu{" "}
              <strong>Role & Hak Akses</strong>.
            </FormHelperText>
          </FormGroup>

          <DialogFooter>
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
                  <span>Buat Akun Staf</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
