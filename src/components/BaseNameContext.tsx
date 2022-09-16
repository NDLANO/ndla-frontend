import { createContext, ReactNode, useContext } from 'react';

const BaseNameContext = createContext<string>('');

interface Props {
  children: ReactNode;
  value?: string;
}

const BaseNameProvider = ({ children, value = '' }: Props) => {
  return (
    <BaseNameContext.Provider value={value}>
      {children}
    </BaseNameContext.Provider>
  );
};

const useBaseName = () => {
  const context = useContext(BaseNameContext);
  if (context === undefined) {
    throw new Error('useBaseName must be used within a BaseNameProvider');
  }
  return context;
};

export { useBaseName, BaseNameProvider };
