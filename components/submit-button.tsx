'use client'
import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";

interface Props extends React.ComponentProps<typeof Button> {
    loadingText?: string;
    children: React.ReactNode;
}
export function SubmitButton({ children,loadingText='loading...', ...props}: Props) {
    const {pending}=useFormStatus()
    return (
        <Button
        {...props}
            type="submit"
            disabled={pending}
        >
            {pending ? loadingText : children}
        </Button>
    );
}