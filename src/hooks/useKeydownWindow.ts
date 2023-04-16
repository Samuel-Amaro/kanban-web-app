import { useEffect } from "react";

export default function useKeydownWindow(handleKeydown: (e: KeyboardEvent) => void
) {
    useEffect(() => {
        window.addEventListener("keydown", handleKeydown);
        return () => {
            window.removeEventListener("keydown", handleKeydown);
        };
    }, []);
}