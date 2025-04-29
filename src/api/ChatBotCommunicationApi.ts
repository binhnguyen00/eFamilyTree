import { SuccessCB, FailCB } from "types/server"
import { BaseApi } from "./BaseApi";

export class ChatBotCommunicationApi extends BaseApi {

  public static chat({ prompt, zaloId, chatHistory, success, fail }: {
    prompt: any, zaloId: string, chatHistory: any[], success: SuccessCB, fail?: FailCB
  }) {
    const header = this.initHeader();
    const body = this.initBody({
      prompt:           prompt,
      messages_history: chatHistory,
      session_id:       zaloId
    })
    return this.server.POST("family-tree/chatbot/talk", header, body, success, fail);
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