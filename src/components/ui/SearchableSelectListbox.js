"use client";

import {
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { CheckIcon, MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { ChevronUpDownIcon } from "@heroicons/react/16/solid";
import { useEffect, useMemo, useRef, useState } from "react";
import * as overlayChrome from "@/lib/overlayChrome";

const DEFAULT_ANCHOR = {
  to: "bottom end",
  gap: 8,
  padding: 12,
};

/**
 * @param {string} query
 * @param {string} text
 */
function matchesQuery(query, text) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return text.toLowerCase().includes(q);
}

/**
 * @param {{
 *   open: boolean;
 *   label?: string;
 *   inlineLabel?: boolean;
 *   placeholder: string;
 *   searchPlaceholder: string;
 *   options: { value: string; label: string; disabled?: boolean }[];
 *   selected: { value: string; label: string } | null;
 *   light: boolean;
 *   disabled: boolean;
 *   className: string;
 *   buttonClassName: string;
 *   anchor: object | false;
 *   id?: string;
 * }} props
 */
function SearchableSelectListboxPanel({
  open,
  label,
  inlineLabel,
  placeholder,
  searchPlaceholder,
  options,
  selected,
  light,
  disabled,
  className,
  buttonClassName,
  anchor,
  id,
}) {
  const [query, setQuery] = useState("");
  const searchRef = useRef(null);
  const prevOpen = useRef(false);

  useEffect(() => {
    if (prevOpen.current && !open) setQuery("");
    prevOpen.current = open;
  }, [open]);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => searchRef.current?.focus());
    }
  }, [open]);

  const filtered = useMemo(
    () => options.filter((opt) => matchesQuery(query, opt.label)),
    [options, query],
  );

  const panelClass = light
    ? "z-50 flex max-h-64 min-w-[var(--button-width)] w-max max-w-[min(calc(100vw-1.5rem),28rem)] flex-col overflow-hidden rounded-xl border border-stone-300/80 bg-white text-sm text-slate-800 shadow-lg shadow-stone-400/20 ring-1 ring-stone-200/60 outline-none data-closed:opacity-0 data-leave:transition data-leave:duration-100 data-leave:ease-in"
    : "z-50 flex max-h-64 min-w-[var(--button-width)] w-max max-w-[min(calc(100vw-1.5rem),28rem)] flex-col overflow-hidden rounded-xl border border-slate-600/60 bg-slate-900 text-sm text-stone-100 shadow-lg outline-none data-closed:opacity-0 data-leave:transition data-leave:duration-100 data-leave:ease-in";

  const buttonBase = light
    ? "grid w-full min-w-[12rem] cursor-default grid-cols-1 rounded-xl border border-stone-300/80 bg-white py-2.5 pl-3 pr-10 text-left text-sm text-stone-900 outline-none ring-amber-400/0 transition focus:border-amber-500/50 focus:ring-2 focus:ring-amber-400/25 disabled:cursor-not-allowed disabled:opacity-60"
    : "grid w-full min-w-[12rem] cursor-default grid-cols-1 rounded-xl border border-slate-600/50 bg-slate-950/50 py-2.5 pl-3 pr-10 text-left text-sm text-stone-100 outline-none ring-amber-400/0 transition focus:border-amber-400/40 focus:ring-2 focus:ring-amber-400/25 disabled:cursor-not-allowed disabled:opacity-60";

  const searchInputClass = light
    ? "w-full border-0 bg-transparent py-2 pl-9 pr-3 text-sm text-stone-900 placeholder:text-stone-500 outline-none focus:ring-0"
    : "w-full border-0 bg-transparent py-2 pl-9 pr-3 text-sm text-stone-100 placeholder:text-slate-500 outline-none focus:ring-0";

  const searchWrapClass = light
    ? "shrink-0 border-b border-stone-200/80 bg-white"
    : "shrink-0 border-b border-slate-700/50 bg-slate-900";

  const labelClass = light
    ? "shrink-0 text-sm font-medium text-stone-700"
    : "shrink-0 text-sm font-medium text-slate-300";

  return (
    <div
      className={
        inlineLabel
          ? `flex flex-wrap items-center justify-end gap-3 ${className}`.trim()
          : className
      }
    >
      {label ? (
        <Label htmlFor={id} className={inlineLabel ? labelClass : `${labelClass} mb-2 block`}>
          {label}
        </Label>
      ) : null}

      <div className={inlineLabel ? "min-w-[12rem] flex-1 sm:flex-none sm:min-w-[16rem]" : "relative"}>
        <ListboxButton id={id} className={`${buttonBase} ${buttonClassName}`.trim()}>
          <span className="col-start-1 row-start-1 truncate">
            {selected?.label ?? placeholder}
          </span>
          <ChevronUpDownIcon
            aria-hidden="true"
            className={`col-start-1 row-start-1 size-5 justify-self-end ${overlayChrome.selectChevron(light)}`}
          />
        </ListboxButton>

        <ListboxOptions transition anchor={anchor} className={panelClass}>
          <div
            className={searchWrapClass}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <MagnifyingGlassIcon
                aria-hidden
                className={`pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 ${light ? "text-stone-400" : "text-slate-500"}`}
              />
              <input
                ref={searchRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()}
                placeholder={searchPlaceholder}
                className={searchInputClass}
                aria-label={searchPlaceholder}
              />
            </div>
          </div>

          <div className="max-h-48 overflow-y-auto overscroll-contain py-1">
            {filtered.length > 0 ? (
              filtered.map((opt) => (
                <ListboxOption
                  key={opt.value}
                  value={opt}
                  disabled={Boolean(opt.disabled)}
                  className={overlayChrome.listboxOption(light)}
                >
                  <span className="block truncate font-normal group-data-selected:font-semibold">
                    {opt.label}
                  </span>
                  <span className={overlayChrome.listboxCheckIcon(light)}>
                    <CheckIcon aria-hidden="true" className="size-5 shrink-0" />
                  </span>
                </ListboxOption>
              ))
            ) : (
              <p
                className={`px-4 py-3 text-sm ${light ? "text-stone-500" : "text-slate-400"}`}
                role="status"
              >
                No matches
              </p>
            )}
          </div>
        </ListboxOptions>
      </div>
    </div>
  );
}

