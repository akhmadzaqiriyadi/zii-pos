import { Users } from "lucide-react";
import React from "react";
import { Badge } from "../../../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import type { MerchantTenantDetail } from "../services/saasAdminApi";

interface TenantDetailUsersTableProps {
  detail: MerchantTenantDetail;
}

export function TenantDetailUsersTable({
  detail,
}: TenantDetailUsersTableProps) {
  return (
    <section
      aria-label="Pengguna Toko"
      className="rounded-2xl border border-slate-200/80 bg-white p-6 space-y-4 shadow-xs"
    >
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
        <Users className="h-4 w-4 text-blue-600" />
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-800">
          Daftar Akun Pengguna & Kasir ({detail.users.length})
        </h2>
      </div>

      <div className="rounded-xl border border-slate-200/80 overflow-hidden bg-white">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="text-xs font-bold text-slate-700">
                Nama Lengkap
              </TableHead>
              <TableHead className="text-xs font-bold text-slate-700">
                Email Login
              </TableHead>
              <TableHead className="text-xs font-bold text-slate-700">
                Peran / Role
              </TableHead>
              <TableHead className="text-xs font-bold text-slate-700 text-right">
                Tanggal Dibuat
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {detail.users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="py-8 text-center text-xs text-slate-400 italic"
                >
                  Belum ada akun pengguna tercatat.
                </TableCell>
              </TableRow>
            ) : (
              detail.users.map((user) => (
                <TableRow key={user.id} className="border-b border-slate-100">
                  <TableCell className="font-extrabold text-xs text-slate-900 py-3">
                    {user.name}
                  </TableCell>
                  <TableCell className="text-xs text-slate-600 font-mono">
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.role === "owner"
                          ? "emerald"
                          : user.role === "superadmin"
                            ? "purple"
                            : "blue"
                      }
                      className="text-[10px] uppercase font-bold"
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-slate-500 font-medium text-right">
                    {new Date(user.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
