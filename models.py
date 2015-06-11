from sqlalchemy.dialects.postgresql import JSON
import panelka
db = panelka.db

class Playlist(db.Model):
    __tablename__ = 'playlists'

    id = db.Column(db.Integer, primary_key=True)
    begin_at = db.Column(db.DateTime)
    items = db.relationship('PlaylistItem', backref='playlist')

    def __init__(self, url, time):
        self.begin_at = time

    def __repr__(self):
        return '<id {0} begin_at {1}>'.format(self.id, self.begin_at)

class PlaylistItem(db.Model):
    __tablename__ = 'playlist'

    id = db.Column(db.Integer, primary_key=True)
    playlist_id = db.Column(db.Integer, db.ForeignKey('playlists.id'))
    song_id = db.Column(db.Integer, db.ForeignKey('songs.id'))
    begin_at = db.Column(db.DateTime)

    def __init__(self, playlist_id, song_id, begin_at):
        self.playlist_id, self.song_id, self.begin_at = playlist_id, song_id, begin_at

    def __repr__(self):
        return '<{0} begins at {1}>'.format(repr(self.song), self.begin_at)

class Song(db.Model):
    __tablename__ = 'songs'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(32))
    artist_id = db.Column(db.Integer, db.ForeignKey('artists.id'))
    count = db.Column(db.Integer)
    video_id = db.column(db.Integer)

    def __init__(self, title, artist_id):
        self.title, self.artist_id, self.count = title, artist_id, 0

    def __repr__(self):
        return '{0} by {1}'.format(self.title, self.artist.name)

class Artist(db.Model):
    __tablename__ = 'artists'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(256))
    songs = db.relationship('Song', backref='artist')
    # todo genres tags many many

    def __init__(self, name):
        self.name = name

