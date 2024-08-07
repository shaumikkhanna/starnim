from flask import Flask, request, jsonify, render_template, url_for
from starnim_logic import Starnim


app = Flask(__name__)


@app.route('/')
def home():
    return render_template('start.html')


@app.route('/game', methods=['GET', 'POST'])
def game():
    return render_template('game.html')


@app.route('/computer-move', methods=['POST'])
def computer_move():
    node_states = request.json['node_states']
    difficulty = float(request.json['difficulty'])

    star = Starnim(node_states=node_states)
    move = star.next_move_node(1 - difficulty)

    return jsonify({'move': move})


if __name__ == '__main__':
    app.run(port=8000)



