import { createSelector } from 'reselect';

const getAccessTokenFromState = state => state.accessToken;

export const getAccessToken = createSelector(
  [getAccessTokenFromState],
  accessToken => accessToken,
);
