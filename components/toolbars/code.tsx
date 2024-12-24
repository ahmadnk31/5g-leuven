"use client";

import { Code2 } from "lucide-react";
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

const CodeToolbar = React.forwardRef<HTMLButtonElement, ButtonProps>(
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
							editor?.isActive("code") && "bg-accent",
							className,
						)}
						onClick={(e) => {
							editor?.chain().focus().toggleCode().run();
							onClick?.(e);
						}}
						disabled={!editor?.can().toggleCode()}
						ref={ref}
						{...props}
					>
						{children || <Code2 className="h-4 w-4" />}
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					<span>Code</span>
				</TooltipContent>
			</Tooltip>
            </TooltipProvider>
		);
	},
);

CodeToolbar.displayName = "CodeToolbar";

export { CodeToolbar };

