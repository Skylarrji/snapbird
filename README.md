# SnapBird 🐦

> Note: The commits to this repository are made using my school account (sji).

# Purpose 📝
Have you ever spotted a bird and wished you could identify it with just a click? SnapBird makes it possible! This app allows users to upload photos of birds, identify them instantly, and explore a gallery of past identifications—all in an intuitive and user-friendly interface.

# Features 🖋️
- **Bird Image Classification System:** Easily upload photos of birds directly from your device and recieve instant identification of the bird's common name from a powerful AI model. 
- **Bird Gallery:** Keep track of all the birds and their corresponding species you've identified in the past, stored in a MongoDB database
- **Interface:** A clean, responsive, and user-friendly interface designed for seamless interaction on both mobile and desktop platforms. The interface is optimized for quick access to all features, making bird identification fun and effortless

# Technologies Used 🛠️
- **Frontend:** React Native
- **Backend:** Django
- **Database:** MongoDB
- **AI Model:** A ResNet-18 model fine-tuned using Fastai based off of the `Birds 525 Species - Image Classification` dataset. The Kaggle project (a wrapper for Jupyter Notebook) for the fine-tuned model is linked here: https://www.kaggle.com/code/skylarji/bird-species-classifier

# Installation 📋
Make sure you have the following installed:
- Node.js and npm or yarn
- Python and pip
- MongoDB
- ngrok

To run SnapBird locally, first, clone this repository by running the following commands:
- `git clone https://github.com/Skylarrji/bird-tracker.git`
- `cd bird-tracker`

Then, open the cloned repository on VSCode and open four terminals:

### Terminal #1 (Frontend)
Enter the following commands:
- `cd bird_frontend`
- `yarn` (or `npm i`)
- `npx expo start -c --tunnel` 

### Terminal #2 (Backend)
Enter the following commands:
- `python3 -m venv .venv`
- `source .venv/bin/activate` 
- `cd bird_classification` 
- `python manage.py runserver 0.0.0.0:8000`

### Terminal #3 (ngrok server)
Enter the following commands:
- `ngrok http 8000`
> This should generate a url similar to "https://5767-65-93-22-248.ngrok-free.app"; replace the URLs assigned to the `ngrokLink` variables in `bird_frontend/app/(tabs)/index.tsx` and `bird_frontend/app/(tabs)/profile.tsx` with the URL generated

### Terminal #4 (MongoDB)
Enter the following commands:
- `sudo service mongod start`
- `mongo`
- `use bird_classification_db`
- `db.createCollection("birds")`

# Usage 💻
## Mobile
1. Download the Expo Go app on your device
2. Scan the QR code generated after running the final command in **terminal #1** to launch the app

## Desktop
1. Open `localhost:8081` to view the application

# Project Status 🚧
This project is currently in development, so stay tuned for new features!
