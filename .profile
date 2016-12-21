export HEROKU_APP_VERSION=${curl -H "Accept: application/vnd.heroku+json; version=3" -H "Authorization: Bearer $HEROKU_API_TOKEN" -n https://api.heroku.com/apps/$HEROKU_APP_NAME/release}
