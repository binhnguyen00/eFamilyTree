import React from "react";
import { t } from "i18next";
import { Modal } from "zmp-ui";
import { 
  MainContainer, ChatContainer,
  MessageList, Message, MessageInput, MessageModel
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

export type ChatbotCtx = {

}

export const ChatBotContext = React.createContext({} as ChatbotCtx);
export function useChatBot() { return React.useContext(ChatBotContext) }

export function ChatBotProvider({ children }: { children: React.ReactNode }) {
  const [ chatHistory, setChatHistory ] = React.useState<any[]>([]);

  const onSend = (message: string) => {
    console.log(message);
    
    const userMessage: MessageModel = {
      message: message,
      sender: "user",
      direction: "outgoing",
      position: "normal",
      sentTime: new Date().toDateString(),
    }
    setChatHistory(prev => [...prev, userMessage]);

    // TODO: remove
    setTimeout(() => {
      const botMessage: MessageModel = {
        message: t("I'm a genealogy assistant. How can I help you?"),
        sender: 'bot',
        direction: "incoming",
        position: "normal",
        sentTime: new Date().toDateString(),
      };
      setChatHistory(prev => [...prev, botMessage]);
    }, 1000);
  }

  const CONTEXT = {

  } as ChatbotCtx;

  return (
    <ChatBotContext.Provider value={CONTEXT}>
      {children}

      <UIChatBox chatHistory={chatHistory} onSend={onSend}/>
    </ChatBotContext.Provider>
  )
}

interface UIChatBoxProps {
  chatHistory: any[];
  onSend: (message: string) => void;
}
function UIChatBox(props: UIChatBoxProps) {  
  const { chatHistory, onSend } = props;
  const [ visible, setVisible ] = React.useState(false);

  const onOpen = () => setVisible(true);
  const onClose = () => setVisible(false);

  const MESSAGES = React.useMemo(() => {
    return chatHistory.map((message: MessageModel) => {
      const direction = message.sender === 'user' ? 'outgoing' : 'incoming';
      return (
        <Message
          key={message.sentTime}
          model={{
            message: message.message,
            sender: message.sender,
            sentTime: message.sentTime,
            direction: direction,
            position: "normal"
          }}
        />
      ) as React.ReactNode;
    });
  }, [chatHistory]);

  return (
    <>
      <UIChatBoxButton onClick={onOpen}/>

      <Modal 
        actions={[
          { text: t("close"), close: true }
        ]} 
        title={t("trợ lý gia phả")}
        className="text-primary" width={"100%"}
        visible={visible} onClose={onClose} 
      >
        <MainContainer style={{ height: "55vh" }}>
          <ChatContainer>

            <MessageList> {MESSAGES} </MessageList>

            <MessageInput 
              placeholder="hỏi bất cứ thứ gì..."
              attachButton={false} autoFocus={true} fancyScroll={true}
              onSend={(innerHtml: string, textContent: string, innerText: string, nodes: NodeList) => {
                onSend(textContent);
              }}
            />

          </ChatContainer>
        </MainContainer>
      </Modal>
    </>
  )
}

interface UIChatBoxButtonProps {
  onClick: () => void;
}
function UIChatBoxButton(props: UIChatBoxButtonProps) {
  // initial position
  const initialX: number = window.innerWidth - 95; // 80 = button width (5rem) + margin
  const initialY: number = window.innerHeight - 180;

  const { onClick } = props;
  const [ isDragging, setIsDragging ] = React.useState(false);
  const [ position, setPosition ]     = React.useState({ x: initialX, y: initialY });
  const [ dragOffset, setDragOffset ] = React.useState({ x: 0, y: 0 });

  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    setDragOffset({
      x: clientX - position.x,
      y: clientY - position.y
    });
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    
    const newX = clientX - dragOffset.x;
    const newY = clientY - dragOffset.y;
    
    // Ensure the button stays within viewport
    const maxX = window.innerWidth - 80; // 80 = button width (5rem) + some margin
    const maxY = window.innerHeight - 80; // 80 = button height (5rem) + some margin
    
    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    });
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    handleStart(e.clientX, e.clientY);
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    handleMove(e.clientX, e.clientY);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
    e.preventDefault();
  };

  const handleTouchMove = (e: TouchEvent) => {
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
    e.preventDefault();
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleEnd);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleEnd);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleEnd);
      };
    } else return;
  }, [ isDragging, dragOffset ]);

  return (
    <div 
      id={"efamilytree-chatbot"}
      className="bg-secondary button circle center box-shadow-primary" 
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      style={{
        position: "absolute", zIndex: 999,
        width: "5rem", height: "5rem",
        left: position.x, top: position.y,
      }} 
      onClick={onClick}
    >
      {t("Bot")}
    </div>
  )
}