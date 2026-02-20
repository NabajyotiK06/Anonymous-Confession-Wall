# The Digital Confession Wall 👻

A modern, secure, and visually immersive platform for sharing anonymous secrets. Designed with a unique **"Digital Corkboard"** aesthetic, featuring extensive skeuomorphic elements, real-time reactions, and interactive analytics.

---

## 🌟 Features

*   **Anon-Digital Wall**: A beautifully textured, masonry-grid layout where confessions are pinned like sticky notes on a wall.
*   **Skeuomorphic Design**: Real-feel paper textures, tape effects, coffee stains, and glossy polaroids.
*   **Secure & Private**: Confessions are anonymous, but posting requires authentication to prevent span.
*   **Interactive Reactions**: Like, Love, and Laugh at confessions. Toggle reactions on/off.
*   **Corkboard Analytics**: Visual breakdown of community engagement using "hand-drawn" charts and stats.
*   **Pin & Unpin**: Smooth, physics-based animations when interacting with notes.

---

## 🛠️ Tech Stack

*   **Frontend**: React, Vite, Framer Motion, Recharts, Lucide React
*   **Backend**: Node.js, Express, MongoDB, Mongoose
*   **Auth**: Passport.js (Google OAuth)
*   **Styling**: Plain CSS (Advanced gradients & textures)

---

## 🚀 Getting Started

### Prerequisites

*   Node.js (v14+)
*   MongoDB Atlas URI
*   Google Cloud Console Project (for OAuth)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/anonymous-confession-wall.git
    cd anonymous-confession-wall
    ```

2.  **Backend Setup**
    ```bash
    cd backend
    npm install
    ```
    *   Create a `.env` file in `backend/` with:
        ```env
        MONGO_URI=your_mongodb_uri
        GOOGLE_CLIENT_ID=your_google_client_id
        GOOGLE_CLIENT_SECRET=your_google_client_secret
        SESSION_SECRET=your_session_secret
        CLIENT_URL=http://localhost:5173
        ```
    *   Start the server:
        ```bash
        npm start
        ```

3.  **Frontend Setup**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

4.  **Open the App**
    *   Visit `http://localhost:5173` to see the wall!

---

## 🎨 Visual Highlights

*   **Sticky Note Tally**: Total secrets displayed on a lined paper note.
*   **Napkin Charts**: Reaction distribution sketched on a coffee-stained napkin.
*   **Engagement Polaroid**: A glossy photo card tracking the "Buzz Score".
*   **Global Grain**: A film-grain overlay provided a retro, tangible feel.

---

## 👤 Author

**Nabajyoti Kalita**

_Built with ❤️ and a lot of CSS gradients._
