import { createContext, ReactNode, useContext } from 'react';

export const defaultValue = 'default';
const VersionHashContext = createContext<string>(defaultValue);

interface Props {
  children: ReactNode;
  value?: string;
}

export const VersionHashProvider = ({
  children,
  value = defaultValue,
}: Props) => {
  return (
    <VersionHashContext.Provider value={value}>
      {children}
    </VersionHashContext.Provider>
  );
};

export const useVersionHash = () => {
  const context = useContext(VersionHashContext);
  if (context === undefined) {
    return defaultValue;
  }
  return context;
};
