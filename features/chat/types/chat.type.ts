// =======================================================
//  UserType (اگر از قبل داری میتونی حذف کنی)
// =======================================================
export type UserType = {
  isOnline: boolean;
  name: any;
  _id: string;
  username: string;
  email?: string; // اضافه شد
  isAI?: boolean; // اگر نیاز دارید
  avatar?: string;
  matrixId?: string; // مثلا @user:server
  createdAt: string;
  updatedAt: string;
};


// =======================================================
//  MATRIX CONTENT TYPES
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

// Union تمام انواع پیام ماتریکس
export type MatrixMessageContent =
  | MatrixTextContent
  | MatrixImageContent
  | MatrixFileContent
  | { msgtype: string; [key: string]: any };


// =======================================================
//  MATRIX MESSAGE TYPE
// =======================================================
export type MatrixMessageType = {
  event_id: string;
  sender: string;
  content: MatrixMessageContent;
  origin_server_ts: number;
  room_id: string;

  // frontend only
  status?: "sending" | "sent" | "failed";
  streaming?: boolean;
  replyToEventId?: string | null;
};


// =======================================================
//  INTERNAL UI MESSAGE TYPE
// =======================================================

export type ChatUserType = UserType & {
  isOnline?: boolean;
};


export type MessageType = {
  content: any;
  type: string;
  _id: string;
  event_id?: string;
  chatId: string;

  sender: ChatUserType | null;

  text?: string | null;
  image?: string | null;
  file?: {
    url: string;
    name: string;
  } | null;

  matrixContent?: MatrixMessageContent;
  replyTo?: {
    event_id: string;
    text?: string | null;
  } | null;

  createdAt?: string;
  updatedAt?: string;

  status?: "sending" | "sent" | "failed";
  streaming?: boolean;
};


// =======================================================
//  CHAT TYPE
// =======================================================
export type ChatType = {
  avatar: string;
  _id: string;
  lastMessage: MessageType | null;
  participants: UserType[];
  isGroup: boolean;
  createdBy: string;
  groupName?: string;
  createdAt: string;
  updatedAt: string;
};


// =======================================================
//  CREATE CHAT
// =======================================================
export type CreateChatType = {
  relyTo:{
    event_id: string;
    text?: string | null;
  } ;
  image:string;
  content:string;
  participantId?: string;
  isGroup?: boolean;
  participants?: string[];
  groupName?: string;
};


// =======================================================
//  SEND MESSAGE
// =======================================================
export type CreateMessageType = {
  chatId: string;
  replyTo:{
    _id: any;
    event_id: string;
    text?: string | null;
  } ;
  image:string;
  content:string;
  text?: string;
  imageFile?: File | null;
  file?: File | null;
  replyToEventId?: string | null;
};
