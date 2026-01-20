import { useRef, useEffect } from 'react';

/**
 * Custom hook to manage keyboard events for bike control.
 * Returns a ref with the current set of pressed keys.
 */
export function useBikeControls() {
    const keysPressed = useRef(new Set());

    useEffect(() => {
        const handleKeyDown = (event) => {
            const key = event.key.toLowerCase();
            const code = event.code.toLowerCase();

            // Check for W, A, S, D, R keys using multiple methods
            if (key === 'w' || key === 'a' || key === 's' || key === 'd' || key === 'r' ||
                code === 'keyw' || code === 'keya' || code === 'keys' || code === 'keyd' || code === 'keyr' ||
                event.keyCode === 87 || event.keyCode === 65 || event.keyCode === 83 || event.keyCode === 68 || event.keyCode === 82) {
                event.preventDefault();
                event.stopPropagation();
                keysPressed.current.add(key);
            }
        };

        const handleKeyUp = (event) => {
            const key = event.key.toLowerCase();
            const code = event.code.toLowerCase();

            if (key === 'w' || key === 'a' || key === 's' || key === 'd' || key === 'r' ||
                code === 'keyw' || code === 'keya' || code === 'keys' || code === 'keyd' || code === 'keyr' ||
                event.keyCode === 87 || event.keyCode === 65 || event.keyCode === 83 || event.keyCode === 68 || event.keyCode === 82) {
                event.preventDefault();
                event.stopPropagation();
                keysPressed.current.delete(key);
            }
        };

        window.addEventListener('keydown', handleKeyDown, true);
        window.addEventListener('keyup', handleKeyUp, true);

        return () => {
            window.removeEventListener('keydown', handleKeyDown, true);
            window.removeEventListener('keyup', handleKeyUp, true);
        };
    }, []);

    return keysPressed;
}
