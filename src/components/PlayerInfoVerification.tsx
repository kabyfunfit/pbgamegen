"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { databases, account } from "@/lib/appwrite-client";
import { ID, Query } from "appwrite";
import env from "@/config/env";
import { useToast } from "@/components/ui/use-toast";

interface PlayerInfoVerificationProps {
  onComplete: (dataExists: boolean) => void;
}

export default function PlayerInfoVerification({
  onComplete,
}: PlayerInfoVerificationProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [pinNum, setPinNum] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserAndPlayerData = async () => {
      try {
        const user = await account.get();
        setUserId(user.$id);

        if (
          !env.NEXT_PUBLIC_APPWRITE_DATABASE_ID ||
          !env.NEXT_PUBLIC_APPWRITE_PLAYERS_COLLECTION_ID
        ) {
          throw new Error("Database or Players Collection ID is not set");
        }

        const existingDocs = await databases.listDocuments(
          env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
          env.NEXT_PUBLIC_APPWRITE_PLAYERS_COLLECTION_ID,
          [Query.equal("authId", user.$id)]
        );

        if (existingDocs.documents.length > 0) {
          const playerData = existingDocs.documents[0];
          if (playerData.pinNum && playerData.gender) {
            onComplete(true);
            return;
          }
        }
        onComplete(false);
      } catch (error) {
        console.error("Error fetching user or player data:", error);
        toast({
          title: "Error",
          description:
            "Unable to fetch user information. Please try logging in again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAndPlayerData();
  }, [toast, onComplete]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      toast({
        title: "Error",
        description: "User ID not found. Please try logging in again.",
        variant: "destructive",
      });
      return;
    }
    if (!gender) {
      toast({
        title: "Error",
        description: "Please select a gender.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);

    try {
      if (
        !env.NEXT_PUBLIC_APPWRITE_DATABASE_ID ||
        !env.NEXT_PUBLIC_APPWRITE_PLAYERS_COLLECTION_ID
      ) {
        throw new Error("Database or Players Collection ID is not set");
      }

      const playerData = {
        authId: userId,
        pinNum,
        gender,
      };

      await databases.createDocument(
        env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        env.NEXT_PUBLIC_APPWRITE_PLAYERS_COLLECTION_ID,
        ID.unique(),
        playerData
      );

      toast({
        title: "Profile Updated",
        description: "Your information has been saved successfully.",
        variant: "default",
      });
      onComplete(true);
    } catch (error) {
      console.error("Error updating player info:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "There was an error saving your information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return null;
  }

  if (!userId) {
    return null;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-gray-800 p-6 rounded-lg shadow-lg max-w-md mx-auto w-full"
    >
      <h2 className="text-2xl font-bold mb-4 text-white text-center">
        Drop Shot Your Details
      </h2>
      <div className="space-y-2">
        <Label htmlFor="pinNum" className="text-gray-300">
          PIN Number (4-8 digits)
        </Label>
        <Input
          id="pinNum"
          type="text"
          value={pinNum}
          onChange={(e) => setPinNum(e.target.value)}
          pattern="\d{4,8}"
          required
          className="bg-gray-700 text-white w-full"
          placeholder="Enter 4-8 digit PIN"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-gray-300">Gender</Label>
        <RadioGroup
          onValueChange={(value) => setGender(value as "male" | "female")}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="male"
              id="male"
              className="border-gray-400 text-blue-400 focus:border-blue-400 focus:ring-blue-400"
            />
            <Label htmlFor="male" className="text-white">
              Male
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="female"
              id="female"
              className="border-gray-400 text-blue-400 focus:border-blue-400 focus:ring-blue-400"
            />
            <Label htmlFor="female" className="text-white">
              Female
            </Label>
          </div>
        </RadioGroup>
      </div>
      <Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Volley Your Vitals"}
      </Button>
    </form>
  );
}
