import { GeistSans } from 'geist/font/sans'
import './globals.css'
import React from "react";
import Navbar from '@/components/Navbar';
import { UserProvider } from '@/utils/UserContext';
import { getUserData } from '@/utils/api';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Next.js and Supabase Starter Kit',
  description: 'The fastest way to build apps with Next.js and Supabase',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUserData();
  return (
		<html lang="en" className={GeistSans.className}>
			<body className="bg-background text-foreground">
				<main className="min-h-screen flex flex-col items-center">
          <UserProvider value={{
            user,
          }}>
            <Navbar />
            {children}
          </UserProvider>
				</main>
			</body>
		</html>
  );
}
