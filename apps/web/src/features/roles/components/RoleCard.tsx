"use client";

import { Edit2, Trash2, Users } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import type { Role } from "../types/role.types";

interface RoleCardProps {
  role: Role;
  onDelete: (role: Role) => void;
  isDeleting?: boolean;
}

export function RoleCard({
  role,
  onDelete,
  isDeleting = false,
}: RoleCardProps) {
  return (
    <Card
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
              <Link href={`/settings/roles/${role.id}/edit`}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg cursor-pointer"
                  title="Edit Role & Izin"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                disabled={isDeleting}
                onClick={() => onDelete(role)}
                className="h-8 w-8 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
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
}
