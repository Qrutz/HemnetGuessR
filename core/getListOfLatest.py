import json
import sys
import time
from pymongo import MongoClient
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from core.GetListing import scrape_hemnet_listing
from pymongo.server_api import ServerApi


def ScrapeXLatest(max):

    options = webdriver.ChromeOptions()

    options.add_argument('--no-sandbox')
    options.add_argument("--single-process")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-dev-tools")
    options.add_argument("--no-zygote")
    options.add_argument("--remote-debugging-port=9222")

    driver = webdriver.Chrome(options=options)
    driver.get("https://www.hemnet.se/bostader")
    time.sleep(1)

    driver.implicitly_wait(2)

    driver.add_cookie({"name": "uc_user_interaction", "value": "true"})
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

    for i in range(3):
        driver.get(urls[i])

        # find a span with class "property-gallery__button-label"
        listingbuttons = driver.find_elements(
            By.CLASS_NAME, "property-gallery__button-label")

        for button in listingbuttons:
            # if the text inclues Bilder assign imagecount to the first element of the text
            if "Bilder" in button.text:
                imagecount = int(button.text.split()[0])
                break
            else:
                # sometimes the listings doesnt have an image count button for some reason so lets just assume its high to make sure we get all imgs
                imagecount = 70

        # find div with class property-attributes-table__row
        divs = driver.find_elements(
            By.CLASS_NAME, "property-attributes-table__row")

        # set all variables to None so we don't get an error if we don't find the element
        price, namn, kommun, realtor, bostadstyp, Tomtarea, antalrum, boarea, Balkong, Tomtarea, byggar, driftkostnad, Forening, Avgift, PrisM = [
            None] * 15
        # find h1 with class qa-property-heading hcl-heading hcl-heading--size2
        namn = driver.find_element(
            By.CLASS_NAME, "qa-property-heading").text

        kommun = driver.find_element(
            By.CLASS_NAME, "property-address__area").text

        price = driver.find_element(
            By.CLASS_NAME, "property-info__price").text

        # if the div has a dt child with class property-attributes-table__label that has text "Bostadstyp" then take the next sibling dd and get the text
        for div in divs:
            category = div.find_element(
                By.CLASS_NAME, "property-attributes-table__label")
            value = div.find_element(
                By.CLASS_NAME, "property-attributes-table__value").text

            if category.text == "Bostadstyp":
                bostadstyp = value
            elif category.text == "Antal rum":
                antalrum = value
            elif category.text == "Boarea":
                boarea = value
            elif category.text == "Tomtarea":
                Tomtarea = value
            elif category.text == "Byggår":
                byggar = value
            elif category.text == "Driftkostnad":
                driftkostnad = value
            elif category.text == "Förening":
                Forening = value
            elif category.text == "Balkong":
                Balkong = value
            elif category.text == "Tomtarea":
                Tomtarea = value

        # find button with classname "gallery-carousel__image-touchable"
        buttons = driver.find_element(
            By.CLASS_NAME, "gallery-carousel__image-touchable")
        buttons.click()

        # simulate a scroll by first clicking on the body and then scrolling
        body = driver.find_element(By.TAG_NAME, "body")
        body.click()

        # scroll down according to the number of images
        for _ in range(imagecount):
            body.send_keys(Keys.PAGE_DOWN)

        # if image count is greater than 25 ish, we gotta wait a bit
        if imagecount > 25:
            time.sleep(2)

        # find all images
        images = driver.find_elements(By.TAG_NAME, "img")

        images = [image.get_attribute("src") for image in images if image.get_attribute(
            "src") is not None and "bilder.hemnet.se" in image.get_attribute("src")]
        images = [image for image in images if "broker_logo" not in image and "broker_banner" not in image and "broker_profile" not in image and "itemgallery_cut" not in image and "itemgallery" not in image]

        data = {
            "Titel": namn,
            "Lokation": kommun,
            "Bostadstyp": bostadstyp,
            "Antal rum": antalrum,
            "BoArea": boarea,
            "Tomtarea": Tomtarea,
            "Balkong": Balkong,
            "Pris": price,
            "ListingURL": urls[i],
            "Byggar": byggar,
            "Driftkostnad": driftkostnad,
            "Bilder": images,
        }

        # REMOVE ALL NONE VALUES, THEY JUST CLUTTER THE JSON FILE
        data = {k: v for k, v in data.items() if v is not None}

        # add the data to a json file, add it dont overwrite it
        print(json.dumps(data, indent=4))

        continue

        # find a span with class "property-gallery__button-label"

    # print("Found " + str(urlcounter) + " urls")
    # count = 0
    # for url in urls:
    #     count += 1

    #     if count == max:
    #         break
    #     listing = scrape_hemnet_listing(url)
    #     if listing:
    #         # add the dictionary to the data list
    #         db.listings.insert_one(listing)
    #         print("Added listing " + str(count) + " to database")
    # print("Done scraping")
    # driver.close()
if __name__ == "__main__":
    max = int(sys.argv[1])
    ScrapeXLatest(max)
