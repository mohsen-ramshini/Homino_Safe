import { create } from "zustand";
import type { UserType } from "@/features/chat/types/auth.type";
import type {
  ChatType,
  CreateChatType,
  CreateMessageType,
  MessageType,
} from "@/features/chat/types/chat.type";
import API from "@/lib/realtime-chat/axios-client";
import { toast } from "sonner";
import { useAuth } from "./use-auth";
import { generateUUID } from "@/lib/realtime-chat/helper";

interface ChatState {
  chats: ChatType[];
  users: UserType[];
  singleChat: {
    chat: ChatType;
    messages: MessageType[];
  } | null;

  currentAIStreamId: string | null;

  isChatsLoading: boolean;
  isUsersLoading: boolean;
  isCreatingChat: boolean;
  isSingleChatLoading: boolean;
  isSendingMsg: boolean;

  fetchAllUsers: () => Promise<void>;
  fetchChats: () => Promise<void>;
  createChat: (payload: CreateChatType) => Promise<ChatType | null>;
  fetchSingleChat: (chatId: string) => Promise<void>;
  sendMessage: (payload: CreateMessageType) => Promise<void>;

  addNewChat: (newChat: ChatType) => void;
  updateChatLastMessage: (chatId: string, lastMessage: MessageType) => void;
  addNewMessage: (chatId: string, message: MessageType) => void;
}

export const useChat = create<ChatState>()((set, get) => ({
  chats: [],
  users: [],
  singleChat: null,

  isChatsLoading: false,
  isUsersLoading: false,
  isCreatingChat: false,
  isSingleChatLoading: false,
  isSendingMsg: false,

  currentAIStreamId: null,

  fetchAllUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const { data } = await API.get<{ users: UserType[] }>("/user/all");
      set({ users: data.users });
    } catch (error: unknown) {
      // toast.error("Failed to fetch users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  fetchChats: async () => {
    set({ isChatsLoading: true });
    try {
      const { data } = await API.get<{ chats: ChatType[] }>("/chat/all");
      set({ chats: data.chats });
    } catch (error: unknown) {
      // toast.error("Failed to fetch chats");
    } finally {
      set({ isChatsLoading: false });
    }
  },

  createChat: async (payload: CreateChatType) => {
    set({ isCreatingChat: true });
    try {
      const response = await API.post<{ chat: ChatType }>("/chat/create", payload);
      get().addNewChat(response.data.chat);
      return response.data.chat;
    } catch (error: unknown) {
      toast.error("Failed to create chat");
      return null;
    } finally {
      set({ isCreatingChat: false });
    }
  },

  fetchSingleChat: async (chatId: string) => {
    set({ isSingleChatLoading: true });
    try {
      const { data } = await API.get<{ chat: ChatType; messages: MessageType[] }>(`/chat/${chatId}`);
      set({ singleChat: data });
    } catch (error: unknown) {
      toast.error("Failed to fetch chat");
    } finally {
      set({ isSingleChatLoading: false });
    }
  },

  sendMessage: async (payload: CreateMessageType) => {
    set({ isSendingMsg: true });

    const { chatId, content = "", replyTo } = payload;
    const user = useAuth.getState().user;

    if (!chatId || !user?._id) {
      set({ isSendingMsg: false });
      return;
    }

    const tempUserId = generateUUID();

    const tempMessage: MessageType = {
      _id: tempUserId,
      chatId,
      file: "",
      image: "",
      event_id: "",
      matrixContent: {
        msgtype: "m.text",
        body: content,
      },
      text: content,
      sender: {
        _id: user._id,
        username: user.username,
        avatar: "",
        isOnline: true,
        name: user.name,
        email: "",
        isAI: user.isAI,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
      replyTo: replyTo || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "sending",
    };

    set((state) => state); // بدون تغییر

    try {
      await API.post("/chat/message/send", {
        chatId,
        content,
        Image: undefined,
        replyToId: replyTo?._id,
      });
    } catch (error: unknown) {
      toast.error("Failed to send message");
    } finally {
      set({ isSendingMsg: false });
    }
  },

  addNewChat: (newChat: ChatType) => {
    set((state) => {
      const existingChatIndex = state.chats.findIndex((c) => c._id === newChat._id);
      if (existingChatIndex !== -1) {
        return {
          chats: [newChat, ...state.chats.filter((c) => c._id !== newChat._id)],
        };
      } else {
        return { chats: [newChat, ...state.chats] };
      }
    });
  },

  // متدهای خارجی اما بدون منطق داخلی
  updateChatLastMessage: (chatId: string, lastMessage: MessageType) => {
    // هیچ کاری انجام نمی‌دهد
  },

  addNewMessage: (chatId: string, message: MessageType) => {
    // هیچ کاری انجام نمی‌دهد
  },
}));
