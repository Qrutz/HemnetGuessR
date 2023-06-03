import json
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('listings')


def handler(event, context):
    print('received event:')
    print(event)

    # get the first listing from the table
    response = table.scan(
        Limit=1
    )
    # Filter the Bilder column to only have 6 images
    bilder = response['Items'][0]['Bilder']
    total_images = len(bilder)
    step_size = max(total_images // 6, 1)
    filtered_images = bilder[0:total_images:step_size]
    response['Items'][0]['Bilder'] = filtered_images
    # parse the Pris column to an int, we gotta remove the whitespace and the kr and then parse it to an int
    response['Items'][0]['Pris'] = int(
        response['Items'][0]['Pris'].replace(" ", "").replace("kr", ""))

    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
        'body': json.dumps(response)
    }
