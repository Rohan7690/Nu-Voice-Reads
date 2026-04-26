# NuVoice Reads

NuVoice Reads is a modern, premium reading platform built for authors and readers to explore, create, and monetize stories. Designed with a high-end cinematic aesthetic, the platform offers a seamless reading experience with advanced features like dynamic reading time, secure authentication, and integrated payments.

## 🚀 Features

### 🔐 Authentication & Security
*   **Secure Auth**: Full Signup and Login system using JWT (JSON Web Tokens) and bcrypt password hashing.
*   **Silent Refresh**: Implemented **Refresh Token** logic with HTTP-Only cookies to keep users logged in securely without session timeouts.
*   **Protected Access**: Granular middleware to protect author dashboards and premium reading areas.

### ✍️ Content Creation (Story System)
*   **Rich Text Editor**: A custom-built editor (Quill) allowing for professional formatting, blockquotes, and code snippets.
*   **Cloudinary Integration**: Automatic image hosting. When you upload a cover or insert an image into an article, it is instantly hosted on Cloudinary to keep the database light.
*   **Publishing Workflow**: Authors can create and edit their stories with ease.

### 💰 Monetization & Premium Access
*   **Razorpay Integration**: Fully functional payment gateway for purchasing premium access.
*   **Content Locking**: Sophisticated "Paywall" logic that automatically locks and masks premium stories for non-subscribers.
*   **Payment Tracking**: Real-time storage of subscription status in the database.

### 🔍 Discovery & Reading Experience
*   **Advanced Search**: High-performance search bar using MongoDB Regex to find stories by title or description.
*   **Smart Sorting**: Toggle between "Latest First" and "Oldest First" to explore the feed.
*   **Pagination**: Optimized API to load stories in chunks, ensuring fast performance even with hundreds of articles.
*   **Dynamic Reading Time**: Automatically calculates and displays the estimated reading time (e.g., "7 min read") based on word count.

### 🎨 Design & UX
*   **Premium Aesthetic**: A cinematic dark-mode interface built with **Tailwind CSS**, featuring glassmorphism and smooth transitions.
*   **Modern Typography**: Switched from default serif fonts to a modern sans-serif stack for improved UI consistency.
*   **Mobile Responsive**: Fully optimized for a seamless reading experience across mobile, tablet, and desktop.
*   **Image Fallbacks**: Robust gradient-based fallbacks for stories without cover images.

## 🛠 Tech Stack
*   **Frontend**: Next.js (App Router), Tailwind CSS, Lucide Icons.
*   **Backend**: Node.js, Express.js.
*   **Database**: MongoDB (Mongoose ODM).
*   **Payments**: Razorpay API.
*   **Storage**: Cloudinary API.

## 🏁 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/nu-voice-reads.git
cd nu-voice-reads
```

### 2. Backend Setup
```bash
cd backend
npm install
# Create a .env file with:
# MONGODB_URI=your_mongodb_uri
# JWT_SECRET=your_jwt_secret
# REFRESH_SECRET=your_refresh_secret
# RAZORPAY_KEY_ID=your_key
# RAZORPAY_KEY_SECRET=your_secret
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
# Create a .env.local file with:
# NEXT_PUBLIC_API_URL=http://localhost:5000
# NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_name
# NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_preset
# NEXT_PUBLIC_RAZORPAY_KEY_ID=your_key
npm run dev
```

### 4. Seed Data (Optional)
To populate the app with high-quality demo stories:
```bash
cd backend
npm run seed
```

---
*Created as part of the NuVoice Final Round Assignment.*
