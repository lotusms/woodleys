"use client";

import { useState } from "react";
import { orgEmail, orgPhone } from "@/config";

const visitTypes = [
  "Engagement & wedding consultation",
  "Custom design consultation",
  "Jewelry repair drop-off",
  "Watch service",
  "Appraisal",
  "General visit",
];

const timePreferences = [
  "Morning",
  "Afternoon",
  "No preference",
];

export default function AppointmentForm() {
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  function validate(formData) {
    /** @type {Record<string, string>} */
    const next = {};
    if (!formData.get("name")?.toString().trim()) next.name = "Please enter your name.";
    if (!formData.get("email")?.toString().trim()) next.email = "Please enter your email.";
    if (!formData.get("phone")?.toString().trim()) next.phone = "Please enter your phone number.";
    if (!formData.get("visitType")?.toString()) next.visitType = "Please select a visit type.";
    return next;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const nextErrors = validate(formData);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const name = formData.get("name");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const visitType = formData.get("visitType");
    const preferredTime = formData.get("preferredTime");
    const message = formData.get("message");

    const subject = encodeURIComponent(`Appointment request — ${visitType}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nVisit type: ${visitType}\nPreferred time: ${preferredTime}\n\nNotes:\n${message || "(none)"}`,
    );

    window.location.href = `mailto:${orgEmail}?subject=${subject}&body=${body}`;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div
        className="rounded-sm border border-stone-200/80 bg-white p-8"
        role="status"
      >
        <h2 className="font-serif text-2xl text-site-fg">Thank you</h2>
        <p className="mt-3 leading-relaxed text-site-secondary">
          Your email client should open with your appointment details. If it
          does not, please call us at{" "}
          <a href={`tel:${orgPhone.replace(/\D/g, "")}`} className="text-warm-gold-dark">
            {orgPhone}
          </a>{" "}
          or email{" "}
          <a href={`mailto:${orgEmail}`} className="text-warm-gold-dark">
            {orgEmail}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-sm border border-stone-200/80 bg-white p-6 sm:p-8"
      aria-labelledby="appointment-form-title"
    >
      <h2 id="appointment-form-title" className="sr-only">
        Appointment request form
      </h2>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-site-fg">
            Full name <span className="text-warm-gold-dark">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            className="mt-2 w-full rounded-sm border border-stone-300 bg-ivory px-4 py-3 text-site-fg focus:border-warm-gold focus:outline-none focus:ring-2 focus:ring-warm-gold/20"
          />
          {errors.name ? (
            <p id="name-error" className="mt-1 text-sm text-red-700" role="alert">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-site-fg">
            Email <span className="text-warm-gold-dark">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className="mt-2 w-full rounded-sm border border-stone-300 bg-ivory px-4 py-3 text-site-fg focus:border-warm-gold focus:outline-none focus:ring-2 focus:ring-warm-gold/20"
          />
          {errors.email ? (
            <p id="email-error" className="mt-1 text-sm text-red-700" role="alert">
              {errors.email}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-site-fg">
            Phone <span className="text-warm-gold-dark">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            className="mt-2 w-full rounded-sm border border-stone-300 bg-ivory px-4 py-3 text-site-fg focus:border-warm-gold focus:outline-none focus:ring-2 focus:ring-warm-gold/20"
          />
          {errors.phone ? (
            <p id="phone-error" className="mt-1 text-sm text-red-700" role="alert">
              {errors.phone}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="visitType" className="block text-sm font-medium text-site-fg">
            Visit type <span className="text-warm-gold-dark">*</span>
          </label>
          <select
            id="visitType"
            name="visitType"
            defaultValue=""
            aria-invalid={Boolean(errors.visitType)}
            aria-describedby={errors.visitType ? "visitType-error" : undefined}
            className="mt-2 w-full rounded-sm border border-stone-300 bg-ivory px-4 py-3 text-site-fg focus:border-warm-gold focus:outline-none focus:ring-2 focus:ring-warm-gold/20"
          >
            <option value="" disabled>
              Select a visit type
            </option>
            {visitTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.visitType ? (
            <p id="visitType-error" className="mt-1 text-sm text-red-700" role="alert">
              {errors.visitType}
            </p>
          ) : null}
        </div>

        <div className="sm:col-span-2">
          <fieldset>
            <legend className="block text-sm font-medium text-site-fg">
              Preferred time of day
            </legend>
            <div className="mt-3 flex flex-wrap gap-4">
              {timePreferences.map((pref) => (
                <label key={pref} className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="preferredTime"
                    value={pref}
                    defaultChecked={pref === "No preference"}
                    className="h-4 w-4 border-stone-300 text-warm-gold focus:ring-warm-gold"
                  />
                  {pref}
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="message" className="block text-sm font-medium text-site-fg">
            Notes <span className="text-site-secondary">(optional)</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            className="mt-2 w-full rounded-sm border border-stone-300 bg-ivory px-4 py-3 text-site-fg focus:border-warm-gold focus:outline-none focus:ring-2 focus:ring-warm-gold/20"
            placeholder="Share any details that will help us prepare for your visit."
          />
        </div>
      </div>

      <button
        type="submit"
        className="mt-8 inline-flex rounded-full bg-warm-gold px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-warm-gold-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-warm-gold-dark"
      >
        Send appointment request
      </button>
    </form>
  );
}
