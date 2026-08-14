"use client";

interface ProductTypeSelectorProps {
  isService: boolean;
  onSelectType: (isService: boolean) => void;
}

export function ProductTypeSelector({
  isService,
  onSelectType,
}: ProductTypeSelectorProps) {
  return (
    <fieldset className="border-0 p-0 m-0 space-y-1.5">
      <legend className="text-xs font-semibold text-slate-700 mb-1.5 block">
        Tipe Katalog
      </legend>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onSelectType(false)}
          className={`py-2 px-3 rounded-xl border text-xs font-bold transition cursor-pointer ${
            !isService
              ? "border-blue-500 bg-blue-50 text-blue-700 shadow-xs"
              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          }`}
        >
          📦 Barang Retail
        </button>
        <button
          type="button"
          onClick={() => onSelectType(true)}
          className={`py-2 px-3 rounded-xl border text-xs font-bold transition cursor-pointer ${
            isService
              ? "border-amber-500 bg-amber-50 text-amber-700 shadow-xs"
              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          }`}
        >
          ✂️ Jasa / Service
        </button>
      </div>
    </fieldset>
  );
}
