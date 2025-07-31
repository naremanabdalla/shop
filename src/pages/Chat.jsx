import { useState, useMemo } from "react";
import {
  Container,
  Header,
  MessageList,
  Composer,
  useWebchat,
  Fab,
} from "@botpress/webchat";

const headerConfig = {
  botName: "SupportBot",
  botAvatar: "https://cdn.botpress.cloud/bot-avatar.png",
  botDescription: "Your virtual assistant for all things support.",

  phone: {
    title: "Call Support",
    link: "tel:+1234567890",
  },

  email: {
    title: "Email Us",
    link: "mailto:support@example.com",
  },

  website: {
    title: "Visit our website",
    link: "https://www.example.com",
  },

  termsOfService: {
    title: "Terms of Service",
    link: "https://www.example.com/terms",
  },

  privacyPolicy: {
    title: "Privacy Policy",
    link: "https://www.example.com/privacy",
  },
};

function Chat() {
  const [isWebchatOpen, setIsWebchatOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const webchatConfig = {
    clientId: "e4daeba3-c296-4803-9af6-91c0c80ab5de",
    enablePersistHistory: true,
  };

  // Initialize webchat only once
  const webchat = useWebchat(isInitialized ? webchatConfig : undefined);

  const { client, messages, isTyping, user, clientState, newConversation } =
    webchat || {
      client: null,
      messages: [],
      isTyping: false,
      user: null,
      clientState: "disconnected",
      newConversation: () => {},
    };

  const config = {
    botName: "SupportBot",
    botAvatar: "https://picsum.photos/id/80/400",
    botDescription: "Your virtual assistant for all things support.",
  };

  const enrichedMessages = useMemo(
    () =>
      messages.map((message) => {
        const { authorId } = message;
        const direction = authorId === user?.userId ? "outgoing" : "incoming";
        return {
          ...message,
          direction,
          sender:
            direction === "outgoing"
              ? { name: user?.name ?? "You", avatar: user?.pictureUrl }
              : { name: config.botName ?? "Bot", avatar: config.botAvatar },
        };
      }),
    [config.botAvatar, config.botName, messages, user]
  );

  const toggleWebchat = () => {
    if (!isInitialized) {
      setIsInitialized(true);
    }
    setIsWebchatOpen((prevState) => !prevState);
  };

  return (
    <>
      {isWebchatOpen && (
        <Container
          connected={clientState !== "disconnected"}
          style={{
            width: "500px",
            height: "800px",
            display: "flex",
            position: "fixed",
            bottom: "90px",
            right: "20px",
          }}
        >
          <Header
            defaultOpen={false}
            closeWindow={() => setIsWebchatOpen(false)}
            restartConversation={newConversation}
            disabled={false}
            configuration={headerConfig}
          />
          <MessageList
            botName={config.botName}
            botDescription={config.botDescription}
            isTyping={isTyping}
            headerMessage="Chat History"
            showMarquee={true}
            messages={enrichedMessages}
            sendMessage={client?.sendMessage}
          />
          <Composer
            disableComposer={false}
            isReadOnly={false}
            allowFileUpload={true}
            connected={clientState !== "disconnected"}
            sendMessage={client?.sendMessage}
            uploadFile={client?.uploadFile}
            composerPlaceholder="Type a message..."
          />
        </Container>
      )}
      <Fab
        onClick={toggleWebchat}
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

export default Chat;
