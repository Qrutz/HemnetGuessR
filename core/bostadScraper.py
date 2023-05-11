import sys
import requests
from bs4 import BeautifulSoup

folder = "images"


def parse_property_data(url):
    bostadsData = {}

    response = requests.get(url)
    soup = BeautifulSoup(response.text, "html.parser")

    # Extract the property address
    property_address = soup.find(
        'span', class_='text-sm lg:text-base leading-tight lg:leading-normal tracking-widest text-fb-orange-text font-swedbankHeadlineBlack uppercase').text
    bostadsData["address"] = property_address

    # Extract the property name
    property_name = soup.find('h2', class_='py-1').text
    bostadsData["name"] = property_name

    # Extract the property price
    property_price = soup.find(
        'span', class_='text-2xl font-swedbankHeadlineBold leading-loose').text
    bostadsData["price"] = property_price

    images = soup.find_all("img")
    image_urls = []
    for image in images:
        # save each image in folder
        url = image["src"]
        if url.startswith("https://media.fastighetsbyran.se"):
            filename = url.split("/")[-1]
            # push filename to array in json
            image_urls.append(url)
            # with open(f"{folder}/{filename}", "wb") as f:
            #   f.write(requests.get(url).content)

    bostadsData["images"] = image_urls

    return bostadsData


# Example usage
url = sys.argv[1]
parsed_data = parse_property_data(url)
print(parsed_data)
