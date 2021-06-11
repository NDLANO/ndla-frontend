/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

 import defined from 'defined';
 import config from '../config';
// import { expiresIn} from './jwtHelper';
 //import * as messageActions from '../containers/Messages/messagesActions';
 /*
 const client =
   process.env.NODE_ENV !== 'unittest'
     ? require('../client.tsx')
     : {
         store: {
           dispatch: () => {},
         },
       };*/


const handleConfigTypes = (configVariable : string | boolean | undefined) : string => {
    if(typeof configVariable === "string"){
        return configVariable
     } 
     return ''
 };
 
 
const NDLA_API_URL = handleConfigTypes(config.ndlaApiUrl);
const AUTH0_DOMAIN = "auth.dataporten.no/oauth"//handleConfigTypes(config.feideDomain);
const FEIDE_CLIENT_ID = handleConfigTypes(config.feideClientID);

 
 
 const locationOrigin = (() => {
   if (process.env.NODE_ENV === 'unittest') {
     return 'http://ndla-frontend';
   }
 
   if (process.env.BUILD_TARGET === 'server') {
     return '';
   }
   if (typeof window === 'undefined') {
     return '';
   }
   if (typeof window.location.origin === 'undefined') {
    // Må finne ut hvordan sette origin på typescript måten. window.location.origin har en readonly type.
    // @ts-ignore 
    window.location.origin = [
       window.location.protocol,
       '//',
       window.location.host,
       ':',
       window.location.port,
     ].join('');
   }
 
   return window.location.origin;
 })();
 
 export const auth0Domain = process.env.NODE_ENV === 'unittest' ? 'http://auth-ndla' : AUTH0_DOMAIN;
 export const feideClientId = process.env.NODE_ENV === 'unittest' ? '123456789' :FEIDE_CLIENT_ID;
 
 const apiBaseUrl = process.env.NODE_ENV === 'unittest' ? 'http://ndla-api' : defined(NDLA_API_URL, locationOrigin);
 
 export { locationOrigin, apiBaseUrl };

 
 export function parseHash(hash: string) {
    console.log(hash);
 }
 
 export function setAccessTokenInLocalStorage(accessToken: string, personal: boolean) {
   localStorage.setItem('access_token', accessToken);
   //localStorage.setItem('access_token_expires_at',expiresIn(accessToken) * 1000 + new Date().getTime().toString(),   );
   localStorage.setItem('access_token_personal', personal.toString());
 }
 
 export const clearAccessTokenFromLocalStorage = () => {
   localStorage.removeItem('access_token');
   localStorage.removeItem('access_token_expires_at');
   localStorage.removeItem('access_token_personal');
 };
 
 export const getAccessTokenPersonal = () =>
   localStorage.getItem('access_token_personal') === 'true';
 
 export const getAccessTokenExpiresAt = () =>
   JSON.parse(localStorage.getItem('access_token_expires_at') || "0");
 
 export const getAccessToken = () => localStorage.getItem('access_token');
 
 
 export const isAccessTokenValid = () => new Date().getTime() < getAccessTokenExpiresAt() - 10000; // 10000ms is 10 seconds

 //export const renewPersonalAuth = () => console.log("heya");
 /*
 export const renewAuth = async () => {
   if (localStorage.getItem('access_token_personal') === 'true') {
     return renewPersonalAuth();
   }
 };*/
 /*
 let tokenRenewalTimeout: NodeJS.Timeout ;
 
 const scheduleRenewal = async () => {
   if (localStorage.getItem('access_token_personal') !== 'true') {
     return null;
   }
   const expiresAt = getAccessTokenExpiresAt();
 
   const timeout = expiresAt - Date.now();
 
   if (timeout > 0) {
     tokenRenewalTimeout = setTimeout(async () => {
       await renewAuth();
       scheduleRenewal();
     }, timeout);
   } else {
     await renewAuth();
     scheduleRenewal();
   }
   return;
 };
 
 scheduleRenewal();
 */
 export function loginPersonalAccessToken() {
   fetch('http://localhost:3000/feideRedirection')
   .then(json => json.json())
   .then(data => {
      localStorage.setItem("code_verifier",data.verifier);
      window.location.href = data.url;
    });
 }
 
 export const personalAuthLogout = (federated: boolean, returnToLogin: boolean) => {
   console.log(federated,returnToLogin);
 };
 