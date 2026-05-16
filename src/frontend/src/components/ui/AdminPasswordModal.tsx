import { ShieldCheck, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAdminStore } from "../../lib/admin-store";

interface AdminPasswordModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export function AdminPasswordModal({
  onClose,
  onSuccess,
}: AdminPasswordModalProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const { verifyPassword } = useAdminStore();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ok = verifyPassword(password);
    if (ok) {
      onClose();
      onSuccess?.();
    } else {
      setError("Incorrect password. Please try again.");
      setShake(true);
      setPassword("");
      setTimeout(() => setShake(false), 600);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm"
      data-ocid="admin-modal-overlay"
    >
      {/* Backdrop click */}
      <button
        type="button"
        aria-label="Close admin modal"
        className="absolute inset-0 w-full h-full cursor-default"
        onClick={onClose}
        tabIndex={-1}
      />

      <div
        className={`relative z-10 w-full max-w-sm mx-4 glass-card rounded-2xl p-8 border border-primary/30 shadow-[0_0_40px_rgba(168,85,247,0.2)] ${shake ? "animate-pulse" : ""}`}
        data-ocid="admin-modal"
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-smooth"
          data-ocid="admin-modal-close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-5">
          <div className="w-14 h-14 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.3)]">
            <ShieldCheck className="w-7 h-7 text-primary" />
          </div>
        </div>

        <h2 className="font-display font-black text-2xl text-foreground text-center mb-1">
          Admin Access
        </h2>
        <p className="text-sm text-muted-foreground text-center mb-6">
          Enter your admin password to continue
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              ref={inputRef}
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="Admin password"
              className="w-full px-4 py-3 rounded-xl bg-muted/30 border border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-smooth text-sm"
              data-ocid="admin-password-input"
              aria-label="Admin password"
              autoComplete="current-password"
            />
            {error && (
              <p
                className="mt-2 text-xs text-destructive"
                role="alert"
                data-ocid="admin-password-error"
              >
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-display font-semibold text-sm hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-smooth"
            data-ocid="admin-password-submit"
          >
            Enter Admin Panel
          </button>
        </form>
      </div>
    </div>
  );
}
