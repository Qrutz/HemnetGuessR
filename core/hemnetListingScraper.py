import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
driver = webdriver.Firefox()

# Navigate to url
driver.get(
    "https://www.hemnet.se/bostad/villa-6rum-stora-hoga-stenungsunds-kommun-karins-vag-33-20059595")
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


# set all variables to None so we dont get an error if we dont find the element
bostadstyp = None
upplåtelseform = None
antalrum = None
boarea = None
Biarea = None
Tomtarea = None
byggår = None
driftkostnad = None
Förening = None
Avgift = None
PrisM = None

# if the div has a a dt child with class property-attributes-table__label that has text "Bostadstyp" then take the next sibling dd and get the text
for div in divs:
    lmao = div.find_element(By.CLASS_NAME, "property-attributes-table__label")

    if lmao.text == "Bostadstyp":
        bostadstyp = div.find_element(
            By.CLASS_NAME, "property-attributes-table__value").text

    elif lmao.text == "Upplåtelseform":
        upplåtelseform = div.find_element(
            By.CLASS_NAME, "property-attributes-table__value").text

    elif lmao.text == "Antal rum":
        antalrum = div.find_element(
            By.CLASS_NAME, "property-attributes-table__value").text

    elif lmao.text == "Boarea":
        boarea = div.find_element(
            By.CLASS_NAME, "property-attributes-table__value").text

    elif lmao.text == "Biarea":
        Biarea = div.find_element(
            By.CLASS_NAME, "property-attributes-table__value").text
    elif lmao.text == "Tomtarea":
        Tomtarea = div.find_element(
            By.CLASS_NAME, "property-attributes-table__value").text
    elif lmao.text == "Byggår":
        byggår = div.find_element(
            By.CLASS_NAME, "property-attributes-table__value").text
    elif lmao.text == "Driftkostnad":
        driftkostnad = div.find_element(
            By.CLASS_NAME, "property-attributes-table__value").text
    elif lmao.text == "Förening":
        Förening = div.find_element(
            By.CLASS_NAME, "property-attributes-table__value").text
    elif lmao.text == "Avgift":
        Avgift = div.find_element(
            By.CLASS_NAME, "property-attributes-table__value").text
    elif lmao.text == "PrisM":
        PrisM = div.find_element(
            By.CLASS_NAME, "property-attributes-table__value").text


# find button with classname "gallery-carousel__image-touchable"
buttons = driver.find_element(
    By.CLASS_NAME, "gallery-carousel__image-touchable")
buttons.click()

# simulate a scroll by first clicking on the body and then scrolling
body = driver.find_element(By.TAG_NAME, "body")
body.click()


# scroll down accorindg to the number of images
for (i) in range(0, imagecount):
    body.send_keys(Keys.PAGE_DOWN)

time.sleep(5)

# find all images
images = driver.find_elements(By.TAG_NAME, "img")

# save all images that contain bilder.hemnet.se
images = {image.get_attribute("src") for image in images if image.get_attribute(
    "src") is not None and "bilder.hemnet.se" in image.get_attribute("src")}


# create a dictionary with the data
data = {
    "bostadstyp": bostadstyp,
    "upplåtelseform": upplåtelseform,
    "antalrum": antalrum,
    "boarea": boarea,
    "biarea": Biarea,
    "Tomtarea": Tomtarea,
    "byggår": byggår,
    "driftkostnad": driftkostnad,
    "Förening": Förening,
    "Avgift": Avgift,
    "PrisM": PrisM,
    "images": images
}

# print the data
print(data)
