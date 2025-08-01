import { Fab, Webchat } from "@botpress/webchat";
import { useState } from "react";

function Chat() {
  const [isWebchatOpen, setIsWebchatOpen] = useState(false);

  const toggleWebchat = () => {
    setIsWebchatOpen((prev) => !prev);
  };

  return (
    <>
      <Webchat
        clientId="e4daeba3-c296-4803-9af6-91c0c80ab5de" // 🔁 Replace with your actual Client ID
        style={{
          width: "400px",
          height: "600px",
          display: isWebchatOpen ? "flex" : "none",
          position: "fixed",
          bottom: "90px",
          right: "20px",
          zIndex: 9999,
        }}
      />
      <Fab
        onClick={toggleWebchat}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "64px",
          height: "64px",
          zIndex: 9999,
        }}
      />
    </>
  );
}

export default Chat;
