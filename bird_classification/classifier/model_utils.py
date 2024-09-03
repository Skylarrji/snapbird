from fastai.vision.all import load_learner, PILImage
import os

model_path = os.path.join(os.path.dirname(__file__), 'model/bird_predictor.pkl')
learn_inf = load_learner(model_path)

# takes the path of the image and utilizes the .pkl model to predict and return the bird_species
def predict_bird_species(image_path):
    bird_species, _, probs = learn_inf.predict(PILImage.create(image_path))
    return bird_species
