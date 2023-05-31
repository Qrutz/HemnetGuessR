import json
import random
from sched import scheduler
import threading
import time
from pymongo import MongoClient
from pymongo.server_api import ServerApi
import schedule


from flask import Flask, jsonify, request
from flask_cors import CORS

from hemnetListingScraper import scrape_hemnet_listing
from get100latest import getlatest

app = Flask(__name__)
# make it so everyone has access to the api
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})


uri = "mongodb+srv://qrutz:3oncTSNMVrXNooZR@cluster0.3qfsmzw.mongodb.net/HemnetAPI"
# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))
# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)


data = {}


urls = [
    "https://www.hemnet.se/bostad/lagenhet-3rum-sjobo-boras-kommun-barnhemsgatan-42-20057795",
    "https://www.hemnet.se/bostad/lagenhet-2rum-centrum-boras-kommun-arlagatan-4-20057596",
    "https://www.hemnet.se/bostad/lagenhet-2rum-tullen-boras-kommun-fjallgatan-50b-20055978",
    "https://www.hemnet.se/bostad/radhus-5rum-boras-boras-kommun-hogloftsgatan-5-20055235",
    "https://www.hemnet.se/bostad/gard-knared-laholms-kommun-jons-petters-gard,-tralshult-55-20059896",
    "https://www.hemnet.se/bostad/lagenhet-1rum-torpa-jonkopings-kommun-erik-dahlbergsgatan-4-16835522"
    "https://www.hemnet.se/bostad/fritidsboende-2rum-bjorsjo-avesta-kommun-bjorsjo-11-20059915",
    "https://www.hemnet.se/bostad/villa-6rum-gustavsberg-karlstads-kommun-alfens-vag-37-19971258",
    "https://www.hemnet.se/bostad/radhus-4rum-kristineberg-boras-kommun-sparrfeltsgatan-234-20049835"
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
    data = retreieveJsonData()
    return jsonify(data)


@app.route('/api/getListing', methods=['POST'])
def getListing():
    url = request.json['url']
    data = scrape_hemnet_listing(url)
    # if we recieved data then print it to the console
    if data:
        return jsonify(data)
    else:
        return jsonify({"error": "No data found"})

# create router for scraping x number of listings from the first page, x should be a parameter


@app.route('/api/ScrapeNewestListings', methods=['POST'])
def scrapeNewestListings():

    count = request.json['count']
    data = getlatest(count)
    return jsonify(data)


if __name__ == "__main__":
    app.run(debug=True)
