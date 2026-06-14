type Props = {
    label: string;
    min: number;
    max: number;
    step: number;
    value: number;
    onChange: (value: number) => void;
    decimals?: number;
};

export default function Slider({
    label,
    min,
    max,
    step,
    value,
    onChange,
    decimals = 2,
}: Props) {
    return (
        <div style={{ marginTop: 15 }}>
            <div className="label">{label}</div>
            <div className="value">{value.toFixed(decimals)}</div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                style={{ width: "100%" }}
                onChange={(e) => onChange(Number(e.target.value))}
            />
        </div>
    );
}