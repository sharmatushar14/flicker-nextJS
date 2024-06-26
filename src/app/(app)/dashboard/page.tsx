'use client'
import { useToast } from '@/components/ui/use-toast'
import { Message } from '@/model/User'
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema'
import { ApiResponse } from '@/types/ApiRespone'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useSession } from 'next-auth/react'
import { User } from 'next-auth'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Loader2, RefreshCcw } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import MessageCard from '@/components/MessageCard'

const UserDashboard = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchingLoading, setIsSwitchingLoading] = useState(false)

  const {toast} = useToast();

  const handleDeleteMessage = (messageId: string)=>{
    setMessages(messages.filter((message)=>messageId !== message._id))
  }
  
  //Now finding the current user's session using NextAuth useSession function
  const {data: session} = useSession();

  const form =  useForm({
    resolver: zodResolver(acceptMessageSchema)
  })

  const {register, watch, setValue} = form;
  const acceptMessages = watch('acceptMessages')

  const fetchAcceptMessages = useCallback(async()=>{
     //useCallback will return a memoized version of the callback that only changes if one of the inputs has changed.
    setIsSwitchingLoading(true);
    try {
        const response = await axios.get('/api/accept-messages');
        console.log('Fetch accept messages response:', response);
        setValue('acceptMessages', response.data.isAcceptingMessages);
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
        toast({
            title: 'Error',
            description: axiosError.response?.data.message ?? 'Failed to fetch messages settings',
            variant: 'destructive'
        })
    } finally {
        setIsLoading(false);
        setIsSwitchingLoading(false);
    }
  }, [setValue, toast]);

  const fetchMessages = useCallback(async(refresh: boolean=false)=>{
    setIsLoading(true)
    setIsSwitchingLoading(true)
    try {
        const response = await axios.get<ApiResponse>('/api/get-messages');
        console.log('Fetch messages response:', response);
        setMessages(response.data.messages || []);
        if(refresh){
            toast({
                title: 'Refreshed Messages',
                description: "Showing latest messages"
            })
        }
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: 'Refreshed Messages',
          description:
          axiosError.response?.data.message ?? 'Failed to fetch messages',
          variant: 'default',
        });
    } finally {
        setIsLoading(false);
        setIsSwitchingLoading(false)
    }
  }, [setIsLoading, setMessages])


  //Fetch initial state from the server
  //useEffect always render for the very first time even w/o changing of the dependency array variables
  useEffect(()=>{
    if(!session || !session.user) {
      console.log('No session or user found');
      return;
    }
    fetchAcceptMessages();
    fetchMessages();
  }, [session, setValue, fetchAcceptMessages, fetchMessages]);

  const handleSwitchChange = async ()=>{
 
    try {
        const response= await axios.post<ApiResponse>('/api/accept-messages', {
          acceptMessages: !acceptMessages
        });
        setValue('acceptMessages', !acceptMessages);
        console.log('Switch change response:', acceptMessages);
        toast({
            title: response.data.message,
            variant: 'default',
        })
    } catch (error) {
        console.log('Error during switch change:', error);
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: 'Error',
          description:
            axiosError.response?.data.message ??
            'Failed to update message settings',
          variant: 'destructive',
        });
    }
  }

  //One more check for if not having the session
  if(!session || !session.user){
    return <div>Just hold a sec...</div>
  }

  const {username} = session.user as User;
  ////Study more about how to find this baseUrl
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = ()=>{
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: 'URL Copied!',
      description: 'Profile URL has been copied to clipboard!'
    })
  }

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
    <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

    <div className="mb-4">
      <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
      <div className="flex items-center">
        <input
          type="text"
          value={profileUrl}
          disabled
          className="input input-bordered w-full p-2 mr-2"
        />
        <Button onClick={copyToClipboard}>Copy</Button>
      </div>
    </div>

    <div className="mb-4">
      <Switch
        {...register('acceptMessages')}
        checked={acceptMessages}
        onCheckedChange={handleSwitchChange}
        disabled={isSwitchingLoading}
      />
      <span className="ml-2">
        Accept Messages: {acceptMessages ? 'On' : 'Off'}
      </span>
    </div>
    <Separator />

    <Button
      className="mt-4"
      variant="outline"
      onClick={(e) => {
        e.preventDefault();
        fetchMessages(true);
      }}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <RefreshCcw className="h-4 w-4" />
      )}
    </Button>
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
      {messages.length > 0 ? (
        messages.map((msg, idx)=>(
          <MessageCard key={msg._id}
           message={msg}
           onMessageDelete={handleDeleteMessage}
          />
        ))
      ): (
        <p>No messages to display!</p>
      )}
    </div>
   </div>
  )
}

export default UserDashboard

//Why the const value Changes Properly
// The acceptMessages value is correctly toggled and updated because:

// The watch function keeps track of the form field value and updates the component when it changes.
// The setValue function explicitly updates the form field value when the switch is toggled and the server responds successfully.