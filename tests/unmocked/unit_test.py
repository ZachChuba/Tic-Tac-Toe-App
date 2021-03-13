'''
Unmocked test cases for app.py
'''
import unittest
import os
import sys

sys.path.append(os.path.abspath('../../'))
from app import update_board, add_player_list, remove_from_players

KEY_INPUT = 'input'
KEY_EXPECTED = 'expected'


class UpdateBoardTest(unittest.TestCase):
    '''
    Unit test for the function update_board
    '''
    def setUp(self):
        '''
        Set up test cases
        '''

        self.success_test_params = [{
            KEY_INPUT: {
                'tile': '5',
                'move': 'x'
            },
            KEY_EXPECTED: ['', '', '', '', '', 'x', '', '', '']
        }, {
            KEY_INPUT: {
                'tile': '0',
                'move': 'o'
            },
            KEY_EXPECTED: ['o', '', '', '', '', 'x', '', '', '']
        }, {
            KEY_INPUT: {
                'tile': '0',
                'move': 'z'
            },
            KEY_EXPECTED: ['z', '', '', '', '', 'x', '', '', '']
        }]

    def test_update_success(self):
        '''
        Test the updates
        '''
        print('Testing update_board')
        for test_case in self.success_test_params:
            actual_result = update_board(test_case[KEY_INPUT])
            expected_result = test_case[KEY_EXPECTED]
            changed_index = int(test_case[KEY_INPUT]['tile'])

            self.assertIsNotNone(actual_result)
            self.assertEqual(actual_result[changed_index],
                             expected_result[changed_index])
            self.assertEqual(len(actual_result), len(expected_result))


KEY_ADDED = 'added'


class UpdatePlayerListTest(unittest.TestCase):
    '''
    Unit test for the function update_player_list
    '''
    def setUp(self):
        '''
        Set up test cases
        '''

        self.success_test_params = [{
            KEY_INPUT: {
                'uid': '00000000',
                'name': 'new_player'
            },
            KEY_EXPECTED: [('00000000', 'new_player')],
            KEY_ADDED: ('00000000', 'new_player')
        }, {
            KEY_INPUT: {
                'uid': '00000000',
                'name': 'new_player'
            },
            KEY_EXPECTED: [('00000000', 'new_player'),
                           ('00000000', 'new_player')],
            KEY_ADDED: ('00000000', 'new_player')
        }, {
            KEY_INPUT: {
                'this_isnt_right': '1',
                'name': 'hello',
                'uid': '11111111'
            },
            KEY_EXPECTED: [('00000000', 'new_player'),
                           ('00000000', 'new_player'), ('11111111', 'hello')],
            KEY_ADDED: ('11111111', 'hello')
        }]

    def test_update_success(self):
        '''
        Test the updates
        '''
        print('Testing add_player_list')
        for test_case in self.success_test_params:
            actual_result = add_player_list(test_case[KEY_INPUT])
            expected_result = test_case[KEY_EXPECTED]

            self.assertGreater(len(actual_result), 0)
            self.assertIn(test_case[KEY_ADDED], actual_result)
            for i, _ in enumerate(actual_result):
                self.assertEqual(actual_result[i], expected_result[i])


class RemoveFromPlayersTest(unittest.TestCase):
    '''
    Unit test for the function update_player_list
    '''
    def setUp(self):
        '''
        Set up test cases
        '''

        self.success_test_params = [{
            KEY_INPUT:
            '00000000',
            KEY_EXPECTED: [('0faaaaaa', 'zach'), ('0f111111', 'leet')],
        }, {
            KEY_INPUT: '0f111111',
            KEY_EXPECTED: [('00000000', 'new_player')],
        }, {
            KEY_INPUT: '0faaaaaa',
            KEY_EXPECTED: [('0f111111', 'leet')],
        }]

    def test_update_success(self):
        '''
        Test the updates
        '''
        print('Testing remove_from_players')
        for test_case in self.success_test_params:
            actual_result = remove_from_players(test_case[KEY_INPUT])
            expected_result = test_case[KEY_EXPECTED]

            self.assertEqual(len(actual_result),
                             len(expected_result))  # actual and expected match
            self.assertLessEqual(len(actual_result), 2)  # nothing ever added
            for i, _ in enumerate(actual_result):
                self.assertNotIn(test_case[KEY_INPUT],
                                 actual_result[i])  # key properly removed


if __name__ == '__main__':
    unittest.main()
