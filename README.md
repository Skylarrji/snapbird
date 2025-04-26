# SnapBird 🐦

> **Note:** The commits to this repository are made using my school account (sji).

## Overview 📝
SnapBird is a mobile application that allows users to **capture and identify birds** through AI image classification. Users can upload photos, receive instant species identification, and save their discoveries into a personal bird-watching gallery.

The project utilizes **React Native**, **Django**, **MongoDB**, and **Fastai** to create a seamless bird tracking experience designed especially for younger audiences.

## Motivation 🚀
- **Skill Expansion:** I wanted to extend my prior experience with React into the mobile space using React Native.
- **AI:** I also wanted to gain hands-on experience fine-tuning and deploying AI models in a real-world application.
- **Personal Connection:** Finally, I wanted to build something meaningful for kids like my younger brother, who loves learning about birds but didn't have an easy way to track what he found.

## Technology Stack 🛠️
- **Frontend:** React Native
- **Backend:** Django
- **Database:** MongoDB 
- **AI Model:** Fastai 

## How It Works 🔍
1. Fine-tuned a **ResNet-18** model on 90k bird images using Fastai within a [Kaggle (Jupyter Notebook) environment](https://www.kaggle.com/code/skylarji/bird-species-classifier).
2. Developed a mobile app where users can either **upload or capture** bird images.
3. Images are converted into **Base64 encoded strings** and sent to a **Django backend** for prediction.
4. Identified bird species are returned to users, who can optionally **save** the bird's photo and identification to their personal gallery.
5. Data is stored persistently in **MongoDB**.

## Challenges Faced & Solutions ⚙️
- **Base64 Encoding Issue:**  
  Mobile device image URIs couldn't be directly sent to the backend.  
  **Solution:** Used the `FileReader` API to convert images into Base64 strings before uploading.

- **Mobile Network Timeout (Expo + Django):**  
  Mobile devices could not reach localhost during POST requests.  
  **Solution:** Identified CORS issues and used **ngrok tunnels** to create public API endpoints accessible from mobile.

- **Ngrok Browser Warning:**  
  Encountered 500 errors from ngrok's browser warning page.  
  **Solution:** After troubleshooting CORS headers, resolved by setting `ngrok-skip-browser-warning: "any"`.

- **Expo Tunnel Connection Issues:**  
  Network response timeouts when starting the app via Expo.  
  **Solution:** Researched and identified it as a firewall issue; used **Expo's tunnel** mode to bypass it.

## Future Improvements 🔧
- **Authentication:** Implement authentication so that bird galleries are personal rather than global.
- **Model Self-Improvement:** Allow users to **suggest corrections** if a bird is misidentified, helping fine-tune the model further over time.

## Demo 📱
- Quick video walkthrough:  
  [YouTube Demo](https://youtu.be/g-3ZH1iJDhc)

## Installation 📋

### Prerequisites
- Node.js and npm or yarn
- Python and pip
- MongoDB
- ngrok

### Setup

Clone the repository:
```bash
git clone https://github.com/Skylarrji/bird-tracker.git
cd bird-tracker
```

Run the following in four terminals:

Terminal #1 (Frontend)
```bash
cd bird_frontend
yarn  # or npm install
npx expo start -c --tunnel
```

Terminal #2 (Backend)
```bash
python3 -m venv .venv
source .venv/bin/activate
cd bird_classification
python manage.py runserver 0.0.0.0:8000
```

Terminal #3 (ngrok Tunnel)
```bash
ngrok http 8000
```

Copy the generated ngrok URL and replace the ngrokLink variables inside the following files:
	•	`bird_frontend/app/(tabs)/index.tsx`
	•	`bird_frontend/app/(tabs)/profile.tsx`

 Terminal #4 (MongoDB)
 ```bash
sudo service mongod start
mongo
use bird_classification_db
db.createCollection("birds")
 ```

## Running the App
- Mobile: Install the Expo Go app and scan the QR code
- Desktop: Open `localhost:8081`

## Project Status 🚧
Currently in active development!
Upcoming features include user authentication, correction feedback, and potential model retraining based on user input.

