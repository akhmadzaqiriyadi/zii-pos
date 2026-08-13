import {
  ArrowRight,
  Package,
  Settings,
  ShoppingBag,
  Store,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";

export default function RootHomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 px-4 text-white font-sans">
      <div className="max-w-2xl text-center space-y-6">
        <Badge
          variant="emerald"
          className="px-4 py-1.5 text-sm bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
        >
          <Store className="mr-2 h-4 w-4" /> ZII POS Enterprise Architecture
        </Badge>

        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Sistem Kasir <span className="text-emerald-400">White-Label</span>{" "}
          Modern
        </h1>

        <p className="text-slate-400 text-base leading-relaxed">
          Dibangun dengan arsitektur **Feature-Driven Monorepo (Bun + Next.js 16
          + Express TS + Prisma + Custom Radix UI)**.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 pt-4">
          <Link href="/pos">
            <Button
              variant="primary"
              className="w-full justify-between h-14 px-6 text-sm"
            >
              <span className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" /> Layar Kasir POS
              </span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>

          <Link href="/products">
            <Button
              variant="outline"
              className="w-full justify-between h-14 px-6 text-sm bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700"
            >
              <span className="flex items-center gap-2">
                <Package className="h-5 w-5" /> Katalog Produk
              </span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>

          <Link href="/settings">
            <Button
              variant="outline"
              className="w-full justify-between h-14 px-6 text-sm bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700"
            >
              <span className="flex items-center gap-2">
                <Settings className="h-5 w-5" /> Pengaturan Struk
              </span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
