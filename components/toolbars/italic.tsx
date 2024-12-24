"use client";

import { ItalicIcon } from "lucide-react";
import React from "react";

import { Button, type ButtonProps } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useToolbar } from "@/components/toolbars/toolbar-provider";

const ItalicToolbar = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, onClick, children, ...props }, ref) => {
		const { editor } = useToolbar();
		return (
			<TooltipProvider>
				<Tooltip>
				<TooltipTrigger asChild>
					<Button
					 type="button"
						variant="ghost"
						size="icon"
						className={cn(
							"h-8 w-8",
							editor?.isActive("italic") && "bg-accent",
							className,
						)}
						onClick={(e) => {
							editor?.chain().focus().toggleItalic().run();
							onClick?.(e);
						}}
						disabled={!editor?.can().toggleItalic()}
						ref={ref}
						{...props}
					>
						{children || <ItalicIcon className="h-4 w-4" />}
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					<span>Italic</span>
					<span className="ml-1 text-xs text-gray-11">(cmd + i)</span>
				</TooltipContent>
			</Tooltip>
			</TooltipProvider>
		);
	},
);

ItalicToolbar.displayName = "ItalicToolbar";

export { ItalicToolbar };
