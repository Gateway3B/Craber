# Craber Discord Bot
Gets crabs from [www.crabdatabase.info](www.crabdatabase.info)

## Setup Atlas
1. Create new cluster.
2. Click connect button. Add ip 0.0.0.0/0. Create user.
3. Create new database called CRABER.
4. Go to `config.json` and add config vars `ATLASPASS` and `ATLASUSER`.

## Setup Bot
1. Go to [DiscordApps](discord.com/developers/applications)
2. Create new application.
3. Open application, copy client ID, click bot, copy token.
4. Go to `config.json` and add config var `TOKEN`.
5. Go to `https://discord.com/api/oauth2/authorize?client_id={botID}&permissions=2147518464&scope=applications.commands%20bot` with your client ID and add bot to your server.
