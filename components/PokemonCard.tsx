"use client";
import { Card } from "../components/ui/card";
import Image from "next/image";
import { useEffect, useState } from "react";

interface PokemonData {
    name: string;
    // Add other properties here if needed
}

export default function PokemonCard({ pokeId }: { pokeId: string }) {
    const [data, setData] = useState<PokemonData | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(
                `https://pokeapi.co/api/v2/pokemon/${pokeId}`
            );
            const data = await response.json();
            setData(data);
        };

        fetchData();
    }, [pokeId]);

    if (!data) {
        return null; // or a loading spinner
    }

    return (
        <Card className="flex flex-col p-3 items-center">
            <Image
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokeId}.png`}
                width={100}
                height={100}
                alt="pokemon"
            />
            <div>
                {data?.name?.charAt(0).toUpperCase() + data?.name?.slice(1)}
            </div>
        </Card>
    );
}
