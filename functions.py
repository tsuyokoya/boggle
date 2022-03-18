from flask import session

def set_high_score(score):
  if score == 0:
    session['score'] = 0
  if score > session.get('score',0):
    session['score'] = score
  return session['score']

def set_play_count():
  session['play_count'] = session.get('play_count', 0) + 1