"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { account } from "@/lib/appwrite-client";
import { motion, AnimatePresence } from "framer-motion";
import { ID } from "appwrite";

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await account.get();
        if (session) {
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("No active session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        await account.createEmailPasswordSession(email, password);
        toast({
          title: "Login Successful",
          description: "Welcome back to PB Game Gen!",
          variant: "default",
        });
        router.push("/dashboard");
      } else {
        await account.create(ID.unique(), email, password, name);
        await account.createEmailPasswordSession(email, password);
        await account.createVerification(
          `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
        );
        toast({
          title: "Signup Successful",
          description:
            "Welcome to PB Game Gen! Please check your email to verify your account.",
          variant: "default",
        });
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Authentication failed:", error);
      toast({
        title: isLogin ? "Login Failed" : "Signup Failed",
        description:
          error instanceof Error
            ? error.message
            : "Please check your information and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-2xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-2 text-blue-400">PB Game Gen</h1>
      <h2 className="text-xl mb-8 text-center text-gray-300">
        Serve, Rally, Score:
        <br />
        Now With Less Math, More Trash Talk.
      </h2>
      <AnimatePresence mode="wait">
        <motion.div
          key={isLogin ? "login" : "signup"}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-md"
        >
          <form
            onSubmit={handleSubmit}
            className="bg-gray-800 shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4"
          >
            <h2 className="text-2xl font-bold mb-6 text-center text-blue-400">
              {isLogin ? "Login" : "Sign Up"}
            </h2>
            {!isLogin && (
              <div className="mb-4">
                <label
                  className="block text-gray-300 text-sm font-bold mb-2"
                  htmlFor="name"
                >
                  Name
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-gray-700 text-white"
                />
              </div>
            )}
            <div className="mb-4">
              <label
                className="block text-gray-300 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-700 text-white"
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-300 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-gray-700 text-white"
              />
            </div>
            <div className="flex items-center justify-between">
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
              </Button>
            </div>
          </form>
          <p className="text-center text-gray-300">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-400 hover:text-blue-300 font-bold"
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
