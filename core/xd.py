import pandas as pd
import requests
from bs4 import BeautifulSoup

base_url = "https://www.hemnet.se/bostader?location_ids%5B%5D=17884&page="


pages = list(map(str, range(1, 8)))

url = base_url + pages[0]
records = []

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
}

for n in pages:
    create_url = base_url + n
    r = requests.get(create_url, headers=headers)
    r.raise_for_status()

    soup = BeautifulSoup(r.text, 'html.parser')

    containers = soup.find_all(
        'li', attrs={'class': 'normal-results__hit js-normal-list-item'})

    for container in containers:
        # Get href from every li element
        href = container.find('a', href=True)['href']
        print(href)
    count = 0
    for container in containers:
        primary_infos = container.find(
            'div', class_=['listing-card__attribute', 'listing-card__attribute--primary'])

        if primary_infos is not None:
            print("Found a listing!")
            address = container.find(
                'h2', class_='listing-card__street-address').text.strip()
            city = container.find(
                'span', class_='listing-card__location-name').text.strip()
            pris = primary_infos.text.strip().replace('kr', '').replace(' ', '')
            boarea = primary_infos.find_next_sibling('div', class_=[
                                                     'listing-card__attribute', 'listing-card__attribute--primary']).text.strip()
            rum = primary_infos.find_next_sibling('div', class_=['listing-card__attribute', 'listing-card__attribute--primary']).find_next_sibling(
                'div', class_=['listing-card__attribute', 'listing-card__attribute--primary']).text.strip()
            # The image is in the class js-lazy-load listing-card__image listing-card__image--big, and i want the src url and no blank.gif
            image_url = container.find('img', class_=[
                                       'js-lazy-load', 'listing-card__image', 'listing-card__image--big'])['data-src']

            records.append((address, city, pris, boarea, rum, image_url))

            count += 1

            if count == 10:
                break

hemnet_df = pd.DataFrame(
    records, columns=['address', 'city', 'pris', 'boarea', 'rum', 'image_url'])
hemnet_df.head()

hemnet_df.to_json('hemnet.json', orient='records')
