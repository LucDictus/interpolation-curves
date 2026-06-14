type Props = {
    title: string;
    children: React.ReactNode;
};

export default function ControlPanel({ title, children }: Props) {
    return (
        <div
            className="panel"
            style={{
                position: "fixed",
                top: 25,
                right: 25,
                width: 300,
                padding: 16,
                zIndex: 1000,
            }}
        >
            <div className="label">{title}</div>
            {children}
        </div>
    );
}