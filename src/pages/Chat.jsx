import { useState, useEffect, useRef } from "react";
import { RiRobot3Line } from "react-icons/ri";
import { useAuth } from "../Context/authContext";

const Chat = () => {
  const { currentUser } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationVersion, setConversationVersion] = useState(0);
  const [lastTimestamp, setLastTimestamp] = useState(Date.now());
  const [userId] = useState(() => {
    return currentUser?.uid || `user-${Math.random().toString(36).substr(2, 9)}`;
  });
  const messagesEndRef = useRef(null);

  const getConversationId = () => `${userId}-${conversationVersion}`;

   const sendMessage = async (text) => {
    if (!text?.trim()) return;

    setIsLoading(true);
    const userMessage = {
      id: `msg-${Date.now()}`,
      text: text.trim(),
      sender: "user",
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");

    try {
      const response = await fetch("/.netlify/functions/botpress-proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "text",
          text: text.trim(),
          userId: userId,
          conversationId: getConversationId(),
          payload: {
            text: text.trim(),
            type: "text"
          }
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }
      
      console.log("Botpress response:", data);
    } catch (error) {
      console.error("Error:", error);
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        text: "Sorry, there was an error sending your message",
        sender: "bot"
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    let active = true;
    let retryCount = 0;
    const maxRetries = 3;

    const poll = async () => {
      try {
        const url = `/.netlify/functions/botpress-webhook?conversationId=${getConversationId()}&lastTimestamp=${lastTimestamp}`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const { messages: newMessages, lastTimestamp: newTimestamp } =
          await response.json();

        if (active && newMessages.length > 0) {
          setMessages((prev) => {
            const existingIds = new Set(prev.map((m) => m.id));
            const filtered = newMessages.filter(
              (msg) => !existingIds.has(msg.id)
            );
            return filtered.length > 0 ? [...prev, ...filtered] : prev;
          });
          setLastTimestamp(newTimestamp);
          retryCount = 0;
        }
      } catch (error) {
        console.error("Polling error:", error);
        if (retryCount < maxRetries) {
          retryCount++;
          await new Promise((resolve) =>
            setTimeout(resolve, 1000 * retryCount)
          );
          if (active) poll();
        } else if (active) {
          setMessages((prev) => [
            ...prev,
            {
              id: `error-${Date.now()}`,
              text: "Connection issues. Please refresh.",
              sender: "system",
            },
          ]);
        }
      }
    };

    poll();
    const pollInterval = setInterval(poll, 3000);

    return () => {
      active = false;
      clearInterval(pollInterval);
    };
  }, [isOpen, conversationVersion, userId, lastTimestamp]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
                  setMessages([]);
                  setConversationVersion((prev) => prev + 1);
                  setLastTimestamp(Date.now());
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
        <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200">
            <div className="flex">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message..."
                disabled={isLoading}
                className={`w-30 md:w-auto flex-1 border border-gray-300 rounded-l-lg py-2 px-1 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                  isLoading ? "opacity-50" : ""
                }`}
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className={`bg-black text-white px-4 rounded-r-lg hover:bg-gray-800 transition ${
                  isLoading || !inputValue.trim() ? "opacity-50" : ""
                }`}
              >
                {isLoading ? "Sending..." : "Send"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          onClick={() => {
            setIsOpen(true);
            setLastTimestamp(Date.now());
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
