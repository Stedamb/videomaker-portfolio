import type { TransitionDirectionalAnimations } from "astro";

// Page-level transition: the old page recedes and blurs out, the new one rises in.
// Keyframes live in src/styles/transitions.css.
const easeOut = "cubic-bezier(0.16, 1, 0.3, 1)";

export const cinematic: TransitionDirectionalAnimations = {
    forwards: {
        old: { name: "vtRecede", duration: "0.25s", easing: easeOut, fillMode: "both" },
        new: { name: "vtRise", duration: "0.5s", easing: easeOut, fillMode: "both" },
    },
    backwards: {
        old: { name: "vtSink", duration: "0.25s", easing: easeOut, fillMode: "both" },
        new: { name: "vtReturn", duration: "0.5s", easing: easeOut, fillMode: "both" },
    },
};

/** Shared view-transition name for a video, so it morphs between grid tile and project page. */
export const videoTransitionName = (link: string) => `video-${link.replace("/video/", "")}`;
