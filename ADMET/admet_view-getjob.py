import os, zipfile

api_key = os.getenv("tamarind_api")

import requests

api_key = api_key
headers = {'x-api-key': api_key}
base_url = "https://app.tamarind.bio/api/"

# VIEW THE JOB
params = {
}
response = requests.get(base_url + "jobs", headers=headers, params=params)
print(response.json())

# make sure directory is not over written if exists
def unique_job_folder(base_dir, job_name):
    folder = os.path.join(base_dir, job_name)
    if not os.path.exists(folder):
        return folder

    i = 1
    while True:
        new_folder = os.path.join(base_dir, f"{job_name}{i}")
        if not os.path.exists(new_folder):
            return new_folder
        i += 1



# GET RESULTS
jobName = "myJobName" # add job name here

base_results_dir = os.path.join(".", "ADMET", "results")

save_folder = unique_job_folder(base_results_dir, jobName)
os.makedirs(save_folder, exist_ok=True)

folder_name = os.path.basename(save_folder)
zip_path = os.path.join(save_folder, f"{folder_name}.zip")


params = {
    "jobName": jobName
}

response = requests.post(base_url + "result", headers=headers, json=params)
print(response.text)
if response.status_code == 200:
    results = requests.get(response.text.replace('"', ''))
    if results.status_code == 200:
        with open(zip_path, 'wb') as file:
            file.write(results.content)

with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(save_folder)

print("Unzipped contents to:", save_folder)

            