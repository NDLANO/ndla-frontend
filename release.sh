#!/bin/bash

source ./build.properties

PROJECT="$NDLAOrganization/$NDLAComponentName"
VER=v0.1
GIT_HASH=`git log --pretty=format:%h -n 1`

VERSION=${VER}_${GIT_HASH}
./build.sh $VERSION
docker tag -f $PROJECT:$VERSION $PROJECT:latest
docker push $PROJECT:$VERSION
docker push $PROJECT:latest

echo "RELEASED $PROJECT:$VERSION"
