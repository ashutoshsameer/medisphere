import pandas as pd
import boto3
import json

s3_client = boto3.client('s3')
dynamo_client = boto3.client('dynamodb')

def lambda_handler(event, context):
    user_id = event['user']

    bucket_name = 's3-data-diabetes'
    result = s3_client.list_objects(Bucket=bucket_name, Prefix="", Delimiter='/')

    print(user_id)
    file_name = user_id + '/glucose-data-full'

    resp = s3_client.get_object(Bucket=bucket_name, Key=file_name)
    df = pd.read_csv(resp['Body'], sep='\t', header=None, names=['code', 'value'])


    hourly_stream = None

    response = dynamo_client.get_item(
        TableName='timestamp-memory',
        Key={
            'user_id': {
                'S': user_id,
            }
        },
        AttributesToGet=[
            'last_time',
        ]
    )

    start = response['Item']['last_time']['S']
    end = str(int(start) + 1)

    response = dynamo_client.put_item(
        TableName='timestamp-memory',
        Item={
            'user_id': {
                'S': user_id
            },
            'last_time': {
                'S': end
            }
        }
    )
    print(start, end)
    hourly_stream = df.loc[int(start)]
    print(len(hourly_stream))
    obj = {
        'code': hourly_stream[0],
        'value': hourly_stream[1]
    }
    print(obj)
    return obj