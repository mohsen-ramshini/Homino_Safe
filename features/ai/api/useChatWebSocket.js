import { useEffect, useRef, useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import Cookies from "js-cookie";

// استخراج متن قابل نمایش از پیام
function extractContentText(input) {
  try {
    const parsed = typeof input === "string" ? JSON.parse(input) : input;

    if (typeof parsed === "object" && parsed.content) {
      if (typeof parsed.content === "string") {
        return parsed.content;
      } else {
        return parsed.content.message || JSON.stringify(parsed.content);
      }
    }

    if (parsed?.parts?.[0]?.text) {
      return parsed.parts[0].text;
    }

    if (typeof parsed === "string") return parsed;

    return JSON.stringify(parsed);
  } catch (e) {
    return typeof input === "string" ? input : JSON.stringify(input);
  }
}

// ایجاد پیام استاندارد برای ذخیره در state
function createMessage(role, content, timestamp) {
  return {
    id: uuidv4(),
    role,
    parts: [{ type: "text", text: content }],
    content,
    timestamp: timestamp || new Date().toISOString(),
  };
}

export function useChatWebSocket(sessionId) {
  const ws = useRef(null);
  const host = "192.168.100.87:8888";
  // const host = "130.185.120.67:8888";

  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("connecting");
  const [isHistoryLoaded, setIsHistoryLoaded] = useState(false);

  const sendMessage = useCallback((input) => {
    const contentText = extractContentText(input);

    const payloadObj = {
      role: "user",
      parts: [{ type: "text", text: contentText }],
    };

    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(contentText);

      setMessages((prev) => [
        ...prev,
        {
          ...payloadObj,
          content: contentText,
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  }, []);

  useEffect(() => {
    const token = Cookies.get("access_token");

    const socket = new WebSocket(
      `ws://${host}/api/v1/chatbot/ws/chat/${sessionId}?token=${token}`
    );

    ws.current = socket;

    socket.onopen = () => {
      console.log("✅ WebSocket opened");
      setStatus("open");
    };

    socket.onmessage = (event) => {
      console.log("📩 onmessage:", event.data);

      let parsed;
      try {
        parsed = JSON.parse(event.data);
      } catch (err) {
        console.warn("❌ Could not parse WebSocket message:", err);
        parsed = event.data;
      }

      // بررسی نوع پیام
      if (parsed.type === "history" && parsed.messages) {
        // پردازش تاریخچه
        const historyMessages = parsed.messages.map((msg) => {
          // استخراج محتوای متنی از پیام‌های کاربر
          let content = msg.content;
          if (msg.role === "user" && typeof msg.content === "string") {
            try {
              const userParsed = JSON.parse(msg.content);
              if (userParsed.parts?.[0]?.text) {
                content = userParsed.parts[0].text;
              }
            } catch (e) {
              // اگر parse نشد، همان content را استفاده کن
            }
          }

          return {
            id: uuidv4(),
            role: msg.role,
            parts: [{ type: "text", text: content }],
            content: content,
            timestamp: msg.timestamp,
          };
        });

        // مرتب‌سازی پیام‌ها بر اساس timestamp
        historyMessages.sort((a, b) => 
          new Date(a.timestamp) - new Date(b.timestamp)
        );

        setMessages(historyMessages);
        setIsHistoryLoaded(true);
      } else {
        // پیام‌های معمولی
        const contentText = extractContentText(parsed);
        const role = parsed.role || "assistant";

        const newMessage = {
          id: uuidv4(),
          role,
          parts: [{ type: "text", text: contentText }],
          content: contentText,
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, newMessage]);
      }
    };

    socket.onerror = (err) => {
      console.error("WebSocket error", err);
      setStatus("error");
    };

    socket.onclose = () => {
      console.warn("WebSocket closed");
      setStatus("closed");
    };

    return () => {
      socket.close();
    };
  }, [sessionId]);

  return {
    messages,
    status,
    sendMessage,
    isHistoryLoaded,
  };
}