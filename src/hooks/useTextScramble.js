import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

gsap.registerPlugin(ScrambleTextPlugin);

/**
 * useTextScramble hook using GSAP ScrambleTextPlugin.
 *
 * Usage:
 *   const scrambleRef = useTextScramble("NEW TEXT", trigger, { speed: 0.3 });
 *   return <span ref={scrambleRef}>NEW TEXT</span>;
 *
 * @param {string} target - The text to scramble to.
 * @param {boolean} trigger - When true, triggers the scramble animation.
 * @param {object} options - { speed, chars, revealDelay, newClass, duration }
 * @returns {object} ref - Attach to the DOM element whose text should be scrambled.
 */
export function useTextScramble(target, trigger, options = {}) {
  const {
    speed = 0.3,
    chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    revealDelay = 0,
    newClass,
    duration = 1,
  } = options;

  const ref = useRef(null);

  useEffect(() => {
    if (!trigger || !ref.current) {
      if (ref.current) ref.current.textContent = target;
      return;
    }
    gsap.to(ref.current, {
      duration,
      scrambleText: {
        text: target,
        chars,
        revealDelay,
        speed,
        newClass,
      },
    });
  }, [trigger, target, speed, chars, revealDelay, newClass, duration]);

  return ref;
}
