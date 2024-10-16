import { Client, Account, Databases } from "appwrite";
import { useEffect, useState } from "react";

const useAppwrite = () => {
  const [client, setClient] = useState<Client | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [databases, setDatabases] = useState<Databases | null>(null);

  useEffect(() => {
    const client = new Client()
      .setEndpoint("https://cloud.appwrite.io/v1") // Replace with your API Endpoint
      .setProject("66eece54000385eea8d3"); // Replace with your Project ID

    const account = new Account(client);
    const databases = new Databases(client);

    setClient(client);
    setAccount(account);
    setDatabases(databases);
  }, []);

  return { client, account, databases };
};

export default useAppwrite;
