import json
import sys
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys


def scrape_hemnet_listing(url):
    driver = webdriver.Firefox()
    driver.get(url)
    time.sleep(5)

    # FIND BUTTON WITH TEXT THAT SAYS "SÖK"
    driver.implicitly_wait(10)

    # set a cookie with the name uc_user_interaction to true
    driver.add_cookie({"name": "uc_user_interaction", "value": "true"})

    # set local storage to true
    driver.execute_script(
        "window.localStorage.setItem('uc_user_interaction', 'true');")

    driver.refresh()

    # find a span with class "property-gallery__button-label"
    dd = driver.find_elements(By.CLASS_NAME, "property-gallery__button-label")
    for d in dd:
        if d.text != "Planritning":
            # parse the text by splitting it on empty spaces and then take the first element
            imagecount = int(d.text.split()[0])

    # find div with class property-attributes-table__row
    divs = driver.find_elements(
        By.CLASS_NAME, "property-attributes-table__row")

    # set all variables to None so we don't get an error if we don't find the element
    bostadstyp, upplatelseform, antalrum, boarea, Biarea, Tomtarea, byggar, driftkostnad, Forening, Avgift, PrisM = [
        None] * 11

    # if the div has a dt child with class property-attributes-table__label that has text "Bostadstyp" then take the next sibling dd and get the text
    for div in divs:
        lmao = div.find_element(
            By.CLASS_NAME, "property-attributes-table__label")
        value = div.find_element(
            By.CLASS_NAME, "property-attributes-table__value").text

        if lmao.text == "Bostadstyp":
            bostadstyp = value
        elif lmao.text == "Upplåtelseform":
            upplatelseform = value
        elif lmao.text == "Antal rum":
            antalrum = value
        elif lmao.text == "Boarea":
            boarea = value
        elif lmao.text == "Biarea":
            Biarea = value
        elif lmao.text == "Tomtarea":
            Tomtarea = value
        elif lmao.text == "Byggår":
            byggar = value
        elif lmao.text == "Driftkostnad":
            driftkostnad = value
        elif lmao.text == "Förening":
            Forening = value
        elif lmao.text == "Avgift":
            Avgift = value
        elif lmao.text == "PrisM":
            PrisM = value

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

    time.sleep(5)

    # find all images
    images = driver.find_elements(By.TAG_NAME, "img")

    # save all images that contain bilder.hemnet.se
    images = [image.get_attribute("src") for image in images if image.get_attribute(
        "src") is not None and "bilder.hemnet.se" in image.get_attribute("src")]

    # create a json object with all the data
    data = {
        "bostadstyp": bostadstyp,
        "upplatelseform": upplatelseform,
        "antalrum": antalrum,
        "boarea": boarea,
        "Biarea": Biarea,
        "Tomtarea": Tomtarea,
        "byggar": byggar,
        "driftkostnad": driftkostnad,
        "Forening": Forening,
        "Avgift": Avgift,
        "PrisM": PrisM,
        "images": images
    }

    # print the data
    print(data)

    # save the data in a json file
    with open('data.json', 'w') as outfile:
        json.dump(data, outfile, indent=4)

    # close the driver
    driver.close()


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python3 hemnetListingScraper.py <url>")
        sys.exit(1)

    url = sys.argv[1]
    scrape_hemnet_listing(url)
