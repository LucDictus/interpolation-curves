"use client";

import { useState } from "react";
import CursorFollower from "./components/CurserFollower";
import SettingsPanel from "./components/SettingsPanel";
import { SecondOrderParams } from "./types";

export default function SecondOrderDemo() {
    const [params, setParams] = useState<SecondOrderParams>({
        frequency: 2,
        damping: 0.5,
        response: 2,
    });

    return (
        <main style={{ width: "100vw", height: "100vh", position: "relative" }}>
            <SettingsPanel params={params} setParams={setParams} />
            <CursorFollower params={params} />
        </main>
    );
}