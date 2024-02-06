"use client";

import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { isLogged, signOut } from "@/utils/api";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

export default function AuthButton() {
	const router = useRouter();
	const [logged, setLogged] = useState(false);
	const handleSignOut = async () => {
		setLogged(false);
		await signOut();
	};

	const message = useSearchParams().get("message");

	useEffect(() => {
		const fetchUser = async () => {
			isLogged().then((res) => {
				setLogged(res);
			});
		};
		fetchUser();
	}, [logged, message]);

	return logged ? (
		<Button onClick={handleSignOut}>Logout</Button>
	) : (
		<Button
			onClick={() => {
				router.push("/login");
			}}>
			Login
		</Button>
	);
}
