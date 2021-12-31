import boto3
import pandas as pd

s3_client = boto3.client('s3')

def lambda_handler(event, context):
    bucket_name = 's3-data-diabetes'
    user_id = event['user_id']
    from_time = event['from']
    to_time = event['to']

    file_name = user_id + '/stream-data'

    resp = s3_client.get_object(Bucket=bucket_name, Key=file_name)
    df = pd.read_csv(resp['Body'], sep='\t', header=None, names=['date_time', 'code', 'value'], index_col=['date_time'])
    glucose_codes = [48, 56, 57, 58, 59, 60, 61, 62, 63, 64]
    datacodes = sorted(df['code'].unique())
    l = pd.DataFrame()

    for c in glucose_codes:
        if c in datacodes:
            l = l.append(df.loc[df['code'] == c])

    datetimes_list = l.sort_index()['value'].loc[from_time:to_time].index.tolist()
    glucose_values_list = l.sort_index()['value'].loc[from_time:to_time].tolist()
    print(len(datetimes_list), len(glucose_values_list))

    rv = []
    for i in range(len(datetimes_list)):
        pair = {}
        pair['time'] = str(datetimes_list[i])
        pair['value'] = glucose_values_list[i]
        rv.append(pair)

    return rv