"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { demoRegistry } from "../../demos/registry";

export default function Navigation() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const current = demoRegistry.find(d => d.path === pathname);

    const grouped = demoRegistry.reduce((acc, demo) => {
        if (!acc[demo.category]) acc[demo.category] = [];
        acc[demo.category].push(demo);
        return acc;
    }, {} as Record<string, typeof demoRegistry>);

    return (
        <div
            className="panel"
            style={{
                position: "fixed",
                top: 24,
                left: 24,
                height: "calc(100vh - 48px)",
                width: collapsed ? 60 : 280,
                padding: collapsed ? 10 : 16,
                overflow: "hidden",
                transition: "width 0.25s ease",
                zIndex: 1000,
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* HEADER */}
            <div
                style={{
                    display: "flex",
                    justifyContent: collapsed ? "center" : "space-between",
                    alignItems: "center",
                    marginBottom: 16,
                }}
            >
                {!collapsed && (
                    <Link href="/" style={{ fontSize: "0.95rem", letterSpacing: "0.1em" }}>
                        INTERPOLATION LAB
                    </Link>
                )}

                <button
                    onClick={() => setCollapsed((v) => !v)}
                    style={{
                        border: "1px solid rgba(255,255,255,.15)",
                        background: "transparent",
                        color: "var(--text-primary)",
                        cursor: "pointer",
                        width: 32,
                        height: 32,
                    }}
                >
                    {collapsed ? "›" : "‹"}
                </button>
            </div>

            {/* CONTENT */}
            {!collapsed && (
                <div style={{ flex: 1 }}>
                    {Object.entries(grouped).map(([category, items]) => (
                        <div key={category} style={{ marginBottom: 16 }}>
                            <div className="label" style={{ marginBottom: 8 }}>
                                {category}
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                {items.map((item) => {
                                    const isActive = pathname === item.path;

                                    const dx = item.x - (current?.x ?? 0);
                                    const dy = item.y - (current?.y ?? 0);

                                    const distance = Math.sqrt(dx * dx + dy * dy);
                                    const biasOpacity = isActive ? 1 : Math.max(0.3, 1 - distance * 0.2);

                                    return (
                                        <Link key={item.path} href={item.path}>
                                            <div
                                                style={{
                                                    padding: "8px 10px",
                                                    border: "1px solid rgba(255,255,255,.08)",
                                                    background: isActive
                                                        ? "rgba(255,255,255,0.08)"
                                                        : "transparent",
                                                    color: isActive
                                                        ? "var(--text-primary)"
                                                        : "var(--text-muted)",
                                                    cursor: "pointer",
                                                    opacity: biasOpacity,
                                                    transform: `translateX(${dx * 2}px)`,
                                                    transition: "all 0.25s ease",
                                                }}
                                            >
                                                {item.name}
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}