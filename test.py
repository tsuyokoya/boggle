from unittest import TestCase
from app import app
from flask import session, json
from boggle import Boggle
from functions import set_high_score,set_play_count

app.config['TESTING'] = True
class FlaskTests(TestCase):
    """Test app.py routes"""
    def test_display_app(self):
        with app.test_client() as client:
            res = client.get('/')
            self.assertEqual(res.status_code, 200)

            html = res.get_data(as_text=True)
            self.assertIn("BOGGLE!", html)

    def test_is_valid_word(self):
        with app.test_client() as client:
            resp = client.get('/check?word=butter')
            self.assertEqual(resp.json['message'],'not-on-board')

            resp = client.get('/check?word=asdf')
            self.assertEqual(resp.json['message'],'not-word')

    def test_track_data(self):
        with app.test_client() as client:
            #json.dumps method allows you to convert a python obj into an equivalent json obj
            # had to set the content type header to application/json
            resp = client.post('/stats',data = json.dumps(dict(score = 10)), content_type = 'application/json')
            self.assertEqual(resp.status_code, 302)

    def test_track_data_redirection(self):
        with app.test_client() as client:
            res = client.get('/',follow_redirects = True)
            self.assertEqual(res.status_code, 200)