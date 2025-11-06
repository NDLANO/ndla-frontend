/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createContext, ReactNode, useContext, useCallback, useMemo } from "react";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { uniq } from "@ndla/util";
import { GQLAlertsQuery, GQLAlertsQueryVariables } from "../graphqlTypes";
import { useLocalStorage } from "../util/useLocalStorage";

interface AlertsContextProps {
  openAlerts: GQLAlertsQuery["alerts"];
  closeAlert: (id: number) => void;
}

const AlertsContext = createContext<AlertsContextProps>({
  openAlerts: [],
  closeAlert: () => {},
});

interface Props {
  children: ReactNode;
}

export const alertsQuery = gql`
  query alerts {
    alerts {
      title
      body
      closable
      number
    }
  }
`;

const AlertsProvider = ({ children }: Props) => {
  const [closedAlerts, setClosedAlerts] = useLocalStorage("closedAlerts", "[]");
  const { data: { alerts } = {} } = useQuery<GQLAlertsQuery, GQLAlertsQueryVariables>(alertsQuery, {
    pollInterval: 10 * 60 * 1000,
    skip: typeof window === "undefined",
  });

  const closedIds = useMemo(() => {
    if (!closedAlerts) return [];
    try {
      const parsed = JSON.parse(closedAlerts);
      if (Array.isArray(parsed) && parsed.every((id) => typeof id === "number")) return parsed;
      return [];
    } catch (e) {
      return [];
    }
  }, [closedAlerts]);

  const openAlerts = useMemo(() => {
    return alerts?.filter((alert) => !closedIds.includes(alert.number)) || [];
  }, [alerts, closedIds]);

  const closeAlert = useCallback(
    (id: number) => {
      setClosedAlerts(JSON.stringify(uniq(closedIds.concat(id))));
    },
    [closedIds, setClosedAlerts],
  );

  return <AlertsContext value={{ openAlerts, closeAlert }}>{children}</AlertsContext>;
};

const useAlerts = () => {
  const context = useContext(AlertsContext);
  if (context === undefined) {
    throw new Error("useAlerts must be used within a AlertsProvider");
  }
  return context;
};

export { useAlerts, AlertsProvider };
