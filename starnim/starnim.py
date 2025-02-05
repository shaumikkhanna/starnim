from flask import Blueprint, render_template, request, jsonify, render_template, url_for
from starnim.starnim_logic import Starnim


starnim_bp = Blueprint('starnim', __name__, static_folder='static', template_folder='templates')


@starnim_bp.route('/')
def home():
    return render_template('starnim_start.html')


@starnim_bp.route('/game', methods=['GET', 'POST'])
def game():
    return render_template('starnim_game.html')


@starnim_bp.route('/computer-move', methods=['POST'])
def computer_move():
    node_states = request.json['node_states']
    difficulty = float(request.json['difficulty'])

    star = Starnim(node_states=node_states)
    move = star.next_move_node(1 - difficulty)

    return jsonify({'move': move})
