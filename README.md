# Modern Blog Application

A production-ready, SEO-optimized blogging platform built with React, Firebase, and Bootstrap 5.

## Features

- **Authentication:** Google Login/Logout with Firebase Auth.
- **Admin Dashboard:** Full CRUD (Create, Read, Update, Delete) for blog posts.
- **Rich Text Editor:** Powered by React Quill for beautiful content creation.
- **Image Upload:** Integrated with Firebase Storage for cover images.
- **SEO Optimized:** Dynamic meta tags, Open Graph, and Twitter Cards using React Helmet.
- **Responsive Design:** Mobile-first approach using Bootstrap 5.
- **AdSense Ready:** Dedicated slots for Google Ads.
- **Search & Category:** Easy content discovery for readers.
- **Performance:** Code splitting, lazy loading, and skeleton loaders.

## Tech Stack

- **Frontend:** React.js (Vite)
- **Styling:** Bootstrap 5 (CDN)
- **Backend:** Firebase (Auth, Firestore, Storage, Analytics)
- **Icons:** Lucide React
- **Rich Text:** React Quill
- **SEO:** React Helmet Async

## Getting Started

### 1. Prerequisites
- Node.js (v18+)
- Firebase Account

### 2. Installation
```bash
npm install
```

### 3. Firebase Setup
1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/).
2. Enable **Authentication** and activate **Google** as a sign-in provider.
3. Enable **Firestore Database** in production or test mode.
4. Enable **Storage**.
5. Add a Web App to your project and copy the configuration.

### 4. Environment Variables
Create a `.env` file in the root directory and add your Firebase credentials:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_ADMIN_EMAIL=your-email@gmail.com
```

### 5. Running Locally
```bash
npm run dev
```

## Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel.
2. Add the environment variables from your `.env` file in the Vercel project settings.
3. Deploy!

## SEO & Ads

- **SEO:** Update `public/robots.txt` and `public/sitemap.xml` with your actual domain.
- **Ads:** Replace the placeholder client and slot IDs in `src/components/ads/AdBanner.jsx` with your Google AdSense details.

## License
MIT
