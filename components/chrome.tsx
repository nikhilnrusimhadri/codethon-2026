'use client'; import { usePathname } from 'next/navigation'; import { Navbar,Footer } from './site';
export function SiteChrome({children}:{children:React.ReactNode}){const p=usePathname();if(p.startsWith('/admin'))return <>{children}</>;return <><Navbar/>{children}<Footer/></>}
