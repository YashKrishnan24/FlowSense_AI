import requests
import json

url = "http://localhost:8000/api/analysis"
data = {
    # Using a sample UI screenshot from the internet to test the UX analysis prompt
    "image_url": "https://picsum.photos/400/600"
}

print(f"Sending request to {url}...")
try:
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        print("Response JSON:")
        print(json.dumps(response.json(), indent=2))
    else:
        print("Error Response:")
        print(response.text)
except Exception as e:
    print(f"Error: {e}")
