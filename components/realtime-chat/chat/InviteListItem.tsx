"use client";

import { cn } from "@/lib/utils";
import AvatarWithBadge from "../avatar-with-badge";
import { Button } from "../ui/button";
import { Check, X } from "lucide-react";
import { useAcceptInvitation } from "@/features/chat/api/useAcceptInvitation";
import { useRejectInvitation } from "@/features/chat/api/useRejectInvitation";

interface InviteRoom {
  room_id: string;
  name: string | null;
  inviter?: {
    name?: string;
    avatar?: string;
  } | null;
}

interface Props {
  room: InviteRoom;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
}

const InviteListItem = ({ room }: Props) => {
  const name = room.name || `Room ${room.room_id.substring(0, 6)}`;
  const { mutate: acceptInvite } = useAcceptInvitation();
const { mutate: rejectInvite } = useRejectInvitation();

  return (
    <div
      className={cn(
        "w-full flex items-center gap-2 p-2 rounded-sm",
        "transition-colors"
      )}
    >
      <AvatarWithBadge
        name={name}
        src={room.inviter?.avatar || ""}
        isGroup={false}
        isOnline={false}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <h5 className="text-sm font-semibold truncate">
            {name}
          </h5>
        </div>

        <p className="text-xs truncate text-muted-foreground -mt-px">
          Invited by {room.inviter?.name || "Unknown"}
        </p>
      </div>

      {/* Accept / Reject Buttons */}
      <div className="flex gap-1 shrink-0">
        <Button
          size="icon"
          variant="outline"
          className="rounded-full !h-7 !w-7"
          onClick={() => acceptInvite?.(room.room_id)}
        >
          <Check size={14} />
        </Button>

        <Button
        size="icon"
        className="rounded-full !h-7 !w-7 bg-red-500/15 hover:bg-red-500/25 text-red-600"
        onClick={() => rejectInvite?.(room.room_id)}
        >
        <X size={14} />
        </Button>

      </div>
    </div>
  );
};

export default InviteListItem;
