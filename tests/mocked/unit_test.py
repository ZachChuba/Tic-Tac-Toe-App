'''
Test cases that mock function calls
'''
import unittest
import unittest.mock as mock
from unittest.mock import patch
import os
import sys

sys.path.append(os.path.abspath('../../'))
from app import add_player_to_leaderboard, on_move, get_leaderboard_data

def format_for_db(s):
    '''
    Convert name into database object string
    '''
    return "<Player {}>".format(s)


KEY_INPUT = 'input'
KEY_EXPECTED = 'expected'
FIRST_INITIAL_USERNAME_ADD_TEST = 'Bob'
SECOND_INITIAL_USERNAME_ADD_TEST = 'Randy'

class AddPlayerTest(unittest.TestCase):
    '''
    Test case for the function add_player_to_leaderboard
    '''
    def setUp(self):
        '''
        Setup for the test case
        '''
        self.success_test_params = [{
            KEY_INPUT:
            'Bob',
            KEY_EXPECTED: [format_for_db('Bob')]
        }, {
            KEY_INPUT:
            'Randy',
            KEY_EXPECTED: [
                format_for_db(FIRST_INITIAL_USERNAME_ADD_TEST),
                format_for_db('Randy')
            ],
        }, {
            KEY_INPUT:
            'John',
            KEY_EXPECTED: [
                format_for_db(FIRST_INITIAL_USERNAME_ADD_TEST),
                format_for_db(SECOND_INITIAL_USERNAME_ADD_TEST),
                format_for_db('John')
            ]
        }]

        #PLAYER_CLASS = models.define_database_class(DB)
        #initial_person = PLAYER_CLASS(username=self.INITIAL_USERNAME, score=self.SCORE)

        self.initial_db_mock = []

    def mock_db_session_add(self, username):
        '''
        Mocked db add
        '''
        self.initial_db_mock.append(str(username))

    def mock_db_session_commit(self):
        '''
        Mocked db commit
        '''
        pass

    def mock_person_query_all(self):
        '''
        Mocked db query all
        '''
        return self.initial_db_mock

    def test_success(self):
        '''
        Test cases that are supposed to be successful
        '''
        print('Test Cases for add_player_to_leaderboard')
        for i in range(len(self.success_test_params)):
            test = self.success_test_params[i]
            with patch('app.DB.session.add', self.mock_db_session_add):
                with patch('app.DB.session.commit',
                           self.mock_db_session_commit):

                    print(self.initial_db_mock)
                    add_player_to_leaderboard(test[KEY_INPUT], 100)
                    actual_result = self.initial_db_mock
                    print(actual_result)
                    expected_result = test[KEY_EXPECTED]
                    print(self.initial_db_mock)
                    print(expected_result)

                    self.assertEqual(len(actual_result), len(expected_result))
                    self.assertEqual(actual_result[i], expected_result[i])

class OnMoveTest(unittest.TestCase):
    '''
    Test case for the function on_move (socket event)
    '''
    def setUp(self):
        '''
        Setup for the test case
        '''
        self.success_test_params = [{
            KEY_INPUT: {'tile' : '5', 'move': 'x'},
            KEY_EXPECTED: {'board': ['', '', '', '', '', 'x', '', '', ''], 'socket': {'event': 'board_click', 'data': {'tile' : '5', 'move': 'x'}, 'to_all': True, 'include_self': False}}
        },
        {
            KEY_INPUT: {'tile' : '0', 'move': 'o'},
            KEY_EXPECTED: {'board': ['o', '', '', '', '', 'x', '', '', ''], 'socket': {'event': 'board_click', 'data': {'tile' : '0', 'move': 'o'}, 'to_all': True, 'include_self': False}}
        },
        {
            # illegal move, but not vetted by function
            KEY_INPUT: {'tile' : '5', 'move': 'z'},
            KEY_EXPECTED: {'board': ['o', '', '', '', '', 'z', '', '', ''], 'socket': {'event': 'board_click', 'data': {'tile' : '5', 'move': 'z'}, 'to_all': True, 'include_self': False}}
        }]
        
        self.initial_board_mock = ['', '', '', '', '', '', '', '', '']
        self.emit_event = {}
    
    def mock_update_board(self, data):
        '''
        Mock updating the board
        '''
        self.initial_board_mock[int(data['tile'])] = data['move']
    
    def mock_socket_emit(self, event_name, event_data=None, broadcast=False, include_self=False):
        self.emit_event = {'event': event_name, 'data': event_data, 'to_all': broadcast, 'include_self': include_self}
    
    def test_success(self):
        print('Test cases for on_move')
        for i in range(len(self.success_test_params)):
            test = self.success_test_params[i]
            with patch('app.update_board', self.mock_update_board):
                with patch('app.socketio.emit', self.mock_socket_emit):
                    on_move(test[KEY_INPUT])
                    actual_board = self.initial_board_mock
                    actual_event = self.emit_event
                    expected_board = test[KEY_EXPECTED]['board']
                    expected_event = test[KEY_EXPECTED]['socket']
                    
                    self.assertEqual(len(actual_board), len(expected_board))
                    self.assertIn(test[KEY_INPUT]['move'], actual_board) # Board contains the player moved
                    self.assertDictContainsSubset(actual_event, expected_event) # Socket event emitted properly

if __name__ == '__main__':
    unittest.main()
