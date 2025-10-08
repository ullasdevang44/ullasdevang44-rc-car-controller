import React, { useState, useEffect } from "react";

export const ConnectBluetooth = ({ setServer, setStatus }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isBluetoothAvailable, setIsBluetoothAvailable] = useState(true);

  useEffect(() => {
    if (!navigator.bluetooth) {
      console.error("Web Bluetooth API not available in this browser.");
      setStatus("Bluetooth unavailable. Use Chrome/Edge with HTTPS.");
      setIsBluetoothAvailable(false);
      return;
    }
    navigator.bluetooth.getAvailability().then(available => {
      if (!available) {
        setStatus("Bluetooth is disabled. Please enable it.");
        setIsBluetoothAvailable(false);
      } else {
        setIsBluetoothAvailable(true);
      }
    }).catch(error => {
      console.error("Bluetooth availability check error:", error);
      setStatus("Error checking Bluetooth. Try again.");
      setIsBluetoothAvailable(false);
    });
  }, [setStatus]);

  const connectBluetooth = async () => {
    if (isConnecting || isConnected || !isBluetoothAvailable) return;

    setIsConnecting(true);
    setStatus("Scanning for devices...");
    console.log("Scanning for devices...");

    try {
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [
          0xffe0,
          "00001101-0000-1000-8000-00805f9b34fb",
          "6e400001-b5a3-f393-e0a9-e50e24dcca9e",
        ],
      });

      console.log("Device selected:", device.name, device.id);
      setStatus(`Connecting to ${device.name || "device"}...`);

      device.addEventListener("gattserverdisconnected", () => {
        console.log("Device disconnected:", device.name);
        setStatus("Disconnected. Please reconnect.");
        setServer(null);
        setIsConnected(false);
        setIsConnecting(false);
      });

      const server = await device.gatt.connect();
      setServer(server);

      const services = await server.getPrimaryServices();
      console.log("Available services:", services.map(s => s.uuid));

      setStatus(`Connected to ${device.name || "device"}`);
      setIsConnected(true);
      setIsConnecting(false);
    } catch (error) {
      console.error("Connection failed:", error);
      let errorMessage = "Connection failed";
      if (error.name === "NotFoundError") {
        errorMessage = "No device selected. Ensure device is powered on and in range.";
      } else if (error.name === "SecurityError") {
        errorMessage = "Bluetooth access denied. Pair the device in your OS settings.";
      } else if (error.name === "BluetoothError") {
        errorMessage = "Bluetooth unavailable. Check device settings.";
      }
      setStatus(errorMessage);
      setIsConnected(false);
      setIsConnecting(false);
    }
  };

  return (
    <button
      onClick={connectBluetooth}
      disabled={isConnecting || isConnected || !isBluetoothAvailable}
      className={`connect-button ${isConnecting || isConnected || !isBluetoothAvailable ? "disabled" : ""}`}
    >
      {isBluetoothAvailable
        ? isConnecting
          ? "Connecting..."
          : isConnected
            ? "Connected"
            : "Connect to RC Car"
        : "Bluetooth Unavailable"}
    </button>
  );
};