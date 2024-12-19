
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { SubmitButton } from '@/components/submit-button';
import { loginAction } from '../actions';
import { FormMessage, MessageProps } from '@/components/form-message';
import Link from 'next/link';

export default async function SignIn(props:{
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
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6">
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
              <div className='flex items-center justify-between'>
              <Label htmlFor="password">Password</Label>
              <Link href="/auth/forgot-password" className=" text-sm text-muted-foreground hover:underline hover:text-primary">Forgot password?</Link>
              </div>
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

          <SubmitButton className='w-full' formAction={loginAction}>
            Sign In
          </SubmitButton>
        </form>
        <span className="text-center flex text-sm text-gray-600">
          Don't have an account? <Link href="/auth/signup" className="text-primary">Sign up</Link>
        </span>
        <FormMessage message={searchParams} />
      </div>
    </div>
  );
}