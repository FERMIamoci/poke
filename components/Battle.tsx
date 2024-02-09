"use client";

import Image from "next/image";
import { getBattleDecks } from "@/utils/api";
import { useState, useEffect } from "react";
import { Deck } from "@/utils/api";
import { PokemonCard } from "./PokemonCard";

export default function Battle() {
	const [d1, setD1] = useState<Deck>();
	const [d2, setD2] = useState<Deck>();

	useEffect(() => {
		const fetchData = async () => {
			const decks = await getBattleDecks();
			setD1(decks[0]);
			setD2(decks[1]);
		};
		fetchData();
	}, []);

	return (
		<div className="flex flex-col w-full ">
			<h1 className="text-center font-semibold text-2xl">Battle</h1>

			<div className="absolute bottom-10 w-full">
				<div className="flex flex-row w-full justify-evenly">
					<div className="flex flex-col">
						<Image
							className="flex w-64 justify-center"
							src="https://play.pokemonshowdown.com/sprites/trainers/ash.png"
							alt="Ash"
							width={100}
							height={100}
						/>
						<div className="grid grid-cols-3">
							{d1 &&
								Object.keys(d1.deck).map((pokeId) => {
									return d1.deck[pokeId].battle ? (
										<PokemonCard
											key={pokeId}
											pokeId={pokeId}
										/>
									) : null;
								})}
						</div>
					</div>

					<div className="flex flex-col">
						<Image
							className="flex w-64"
							src="https://play.pokemonshowdown.com/sprites/trainers/ash.png"
							alt="Ash"
							width={100}
							height={100}
						/>
						<div className="grid grid-cols-3">
							{d2 &&
								Object.keys(d2.deck).map((pokeId) => {
									return d2.deck[pokeId].battle ? (
										<PokemonCard
											key={pokeId}
											pokeId={pokeId}
										/>
									) : null;
								})}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
