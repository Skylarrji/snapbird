import React, { createContext, useContext, useState } from 'react';

type Bird = {
  image: string;
  species: string;
};

interface BirdContextProps {
  birds: Bird[];
  setBirds: React.Dispatch<React.SetStateAction<Bird[]>>;
}

const BirdContext = createContext<BirdContextProps | undefined>(undefined);

export const BirdProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [birds, setBirds] = useState<Bird[]>([]);

  return (
    <BirdContext.Provider value={{ birds, setBirds }}>
      {children}
    </BirdContext.Provider>
  );
};

export const useBirds = () => {
  const context = useContext(BirdContext);
  if (context === undefined) {
    throw new Error('useBirds must be used within a BirdProvider');
  }
  return context;
};
