import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import PokemonCard from "@/components/PokemonCard";

export default async function Profile() {
	const cookieStore = cookies();
	const supabase = createClient(cookieStore);

	// get user
	const {
		data: { user },
	} = await supabase.auth.getUser();

	// redirect to login if not logged in
	if (!user) return redirect("/login");

	// get user data
	const {
		data: { name, deck },
	} = await supabase.from("users").select("*").eq("id", user?.id).single();

	const updateName = async (formData: FormData) => {
		"use server";

		const name = formData.get("name") as string;
		const cookieStore = cookies();
		const supabase = createClient(cookieStore);

		const { error } = await supabase
			.from("users")
			.update({ name })
			.eq("id", user?.id);

		if (error) {
			return redirect("/profile?message=Could not update name");
		}

		revalidatePath("/profile");
	};

	return (
		<div className="flex flex-col w-full">
			<div className="font-semibold text-2xl">Profile</div>
			<div>Email: {user.email}</div>
			<div>Id: {user.id}</div>
			<div>Role: {user.role}</div>
			<div>Username: {name}</div>
			<form action={updateName}>
				<input type="text" name="name" placeholder="Name" />
				<button>Update Name</button>
			</form>
			<div>Deck:</div>
			<div className="flex flex-col mx-[20%]">
				<div className="grid grid-cols-3 gap-4">
					{Object.keys(deck).map((key) => {
						return <PokemonCard key={key} pokeId={key} />;
					})}
				</div>
			</div>
		</div>
	);
}
