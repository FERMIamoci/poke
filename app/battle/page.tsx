"use client";

import { useEffect, useState } from "react";
import { isFighting } from "@/utils/api";
import Matchmaking from "@/components/Matchmaking";
import Battle from "@/components/Battle";

export default function BattlePage() {
	const [fighting, setFighting] = useState(false);
	const [loading, setLoading] = useState(true);
	async function checkBattle() {
		setFighting(await isFighting());
	}

	useEffect(() => {
		const fetchData = async () => {
			await checkBattle();
			setLoading(false);
		}
		fetchData();
	}, []);

	return (
		<div className="flex w-full">{loading ? null : fighting ? <Battle /> : <Matchmaking />}</div>
	);
}
