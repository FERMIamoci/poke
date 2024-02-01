"use server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { SupabaseClient } from "@supabase/supabase-js";

export type Deck = {
	"deck": {
		[pokeId: string]: {
			"pokeId": string,
			"lvl": number,
			"battle": boolean,
		},
	};
};

let supabase: SupabaseClient<any, "public", any>;

function initializeSupabase() {
 if (!supabase) {
    const cookieStore = cookies();
    supabase = createClient(cookieStore);
 }
 return supabase;
}

async function getUserData() {
	const supabase = initializeSupabase();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	console.log(user);

	if (!user) return redirect("/login");

	const {
		data: { id, email, name },
	} = await supabase.from("users").select("*").eq("id", user?.id).single();

	return { id, email, name };
}

async function getUserDeck(id: string) {
	const supabase = initializeSupabase();

	const { data } = await supabase
		.from("users")
		.select("deck")
		.eq("id", id)
		.single();

	return data as Deck;
}

const updateName = async (name: string) => {
const supabase = initializeSupabase();
	const user = await getUserData();

	const { error } = await supabase
		.from("users")
		.update({ name })
		.eq("id", user.id);

	if (error) {
		return redirect("/profile?message=Could not update name");
	}

	revalidatePath("/profile");
	return redirect("/profile?message=Name updated");
};

async function toggleBattleStatus(pokeId: string, status: boolean) {
 const supabase = initializeSupabase();
 const user = await getUserData();
 const deck = await getUserDeck(user.id) as Deck;
 const { error } = await supabase
    .from("users")
    .update({ deck: { ...deck.deck, [pokeId]: { ...deck.deck[pokeId], battle: status } } })
    .eq("id", user.id);

 if (error) {
    return redirect(`/deck?message=${status ? "Could not add to battle" : "Could not remove from battle"}`);
 }

 revalidatePath("/deck");
}

const removeFromBattle = async (pokeId: string) => {
 return toggleBattleStatus(pokeId, false);
};

const addToBattle = async (pokeId: string) => {
 return toggleBattleStatus(pokeId, true);
};

const isLogged = async () => {
const supabase = initializeSupabase();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) return false;

	return true;
}

export { getUserData, getUserDeck, updateName, removeFromBattle, addToBattle, isLogged};