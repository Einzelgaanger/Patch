import type { Variants } from "framer-motion";

export const fadeIn = (direction: "up" | "down" | "left" | "right", delay: number): Variants => {
    return {
        hidden: {
            y: direction === "up" ? 40 : direction === "down" ? -40 : 0,
            x: direction === "left" ? 40 : direction === "right" ? -40 : 0,
            opacity: 0,
        },
        show: {
            y: 0,
            x: 0,
            opacity: 1,
            transition: {
                type: "spring" as const,
                duration: 1.25,
                delay: delay,
                ease: [0.25, 0.25, 0.25, 0.75] as [number, number, number, number],
            },
        },
    };
};

export const staggerContainer = (staggerChildren: number, delayChildren: number): Variants => {
    return {
        hidden: {},
        show: {
            transition: {
                staggerChildren: staggerChildren,
                delayChildren: delayChildren,
            },
        },
    };
};

export const zoomIn = (delay: number, duration: number): Variants => {
    return {
        hidden: {
            scale: 0,
            opacity: 0,
        },
        show: {
            scale: 1,
            opacity: 1,
            transition: {
                type: "tween" as const,
                delay: delay,
                duration: duration,
                ease: "easeOut" as const,
            },
        },
    };
};

export const slideIn = (direction: "up" | "down" | "left" | "right", type: string, delay: number, duration: number): Variants => {
    return {
        hidden: {
            x: direction === "left" ? "-100%" : direction === "right" ? "100%" : 0,
            y: direction === "up" ? "100%" : direction === "down" ? "100%" : 0,
        },
        show: {
            x: 0,
            y: 0,
            transition: {
                type: type as "spring" | "tween",
                delay: delay,
                duration: duration,
                ease: "easeOut" as const,
            },
        },
    };
};
