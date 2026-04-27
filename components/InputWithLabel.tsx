import React, { forwardRef } from "react";

type Props = {
  label?: string;
  value: string;
  type?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  colSpan?: string;
  onEnterNext?: () => void;
  disabled?: boolean;
};

export const InputWithLabel = forwardRef<HTMLInputElement, Props>(
  ({ label, value, onChange, type = "text", className = "", colSpan = "", onEnterNext, disabled = false }, ref) => (
    <div className={`flex flex-col mb-2 ${colSpan}`}>
      {label && <label className="mb-1 font-medium text-sm">{label}</label>}
      <input
        ref={ref}
        type={type}
        value={value}
        onChange={(e) => {
          if (!onChange) return;
          const raw = e.target.value;
          const next =
            type === "number" ? raw.replace(/,/g, ".") : raw;
          if (next === raw) {
            onChange(e);
            return;
          }
          const synthetic = {
            ...e,
            target: { ...e.target, value: next },
            currentTarget: { ...e.currentTarget, value: next },
          } as React.ChangeEvent<HTMLInputElement>;
          onChange(synthetic);
        }}
        disabled={disabled}
        className={`border rounded px-2 py-1 ${className}`}
        onKeyDown={e => {
          if (e.key === "Enter" && onEnterNext) {
            e.preventDefault();
            onEnterNext();
          }
        }}
      />
    </div>
  )
);

InputWithLabel.displayName = 'InputWithLabel'; 