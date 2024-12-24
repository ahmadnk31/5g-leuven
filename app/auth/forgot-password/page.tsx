import React from 'react';
import { SubmitButton } from "@/components/submit-button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormMessage, MessageProps } from "@/components/form-message";
import Link from 'next/link';
import { forgotPasswordAction } from '../actions';

interface ForgotPasswordProps {
  searchParams: Promise<MessageProps>;
}

export default async function ForgotPasswordPage({ searchParams }: ForgotPasswordProps) {
  const params = await searchParams;

  if ("message" in params) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center p-4">
        <FormMessage message={params} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-bold text-center">
            Forgot Password
          </CardTitle>
          <CardDescription className="text-center">
            Enter your email address and we'll send you a link to reset your password.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                type="email"
                id="email"
                name="email"
                placeholder="name@example.com"
                required
                className="w-full"
              />
            </div>

            <SubmitButton formAction={forgotPasswordAction} className="w-full">
              Send Reset Link
            </SubmitButton>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <FormMessage message={params} />
          <div className="text-center text-sm">
            Remember your password?{' '}
            <Link 
              href="/auth/signin" 
              className="text-primary hover:underline"
            >
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}