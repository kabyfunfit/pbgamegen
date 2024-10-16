"use server";

import { databases } from "@/lib/appwrite-server";
import { Query } from "appwrite";

export async function getPlayerData(userId: string) {
  try {
    const player = await databases.getDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_PLAYERS_COLLECTION_ID!,
      userId
    );
    return player;
  } catch (error) {
    console.error("Failed to fetch player data", error);
    throw new Error("Failed to fetch player data");
  }
}

export async function getAllPlayers() {
  try {
    const players = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_PLAYERS_COLLECTION_ID!,
      [Query.limit(100)]
    );
    return players.documents;
  } catch (error) {
    console.error("Failed to fetch all players", error);
    throw new Error("Failed to fetch all players");
  }
}
