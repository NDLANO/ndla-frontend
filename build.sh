#!/bin/bash
set -e

VERSION="$1"
source ./build.properties
PROJECT="$NDLAOrganization/$NDLAComponentName"

if [ -z $VERSION ]
then
    VERSION="SNAPSHOT"
fi

BUILD_CMD=${DOCKER_BUILD_CMD:-docker build}
BUILD_ARGS=${DOCKER_BUILD_ARGS:-}
BUILD_TAG_ARGS=${DOCKER_BUILD_TAG_ARGS:---tag $PROJECT:$VERSION}

$BUILD_CMD \
  $BUILD_ARGS \
  --build-arg COMPONENT_VERSION=$VERSION \
  --secret id=sentry_token,env=SENTRY_AUTH_TOKEN \
  $BUILD_TAG_ARGS \
  .
echo "BUILT $PROJECT:$VERSION"
