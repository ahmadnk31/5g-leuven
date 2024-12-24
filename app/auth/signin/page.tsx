import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { SubmitButton } from '@/components/submit-button';
import { FormMessage, MessageProps } from '@/components/form-message';
import { IconBrandGoogleFilled } from '@tabler/icons-react';
import { loginAction, signInWithGoogleAction } from '../actions';
import Link from 'next/link';

interface SignInProps {
  searchParams: Promise<MessageProps>;
}

export default async function SignIn({ searchParams }: SignInProps) {
  const params = await searchParams;

  if ("message" in params) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center p-4">
        <FormMessage message={params} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 ">
      <Card className="w-full max-w-md shadow-none">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center font-bold">
            Sign in to your account
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <form className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="name@example.com"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link 
                    href="/auth/forgot-password" 
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <SubmitButton 
              className="w-full" 
              formAction={loginAction}
            >
              Sign In
            </SubmitButton>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <SubmitButton 
            variant="outline" 
            className="w-full" 
            formAction={signInWithGoogleAction}
          >
            <IconBrandGoogleFilled className="w-4 h-4 mr-2" />
            Sign in with Google
          </SubmitButton>

          <div className="text-center text-sm">
            Don't have an account?{' '}
            <Link 
              href="/auth/signup" 
              className="text-primary hover:underline"
            >
              Sign up
            </Link>
          </div>

          {params && <FormMessage message={params} />}
        </CardContent>
      </Card>
    </div>
  );
}