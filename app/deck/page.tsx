"use client";
import { PokemonCard } from "@/components/PokemonCard";
import React, { useEffect, useState } from "react";

import { Deck, getUserData, getUserDeck } from "@/utils/api";

export default function DeckPage() {
	const [deck, setDeck] = useState<Deck>();
	const [user, setUser] = useState({
		id: "",
		email: "",
		name: "",
	});
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
	return (
		<div className="flex flex-col w-full h-screen">
			<div className="font-semibold text-4xl p-8">Deck</div>
			{deck ? (
				<div className="flex flex-col gap-4 w-full">
					<div className="sticky top-0 z-10">
						<div className="grid grid-cols-4 gap-3 px-8 bg-white">
							{Object.keys(deck.deck).map((key) => {
								return (
									deck.deck[key].battle && (
										<div key={key}>
											<PokemonCard
												pokeId={key}
												action="remove"
												onClick={() =>
													setPokemonChange(
														!pokemonChange
													)
												}
											/>
										</div>
									)
								);
							})}
						</div>
						<div className="bg-gradient-to-b pb-5 from-white">
							&#8205;
						</div>
					</div>
					<div className="grid grid-cols-5 gap-4 p-8">
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
