'use client'
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";

import { signIn, signUp } from "@/utils/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const handleSingIn = async () => {
    await signIn(email, password);
  };

  const handleSingUp = async () => {
    await signUp(email, password);
  };

	return (
		<div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
			<Link
				href="/"
				className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1">
					<polyline points="15 18 9 12 15 6" />
				</svg>{" "}
				Back
			</Link>

			<div className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
				<label className="text-md" htmlFor="email">
					Email
				</label>
				<input
					className="rounded-md px-4 py-2 bg-inherit border mb-6"
					name="email"
					placeholder="you@example.com"
          onChange={(e) => setEmail(e.target.value)}
					required
				/>
				<label className="text-md" htmlFor="password">
					Password
				</label>
				<input
					className="rounded-md px-4 py-2 bg-inherit border mb-6"
					type="password"
					name="password"
					placeholder="••••••••"
          onChange={(e) => setPassword(e.target.value)}
					required
				/>
				<Button onClick={handleSingIn}>Sign In</Button>
				<Button onClick={handleSingUp}>Sign Up</Button>
			</div>
		</div>
	);
}
