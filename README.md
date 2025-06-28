# 👚 Closet 1821

Closet 1821 is a full-stack web app for renting and selling clothing. Users can sign up, post garments with multiple images, browse listings, filter by category, remove their own items, and notify sellers via email—all powered by AI-assisted categorization and GCP.

---

## Features

- **User Authentication**: Register & login with email + password (sessions stored server-side)  
- **Add Items**: Upload multiple images, set rent and/or buy prices  
  - **AI-Predicted Categories**: Vision API suggests top 3 categories (shirt, pants, dress, shorts, shoes, accessories) with manual override  
- **Edit & Delete**: Modify or remove your own listings in the Account page  
- **Browse & Filter**: Home page grid with category checkboxes (All, dress, shirt, shorts, pants, shoes, accessories)  
- **Sorted by Recency**: Newest listings appear first  
- **Detail Modal**: Click an item to open a Swiper.js image carousel and full details  
- **Notify Seller**: Send an email directly from the item modal  

---

## Tech Stack

- **Frontend**: React 18, React Router, Swiper.js, CSS-in-JS  
- **Backend**: Python 3.9+, Flask, Flask-Mail  
- **AI/Storage**: Google Cloud Vision API, Firebase Admin SDK, Firestore, Cloud Storage  
- **Containerization & Deployment**: Docker, Google Cloud Run  



