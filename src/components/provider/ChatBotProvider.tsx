import React from "react";
import { t } from "i18next";
import { Avatar, Modal } from "zmp-ui";
import { 
  MainContainer, ChatContainer,
  MessageList, Message, MessageInput, MessageModel
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

import { useAppContext, useRouteNavigate } from "hooks";
import AVATAR from "assets/img/chatbot/avatar.png";
import { ChatBotCommunicationApi } from "api";
import { FailResponse, ServerResponse } from "types/server";

export type ChatbotCtx = {

}

export const ChatBotContext = React.createContext({} as ChatbotCtx);
export function useChatBot() { return React.useContext(ChatBotContext) }

export function ChatBotProvider({ children }: { children: React.ReactNode }) {
  const { appId } = useAppContext();
  const { currentPath, rootPath } = useRouteNavigate();
  const availableRoutes = [ rootPath, `/zapps/${appId}/account`, "/" ]

  const [ chatHistory, setChatHistory ] = React.useState<any[]>([]);
  const [ disable, setDisable ] = React.useState<boolean>(true);

  React.useEffect(() => {
    if (availableRoutes.includes(currentPath)) setDisable(false);
    else setDisable(true);
  }, [ currentPath ])

  const buildBotMessage = (message: string) => {
    const botMessage: MessageModel = {
      message: message,
      sender: 'bot',
      direction: "incoming",
      position: "normal",
      sentTime: new Date().toDateString(),
    };
    setChatHistory(prev => [...prev, botMessage]);
  }

  const onSend = (message: string) => {
    const userMessage: MessageModel = {
      message: message,
      sender: "user",
      direction: "outgoing",
      position: "normal",
      sentTime: new Date().toDateString(),
    }
    setChatHistory(prev => [...prev, userMessage]);

    ChatBotCommunicationApi.anonymousTalk({
      message: message,
      success: (response: ServerResponse) => {
        if (response.status === "success") {
          const data = response.data as any; 
          buildBotMessage(data.message);
        } else {
          buildBotMessage(t("retry"));
        }
      },
      fail: (error: FailResponse) => {
        buildBotMessage(t("retry"));
      }
    })
  }

  const CONTEXT = {

  } as ChatbotCtx;

  return (
    <ChatBotContext.Provider value={CONTEXT}>
      {children}

      <UIChatBox disable={disable} chatHistory={chatHistory} onSend={onSend}/>
    </ChatBotContext.Provider>
  )
}

interface UIChatBoxProps {
  disable: boolean;
  chatHistory: any[];
  onSend: (message: string) => void;
}
function UIChatBox(props: UIChatBoxProps) {  
  const { chatHistory, onSend, disable } = props;
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
      <UIChatBoxButton onClick={onOpen} disable={disable}/>

      <Modal 
        actions={[
          { text: t("close"), close: true }
        ]} 
        title={t("Trợ lý Gia Phả")}
        className="text-primary" width={"100%"}
        visible={visible} onClose={onClose} 
      >
        <MainContainer style={{ height: "55vh" }}>
          <ChatContainer>

            <MessageList> {MESSAGES} </MessageList>

            <MessageInput 
              placeholder={t("đặt câu hỏi...")}
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
  disable: boolean;
  onClick: () => void;
}
function UIChatBoxButton(props: UIChatBoxButtonProps) {
  // initial position
  const margin: number = 75;
  const initialX: number = window.innerWidth - margin;
  const initialY: number = window.innerHeight - 180;

  const { onClick, disable } = props;
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
    const maxX = window.innerWidth - margin;
    const maxY = window.innerHeight - margin;
    
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
  };

  const handleMouseMove = (e: MouseEvent) => {
    handleMove(e.clientX, e.clientY);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: TouchEvent) => {
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleTouchMove);
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
      className="button circle border-secondary" 
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      style={{
        position: "absolute", zIndex: 999,
        width: "4.5rem", height: "4.5rem",
        left: position.x, top: position.y,
        opacity: isDragging ? 1 : 0.8,
        display: disable ? "none" : "block",
        transform: isDragging ? "scale(1.2)" : "scale(1)",
        transition: "transform 0.2s ease, opacity 0.2s ease",
      }} 
      onClick={onClick}
    >
      <Avatar
        src={AVATAR} style={{ width: "100%", height: "100%" }}
      />

    </div>
  )
}