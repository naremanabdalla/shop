import { useState, useEffect, useRef } from "react";
import { RiRobot3Line } from "react-icons/ri";
import { useAuth } from "../Context/authContext";

const Chat = () => {
  const { currentUser } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("chatMessages");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationVersion, setConversationVersion] = useState(0);
  const [userId] = useState(() => {
    return (
      currentUser?.uid ||
      localStorage.getItem("chatUserId") ||
      `user-${crypto.randomUUID()}`
    );
  });
  const messagesEndRef = useRef(null);
  const conversationId = `conv_${userId}_${Date.now()}`;
  const BOTPRESS_CONFIG = {
    webhookUrl:
      "https://webhook.botpress.cloud/667e3082-09f1-4ad3-9071-30ade020ef3b",
    accessToken: "bp_pat_se5aRM9MJCiKOr8oH0E7YuXBHBKdDijQn4nD",
    botId: "b20dd108-4e50-43dc-8c55-1be2ee2a5417",
  };

  const sendMessage = async (textOrEvent) => {
    setIsLoading(true);

    // Handle both string input and event cases
    let text;
    if (typeof textOrEvent === "string") {
      text = textOrEvent; // Direct text passed (e.g., from buttons)
    } else {
      text = inputValue; // Default to inputValue for button clicks
    }

    // Validate text
    if (!text?.trim()) {
      setIsLoading(false);
      return;
    }

    const userMessage = {
      id: `msg-${Date.now()}`,
      text: text.trim(),
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue(""); // Always clear input after send

    try {
      const response = await fetch("/.netlify/functions/botpress-proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          messageId: userMessage.id,
          conversationId: `conv_${userId}_${Date.now()}`,
          type: "text",
          text: text.trim(),
          payload: { website: "https://shopping022.netlify.app/" },
        }),
      });
      const data = await response.json();
      console.log("Proxy response:", data);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          text: "Sorry, there was an error. Please try again.",
          sender: "bot",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  useEffect(() => {
    if (!currentUser && !localStorage.getItem("chatUserId")) {
      localStorage.setItem("chatUserId", userId);
    }
  }, [userId]);
  useEffect(() => {
    if (!isOpen) return;

    let active = true;
    let lastTimestamp = Date.now();

    const poll = async () => {
      try {
        const url = `/.netlify/functions/botpress-webhook?userId=${userId}&lastTimestamp=${lastTimestamp}`;
        const response = await fetch(url);
        const { messages: newMessages = [] } = await response.json();

        if (active && newMessages.length > 0) {
          setMessages((prev) => {
            const existingIds = new Set(prev.map((m) => m.id));
            const filtered = newMessages.filter(
              (msg) => !existingIds.has(msg.id)
            );
            return [...prev, ...filtered];
          });
          lastTimestamp = Date.now();
        }
      } catch (error) {
        console.error("Polling error:", error);
      }
    };

    // Immediate poll then set interval
    poll();
    const pollInterval = setInterval(poll, 3000);

    return () => {
      active = false;
      clearInterval(pollInterval);
    };
  }, [isOpen, conversationVersion, userId]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("chatMessages", JSON.stringify(messages));
    }
  }, [messages]);

 
  return (
    <div className="fixed bottom-6 right-6 z-100">
      {isOpen ? (
        <div className="w-60 md:w-99 h-100 bg-white rounded-lg shadow-xl flex flex-col">
          {/* Chat header */}
          <div className="bg-black text-white p-3 rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold">Shopping Bot</h3>
            <div>
              <button
                onClick={() => {
                  localStorage.removeItem("chatMessages");
                  setMessages([]);
                  setConversationVersion((prev) => prev + 1); // Force new conversation
                }}
                className="text-xs bg-[color:var(--color-primary)] px-2 py-1 rounded mr-2"
              >
                New Chat
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-300"
              >
                ×
              </button>
            </div>
          </div>

          {/* Messages container */}
          <div className="flex-1 p-3 overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-3 ${
                  message.sender === "user" ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block p-2 rounded-lg ${
                    message.sender === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  {message.text}

                  {/* Add this block right after {message.text} */}
                  {message.rawData?.payload?.options && (
                    <div className="flex space-x-2 mt-2">
                      {message.rawData.payload.options.map((option) => (
                        <button
                          key={option.value}
                          className="bg-blue-100 px-3 py-1 rounded text-sm"
                          onClick={() => sendMessage(option.value)}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="p-3 border-t border-gray-200">
            <div className="flex">
              <input
                disabled={isLoading}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className={`w-30 md:w-auto flex-1 border border-gray-300 rounded-l-lg py-2 px-1  focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                  isLoading ? "opacity-50" : ""
                }`}
              />
              <button
                onClick={() => sendMessage()} // No event passed
                className="bg-black text-white px-4 rounded-r-lg hover:bg-gray-800 transition"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => {
            setIsOpen(true);
          }}
          className="bg-black text-2xl text-[color:var(--color-primary)] rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-gray-800 transition"
        >
          <RiRobot3Line />
        </button>
      )}
    </div>
  );
};

export default Chat;
