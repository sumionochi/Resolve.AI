import { Button } from '@/components/ui/button'
import { ArrowRight, ArrowUpRight, BarChart, BarChart2, BookText, Bot, BotIcon, Github, Key, Linkedin, Lock, Mail, Map, ScrollText, Text } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { ThemeProvider } from '@/components/ui/ThemeProvider'
import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs'

export default function Home() {
  return (
    <div className='flex relative overflow-hidden antialiased min-h-screen flex-col items-center justify-between'>
        <div className='flex flex-col items-center min-h-screen justify-center'>
          <div className='flex text-white p-6 pt-0 mb-40 rounded-xl gap-4 flex-col max-w-5xl'>
            <div className='text-center font-semibold text-3xl md:text-5xl xl:text-6xl'>
              <div className='flex flex-col text-center'>
                <p className='text-6xl'>Create New Resolutions</p>
                <span className=' text-purple-900 dark:text-purple-300 text-lg mt-2'>Track, Achieve, Consult and Build Memories.</span>
              </div>
            </div>
            <div className='text-center'>
            <Button className='p-6 shadow-md shadow-black border-none bg-gradient-to-r from-violet-500 to-violet-300 text-white rounded-xl' size={'lg'} asChild>
              <Link href={'/dashboard'}>Let's Resolve <ArrowRight className='ml-1 w-5 h-5'/></Link>
            </Button>
            </div>
          </div>
        </div>
        <div className='flex px-4 pt-1 bg-white/20 text-white justify-between gap-4 flex-row items-center text-primary h-14 absolute bottom-0 w-full'>
        <h2 className='text-white'>© 2023 Resolve.AI</h2>
        <div className='flex flex-row gap-4 justify-center items-center'>
          <Link href={'https://github.com/sumionochi'}>
            <Github/>
          </Link>
          <Link href={'https://www.linkedin.com/in/aaditya-srivastava-b4564821b/'}>
            <Linkedin/>
          </Link>
          <Link href={'mailto:aaditya.srivastava.connect@gmail.com'}>
            <Mail/>
          </Link>
          <Link href={'https://sumionochi.github.io/Portfolio-landing-page/'}>
            <ArrowUpRight/>
          </Link>
        </div>
        </div>
    </div>
  )
}
