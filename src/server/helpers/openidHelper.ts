

import config from '../../config';
import {Issuer, generators} from 'openid-client';
import {Request} from 'express';

const handleConfigTypes = (configVariable : string | boolean | undefined) : string => {
    if(typeof configVariable === "string"){
        return configVariable
     } 
     return ''
 };
 
 
//const NDLA_API_URL = handleConfigTypes(config.ndlaApiUrl);
const OPENID_DOMAIN = "https://auth.dataporten.no/.well-known/openid-configuration";
const FEIDE_CLIENT_ID = handleConfigTypes(config.feideClientID);
const FEIDE_CLIENT_SECRET = handleConfigTypes(config.feideClientSecret);
const REDIRECT_URI = "https://ndla-frontend.test.api.ndla.no/login/success";


const getIssuer = async () => await Issuer.discover(OPENID_DOMAIN);

const getClient = () => getIssuer().then(issuer => new issuer.Client({
            client_id: FEIDE_CLIENT_ID,
            client_secret: FEIDE_CLIENT_SECRET,
            redirect_uris: [REDIRECT_URI],
            response_types: ['code'],
        })
    );


export const getRedirectUrl = () => {

    const code_verifier = generators.codeVerifier();   
    const code_challenge = generators.codeChallenge(code_verifier);

    return getClient().then(client => client.authorizationUrl({
            scope: 'openid email profile',
            resource: "https://auth.dataporten.no/oauth/authorization",
            code_challenge,
            code_challenge_method: 'S256',
            })).then(feide_url => {
                return {"url":feide_url,"verifier":code_verifier}
            });
};

export const getFeideToken = (req: Request) => {
    return getClient().then(client => {
        const params = client.callbackParams(req);
        const verifier = req.query.verifier?.toString()
        return client.callback(REDIRECT_URI, params, { 
                code_verifier:verifier,
         }) // => Promise
        .then(function (tokenSet) {
            console.log('received and validated tokens %j', tokenSet);
            console.log('validated ID Token claims %j', tokenSet.claims());
            return tokenSet.access_token;
        }).catch(e => console.log(e));
    });
}