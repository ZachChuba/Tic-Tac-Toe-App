def define_database_class(db):
    class Player(db.Model):
        username = db.Column(db.String(80), primary_key=True)
        score = db.Column(db.Integer, nullable=False)
        
        def __repr__(self):
            return '<Player {}>'.format(self.username)
    return Player