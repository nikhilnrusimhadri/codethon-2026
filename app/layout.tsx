import './globals.css'; import { SiteChrome } from '@/components/chrome';
export const metadata = { title: 'CODETHON 2026 | MIST', description: 'CODETHON 2026 — a four-round coding competition by Abhiruchi Club at Mother Teresa Institute of Science and Technology.' };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><SiteChrome>{children}</SiteChrome></body></html>}
