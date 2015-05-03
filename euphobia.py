from flask import Flask
from flask import render_template
app = Flask(__name__)

@app.route('/')
def hello_world():
    return render_template('euphobia.html')

if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0', port=80)
