import os
import json
from flask import Flask, send_from_directory, json, session, request
from flask_socketio import SocketIO
from flask_cors import CORS

app = Flask(__name__, static_folder='./build/static')

cors = CORS(app, resources={r"/*": {"origins": "*"}})

socketio = SocketIO(
    app,
    cors_allowed_origins="*",
    json=json,
    manage_session=False
)

currentPlayerList = []

@app.route('/', defaults={"filename": "index.html"})
@app.route('/<path:filename>')
def index(filename):
    return send_from_directory('./build', filename)

# When a client clicks the login button, this function is run
@socketio.on('login')
def on_connect(data):
    print('Login')
    currentPlayerList.append({'uid': data['id'], 'name': data['name']})
    # json_for_init_login = "user_list: {}".format(json.dumps(currentPlayerList))
    
    socketio.emit('login', data, broadcast=True, include_self=False)
    socketio.emit('login', json.dumps(currentPlayerList), room=request.sid)

# When a client disconnects from this Socket connection, this function is run
@socketio.on('logout')
def on_disconnect(data):
    global currentPlayerList
    print('Logout')
    socketio.emit('logout', data, broadcast=True, include_self=False)
    currentPlayerList = list(filter(lambda entry: True if entry['uid'] != data['id'] else False, currentPlayerList))

# When a client emits the event 'chat' to the server, this function is run
# 'chat' is a custom event name that we just decided
@socketio.on('chat')
def on_chat(data): # data is whatever arg you pass in your emit call on client
    print(str(data))
    # This emits the 'chat' event from the server to all clients except for
    # the client that emmitted the event that triggered this function
    socketio.emit('chat',  data, broadcast=True, include_self=False)

@socketio.on('board_click')
def on_move(data):
    print(data)
    # Broadcast ttt play to all clients
    socketio.emit('board_click', data, broadcast=True, include_self=False)

# Note that we don't call app.run anymore. We call socketio.run with app arg
socketio.run(
    app,
    host=os.getenv('IP', '0.0.0.0'),
    port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
)