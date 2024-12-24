"use client";

import { Heading1 } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useToolbar } from "@/components/toolbars/toolbar-provider";

const headingLevels = [1, 2, 3, 4] as const;

const HeadingToolbar = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, onClick, children, ...props }, ref) => {
  const { editor } = useToolbar();

  const isAnyHeadingActive = headingLevels.some((level) =>
    editor?.isActive("heading", { level })
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
               type="button"
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8",
                  isAnyHeadingActive && "bg-accent",
                  className
                )}
                ref={ref}
                {...props}
              >
                {children || <Heading1 className="h-4 w-4" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {headingLevels.map((level) => (
                <DropdownMenuItem
                  key={level}
                  className={cn(
                    "flex items-center",
                    editor?.isActive("heading", { level }) && "bg-accent"
                  )}
                  onClick={() => {
                    editor?.chain().focus().toggleHeading({ level }).run();
                  }}
                  disabled={!editor?.can().toggleHeading({ level })}
                >
                  <span className={`text-${level}xl font-bold`}>
                    Heading {level}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </TooltipTrigger>
        <TooltipContent>
          <span>Headings</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});

HeadingToolbar.displayName = "HeadingToolbar";

export { HeadingToolbar };