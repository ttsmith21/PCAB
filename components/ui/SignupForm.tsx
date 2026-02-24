"use client";

import { useState, type FormEvent } from "react";
import { ChevronDown } from "lucide-react";
import Card from "@/components/ui/Card";
import { MAILCHIMP_CONFIG, MAILCHIMP_GROUPS } from "@/lib/constants";
import { getSportsBySeason, seasonLabels, type Season } from "@/lib/data/sports";

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidPhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return digits.length === 10;
}

function sportLabel(name: string, gender: "boys" | "girls" | "coed"): string {
  if (gender === "coed") return name;
  return `${name} - ${gender === "boys" ? "Boys" : "Girls"}`;
}

export default function SignupForm() {
  // Form field values
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [commPref, setCommPref] = useState("email");
  const [selectedSports, setSelectedSports] = useState<Set<string>>(new Set());
  const [selectedLevels, setSelectedLevels] = useState<Set<string>>(new Set());
  const [role, setRole] = useState("");

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [expandedSeasons, setExpandedSeasons] = useState<Set<Season>>(
    new Set(["fall", "winter", "spring"])
  );

  function clearError(field: string) {
    setErrors((prev) => {
      if (!(field in prev)) return prev;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [field]: _removed, ...rest } = prev;
      return rest;
    });
  }

  function validate(): Record<string, string> {
    const errs: Record<string, string> = {};
    if (!firstName.trim()) errs.firstName = "First name is required";
    if (!lastName.trim()) errs.lastName = "Last name is required";
    if (!email.trim()) {
      errs.email = "Email is required";
    } else if (!isValidEmail(email.trim())) {
      errs.email = "Please enter a valid email address";
    }
    if (phone.trim() && !isValidPhone(phone.trim())) {
      errs.phone = "Please enter a valid 10-digit phone number";
    }
    return errs;
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      e.preventDefault();
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }
    setIsSubmitting(true);
  }

  function toggleSeason(season: Season) {
    setExpandedSeasons((prev) => {
      const next = new Set(prev);
      if (next.has(season)) {
        next.delete(season);
      } else {
        next.add(season);
      }
      return next;
    });
  }

  function toggleSport(sportKey: string) {
    setSelectedSports((prev) => {
      const next = new Set(prev);
      if (next.has(sportKey)) {
        next.delete(sportKey);
      } else {
        next.add(sportKey);
      }
      return next;
    });
  }

  function toggleLevel(level: string) {
    setSelectedLevels((prev) => {
      const next = new Set(prev);
      if (next.has(level)) {
        next.delete(level);
      } else {
        next.add(level);
      }
      return next;
    });
  }

  const seasons: Season[] = ["fall", "winter", "spring"];
  const levels = [
    { label: "Youth (K-6)", value: "youth" },
    { label: "Middle School (7-8)", value: "middle" },
    { label: "High School (9-12)", value: "high" },
  ];
  const roles = ["Parent", "Coach", "Volunteer", "Community Supporter"];

  const inputClasses =
    "w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-pc-red focus:border-pc-red";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1";
  const errorClasses = "text-sm text-pc-red mt-1";

  return (
    <Card hover={false}>
      <form
        method="POST"
        action={`${MAILCHIMP_CONFIG.formAction}?u=${MAILCHIMP_CONFIG.userId}&id=${MAILCHIMP_CONFIG.audienceId}`}
        onSubmit={handleSubmit}
      >
        {/* Hidden Fields */}
        <input
          type="text"
          name={MAILCHIMP_CONFIG.honeypotFieldName}
          tabIndex={-1}
          aria-hidden="true"
          style={{ position: "absolute", left: "-5000px" }}
          defaultValue=""
        />
        <input type="hidden" name="_redirect" value="/join/thanks" />
        <input type="hidden" name="u" value={MAILCHIMP_CONFIG.userId} />
        <input type="hidden" name="id" value={MAILCHIMP_CONFIG.audienceId} />

        {/* Personal Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="firstName" className={labelClasses}>
              First Name <span className="text-pc-red">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              name="FNAME"
              value={firstName}
              onChange={(e) => { setFirstName(e.target.value); clearError("firstName"); }}
              aria-required="true"
              aria-describedby={errors.firstName ? "firstName-error" : undefined}
              className={inputClasses}
            />
            {errors.firstName && (
              <p id="firstName-error" className={errorClasses}>
                {errors.firstName}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="lastName" className={labelClasses}>
              Last Name <span className="text-pc-red">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              name="LNAME"
              value={lastName}
              onChange={(e) => { setLastName(e.target.value); clearError("lastName"); }}
              aria-required="true"
              aria-describedby={errors.lastName ? "lastName-error" : undefined}
              className={inputClasses}
            />
            {errors.lastName && (
              <p id="lastName-error" className={errorClasses}>
                {errors.lastName}
              </p>
            )}
          </div>
        </div>

        {/* Contact */}
        <div className="space-y-4 mb-6">
          <div>
            <label htmlFor="email" className={labelClasses}>
              Email <span className="text-pc-red">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="EMAIL"
              value={email}
              onChange={(e) => { setEmail(e.target.value); clearError("email"); }}
              aria-required="true"
              aria-describedby={errors.email ? "email-error" : undefined}
              className={inputClasses}
            />
            {errors.email && (
              <p id="email-error" className={errorClasses}>
                {errors.email}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="phone" className={labelClasses}>
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="PHONE"
              value={phone}
              onChange={(e) => { setPhone(e.target.value); clearError("phone"); }}
              placeholder="(555) 555-5555"
              aria-describedby={errors.phone ? "phone-error" : undefined}
              className={inputClasses}
            />
            {errors.phone && (
              <p id="phone-error" className={errorClasses}>
                {errors.phone}
              </p>
            )}
          </div>
        </div>

        {/* Communication Preferences (visible only when phone has a value) */}
        {phone.trim().length === 0 && (
          <input type="hidden" name="COMM_PREF" value="email" />
        )}
        {phone.trim().length > 0 && (
          <fieldset className="mb-6">
            <legend className="text-sm font-medium text-gray-700 mb-2">
              Communication Preference <span className="text-pc-red">*</span>
            </legend>
            <div className="space-y-2">
              {[
                { value: "email", label: "Email only" },
                { value: "sms", label: "SMS only" },
                { value: "both", label: "Email + SMS" },
              ].map((option) => (
                <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="COMM_PREF"
                    value={option.value}
                    checked={commPref === option.value}
                    onChange={(e) => setCommPref(e.target.value)}
                    className="accent-pc-red"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
            {(commPref === "sms" || commPref === "both") && (
              <p className="text-xs text-gray-500 mt-1">
                By selecting SMS, you agree to receive text messages from PC Athletic
                Boosters. Msg & data rates may apply. Reply STOP to unsubscribe.
              </p>
            )}
            {errors.commPref && (
              <p id="commPref-error" className={errorClasses}>
                {errors.commPref}
              </p>
            )}
          </fieldset>
        )}

        {/* Sports Interests */}
        <div className="mb-6">
          <h3 className="font-oswald text-lg font-bold uppercase tracking-wide mb-3">
            Sports Interests
          </h3>
          {seasons.map((season) => {
            const seasonSports = getSportsBySeason(season);
            return (
              <div key={season} className="mb-3">
                <button
                  type="button"
                  onClick={() => toggleSeason(season)}
                  className="flex items-center justify-between w-full font-oswald text-lg font-bold uppercase tracking-wide py-2"
                  aria-expanded={expandedSeasons.has(season)}
                >
                  <span>{seasonLabels[season]} Sports</span>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${
                      expandedSeasons.has(season) ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {expandedSeasons.has(season) && (
                  <fieldset className="pl-2">
                    <legend className="sr-only">{seasonLabels[season]} sports</legend>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {seasonSports.map((sport) => {
                        const key = `${sport.name}-${sport.gender}`;
                        const label = sportLabel(sport.name, sport.gender);
                        const optionId =
                          MAILCHIMP_GROUPS.sports.options[label] || label;
                        return (
                          <label
                            key={key}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              name={`group[${MAILCHIMP_GROUPS.sports.groupId}][${optionId}]`}
                              value="1"
                              checked={selectedSports.has(key)}
                              onChange={() => toggleSport(key)}
                              className="accent-pc-red"
                            />
                            <span className="text-sm text-gray-700">{label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>
                )}
              </div>
            );
          })}
        </div>

        {/* Level */}
        <fieldset className="mb-6">
          <legend className="font-oswald text-lg font-bold uppercase tracking-wide mb-3">
            Level
          </legend>
          <div className="space-y-2">
            {levels.map((level) => {
              const optionId =
                MAILCHIMP_GROUPS.level.options[level.label] || level.value;
              return (
                <label
                  key={level.value}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    name={`group[${MAILCHIMP_GROUPS.level.groupId}][${optionId}]`}
                    value="1"
                    checked={selectedLevels.has(level.value)}
                    onChange={() => toggleLevel(level.value)}
                    className="accent-pc-red"
                  />
                  <span className="text-sm text-gray-700">{level.label}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        {/* Role */}
        <fieldset className="mb-6">
          <legend className="font-oswald text-lg font-bold uppercase tracking-wide mb-3">
            Role
          </legend>
          <div className="space-y-2">
            {roles.map((r) => {
              const optionId = MAILCHIMP_GROUPS.role.options[r] || r;
              return (
                <label key={r} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`group[${MAILCHIMP_GROUPS.role.groupId}]`}
                    value={optionId}
                    checked={role === r}
                    onChange={() => setRole(r)}
                    className="accent-pc-red"
                  />
                  <span className="text-sm text-gray-700">{r}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="font-oswald inline-block font-bold text-sm tracking-wider uppercase py-3 px-8 rounded-full transition-all duration-300 text-center w-full bg-pc-red text-white hover:bg-pc-red-dark hover:shadow-glow hover:-translate-y-0.5 shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-md"
        >
          {isSubmitting ? "Submitting..." : "Join Our Community"}
        </button>
      </form>
    </Card>
  );
}
