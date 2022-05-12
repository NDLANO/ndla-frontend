import { createContext } from 'react';

export interface RedirectInfo {
  status?: number;
  url?: string;
}
const RedirectContext = createContext<RedirectInfo | undefined>(undefined);
export default RedirectContext;
