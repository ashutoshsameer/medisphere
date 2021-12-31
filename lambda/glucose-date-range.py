import boto3
import pandas as pd

s3_client = boto3.client('s3')

def lambda_handler(event, context):
    bucket_name = 's3-data-diabetes'
    user_id = event['user_id']

    file_name = user_id + '/stream-data'

    resp = s3_client.get_object(Bucket=bucket_name, Key=file_name)
    df = pd.read_csv(resp['Body'], sep='\t', header=None, names=['date_time', 'code', 'value'], index_col=['date_time'])

    df_index = df.index
    print(df_index)

    return (df_index[0], df_index[-1])
