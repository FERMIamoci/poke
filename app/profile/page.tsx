"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import {getUserData, updateName } from "@/utils/api";
import { useRouter } from "next/navigation";

export default function Profile() {
	const router = useRouter();
	const [newName, setNewName] = useState("");
	const [user, setUser] = useState({
		id: "",
		name: "",
	});
	const [event, setEvent] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			setUser(await getUserData());
			console.log("User data:", user);
		};

		fetchData();
	}, [event]);

	const changeName = async () => {
		if (newName !== "") {
			await updateName(newName);
		}
		setEvent(!event);
	};

	return (
		<div className="flex flex-col w-full">
			<div className="font-semibold text-2xl">Profile</div>
			<div>Id: {user?.id}</div>
			<div>Username: {user?.name}</div>
			<input
				type="text"
				name="name"
				placeholder="Name"
				onChange={(e) => setNewName(e.target.value)}
			/>
			<Button onClick={() => changeName()}>Update Name</Button>
		</div>
	);
}
