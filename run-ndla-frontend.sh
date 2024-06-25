#!/bin/sh

APPLICATION_NAME="ndla-frontend"

function setup_environment {
    echo "Setting up environment..."
    secretsfile="/tmp/secrets"
    aws s3 --region eu-central-1 cp s3://$NDLA_ENVIRONMENT.secrets.ndla/$APPLICATION_NAME.secrets $secretsfile

    for v in $(cat $secretsfile | jq -r 'to_entries | .[] | .key + "=" + .value'); do
        eval "export $v";
    done

    rm $secretsfile

    if [ $? -ne 0 ]; then
        echo "Failed to set up environment!" >&2;
        exit 1;
    fi
}

if [ "$NDLA_ENVIRONMENT" != "local" ] && [ -z "$NDLA_IS_KUBERNETES" ]; then
    setup_environment
fi

eval $@
