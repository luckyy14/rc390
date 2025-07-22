import { useState, useEffect, useRef } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=<>?";

function randomChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)];
}

export function useTextScramble(target, trigger, { speed = 30, stepDelay = 80 } = {}) {
  const [display, setDisplay] = useState(target);
  const intervalRef = useRef();
  const timeoutRef = useRef();

  useEffect(() => {
    if (!trigger) {
      setDisplay(target);
      return;
    }
    let revealed = 0;
    let current = Array.from(target).map(() => "");

    function revealNext() {
      if (revealed >= target.length) {
        setDisplay(target);
        return;
      }
      let scrambleCount = 0;
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        scrambleCount++;
        for (let i = revealed; i < target.length; i++) {
          current[i] = randomChar();
        }
        setDisplay(current.join(""));
        if (scrambleCount > 4) { // scramble a few times before revealing
          clearInterval(intervalRef.current);
          current[revealed] = target[revealed];
          setDisplay(current.join(""));
          revealed++;
          timeoutRef.current = setTimeout(revealNext, stepDelay);
        }
      }, speed);
    }
    revealNext();
    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(timeoutRef.current);
      setDisplay(target);
    };
  }, [trigger, target, speed, stepDelay]);

  return display;
} 