'use server';

import { encodedRedirect } from "@/lib/encoded-uri";
import { createClient } from "@/lib/supabase/server";

export async function loginAction(formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
      return encodedRedirect('error', '/auth/signin', 'Email and password are required');
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('Login error:', error);
      return encodedRedirect('error', '/auth/signin', 'Invalid email or password');
    }

    return encodedRedirect('success', '/', '');
  } catch (error) {
    console.error('Unexpected login error:', error);
    return encodedRedirect('error', '/auth/signin', 'An unexpected error occurred');
  }
}

export async function logoutAction() {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Logout error:', error);
      return encodedRedirect('error', '/', 'Failed to logout');
    }

    return encodedRedirect('success', '/auth/signin', 'Logged out successfully');
  } catch (error) {
    console.error('Unexpected logout error:', error);
    return encodedRedirect('error', '/', 'An unexpected error occurred');
  }
}

export async function forgotPasswordAction(formData: FormData) {
  try {
    const email = formData.get('email') as string;

    if (!email) {
      return encodedRedirect('error', '/auth/forgot-password', 'Email is required');
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/auth/reset-password`,
    });

    if (error) {
      console.error('Password reset error:', error);
      return encodedRedirect('error', '/auth/forgot-password', 'Failed to send reset link');
    }

    return encodedRedirect('success', '/auth/signin', 'Reset link sent');
  } catch (error) {
    console.error('Unexpected password reset error:', error);
    return encodedRedirect('error', '/auth/forgot-password', 'An unexpected error occurred');
  }
}

export async function resetPasswordAction(formData: FormData) {
  try {
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (!password || !confirmPassword) {
      return encodedRedirect('error', '/auth/reset-password', 'Both password fields are required');
    }

    if (password.length < 8) {
      return encodedRedirect('error', '/auth/reset-password', 'Password must be at least 8 characters');
    }

    if (password !== confirmPassword) {
      return encodedRedirect('error', '/auth/reset-password', 'Passwords do not match');
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      console.error('Password update error:', error);
      return encodedRedirect('error', '/auth/reset-password', 'Failed to reset password');
    }

    // Sign out after password reset
    await supabase.auth.signOut();
    return encodedRedirect('success', '/auth/signin', 'Password reset successfully');
  } catch (error) {
    console.error('Unexpected password update error:', error);
    return encodedRedirect('error', '/auth/reset-password', 'An unexpected error occurred');
  }
}

export async function signUpAction(formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
      return encodedRedirect('error', '/auth/signup', 'Email and password are required');
    }

    if (password.length < 8) {
      return encodedRedirect('error', '/auth/signup', 'Password must be at least 8 characters');
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/`
      }
    });

    if (error) {
      console.error('Signup error:', error);
      return encodedRedirect('error', '/auth/signup', error.message);
    }

    return encodedRedirect('success', '/auth/signin', 'Please check your email to confirm your account');
  } catch (error) {
    console.error('Unexpected signup error:', error);
    return encodedRedirect('error', '/auth/signup', 'An unexpected error occurred');
  }
}

export async function signInWithGoogleAction() {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/`,
      }
    });

    if (error) {
      console.error('Google sign-in error:', error);
      return encodedRedirect('error', '/auth/signin', 'Failed to sign in with Google');
    }
  } catch (error) {
    console.error('Unexpected Google sign-in error:', error);
    return encodedRedirect('error', '/auth/signin', 'An unexpected error occurred');
  }
}