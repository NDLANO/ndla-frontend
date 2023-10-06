import React, { useContext } from 'react';
import { AuthContext } from '../../../components/AuthenticationContext';

const MyContactArea = () => {
  const { user } = useContext(AuthContext);

  return <div>MyContactArea</div>;
};
export default MyContactArea;
