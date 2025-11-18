import AppWrapper from "@/components/realtime-chat/app-wrapper";
import ChatList from "@/components/realtime-chat/chat/chat-list";
import useChatId from "@/hooks/realtime-chat/use-chat-id";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const chatId = useChatId();

  return (
    <AppWrapper>
      <div className="h-full">
        {/* ChatList */}
        <div className={cn(chatId ? "hidden lg:block" : "block")}>
          <ChatList />
        </div>
        <div
          className={cn(
            "lg:!pl-95 pl-7",
            !chatId ? "hidden lg:block" : "block"
          )}
        >
          {children}
        </div>
      </div>
    </AppWrapper>
  );
};

export default AppLayout;
