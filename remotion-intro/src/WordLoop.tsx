import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * KIVRA Digital — pita tipografi berjalan.
 *
 * Dipakai sebagai jeda visual sebelum ajakan terakhir di beranda. Tiga kata
 * tagline berjalan mendatar dengan kecepatan tetap.
 *
 * Supaya sambungan loop tidak terlihat: satu set kata dibuat selebar SET_W,
 * lalu dirender dua kali berdampingan. Selama durasi klip, track bergeser
 * tepat sejauh SET_W, sehingga frame terakhir identik dengan frame pertama.
 * Karena itu pergeserannya linier — easing apa pun akan merusak sambungan.
 */

const INK = "#111111";
const ACCENT = "#323afd";
const PAPER = "#ffffff";

const WORDS = ["Create.", "Connect.", "Grow."];
const CELL = 640;
const SET_W = CELL * WORDS.length;

export const WordLoop: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();
  const unit = width / 1920;

  const shift = interpolate(frame, [0, durationInFrames], [0, -SET_W * unit]);

  const cell = (word: string, key: string) => (
    <div
      key={key}
      style={{
        width: CELL * unit,
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 34 * unit,
      }}
    >
      <span
        style={{
          color: INK,
          fontSize: 64 * unit,
          fontWeight: 700,
          letterSpacing: "0.02em",
          lineHeight: 1,
          textTransform: "uppercase",
        }}
      >
        {word}
      </span>
      <span
        style={{
          width: 14 * unit,
          height: 14 * unit,
          background: ACCENT,
          transform: "rotate(45deg)",
          flex: "0 0 auto",
        }}
      />
    </div>
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: PAPER,
        overflow: "hidden",
        fontFamily: '"Arial Narrow", "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1 * unit, background: "rgba(17,17,17,0.12)" }} />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          display: "flex",
          alignItems: "center",
          width: SET_W * 2 * unit,
          transform: `translateX(${shift}px)`,
        }}
      >
        {WORDS.map((w) => cell(w, `a-${w}`))}
        {WORDS.map((w) => cell(w, `b-${w}`))}
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2 * unit, background: ACCENT }} />
    </AbsoluteFill>
  );
};
