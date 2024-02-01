"use client";
import Link from "next/link";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { isLogged, signOut } from "@/utils/api";

export default function AuthButton() {
	const [logged, setLogged] = useState(false);
	const handleSignOut = async () => {
    setLogged(false);
		await signOut();
	};

	useEffect(() => {
		const fetchUser = async () => {
			isLogged().then((res) => {
				setLogged(res);
			});
		};
		fetchUser();
	}, [logged]);

	return logged ? (
		<Button onClick={handleSignOut}>Logout</Button>
	) : (
		<Link
			href="/login"
			className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
			Login
		</Link>
	);
}
