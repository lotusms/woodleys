"use client";

import { CheckIcon } from "@heroicons/react/16/solid";
import { useId } from "react";
import * as checkboxChrome from "@/lib/checkboxChrome";

/**
 * Accessible custom checkbox — hidden native input + styled control.
 *
 * @param {{
 *   checked: boolean;
 *   onChange: (checked: boolean) => void;
 *   label?: import("react").ReactNode;
 *   description?: import("react").ReactNode;
 *   disabled?: boolean;
 *   id?: string;
 *   name?: string;
 *   value?: string;
 *   light?: boolean;
 *   variant?: "default" | "card";
 *   className?: string;
 *   "aria-label"?: string;
 * }} props
 */
export default function Checkbox({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  id,
  name,
  value,
  light = true,
  variant = "default",
  className = "",
  "aria-label": ariaLabel,
}) {
  const fallbackId = useId();
  const inputId = id ?? `checkbox-${fallbackId}`;

  const control = (
    <>
      <span className="relative mt-0.5 flex shrink-0">
        <input
          id={inputId}
          type="checkbox"
          name={name}
          value={value}
          checked={checked}
          disabled={disabled}
          aria-label={ariaLabel}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <span
          aria-hidden="true"
          className={checkboxChrome.checkboxBox(light, checked, disabled)}
        >
          <CheckIcon
            className={`size-3.5 stroke-[2.5] transition-opacity duration-150 ${
              checked ? "opacity-100" : "opacity-0"
            }`}
          />
        </span>
      </span>

      {label || description ? (
        <span className="min-w-0 flex-1 pt-px">
          {label ? (
            <span className={checkboxChrome.checkboxLabel(light)}>{label}</span>
          ) : null}
          {description ? (
            <span className={checkboxChrome.checkboxDescription(light)}>{description}</span>
          ) : null}
        </span>
      ) : null}
    </>
  );

  if (variant === "card") {
    return (
      <label
        htmlFor={inputId}
        className={`${checkboxChrome.checkboxCard(light, checked, disabled)} ${className}`.trim()}
      >
        {control}
      </label>
    );
  }

  return (
    <label
      htmlFor={inputId}
      className={`${checkboxChrome.checkboxRow(light, disabled)} ${className}`.trim()}
    >
      {control}
    </label>
  );
}
