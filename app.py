import os
import json
from flask import Flask, send_from_directory, json, session, request
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__, static_folder='./build/static')

# Point SQLAlchemy to your Heroku database
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
# Gets rid of a warning
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

import models # stop circular imports from models.py
Player = models.define_database_class(db)
if __name__ == "__main__":
    db.create_all()
"""
def create_test_data():
    player = Player(username="ra", score=101)
    db.session.add(player)
    db.session.commit()
    print("Creating test data (allegedly)")
    entries = Player.query.all()
    for player in entries:
        print(player)
create_test_data()
"""

cors = CORS(app, resources={r"/*": {"origins": "*"}})

socketio = SocketIO(
    app,
    cors_allowed_origins="*",
    json=json,
    manage_session=False
)

currentPlayerList = []
board = ['', '', '', '', '', '', '', '', '']

@app.route('/', defaults={"filename": "index.html"})
@app.route('/<path:filename>')
def index(filename):
    return send_from_directory('./build', filename)

# When a client clicks the login button, this function is run
@socketio.on('login')
def on_connect(data):
    print('Login')
    currentPlayerList.append({'uid': data['id'], 'name': data['name']})
    ensure_new_user_on_leaderboard(data['name'])
    
    socketio.emit('login', data, broadcast=True, include_self=False)
    socketio.emit('login', json.dumps(currentPlayerList), room=request.sid)
    socketio.emit('board_state', json.dumps(board), room=request.sid)

# When a client disconnects from this Socket connection, this function is run
@socketio.on('logout')
def on_disconnect(data):
    global currentPlayerList
    print('Logout')
    socketio.emit('logout', data, broadcast=True, include_self=False)
    currentPlayerList = list(filter(lambda entry: True if entry['uid'] != data['id'] else False, currentPlayerList))

@socketio.on('board_click')
def on_move(data):
    board[int(data['tile'])] = data['move']
    # Broadcast ttt play to all clients
    socketio.emit('board_click', data, broadcast=True, include_self=False)

@socketio.on('get_leaderboard')
def on_get_leaderboard():
    entries = get_leaderboard_data()
    socketio.emit('sending_leaderboard', json.dumps(entries), room=request.sid)

@socketio.on('game_over')
def game_over(data):
    print('Game over Event: {}'.format(data['state']))
    if data['state'] == 'win':
        add_game_to_leaderboard(data['winner'], data['loser'])
    socketio.emit('game_over', data, broadcast=True, include_self=True)


@socketio.on('restart')
def on_restart():
    global board
    board = ['', '', '', '', '', '', '', '', '']
    socketio.emit('board_state', json.dumps(board), broadcast=True, include_self=True)
    socketio.emit('restart', broadcast=True, include_self=True)


'''
DB Helper Functions -- Afraid to put in separate file b/c db relies on name==main
'''
def ensure_new_user_on_leaderboard(username):
    user_if_exists = Player.query.filter_by(username=username).first()
    if user_if_exists is None:
        add_player_to_leaderboard(username, 100)

def add_game_to_leaderboard(winner, loser):
    # check if person already exists
    winner = Player.query.filter_by(username=winner)
    loser = Player.query.filter_by(username=winner)
    if winner is None: # does not exist
        add_player_to_leaderboard(winner, 101)
    else:
        update_leaderboard_score(winner, 1)
    if loser is None:
        add_player_to_leaderboard(loser, 99)
    else:
        update_leaderboard_score(loser, -1)

def add_player_to_leaderboard(playername, score):
    new_player = Player(username=playername, score=score)
    db.session.add(new_player)
    db.session.commit()

def update_leaderboard_score(player_name, score_action):
    user_profile = Player.query.filter_by(username=player_name).first()
    user_profile.score = user_profile.score + score_action
    db.session.commit()

def get_leaderboard_data():
    top_50_users = Player.query.order_by(Player.score.desc()).limit(50).all()
    # format [{name: zach, score: 101}, {name: ra, score: 99}, ...]
    return list(map(lambda user: {'name' : user.username, 'score' : user.score}, top_50_users))

'''
End DB Helper Functions
'''

# Note that we don't call app.run anymore. We call socketio.run with app arg
socketio.run(
    app,
    host=os.getenv('IP', '0.0.0.0'),
    port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
)