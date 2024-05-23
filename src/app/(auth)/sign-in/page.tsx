'use client';

import * as z from 'zod'
import { useToast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { signInSchema } from '@/schemas/signInSchema';
import { signIn } from 'next-auth/react';

function SignInForm() {

    const router = useRouter();
    const {toast} = useToast();

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: '',
            password: '',
        }
    })

    const onSubmit = async(data: z.infer<typeof signInSchema>) =>{
        //Doing SignIn here with AuthJS and SignUp we did manually!

        const result = await signIn('credentials', {
            redirect: false,
            identifier: data.identifier,
            password: data.password
        })

        if(result?.error){
            if(result.error === "CredentialsSignin"){
                toast({
                    title: "Login Failed",
                    description: "Incorrect Username or Password",
                    variant: "destructive"
                })
            } else {
                toast({
                    title: 'Error',
                    description: result.error,
                    variant: 'destructive'
                })
            }
        }

        if(result?.url){
            router.replace('/dashboard')
        }
    }
    
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
           Welcome Back to Flicker
          </h1>
          <p className="mb-4">Sign in to continue your secret conversations</p>
        </div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                <FormField
                    name="identifier"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email/Username</FormLabel>
                          <Input
                            {...field}
                            />
                       <FormMessage/> 
                      </FormItem>
                    )}
                />
              <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" {...field} name="password" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className='w-full'>
              Sign In
            </Button>
            </form>
        </Form>
        <div className='text-center mt-4'>
            <p>
                New here, let me get your wristband to the party!{' '}
                <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
                    Sign Up
                </Link>
                <div className='text-center'>
                   <Link href="/forgot-password" className="text-blue-600 hover:text-blue-800">
                      Forgot Password
                    </Link>
                </div>
            </p>
        </div>
     </div>
  </div>
  )
}

export default SignInForm
