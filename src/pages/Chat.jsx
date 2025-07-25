import { useState, useEffect, useRef } from "react";

const Chat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [userId] = useState(`user-${Math.random().toString(36).substr(2, 9)}`);

  // const [conversationId, setConversationId] = useState("");
  const messagesEndRef = useRef(null);

  // Your Botpress API configuration
  // Your Botpress API configuration
  const BOTPRESS_CONFIG = {
    // Use the OUTGOING URL from your integration panel
    webhookUrl:
      "https://webhook.botpress.cloud/772fb704-48bc-435c-8b83-23d299738100",
    accessToken: "bp_pat_se5aRM9MJCiKOr8oH0E7YuXBHBKdDijQn4nD",
    botId: "eb06d6c7-b0f8-4a53-a360-84a24643ecac",
  };

  const sendMessage = async (text = inputValue) => {
    if (!text.trim()) return;

    const userMessage = {
      id: `msg-${Date.now()}`,
      text: text,
      sender: "user",
      userId: userId, // Make sure this is included
      conversationId: "remoteConversationIdD", // Consistent conversation ID
    };

    setMessages((prev) => [...prev, userMessage]);
    if (text === inputValue) setInputValue("");

    try {
      await fetch("/.netlify/functions/botpress-proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: userMessage.text,
          userId: userMessage.userId,
          conversationId: userMessage.conversationId,
          messageId: userMessage.id,
        }),
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  useEffect(() => {
    if (!isOpen || messages.length === 0) return;

    const lastMessageId = messages[messages.length - 1].id;
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(
          `/.netlify/functions/botpress-webhook?conversationId=remoteConversationIdD&lastMessageId=${lastMessageId}`
        );
        const { messages: newMessages } = await response.json();

        if (newMessages.length) {
          setMessages((prev) => [...prev, ...newMessages]);
        }
      } catch (error) {
        console.error("Polling error:", error);
      }
    }, 2000);

    return () => clearInterval(pollInterval);
  }, [isOpen, messages]); // Add messages to dependencies

  return (
    <div className="fixed bottom-6 right-6 z-100">
      {isOpen ? (
        <div className="w-99 h-100 bg-white rounded-lg shadow-xl flex flex-col">
          {/* Chat header */}
          <div className="bg-black text-white p-3 rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold">Support Bot</h3>
            <button
              onClick={() => {
                setIsOpen(false);
                setMessages([]); // Clear messages when closing
              }}
              className="text-white hover:text-gray-300"
            >
              ×
            </button>
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
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-l-lg p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                onClick={sendMessage}
                className="bg-black text-white px-4 rounded-r-lg hover:bg-gray-800 transition"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-black text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-gray-800 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Chat;
