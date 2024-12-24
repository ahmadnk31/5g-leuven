
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { SubmitButton } from '@/components/submit-button';
import { loginAction, signInWithGoogleAction, signUpAction } from '../actions';
import { FormMessage, MessageProps } from '@/components/form-message';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { IconBrandGoogleFilled } from '@tabler/icons-react';

export default async function SignUp(props:{
  searchParams: Promise<MessageProps>;
}) {

 const searchParams = await props.searchParams;
 if ("message" in searchParams) {
   return (
     <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
       <FormMessage message={searchParams} />
     </div>
   );
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-4 rounded-lg bg-white p-6 shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-gray-900">
            Sign up for an account
          </h2>
        </div>
        <form className="mt-8 space-y-4">
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-1"
              />
            </div>
          </div>

          <SubmitButton className='w-full' formAction={signUpAction}>
            Sign Up
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
            Sign up with Google
          </SubmitButton>

          <div className="text-center text-sm">
            Already have an account? {' '}
            <Link 
              href="/auth/signin" 
              className="text-primary hover:underline"
            >
              Sign in
            </Link>
          </div>
          <FormMessage message={searchParams} />
      </div>
    </div>
  );
}