import { useState, useEffect, lazy, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

const Webchat = lazy(() => import('@botpress/webchat').then(m => ({ default: m.Webchat })));
const Fab = lazy(() => import('@botpress/webchat').then(m => ({ default: m.Fab })));

function ChatWidget() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
    return () => setIsReady(false);
  }, []);

  if (!isReady) return null;

  return (
    <ErrorBoundary fallback={<div>Chat unavailable</div>}>
      <Suspense fallback={<div>Loading chat...</div>}>
        <ChatInterface />
      </Suspense>
    </ErrorBoundary>
  );
}

function ChatInterface() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isOpen && (
        <Webchat
          clientId="e4daeba3-c296-4803-9af6-91c0c80ab5de"
          style={{
            width: 'min(400px, 100vw - 40px)',
            height: '600px',
            position: 'fixed',
            bottom: '90px',
            right: '20px',
          }}
        />
      )}
      <Fab
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '64px',
          height: '64px'
        }}
      />
    </>
  );
}

export default ChatWidget;