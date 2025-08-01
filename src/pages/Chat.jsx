import { useState, useEffect, useRef } from "react";

export default function Chat() {
  const [isOpen, setIsOpen] = useState(false);
  const webchatRef = useRef(null);
  const fabRef = useRef(null);

  useEffect(() => {
    // Dynamic import with manual DOM mounting
    import("@botpress/webchat").then(({ Webchat, Fab }) => {
      // Create container divs
      const webchatContainer = document.createElement("div");
      const fabContainer = document.createElement("div");

      // Apply styles
      webchatContainer.style.cssText = `
        width: min(400px, 95vw);
        height: 70vh;
        max-height: 600px;
        position: fixed;
        bottom: 90px;
        right: 20px;
        z-index: 1000;
        display: ${isOpen ? "block" : "none"};
      `;

      fabContainer.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 64px;
        height: 64px;
        z-index: 1001;
      `;

      // Mount to DOM
      document.body.appendChild(webchatContainer);
      document.body.appendChild(fabContainer);

      // Render components directly
      Webchat.render(
        {
          clientId: "e4daeba3-c296-4803-9af6-91c0c80ab5de",
        },
        webchatContainer
      );

      Fab.render(
        {
          onClick: () => setIsOpen(!isOpen),
        },
        fabContainer
      );

      // Save references
      webchatRef.current = { container: webchatContainer, instance: Webchat };
      fabRef.current = { container: fabContainer, instance: Fab };

      return () => {
        // Cleanup
        document.body.removeChild(webchatContainer);
        document.body.removeChild(fabContainer);
      };
    });
  }, [isOpen]);

  return null; // No React rendering
}
