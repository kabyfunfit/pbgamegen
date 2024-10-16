"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { databases } from "@/lib/appwrite-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { usePlayerManagement } from "@/hooks/usePlayerManagement";

interface Match {
  $id: string;
  type: string;
  subType: string;
  courtCount: number;
}

export default function RunGame() {
  const params = useParams();
  const router = useRouter();
  const [match, setMatch] = useState<Match | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const {
    players,
    games,
    generateGames,
    submitScore,
    startNextRound,
    getFinalResults,
    round,
    setPlayers,
    setGames,
    teams,
    setTeams,
    createTeams,
    setCourtCount,
  } = usePlayerManagement();
  const [scores, setScores] = useState<{
    [key: number]: { team1: string; team2: string };
  }>({});
  const [showFinalResults, setShowFinalResults] = useState(false);

  useEffect(() => {
    const fetchMatchAndInitializeGame = async () => {
      try {
        const matchResponse = await databases.getDocument(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
          process.env.NEXT_PUBLIC_APPWRITE_MATCHES_COLLECTION_ID!,
          params.matchId as string
        );
        setMatch(matchResponse as Match);

        // Retrieve players, teams, and games from localStorage
        const storedPlayers = localStorage.getItem("matchPlayers");
        const storedTeams = localStorage.getItem("matchTeams");
        const storedGames = localStorage.getItem("matchGames");
        const storedCourtCount = localStorage.getItem("matchCourtCount");

        if (storedPlayers) {
          setPlayers(JSON.parse(storedPlayers));
        }

        if (storedTeams) {
          setTeams(JSON.parse(storedTeams));
        } else if (matchResponse && storedPlayers) {
          // Create teams if not in localStorage
          const newTeams = createTeams(matchResponse.subType);
          localStorage.setItem("matchTeams", JSON.stringify(newTeams));
        }

        if (storedCourtCount) {
          setCourtCount(parseInt(storedCourtCount));
        } else if (matchResponse) {
          setCourtCount(matchResponse.courtCount);
          localStorage.setItem(
            "matchCourtCount",
            matchResponse.courtCount.toString()
          );
        }

        if (storedGames) {
          setGames(JSON.parse(storedGames));
        } else {
          // Generate games if not in localStorage
          const newGames = generateGames();
          setGames(newGames);
          localStorage.setItem("matchGames", JSON.stringify(newGames));
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching match:", error);
        setMatch(null);
        setIsLoading(false);
      }
    };

    fetchMatchAndInitializeGame();
  }, [
    params.matchId,
    setPlayers,
    setTeams,
    setGames,
    generateGames,
    createTeams,
    setCourtCount,
  ]);

  const handleScoreChange = (
    gameIndex: number,
    team: "team1" | "team2",
    value: string
  ) => {
    setScores((prevScores) => ({
      ...prevScores,
      [gameIndex]: {
        ...prevScores[gameIndex],
        [team]: value,
      },
    }));
  };

  const handleStartNextRound = () => {
    // Submit all scores before starting the next round
    Object.entries(scores).forEach(([gameIndex, gameScores]) => {
      if (gameScores.team1 && gameScores.team2) {
        submitScore(
          parseInt(gameIndex),
          parseInt(gameScores.team1),
          parseInt(gameScores.team2)
        );
      }
    });
    setScores({});
    startNextRound();

    // Generate new games for the next round
    const newGames = generateGames();
    setGames(newGames);
    localStorage.setItem("matchGames", JSON.stringify(newGames));
    localStorage.setItem("matchTeams", JSON.stringify(teams));

    // Console log teams in descending order of timesPlayed
    const sortedTeams = [...teams].sort(
      (a, b) => b.timesPlayed - a.timesPlayed
    );
    console.log("Teams sorted by times played (descending):");
    sortedTeams.forEach((team, index) => {
      console.log(
        `${index + 1}. ${team.players[0].name} & ${
          team.players[1].name
        } - Played ${team.timesPlayed} times`
      );
    });
  };

  const handleEndMatch = () => {
    // Submit any remaining scores before ending the match
    Object.entries(scores).forEach(([gameIndex, gameScores]) => {
      if (gameScores.team1 && gameScores.team2) {
        submitScore(
          parseInt(gameIndex),
          parseInt(gameScores.team1),
          parseInt(gameScores.team2)
        );
      }
    });
    setShowFinalResults(true);
    // Clear localStorage
    localStorage.removeItem("matchPlayers");
    localStorage.removeItem("matchTeams");
    localStorage.removeItem("matchGames");
    localStorage.removeItem("matchCourtCount");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="text-center text-2xl text-red-500 bg-gray-900 h-screen flex items-center justify-center">
        Match not found or error loading match data
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-blue-100 p-4 sm:p-6 md:p-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl sm:text-4xl font-bold mb-6 text-center text-blue-400"
      >
        Run Game: {match.type} - {match.subType}
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-gray-800 mb-6">
          <CardContent className="p-4">
            <p className="text-lg font-bold text-center">Round: {round}</p>
          </CardContent>
        </Card>
      </motion.div>

      {showFinalResults ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-gray-800 p-4 sm:p-6  rounded-lg shadow-lg"
        >
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">
            Final Results
          </h2>
          <div className="space-y-2">
            {getFinalResults().map((player, index) => (
              <div
                key={player.name}
                className="flex justify-between items-center"
              >
                <span>
                  {index + 1}. {player.name}
                </span>
                <span>
                  Wins: {player.wins} | Losses: {player.losses} | Point Diff:{" "}
                  {player.pointsDifferential}
                </span>
              </div>
            ))}
          </div>
          <Button
            onClick={() => router.push("/matches")}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200 text-lg py-3"
          >
            Back to Matches
          </Button>
        </motion.div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg"
          >
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">
              Current Games
            </h2>
            {games.length === 0 ? (
              <p className="text-center text-gray-400">
                No games available. Please start a new round.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {games.map((game, index) => (
                  <Card key={index} className="bg-gray-700">
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold mb-4 text-center">
                        Court {game.court}
                      </h3>
                      <div className="flex flex-col space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="flex flex-col items-start">
                            <span>{game.team1.players[0].name}</span>
                            <span>{game.team1.players[1].name}</span>
                          </div>
                          <div className="flex flex-col items-end">
                            <span>{game.team2.players[0].name}</span>
                            <span>{game.team2.players[1].name}</span>
                          </div>
                        </div>
                        <div className="flex justify-center items-center space-x-2">
                          <Input
                            type="number"
                            value={scores[index]?.team1 || ""}
                            onChange={(e) =>
                              handleScoreChange(index, "team1", e.target.value)
                            }
                            className="w-16 text-black"
                            placeholder="Score"
                          />
                          <span className="text-xl font-bold">VS</span>
                          <Input
                            type="number"
                            value={scores[index]?.team2 || ""}
                            onChange={(e) =>
                              handleScoreChange(index, "team2", e.target.value)
                            }
                            className="w-16 text-black"
                            placeholder="Score"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 flex justify-between"
          >
            <Button
              onClick={handleStartNextRound}
              className="w-[48%] bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200 text-lg py-3"
            >
              Start Next Round
            </Button>
            <Button
              onClick={handleEndMatch}
              className="w-[48%] bg-red-600 hover:bg-red-700 text-white transition-colors duration-200 text-lg py-3"
            >
              End Match
            </Button>
          </motion.div>
        </>
      )}
    </div>
  );
}
