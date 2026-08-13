import { Store } from "lucide-react";
import { Badge } from "../ui/badge";

interface NavbarProps {
  merchantName: string;
  cashierName: string;
}

export function Navbar({ merchantName, cashierName }: NavbarProps) {
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
      <Badge variant="emerald" className="gap-1.5 py-1 text-xs">
        <Store className="h-3.5 w-3.5" />
        <span>Kasir: {cashierName}</span>
      </Badge>
    </header>
  );
}
