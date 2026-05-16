import { j as jsxRuntimeExports, l as cn } from "./index-BiC3Bukn.js";
function Button({
  variant = "primary",
  size = "md",
  loading = false,
  children,
  className,
  disabled,
  ...props
}) {
  const base = "inline-flex items-center justify-center gap-2 font-display font-semibold rounded-lg transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] active:scale-95",
    secondary: "bg-card/60 border border-border text-foreground hover:bg-card hover:border-primary/40 hover:shadow-glass-sm backdrop-blur-sm active:scale-95",
    ghost: "text-muted-foreground hover:text-foreground hover:bg-muted/60 active:scale-95",
    danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:scale-95"
  };
  const sizes = {
    sm: "h-8 px-3 text-xs gap-1.5",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      className: cn(base, variants[variant], sizes[size], className),
      disabled: disabled || loading,
      ...props,
      children: [
        loading && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" }),
        children
      ]
    }
  );
}
export {
  Button as B
};
