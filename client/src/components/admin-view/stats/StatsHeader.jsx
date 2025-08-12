import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Button } from "@/components/ui/button";
import { Calendar, Download } from "lucide-react";
import axios from "axios";
import { saveAs } from "file-saver";

export const STATUS_INFO = {
  inShipping: {
    label: "Kargoda",
    color: "#0088FE",
  },
  inProcess: {
    label: "Hazırlanıyor",
    color: "#00C49F",
  },
  delivered: {
    label: "Teslim Edildi",
    color: "#FFBB28",
  },
  cancelled: {
    label: "İptal",
    color: "#FF8042",
  },
  rejected: {
    label: "Reddedildi",
    color: "#A28CF6",
  },
  failed: {
    label: "Başarısız",
    color: "#FF6699",
  },
  pending_payment: {
    label: "Ödeme Bekliyor",
    color: "#9CA3AF",
  },
  pending: {
    label: "Beklemede",
    color: "#6366F1",
  },
  confirmed: {
    label: "Onaylandı",
    color: "#34D399",
  },
  shipped: {
    label: "Kargolandı",
    color: "#3B82F6",
  },
  refunded: {
    label: "İade",
    color: "#F43F5E",
  },
};

const StatsHeader = ({ 
  period, 
  setPeriod, 
  dateRange, 
  setDateRange, 
  showPicker, 
  setShowPicker,
  dataType,
  setDataType 
}) => {
  const handleExport = async () => {
    try {
      const body = {
        dataType,
        startDate: dateRange.from ? dateRange.from.toISOString() : null,
        endDate: dateRange.to ? dateRange.to.toISOString() : null,
      };

      const response = await axios.post(
        "/api/admin/stats/export",
        body,
        {
          responseType: "blob",
          withCredentials: true,
        }
      );

      const blob = new Blob([response.data], {
        type: "text/csv;charset=utf-8;",
      });
      saveAs(blob, `${dataType}-report.csv`);
    } catch (err) {
      console.error("CSV indirme hatası", err);
    }
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-4 flex-wrap">
        <h1 className="text-2xl font-semibold">İstatistikler</h1>

        {/* Tarih Aralığı Picker */}
        <div className="relative">
          <button
            onClick={() => setShowPicker((p) => !p)}
            className="border rounded-md px-3 py-1.5 text-sm bg-white"
            aria-label="Tarih Aralığı Seç"
          >
            {dateRange.from && dateRange.to
              ? `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`
              : "Tarih Aralığı Seç"}
          </button>
          {showPicker && (
            <div className="absolute z-50 mt-2 bg-white border shadow-lg">
              <DayPicker
                mode="range"
                selected={dateRange}
                onSelect={(range) => {
                  setDateRange(range);
                }}
              />
              <div className="flex justify-end p-2 border-t">
                <button
                  className="text-sm text-primary px-3 py-1"
                  onClick={() => setShowPicker(false)}
                  aria-label="Tarih Aralığı Kapat"
                >
                  Kapat
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Ya tarih yoksa periyod seçici */}
        {!dateRange.from && (
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="border rounded-md p-2 text-sm"
          >
            <option value="all">Tüm Zamanlar</option>
            <option value="daily">Son 24 Saat</option>
            <option value="weekly">Son 7 Gün</option>
            <option value="monthly">Son 30 Gün</option>
          </select>
        )}
      </div>

      {/* Rapor İndir */}
      <div className="flex items-center gap-2">
        <select
          value={dataType}
          onChange={(e) => setDataType(e.target.value)}
          className="border rounded-md p-2 text-sm"
        >
          <option value="orders">Siparişler</option>
          <option value="products">Ürünler</option>
        </select>
        <Button onClick={handleExport} variant="outline" size="sm" aria-label="Raporu İndir">
          <Download className="w-4 h-4 mr-2" />
          Raporu İndir
        </Button>
      </div>
    </div>
  );
};

export default StatsHeader;
