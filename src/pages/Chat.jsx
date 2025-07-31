import { useState, useEffect } from "react";
import { Fab, Webchat } from "@botpress/webchat";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <Webchat
        clientId="e4daeba3-c296-4803-9af6-91c0c80ab5de"
        style={{
          width: "400px",
          height: "600px",
          display: isOpen ? "flex" : "none",
          position: "fixed",
          bottom: "90px",
          right: "20px",
        }}
      />
      <Fab
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "64px",
          height: "64px",
        }}
      />
    </>
  );
}
