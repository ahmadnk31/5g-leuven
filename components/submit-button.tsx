'use client'
import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";

interface Props extends React.ComponentProps<typeof Button> {
    loadingText?: string;
    children: React.ReactNode;
    variant?:  'ghost' | 'link'|'outline';
}
export function SubmitButton({ children,loadingText='loading...',variant, ...props}: Props) {
    const {pending}=useFormStatus()
    return (
        <Button
        {...props}
            type="submit"
            disabled={pending}
            variant={variant}
        >
            {pending ? loadingText : children}
        </Button>
    );
}