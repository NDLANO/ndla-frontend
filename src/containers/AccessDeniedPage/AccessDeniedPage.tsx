/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { HelmetWithTracker } from "@ndla/tracker";
import { OneColumn, ErrorResourceAccessDenied } from "@ndla/ui";
import { Status } from "../../components";
import { AuthContext } from "../../components/AuthenticationContext";
import { useBaseName } from "../../components/BaseNameContext";
import { constructNewPath, toHref } from "../../util/urlHelper";

const AccessDenied = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const basename = useBaseName();
  const { authenticated } = useContext(AuthContext);
  const statusCode = authenticated ? 403 : 401;

  return (
    <Status code={statusCode}>
      <HelmetWithTracker title={t("htmlTitles.accessDenied")} />
      <OneColumn cssModifier="clear">
        <ErrorResourceAccessDenied
          onAuthenticateClick={() => {
            const route = authenticated ? "logout" : "login";
            window.location.href = constructNewPath(`/${route}?state=${toHref(location)}`, basename);
          }}
        />
      </OneColumn>
    </Status>
  );
};

AccessDenied.propTypes = {};

export default AccessDenied;
