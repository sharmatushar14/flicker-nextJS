'use client';

import { signOut, useSession } from 'next-auth/react';
import React from 'react'
import { Button } from './ui/button';
import Link from 'next/link';
import { User } from 'next-auth';

const Navbar = () => {
    const {data: session} = useSession();
    const user: User = session?.user as User; //Might be confusing but this is the only way to extract the current user from the current session which was injected through token

  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a href="#" className="text-xl font-bold mb-4 md:mb-0">
          True Feedback
        </a>
        {session ? (
            <>
          <span className="mr-4">
          Welcome, {user.username || user.email}
        </span>
        <Button onClick={() => signOut()} className="w-full md:w-auto bg-slate-100 text-black" variant='outline'>
          Logout
        </Button>
        </>
        ) : (
          <>
            <div className="flex items-center space-x-4 ml-auto">
            <Link href='/sign-in'>
                <Button className='w-full md:w-auto bg-slate-100 text-black ' variant={'outline'}>
                    Login
                </Button>
            </Link>
            <Link href='/sign-up'>
            <Button className='w-full md:w-auto bg-slate-100 text-black' variant={'outline'}>
                Sign Up
              </Button>
              </Link>
              </div>
          </>
        )
        }
    </div>
    </nav>
  )
}

export default Navbar
