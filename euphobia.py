from flask import Flask
from flask import render_template, request, redirect

import os
app = Flask(__name__)

WHITELIST = ['172.28.168.216'] # cuz no time for auth scheme

@app.route('/')
def hello_world():
    return render_template('euphobia.html')

@app.route('/zdmin/')
def zdmin():
    if request.remote_addr not in WHITELIST:
        return redirect('/', 302)
    return render_template('zdmin.html', {'playlist': playlist})

if __name__ == '__main__':
    app.debug = True
    port = int(os.environ.get('PORT', 33507))
    app.run(host='0.0.0.0', port=port)

