"use client";

import { Button } from "./ui/button";
import { matchmaking, isFighting } from "@/utils/api";
import { useRouter } from "next/navigation";

export default function Matchmaking() {
    const router = useRouter();
	const handleCLick = async () => {
        if (await isFighting()) {
            router.push("/battle");
            return;
        }
		matchmaking();
	};

	return (
		<div>
			<Button onClick={handleCLick}>Find Match</Button>
		</div>
	);
}
