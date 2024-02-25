"use client";
import React, { useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import { updateName } from "@/utils/api";
import { UserContext } from "@/utils/UserContext";

export default function Profile() {
	const user = useContext(UserContext).user;
	const [name, setName] = useState("");

	const changeName = async () => {
		if (name !== "") {
			await updateName(name);
		}
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
				onChange={(e) => setName(e.target.value)}
			/>
			<Button onClick={() => changeName()}>Update Name</Button>
		</div>
	);
}
