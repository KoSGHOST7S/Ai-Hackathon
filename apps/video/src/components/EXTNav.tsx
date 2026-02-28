import React from "react";
import { EXT } from "../colors";
import { FONT } from "../fonts";

type Tab = "today" | "plan" | "me";

interface Props {
  active: Tab;
}

const LeafIcon = ({ active }: { active: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.6}>
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </svg>
);

const CalIcon = ({ active }: { active: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.6}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const UserIcon = ({ active }: { active: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.6}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const TABS: { id: Tab; label: string; Icon: React.FC<{ active: boolean }> }[] = [
  { id: "today", label: "Today", Icon: LeafIcon },
  { id: "plan", label: "Plan", Icon: CalIcon },
  { id: "me", label: "Me", Icon: UserIcon },
];

export const EXTNav: React.FC<Props> = ({ active }) => {
  return (
    <div
      style={{
        height: 64,
        borderTop: `1px solid ${EXT.border}`,
        background: EXT.card,
        display: "flex",
        alignItems: "center",
        padding: "0 8px",
        gap: 4,
        flexShrink: 0,
      }}
    >
      {TABS.map(({ id, label, Icon }) => {
        const isActive = active === id;
        return (
          <div
            key={id}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 3,
              height: 44,
              borderRadius: 12,
              background: isActive ? EXT.primaryTint : "transparent",
              color: isActive ? EXT.primary : EXT.mutedFg,
            }}
          >
            <Icon active={isActive} />
            <span
              style={{
                fontFamily: FONT.sans,
                fontSize: 10,
                fontWeight: isActive ? 600 : 500,
                letterSpacing: "0.2px",
                color: "inherit",
              }}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
};
