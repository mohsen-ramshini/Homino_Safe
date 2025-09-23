// app/layout.tsx (or app/root-layout.tsx depending on your structure)

import { DataStreamProvider } from '@/components/chat/data-stream-provider';
import { ThemeProvider } from '@/providers/chat-theme-provider';
import { AppSidebar } from '@/components/chat/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isCollapsed = true;

  // Your NextAuth-style session
  const session = {
    user: {
      name: "John Doe",
      email: "john@example.com",
      image: "https://example.com/avatar.png",
    },
    expires: "2025-07-09T12:34:56.789Z",
  };

  // Map session.user -> backend User type
  const mappedUser = {
    username: session.user.name.replace(" ", "").toLowerCase(), // johndoe
    email: session.user.email,
    first_name: "John",
    last_name: "Doe",
    phone_number: "123-456-7890",
    id: 1,
    role: "patient" as const,
    status: "active" as const,
  };

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <DataStreamProvider>
        <SidebarProvider defaultOpen={!isCollapsed} dir="ltr">
          <AppSidebar user={mappedUser} />
          <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
      </DataStreamProvider>
    </ThemeProvider>
  );
}
