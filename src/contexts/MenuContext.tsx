"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type MenuContextType = {
  isMenuVisible: boolean;
  setMenuVisible: (visible: boolean) => void;
};

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: ReactNode }) {
  const [isMenuVisible, setMenuVisible] = useState(true);

  return (
    <MenuContext.Provider value={{ isMenuVisible, setMenuVisible }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error("useMenu must be used within a MenuProvider");
  }
  return context;
}
