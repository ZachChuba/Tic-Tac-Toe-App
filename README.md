# How to run
Clone/download the repository then do the following:

## Requirements
1. `npm install`
2. `pip install -r requirements.txt`

## Setup
1. Run `echo "DANGEROUSLY_DISABLE_HOST_CHECK=true" > .env.development.local` in the project directory
2. Create a postgres database and note the URL. You can do so via heroku following [this guide](https://www.heroku.com/postgres)
3. Create a new file .env in the same directory as app.py; Add the following code: `DATABASE_URL='YOUR_POSTGRES_URL'`

## Run Application
1. Run command in terminal `python app.py`
2. Run command in another terminal `npm run start`
3. Preview web page in browser '/'

# Known Bugs
1. Occasionally, upon winning a game the leaderboard will count the game twice. Although this usually doesn't happen, I can't fully fix it without tampering with the react modules files.
3. Because I'm relying on javascripts `beforeunload` event to update the userlist, it sometimes doesn't work--particularly on heroku.

# Problems I Experienced and How I Handled Them
1. Whenever the game ended, the client would send two gameover events to the server, which in turn would update the database twice (making each win/loss +/-2). I investigated and discovered that because my gameover event was transmitted inside a setState function, React strict mode would run that function twice. I could not disable react strict mode, so I instead patched it by keeping track of the current time when I update my database. If the times are too close, then the database will not update the second time.
2. Sometimes when I ran my app.py file, the "import models" would cause circular imports between models.py and app.py and brick the program. I fixed this via a method discussed in slack, which is defining the models class inside a function and then calling the function to create the database.
