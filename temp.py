import requests

api_key = "70f72262-788d-44d5-b1e7-fde753e70c51"
headers = {'x-api-key': api_key}
base_url = "https://app.tamarind.bio/api/"

response = requests.get(base_url + "files", headers=headers)
print(response.json())
