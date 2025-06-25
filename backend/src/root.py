import logging

from flask import Blueprint, jsonify

root_bp = Blueprint('root', __name__, url_prefix='/')

@root_bp.route('/')
def health():
    logging.info('Health check!')
    return jsonify({"message": "success"}), 200
