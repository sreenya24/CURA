from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import json
import pathlib
import csv
from datetime import datetime
from fastai.vision.all import *

plt = platform.system()
if plt == "Linux":
    pathlib.WindowsPath = pathlib.PosixPath

try:
    learn = load_learner("export.pkl")
    labels = learn.dls.vocab
except Exception as e:
    print("Error loading model: {e}")

import base64
import numpy as np
import cv2
from PIL import Image as PILImage

import io


app = Flask(__name__)
CORS(app) 

def model_run(image_path):
    image = cv2.imread(image_path)

    pred, pred_idx, probs = learn.predict(image)
    return {labels[i]: float(probs[i]) for i in range(len(labels))}


@app.route('/recommend', methods=['POST'])
def recommend():
    result = request.json["result"]
    if (len(result.keys() )==0):
        return jsonify({})
    print(result)
    print(type(result))
    acne = result["acne"]*100
    blemishes = result["blemishes"]*100
    lips = result["lips"]*100
    dryness = result["dryness"]*100
    darkCircles = result["darkCircles"]*100



    acne = 1 if acne > 0.3 else 0
    blemishes = 1 if blemishes > 0.3 else 0
    lips = 1 if lips > 0.3 else 0
    dryness = 1 if dryness > 0.3 else 0
    darkCircles = 1 if darkCircles > 0.3 else 0

    ingredients = {'acne': ['Salicylic Acid', 'Benzoyl Peroxide', 'Retinoids', 'Tea Tree Oil', 'Azelaic Acid'],
                   'blemishes': ['Salicylic Acid', 'Benzoyl Peroxide', 'Retinoids', 'Tea Tree Oil', 'Azelaic Acid'],
                   'lips': ['Petroleum Jelly', 'Beeswax', 'Shea Butter', 'Coconut Oil', 'Olive Oil'],
                   'dryness': ['Hyaluronic Acid', 'Glycerin', 'Lactic Acid', 'Urea', 'Ceramides'],
                   'darkCircles': ['Vitamin C', 'Retinoids', 'Hyaluronic Acid', 'Kojic Acid', 'Licorice Extract']}

    sephora = csv.DictReader(open('./Product Database/cosmetic_p.csv'))
   
    acne_products = []
    blemishes_products = []
    lips_products = []
    dryness_products = []
    darkCircles_products = []

    for row in sephora:
        if acne == 1:
            if any(ingredient in row['ingredients'] for ingredient in ingredients['acne']):
                print(row)
                acne_products.append(list(row.values()))
        if blemishes == 1:
            if any(ingredient in row['ingredients'] for ingredient in ingredients['blemishes']):
                blemishes_products.append(list(row.values()))
        if lips == 1:
            if any(ingredient in row['ingredients'] for ingredient in ingredients['lips']):
                lips_products.append(list(row.values()))
        if dryness == 1:
            if any(ingredient in row['ingredients'] for ingredient in ingredients['dryness']):
                dryness_products.append(list(row.values()))
        if darkCircles == 1:
            if any(ingredient in row['ingredients'] for ingredient in ingredients['darkCircles']):
                darkCircles_products.append(list(row.values()))

    # sort it with the highest rank 
    # print(acne_products)
    # print(acne_products[0])
    # print(len(acne_products))
    acne_products = sorted(acne_products, key=lambda x: x[4], reverse=True)[:3]
    blemishes_products = sorted(blemishes_products, key=lambda x: x[4], reverse=True)[:3]
    lips_products = sorted(lips_products, key=lambda x: x[4], reverse=True)[:3]
    dryness_products = sorted(dryness_products, key=lambda x: x[4], reverse=True)[:3]
    darkCircles_products = sorted(darkCircles_products, key=lambda x: x[4], reverse=True)[:3]

    acne_products = [[row[0], row[2], row[3], row[4]] for row in acne_products]
    blemishes_products = [[row[0], row[2], row[3], row[4]] for row in blemishes_products]
    lips_products = [[row[0], row[2], row[3], row[4]] for row in lips_products]
    dryness_products = [[row[0], row[2], row[3], row[4]] for row in dryness_products]
    darkCircles_products = [[row[0], row[2], row[3], row[4]] for row in darkCircles_products]


    result = {'acne': acne_products, 'blemishes': blemishes_products, 'lips': lips_products, 'dryness': dryness_products, 'darkCircles': darkCircles_products}
    # append to the result csv
    print(result)
    return jsonify(result)


@app.route('/process-image', methods=['POST'])
def process_image():

    image_base64 = request.json["image_data"] 
    
    image_data = base64.b64decode(image_base64)

    x = io.BytesIO(image_data)

    image = PILImage.open(x)
    image.save('image.png')



    
    result = model_run('image.png')
    temp = json.dumps({'acne': result['Acne'], 'blemishes':result['Blemishes'], 'lips': result['Chapped Lips']
                       , 'dryness': result['Dryness'], 'darkCircles': result['Dark Circles']})
    
    with open('./tracking data/logs.csv', 'a', newline='') as file:
        writer = csv.writer(file)
        # append the datatime, and result
        writer.writerow([datetime.now(), temp])
    return temp

if __name__ == '__main__':
    app.run(debug=True)  