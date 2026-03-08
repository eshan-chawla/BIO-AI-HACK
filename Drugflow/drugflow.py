import requests

api_key = "" #DELETEEEEEE BEFORE
headers = {'x-api-key': api_key}
base_url = "https://app.tamarind.bio/api/"



# upload file
local_filepath = "SO4_ideal.sdf"
uploaded_filename = "SO4_ideal.sdf"
response = requests.put(f"{base_url}upload/{uploaded_filename}", headers=headers, data=open(local_filepath, 'rb'))
print(response.status_code)
# you can now use "file1.txt" as an input for your jobs

# request job
params = {
  "jobName": "myJobName",
  "type": "drugflow",
  "settings": {
    "pdbFile": "6w70.pdb",
    "referenceLigandFile": "SO4_ideal.sdf",
    "numSamples": 5,
    "numBatches": 1,
    "distCutoff": 8
  }
}
response = requests.post(base_url + "submit-job", headers=headers, json=params)
print(response.text)

# get job result
jobName = "myJobName"
savePath = f"./{jobName}.zip"
params = {
    "jobName": jobName
}
response = requests.post(base_url + "result", headers=headers, json=params)
print(response.text)
if response.status_code == 200:
    results = requests.get(response.text.replace('"', ''))
    if results.status_code == 200:
        with open(savePath, 'wb') as file:
            file.write(results.content)