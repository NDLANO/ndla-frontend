#!/bin/bash
set -e

VERSION="$1"
source ./build.properties
PROJECT="$NDLAOrganization/$NDLAComponentName"

if [ -z $VERSION ]
then
    VERSION="SNAPSHOT"
fi


docker build \
  --build-arg COMPONENT_VERSION=$VERSION \
  --secret id=sentry_token,env=SENTRY_AUTH_TOKEN \
  --tag $PROJECT:$VERSION \
  .
echo "BUILT $PROJECT:$VERSION"
