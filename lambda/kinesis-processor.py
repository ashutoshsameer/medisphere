from __future__ import print_function

import pandas as pd
import base64
# import msgpack
import json
import boto3
import re

print('Loading function')
s3_client = boto3.client('s3')
bucket_name = 's3-data-diabetes'


def lambda_handler(event, context):
  output = []

  for record in event['records']:
    payload = json.loads(base64.b64decode(record['data']).decode('utf-8'))#msgpack.unpackb(base64.b64decode(record['data']), raw=False)
    print(payload)
    user_id = payload['username']
    code = payload['code']
    value = payload['value']
    time = payload['time']

    file_name = user_id + '/stream-data'

    exists = False
    response = s3_client.list_objects_v2(
        Bucket=bucket_name,
        Prefix=file_name,
    )
    for obj in response.get('Contents', []):
      if obj['Key'] == file_name:
        exists = True
        break

    hourly_stream = pd.DataFrame(columns=['date_time', 'code', 'value'])
    hourly_stream.at[0, 'date_time'] = time
    hourly_stream.at[0, 'code'] = code
    hourly_stream.at[0, 'value'] = value
    hourly_stream = hourly_stream.set_index('date_time')

    if not exists:
      a = hourly_stream.to_string()
      body = re.sub('  +', '\t', a.split('\n')[2])
      # body = a.split('\n')[2].replace('    ', '\t')
    else:
      resp2 = s3_client.get_object(Bucket=bucket_name, Key=file_name)
      df_stream = pd.read_csv(resp2['Body'], sep='\t', header=None, names=['date_time', 'code', 'value'], index_col=['date_time'])

      df_stream = df_stream.append(hourly_stream)
      a = pd.DataFrame(df_stream.head(len(df_stream))).to_string()
      body = '\n'.join([re.sub('   +', '\t', x) for x in a.split('\n')][2:])

    s3_client.put_object(Body=body, Bucket=bucket_name, Key=file_name)

    # Do custom processing on the payload here
    output_record = {
       'recordId': record['recordId'],
       'result': 'Ok',
       'data': base64.b64encode(json.dumps(payload).encode('utf-8') + b'\n').decode('utf-8')
    }
    output.append(output_record)

  print('Successfully processed {} records.'.format(len(event['records'])))
  return {'records': output}