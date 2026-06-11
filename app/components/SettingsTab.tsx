import { SecondOrderParams } from "../types/SecondOrderParams";

type Props = {
  params: SecondOrderParams;
  setParams: React.Dispatch<React.SetStateAction<SecondOrderParams>>;
};

export default function SettingsTab({ params, setParams }: Props) {
  return (
    <div style={{ 
        position: "fixed", 
        top: 0, 
        right: 0, 
        width: 300, 
        height: "100vh",
        padding: "1rem", 
        borderLeft: "1px solid rgba(255, 255, 255, 0.8)", 
        backdropFilter: "blur(10px)", 
        zIndex: 1000 
    }}>
      <h2>Settings</h2>

      <p>Frequency (f): {params.frequency}</p>
      <input
        type="range"
        min="0.1"
        max="10"
        step="0.1"
        value={params.frequency}
        onChange={(e) =>
          setParams((p) => ({ ...p, frequency: Number(e.target.value) }))
        }
      />

      <p>Damping (zeta): {params.damping}</p>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={params.damping}
        onChange={(e) =>
          setParams((p) => ({ ...p, damping: Number(e.target.value) }))
        }
      />

      <p>Response (r): {params.response}</p>
      <input
        type="range"
        min="0.1"
        max="10"
        step="0.1"
        value={params.response}
        onChange={(e) =>
          setParams((p) => ({ ...p, response: Number(e.target.value) }))
        }
      />

      <p></p>
      <button 
        onClick={() => setParams({ frequency: 1, damping: 0.7, response: 1 })}
        style={{
            backgroundColor: "#0060d1",
            border: "none",
            padding: "0.5rem 1rem",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "1rem",
        }} 
      >
        Reset
      </button>
    </div>
  );
}