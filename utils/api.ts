"use server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";

export type Deck = {
  deck: {
    [pokeId: string]: {
      lvl: number;
      battle: boolean;
    };
  };
};

export type User = {
  id: string;
  name: string;
};

async function getUser() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return redirect("/login");

  return user;
}

async function getUserData() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const user = await getUser();

  const {
    data: { id, name },
  } = await supabase.from("users").select("*").eq("id", user?.id).single();

  
  return {id, name} as User;
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

  revalidatePath("/profile");

  return redirect("/profile?message=Name updated");
};

async function toggleBattleStatus(pokeId: string, status: boolean) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const user = await getUserData();
  const deck = (await getUserDeck(user.id)) as Deck;
  const { error } = await supabase
    .from("users")
    .update({
      deck: {
        ...deck.deck,
        [pokeId]: { ...deck.deck[pokeId], battle: status },
      },
    })
    .eq("id", user.id);

  if (error) {
    return redirect(
      `/deck?message=${
        status ? "Could not add to battle" : "Could not remove from battle"
      }`
    );
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
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  return true;
};

async function signOut() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.auth.signOut();

  if (error) {
    return redirect("/?message=Could not sign out");
  }

  return redirect("/?message=Signed out");
}

async function signIn(email: string, password: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return redirect("/login?message=Could not sign in");
  }

  return redirect("/?message=Signed in");
}

async function signUp(email: string, password: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${headers().get("origin")}/auth/callback`,
    },
  });

  if (error) {
    return redirect("/login?message=Could not sign up");
  }

  console.log("Check your email for the confirmation link");
}

async function getBid(id?: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const bid = await supabase
    .from("users")
    .select("bid")
    .eq("id", id ? id : (await getUserData()).id)
    .single();
  return bid.data?.bid as string;
}

async function pending(condition?: boolean) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data } = await supabase
    .from("users")
    .select("id")
    .eq("isPending", condition ? condition : true)
    .neq("id", (await getUserData()).id);
  return data || [];
}

async function isFighting() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data } = await supabase
    .from("users")
    .select("isFighting")
    .eq("id", (await getUserData()).id)
    .single();
  return data?.isFighting as boolean;
}

async function matchmaking() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const pendingUsers = await pending();
  const otherUser = pendingUsers[0];
  console.log("Starting matchmaking");
  if (pendingUsers?.length > 0) {
    const otherBid = await getBid(otherUser.id);
    const id = (await getUserData()).id;
    await supabase.from("users").update({ bid: otherBid }).eq("id", id);

    const data = await supabase.from("users").select("id").eq("bid", otherBid);

    if (data.data?.length === 2) {
      console.log(data.data);
      console.log("Match found");
      data.data.forEach(async (user) => {
        console.log(user.id);
        await supabase
          .from("users")
          .update({ isFighting: true, isPending: false })
          .eq("id", user.id);
      });
    }

    return 0;
  } else {
    console.log("No pending users");
    await supabase
      .from("users")
      .update({ isPending: true, bid: randomUUID() })
      .eq("id", (await getUserData()).id);
    console.log("Is now pending");
  }
}

async function getBattlePlayers() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const bid = await getBid();
  const { data } = await supabase.from("users").select("id").eq("bid", bid);
  return data;
}

async function getBattleDecks() {
  const players = await getBattlePlayers();
  if (!players || players.length !== 2) return [];
  const [p1, p2] = players;
  const decks = await Promise.all([getUserDeck(p1.id), getUserDeck(p2.id)]);
  return decks;
}

export {
  getUser,
  getUserData,
  getUserDeck,
  updateName,
  removeFromBattle,
  addToBattle,
  isLogged,
  signOut,
  signIn,
  signUp,
  pending,
  getBid,
  matchmaking,
  isFighting,
  getBattleDecks,
};
