"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { databases } from "@/lib/appwrite-client";
import { ID } from "appwrite";

export default function CreateMatch() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    scheduledDateTime: new Date().toISOString(),
    location: "Default Location",
    courtCount: "",
    type: "",
    subType: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Form data:", formData);
      console.log("Environment variables:", {
        endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
        projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
        databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        collectionId: process.env.NEXT_PUBLIC_APPWRITE_MATCHES_COLLECTION_ID,
      });

      const matchData = {
        scheduledDateTime: formData.scheduledDateTime,
        location: formData.location,
        courtCount: parseInt(formData.courtCount, 10),
        type: formData.type,
        subType: formData.subType,
        createdBy: "670be09e002ac3f047b4",
        status: "scheduled",
      };

      console.log("Match data to be sent:", matchData);

      const result = await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_MATCHES_COLLECTION_ID!,
        ID.unique(),
        matchData
      );

      console.log("Match created:", result);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error creating match:", error);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
      // Here you would typically show an error message to the user
    }
  };

  const isStepComplete = () => {
    switch (step) {
      case 1:
        return true; // Always true as we're using current date/time
      case 2:
        return true; // Always true as we're using a default location
      case 3:
        return formData.courtCount !== "";
      case 4:
        return formData.type !== "";
      case 5:
        return formData.subType !== "";
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-blue-100 p-4 flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg"
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-400">
          Create Match
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <Label
                  htmlFor="scheduledDateTime"
                  className="text-lg font-semibold mb-2 block"
                >
                  Scheduled Date and Time
                </Label>
                <Input
                  type="text"
                  id="scheduledDateTime"
                  name="scheduledDateTime"
                  value={new Date(formData.scheduledDateTime).toLocaleString()}
                  readOnly
                  className="w-full bg-gray-700 text-blue-100 border-blue-500 focus:border-blue-400"
                />
              </motion.div>
            )}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <Label
                  htmlFor="location"
                  className="text-lg font-semibold mb-2 block"
                >
                  Location
                </Label>
                <Input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  readOnly
                  className="w-full bg-gray-700 text-blue-100 border-blue-500 focus:border-blue-400"
                />
              </motion.div>
            )}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <Label
                  htmlFor="courtCount"
                  className="text-lg font-semibold mb-2 block"
                >
                  Number of Courts
                </Label>
                <Input
                  type="number"
                  id="courtCount"
                  name="courtCount"
                  value={formData.courtCount}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full bg-gray-700 text-blue-100 border-blue-500 focus:border-blue-400"
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
              </motion.div>
            )}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <Label className="text-lg font-semibold mb-2 block">
                  Match Type
                </Label>
                <RadioGroup
                  value={formData.type}
                  onValueChange={(value) => handleRadioChange("type", value)}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="RoundRobin"
                      id="RoundRobin"
                      className="border-blue-500"
                    />
                    <Label htmlFor="RoundRobin">Round Robin</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="SetPartners"
                      id="SetPartners"
                      className="border-blue-500"
                    />
                    <Label htmlFor="SetPartners">Set Partners</Label>
                  </div>
                </RadioGroup>
              </motion.div>
            )}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <Label className="text-lg font-semibold mb-2 block">
                  Sub Type
                </Label>
                <RadioGroup
                  value={formData.subType}
                  onValueChange={(value) => handleRadioChange("subType", value)}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="MixedGender"
                      id="MixedGender"
                      className="border-blue-500"
                    />
                    <Label htmlFor="MixedGender">Mixed Gender</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="SameGender"
                      id="SameGender"
                      className="border-blue-500"
                    />
                    <Label htmlFor="SameGender">Same Gender</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="Random"
                      id="Random"
                      className="border-blue-500"
                    />
                    <Label htmlFor="Random">Random</Label>
                  </div>
                  {formData.type === "SetPartners" && (
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="Select"
                        id="Select"
                        className="border-blue-500"
                      />
                      <Label htmlFor="Select">Select</Label>
                    </div>
                  )}
                </RadioGroup>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex justify-between mt-6">
            <Button
              type="button"
              onClick={handleBack}
              disabled={step === 1}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors duration-200"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            {step < 5 ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={!isStepComplete()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors duration-200"
              >
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={!isStepComplete()}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors duration-200"
              >
                Create Match
              </Button>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
}
