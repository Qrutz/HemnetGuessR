import json


def handler(event, context):
    print('received event:')
    print(event)

    property_data = {
        "price": 3495000,
        "listingurl": "https://www.hemnet.se/bostad/fritidsboende-3rum-almasa-malmo-kommun-blaklintsgatan-28-19973941",
        "name": "Rullstensvägen 25C",
        "bostadstyp": "Villa",
        "location": "Sandared, Borås kommun",
        "rooms": 1,
        "size": 40,
        "buildingYear": 1963,
        "images": [
            "https://bilder.hemnet.se/images/itemgallery_cut/8c/04/8c0437b118aeaae6c83ecbe290931a08.jpg",
            "https://bilder.hemnet.se/images/1024x/f8/73/f8730aa235d05aba0a2f342a3c7c3dee.jpg",
            "https://bilder.hemnet.se/images/1024x/9a/f6/9af6bc0e65b391d66422d234ed834f71.jpg",
            "https://bilder.hemnet.se/images/1024x/6c/5b/6c5b8febf5dd2fa6dd1c7ba5059d0dff.jpg",
            "https://bilder.hemnet.se/images/1024x/3a/f9/3af9c4814db4eeccffe79a35d76a75f7.jpg",
            "https://bilder.hemnet.se/images/1024x/e6/ab/e6abf9b700ee995244f75f10f9de9210.jpg"
        ]
    }

    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
        'body': property_data
    }
