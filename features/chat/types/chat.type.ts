// =======================================================
//  USER TYPES
// =======================================================

export type UserType = {
  _id: string;
  username: string;
  name: string;
  email?: string;
  avatar?: string;
  matrixId?: string; // @user:server
  isAI?: boolean;
  isOnline?: boolean;
  createdAt: string;
  updatedAt: string;
};

// Alias for UI usage (future-proof)
export type ChatUserType = UserType;


// =======================================================
//  MATRIX MESSAGE CONTENT TYPES
// =======================================================

export type MatrixTextContent = {
  msgtype: "m.text" | "m.notice";
  body: string;
};

export type MatrixImageContent = {
  msgtype: "m.image";
  body?: string;
  url: string; // mxc://...
  info?: {
    mimetype?: string;
    w?: number;
    h?: number;
    size?: number;
  };
};

export type MatrixFileContent = {
  msgtype: "m.file";
  body: string;
  url: string;
  filename?: string;
  info?: {
    mimetype?: string;
    size?: number;
  };
};

export type MatrixMessageContent =
  | MatrixTextContent
  | MatrixImageContent
  | MatrixFileContent
  | {
      msgtype: string; // fallback for unsupported matrix types
      [key: string]: unknown;
    };


// =======================================================
//  MATRIX EVENT MESSAGE
// =======================================================

export type MatrixMessageType = {
  event_id: string;
  room_id: string;
  sender: string; // matrix user id
  content: MatrixMessageContent;
  origin_server_ts: number;

  // frontend only
  status?: "sending" | "sent" | "failed";
  streaming?: boolean;
  replyToEventId?: string | null;
};


// =======================================================
//  INTERNAL UI MESSAGE TYPE (SINGLE SOURCE OF TRUTH)
// =======================================================

export type MessageType = {
  file: any;
  image: any;
  text: any;
  event_id: any;
  _id: string;
  chatId: string;

  sender: ChatUserType | null;

  matrixEventId?: string;
  matrixContent: MatrixMessageContent;

  replyTo?: {
    event_id: string;
    text?: string | null;
  } | null;

  status?: "sending" | "sent" | "failed";
  streaming?: boolean;

  createdAt: string;
  updatedAt: string;
};


// =======================================================
//  CHAT / ROOM TYPES
// =======================================================

export type ChatType = {
  avatar: string;
  _id(_id: any): unknown;
  createdAt: string;
  lastMessage: null;
  groupName: any;
  room_id: string;
  name: string;
  member_count: number;
  canonical_alias?: string;
  isGroup: boolean;
  participants?: ChatUserType[];
};


// =======================================================
//  CREATE CHAT
// =======================================================

export type CreateChatType = {
  participantId?: string; // for direct chat
  participants?: string[]; // for group
  isGroup?: boolean;
  groupName?: string;

  initialMessage?: {
    content: string;
    image?: File | null;
    replyTo?: {
      event_id: string;
      text?: string | null;
    } | null;
  };
};


// =======================================================
//  SEND MESSAGE
// =======================================================

export type CreateMessageType = {
  chatId: string;

  content?: string; // text message
  imageFile?: File | null;
  file?: File | null;

  replyTo?: {
    _id: any;
    event_id: string;
    text?: string | null;
  } | null;
};


// =======================================================
//  OPTIONAL UI HELPER UNION (RECOMMENDED)
// =======================================================

export type UIMessageKind =
  | { kind: "text"; text: string }
  | { kind: "image"; url: string }
  | { kind: "file"; url: string; name: string };


  // types/matrix-whoami.type.ts
export type MatrixWhoAmIResponse = {
  user_id: string;      // @user:server
  device_id?: string;
  is_guest?: boolean;
};
