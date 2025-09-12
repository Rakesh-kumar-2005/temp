import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className='flex item-center justify-center w-full h-screen'>
        <SignUp />
    </div>
  )
}