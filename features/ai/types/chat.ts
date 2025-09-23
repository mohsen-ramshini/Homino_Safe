export type MessageItem = {
  role: string;
  content: string;
  timestamp: string;
}

export type Message = {
  map(arg0: (msg: any) => { id: any; role: any; parts: any; timestamp: any; session_id: any; }): import("ai").UIMessage<unknown, import("../../../lib/types").CustomUIDataTypes, import("../../../lib/types").ChatTools>[];
  messages: MessageItem[];
  session_id: string;
}

export type SessionItem = {
  session_id: string;
  created_at: string;
}

export type Sessions = {
  sessions: SessionItem[];
}
