import { useState, useEffect, useRef } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function randomChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)];
}

export function useTextScramble(target, trigger, revealNow = false, { speed = 50, stepDelay = 80 } = {}) {
  const [display, setDisplay] = useState(target);
  const rafRef = useRef();
  const timeoutRef = useRef();

  useEffect(() => {
    let running = true;
    // Always clean up previous animation/timers
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    clearTimeout(timeoutRef.current);

    if (revealNow) {
      setDisplay(target);
      return;
    }
    if (!trigger) {
      setDisplay(target);
      return;
    }
    let revealed = 0;
    let current = Array.from(target).map(() => "");
    let scrambleCount = 0;
    const len = target.length;

    function revealNext() {
      if (!running) return;
      if (revealed >= len) {
        setDisplay(target);
        return;
      }
      scrambleCount = 0;
      function scrambleFrame() {
        if (!running) return;
        scrambleCount++;
        for (let i = revealed; i < len; i++) {
          // Skip scrambling every 2nd letter except first and last
          if (i !== 0 && i !== len - 1 && i % 2 === 1) {
            current[i] = target[i];
          } else {
            current[i] = randomChar();
          }
        }
        const scrambled = current.join("");
        setDisplay(prev => (prev !== scrambled ? scrambled : prev));
        if (scrambleCount > 4) {
          current[revealed] = target[revealed];
          setDisplay(current.join(""));
          revealed++;
          timeoutRef.current = setTimeout(revealNext, stepDelay);
        } else {
          rafRef.current = requestAnimationFrame(scrambleFrame);
        }
      }
      scrambleFrame();
    }
    revealNext();
    return () => {
      running = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      clearTimeout(timeoutRef.current);
      setDisplay(target);
    };
  }, [trigger, target, speed, stepDelay, revealNow]);

  return display;
}
