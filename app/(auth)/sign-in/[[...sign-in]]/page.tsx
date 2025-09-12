import { SignIn } from '@clerk/nextjs'

export default function Page() {
    return (<div className='flex item-center justify-center w-full h-screen'>
        <SignIn />
    </div>)
}