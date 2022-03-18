from tabnanny import check
from boggle import Boggle
from flask import Flask, render_template, request, redirect, session, flash, jsonify
from flask_debugtoolbar import DebugToolbarExtension
from functions import set_high_score,set_play_count

app = Flask(__name__)
app.config['SECRET_KEY'] = 'something'
debug = DebugToolbarExtension(app)
app.config["DEBUG_TB_INTERCEPT_REDIRECTS"] = False


boggle_game = Boggle()
boggle_board = boggle_game.make_board()

@app.route('/')
def display_app():
  """Displays the game app"""
  session['board'] = boggle_board
  return render_template('index.html',boggle_board = boggle_board)

@app.route('/check')
def is_valid_word():
  """Checks whether user guess is a valid word on board"""
  user_guess = request.args['word']
  check_valid_word_result = boggle_game.check_valid_word(boggle_board,user_guess)
  return jsonify({'message': check_valid_word_result})

@app.route('/stats', methods=["POST"])
def track_data():
  """Updates play count and highest score"""
  score = request.json['score']
  set_high_score(score)
  set_play_count()
  return redirect('/')
