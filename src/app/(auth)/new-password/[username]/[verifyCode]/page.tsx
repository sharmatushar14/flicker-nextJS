'use client';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import * as z from 'zod';
import { useToast } from '@/components/ui/use-toast';
import { passwordChangeSchema } from '@/schemas/passwordChangeSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import React from 'react'
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiRespone';



const NewPassword = () => {
  const router = useRouter();
  const params = useParams<{username:string, verifyCode: string}>()
  const {toast} = useToast();
  const form = useForm<z.infer<typeof passwordChangeSchema>>({
    resolver: zodResolver(passwordChangeSchema)
  })
     const {username, verifyCode}= params

     const onSubmit= async (data: z.infer<typeof passwordChangeSchema>)=>{
     try {
      //The issue in your code snippet lies in the way you are passing the username along with the form data to the server in the axios.post request. 
      //The username should be included in the data object that is being sent to the server
        const response = await axios.post(`/api/new-password`, {
          ...data, username: username, verifyCode: verifyCode 
        }
        )
        // console.log(response);
        toast({
          title: "Yups!",
          description: response.data.message,
          variant: 'default' 
        })
        router.replace(`/sign-in`)
     } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
        toast({
          title: 'Error',
          description: axiosError.response?.data.message,
          variant: 'destructive'
        }) 
     }
  }
  return (
        <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-4xl mb-6">
           Password Recovery: Flicker
          </h1>
          <p className="mb-4">Change password for username {username}</p>
        </div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                <FormField
                    name="newPassword"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                          <Input type="password"
                            {...field}
                            />
                       <FormMessage/> 
                      </FormItem>
                    )}
                />
              <FormField
              name="newPasswordConfirm"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <Input type="password" {...field} name="newPasswordConfirm" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className='w-full'>
              Confirm
            </Button>
            </form>
        </Form>
     </div>
  </div>
  )
}

export default NewPassword
