import { a as useActor, k as useInternetIdentity, g as useNavigate, r as reactExports, j as jsxRuntimeExports, Z as Zap, d as createActor } from "./index-BiC3Bukn.js";
const USERNAME_RE = /^[a-zA-Z0-9_-]{3,50}$/;
const MIN_LEN = 3;
const MAX_LEN = 50;
function getCharFeedback(value) {
  if (value.length === 0) return `${MAX_LEN} characters max`;
  if (value.length < MIN_LEN)
    return `${MIN_LEN - value.length} more character${value.length === MIN_LEN - 1 ? "" : "s"} needed`;
  return `${MAX_LEN - value.length} characters remaining`;
}
function UsernameSetupPage() {
  const { actor, isFetching } = useActor(createActor);
  const ii = useInternetIdentity();
  const navigate = useNavigate();
  const [username, setUsername] = reactExports.useState("");
  const [touched, setTouched] = reactExports.useState(false);
  const [saving, setSaving] = reactExports.useState(false);
  const [serverError, setServerError] = reactExports.useState(null);
  const preventLogoutRef = reactExports.useRef(false);
  reactExports.useEffect(() => {
    return () => {
      if (!preventLogoutRef.current) {
        ii.clear();
      }
    };
  }, [ii]);
  function getValidationError(value) {
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
      const input = { username, bio: "" };
      await actor.saveCallerUserProfile(input);
      preventLogoutRef.current = true;
      navigate({ to: "/" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save username";
      setServerError(msg);
    } finally {
      setSaving(false);
    }
  }
  function handleKeyDown(e) {
    if (e.key === "Enter") handleSave();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background flex items-center justify-center p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none fixed inset-0 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/8 blur-[120px]" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center mb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-8 h-8 text-primary fill-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-2xl font-bold text-gradient-purple", children: "Zyro TV" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-2xl p-8 neon-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/15 neon-border mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-7 h-7 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground mb-2", children: "Choose Your Username" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm leading-relaxed", children: "Pick a unique name that other users will see across Zyro TV. You can always change it later from your profile." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: "username-input",
              className: "block text-sm font-medium text-foreground",
              children: "Username"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "username-input",
              "data-ocid": "username_setup.input",
              type: "text",
              value: username,
              onChange: (e) => {
                setUsername(e.target.value.slice(0, MAX_LEN));
                if (!touched) setTouched(true);
                setServerError(null);
              },
              onBlur: () => setTouched(true),
              onKeyDown: handleKeyDown,
              placeholder: "e.g. ZyroFan_99",
              maxLength: MAX_LEN,
              autoComplete: "username",
              className: [
                "w-full rounded-xl px-4 py-3 bg-card/60 backdrop-blur",
                "text-foreground placeholder:text-muted-foreground",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
                "transition-smooth text-sm",
                validationError ? "border border-destructive/60" : "border border-border/50 hover:border-primary/40"
              ].join(" ")
            }
          ) }),
          validationError ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "p",
            {
              "data-ocid": "username_setup.field_error",
              className: "text-destructive text-xs flex items-center gap-1",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "⚠" }),
                " ",
                validationError
              ]
            }
          ) : serverError ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "p",
            {
              "data-ocid": "username_setup.error_state",
              className: "text-destructive text-xs flex items-center gap-1",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "⚠" }),
                " ",
                serverError
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs", children: getCharFeedback(username) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "text-xs text-muted-foreground space-y-1 mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: username.length >= MIN_LEN ? "text-primary/80" : "", children: [
            "· ",
            MIN_LEN,
            "–",
            MAX_LEN,
            " characters"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "li",
            {
              className: username.length > 0 && /^[a-zA-Z0-9_-]+$/.test(username) ? "text-primary/80" : "",
              children: "· Letters, numbers, underscores (_), and hyphens (-)"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            "data-ocid": "username_setup.submit_button",
            onClick: handleSave,
            disabled: saving || isFetching,
            className: [
              "w-full py-3 rounded-xl font-display font-semibold text-sm",
              "transition-smooth focus-visible:ring-2 focus-visible:ring-primary/60",
              "bg-primary text-primary-foreground",
              "hover:opacity-90 active:scale-[0.98]",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              isValid && !saving ? "glow-primary" : ""
            ].join(" "),
            children: saving ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center justify-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" }),
              "Saving…"
            ] }) : "Save & Continue"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-xs text-muted-foreground mt-6", children: "Your account is secured by Internet Identity." })
    ] })
  ] });
}
export {
  UsernameSetupPage as default
};
