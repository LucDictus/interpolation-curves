import CursorFollower from "./components/CurserFollower";

export default function Home() {
  return (
    <main
      style={{
        height: "100vh",
      }}
    >
      <h1>Second Order Motion Demo</h1>

      <CursorFollower />
    </main>
  );
}