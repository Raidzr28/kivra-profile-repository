import React from "react";
import { Composition } from "remotion";
import { Intro } from "./Intro";
import { WordLoop } from "./WordLoop";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="IntroDesktop"
      component={Intro}
      durationInFrames={120}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{ portrait: false }}
    />
    <Composition
      id="IntroMobile"
      component={Intro}
      durationInFrames={120}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{ portrait: true }}
    />
    <Composition
      id="WordLoop"
      component={WordLoop}
      durationInFrames={180}
      fps={30}
      width={1920}
      height={240}
    />
  </>
);
