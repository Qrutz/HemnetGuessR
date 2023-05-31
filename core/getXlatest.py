import json
import sys
import time
from pymongo import MongoClient
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from hemnetListingScraper import scrape_hemnet_listing
from pymongo.server_api import ServerApi


def ScrapeXLatest(max):
    uri = "mongodb+srv://qrutz:3oncTSNMVrXNooZR@cluster0.3qfsmzw.mongodb.net/HemnetAPI"
    # Create a new client and connect to the server
    # change to aws db later cba hiding this shit
    client = MongoClient(uri, server_api=ServerApi('1'))
    db = client.HemnetAPI
    collection = db.listings
    # Send a ping to confirm a successful connection
    try:
        client.admin.command('ping')
        print("Pinged your deployment. You successfully connected to MongoDB!")
    except Exception as e:
        print(e)

    driver = webdriver.Firefox()
    driver.get("https://www.hemnet.se/bostader")
    time.sleep(2)

    # FIND BUTTON WITH TEXT THAT SAYS "SÖK"
    driver.implicitly_wait(3)

    # set a cookie with the name uc_user_interaction to true
    driver.add_cookie({"name": "uc_user_interaction", "value": "true"})

    # set local storage to true
    driver.execute_script(
        "window.localStorage.setItem('uc_user_interaction', 'true');")

    driver.refresh()

    # find a li with class normal-results__hit js-normal-list-item
    li = driver.find_elements(By.CLASS_NAME, "js-listing-card-link")
    # for each a , get the href and run a function on that text
    urls = []
    urlcounter = 0
    for a in li:
        urlcounter += 1
        urls.append(a.get_attribute("href"))

    print("Found " + str(urlcounter) + " urls")
    count = 0
    for url in urls:
        count += 1

        if count == max:
            break
        listing = scrape_hemnet_listing(url)
        if listing:
            # add the dictionary to the data list
            db.listings.insert_one(listing)
            print("Added listing " + str(count) + " to database")

    print("Done scraping")
    driver.close()


if __name__ == "__main__":
    max = int(sys.argv[1])
    ScrapeXLatest(max)
