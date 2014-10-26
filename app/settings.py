__author__ = 'mendrugory'
from flask.ext.mongoengine import MongoEngine
from app import application
from secret_settings import MONGODB_HOST, MONGODB_NAME, MONGODB_USER, MONGODB_PWD, MONGODB_PORT

application.config['MONGODB_SETTINGS'] = {
    'db': MONGODB_NAME,
    'host': MONGODB_HOST,
    'port': MONGODB_PORT,
    'username': MONGODB_USER,
    'password': MONGODB_PWD
}

db = MongoEngine(application)
