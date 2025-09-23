import { LoaderIcon } from "@/components/chat/icons";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full">
      <div className="animate-spin w-10 h-10 text-blue-500 mb-4">
        <LoaderIcon size={40} />
      </div>
      <span className="text-lg text-muted-foreground">Loading...</span>
    </div>
  );
}
