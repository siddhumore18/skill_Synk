import * as React from "react"
import { cn } from "@/lib/utils"
import { formatMessageTime } from "@/services/chatService"
import { getCurrentUser } from "@/services/api"

export function MessageBubble({ message, isOwn = false }) {
  const time = formatMessageTime(message.timestamp)

  return (
    <div
      className={cn(
        "flex w-full mb-4 px-4",
        isOwn ? "justify-end" : "justify-start"
      )}>
      <div
        className={cn(
          "flex flex-col max-w-[75%] md:max-w-[60%]",
          isOwn ? "items-end" : "items-start"
        )}>
        <div
          className={cn(
            "rounded-2xl px-4 py-2 shadow-sm",
            isOwn
              ? "bg-primary text-primary-foreground rounded-tr-sm"
              : "bg-muted text-foreground rounded-tl-sm"
          )}>
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.content.split(/(https?:\/\/[^\s]+)/g).map((part, i) => 
              part.match(/^https?:\/\//) ? (
                <a 
                  key={i} 
                  href={part} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={cn(
                    "underline transition-colors break-all",
                    isOwn 
                      ? "text-white hover:text-white/80" 
                      : "text-primary hover:text-primary/80"
                  )}
                >
                  {part}
                </a>
              ) : part
            )}
          </p>
        </div>
        <span className="text-xs text-muted-foreground mt-1 px-1">
          {time}
        </span>
      </div>
    </div>
  )
}

