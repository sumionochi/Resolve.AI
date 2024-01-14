"use client"
import React, { useState } from 'react'
import { Button } from './ui/button'
import { Themetoggle } from './ui/Themetoggle'
import Logo from './Logo'
import { UserButton, auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { User } from '@clerk/nextjs/server'
// import CreateTask from './CreateTask'

type Props = {
  userId : string | null
}  

const NavHeader = ({userId}: Props) => {
  const [addDialog, setAddDialog] = useState(false);
  return (
    <>
      <header className='sticky top-0 z-50 backdrop-blur-sm mx-auto'>
        <nav className='flex max-w-6xl gap-2 flex-col sm:flex-row items-center p-5 pl-2 bg-none mx-auto'>
          <Logo/>
          <div className='flex-1 flex items-center justify-end space-x-4'>
            <div className='flex gap-0 bg-secondary p-4 mr-0 rounded-lg'>
              {userId &&
                <div className='flex mr-4 flex-row gap-4 items-center justify-center'> 
                  <UserButton afterSignOutUrl='/' appearance={{elements:{avatarBox:{width:'2.5rem', height:"2.5rem"}}}}/>
                  <Button className='p-3 shadow-md shadow-black border-none bg-gradient-to-br from-violet-500 to-violet-300 text-white rounded-xl' onClick={()=>setAddDialog(true)}>New Resolve</Button>
                </div>
              }
              <Themetoggle/>
            </div>
          </div>
        </nav>
      </header>
    </>
  )
}

export default NavHeader