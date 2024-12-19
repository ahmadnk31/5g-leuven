'use server'

import { encodedRedirect } from "@/lib/encoded-uri"
import { createClient } from "@/lib/supabase/server"

export async function loginAction(formData:FormData){
    const email=formData.get('email') as string
    const password=formData.get('password') as string
    const supabase=await createClient()
    const {error}=await supabase.auth.signInWithPassword({
        email
        ,password
    })
    if(error){
    return encodedRedirect('error','/auth/signin','Failed to login')
    }
    return encodedRedirect('success','/','Login successful')
}

export async function logoutAction(){
    const supabase=await createClient()
    await supabase.auth.signOut()
    return encodedRedirect('success','/auth/signin','Logged out successfully')
}

export async function forgotPasswordAction(formData:FormData){
    const email=formData.get('email') as string
    const supabase=await createClient()
    await supabase.auth.resetPasswordForEmail(email)
    return encodedRedirect('success','/auth/signin','Reset link sent')
}

export async function resetPasswordAction(formData:FormData){
    const password=formData.get('password') as string
    const confirmPassword=formData.get('confirmPassword') as string
    if(password!==confirmPassword){
        return encodedRedirect('error','/auth/reset-password','Passwords do not match')
    }
    const supabase=await createClient()
    await supabase.auth.updateUser({password})
    return encodedRedirect('success','/auth/signin','Password reset successfully')
}

export async function signUpAction(formData:FormData){
    const email=formData.get('email') as string
    const password=formData.get('password') as string
    const supabase=await createClient()
    const {error}=await supabase.auth.signUp({
        email
        ,password
    })
    if(error){
        return encodedRedirect('error','/auth/signup',error.message)
    }
    return encodedRedirect('success','/auth/signin','Sign up successful')
}