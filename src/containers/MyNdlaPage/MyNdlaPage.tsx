import { useContext } from 'react';
import { AuthContext } from '../../components/AuthenticationContext';

const MyNdlaPage = () => {
  const { user } = useContext(AuthContext);

  if (!user) return <div>🚨 Ingen bruker funnet 🚨</div>;

  return (
    <div>
      <h1>User-objektet fra feide:</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
};

export default MyNdlaPage;
