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
  --tag $PROJECT:$VERSION \
  .
echo "BUILT $PROJECT:$VERSION"
