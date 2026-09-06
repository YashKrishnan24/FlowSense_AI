# FlowSense AI

🌍 **Live Demo:** [https://flowsense-frontend-18uu.onrender.com](https://flowsense-frontend-18uu.onrender.com)

An intelligent, full-stack application that provides instant, AI-driven User Experience (UX) audits for any interface. Just upload a screenshot of your website, app, or mockup, and FlowSense will analyze its design patterns, accessibility, and visual hierarchy to give you actionable feedback.

## 🚀 What it does

Designing great interfaces is hard. FlowSense acts as your personal UX researcher and design critic. By leveraging advanced Vision AI, it looks at your design the way a human would and breaks down what works, what doesn't, and exactly how you can improve it. 

Whether you're a developer trying to polish a side project or a designer validating a wireframe, FlowSense gives you a comprehensive score, a heatmap-style breakdown of specific UI elements, and downloadable PDF reports.

## 🛠️ Tech Stack

This project is separated into a modern frontend architecture and a lightweight, AI-focused backend.

**Frontend (Next.js)**
* **Framework:** Next.js (App Router) & React
* **Styling:** Tailwind CSS & Framer Motion for smooth, dynamic animations
* **Authentication:** Clerk
* **Database & ORM:** PostgreSQL managed via Prisma
* **Hosting:** Render

**Backend (Python)**
* **Framework:** FastAPI
* **AI Engine:** Google Gemini Pro Vision API
* **Image Processing:** Pillow & Cloudinary
* **Hosting:** Render

## 💡 Key Features

* **Instant UX Analysis:** Get immediate feedback on layout, typography, accessibility, and color theory.
* **Smart Scoring System:** Interfaces are graded on a 100-point scale with visual, animated score rings.
* **Component-Level Breakdown:** The AI identifies specific areas of your UI (like navbars or hero sections) and provides targeted recommendations.
* **History & Audit Logs:** Securely save your past audits to your account and track improvements over time.
* **PDF Export:** Generate clean, professional PDF reports of your audits to share with clients or team members.

## 🏃‍♂️ Running it Locally

If you want to spin this up on your own machine, you'll need two terminal windows running simultaneously.

### 1. The Python Backend
Navigate into the backend folder, set up your virtual environment, and install the dependencies:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt
```
Make sure you have your `.env` file set up with your Gemini API key, then start the server:
```bash
uvicorn main:app --reload --port 8000
```

### 2. The Next.js Frontend
In a new terminal, navigate to the frontend folder and install the NPM packages:
```bash
cd frontend
npm install
```
Set up your `.env` file with your Clerk, Prisma, and API keys. Then, generate your database client and start the dev server:
```bash
npx prisma generate
npm run dev
```

The app will be running at `http://localhost:3000`.

## 🤝 Contributing

This was built as a passion project to explore the intersection of AI and design. If you have ideas for new features, better prompts for the AI, or UI improvements, feel free to fork the repository and open a pull request!
