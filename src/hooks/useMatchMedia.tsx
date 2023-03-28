import { useEffect, useState } from "react";

type PropsUseMatchMedia = {
    mobileContent: React.ReactNode;
    desktopContext: React.ReactNode;
    mediaQuery: string;
};

export default function useMatchMedia({mobileContent, desktopContext, mediaQuery} : PropsUseMatchMedia) {
    const [isScreenCurrentMatch, setIsScreenCurrentMatch] = useState(false);

    useEffect(() => {
        const mediaWatcher = window.matchMedia(mediaQuery);
        setIsScreenCurrentMatch(mediaWatcher.matches);

        function updateIsScreenCurrentMatch(e: MediaQueryListEvent) {
            setIsScreenCurrentMatch(e.matches);
        }

        //navegadores como chrome, opera, firefox, etc...
        if(mediaWatcher.addEventListener) {
            mediaWatcher.addEventListener('change', updateIsScreenCurrentMatch);
            return function cleanup() {
                mediaWatcher.removeEventListener('change', updateIsScreenCurrentMatch);
            }
        }else{
            //safari
            mediaWatcher.addListener(updateIsScreenCurrentMatch);
            return function cleanup() {
                mediaWatcher.removeListener(updateIsScreenCurrentMatch);
            }
        }
    });

    return isScreenCurrentMatch ? mobileContent : desktopContext;
}