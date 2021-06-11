/**
 * Copyright (C) 2021 -present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

 import React from 'react';
 import PropTypes from 'prop-types';
 import { Link } from 'react-router-dom';
 import { injectT, tType } from '@ndla/i18n';



 export const LoginFailure = ({ t } : tType) => {
    
    const userNotRegistered = false;

    return(<div>
     <h2>{t('loginFailure.errorMessage')}</h2>
     {userNotRegistered && <p>{t('loginFailure.userNotRegistered')}</p>}
     <p>
       <Link to="/login">{t('loginFailure.loginLink')}</Link>
     </p>
   </div>)
 };
 
 LoginFailure.propTypes = {
   userNotRegistered: PropTypes.bool,
 };
/*
 const mapStateToProps = state => ({
   userNotRegistered: state.session.userNotRegistered,
 }); 
 */
 export default injectT(LoginFailure);
 