type Props = {
    params: SecondOrderParams;
};

export default function Navigation({params}: Props) {
    return (
        <div
            className="panel"
            style={{
                position: "fixed",
                top: 24,
                left: 24,
                width: 280,
                padding: 16,
                zIndex: 1000,
            }}
        >
            <div
                style={{
                    fontSize: "1rem",
                    marginBottom: 12,
                    letterSpacing: "0.15em",
                }}
            >
                SECOND ORDER DEMO
            </div>

            <div className="label">Motion</div>

            <div
                style={{
                    marginTop: 8,
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    gap: 4,
                    fontSize: "0.8rem",
                }}
            >
                <span>FREQUENCY (f)</span>
                <span className="orange">{params.frequency}</span>

                <span>DAMPING (zeta)</span>
                <span className="orange">{params.damping}</span>

                <span>RESPONSE (r)</span>
                <span className="orange">{params.response}</span>
            </div>
        </div>
    );
}