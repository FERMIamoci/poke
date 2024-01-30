"use client";
import { PokemonCard } from "@/components/PokemonCard";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import { Deck, getUserData, getUserDeck, updateName } from "@/utils/api";

export default function Profile() {
	const [newName, setNewName] = useState("");
	const [user, setUser] = useState({
		id: "",
		email: "",
		name: "",
	});
	const [deck, setDeck] = useState<Deck>();
	const [pokemonChange, setPokemonChange] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			const userData = await getUserData();
			setUser(userData);

			if (userData && userData.id) {
				const userDeck = await getUserDeck(userData.id);
				if (userDeck) {
					setDeck(userDeck);
				}
			}
		};

		fetchData();
	}, [pokemonChange]);

	const changeName = async () => {
		if (newName !== "") {
			await updateName(newName);
		}
		setPokemonChange(!pokemonChange);
	};

	return (
		<div className="flex flex-col w-full">
			<div className="font-semibold text-2xl">Profile</div>
			<div>Email: {user.email}</div>
			<div>Id: {user.id}</div>
			<div>Username: {user.name}</div>
			<input
				type="text"
				name="name"
				placeholder="Name"
				onChange={(e) => setNewName(e.target.value)}
			/>
			<Button onClick={() => changeName()}>Update Name</Button>
			<div className="font-semibold text-2xl">Deck</div>

			{deck ? (
				<div className="flex flex-row gap-8">
					<div className="flex flex-col">
						{Object.keys(deck.deck).map((key) => {
							return (
								deck.deck[key].battle && (
									<div key={key}>
										<PokemonCard
											pokeId={key}
											action="remove"
											onClick={() =>
												setPokemonChange(!pokemonChange)
											}
										/>
									</div>
								)
							);
						})}
					</div>
					<div className="grid grid-cols-3 gap-4">
						{Object.keys(deck.deck).map((key) => {
							return (
								!deck.deck[key].battle && (
									<div key={key}>
										<PokemonCard
											pokeId={key}
											action="add"
											onClick={() =>
												setPokemonChange(!pokemonChange)
											}
										/>
									</div>
								)
							);
						})}
					</div>
				</div>
			) : (
				<div>Loading...</div>
			)}
		</div>
	);
}
