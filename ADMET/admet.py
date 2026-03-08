import os

api_key = os.getenv("tamarind_api")

import requests

api_key = api_key
headers = {'x-api-key': api_key}
base_url = "https://app.tamarind.bio/api/"



params = {
  "jobName": "myJobName",
  "type": "admet",
  "settings": {
    "smilesStrings": ['CC(=O)OC1=CC=CC=C1C(=O)O']
  }
}
response = requests.post(base_url + "submit-job", headers=headers, json=params)
print(response.text)
