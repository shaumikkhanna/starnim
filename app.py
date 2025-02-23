from flask import Flask, render_template
from starnim.starnim import starnim_bp
from connections.connections import connections_bp


app = Flask(__name__, static_folder='static', template_folder='templates')

app.register_blueprint(connections_bp, url_prefix='/connections')
app.register_blueprint(starnim_bp, url_prefix='/starnim')

# Load environment variables (Only required for local use)
# from dotenv import load_dotenv
# load_dotenv()


@app.route('/')
def index():
    return render_template('index.html')


if __name__ == '__main__':
    app.run(port=8000, debug=True) # Change this before deployment



