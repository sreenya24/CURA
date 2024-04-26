from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import os
import numpy as np

from flask_cors import CORS


app = Flask(__name__)
CORS(app)

@app.route('/process-image', methods=['POST'])
def process_image():
    file = request.files['image']
    filename = secure_filename(file.filename)
    file_path = os.path.join('./data/', filename)
    file.save(file_path)

    # return the average pixel value of the image
    # img = cv2.imread(file_path)
    #avg_pixel_value = np.mean(img)


    # Placeholder for image processing
    result = {'status': 'Image processed', 'details': 'Details of processing'}

    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
