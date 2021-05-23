from boggle import Boggle
from flask import Flask, render_template, jsonify, request, session



#creates new app and you must provide key right after
app = Flask(__name__)
app.config['SECRET_KEY'] = "COsecret"


#creates new boggle board with its class methods
boggle_game = Boggle()
valid_list = {""}
num_plays = 0;


def determine_dupe(new_guess):
    duplicate = False;
    if new_guess not in valid_list:
        valid_list.add(new_guess)
    else:
        duplicate = True
    return duplicate

#Render the Boggle Board in Jinga
@app.route('/')
def home_page():
    """make a new board and render the index html template with a form"""
    session['game_board'] = boggle_game.make_board()
    return render_template("index.html")


@app.route("/guess")
def check_guess():
    """ get the new guess submitted and check against the saved dictionary
        to determine if this is a valid word.  Handles duplicates with valid_list set
    """
    new_guess = request.args["guess"]
    board = session['game_board']
    response = boggle_game.check_valid_word(board, new_guess)
    dupe = determine_dupe(new_guess)
    return jsonify({"result": str(response), "dupe": str(dupe)})

@app.route("/add-score", methods=["POST"])
def add_score():
    """ use post to retrieve json score from front-end after game is complete 
        add the score to the session if it's higher than the previous session score
        increment the number of times played in this session
    """
    current_score = request.json["score"]
    highest_score = session.get("highest_score",0)
    if current_score > highest_score:
        session["highest_score"] = current_score
        highest_score = current_score
    num_plays = session.get("number_of_plays",0) + 1
    session["number_of_plays"] = num_plays
    valid_list.clear()
    return jsonify(scoreStatusRecord=highest_score)