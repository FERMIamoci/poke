"use client";
import { PokemonCard } from "@/components/PokemonCard";
import React, { useEffect, useState } from "react";

import { Deck, getUserData, getUserDeck } from "@/utils/api";
import { Skeleton } from "@/components/ui/skeleton";

export default function DeckPage() {
	const [deck, setDeck] = useState<Deck>();
	const [user, setUser] = useState({
		id: "",
		name: "",
	});
	const [pokemonChange, setPokemonChange] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(false);
			const userData = await getUserData();
			setUser(userData);
			if (userData && userData.id) {
				const userDeck = await getUserDeck(userData.id);
				if (userDeck) {
					setDeck(userDeck);
					setIsLoading(true);
				}
			}
		};

		fetchData();
	}, [pokemonChange]);
	return (
		<div className="flex flex-col w-full h-screen">
			<div className="font-semibold text-4xl p-8">Deck</div>
			{isLoading && deck ? (
				<div className="flex flex-col gap-4 w-full">
					<div className="sticky top-0 z-10">
						<div className="grid grid-cols-4 gap-3 px-8 bg-white pb-4">
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
						<div className="bg-gradient-to-b pb-4 from-white">
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
				<>
					<div className="grid grid-cols-4 gap-4 p-8">
						{Array.from({ length: 8 }).map((_, index) => (
							<div
								key={index}
								className="flex flex-col gap-4 w-full">
								<Skeleton className="h-[125px] w-[125px] rounded-xl" />
								<div className="space-y-2">
									<Skeleton className="h-4 w-[200px]" />
									<Skeleton className="h-4 w-[150px]" />
								</div>
							</div>
						))}
					</div>
					<div className="grid grid-cols-5 gap-4 p-8">
						{Array.from({ length: 20 }).map((_, index) => (
							<div
								key={index}
								className="flex flex-col gap-4 w-full">
								<Skeleton className="h-[125px] w-[125px] rounded-xl" />
								<div className="space-y-2">
									<Skeleton className="h-4 w-[200px]" />
									<Skeleton className="h-4 w-[150px]" />
								</div>
							</div>
						))}
					</div>
				</>
			)}
		</div>
	);
}


