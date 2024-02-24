"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import { getUserData, updateName } from "@/utils/api";


export default function Profile() {
	const [newName, setNewName] = useState("");
	const [name, setName] = useState("");
	const [user, setUser] = useState({
		id: "",
		name: "",
	});

	useEffect(() => {
		const fetchData = async () => {
			const userData = await getUserData();
			setUser(userData);
			setName(userData.name);
		};

		fetchData();
	}, []);

	const changeName = async () => {
		if (newName !== "") {
			await updateName(newName);
			setName(newName);
		}
	};

	return (
		<div className="flex flex-col w-full">
			<div className="font-semibold text-2xl">Profile</div>
			<div>Id: {user?.id}</div>
			<div>Username: {name}</div>
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
