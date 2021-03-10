'''
Test cases that mock function calls
'''
import unittest
import unittest.mock as mock
from unittest.mock import patch
import os
import sys

sys.path.append(os.path.abspath('../../'))
from app import add_player_to_leaderboard, update_leaderboard_score, get_leaderboard_data, DB
import models

class AddPlayerTest(unittest.TestCase):
    '''
    Test case for the function add_player_to_leaderboard
    '''
    
    def setUp(self):
        '''
        Setup for the test case
        '''
        self.KEY_INPUT = 'input'
        self.KEY_EXPECTED = 'expected'
        self.FIRST_INITIAL_USERNAME = 'Bob'
        self.SECOND_INITIAL_USERNAME = 'Randy'
        
        self.success_test_params = [
            {
                self.KEY_INPUT: 'Bob',
                self.KEY_EXPECTED: [self.format_for_db('Bob')]
            },
            {
                self.KEY_INPUT: 'Randy',
                self.KEY_EXPECTED: [self.format_for_db(self.FIRST_INITIAL_USERNAME), self.format_for_db('Randy')],
            },
            {
                self.KEY_INPUT: 'John',
                self.KEY_EXPECTED: [self.format_for_db(self.FIRST_INITIAL_USERNAME), self.format_for_db(self.SECOND_INITIAL_USERNAME), self.format_for_db('John')]
            }
        ]
        
        #PLAYER_CLASS = models.define_database_class(DB)
        #initial_person = PLAYER_CLASS(username=self.INITIAL_USERNAME, score=self.SCORE)
        
        self.initial_db_mock = []
    
    def format_for_db(self, s):
        return "<Player {}>".format(s)
    
    def mock_db_session_add(self, username):
        self.initial_db_mock.append(str(username))
    
    def mock_db_session_commit(self):
        pass
    
    def mock_person_query_all(self):
        return self.initial_db_mock
    
    def test_success(self):
        for i in range(len(self.success_test_params)):
            test = self.success_test_params[i]
            with patch('app.DB.session.add', self.mock_db_session_add):
                with patch('app.DB.session.commit', self.mock_db_session_commit):
    
                        print(self.initial_db_mock)
                        add_player_to_leaderboard(test[self.KEY_INPUT], 100)
                        actual_result = self.initial_db_mock
                        print(actual_result)
                        expected_result = test[self.KEY_EXPECTED]
                        print(self.initial_db_mock)
                        print(expected_result)
                        
                        self.assertEqual(len(actual_result), len(expected_result))
                        self.assertEqual(actual_result[i], expected_result[i])

if __name__ == '__main__':
    unittest.main()