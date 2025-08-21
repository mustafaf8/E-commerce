import { useId, useMemo, useState, useEffect } from "react";
import { Input } from "./input";
import { Label } from "./label";
import { Check, Eye, EyeOff, X } from "lucide-react";

export default function PasswordStrengthInput({
  value,
  onChange,
  onValidityChange,
  label = "Şifre",
  placeholder = "Şifre",
  id: propId,
}) {
  const id = propId || useId();
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible((prev) => !prev);

  const requirements = [
    { regex: /.{8,}/, text: "En az 8 karakter" },
    { regex: /[0-9]/, text: "En az 1 sayı" },
    { regex: /[a-z]/, text: "En az 1 küçük harf" },
    { regex: /[A-Z]/, text: "En az 1 büyük harf" },
  ];

  const strength = useMemo(() => {
    return requirements.map((req) => ({ met: req.regex.test(value || ""), text: req.text }));
  }, [value]);

  const strengthScore = useMemo(() => strength.filter((r) => r.met).length, [strength]);

  useEffect(() => {
    onValidityChange?.(strengthScore === 4);
  }, [strengthScore, onValidityChange]);

  const getStrengthColor = (score) => {
    if (score === 0) return "bg-border";
    if (score <= 1) return "bg-red-500";
    if (score <= 2) return "bg-orange-500";
    if (score === 3) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const getStrengthText = (score) => {
    if (score === 0) return "Şifre girin";
    if (score <= 2) return "Zayıf şifre";
    if (score === 3) return "Orta şifre";
    return "Güçlü şifre";
  };

  return (
    <div className="min-w-[300px]">
      <div className="space-y-2">
        <Label htmlFor={id}>{label}</Label>
        <div className="relative">
          <Input
            id={id}
            className="pe-9"
            placeholder={placeholder}
            type={isVisible ? "text" : "password"}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            aria-invalid={strengthScore < 4}
            aria-describedby={`${id}-description`}
            required
          />
          <button
            className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            type="button"
            onClick={toggleVisibility}
            aria-label={isVisible ? "Şifreyi gizle" : "Şifreyi göster"}
            aria-pressed={isVisible}
            aria-controls={id}
          >
            {isVisible ? (
              <EyeOff size={16} strokeWidth={2} aria-hidden="true" />
            ) : (
              <Eye size={16} strokeWidth={2} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      <div
        className="mb-4 mt-3 h-1 w-full overflow-hidden rounded-full bg-border"
        role="progressbar"
        aria-valuenow={strengthScore}
        aria-valuemin={0}
        aria-valuemax={4}
        aria-label="Şifre gücü"
      >
        <div
          className={`h-full ${getStrengthColor(strengthScore)} transition-all duration-500 ease-out`}
          style={{ width: `${(strengthScore / 4) * 100}%` }}
        ></div>
      </div>

      <p id={`${id}-description`} className="mb-2 text-sm font-medium text-foreground">
        {getStrengthText(strengthScore)}. 
      </p>

      <ul className="space-y-1.5" aria-label="Şifre gereksinimleri">
        {strength.map((req, index) => (
          <li key={index} className="flex items-center gap-2">
            {req.met ? (
              <Check size={16} className="text-emerald-500" aria-hidden="true" />
            ) : (
              <X size={16} className="text-muted-foreground/80" aria-hidden="true" />
            )}
            <span className={`text-xs ${req.met ? "text-emerald-600" : "text-muted-foreground"}`}>
              {req.text}
              <span className="sr-only">{req.met ? " - Şart sağlandı" : " - Şart sağlanmadı"}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
