"use client";

import { Loader2, LogOut } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmLogout: () => void;
}

export function LogoutConfirmModal({
  isOpen,
  onOpenChange,
  onConfirmLogout,
}: LogoutConfirmModalProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setIsLoggingOut(true);
    onConfirmLogout();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6 rounded-2xl bg-white border border-slate-200 shadow-xl">
        <DialogHeader className="space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
            <LogOut className="h-6 w-6" />
          </div>
          <DialogTitle className="text-center text-lg font-extrabold text-slate-900">
            Konfirmasi Keluar Akun
          </DialogTitle>
          <DialogDescription className="text-center text-xs text-slate-500 leading-relaxed">
            Apakah Anda yakin ingin keluar dari sesi POS toko saat ini? Anda
            harus login kembali untuk mengakses mesin kasir dan laporan toko.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4 pt-2">
          <Button
            type="button"
            variant="outline"
            disabled={isLoggingOut}
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-1/2 rounded-xl text-xs font-bold text-slate-700 border-slate-200 hover:bg-slate-100 cursor-pointer"
          >
            Batal
          </Button>
          <Button
            type="button"
            disabled={isLoggingOut}
            onClick={handleLogout}
            className="w-full sm:w-1/2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs cursor-pointer gap-1.5"
          >
            {isLoggingOut ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Mengeluarkan...</span>
              </>
            ) : (
              <span>Ya, Keluar Akun</span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
