import sys
import requests
import json
from bs4 import BeautifulSoup

folder = "images"

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
}


def parse_property_data(url):
    bostadsData = {}

    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, "html.parser")

    print(soup.prettify())

    # find img wit tag js-lazy-load

    # extract the data-src

    # property_name = soup.find('h1', class_='qa-property-heading').text.strip()

    # property_price = soup.find('p', class_='property-info__price').text.strip()
    # bostadsData["name"] = property_name
    # bostadsData["price"] = property_price
    # return bostadsData
# Example usage
url = "https://www.hemnet.se/bostad/radhus-5rum-sparsor-boras-kommun-mellanvagen-15a-19930975"
parsed_data = parse_property_data(url)
print(parsed_data)
