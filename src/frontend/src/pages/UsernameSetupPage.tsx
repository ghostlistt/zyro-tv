/**
 * UsernameSetupPage — shown immediately after first-time Identity AI login
 * if the user's stored username looks like a principal (no real username yet).
 *
 * Navigating away without completing triggers logout to prevent bypassing.
 */

import { useActor, useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useNavigate } from "@tanstack/react-router";
import { Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { type UpdateProfileInput, createActor } from "../backend";

const USERNAME_RE = /^[a-zA-Z0-9_-]{3,50}$/;
const MIN_LEN = 3;
const MAX_LEN = 50;

function getCharFeedback(value: string): string {
  if (value.length === 0) return `${MAX_LEN} characters max`;
  if (value.length < MIN_LEN)
    return `${MIN_LEN - value.length} more character${value.length === MIN_LEN - 1 ? "" : "s"} needed`;
  return `${MAX_LEN - value.length} characters remaining`;
}

export default function UsernameSetupPage() {
  const { actor, isFetching } = useActor(createActor);
  const ii = useInternetIdentity();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [touched, setTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const preventLogoutRef = useRef(false);

  // If user navigates away without completing, log them out
  useEffect(() => {
    return () => {
      if (!preventLogoutRef.current) {
        ii.clear();
      }
    };
  }, [ii]);

  function getValidationError(value: string): string | null {
    if (value.length === 0) return "Username is required";
    if (value.length < MIN_LEN) return `Must be at least ${MIN_LEN} characters`;
    if (value.length > MAX_LEN) return `Must be ${MAX_LEN} characters or fewer`;
    if (!USERNAME_RE.test(value))
      return "Only letters, numbers, underscores, and hyphens allowed";
    return null;
  }

  const validationError = touched ? getValidationError(username) : null;
  const isValid = getValidationError(username) === null;

  async function handleSave() {
    setTouched(true);
    if (!isValid || !actor || isFetching) return;

    setSaving(true);
    setServerError(null);
    try {
      const input: UpdateProfileInput = { username, bio: "" };
      await actor.saveCallerUserProfile(input);
      preventLogoutRef.current = true;
      navigate({ to: "/" });
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to save username";
      setServerError(msg);
    } finally {
      setSaving(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleSave();
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/8 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <Zap className="w-8 h-8 text-primary fill-primary" />
            <span className="font-display text-2xl font-bold text-gradient-purple">
              Zyro TV
            </span>
          </div>
        </div>

        {/* Card */}
        <div className="glass-card rounded-2xl p-8 neon-border">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/15 neon-border mb-4">
              <Zap className="w-7 h-7 text-primary" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">
              Choose Your Username
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Pick a unique name that other users will see across Zyro TV. You
              can always change it later from your profile.
            </p>
          </div>

          {/* Input */}
          <div className="space-y-2 mb-6">
            <label
              htmlFor="username-input"
              className="block text-sm font-medium text-foreground"
            >
              Username
            </label>
            <div className="relative">
              <input
                id="username-input"
                data-ocid="username_setup.input"
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value.slice(0, MAX_LEN));
                  if (!touched) setTouched(true);
                  setServerError(null);
                }}
                onBlur={() => setTouched(true)}
                onKeyDown={handleKeyDown}
                placeholder="e.g. ZyroFan_99"
                maxLength={MAX_LEN}
                autoComplete="username"
                className={[
                  "w-full rounded-xl px-4 py-3 bg-card/60 backdrop-blur",
                  "text-foreground placeholder:text-muted-foreground",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
                  "transition-smooth text-sm",
                  validationError
                    ? "border border-destructive/60"
                    : "border border-border/50 hover:border-primary/40",
                ].join(" ")}
              />
            </div>

            {/* Validation feedback */}
            {validationError ? (
              <p
                data-ocid="username_setup.field_error"
                className="text-destructive text-xs flex items-center gap-1"
              >
                <span>⚠</span> {validationError}
              </p>
            ) : serverError ? (
              <p
                data-ocid="username_setup.error_state"
                className="text-destructive text-xs flex items-center gap-1"
              >
                <span>⚠</span> {serverError}
              </p>
            ) : (
              <p className="text-muted-foreground text-xs">
                {getCharFeedback(username)}
              </p>
            )}
          </div>

          {/* Rules */}
          <ul className="text-xs text-muted-foreground space-y-1 mb-8">
            <li className={username.length >= MIN_LEN ? "text-primary/80" : ""}>
              · {MIN_LEN}–{MAX_LEN} characters
            </li>
            <li
              className={
                username.length > 0 && /^[a-zA-Z0-9_-]+$/.test(username)
                  ? "text-primary/80"
                  : ""
              }
            >
              · Letters, numbers, underscores (_), and hyphens (-)
            </li>
          </ul>

          {/* CTA */}
          <button
            type="button"
            data-ocid="username_setup.submit_button"
            onClick={handleSave}
            disabled={saving || isFetching}
            className={[
              "w-full py-3 rounded-xl font-display font-semibold text-sm",
              "transition-smooth focus-visible:ring-2 focus-visible:ring-primary/60",
              "bg-primary text-primary-foreground",
              "hover:opacity-90 active:scale-[0.98]",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              isValid && !saving ? "glow-primary" : "",
            ].join(" ")}
          >
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Saving…
              </span>
            ) : (
              "Save & Continue"
            )}
          </button>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Your account is secured by Internet Identity.
        </p>
      </div>
    </div>
  );
}
