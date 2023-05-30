import json
import random
from sched import scheduler
import threading
import time
import schedule


from flask import Flask, jsonify, request
from flask_cors import CORS

from hemnetListingScraper import scrape_hemnet_listing

app = Flask(__name__)
# make it so everyone has access to the api
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})


data = {}


urls = [
    "https://www.hemnet.se/bostad/lagenhet-3rum-sjobo-boras-kommun-barnhemsgatan-42-20057795",
    "https://www.hemnet.se/bostad/lagenhet-2rum-centrum-boras-kommun-arlagatan-4-20057596",
    "https://www.hemnet.se/bostad/lagenhet-2rum-tullen-boras-kommun-fjallgatan-50b-20055978",
    "https://www.hemnet.se/bostad/radhus-5rum-boras-boras-kommun-hogloftsgatan-5-20055235",
    "https://www.hemnet.se/bostad/gard-knared-laholms-kommun-jons-petters-gard,-tralshult-55-20059896",
    "https://www.hemnet.se/bostad/lagenhet-1rum-torpa-jonkopings-kommun-erik-dahlbergsgatan-4-16835522"
    "https://www.hemnet.se/bostad/fritidsboende-2rum-bjorsjo-avesta-kommun-bjorsjo-11-20059915"
]


def scrape_data():
    url = random.choice(urls)
    data = scrape_hemnet_listing(url)
    return data


def scrape_job():
    schedule.every(25).seconds.do(scrape_data)

    while True:
        schedule.run_pending()
        time.sleep(1)


def retreieveJsonData():
    with open('data.json') as json_file:
        data = json.load(json_file)
        return data


@app.route('/api/getRandomListing', methods=['GET'])
def getRandomListing():
    # get the url from the request and scrape the data
    # import json file from data.json
    # return the data

    data = retreieveJsonData()
    return jsonify(data)


if __name__ == "__main__":
    threading.Thread(target=scrape_job).start()
    app.run()
