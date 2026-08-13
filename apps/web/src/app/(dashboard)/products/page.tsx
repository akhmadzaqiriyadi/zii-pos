"use client";

import { PackagePlus, Plus, Search } from "lucide-react";
import { useState } from "react";

import { Navbar } from "../../../components/layout/navbar";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { formatRupiah } from "../../../lib/utils";

export default function ProductsPage() {
  const [search, setSearch] = useState("");

  const products = [
    {
      id: "p1",
      name: "Kaos Polos Cotton 30s",
      price: 65000,
      stock: 45,
      isService: false,
    },
    {
      id: "p2",
      name: "Kemeja Flanel Premium",
      price: 145000,
      stock: 20,
      isService: false,
    },
    {
      id: "p3",
      name: "Jasa Potong & Styling",
      price: 40000,
      stock: 999,
      isService: true,
    },
    {
      id: "p4",
      name: "Parfum Sepatu Premium 100ml",
      price: 35000,
      stock: 15,
      isService: false,
    },
  ];

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex flex-col min-h-screen bg-slate-100 font-sans">
      <Navbar merchantName="ZII Distro & Laundry Studio" cashierName="Zaqi" />
      <main className="p-8 max-w-6xl w-full mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              Manajemen Produk & Jasa
            </h1>
            <p className="text-sm text-slate-500">
              Kelola katalog barang, jasa, stok, dan harga toko kamu.
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            <span>Tambah Produk Baru</span>
          </Button>
        </div>

        <Card className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="relative w-72">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Cari nama produk..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {filtered.length} Produk Ditemukan
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Nama Produk</th>
                  <th className="px-4 py-3">Tipe</th>
                  <th className="px-4 py-3">Harga</th>
                  <th className="px-4 py-3">Stok</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-semibold text-slate-800">
                      {item.name}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={item.isService ? "amber" : "blue"}>
                        {item.isService ? "JASA" : "RETAIL"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 font-bold">
                      {formatRupiah(item.price)}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {item.isService ? "-" : item.stock}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm" className="text-xs">
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  );
}
