import mondaySdk from "monday-sdk";
import { useEffect } from "react";

const monday = mondaySdk();

export default function App() {
  useEffect(() => {
    monday.listen("context", res => {
      console.log("Context received:", res);
    });
  }, []);

  return (
    <div style={{ padding: "20px", fontSize: "24px" }}>
      Hello, Pomodoro World!
    </div>
  );
}
