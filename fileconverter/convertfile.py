import requests

import os

api_key = os.getenv("tamarind_api") # this is the variable I names in my ./bashrc file for my api key

api_key = api_key
headers = {'x-api-key': api_key}
base_url = "https://app.tamarind.bio/api/"

jobName = "myJobName"

# UPLOAD SDF to Account
sdf_file = "samples_1.sdf"

local_filepath = f"/BIO-AI-HACK/fileconverter/sdf_files/{sdf_file}"
uploaded_filename = sdf_file
response = requests.put(f"{base_url}upload/{uploaded_filename}", headers=headers, data=open(local_filepath, 'rb'))
print("UPLOAD SDF to Account:", response.status_code)
# you can now use "file1.txt" as an input for your jobs


# SDF to SMILES
def get_smiles(sdfFile,jobName):
    params = {
    "jobName": jobName,
    "type": "file-converter",
    "settings": {
        "inputFileType": "sdf",
        "sdfFile": sdf_file
    }
    }
    response = requests.post(base_url + "submit-job", headers=headers, json=params)
    print(response.text)

get_smiles(sdf_file,jobName)

