from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle


class FlaskTests(TestCase):

    def setup(self):
        # Sets up testing for the class
        app.config['TESTING'] = True

    def test_home_page(self):
        # Tests header response status code
        with app.test_client() as client:
            resp = client.get('/')
            self.assertEqual(resp.status_code, 200)

    def test_session(self):
        #Tests header response status code and if session is set to zero
        with app.test_client() as client:
            resp = client.get('/')
            self.assertEqual(resp.status_code, 200)
            self.assertIsNone(session.get("number_of_plays"))
    
    def test_session_update(self):
        #Tests header response status code and tests if session can be updated
        with app.test_client() as client:
            with client.session_transaction() as change_session:
                change_session["highest_score"] = 1000
            resp = client.get('/')
            self.assertEqual(resp.status_code, 200)
            self.assertEqual(session["highest_score"], 1000)