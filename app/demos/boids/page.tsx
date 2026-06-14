"use client";

import { useRef, useState } from "react";
import BoidsCanvas from "./components/BoidsCanvas";
import BoidsControls from "./components/BoidsControls";
import { BoidsParams } from "./types";

const DEFAULT_PARAMS: BoidsParams = {
    separationDist: 40,
    separationForce: 0.05,
    alignmentDist: 80,
    alignmentForce: 0.02,
    cohesionDist: 120,
    cohesionForce: 0.001,
    speed: 2,
    predatorDist: 120,
    predatorForce: 0.15,
};

export default function BoidsDemo() {
    const [params, setParams] = useState<BoidsParams>(DEFAULT_PARAMS);
    const resetRef = useRef<() => void>(() => {});

    const handleReset = () => {
        setParams(DEFAULT_PARAMS);
        resetRef.current();
    };

    return (
        <>
            <BoidsCanvas
                params={params}
                onReset={(fn) => { resetRef.current = fn; }}
            />
            <BoidsControls
                params={params}
                setParams={setParams}
                onReset={handleReset}
            />
        </>
    );
}