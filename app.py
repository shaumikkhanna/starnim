from flask import Flask, render_template
from starnim.starnim import starnim_bp


app = Flask(__name__)


app.register_blueprint(starnim_bp, url_prefix='/starnim', static_folder='starnim/static', template_folder='starnim/templates')


@app.route('/')
def index():
    return render_template('index.html')


if __name__ == '__main__':
    app.run(port=8000, debug=True)



