import React from 'react';
import { SubmitButton } from "@/components/submit-button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormMessage, MessageProps } from "@/components/form-message";
import { resetPasswordAction } from "../actions";

interface ResetPasswordProps {
  searchParams: Promise<MessageProps>;
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordProps) {
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
            Reset Password
          </CardTitle>
          <CardDescription className="text-center">
            Enter your new password below
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form  className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your new password"
                required
                minLength={8}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your new password"
                required
                minLength={8}
                className="w-full"
              />
            </div>

            <SubmitButton formAction={resetPasswordAction} className="w-full">
              Reset Password
            </SubmitButton>
          </form>
        </CardContent>

        <CardFooter>
          <FormMessage message={params} />
        </CardFooter>
      </Card>
    </div>
  );
}