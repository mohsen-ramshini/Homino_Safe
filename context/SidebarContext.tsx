"use client"
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useSidebar } from '@/components/ui/sidebar';

type SidebarContextType = {
  isMainSidebarOpen: boolean;
  setMainSidebarOpen: (open: boolean) => void;
  toggleMainSidebar: () => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function LayoutSidebarProvider({ children }: { children: React.ReactNode }) {
  const { open, toggleSidebar, setOpen } = useSidebar();

  // برای هماهنگی state کانتکست با open واقعی از هوک
  const [isMainSidebarOpen, setMainSidebarOpen] = useState(open);

  // هر وقت open در هوک تغییر کرد، state کانتکست را هم بروز کن
  useEffect(() => {
    setMainSidebarOpen(open);
  }, [open]);

  // تابع toggle که هم هوک رو toggle کنه هم state داخلی رو بروز کنه
  const toggleMainSidebar = useCallback(() => {
    toggleSidebar();
    // setMainSidebarOpen هم به‌صورت خودکار توسط useEffect بروز میشه، ولی اگه بخوای میتونی اینجا هم بگذاری:
    // setMainSidebarOpen(prev => !prev);
  }, [toggleSidebar]);

  // اگه خواستی مستقیم setter هم از هوک استفاده کن:
  const setMainSidebarOpenDirect = useCallback((value: boolean) => {
    setOpen(value);
    setMainSidebarOpen(value);
  }, [setOpen]);

  return (
    <SidebarContext.Provider
      value={{
        isMainSidebarOpen,
        setMainSidebarOpen: setMainSidebarOpenDirect,
        toggleMainSidebar,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebarContext() {
  const context = useContext(SidebarContext);
  if (!context) throw new Error('useSidebarContext must be used within LayoutSidebarProvider');
  return context;
}
