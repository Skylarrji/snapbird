import os
import base64
import json
from django.core.files.storage import default_storage
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from pymongo import MongoClient
from .model_utils import predict_bird_species

# MongoDB configuration
client = MongoClient('mongodb://localhost:27017/') 
db = client['bird_classification_db']
collection = db['birds']


# POST /classify takes in an image_uri in base64 format in the request body and returns a json object with the species
#   identified in addition to adding it to the database if the value passed into submit_bird is true
@csrf_exempt
def classify_bird(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        image_base64 = data.get('base64_uri')
        image_uri = data.get('image_uri')
        submit_bird = data.get('submit_bird')

        if not image_base64:
            return JsonResponse({'error': 'No image URI provided'}, status=400)

        try:
            # decode the base64 string and save the image
            image_data = base64.b64decode(image_base64)
            image_path = os.path.join(default_storage.location, 'uploaded_image.jpg') # temporary location for the image
            with default_storage.open(image_path, 'wb+') as destination: # write the decoded base64 image to the location
                destination.write(image_data)

            # predict the bird species and convert it into title case
            species = predict_bird_species(image_path).title()

            if submit_bird:
                # insert into MongoDB
                result = collection.insert_one({
                    'image': image_uri,
                    'species': species
                })

            return JsonResponse({'species': species})
            
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request'}, status=400)


# GET /birds returns the image_uris and names of all the birds in the MongoDB database
def get_all_birds(request):
    if request.method == 'GET':
        try:
            birds = list(collection.find({}, {'_id': 0}))  # exclude the _id field from the result
            return JsonResponse({'birds': birds}, safe=False)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request'}, status=400)
