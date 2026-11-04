import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";

/**
 * KIVRA Digital intro / loading sequence.
 *
 * Structure ported from the loader observed on fromanother.love: a greeting
 * line, a 0->100 percentage counter, and a full-bleed wipe-out once it lands.
 * Palette and wordmark are KIVRA Digital's own, sampled from the brand logo
 * (ink #111111, accent #323AFD); none of the reference's brand values, type or
 * assets are reused. See docs/REFERENCE_AUDIT.md §8.
 */

const INK = "#111111";
const PAPER = "#ffffff";
const ACCENT = "#323afd";
const MUTED = "#707070";

// matches --ease-out-quart in style.css, which is the reference's own curve
const easeOutQuart = Easing.bezier(0.165, 0.84, 0.44, 1);
const easeInOutQuart = Easing.bezier(0.76, 0, 0.24, 1);

export const Intro: React.FC<{ portrait?: boolean }> = ({ portrait = false }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();

  // percentage runs over the first 75% of the clip, then holds at 100
  const loadEnd = Math.round(durationInFrames * 0.75);
  const percent = Math.round(
    interpolate(frame, [0, loadEnd], [0, 100], {
      extrapolateRight: "clamp",
      easing: easeOutQuart,
    }),
  );

  // wordmark resolves out of the reference's blur idiom
  const markBlur = interpolate(frame, [6, 34], [14, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOutQuart,
  });
  const markOpacity = interpolate(frame, [6, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const markShift = interpolate(frame, [6, 40], [26, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOutQuart,
  });

  const subOpacity = interpolate(frame, [26, 48], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // the accent rule under the wordmark fills with the load
  const ruleScale = interpolate(frame, [10, loadEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOutQuart,
  });

  // wipe out over the last 18 frames, bottom edge rising to the top
  const wipeStart = durationInFrames - 18;
  const wipe = interpolate(frame, [wipeStart, durationInFrames], [100, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInOutQuart,
  });

  const unit = portrait ? width / 1080 : width / 1920;

  // Title-safe inset. The clip is shown full-bleed behind a browser viewport
  // whose aspect ratio is not 16:9, so the frame edges can end up cropped or
  // below the fold. Keeping the corner text well inside the frame means the
  // counter survives whatever the viewport does to the edges.
  const padX = width * 0.1;
  const padY = height * 0.13;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: PAPER,
        fontFamily: '"Arial Narrow", "Helvetica Neue", Arial, sans-serif',
        clipPath: `inset(0 0 ${100 - wipe}% 0)`,
      }}
    >
      {/* wordmark block, dead centre */}
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 24 * unit,
        }}
      >
        {/* The real brand wordmark rather than type: the logo's K cut and blue
            accent are the mark, and an image renders identically on every
            machine, whatever fonts are installed. */}
        <Img
          src={staticFile("Logo-kivra.png")}
          style={{
            opacity: markOpacity,
            filter: `blur(${markBlur}px)`,
            transform: `translateY(${markShift * unit}px)`,
            width: (portrait ? 620 : 760) * unit,
            height: "auto",
            display: "block",
          }}
        />

        <div
          style={{
            width: (portrait ? 620 : 900) * unit,
            height: 2 * unit,
            backgroundColor: ACCENT,
            transform: `scaleX(${ruleScale})`,
            transformOrigin: "left center",
          }}
        />

        <div
          style={{
            opacity: subOpacity,
            color: MUTED,
            fontSize: (portrait ? 26 : 30) * unit,
            fontWeight: 600,
            letterSpacing: "0.34em",
            textTransform: "uppercase",
          }}
        >
          Create. Connect. Grow.
        </div>
      </AbsoluteFill>

      {/* counter bottom-left, label bottom-right */}
      <AbsoluteFill
        style={{
          padding: `${padY}px ${padX}px`,
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "flex-end",
        }}
      >
        <div
          style={{
            flex: 1,
            color: INK,
            fontSize: (portrait ? 72 : 96) * unit,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}
        >
          {percent}
          <span style={{ color: ACCENT }}>%</span>
        </div>
        <div
          style={{
            color: MUTED,
            fontSize: (portrait ? 20 : 22) * unit,
            fontWeight: 600,
            letterSpacing: "0.2em",
            textAlign: "right",
            textTransform: "uppercase",
          }}
        >
          Creative technology agency
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
