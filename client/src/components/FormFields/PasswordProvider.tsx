import React, { useState } from 'react';

const passwordContext = React.createContext<
  | {
      password: string;
      setPassword: React.Dispatch<React.SetStateAction<string>>;
    }
  | undefined
>(undefined);

export const PasswordProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [password, setPassword] = useState('');

  return (
    <passwordContext.Provider value={{ password, setPassword }}>
      {children}
    </passwordContext.Provider>
  );
};

export const usePassword = () => {
  const context = React.useContext(passwordContext);

  if (context === undefined) {
    throw new Error(
      'usePassword hook can only be used inside PasswordProvider component'
    );
  }

  return context;
};
