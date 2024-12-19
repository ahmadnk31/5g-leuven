'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { createClient } from '@/lib/supabase/client'

const settingsFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).optional(),
  confirmPassword: z.string().optional(),
  marketingEmails: z.boolean(),
  orderUpdates: z.boolean(),
}).refine((data) => {
  if (data.password && !data.confirmPassword) {
    return false;
  }
  if (data.confirmPassword && !data.password) {
    return false;
  }
  return true;
}, {
  message: "Both password fields must be filled if changing password",
  path: ["confirmPassword"],
}).refine((data) => {
  if (data.password && data.confirmPassword && data.password !== data.confirmPassword) {
    return false;
  }
  return true;
}, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>

export default function SettingsPage() {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      email: '',
      marketingEmails: false,
      orderUpdates: true,
    },
  })

  async function onSubmit(data: SettingsFormValues) {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      if (data.email !== user.email) {
        const { error } = await supabase.auth.updateUser({ email: data.email })
        if (error) throw error
      }

      if (data.password) {
        const { error } = await supabase.auth.updateUser({ password: data.password })
        if (error) throw error
      }

      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          marketing_emails: data.marketingEmails,
          order_updates: data.orderUpdates,
        })
      if (error) throw error

      toast({
        title: "Settings updated",
        description: "Your settings have been successfully updated.",
      })
    } catch (error) {
      console.error('Error updating settings:', error)
      toast({
        title: "Error",
        description: "There was a problem updating your settings.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" />
                </FormControl>
                <FormDescription>
                  This is the email address you use to log in.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormDescription>
                  Leave blank if you don't want to change your password.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="marketingEmails"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Marketing Emails</FormLabel>
                  <FormDescription>
                    Receive emails about new products, sales, and offers.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="orderUpdates"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Order Updates</FormLabel>
                  <FormDescription>
                    Receive notifications about your order status.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Settings'}
          </Button>
        </form>
      </Form>
    </div>
  )
}

