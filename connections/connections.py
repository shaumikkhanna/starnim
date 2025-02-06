from flask import Blueprint, render_template, request, jsonify, render_template, url_for
import json
import os


connections_bp = Blueprint('connections', __name__, static_folder='static', template_folder='templates')

PUZZLES_FILENAME = 'connections/puzzles.json'


@connections_bp.route('/')
def home():
    return render_template('connections_start.html')


@connections_bp.route('/create', methods=['GET', 'POST'])
def create():
    return render_template('connections_create.html')


@connections_bp.route('/save-puzzle', methods=['POST'])
def save_puzzle():
    print('Saving puzzle...')
    data = request.get_json()
    game_code = data['game_code']

    # Check if puzzles.json exists; if not, create it
    if not os.path.exists(PUZZLES_FILENAME):
        with open(PUZZLES_FILENAME, 'w') as f:
            json.dump({}, f)

    # Load existing puzzles
    with open(PUZZLES_FILENAME, 'r') as f:
        puzzles = json.load(f)

    # Add new puzzle
    puzzles[game_code] = data

    # Save back to puzzles.json
    with open(PUZZLES_FILENAME, 'w') as f:
        json.dump(puzzles, f, indent=4)

    return jsonify({"message": "Puzzle saved successfully!"})


@connections_bp.route('/play/<game_code>')
def play_puzzle(game_code):
    # Check if puzzles.json exists
    if not os.path.exists(PUZZLES_FILENAME):
        return "No puzzles found!", 404

    # Load puzzles
    with open(PUZZLES_FILENAME, 'r') as f:
        puzzles = json.load(f)

    # Check if the game code exists
    puzzle = puzzles.get(game_code.upper())
    if not puzzle:
        return f"Puzzle with game code {game_code} not found!", 404

    # Pass puzzle data to template
    return render_template('connections_play.html', puzzle=puzzle)

