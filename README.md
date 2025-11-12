# Medic Planner AI

**Heaven Solutions Hackathon Project**

Medic Planner AI is a web application designed to automatically schedule patients based on the severity of their health risks and the specific medical specialty of the doctor. By leveraging AI, the system prioritizes appointments efficiently, ensuring high-risk patients receive timely care.

---

## Features

- **Automatic Scheduling:** Assigns patients to appointment slots based on health risk assessment.
- **Risk Assessment:** Uses AI models to evaluate the severity of health conditions.
- **Doctor Specialty Matching:** Schedules patients according to relevant doctor expertise.
- **User Management:** Login, profile management, and role-based access.
- **Two Separate APIs:**
  - **AI & Planner API:** Handles risk evaluation and scheduling algorithm.
  - **Core Components API:** Manages authentication, user profiles, and other core functionalities.

---

## Tech Stack

- **Backend:** Python, FastAPI  
- **Frontend:** TypeScript, React  
- **AI Models:** PyTorch  
- **Database:** MongoDB  
- **APIs:** 
  - Planner & AI communication API
  - Core components API (authentication, user management)

---

## Environment Variables

Before running the application, you need to create `.env` files in the following directories:  

### Backend

1. `backend/api/core/.env`  
2. `backend/api/classifierAPI/.env`  

Each `.env` file should contain:  

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_ALGORITHM=HS256
```

### Frontend

1. `frontend/.env`  

Store the API URLs:

```env
REACT_APP_CORE_API_URL=http://localhost:8000
REACT_APP_AI_API_URL=http://localhost:8001
```

> **Note:** Replace the URLs with your deployed API endpoints if needed.

---

## Installation

1. Clone the repository
2. Backend setup:
   
```bash
cd backend
# Install dependencies
pip install -r requirements.txt
# Run the Core API
uvicorn api.core.main:app --reload --port 8000
# Run the AI & Planner API
uvicorn api.classifierAPI.main:app --reload --port 8001
```

3. Frontend setup:

```bash
cd frontend
# Install dependencies
npm install
# Run the React app
npm start
```

---

## Usage

1. Open the web app in your browser (`http://localhost:3000` by default).  
2. Log in or create an account.  
3. Enter patient information and let the AI schedule appointments automatically based on risk levels.  
4. Doctors can view and manage their patient schedules.  

---

## Project Structure

```
/backend
  ├─ api/core/             # API for login, profile, and core features
  ├─ api/classifierAPI/    # API for AI models and scheduling
/frontend
  ├─ src/                  # React frontend components
/ai                         # PyTorch models for risk assessment
```

---

## Architecture Diagram

```text
            +----------------+          +----------------+
            |   Frontend     | <------> |  Core API      |
            |  (React/TS)   |          | (User/Auth)    |
            +----------------+          +----------------+
                      |
                      v
            +----------------+
            |  AI & Planner  |
            |      API       |
            | (Risk & Schedule)
            +----------------+
                      |
                      v
                +-----------+
                |  AI Models |
                |  (PyTorch) |
                +-----------+
                      |
                      v
                  +--------+
                  | MongoDB |
                  +--------+
```

---

## Hackathon

Created for **Heaven Solutions Hackathon**.

