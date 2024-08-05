import { useState, useEffect } from "react";
// Custom hook to track the width of the browser window
export const useResponsiveWidth = () => {
    // State to store the current width of the window
    const [width, setWidth] = useState(window.innerWidth);
    // useEffect hook to update the width state when the window is resized
    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    return width;
};