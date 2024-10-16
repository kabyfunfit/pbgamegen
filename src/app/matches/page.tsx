"use client";

import { useState, useEffect } from "react";
import useAppwrite from "../../lib/useAppwrite";
import { ID } from "appwrite";
import Link from "next/link";

interface Player {
  id: string;
  name: string;
  gender: "male" | "female";
}

interface Team {
  male: Player;
  female: Player;
}

export default function Matches() {
  const { databases } = useAppwrite();
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    if (databases) {
      fetchPlayers();
    }
  }, [databases]);

  const fetchPlayers = async () => {
    if (databases) {
      try {
        const response = await databases.listDocuments(
          "YOUR_DATABASE_ID",
          "players"
        );
        setPlayers(response.documents as Player[]);
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    }
  };

  const togglePlayerSelection = (player: Player) => {
    setSelectedPlayers((prev) =>
      prev.find((p) => p.id === player.id)
        ? prev.filter((p) => p.id !== player.id)
        : [...prev, player]
    );
  };

  const generateTeams = () => {
    const males = selectedPlayers.filter((p) => p.gender === "male");
    const females = selectedPlayers.filter((p) => p.gender === "female");

    const newTeams: Team[] = [];

    for (let i = 0; i < males.length; i++) {
      for (let j = 0; j < females.length; j++) {
        newTeams.push({ male: males[i], female: females[j] });
      }
    }

    setTeams(newTeams);
  };

  return (
    <main className="py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-primary">
        Create Match
      </h1>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-secondary">
          Select Players
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {players.map((player) => (
            <li key={player.id} className="bg-accent p-2 rounded">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedPlayers.some((p) => p.id === player.id)}
                  onChange={() => togglePlayerSelection(player)}
                  className="mr-2 form-checkbox h-5 w-5 text-primary rounded"
                />
                <span className="truncate">
                  {player.name} ({player.gender})
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>
      <button
        onClick={generateTeams}
        className="w-full sm:w-auto bg-primary text-white p-2 rounded hover:bg-secondary transition-colors mb-6"
      >
        Generate Teams
      </button>
      <div>
        <h2 className="text-xl font-semibold mb-2 text-secondary">Teams</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {teams.map((team, index) => (
            <li key={index} className="bg-accent p-2 rounded">
              <div className="truncate">{team.male.name} (M)</div>
              <div className="truncate">{team.female.name} (F)</div>
            </li>
          ))}
        </ul>
      </div>
      <Link
        href="/"
        className="block mt-6 text-primary hover:text-secondary transition-colors"
      >
        Back to Player Management
      </Link>
    </main>
  );
}
