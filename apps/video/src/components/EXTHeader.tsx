import React from "react";
import { EXT } from "../colors";
import { FONT } from "../fonts";

interface Props {
  tab?: string;
  showBack?: boolean;
  backLabel?: string;
  showSparkle?: boolean;
}

export const EXTHeader: React.FC<Props> = ({
  tab,
  showBack = false,
  backLabel,
  showSparkle = false,
}) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 16px 12px",
        borderBottom: `1px solid ${EXT.border}`,
        background: EXT.card,
        flexShrink: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {showBack && (
          <div style={{ marginRight: 4, color: EXT.mutedFg, display: "flex", alignItems: "center" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </div>
        )}
        <span
          style={{
            fontFamily: FONT.serif,
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: "-0.3px",
          }}
        >
          <span style={{ color: EXT.fg }}>Assign</span>
          <span style={{ color: EXT.primary }}>mint.ai</span>
        </span>
        {tab && (
          <>
            <span style={{ color: EXT.border, margin: "0 6px", fontSize: 14 }}>·</span>
            <span style={{ fontFamily: FONT.sans, fontSize: 13, fontWeight: 500, color: EXT.fg }}>
              {tab}
            </span>
          </>
        )}
        {backLabel && (
          <>
            <span style={{ color: EXT.border, margin: "0 4px", fontSize: 12 }}>·</span>
            <span style={{ fontFamily: FONT.sans, fontSize: 11, color: EXT.mutedFg }}>
              {backLabel}
            </span>
          </>
        )}
      </div>

      {/* Avatar */}
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: EXT.primaryTint,
          border: `1px solid ${EXT.primaryTint20}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {showSparkle ? (
          <svg width="12" height="12" viewBox="0 0 24 24" fill={EXT.primary} stroke="none">
            <path d="M12 2L9.5 9.5L2 12L9.5 14.5L12 22L14.5 14.5L22 12L14.5 9.5L12 2Z" />
          </svg>
        ) : (
          <span style={{ fontFamily: FONT.sans, fontSize: 9, fontWeight: 700, color: EXT.primary }}>
            AJ
          </span>
        )}
      </div>
    </div>
  );
};
