"use client";

import {
  AlertCircle,
  CheckCircle2,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  Plus,
  Shield,
  Trash2,
  User,
  UserPlus,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { useRoles } from "../../roles/hooks/useRoles";
import { useCashiers } from "../hooks/useCashiers";

export function CashierManagement() {
  const {
    cashiersData,
    isLoading,
    createCashier,
    isCreating,
    deleteCashier,
    isDeleting,
  } = useCashiers();

  const { roles, isLoadingRoles } = useRoles();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState<string>("cashier");
  const [formError, setFormError] = useState("");

  const currentCount = cashiersData?.currentCount || 0;
  const maxCashiers = cashiersData?.maxCashiers || 1;
  const planName = cashiersData?.planName || "Paket Merchant";
  const isQuotaExceeded = currentCount >= maxCashiers;

  const handleOpenModal = () => {
    setName("");
    setEmail("");
    setPassword("");
    setSelectedRoleId("cashier");
    setFormError("");
    setIsModalOpen(true);
  };

  const handleCreateCashier = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!name.trim() || !email.trim() || !password.trim()) {
      setFormError("Nama, email, dan password kasir wajib diisi.");
      return;
    }

    if (password.length < 6) {
      setFormError("Password kasir minimal 6 karakter.");
      return;
    }

    try {
      await createCashier({
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
        roleId: selectedRoleId !== "cashier" ? selectedRoleId : undefined,
        role: selectedRoleId === "cashier" ? "cashier" : undefined,
      });
      setIsModalOpen(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFormError(err.message);
      }
    }
  };

  const handleDelete = async (id: string, userName: string) => {
    if (
      confirm(`Apakah Anda yakin ingin menghapus akun kasir "${userName}"?`)
    ) {
      await deleteCashier(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Quota & Plan Summary Card */}
      <Card className="rounded-2xl border border-slate-200 bg-linear-to-r from-emerald-50/50 via-white to-slate-50 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge
                variant="emerald"
                className="font-bold uppercase text-[11px]"
              >
                {planName}
              </Badge>
              <span className="text-xs font-semibold text-slate-500">
                Fitur Multi-Kasir Toko
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">
              {currentCount} dari {maxCashiers} Akun Kasir Aktif
            </h3>
            <p className="text-xs text-slate-500">
              Setiap kasir memiliki akun login dan hak akses kustom tersendiri
              untuk mencatat transaksi dan cetak nota dengan nama kasir yang
              bertugas.
            </p>
          </div>

          <Button
            onClick={handleOpenModal}
            disabled={isQuotaExceeded}
            className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-5 px-5 rounded-xl cursor-pointer shrink-0"
          >
            <UserPlus className="h-4 w-4" />
            <span>Tambah Staf / Kasir</span>
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 pt-4 border-t border-slate-200/60">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1.5">
            <span>Kapasitas Kasir Terpakai:</span>
            <span>
              {Math.min(100, Math.round((currentCount / maxCashiers) * 100))}%
            </span>
          </div>
          <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                isQuotaExceeded ? "bg-amber-500" : "bg-emerald-600"
              }`}
              style={{
                width: `${Math.min(100, (currentCount / maxCashiers) * 100)}%`,
              }}
            />
          </div>
          {isQuotaExceeded && (
            <p className="text-xs text-amber-700 font-semibold mt-2 flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5" />
              Kuota kasir paket Anda sudah penuh. Lakukan upgrade paket untuk
              menambah kasir lainnya.
            </p>
          )}
        </div>
      </Card>

      {/* Cashiers Table */}
      <Card className="rounded-2xl border border-slate-200 p-6">
        <CardHeader className="px-0 pt-0 mb-4 border-b border-slate-100 pb-4 flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-slate-900 text-lg">
            <Users className="h-5 w-5 text-emerald-600" />
            <span>Daftar Pengguna & Kasir Toko</span>
          </CardTitle>
          <span className="text-xs font-semibold text-slate-400">
            {cashiersData?.users?.length || 0} Pengguna Terdaftar
          </span>
        </CardHeader>

        <CardContent className="px-0 pt-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12 text-slate-500 gap-2 text-sm">
              <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
              <span>Memuat daftar kasir...</span>
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/80">
                    <TableHead>Nama Pengguna</TableHead>
                    <TableHead>Email Login</TableHead>
                    <TableHead>Role & Wewenang</TableHead>
                    <TableHead>Terdaftar Sejak</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cashiersData?.users?.map((u) => {
                    const isOwner = u.role === "owner";
                    const isSuperadmin = u.role === "superadmin";
                    const customRoleName = u.customRole?.name;

                    return (
                      <TableRow key={u.id}>
                        <TableCell className="font-bold text-slate-900 flex items-center gap-2">
                          <div className="h-8 w-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-extrabold text-xs">
                            {u.name.substring(0, 2).toUpperCase()}
                          </div>
                          <span>{u.name}</span>
                        </TableCell>
                        <TableCell className="text-slate-600 font-medium text-xs">
                          {u.email}
                        </TableCell>
                        <TableCell>
                          {isSuperadmin ? (
                            <Badge
                              variant="purple"
                              className="text-[10px] font-extrabold uppercase bg-purple-100 text-purple-800"
                            >
                              Super Admin
                            </Badge>
                          ) : isOwner ? (
                            <Badge
                              variant="emerald"
                              className="text-[10px] font-extrabold uppercase"
                            >
                              Owner (Pemilik Toko)
                            </Badge>
                          ) : customRoleName ? (
                            <Badge
                              variant="blue"
                              className="text-[10px] font-extrabold uppercase bg-blue-100 text-blue-800 border-blue-200"
                            >
                              {customRoleName}
                            </Badge>
                          ) : (
                            <Badge
                              variant="slate"
                              className="text-[10px] font-extrabold uppercase bg-slate-100 text-slate-700"
                            >
                              Kasir Standar
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-slate-500">
                          {new Intl.DateTimeFormat("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }).format(new Date(u.createdAt))}
                        </TableCell>
                        <TableCell className="text-right">
                          {!isOwner && !isSuperadmin && (
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={isDeleting}
                              onClick={() => handleDelete(u.id, u.name)}
                              className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                              title="Hapus Kasir"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal Tambah Kasir Baru */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-emerald-600" />
              <span>Tambah Akun Staf / Kasir Baru</span>
            </DialogTitle>
            <p className="text-xs text-slate-500">
              Buatkan akun login untuk staf tokomu dan pilih role akses wewenang
              yang sesuai.
            </p>
          </DialogHeader>

          {formError && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-600 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleCreateCashier} className="space-y-4">
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

            <div className="pt-2 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                disabled={isCreating}
                className="rounded-xl"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isCreating}
                className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
              >
                {isCreating ? (
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
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
