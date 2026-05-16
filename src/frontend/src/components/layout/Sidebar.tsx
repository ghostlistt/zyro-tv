// Sidebar removed — replaced by Hulu-style top navbar in Header.tsx
// This file is kept as a no-op export so any lingering imports don't break.

export function Sidebar(_props: { open?: boolean; onClose?: () => void }) {
  return null;
}

export function NavLink(_props: {
  item?: { to: string; icon?: React.ReactNode; label: string };
  pathname?: string;
  onClick?: () => void;
}) {
  return null;
}
