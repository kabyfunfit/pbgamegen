"use client";

import { useState, useEffect } from "react";
import PlayerInfoVerification from "@/components/PlayerInfoVerification";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [needsInfoVerification, setNeedsInfoVerification] = useState(false);

  useEffect(() => {
    const checkInfoVerificationNeeded = async () => {
      const infoNeeded = await checkPlayerInfoComplete();
      setNeedsInfoVerification(infoNeeded);
    };

    checkInfoVerificationNeeded();
  }, []);

  const handleInfoVerificationComplete = (dataExists: boolean) => {
    setNeedsInfoVerification(!dataExists);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto space-y-8"
    >
      {needsInfoVerification && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-card text-card-foreground shadow-lg rounded-lg p-6 border border-border hover:shadow-primary/20 transition-shadow duration-300"
        >
          <PlayerInfoVerification onComplete={handleInfoVerificationComplete} />
        </motion.div>
      )}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="bg-card text-card-foreground shadow-lg rounded-lg p-6 border border-border hover:shadow-primary/20 transition-shadow duration-300"
      >
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-primary">
          Dashboard Content
        </h2>
        <p className="text-foreground">
          Welcome to your dashboard. Here you can view your game statistics,
          upcoming matches, and more.
        </p>
        {/* Add more dashboard content here */}
      </motion.div>
    </motion.div>
  );
}

// Placeholder function - replace with actual implementation
async function checkPlayerInfoComplete() {
  // Implement the check here
  return false;
}
