# Flask and create-react-app

## Requirements
1. `npm install`
2. `pip install -r requirements.txt`

## Setup
1. Run `echo "DANGEROUSLY_DISABLE_HOST_CHECK=true" > .env.development.local` in the project directory

## Run Application
1. Run command in terminal `python app.py`
2. Run command in another terminal `npm run start`
3. Preview web page in browser '/'

## Deploy to Heroku
*Don't do the Heroku step for assignments, you only need to deploy for Project 2*
1. Create a Heroku app: `heroku create --buildpack heroku/python`
2. Add nodejs buildpack: `heroku buildpacks:add --index 1 heroku/nodejs`
3. Push to Heroku: `git push heroku main`

# Problems I Experienced and How I Handled Them
1. I initially only stored the playerlist on the client side, which meant that if a new user joined then they would have a different list than intended. I fixed it by making a currentPlayerList on the server side, and by updating the server side login event such that it would send the entire list to any first-time logins, and only the new person that logged in to all pre-existing connections. I made the corresponding changes in App.js as and UserLogin.js as well.
2. I couldn't figure out how to trigger a logout event. Using useEffect's cleanup, even if the user closed the tab the cleanup function which was supposed to have the logout wouldn't trigger. So, I did some googling until I found [this stack overflow post](https://stackoverflow.com/questions/65407028/how-to-detect-browser-tab-close-event-with-react-js), and implemented a window event listener for "beforeunload" which would successfully detect window closes and page refreshes.

# Known Bugs
1. Still in development, nothing works as intended