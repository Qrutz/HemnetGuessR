from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options

# Set up Selenium options
chrome_options = Options()
chrome_options.add_argument("--headless")  # Run Chrome in headless mode, without opening a browser window

# Set up the Selenium driver with the path to your chromedriver executable
selenium_service = Service('C:/Users/Batman/Projects/husjakt/TervsGame/chromedriver.exe')  # Replace 'path/to/chromedriver' with the actual path
driver = webdriver.Chrome(service=selenium_service, options=chrome_options)

# Navigate to the website
driver.get("https://www.hemnet.se/bostader?location_ids%5B%5D=17884")

# Find the <ul> element with the specified class
ul_element = driver.find_element(By.CLASS_NAME, "normal-results qa-organic-results")

# Find all <li> elements within the <ul> element
listing_elements = ul_element.find_elements("tag name", "li")

# Iterate over each listing element
for element in listing_elements:
    # Extract data from the listing element
    image_url = element.find_element(By.CLASS_NAME, "js-lazy-load listing-card__image listing-card__image--big").get_attribute("src")
    street_name = element.find_element(By.CLASS_NAME, "listing-card__street-address qa-listing-titlek").text
    city = element.find_element(By.CLASS_NAME, "listing-card__location-name").text
    #price = element.find_element("css selector", ".sold-property-listing__subheading").text
    #sqm = element.find_element("css selector", ".sold-property-listing__size").text

    # Print the extracted data for each listing
    print("Image URL:", image_url)
    print("Street Name:", street_name)
    print("City:", city)
    #print("Price:", price)
    #print("Square Meters:", sqm)
    print("---")

# Quit the Selenium driver
driver.quit()