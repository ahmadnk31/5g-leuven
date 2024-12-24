"use client";

import { Button, type ButtonProps } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useToolbar } from "@/components/toolbars/toolbar-provider";
import { CornerUpLeft } from "lucide-react";
import React from "react";

const UndoToolbar = React.forwardRef<HTMLButtonElement, ButtonProps>(
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
						className={cn("h-8 w-8", className)}
						onClick={(e) => {
							editor?.chain().focus().undo().run();
							onClick?.(e);
						}}
						disabled={!editor?.can().undo()}
						ref={ref}
						{...props}
					>
						{children || <CornerUpLeft className="h-4 w-4" />}
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					<span>Undo</span>
				</TooltipContent>
			</Tooltip>
            </TooltipProvider>
		);
	},
);

UndoToolbar.displayName = "UndoToolbar";

export { UndoToolbar };

