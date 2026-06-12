"use client";

import { useState } from "react";
import Navigation from "../components/Navigaton";
import CursorFollower from "../components/CurserFollower";
import SettingsTab from "../components/SettingsTab";

export default function HomePage() {
  const [params, setParams] = useState({
    frequency: 2,
    damping: 0.5,
    response: 2,
  });

  return (
    <>
      <Navigation params={params} />

      <main
          style={{
              width: "100vw",
              height: "100vh",
              position: "relative",
          }}
      >
          <SettingsTab
              params={params}
              setParams={setParams}
          />

          <CursorFollower params={params} />
      </main>
    </>
  );
}