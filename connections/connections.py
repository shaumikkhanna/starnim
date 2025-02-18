from flask import Blueprint, render_template, request, jsonify, render_template, url_for
from connections.jsonbinapi import get_puzzle_data, put_puzzle_data


connections_bp = Blueprint('connections', __name__, static_folder='static', template_folder='templates')


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

    # Load existing puzzles
    puzzle_data = get_puzzle_data()

    # Add new puzzle
    puzzle_data[game_code] = data

    # Save puzzle
    put_puzzle_data(puzzle_data)

    return jsonify({"message": "Puzzle saved successfully!"})


@connections_bp.route('/play/<game_code>')
def play_puzzle(game_code):
    # Load puzzles
    puzzle_data = get_puzzle_data()

    # Check if the game code exists
    puzzle = puzzle_data.get(game_code.upper())
    if not puzzle:
        return f"Puzzle with game code {game_code} not found!", 404

    # Pass puzzle data to template
    return render_template('connections_play.html', puzzle=puzzle)

