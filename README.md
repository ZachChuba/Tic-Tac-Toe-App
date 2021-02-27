# How to run
Clone/download the repository then do the following:

## Requirements
1. `npm install`
2. `pip install -r requirements.txt`

## Setup
1. Run `echo "DANGEROUSLY_DISABLE_HOST_CHECK=true" > .env.development.local` in the project directory

## Run Application
1. Run command in terminal `python app.py`
2. Run command in another terminal `npm run start`
3. Preview web page in browser '/'

# Known Bugs
1. Right now there's a bug where for some web browsers/connections, I can't detect when a particular user disconnects. Although window.eventListener("beforeunload") coupled with useEffect's cleanup function detects when most clients leave, sometimes it does not. If I had more time I would research the unloading detection mechanisms and find a more robust way of detecting who leaves.
2. People are able to join with whatever name they please, which could be used to confuse the interfacing (or in the future the leaderboards). I would set certain character limits to join if I had more time.
###3. CSS alignment. 
I'm too new with CSS to make sure that everything doesn't crash into each other depending on how big the screen is. I've drawn the alignment such that it fits neetly on my 17" laptop screen, but am aware that some elements in the game move with resize, while others don't which causes collisions. If I had more time, I would work on ensuring the items are properly aligned on all screens. An image of how it *should* look is available [here](https://imgur.com/a/nDlt3W6).

# Problems I Experienced and How I Handled Them
1. I initially only stored the playerlist on the client side, which meant that if a new user joined then they would have a different list than intended. I fixed it by making a currentPlayerList on the server side, and by updating the server side login event such that it would send the entire list to any first-time logins, and only the new person that logged in to all pre-existing connections. I made the corresponding changes in App.js as and UserLogin.js as well.
2. I couldn't figure out how to trigger a logout event. Using useEffect's cleanup, even if the user closed the tab the cleanup function which was supposed to have the logout wouldn't trigger. So, I did some googling until I found [this stack overflow post](https://stackoverflow.com/questions/65407028/how-to-detect-browser-tab-close-event-with-react-js), and implemented a window event listener for "beforeunload" which would successfully detect window closes and page refreshes.