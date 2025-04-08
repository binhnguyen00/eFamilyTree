import { SuccessCB, FailCB } from "types/server"
import { BaseApi } from "./BaseApi";

export class ChatBotCommunicationApi extends BaseApi {
  
  public static anonymousChat({ prompt, zaloId, success, fail }: {
    prompt: any, zaloId: string, success: SuccessCB, fail?: FailCB
  }) {
    const header = this.initHeader();
    const body = this.initBody({
      prompt:      prompt,
      session_id:  zaloId
    })
    return this.server.POST("family-tree/chatbot/anonymous/chat", header, body, success, fail);
  }

  public static chat({ prompt, userId, clanId, chatHistory, success, fail }: {
    prompt: any, userId: number, clanId: number, chatHistory: any[],
    success: SuccessCB, fail?: FailCB
  }) {
    const header = this.initHeader();
    const body = this.initBody({
      user_id:          userId, 
      clan_id:          clanId,
      prompt:           prompt, 
      messages_history: chatHistory,
    })
    return this.server.POST("family-tree/chatbot/public/chat", header, body, success, fail);
  }

  public static getChatHistory({ sessionId, success, fail }: {
    sessionId: string, success: SuccessCB, fail?: FailCB
  }) {
    const header = this.initHeader();
    const body = this.initBody({
      session_id: sessionId
    })
    return this.server.POST("family-tree/chatbot/history", header, body, success, fail);
  }

  public static clearChatHistory({ sessionId, success, fail }: {
    sessionId: string, success: SuccessCB, fail?: FailCB
  }) {
    const header = this.initHeader();
    const body = this.initBody({
      session_id: sessionId
    })
    return this.server.POST("family-tree/chatbot/history/clear", header, body, success, fail);
  }
}