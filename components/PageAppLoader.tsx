import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";

interface PageAppLoaderProps {
  text?: string;
  className?: string;
}
export const PageAppLoader = ({ text, className }: PageAppLoaderProps) => (
  <div
    className={cn(
      "flex h-screen w-full flex-col items-center justify-center p-8",
      className
    )}
  >
    <div className="flex w-full flex-col items-center justify-center gap-y-7 lg:max-w-2xl">
      <Loader className="size-12 animate-spin" />
      {text && <p className="text-center text-sm">{text}</p>}
    </div>
  </div>
);
