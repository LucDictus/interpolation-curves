import { SecondOrderParams } from "../types/SecondOrderParams";
import React from "react";

type Props = {
  params: SecondOrderParams;
  setParams: React.Dispatch<React.SetStateAction<SecondOrderParams>>;
};

export default function SettingsTab({ params, setParams }: Props) {
  return (
    <div
        className="panel"
        style={{
            position: "fixed",
            top: 24,
            right: 24,
            width: 300,
            padding: 16,
            zIndex: 1000,
        }}
    >
        <div className="label">
            MOTION PARAMETERS
        </div>

        <div style={{ marginTop: 20 }}>
            <div className="label">
                FREQUENCY
            </div>

            <div className="value">
                {params.frequency.toFixed(2)}
            </div>

            <input
                style={{ width: "100%" }}
                type="range"
                min="0.1"
                max="10"
                step="0.1"
                value={params.frequency}
                onChange={(e) =>
                    setParams((p) => ({
                        ...p,
                        frequency: Number(e.target.value),
                    }))
                }
            />
        </div>

        <div style={{ marginTop: 20 }}>
            <div className="label">
                DAMPING
            </div>

            <div className="value">
                {params.damping.toFixed(2)}
            </div>

            <input
                style={{ width: "100%" }}
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={params.damping}
                onChange={(e) =>
                    setParams((p) => ({
                        ...p,
                        damping: Number(e.target.value),
                    }))
                }
            />
        </div>

        <div style={{ marginTop: 20 }}>
            <div className="label">
                RESPONSE
            </div>

            <div className="value">
                {params.response.toFixed(2)}
            </div>

            <input
                style={{ width: "100%" }}
                type="range"
                min="0.1"
                max="10"
                step="0.1"
                value={params.response}
                onChange={(e) =>
                    setParams((p) => ({
                        ...p,
                        response: Number(e.target.value),
                    }))
                }
            />
        </div>

        <button
            onClick={() =>
                setParams({
                    frequency: 1,
                    damping: 0.7,
                    response: 1,
                })
            }
            style={{
                marginTop: 24,
                width: "100%",
                border: "1px solid rgba(255,255,255,.15)",
                background: "transparent",
                padding: 10,
                cursor: "pointer",
            }}
        >
            RESET
        </button>
    </div>
  );
}