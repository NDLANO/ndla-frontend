import config from '../config';

const ltiConfig = (): string => {
  const launchUrl =
    config?.ndlaEnvironment === 'dev'
      ? 'http://localhost:3000'
      : config?.ndlaFrontendDomain;

  const domainXML =
    config?.ndlaEnvironment === 'dev'
      ? `<lticm:property name="domain">localhost</lticm:property>`
      : '';
  return `<?xml version="1.0" encoding="UTF-8"?>
    <cartridge_basiclti_link xmlns="http://www.imsglobal.org/xsd/imslticc_v1p0" xmlns:blti="http://www.imsglobal.org/xsd/imsbasiclti_v1p0" xmlns:lticm="http://www.imsglobal.org/xsd/imslticm_v1p0" xmlns:lticp="http://www.imsglobal.org/xsd/imslticp_v1p0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.imsglobal.org/xsd/imslticc_v1p0 http://www.imsglobal.org/xsd/lti/ltiv1p0/imslticc_v1p0.xsd http://www.imsglobal.org/xsd/imsbasiclti_v1p0 http://www.imsglobal.org/xsd/lti/ltiv1p0/imsbasiclti_v1p0p1.xsd http://www.imsglobal.org/xsd/imslticm_v1p0 http://www.imsglobal.org/xsd/lti/ltiv1p0/imslticm_v1p0.xsd http://www.imsglobal.org/xsd/imslticp_v1p0 http://www.imsglobal.org/xsd/lti/ltiv1p0/imslticp_v1p0.xsd">
    <blti:title>NDLA</blti:title>
    <blti:description>Search for and embed NDLA content</blti:description>
    <blti:launch_url>${launchUrl}/lti</blti:launch_url>
    <blti:icon>${config?.ndlaFrontendDomain}/static/favicon-${
      config?.ndlaEnvironment === 'dev' ? 'prod' : config?.ndlaEnvironment
    }-32x32.png</blti:icon>
    <blti:extensions platform="canvas.instructure.com">
        ${domainXML}
        <lticm:options name="editor_button">
            <lticm:property name="enabled">true</lticm:property>
        </lticm:options>
        <lticm:property name="icon_url">${config?.ndlaFrontendDomain}/static/favicon-${
          config?.ndlaEnvironment === 'dev' ? 'prod' : config?.ndlaEnvironment
        }-32x32.png</lticm:property>
        <lticm:property name="privacy_level">public</lticm:property>
        <lticm:options name="resource_selection">
            <lticm:property name="enabled">true</lticm:property>
        </lticm:options>
        <lticm:property name="tool_id">ndla</lticm:property>
        <lticm:property name="selection_height">800</lticm:property>
        <lticm:property name="selection_width">1200</lticm:property>
    </blti:extensions>
</cartridge_basiclti_link>`;
};

export default ltiConfig;
