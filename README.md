# AI-Powered Healthcare Platform

A comprehensive, AI-driven digital healthcare platform designed to bridge the gap between patients and doctors. This platform focuses on providing personalized, continuous, and proactive healthcare by integrating real-time AI assistance, specialized care modules, and seamless digital medical records.

## 🚀 Live Demo
- **Frontend (Vercel):** *Deployed via Vercel (URL configured via VITE_API_URL)*
- **Backend (Render):** *Deployed as a Node.js Web Service on Render*

**Demo Credentials (Patient Login):**
- **Email:** `anshumangarg5410@gmail.com`
- **Password:** `123456`

## Problem Statement
Current healthcare systems often suffer from:
- Lack of timely access to doctors and 24/7 guidance.
- Fragmented patient medical history.
- Generic prescriptions instead of personalized, context-aware care.
- Difficulties in tracking chronic conditions and ensuring medication adherence.
- Overlooked nuances in age-specific and women-centric health issues.

## Proposed Solution
A centralized ecosystem connecting patients, doctors, and pharmacies that offers:
- Secure, digital storage of continuous patient medical history.
- Seamless, chat-based doctor-patient interactions.
- Smart, verified prescriptions with built-in AI safety checks.
- Specialized health modules catering to different life stages and genders.
- Automated follow-ups and direct medicine ordering.

---

## 🚀 Product Development Status

### Phase 1: Project Foundation & Authentication
- [x] **Basic Setup**
  - [x] Initialize Express.js backend and React/Vite frontend.
  - [x] Setup MongoDB connection and database schemas.
  - [x] Configure environment variables and basic middlewares (CORS, error handling).
- [x] **User Management & Auth**
  - [x] Implement JWT-based Authentication.
  - [x] Role-based access control (Patients, Doctors).
  - [x] User Profile creation and comprehensive medical onboarding flows.

### Phase 2: Core Healthcare Modules
- [x] **Electronic Health Records (EHR)**
  - [x] Digital storage of patient demographics, past history, and current medications.
  - [x] CRUD operations for patient medical records to MongoDB.
- [ ] **Communication System**
  - [ ] Secure, real-time doctor-patient chat interface.
  - [ ] Appointment scheduling and virtual consultation routing.
- [x] **Prescription Management**
  - [x] Digital manual prescription upload for patients.
  - [x] Prescription validation and tracking system powered by Groq AI.

### Phase 3: AI Agents & Smart Integrations
- [x] **AI Prescription Assistant (Real-time)**
  - [x] Integrate Groq API (Llama 3.3 70B) into the backend.
  - [x] AI reads patient demographics, complaints, past history, and current meds.
  - [x] Generate real-time alerts for overlapping medications or contraindications.
- [x] **AI Health Assistant (Patient Chatbot)**
  - [x] 24/7 Chatbot for patients using real context from their MongoDB profile.
  - [x] Triage system to analyze symptoms and provide personalized medical guidance.
- [ ] **AI Non-Pharma Suggestions**
  - [ ] Feature allowing AI to analyze the prescription and recommend non-pharmaceutical products or lifestyle changes alongside standard meds.

### Phase 4: Specialized Care & Tracking
- [ ] **Chronic Care Tracker**
  - [ ] System to identify and track patients with chronic conditions (e.g., Diabetes, BP).
  - [ ] Automated reminders for medication refills and follow-up consultations.
- [ ] **Age-Specific Care Modules**
  - [ ] Implement tailored dashboards and care flows for 4 distinct age groups.
- [ ] **Women's Health Focus**
  - [ ] Specialized tracking and care modules.

### Phase 5: E-commerce & Pharmacy
- [ ] **Medicine Ordering System**
  - [ ] Integration to allow easy medicine ordering directly based on verified digital prescriptions.
  - [ ] Order tracking and fulfillment status updates.