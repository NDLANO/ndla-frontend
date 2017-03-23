import fetch from 'isomorphic-fetch';
import { resolveJsonOrRejectWithError } from '../../util/apiHelpers';

export const fetchAccessToken = () => fetch('/get_token').then(resolveJsonOrRejectWithError);
