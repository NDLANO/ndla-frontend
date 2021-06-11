/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

 import React,{ useEffect } from 'react';
 //import { parseHash } from '../../util/authHelpers';
 import { withRouter, RouteComponentProps } from 'react-router-dom';
import { setAccessTokenInLocalStorage } from '../../util/authHelpers';

 interface Props extends RouteComponentProps{

 }

 export const LoginSuccess =  ({location}: Props )=> {

    useEffect(() => {
        const searchParams = location.search.substring(1).split('&');
        let code: string = '';
        searchParams.forEach(param => {
            const key = param.split('=')[0];
            if(key === 'code') {
                code = param.split('=')[1] || '';
            }
        });

        //Can go direct to assuming one only sends code, but in events people trying other values.

        const verifier = localStorage.getItem('code_verifier');
        
        fetch(`http://localhost:3000/test?code=${code}&verifier=${verifier}`)
        .then(json => json.text())
        .then(token => setAccessTokenInLocalStorage(token,true))
        .then()
        .catch(e => console.log(e));
        
    }, [])

    return <div/>;
     
 };


 export default withRouter(LoginSuccess);
 