'''
APP.py is the main server code for the web APPlication
It handles the server's socket and database work
'''
import os
import json
from flask import Flask, send_from_directory, json, request
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

APP = Flask(__name__, static_folder='./build/static')

# Point SQLAlchemy to your Heroku database
APP.config['SQLALCHEMY_DATABASE_URI'] = 'postgres://liurqpolnoltzn:a1df803d5e1df259bd9c3ac6112e7a04d60a1c918fc2cbd08917e854cadf6ba8@ec2-54-89-49-242.compute-1.amazonaws.com:5432/d2gm2h5mja5mbq'
# Gets rid of a warning
APP.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
DB = SQLAlchemy(APP)

import models # stop circular imports from models.py
Player = models.define_database_class(DB)
if __name__ == "__main__":
    DB.create_all()

CORS = CORS(APP, resources={r"/*": {"origins": "*"}})

socketio = SocketIO(
    APP,
    cors_allowed_origins="*",
    json=json,
    manage_session=False
)

CURRENT_PLAYER_LIST = []
BOARD = ['', '', '', '', '', '', '', '', '']

@APP.route('/', defaults={"filename": "index.html"})
@APP.route('/<path:filename>')
def index(filename):
    '''
    obligatory lint docstring, no clue what this does
    '''
    return send_from_directory('./build', filename)

# When a client clicks the login button, this function is run
@socketio.on('login')
def on_connect(data):
    '''
    After receiving login event, add the player to playerlist, 
    send playerlist to everyone, add to leaderboard
    '''
    print('Login')
    CURRENT_PLAYER_LIST.append({'uid': data['id'], 'name': data['name']})
    ensure_new_user_on_leaderboard(data['name'])

    socketio.emit('login', data, broadcast=True, include_self=False)
    socketio.emit('login', json.dumps(CURRENT_PLAYER_LIST), room=request.sid)
    socketio.emit('board_state', json.dumps(BOARD), room=request.sid)

# When a client disconnects from this Socket connection, this function is run
@socketio.on('logout')
def on_disconnect(data):
    '''
    On the logout socketio event, remove the user that left from player list
    transmit that new playerlist out
    '''
    global CURRENT_PLAYER_LIST
    print('Logout')
    socketio.emit('logout', data, broadcast=True, include_self=False)
    CURRENT_PLAYER_LIST = list(
        filter(lambda entry: entry['uid'] != data['id'], CURRENT_PLAYER_LIST))

@socketio.on('board_click')
def on_move(data):
    '''
    On board_click event, update the board with the tile,
    send the move out to clients
    '''
    BOARD[int(data['tile'])] = data['move']
    # Broadcast ttt play to all clients
    socketio.emit('board_click', data, broadcast=True, include_self=False)

@socketio.on('get_leaderboard')
def on_get_leaderboard():
    '''
    On get_leaderboard event, fetch the leaderboard and send to
    requesting client
    '''
    entries = get_leaderboard_data()
    socketio.emit('sending_leaderboard', json.dumps(entries), room=request.sid)

@socketio.on('game_over')
def game_over(data):
    '''
    On game_over event update the leaderboard (if necessary),
    send out the game is over to all other clients
    '''
    print('Game over Event: {}'.format(data['state']))
    print(data)
    if data['state'] == 'win':
        add_game_to_leaderboard(data['winner'], data['loser'])
    socketio.emit('game_over', data, broadcast=True, include_self=True)


@socketio.on('restart')
def on_restart():
    '''
    On restart event, set the board to empty, and send the board to everyone,
    emit restart to clients
    '''
    global BOARD
    BOARD = ['', '', '', '', '', '', '', '', '']
    socketio.emit('board_state', json.dumps(BOARD), broadcast=True, include_self=True)
    socketio.emit('restart', broadcast=True, include_self=True)



#DB Helper Functions -- Afraid to put in separate file b/c db relies on name==main
def ensure_new_user_on_leaderboard(username):
    '''
    Input: string username
    Action: adds user to leaderboard if they aren't on it
    '''
    user_if_exists = Player.query.filter_by(username=username).first()
    if user_if_exists is None:
        add_player_to_leaderboard(username, 100)

def add_game_to_leaderboard(winner, loser):
    '''
    Input: String winner, loser
    Action: Update leaderboard with +1 score for winner,
    -1 score for loser
    '''
    # check if person already exists
    winner_entry = Player.query.filter_by(username=winner).first()
    loser_entry = Player.query.filter_by(username=loser).first()
    if winner_entry is None: # does not exist
        add_player_to_leaderboard(winner, 101)
    else:
        update_leaderboard_score(winner, 1)
    if loser_entry is None:
        add_player_to_leaderboard(loser, 99)
    else:
        update_leaderboard_score(loser, -1)

def add_player_to_leaderboard(playername, score):
    '''
    Input: String playername, Int score
    Action: Add playername and score to the leaderboard DB
    '''
    new_player = Player(username=playername, score=score)
    DB.session.add(new_player)
    DB.session.commit()

def update_leaderboard_score(player_name, score_action):
    '''
    Input: String player_name, int score_action
    Change leaderboard score for playername by scoreaction
    '''
    user_profile = Player.query.filter_by(username=player_name).first()
    user_profile.username = user_profile.username
    user_profile.score = user_profile.score + score_action
    DB.session.commit()

def get_leaderboard_data():
    '''
    return a list of leaderboard entries in the format of a dictionary
    {name: username, score: user_score}
    '''
    top_50_users = Player.query.order_by(Player.score.desc()).limit(50).all()
    # format [{name: zach, score: 101}, {name: ra, score: 99}, ...]
    return list(map(lambda user: {'name' : user.username, 'score' : user.score}, top_50_users))
# END DB functions

# Note that we don't call APP.run anymore. We call socketio.run with APP arg
socketio.run(
    APP,
    host=os.getenv('IP', '0.0.0.0'),
    port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
)
