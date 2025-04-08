import React from "react";
import { t } from "i18next";
import { Modal } from "zmp-ui";
import { 
  MainContainer, ChatContainer,
  MessageList, Message, MessageInput,
  TypingIndicator, Avatar,
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

import { DateTimeUtils } from "utils";
import { ChatBotCommunicationApi } from "api";
import { useAccountContext, useAppContext, useNotification, useRouteNavigate } from "hooks";

import { FailResponse, ServerResponse } from "types/server";

import AVATAR from "assets/img/chatbot/avatar.png";

export type ChatBotCtx = {}
export type ChatBotType = "anonymous" | "public";
export type ChatSenderRole = "user" | "assistant";

export const ChatBotContext = React.createContext({} as ChatBotCtx);
export function useChatBot() { return React.useContext(ChatBotContext) }

export function ChatBotProvider({ children }: { children: React.ReactNode }) {
  const { appId, logedIn } = useAppContext();
  const { needRegisterClan, needRegisterAccount } = useAccountContext();
  const { currentPath, rootPath } = useRouteNavigate();

  const [ type, setType ] = React.useState<ChatBotType>("anonymous");
  const [ disable, setDisable ] = React.useState<boolean>(true);

  const routesAllowChatBot = [ 
    rootPath, 
    `/zapps/${appId}/account` 
  ]

  React.useEffect(() => {
    if (routesAllowChatBot.includes(currentPath)) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  }, [ currentPath ])

  React.useEffect(() => {
    if (logedIn) {
      if (needRegisterClan || needRegisterAccount) {
        setType("anonymous");
      } else {
        setType("public");
      }
    } else {
      setType("anonymous");
    }
  }, [ logedIn, needRegisterClan, needRegisterAccount ])

  const CONTEXT = {} as ChatBotCtx;

  return (
    <ChatBotContext.Provider value={CONTEXT}>
      {children}

      <UIChatBox disable={disable} type={type}/>
    </ChatBotContext.Provider>
  )
}

function useChatHistory({ sessionId, type, dependencies }: { 
  sessionId: string, type: ChatBotType, dependencies: any[] 
}) {
  const [ chatHistory, setChatHistory ] = React.useState<ChatHistoryMessage[]>([]);
  const [ loading, setLoading ]         = React.useState<boolean>(false);
  const [ error, setError ]             = React.useState<boolean>(false);
  const [ reload, setReload ]           = React.useState(false);

  const refresh = () => setReload(!reload);

  React.useEffect(() => {

    setLoading(true);
    setError(false);

    if (sessionId == "") {
      console.error("Session ID is empty");
      return;
    };

    ChatBotCommunicationApi.getChatHistory({
      sessionId: sessionId,
      success: (response: ServerResponse) => {
        setLoading(false);
        if (response.status === "success") {
          setChatHistory(response.data as ChatHistoryMessage[]);
        } else {
          setError(true);
          setChatHistory([]);
        }
      },
      fail: (error: FailResponse) => {
        setLoading(false);
        setError(true);
        setChatHistory([]);
      }
    })

  }, [ ...dependencies, reload ])

  return { chatHistory, loading, error, refresh, updateHistory: setChatHistory };
}

interface ChatHistoryMessage {
  role: ChatSenderRole;
  sender?: string;
  content: string;
  timestamp: string;
}
interface UIChatBoxProps {
  type: ChatBotType;
  disable: boolean;
}
function UIChatBox(props: UIChatBoxProps) {  
  const { type, disable } = props;
  const { zaloUserInfo } = useAppContext();
  const { dangerToast } = useNotification();
  const { chatHistory, loading, error, refresh, updateHistory } = useChatHistory({ 
    sessionId: zaloUserInfo.id, 
    type: type, 
    dependencies: [ zaloUserInfo.id ] 
  });
  const [ visible, setVisible ]   = React.useState(false);
  const [ deleteWarning, setDeleteWarning ] = React.useState(false);
  const [ isTyping, setIsTyping ] = React.useState(false);

  const onOpen = () => {
    setVisible(true);
    refresh();
  };
  const onClose = () => setVisible(false);

  const buildBotMessage = (message: string) => {
    const botMessage: ChatHistoryMessage = {
      role: "assistant",
      content: message,
      timestamp: DateTimeUtils.getNow(),
    };
    updateHistory(prev => [...prev, botMessage]);
  }

  const chat = (message: string) => {
    setIsTyping(true);

    const userMessage: ChatHistoryMessage = {
      role: "user",
      sender: zaloUserInfo.id,
      content: message,
      timestamp: DateTimeUtils.getNow(),
    }
    updateHistory(prev => [...prev, userMessage]);

    // TODO: chat by type
    ChatBotCommunicationApi.anonymousChat({
      prompt: message,
      zaloId: zaloUserInfo.id,
      success: (response: ServerResponse) => {
        setIsTyping(false);
        if (response.status === "success") {
          const data = response.data as ChatHistoryMessage; 
          buildBotMessage(data.content);
        } else {
          buildBotMessage(t("retry"));
        }
      },
      fail: (error: FailResponse) => {
        setIsTyping(false);
        buildBotMessage(t("retry"));
      }
    });
  }

  const renderAvatar = (role: ChatSenderRole) => {
    if (role === "assistant") {
      return <Avatar src={AVATAR}/>
    } else return undefined;
  }

  const clearChatHistory = () => {
    setDeleteWarning(false);
    ChatBotCommunicationApi.clearChatHistory({
      sessionId: zaloUserInfo.id,
      success: (response: ServerResponse) => {
        if (response.status === "success") {
          updateHistory([]);
        } else {
          dangerToast(t("xoá thất bại"));
        }
      },
      fail: (error: FailResponse) => {
        console.error(error);
        dangerToast(t("xoá thất bại"));
      }
    })
  }

  const MESSAGES = React.useMemo(() => {
    return chatHistory.map((message: ChatHistoryMessage) => {
      const direction = message.role === "user" ? "outgoing" : "incoming";
      return (
        <Message
          key={message.timestamp}
          model={{
            message: message.content,
            sentTime: message.timestamp,
            sender: message.sender,
            direction: direction,
            position: "single",
            type: "html", // Render html content from chatbot
          }}
        >
          {renderAvatar(message.role)}
        </Message>
      ) as React.ReactNode;
    });
  }, [ chatHistory ]);

  return (
    <>
      <UIChatBoxButton onClick={onOpen} disable={disable}/>

      <Modal 
        actions={[
          { text: t("🗑️ xoá lịch sử"), onClick: () =>  setDeleteWarning(true) },
          { text: t("close"), close: true },
        ]} 
        title={t("Trợ lý Gia Phả")}
        className="text-primary" width={"100%"}
        visible={visible} onClose={onClose} 
      >
        <MainContainer style={{ height: "55vh" }}>
          <ChatContainer>

            <MessageList
              typingIndicator={isTyping ? <TypingIndicator content={t("🧠 đang suy nghĩ")} /> : undefined}
              scrollBehavior="smooth" autoScrollToBottom={true} autoScrollToBottomOnMount={true}
            > 
              {MESSAGES} 
            </MessageList>

            <MessageInput 
              placeholder={t("đặt câu hỏi...")}
              attachButton={false} autoFocus={true} fancyScroll={true}
              onSend={(innerHtml: string, textContent: string, innerText: string, nodes: NodeList) => {
                chat(textContent);
              }}
            />

          </ChatContainer>
        </MainContainer>
      </Modal>

      <Modal
        className="text-primary"
        visible={deleteWarning}
        title={t("Hành động không thể hoàn tác")}
        description={t("Bạn có chắc muốn xóa lịch sử trò chuyện?")}
        mask maskClosable
        onClose={() => setDeleteWarning(false)}
        actions={[
          { text: `🗑️ ${t("delete")}`, onClick: clearChatHistory },
          { text: t("close"), close: true },
        ]}
      />
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