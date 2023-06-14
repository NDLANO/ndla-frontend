import { ReactNode } from 'react';

declare module 'react-helmet-async' {
  export interface HelmetDatum {
    toString(): string;
    toComponent(): ReactNode;
  }
}
