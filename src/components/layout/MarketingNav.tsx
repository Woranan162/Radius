"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AppLogo } from "./AppLogo";

const links = [
  { href: "/", label: "Home", match: (path: string) => path === "/" },
  { href: "/graph", label: "Simulator", match: (path: string) => path.startsWith("/graph") },
  {
    href: "/demo?fail=auth-service",
    label: "Demo",
    match: (path: string) => path.startsWith("/demo"),
  },
];

export function MarketingNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const onGraph = pathname.startsWith("/graph");

  return (
    <header
      className="motion-enter sticky top-0 z-50 shrink-0 border-b bg-white pt-safe"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="page-container flex h-12 items-center justify-between sm:h-[45px]">
        <div className="flex min-w-0 items-center gap-4 sm:gap-6">
          <AppLogo />
          <nav className="hidden items-center gap-0.5 sm:flex">
            {links.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                active={link.match(pathname)}
              />
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {!onGraph && (
            <Link href="/graph" className="btn-primary hidden text-[13px] sm:inline-flex">
              Open simulator
            </Link>
          )}
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-md sm:hidden"
            style={{ color: "var(--fg)" }}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          className="motion-menu-enter border-t sm:hidden"
          style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}
        >
          <ul className="page-container space-y-1 py-3">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block rounded-md px-3 py-2.5 text-sm font-medium"
                  style={{
                    color: link.match(pathname) ? "var(--fg)" : "var(--fg-muted)",
                    background: link.match(pathname) ? "white" : "transparent",
                  }}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {!onGraph && (
              <li className="pt-2">
                <Link
                  href="/graph"
                  className="btn-primary block w-full text-center text-[13px]"
                  onClick={() => setOpen(false)}
                >
                  Open simulator
                </Link>
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}

function NavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className="notion-nav-link text-[13px]"
      style={{
        color: active ? "var(--fg)" : "var(--fg-muted)",
        background: active ? "var(--hover)" : undefined,
        fontWeight: active ? 500 : undefined,
      }}
      aria-current={active ? "page" : undefined}
    >
      {label}
    </Link>
  );
}

function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path d="M3 5h12M3 9h12M3 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path d="M5 5l8 8M13 5l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
