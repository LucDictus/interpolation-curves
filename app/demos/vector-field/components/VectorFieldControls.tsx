"use client";
import ControlPanel from "@/app/components/ui/ControlPanel";
import Slider from "@/app/components/ui/Slider";

type Props = {
    particleCount: number;
    setParticleCount: (v: number) => void;
    speed: number;
    setSpeed: (v: number) => void;
    scale: number;
    setScale: (v: number) => void;
    radius: number;
    setRadius: (v: number) => void;
    showArrows: boolean;
    setShowArrows: (v: boolean) => void;
};

export default function VectorFieldControls({
                                                particleCount, setParticleCount,
                                                speed, setSpeed,
                                                scale, setScale,
                                                radius, setRadius,
                                                showArrows, setShowArrows,
                                            }: Props) {
    return (
        <ControlPanel title="VECTOR FIELD">
            <Slider label="Particles" min={50} max={1000} step={50} value={particleCount} onChange={setParticleCount} decimals={0} />
            <Slider label="Flow Speed" min={0.1} max={3} step={0.1} value={speed} onChange={setSpeed} decimals={1} />
            <Slider label="Noise Scale" min={0.01} max={0.2} step={0.01} value={scale} onChange={setScale} decimals={2} />
            <Slider label="Mouse Radius" min={50} max={400} step={10} value={radius} onChange={setRadius} decimals={0} />
            <div style={{ marginTop: 15, display: "flex", alignItems: "center", gap: 8 }}>
                <input
                    type="checkbox"
                    checked={showArrows}
                    onChange={(e) => setShowArrows(e.target.checked)}
                />
                <span className="label">Show Field Arrows</span>
            </div>
        </ControlPanel>
    );
}