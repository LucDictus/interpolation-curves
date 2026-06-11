export default function Navigation() {
  return (
    <nav
        style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            padding: "1rem",
            gap: "1rem",
            borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(10px)",
            zIndex: 1000,
        }}
    >
        <h2> Second Order Motion Demo </h2>
    </nav>
  );
}
        
        