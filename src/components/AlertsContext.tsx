import { useQuery } from '@apollo/client';
import { createContext, ReactNode, useContext } from 'react';
import { GQLAlertsQuery, GQLAlertsQueryVariables } from '../graphqlTypes';
import { alertsQuery } from '../queries';

const AlertsContext = createContext<GQLAlertsQuery['alerts']>([]);

interface Props {
  children: ReactNode;
}

const AlertsProvider = ({ children }: Props) => {
  const { data } = useQuery<GQLAlertsQuery, GQLAlertsQueryVariables>(
    alertsQuery,
    { pollInterval: 5 * 60 * 1000 },
  );

  return (
    <AlertsContext.Provider value={data?.alerts || []}>
      {children}
    </AlertsContext.Provider>
  );
};

const useAlerts = () => {
  const context = useContext(AlertsContext);
  if (context === undefined) {
    throw new Error('useAlerts must be used within a AlertsProvider');
  }
  return context;
};

export { useAlerts, AlertsProvider };
