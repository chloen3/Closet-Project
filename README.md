# 👚 Closet 1821

**Closet 1821** is a full-stack web app for students to rent or sell clothing on campus. Users can create accounts, upload garments with multiple images, browse and filter listings, and notify sellers—all powered by Google Cloud and AI-assisted image tagging.

---

## ✨ Features

- **🔐 User Authentication**  
  Register and log in with email and password (session-based login)

- **📸 Add Items**  
  Upload multiple images and set rent and/or buy prices

- **🧠 AI-Powered Categorization**  
  Google Cloud Vision API suggests top 3 categories (e.g., shirt, dress, pants), with the ability to override

- **🧹 Manage Listings**  
  Edit or delete your own posts on the Account page

- **🛍️ Browse & Filter**  
  Homepage grid view with category checkboxes  
  (`All`, `Dress`, `Shirt`, `Shorts`, `Pants`, `Shoes`, `Accessories`)

- **🕒 Sorted by Recency**  
  Newest listings appear first

- **🔍 Item Detail Modal**  
  Swiper.js carousel with full item details

- **📧 Notify Seller**  
  Email the seller directly through the item modal

---

## 🛠 Tech Stack

**Frontend**  
- React 18 + TypeScript  
- React Router v6  
- Swiper.js for carousels  
- CSS-in-JS styling  

**Backend**  
- Python 3.9+  
- Flask (REST API, mail support)  
- Flask-Mail for email notifications  

**Cloud & AI**  
- Google Cloud Vision API (image classification)  
- Firebase Admin SDK  
- Firestore (NoSQL DB)  
- Google Cloud Storage (image hosting)  

**Deployment**  
- Docker (multi-stage build)  
- Google Cloud Run (serverless deployment)  

---


🌐 [Website](https://closet1821.com)  

---


