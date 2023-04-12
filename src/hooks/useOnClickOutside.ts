import React, { useEffect } from "react";

type ParamsUseClickOutside = {
    ref: React.RefObject<HTMLElement | null>;
    handle: () => void;
};

export default function useOnClickOutside({ref, handle} : ParamsUseClickOutside) {
    function handlePointerDown(ev: PointerEvent) {
        if (
            ref.current?.contains(ev.target as Node) &&
            (ref.current as HTMLElement) !== ev.target
            ) {
            return;
        }
        handle();
    }
    
    useEffect(() => {
        window.addEventListener("pointerdown", handlePointerDown);

        return () => {
            window.removeEventListener("pointerdown", handlePointerDown);
        };
    });
}