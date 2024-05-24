"use client";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

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
import {useToast } from "@/components/ui/use-toast"
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiRespone";
import { useState } from "react";
import { useRouter } from "next/navigation";



const FormSchema = z.object({
  email: z.string().email()
})

export default function InputForm() {
  const router =  useRouter();
  const {toast} = useToast();
  const [email, setEmail]= useState('');
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
        const response = await axios.post('/api/forgot-password', {
          email
        })
        const username = response.data.user.username
        const flag= response.data.user.isPasswordChanging;
        router.replace(`/verify/${username}`)
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
        toast({
          title: "Error",
          description: axiosError.response?.data.message,
          variant: 'destructive'
        }) 
      }
}

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
    <div className="text-center">
    <h1 className="text-2xl font-extrabold tracking-tight lg:text-3xl mb-6">
           Enter your mail
          </h1>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Enter your mail here" {...field} 
                onChange={(e) => {
                            field.onChange(e);
                            setEmail(e.target.value);
                            }}
                            />
              </FormControl>
              <FormDescription>
                Kindly provide your email to reset your password.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Verify</Button>
      </form>
    </Form>
    </div>
    </div>
    </div>
  )
}

