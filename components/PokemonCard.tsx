"use client";
import { Card } from "../components/ui/card";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

import { removeFromBattle, addToBattle } from "@/utils/api";

export function PokemonCard({
	pokeId,
	action,
	onClick,
}: {
	pokeId: string;
	action?: string;
	onClick?: () => void;
}) {
	const [data, setData] = useState<{ name: string } | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			if (pokeId !== "undefined") {
				const response = await fetch(
					`https://pokeapi.co/api/v2/pokemon/${pokeId}`
				);
				const data = await response.json();
				setData(data);
			}
		};
		fetchData();
	}, [pokeId]);

	if (!data) {
		return null; // or a loading spinner
	}

	const handleRemove = () => {
		removeFromBattle(pokeId);
		onClick && onClick();
	};

	const handleAdd = () => {
		addToBattle(pokeId);
		onClick && onClick();
	};

	return (
		<Card className="flex flex-col p-2 items-center">
			<Image
				src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokeId}.png`}
				width={75}
				height={75}
				alt="pokemon"
				priority={true}
			/>
			<div>
				{data?.name?.charAt(0).toUpperCase() + data?.name?.slice(1)}
			</div>
			{action === "remove" && (
				<Button onClick={handleRemove}>Remove</Button>
			)}
			{action === "add" && <Button onClick={handleAdd}>Add</Button>}
		</Card>
	);
}
