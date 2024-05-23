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
        console.log(response);
        const username = response.data.user.username
        const flag= response.data.user.isPasswordChanging;
        console.log(username, flag)
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your mail" {...field} 
                onChange={(e) => {
                            field.onChange(e);
                            setEmail(e.target.value);
                            }}
                            />
              </FormControl>
              <FormDescription>
                Kindly write your email to reset your password.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}

