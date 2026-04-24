import requests, json
url='http://127.0.0.1:8000/ml'

print('1. Train...')
with open('../nsl_kdd_sample.csv', 'rb') as f:
    r = requests.post(url+'/upload-and-train', files={'file': f})
    print(r.status_code)
    try:
        print(json.dumps(r.json(), indent=2))
    except Exception as e:
        print(r.text)

print('\n2. Status...')
r = requests.get(url+'/status')
print(r.status_code)
print(r.json())

print('\n3. Classify...')
with open('../nsl_kdd_sample.csv', 'rb') as f:
    r = requests.post(url+'/classify', files={'file': f})
    print(r.status_code)
    try:
        d = r.json()
        print(f"Total: {d.get('total')}, Mal: {d.get('malicious')}, Normal: {d.get('normal')}")
    except Exception as e:
        print(r.text)
