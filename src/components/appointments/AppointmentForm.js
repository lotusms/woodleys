"use client";

import { useState } from "react";
import ContactHelpfulDetailsCard from "@/components/contact/ContactHelpfulDetailsCard";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SelectListbox from "@/components/ui/SelectListbox";
import { orgEmail, orgPhone } from "@/config";
import * as siteForm from "@/lib/siteFormChrome";

const visitTypes = [
  { value: "Engagement & wedding consultation", label: "Engagement & wedding consultation" },
  { value: "Custom design consultation", label: "Custom design consultation" },
  { value: "Jewelry repair drop-off", label: "Jewelry repair drop-off" },
  { value: "Watch service", label: "Watch service" },
  { value: "Appraisal", label: "Appraisal" },
  { value: "General visit", label: "General visit" },
];

const timePreferences = ["Morning", "Afternoon", "No preference"];

export default function AppointmentForm() {
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [visitType, setVisitType] = useState("");
  const [preferredTime, setPreferredTime] = useState("No preference");

  function validate(formData) {
    /** @type {Record<string, string>} */
    const next = {};
    if (!formData.get("name")?.toString().trim()) next.name = "Please enter your name.";
    if (!formData.get("email")?.toString().trim()) next.email = "Please enter your email.";
    if (!formData.get("phone")?.toString().trim()) next.phone = "Please enter your phone number.";
    if (!visitType.trim()) next.visitType = "Please select a visit type.";
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
    const message = formData.get("message");

    const subject = encodeURIComponent(`Appointment request, ${visitType}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nVisit type: ${visitType}\nPreferred time: ${preferredTime}\n\nNotes:\n${message || "(none)"}`,
    );

    window.location.href = `mailto:${orgEmail}?subject=${subject}&body=${body}`;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className={siteForm.siteFormSuccessShell()} role="status">
        <p className={siteForm.siteFormEyebrow()}>Request received</p>
        <h2 className={siteForm.siteFormTitle()}>Thank you</h2>
        <p className={`${siteForm.siteFormIntro()} max-w-none`}>
          Your email client should open with your appointment details. If it
          does not, please call us at{" "}
          <a href={`tel:${orgPhone.replace(/\D/g, "")}`} className="text-warm-gold-dark underline-offset-4 hover:underline">
            {orgPhone}
          </a>{" "}
          or email{" "}
          <a href={`mailto:${orgEmail}`} className="text-warm-gold-dark underline-offset-4 hover:underline">
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
      className={siteForm.siteFormShell()}
      aria-labelledby="appointment-form-title"
    >
      <p className={siteForm.siteFormEyebrow()}>Private appointment</p>
      <h2 id="appointment-form-title" className={siteForm.siteFormTitle()}>
        Request a visit
      </h2>
      <p className={`${siteForm.siteFormIntro()} max-w-none`}>
        Share a few details and we will follow up to confirm a time in our
        showroom.
      </p>

      <div className={siteForm.siteFormDivider()} />

      <div className="grid gap-x-8 gap-y-6 md:grid-cols-2">
        <div>
          <label htmlFor="name" className={siteForm.siteFormFieldLabel()}>
            Full name <span className={siteForm.siteFormRequiredMark()}>*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={siteForm.siteFormControl(Boolean(errors.name))}
          />
          {errors.name ? (
            <p id="name-error" className={siteForm.siteFormError()} role="alert">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="email" className={siteForm.siteFormFieldLabel()}>
            Email <span className={siteForm.siteFormRequiredMark()}>*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={siteForm.siteFormControl(Boolean(errors.email))}
          />
          {errors.email ? (
            <p id="email-error" className={siteForm.siteFormError()} role="alert">
              {errors.email}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="phone" className={siteForm.siteFormFieldLabel()}>
            Phone <span className={siteForm.siteFormRequiredMark()}>*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            className={siteForm.siteFormControl(Boolean(errors.phone))}
          />
          {errors.phone ? (
            <p id="phone-error" className={siteForm.siteFormError()} role="alert">
              {errors.phone}
            </p>
          ) : null}
        </div>

        <div>
          <fieldset>
            <legend className={siteForm.siteFormFieldsetLegend()}>
              Visit type <span className={siteForm.siteFormRequiredMark()}>*</span>
            </legend>
            <SelectListbox
              showLabel={false}
              placeholder="Select a visit type"
              options={visitTypes}
              value={visitType}
              onChange={(next) => {
                setVisitType(next);
                if (next) {
                  setErrors((prev) => {
                    if (!prev.visitType) return prev;
                    const { visitType: _removed, ...rest } = prev;
                    return rest;
                  });
                }
              }}
              invalid={Boolean(errors.visitType)}
              ariaDescribedBy={errors.visitType ? "visitType-error" : undefined}
              anchor={false}
              buttonClassName={siteForm.siteFormSelectButton(Boolean(errors.visitType))}
              optionsClassName={siteForm.siteFormSelectPanel()}
              optionClassName={siteForm.siteFormSelectOption()}
              checkIconClassName={siteForm.siteFormSelectCheck()}
              chevronClassName={siteForm.siteFormSelectChevron()}
            />
            {errors.visitType ? (
              <p id="visitType-error" className={siteForm.siteFormError()} role="alert">
                {errors.visitType}
              </p>
            ) : null}
          </fieldset>
        </div>

        <div className="md:col-span-2">
          <fieldset>
            <legend className={siteForm.siteFormFieldsetLegend()}>
              Preferred time of day
            </legend>
            <div className={siteForm.siteFormChoiceGrid()} role="radiogroup">
              {timePreferences.map((pref) => {
                const selected = preferredTime === pref;
                const inputId = `preferred-time-${pref.toLowerCase().replace(/\s+/g, "-")}`;

                return (
                  <label
                    key={pref}
                    htmlFor={inputId}
                    className={siteForm.siteFormChoiceOption(selected)}
                  >
                    <input
                      id={inputId}
                      type="radio"
                      name="preferredTime"
                      value={pref}
                      checked={selected}
                      onChange={() => setPreferredTime(pref)}
                      className={siteForm.siteFormChoiceInput()}
                    />
                    <span className="font-medium">{pref}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="message" className={siteForm.siteFormFieldLabel()}>
            Notes{" "}
            <span className={siteForm.siteFormOptionalMark()}>(optional)</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            className={siteForm.siteFormTextarea()}
            placeholder="Share any details that will help us prepare for your visit."
          />
        </div>
      </div>

      <ContactHelpfulDetailsCard embedded />

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-site-secondary">
          Required fields are marked with{" "}
          <span className={siteForm.siteFormRequiredMark()}>*</span>
          . Appointment requests are confirmed personally, usually within one
          business day.
        </p>
        <PrimaryButton type="submit" className="w-full sm:w-auto">
          Send appointment request
        </PrimaryButton>
      </div>
    </form>
  );
}
