from flask import Flask

application = Flask(__name__)

from app import views

import settings

if __name__ == '__main__':
    application.run()

