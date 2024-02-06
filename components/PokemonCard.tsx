"use client";
import { Card } from "../components/ui/card";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

import { removeFromBattle, addToBattle } from "@/utils/api";
import { FastAverageColor } from "fast-average-color";

export function PokemonCard({
	pokeId,
	action,
	onClick,
	size,
}: {
	pokeId: string;
	action?: string;
	onClick?: () => void;
	size?: number;
}) {
	const [data, setData] = useState<{ name: string } | null>(null);
	const [color, setColor] = useState<string>("#000000");

	useEffect(() => {
		const fetchData = async () => {
			setColor(
				(
					await new FastAverageColor().getColorAsync(
						`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokeId}.png`
					)
				).hex.substring(1)
			);
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
		<Card
			className="flex flex-col p-2 items-center"
			style={{
				backgroundColor: `#${color}`,
			}}>
			<Image
				src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokeId}.png`}
				width={size || 75}
				height={size || 75}
				alt="pokemon"
				priority={true}
			/>

			<div className="font-semibold pb-4">
				{data?.name?.charAt(0).toUpperCase() + data?.name?.slice(1)}
			</div>
			{action === "remove" && (
				<Button onClick={handleRemove}>Remove</Button>
			)}
			{action === "add" && <Button onClick={handleAdd}>Add</Button>}
		</Card>
	);
}
