import requests
from os import getenv


API_KEY = getenv('CONNECTIONS_API_KEY')
BIN_ID = getenv('CONNECTIONS_BIN_ID')


def get_puzzle_data():
    url = 'https://api.jsonbin.io/v3/b/{bin_id}/latest'.format(bin_id=BIN_ID)
    headers = {
        'X-Master-Key': API_KEY,
        'X-Bin-Meta': 'false'
    }

    req = requests.get(url, json=None, headers=headers)
    return req.json()


def put_puzzle_data(data):
    url = 'https://api.jsonbin.io/v3/b/{bin_id}'.format(bin_id=BIN_ID)
    headers = {
    'Content-Type': 'application/json',
    'X-Master-Key': API_KEY
    }

    req = requests.put(url, json=data, headers=headers)
    if req.status_code != 200:
        print('Request not ok')
