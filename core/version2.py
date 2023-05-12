import pandas as pd
import requests
from bs4 import BeautifulSoup

# This is hemnet.se base url and for every pages it adds the page number
base_url = "https://www.hemnet.se/bostader?location_ids%5B%5D=17753&item_types%5B%5D=villa&page="

# number of pages to scrape (Not inclusive, number + 1)
pages = list(map(str, range(1, 24)))

# empty list to append the values being scraped
records = []

# Define headers to make the request appear more like it is coming from a browser
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
}

for n in pages:
    # Create URL
    url = base_url + n

    r = requests.get(url, headers=headers)
    r.raise_for_status()

    # Create a soup object
    soup = BeautifulSoup(r.text, 'html.parser')

    # Every house information stored inside an HTML "li"
    containers = soup.find_all('li', attrs={'class': 'normal-results__hit js-normal-list-item'})

    # Looping through each HTML "li"
    for container in containers:
        primary_infos = container.find('div', attrs={'class': 'listing-card__attributes listing-card__attributes--primary'}).contents
        suplementary_infos = container.find('div', attrs={'class': 'listing-card__attribute listing-card__attribute--secondary listing-card__attribute--supplemental-area'})
        land_area = container.find('div', attrs={'class': 'listing-card__attribute listing-card__attribute--secondary listing-card__attribute--land-area'})

        if primary_infos is not None and len(primary_infos) == 7:
            if land_area is not None and len(land_area) == 1:
                if suplementary_infos is not None and len(suplementary_infos) == 1:
                    # Getting the values for address, city, pris, boarea, rum, tomt, and biarea
                    address = container.find('h2', attrs={'class': 'listing-card__address listing-card__address--normal'}).text[13:-1].strip()
                    city = container.find('div', attrs={'class': 'listing-card__attribute listing-card__location'}).text.strip()
                    pris = container.find('div', attrs={'class': 'listing-card__attributes listing-card__attributes--primary'}).contents[1].text[:-2].replace('\xa0', '').replace('fr.', '').replace('Pris sakn', '0').strip()
                    pris = int(pris)

                    boarea = primary_infos[3].text.replace(" m²", "").replace(",", ".")

                    rum = primary_infos[5].text.replace(" rum", "")

                    tomt = land_area.text.strip().replace(' m² tomt', '').replace('\xa0', "").replace(" ha tomt", "000").replace(",", "")

                    biarea = suplementary_infos.text.strip().replace(' m² biarea', '').replace(",", ".")

                    # Extract the image URL
                    image_url = container.find('img', attrs={'class': 'lazy'})['data-src']

                    # Append all the values to the empty record list
                    records.append((address, city, pris, boarea, rum, tomt, biarea, image_url))
            else:
                print("Information is not available!")

# Create a pandas DataFrame from the records list
df = pd.DataFrame(records, columns=['Address', 'City', 'Price', 'Area', 'Rooms', 'Land', 'Additional Area', 'Image URL'])

# Display the DataFrame
print(df)
