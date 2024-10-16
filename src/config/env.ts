const env = {
  NEXT_PUBLIC_APPWRITE_ENDPOINT:
    process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1",
  NEXT_PUBLIC_APPWRITE_PROJECT_ID:
    process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "",
  NEXT_PUBLIC_APPWRITE_DATABASE_ID:
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "",
  NEXT_PUBLIC_APPWRITE_PLAYERS_COLLECTION_ID:
    process.env.NEXT_PUBLIC_APPWRITE_PLAYERS_COLLECTION_ID || "",
  APP_URL:
    process.env.NEXT_PUBLIC_APP_URL ||
    (typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000"),
};

export default env;
