

// فقط اینترفیس‌های TypeScript برای اسکیمای دیتابیس

export interface User {
  id: string;
  email: string;
  password?: string;
}

export interface Chat {
  id: string;
  createdAt: Date;
  title: string;
  userId: string;
  visibility: 'public' | 'private';
}

export interface MessageDeprecated {
  id: string;
  chatId: string;
  role: string;
  content: any;
  createdAt: Date;
}

export interface DBMessage {
  id: string;
  chatId: string;
  role: string;
  parts: any;
  attachments: any;
  createdAt: Date;
}

export interface VoteDeprecated {
  chatId: string;
  messageId: string;
  isUpvoted: boolean;
}

export interface Vote {
  chatId: string;
  messageId: string;
  isUpvoted: boolean;
}

export interface Document {
  id: string;
  createdAt: Date;
  title: string;
  content?: string;
  kind: 'text' | 'code' | 'image' | 'sheet';
  userId: string;
}

export interface Suggestion {
  id: string;
  documentId: string;
  documentCreatedAt: Date;
  originalText: string;
  suggestedText: string;
  description?: string;
  isResolved: boolean;
  userId: string;
  createdAt: Date;
}

export interface Stream {
  id: string;
  chatId: string;
  createdAt: Date;
}

// فقط اسکیمای جداول دیتابیس (بدون ORM و تایپ‌ها)

// جدول User
