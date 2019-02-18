#!/usr/bin/env bash
curl --user ${CIRCLE_TOKEN}: \
    --request POST \
    --form revision=d486b1ef223cabab3cd16d48772c7b4b3e25e5ee\
    --form config=@config.yml \
    --form notify=false \
        https://circleci.com/api/v1.1/project/github/Linkvalue-Interne/LvConnect/tree/master
