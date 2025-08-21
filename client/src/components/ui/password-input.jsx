import { useState } from "react";
import { Input } from "./input";
import { Button } from "./button";
import { Eye, EyeOff } from "lucide-react";

function PasswordInput({
  name,
  placeholder,
  id,
  value,
  onChange,
  maxLength,
  pattern,
  title,
  required,
  className,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative">
      <Input
        name={name}
        placeholder={placeholder}
        id={id}
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        pattern={pattern}
        title={title}
        required={required}
        className={className}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
        onClick={togglePasswordVisibility}
        aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4 text-gray-500" />
        ) : (
          <Eye className="h-4 w-4 text-gray-500" />
        )}
      </Button>
    </div>
  );
}

export { PasswordInput };
