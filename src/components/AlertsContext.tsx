import { useQuery } from '@apollo/client';
import partition from 'lodash/partition';
import uniq from 'lodash/uniq';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import {
  GQLAlertsQuery,
  GQLAlertsQueryVariables,
  GQLUptimeAlert,
} from '../graphqlTypes';
import { alertsQuery } from '../queries';

interface AlertsContextProps {
  openAlerts: GQLAlertsQuery['alerts'];
  closeAlert: (id: number) => void;
}

const AlertsContext = createContext<AlertsContextProps>({
  openAlerts: [],
  closeAlert: () => {},
});

interface Props {
  children: ReactNode;
}

const getClosedAlerts = (): number[] => {
  try {
    const stored = localStorage.getItem('closedAlerts');
    if (stored) {
      const ids = JSON.parse(stored);
      if (Array.isArray(ids)) {
        return ids;
      }
    }
    return [];
  } catch {
    console.error('Could not read closedAlerts from localStorage.');
    return [];
  }
};

const setClosedAlert = (id: number) => {
  try {
    const stored = getClosedAlerts();
    const updated = uniq([...stored, id]);
    localStorage.setItem('closedAlerts', JSON.stringify(updated));
  } catch {
    console.error('Could not save closedAlerts to localStorage.');
  }
};

const setClosedAlerts = (alerts: GQLUptimeAlert[]) => {
  try {
    const ids = alerts.map((alert) => alert.number);
    localStorage.setItem('closedAlerts', JSON.stringify(ids));
  } catch {
    console.error('Could not save closedAlerts to localStorage.');
  }
};

const AlertsProvider = ({ children }: Props) => {
  const [openAlerts, setOpenAlerts] = useState<GQLUptimeAlert[]>([]);
  const { data: { alerts } = {} } = useQuery<
    GQLAlertsQuery,
    GQLAlertsQueryVariables
  >(alertsQuery, { pollInterval: 10 * 60 * 1000 });

  const closeAlert = useCallback((id: number) => {
    setClosedAlert(id);
    setOpenAlerts((prev) => prev.filter((alert) => alert.number !== id));
  }, []);

  useEffect(() => {
    if (alerts) {
      const closedIds = getClosedAlerts();
      if (closedIds.length > 0) {
        const [closedAlerts, openAlerts] = partition(
          alerts,
          (alert) => closedIds.includes(alert.number) && alert.closable,
        );
        setOpenAlerts(openAlerts);
        setClosedAlerts(closedAlerts);
        return;
      }

      setOpenAlerts(alerts);
    }
  }, [alerts]);

  return (
    <AlertsContext.Provider value={{ openAlerts, closeAlert }}>
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