/**
 * Styled listbox with in-panel search and Floating UI anchoring (flips when needed).
 *
 * @param {{
 *   label?: string;
 *   inlineLabel?: boolean;
 *   placeholder?: string;
 *   searchPlaceholder?: string;
 *   options: { value: string; label: string; disabled?: boolean }[];
 *   value: string;
 *   onChange: (value: string) => void;
 *   light?: boolean;
 *   disabled?: boolean;
 *   className?: string;
 *   buttonClassName?: string;
 *   anchor?: object | false;
 *   id?: string;
 * }} props
 */
export default function SearchableSelectListbox({
  label,
  inlineLabel = false,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  options,
  value,
  onChange,
  light = true,
  disabled = false,
  className = "",
  buttonClassName = "",
  anchor,
  id,
}) {
  const selected = useMemo(() => {
    const v = String(value ?? "").trim();
    return options.find((o) => o.value === v) ?? null;
  }, [options, value]);

  const resolvedAnchor =
    anchor === false ? false : { ...DEFAULT_ANCHOR, ...(anchor ?? {}) };

  return (
    <Listbox
      value={selected}
      onChange={(opt) => onChange(opt?.value ?? "")}
      disabled={disabled}
      by="value"
    >
      {({ open }) => (
        <SearchableSelectListboxPanel
          open={open}
          label={label}
          inlineLabel={inlineLabel}
          placeholder={placeholder}
          searchPlaceholder={searchPlaceholder}
          options={options}
          selected={selected}
          light={light}
          disabled={disabled}
          className={className}
          buttonClassName={buttonClassName}
          anchor={resolvedAnchor}
          id={id}
        />
      )}
    </Listbox>
  );
}
