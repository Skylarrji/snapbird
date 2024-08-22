import os
import base64
import json
from django.core.files.storage import default_storage
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .model_utils import predict_bird_species

@csrf_exempt
def classify_bird(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        image_base64 = data.get('image_uri')

        if not image_base64:
            return JsonResponse({'error': 'No image URI provided'}, status=400)

        try:
            # Decode the base64 string and save the image
            image_data = base64.b64decode(image_base64)
            image_path = os.path.join(default_storage.location, 'uploaded_image.jpg')
            with default_storage.open(image_path, 'wb+') as destination:
                destination.write(image_data)

            # Predict the bird species
            species = predict_bird_species(image_path)
            return JsonResponse({'species': species})

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request'}, status=400)
