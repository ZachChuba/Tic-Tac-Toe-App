'''
APP.py is the main server code for the web APPlication
It handles the server's socket and database work
'''
import os
import json
import time
from dotenv import load_dotenv, find_dotenv
from flask import Flask, send_from_directory, json, request
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

APP = Flask(__name__, static_folder='./build/static')
load_dotenv(find_dotenv())

# Point SQLAlchemy to your Heroku database
APP.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
# Gets rid of a warning
APP.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
DB = SQLAlchemy(APP)

import models  # stop circular imports from models.py
Player = models.define_database_class(DB)
if __name__ == "__main__":
    DB.create_all()

CORS = CORS(APP, resources={r"/*": {"origins": "*"}})

SOCKETIO = SocketIO(APP,
                    cors_allowed_origins="*",
                    json=json,
                    manage_session=False)

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
@SOCKETIO.on('login')
def on_connect(data):
    '''
    After receiving login event, add the player to playerlist,
    send playerlist to everyone, add to leaderboard
    '''
    print('Login')
    CURRENT_PLAYER_LIST.append({'uid': data['id'], 'name': data['name']})
    ensure_new_user_on_leaderboard(data['name'])

    SOCKETIO.emit('login', data, broadcast=True, include_self=False)
    SOCKETIO.emit('login', json.dumps(CURRENT_PLAYER_LIST), room=request.sid)
    SOCKETIO.emit('board_state', json.dumps(BOARD), room=request.sid)


# When a client disconnects from this Socket connection, this function is run
@SOCKETIO.on('logout')
def on_disconnect(data):
    '''
    On the logout socketio event, remove the user that left from player list
    transmit that new playerlist out
    '''
    global CURRENT_PLAYER_LIST
    print('Logout ' + str(data))
    SOCKETIO.emit('logout', data, broadcast=True, include_self=False)
    CURRENT_PLAYER_LIST = list(
        filter(lambda entry: entry['uid'] != data['id'], CURRENT_PLAYER_LIST))


@SOCKETIO.on('board_click')
def on_move(data):
    '''
    On board_click event, update the board with the tile,
    send the move out to clients
    '''
    update_board(data)
    # Broadcast ttt play to all clients
    SOCKETIO.emit('board_click', data, broadcast=True, include_self=False)


@SOCKETIO.on('get_leaderboard')
def on_get_leaderboard():
    '''
    On get_leaderboard event, fetch the leaderboard and send to
    requesting client
    '''
    entries = get_leaderboard_data()
    SOCKETIO.emit('sending_leaderboard',
                  json.dumps(entries),
                  room=get_request_sid())


@SOCKETIO.on('get_player_from_leaderboard')
def on_search_player(data):
    print('Received player request for: ' + data['name'])
    player_entry = Player.query.filter_by(username=data['name']).first()
    
    if player_entry is None:
        SOCKETIO.emit('leaderboard_player_entry', json.dumps({ 'exists': 'false' }), room=get_request_sid())
    else:
        player_rank = get_player_rank(data['name'])
        json_packet = { 'exists': 'true', 'rank': player_rank, 'name': player_entry.username, 'score': player_entry.score }
        SOCKETIO.emit('leaderboard_player_entry', json.dumps(json_packet), room=get_request_sid())

LAST_UPDATE_TIME = time.time()


@SOCKETIO.on('game_over')
def game_over(data):
    '''
    On game_over event update the leaderboard (if necessary),
    send out the game is over to all other clients
    '''
    print('Game over Event: {}'.format(data['state']))
    # Avoid duplicate db modifications
    if data['state'] == 'win' and time.time() - LAST_UPDATE_TIME > 2:
        add_game_to_leaderboard(data['winner'], data['loser'])
    SOCKETIO.emit('game_over', data, broadcast=True, include_self=True)


@SOCKETIO.on('restart')
def on_restart():
    '''
    On restart event, set the board to empty, and send the board to everyone,
    emit restart to clients
    '''
    global BOARD
    BOARD = ['', '', '', '', '', '', '', '', '']
    SOCKETIO.emit('board_state',
                  json.dumps(BOARD),
                  broadcast=True,
                  include_self=True)
    SOCKETIO.emit('restart', broadcast=True, include_self=True)


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
    if winner_entry is None:  # does not exist
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
    DB.session.merge(user_profile)
    DB.session.commit()


def get_leaderboard_data():
    '''
    return a list of leaderboard entries in the format of a dictionary
    {name: username, score: user_score}
    '''
    top_50_users = Player.query.order_by(Player.score.desc()).limit(50).all()
    # format [{name: zach, score: 101}, {name: ra, score: 99}, ...]
    return list(
        map(lambda user: {
            'name': user.username,
            'score': user.score
        }, top_50_users))
        

def get_player_rank(username):
    '''
    Given string username, return the rank of the player
    '''
    players_list = Player.query.order_by(Player.score.desc()).all()
    for index, player in enumerate(players_list):
        if player.username == username:
            return index + 1
    return -1


# END DB functions


def update_board(data):
    '''
    Given json with a tile and move, add it to the board
    '''
    BOARD[int(data['tile'])] = data['move']
    return BOARD


def add_player_list(change):
    '''
    Simulated add player to playerlist
    '''
    CURRENT_PLAYER_LIST.append((change['uid'], change['name']))
    return CURRENT_PLAYER_LIST


def remove_from_players(uid):
    '''
    Moot function for the sake of unit test
    '''
    player_list = [('0faaaaaa', 'zach'), ('0f111111', 'leet')]
    new_list = list(filter(lambda entry: entry[0] != uid, player_list))
    return new_list


def get_request_sid():
    '''
    Returns the sid from a flask request object
    '''
    return request.sid


# Note that we don't call APP.run anymore. We call socketio.run with APP arg
if __name__ == "__main__":
    SOCKETIO.run(
        APP,
        host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
    )
