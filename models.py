'''
Model for DB
'''
def define_database_class(database_session):
    '''
    Returns class Player that is a model for the db
    '''
    class Player(database_session.Model):
        '''
        Database Player table format
        '''
        username = database_session.Column(database_session.String(80), primary_key=True)
        score = database_session.Column(database_session.Integer, nullable=False)

        def __repr__(self):
            return '<Player {}>'.format(self.username)

    return Player
