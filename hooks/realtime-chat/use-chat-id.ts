"use client";

import { useParams } from "next/navigation";

const useChatId = () => {
  const params = useParams();
  const chatId = params?.chatId as string | null;
  return chatId || null;
};

export default useChatId;
