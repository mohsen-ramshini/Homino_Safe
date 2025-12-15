"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { X, Bell, Trash2, AlertCircle, AlertTriangle, Info, ChevronDown } from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";

const severityIcons: Record<string, any> = {
  HIGH: AlertCircle,
  MEDIUM: AlertTriangle,
  LOW: Info,
};

const severityColors: Record<string, string> = {
  HIGH: "#f87171", // red-400
  MEDIUM: "#fbbf24", // yellow-400
  LOW: "#60a5fa", // blue-400
};

export function AlertBar() {
  const isRtl = true;
  const { notifications, removeNotification, clearNotifications } = useNotifications();
  const [activeTab, setActiveTab] = useState("ALL");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = notifications.filter((n) => activeTab === "ALL" || n.severity === activeTab);

  const count = {
    ALL: notifications.length,
    HIGH: notifications.filter((n) => n.severity === "HIGH").length,
    MEDIUM: notifications.filter((n) => n.severity === "MEDIUM").length,
    LOW: notifications.filter((n) => n.severity === "LOW").length,
  };

  return (
    <Sheet>
      <SheetTrigger>
        <div className="relative cursor-pointer">
          <Bell className="w-6 h-6 text-gray-700" />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1 shadow-md animate-pulse">
              {notifications.length}
            </span>
          )}
        </div>
      </SheetTrigger>

      <SheetContent
        side={isRtl ? "right" : "left"}
        className="w-80 sm:w-96 border-l bg-white/95 shadow-2xl p-4 z-50000"
      >
        <SheetHeader>
          <SheetTitle className="flex justify-between items-center text-lg font-semibold">
            Alerts
            <div className="flex gap-2">
              {notifications.length > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-red-50 hover:text-red-600 transition"
                  onClick={clearNotifications}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </SheetTitle>
        </SheetHeader>

        <Separator className="my-4" />

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 text-xs gap-1 rounded-xl p-1">
            {["ALL", "HIGH", "MEDIUM", "LOW"].map((severity) => (
              <TabsTrigger
                key={severity}
                value={severity}
                className="rounded-lg py-2 transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-400 data-[state=active]:to-blue-300 data-[state=active]:shadow-md"
              >
                {severity} ({count[severity as keyof typeof count]})
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <ScrollArea className="h-[70vh] mt-4 pr-2">
          {filtered.length === 0 ? (
            <p className="text-center text-muted-foreground mt-10 text-sm">
              No alerts available
            </p>
          ) : (
            filtered.map((n) => {
              const Icon = severityIcons[n.severity] || Info;
              const isOpen = expanded === n.id;
              const color = severityColors[n.severity] || "#60a5fa";

              return (
<Card
  key={n.id}
  className="mb-3 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden bg-white"
>
  <CardHeader
    className="cursor-pointer flex justify-between items-center p-3 gap-3"
    onClick={() => setExpanded(isOpen ? null : n.id)}
  >
    <div className="flex items-center gap-3">
      <Icon className="w-5 h-5" color={severityColors[n.severity]} />
      <div className="flex flex-col gap-0.5">
        <CardTitle className="text-sm font-semibold">{n.alert_type || "Environmental Alert"}</CardTitle>
        <CardDescription className="text-xs text-gray-500">
          {n.location ? `Location: ${n.location}` : "Hall 1"}
          {n.timestamp && ` • ${new Date(n.timestamp).toLocaleString("fa-IR")}`}
        </CardDescription>
      </div>
    </div>

    <div className="flex items-center gap-2">
      {!n.read && <span className="w-2 h-2 rounded-full bg-blue-500 shadow-sm animate-pulse"></span>}
      <Button
        variant="ghost"
        size="icon"
        className="hover:bg-red-50 hover:text-red-600 transition"
        onClick={() => removeNotification(n.id)}
      >
        <X className="w-4 h-4" />
      </Button>
      <ChevronDown
        className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""} text-gray-500`}
      />
    </div>
  </CardHeader>

  <Collapsible open={isOpen}>
    <CollapsibleContent>
      <CardContent
        className={`text-sm text-gray-700 p-3 pt-0 transition-all duration-500 ease-out overflow-hidden`}
        style={{
          maxHeight: isOpen ? "1000px" : "0px",
          opacity: isOpen ? 1 : 0,
        }}
      >
        <p>
          <strong>Details:</strong> {n.message || "افزایش غیرعادی CO₂ یا NH₃"}
        </p>
        {n.sensor && (
          <p>
            <strong>Sensor:</strong> {n.sensor}
          </p>
        )}
        {n.timestamp && (
          <p>
            <strong>Time:</strong> {new Date(n.timestamp).toLocaleString("fa-IR")}
          </p>
        )}
      </CardContent>
    </CollapsibleContent>
  </Collapsible>
</Card>

              );
            })
          )}
        </ScrollArea>

        <Button className="w-full mt-4 rounded-xl shadow-md hover:shadow-lg transition-all bg-gradient-to-r from-blue-400 to-blue-300 text-white hover:from-blue-500 hover:to-blue-400">
          View All Alerts
        </Button>
      </SheetContent>
    </Sheet>
  );
}
