import React from "react";
import { Joystick } from "react-joystick-component";

export const JoystickComponent = ({ server, isDarkMode, sendCommand }) => {
  const handleMove = (event) => {
    const { direction } = event;
    if (!direction) return;

    switch (direction) {
      case "FORWARD":
        sendCommand("F");
        break;
      case "BACKWARD":
        sendCommand("B");
        break;
      case "LEFT":
        sendCommand("L");
        break;
      case "RIGHT":
        sendCommand("R");
        break;
      default:
        sendCommand("S");
    }
  };

  const handleStop = () => sendCommand("S");

  const outerContainerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "auto",
    minHeight: "280px",
    boxSizing: "border-box",
  };

  const joystickContainerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "10px",
    background: isDarkMode
      ? "rgba(255, 255, 255, 0.07)"
      : "rgba(0, 0, 0, 0.05)",
    backdropFilter: "blur(10px)",
    borderRadius: "24px",
    boxShadow: isDarkMode
      ? "0 6px 18px rgba(0, 0, 0, 0.3)"
      : "0 6px 18px rgba(0, 0, 0, 0.15)",
    border: isDarkMode
      ? "1px solid rgba(255, 255, 255, 0.15)"
      : "1px solid rgba(0, 0, 0, 0.1)",
    maxWidth: "260px",
    width: "100%",
    height: "260px",
    overflow: "hidden",
    transition: "all 0.3s ease",
  };

  return (
    <div style={outerContainerStyle}>
      <div className="joystick" style={joystickContainerStyle}>
        <Joystick
          size={150}
          move={handleMove}
          stop={handleStop}
          baseColor={isDarkMode ? "#2c3e50" : "#d8e0ea"}
          stickColor={isDarkMode ? "#2196f3" : "#1565c0"}
          baseShape="circle"
          stickShape="circle"
          controlPlaneShape="circle"
          throttle={25}
          minDistance={8}
        />
      </div>
    </div>
  );
};