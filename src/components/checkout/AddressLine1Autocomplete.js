"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useOverlayChrome } from "@/hooks/useOverlayChrome";
import * as overlayChrome from "@/lib/overlayChrome";

const MIN_QUERY_LENGTH = 3;
const DROPDOWN_Z_INDEX = 260;

/**
 * Address line 1 with debounced `/api/address/autocomplete` suggestions (checkout parity).
 *
 * @param {object} props
 * @param {string} props.value
 * @param {(next: string) => void} props.onChange
 * @param {string} props.country
 * @param {(suggestion: { id: string, label: string, address1?: string, city?: string, state?: string, postalCode?: string, country?: string }) => void} props.onSelectSuggestion
 * @param {boolean} [props.pauseSuggestions] When true, hide suggestions (address already selected).
 */
export default function AddressLine1Autocomplete({
  className,
  label = "Address line 1",
  value,
  onChange,
  country,
  onSelectSuggestion,
  inputClassName,
  required,
  onBlur,
  pauseSuggestions = false,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedBy,
  errorMessage,
  errorId,
  ...divProps
}) {
  const { light } = useOverlayChrome();
  const inputRef = useRef(null);
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [addressSuggestLoading, setAddressSuggestLoading] = useState(false);
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
  const [dropdownRect, setDropdownRect] = useState(null);
  const [mounted, setMounted] = useState(false);

  const query = String(value || "").trim();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (pauseSuggestions) {
      setAddressSuggestions([]);
      setAddressSuggestLoading(false);
      return;
    }

    if (query.length < MIN_QUERY_LENGTH && !/^\d+$/.test(query)) {
      setAddressSuggestions([]);
      setAddressSuggestLoading(false);
      return;
    }

    let active = true;
    setAddressSuggestLoading(true);
    const timerId = window.setTimeout(async () => {
      try {
        const params = new URLSearchParams({
          q: query,
          country,
        });
        const response = await fetch(
          `/api/address/autocomplete?${params.toString()}`,
          { cache: "no-store" },
        );
        const data = await response.json().catch(() => ({}));
        if (!active) return;
        const next = Array.isArray(data?.suggestions) ? data.suggestions : [];
        setAddressSuggestions(next);
      } catch {
        if (!active) return;
        setAddressSuggestions([]);
      } finally {
        if (!active) return;
        setAddressSuggestLoading(false);
      }
    }, 250);

    return () => {
      active = false;
      window.clearTimeout(timerId);
    };
  }, [query, country, pauseSuggestions]);

  useLayoutEffect(() => {
    if (!showAddressSuggestions) {
      setDropdownRect(null);
      return;
    }

    function syncDropdownRect() {
      const input = inputRef.current;
      if (!input) return;
      const rect = input.getBoundingClientRect();
      setDropdownRect({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      });
    }

    syncDropdownRect();
    window.addEventListener("resize", syncDropdownRect);
    window.addEventListener("scroll", syncDropdownRect, true);
    return () => {
      window.removeEventListener("resize", syncDropdownRect);
      window.removeEventListener("scroll", syncDropdownRect, true);
    };
  }, [showAddressSuggestions, query, addressSuggestions.length, addressSuggestLoading]);

  function handlePick(item) {
    onSelectSuggestion(item);
    setShowAddressSuggestions(false);
  }

  function handleInputBlur(e) {
    window.setTimeout(() => setShowAddressSuggestions(false), 150);
    onBlur?.(e);
  }

  const isHouseNumberQuery = /^\d+$/.test(query);
  const shouldSearch = query.length >= MIN_QUERY_LENGTH || isHouseNumberQuery;

  const showDropdown =
    !pauseSuggestions &&
    showAddressSuggestions &&
    dropdownRect &&
    (shouldSearch || query.length > 0);

  const dropdownContent =
    !shouldSearch ? (
      <p className={overlayChrome.addressSuggestMuted(light)}>
        Keep typing. Enter your house number or street address.
      </p>
    ) : addressSuggestLoading ? (
      <p className={overlayChrome.addressSuggestMuted(light)}>
        {isHouseNumberQuery && query.length < MIN_QUERY_LENGTH
          ? "Searching common street names for this house number…"
          : "Searching addresses…"}
      </p>
    ) : addressSuggestions.length === 0 ? (
      <p className={overlayChrome.addressSuggestEmpty(light)}>
        No matches yet. Keep typing to search for your street address.
      </p>
    ) : (
      <ul className="max-h-64 overflow-y-auto">
        {addressSuggestions.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              className={overlayChrome.addressSuggestItem(light)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handlePick(item)}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    );

  const dropdown =
    mounted && showDropdown ? (
      <div
        role="listbox"
        aria-label="Address suggestions"
        style={{
          position: "fixed",
          top: dropdownRect.top,
          left: dropdownRect.left,
          width: dropdownRect.width,
          zIndex: DROPDOWN_Z_INDEX,
        }}
        className={overlayChrome.addressSuggestPanel(light)}
      >
        {dropdownContent}
      </div>
    ) : null;

  return (
    <div className={className} {...divProps}>
      <label className={overlayChrome.formFieldLabel(light)}>
        {label}
        <input
          ref={inputRef}
          required={required}
          type="text"
          autoComplete="address-line1"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setShowAddressSuggestions(true);
          }}
          onBlur={handleInputBlur}
          onFocus={() => setShowAddressSuggestions(true)}
          className={inputClassName}
          aria-invalid={ariaInvalid}
          aria-describedby={ariaDescribedBy}
          aria-expanded={Boolean(showDropdown)}
          aria-haspopup="listbox"
        />
      </label>
      {mounted && dropdown ? createPortal(dropdown, document.body) : null}
      {errorMessage ? (
        <p
          id={errorId}
          className={`mt-1.5 text-xs ${light ? "text-rose-700" : "text-rose-300"}`}
          role="alert"
        >
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
