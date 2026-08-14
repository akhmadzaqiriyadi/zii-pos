import { LogOut, Store } from "lucide-react";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { Badge } from "../ui/badge";

interface NavbarProps {
  merchantName: string;
  cashierName: string;
}

export function Navbar({ merchantName, cashierName }: NavbarProps) {
  const { logout } = useAuth();

  return (
    <header className="flex items-center justify-between bg-white px-6 py-4 shadow-xs border-b border-slate-200">
      <div className="flex items-center space-x-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 font-bold text-white shadow-md">
          ZII
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-800">{merchantName}</h1>
          <p className="text-xs text-slate-500">
            ZII POS White-Label • Enterprise Modular
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <Badge variant="emerald" className="gap-1.5 py-1 text-xs">
          <Store className="h-3.5 w-3.5" />
          <span>Kasir: {cashierName}</span>
        </Badge>
        <button
          onClick={logout}
          className="flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-red-600 transition cursor-pointer"
          type="button"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Keluar</span>
        </button>
      </div>
    </header>
  );
}
