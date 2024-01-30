"use server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export type Deck = {
	"deck": {
		[pokeId: string]: {
			"pokeId": string,
			"lvl": number,
			"battle": boolean,
		},
	};
};

async function getUserData() {
	const cookieStore = cookies();
	const supabase = createClient(cookieStore);

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) return redirect("/login");

	const {
		data: { id, email, name },
	} = await supabase.from("users").select("*").eq("id", user?.id).single();

	return { id, email, name };
}

async function getUserDeck(id: string) {
	const cookieStore = cookies();
	const supabase = createClient(cookieStore);

	const { data } = await supabase
		.from("users")
		.select("deck")
		.eq("id", id)
		.single();

	return data as Deck;
}

const updateName = async (name: string) => {
	const cookieStore = cookies();
	const supabase = createClient(cookieStore);
	const user = await getUserData();

	const { error } = await supabase
		.from("users")
		.update({ name })
		.eq("id", user.id);

	if (error) {
		return redirect("/profile?message=Could not update name");
	}

	revalidatePath("/");
};

const removeFromBattle = async (pokeId: string) => {
	const cookieStore = cookies();
	const supabase = createClient(cookieStore);
	const user = await getUserData();
	const deck = await getUserDeck(user.id) as Deck;
	const { error } = await supabase
		.from("users")
		.update({ deck: { ...deck.deck, [pokeId]: { ...deck.deck[pokeId], battle: false } } })
		.eq("id", user.id);

	if (error) {
		return redirect("/profile?message=Could not remove from battle");
	}

	revalidatePath("/");
}

const addToBattle = async (pokeId: string) => {
	const cookieStore = cookies();
	const supabase = createClient(cookieStore);
	const user = await getUserData();
	const deck = await getUserDeck(user.id) as Deck;

	const { error } = await supabase
		.from("users")
		.update({ deck: { ...deck.deck, [pokeId]: { ...deck.deck[pokeId], battle: true } } })
		.eq("id", user.id);

	if (error) {
		return redirect("/profile?message=Could not add to battle");
	}

	revalidatePath("/");
}

export { getUserData, getUserDeck, updateName, removeFromBattle, addToBattle };