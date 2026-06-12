"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { demoRegistry } from "../../demos/registry";

export default function PageTransition({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const current = demoRegistry.find(d => d.path === pathname);

    const isFullScreen = current?.fullScreen;

    const x = current?.x ?? 0;
    const y = current?.y ?? 0;

    if (isFullScreen) {
        return (
            <div style={{ width: "100%", height: "100%" }}>
                {children}
            </div>
        );
    }

    return (
        <motion.div
            animate={{
                x: -x * 60,
                y: -y * 40,
            }}
            transition={{
                duration: 0.35,
                ease: [0.22, 1, 0.36, 1],
            }}
            style={{
                position: "absolute",
                inset: 0,
            }}
        >
            {children}
        </motion.div>
    );
}