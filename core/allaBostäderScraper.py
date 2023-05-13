import time

import pandas as pd
from selenium import webdriver
from selenium.webdriver import Firefox
from selenium.webdriver.firefox.service import Service
from selenium.webdriver.common.by import By
from webdriver_manager.firefox import GeckoDriverManager


def scrape_allaBostäder():
    options = webdriver.FirefoxOptions()
    options.add_argument("--window-size=1920,1200")
    options.add_argument("--disable-extensions")
    options.add_argument("--proxy-server='direct://'")
    options.add_argument("--proxy-bypass-list=*")
    options.add_argument("--start-maximized")
    options.page_load_strategy = 'none'

    path = GeckoDriverManager().install()
    service = Service(path)
    driver = Firefox(service=service, options=options)
    driver.implicitly_wait(5)

    driver.get("https://www.fastighetsbyran.com/sv/sverige/till-salu")
    time.sleep(5)

    # find the a element with the specified class overflow-hidden relative flex flex-wrap md:block"
    a_element = driver.find_element(
        By.CLASS_NAME, "overflow-hidden relative flex flex-wrap md:block")
    # get the href attribute
    print(a_element)


scrape_allaBostäder()
