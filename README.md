# CCP Dashboard

A Critical Control Point (CCP) Monitoring Dashboard built with React, Vite, and Tailwind CSS.
It fetches data from a Google Sheet exposed via Google Apps Script.

## 🚀 Deployment & Setup (CRITICAL)

To make the dashboard work, you must deploy the Google Apps Script correctly.

### 1. Google Apps Script Setup
1.  Open your Google Sheet.
2.  Go to **Extensions > Apps Script**.
3.  Paste the code from `google_apps_script.js`.
4.  **Click Deploy > New Deployment**.
5.  **Select type**: Web App.
6.  **Configuration (IMPORTANT):**
    *   **Description**: `CCP API`
    *   **Execute as**: `Me` (your email address)
    *   **Who has access**: `Anyone` (NOT "Anyone with Google account")
7.  Click **Deploy**.
8.  Copy the **Web App URL**.

### 2. Connect Dashboard
1.  Open `src/services/api.js`.
2.  Paste the Web App URL into `API_URL`.
3.  Run `npm run dev`.

## ☁️ Deploy to Vercel

1.  **Push to GitHub**: Push this project to a GitHub repository.
2.  **Import in Vercel**:
    *   Go to Vercel Dashboard > **Add New...** > **Project**.
    *   Import your GitHub repository.
3.  **Configure Project**:
    *   **Framework Preset**: `Vite` (should be auto-detected).
    *   **Root Directory**: `.` (default).
    *   **Build Command**: `npm run build` (default).
    *   **Output Directory**: `dist` (default).
4.  **Click Deploy**.

The dashboard will be live in a few seconds!

## 🛠️ Project Structure
- `src/components/`: UI Components (KPICards, Filters, DataTable, Charts)
- `src/services/`: API integration
- `src/index.css`: Tailwind configuration and global styles
