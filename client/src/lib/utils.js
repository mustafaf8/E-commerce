import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Format price for display: thousands separated by dot, with 2 decimal places for shopping view.
export function formatPrice(value) {
  if (value === null || value === undefined || isNaN(value)) return "";
  return new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

// --- Admin Yetki Yardımcı Fonksiyonları ---
export function hasViewPermission(user, moduleId) {
  if (!user) return false;
  if (user.adminAccessLevel === 1 || user.adminAccessLevel === undefined) return true;
  return !!user.adminModulePermissions?.[moduleId]?.view;
}

export function hasManagePermission(user, moduleId) {
  if (!user) return false;
  if (user.adminAccessLevel === 1 || user.adminAccessLevel === undefined) return true;
  return !!user.adminModulePermissions?.[moduleId]?.manage;
}
