import os
import base64
import json
from django.core.files.storage import default_storage
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from pymongo import MongoClient
from .model_utils import predict_bird_species

# MongoDB configuration
client = MongoClient('mongodb://localhost:27017/')  # Adjust this URI if necessary
db = client['bird_classification_db']
collection = db['birds']

@csrf_exempt
def classify_bird(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        image_base64 = data.get('base64_uri')
        image_uri = data.get('image_uri')

        if not image_base64:
            return JsonResponse({'error': 'No image URI provided'}, status=400)

        try:
            # Decode the base64 string and save the image
            image_data = base64.b64decode(image_base64)
            image_path = os.path.join(default_storage.location, 'uploaded_image.jpg')
            with default_storage.open(image_path, 'wb+') as destination:
                destination.write(image_data)

            # Predict the bird species and convert it into title case
            species = predict_bird_species(image_path).title()

            # Insert into MongoDB
            result = collection.insert_one({
                'image': image_base64,
                'species': species
            })

            return JsonResponse({'species': species, 'inserted_id': str(result.inserted_id)})

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request'}, status=400)


def get_all_birds(request):
    if request.method == 'GET':
        try:
            birds = list(collection.find({}, {'_id': 0}))  # Exclude the '_id' field from the result
            return JsonResponse({'birds': birds}, safe=False)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request'}, status=400)
