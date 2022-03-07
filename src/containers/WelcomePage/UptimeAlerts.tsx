import { MessageBox, MessageBoxType } from '@ndla/ui';
import React from 'react';
import { GQLAlertsQuery } from '../../graphqlTypes';
import { alertsQuery } from '../../queries';
import { useGraphQuery } from '../../util/runQueries';

const UptimeAlerts = () => {
  const { data } = useGraphQuery<GQLAlertsQuery>(alertsQuery);

  return (
    <>
      {data?.alerts?.map((alert, i) => (
        <MessageBox
          key={`uptimeAlert-${i}`}
          type={MessageBoxType.fullpage}
          children={alert.body ?? alert.title}
          sticky
          showCloseButton
        />
      ))}
    </>
  );
};

export default UptimeAlerts;
