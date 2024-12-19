
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { SubmitButton } from '@/components/submit-button';
import { loginAction, signUpAction } from '../actions';
import { FormMessage, MessageProps } from '@/components/form-message';
import Link from 'next/link';

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
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Sign up for an account
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
        <span className="text-center flex text-sm text-gray-600">
            Already have an account? <Link href="/auth/signin" className="text-primary hover:underline">Sign in</Link>
        </span>
        <FormMessage message={searchParams} />
      </div>
    </div>
  );
}