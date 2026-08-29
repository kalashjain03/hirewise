# HireWise AI

### AI-Powered End-to-End Recruitment & Interview Automation Platform

HireWise AI is an AI-powered recruitment platform that automates the candidate screening and interview process — from **candidate application and resume evaluation to AI-based voice interviews, human final-round scheduling, and candidate assessment**.

The platform is designed to reduce manual recruiter effort, standardize candidate evaluation, and provide a structured, data-driven hiring workflow — blending AI automation with human decision-making at the final stage.

---

## 🎙️ The Core: A Real AI Voice Interview Agent

> **The heart of HireWise AI is not a form or a dashboard — it's a live, voice-based AI interviewer.**

While the surrounding pipeline (screening, scheduling, results) makes the product usable end-to-end, the actual technical crux of this project is the **real-time conversational voice agent** that conducts Round 2:

* Candidates don't fill out a text questionnaire — they **talk to an AI interviewer over voice**, in real time.
* The agent asks role-specific questions, **listens, understands, and responds dynamically** — not a fixed script.
* Built on **Vapi AI** for low-latency speech-to-speech interaction, so the conversation feels like a real phone/video screening call rather than a chatbot.
* The agent carries context per candidate (JD, resume, prior answers) so follow-ups feel natural rather than generic.
* The full spoken conversation is captured and turned into a transcript, which then drives the AI evaluation — meaning **the voice interaction itself is the primary data source** for the entire downstream evaluation and hiring decision.

Everything else in the platform — screening, links, scheduling, results — exists to get candidates *into* this voice interview and to make sense of what happens *during* it.

### How the Voice Call Actually Works

```text
Candidate clicks unique interview link
                ↓
        Browser requests mic permission
                ↓
     Vapi voice session initialized
     (candidate-specific context loaded:
      JD, resume summary, question set)
                ↓
        AI interviewer greets candidate
        and explains the interview format
                ↓
   ┌──────────────────────────────────┐
   │   Turn-based live conversation    │
   │                                    │
   │  AI asks question (speech)        │
   │        ↓                          │
   │  Candidate answers (speech)       │
   │        ↓                          │
   │  Speech → Text (real-time ASR)    │
   │        ↓                          │
   │  LLM interprets answer, decides   │
   │  next question / follow-up        │
   │        ↓                          │
   │  Text → Speech (AI voice reply)   │
   │        ↓                          │
   │  Repeat until interview complete  │
   └──────────────────────────────────┘
                ↓
         Call ends automatically
                ↓
      Full transcript generated
                ↓
        Sent to evaluation pipeline
```

### What Makes It Feel Like a Real Interview (Not a Bot Script)

* **Speech-to-speech, not text chat** — the candidate never types; they speak and hear responses back, just like a phone/video screening call.
* **Low-latency turn-taking** — Vapi handles the real-time audio streaming and turn detection, so the AI knows when the candidate has finished speaking and responds without awkward delay.
* **Context-aware questioning** — the agent isn't reading from a fixed list. It's seeded with the candidate's resume and the JD, so it can ask role-specific questions and probe deeper based on what the candidate just said.
* **Adaptive follow-ups** — if an answer is vague or interesting, the agent can ask a natural follow-up instead of moving mechanically to the next scripted question.
* **Consistent structure, flexible delivery** — every candidate for a given role covers the same core topics (so evaluation stays fair and comparable), but the *phrasing and flow* of the conversation adapts to how the candidate is answering.
* **No recruiter presence required** — the entire first interview round runs unattended, so candidates can complete it whenever they access their link, without waiting on recruiter availability.

### From Voice → Structured Data

The spoken conversation is the raw signal, but it doesn't stay unstructured for long:

1. **Real-time transcription** captures both sides of the conversation as it happens.
2. Once the call ends, the **full transcript** becomes the input to the evaluation stage.
3. An LLM analyzes the transcript to extract **scores, strengths, weaknesses, and evidence** tied back to specific things the candidate said.
4. This turns a 10–20 minute voice conversation into **structured, comparable recruitment data** — the same shape of output regardless of how differently each candidate's conversation unfolded.

This voice-first, structured-output approach is what lets HireWise AI replace a real recruiter-led screening call, rather than just replacing a form.

---

## 🚀 What We Built

Traditional recruitment requires recruiters to manually:

* Collect candidate applications
* Review resumes against Job Descriptions
* Shortlist candidates
* Conduct initial screening calls
* Schedule interviews
* Conduct interviews
* Evaluate candidates
* Compile interview results
* Coordinate final-round human interviews
* Share candidate outcomes

HireWise AI automates this workflow using **LLM-based resume screening, AI voice interviews, automated scheduling for human interviews, and structured candidate evaluation**.

### Core Pipeline

**Candidate Application → Resume/JD Matching → AI Screening (Round 1) → AI Voice Interview (Round 2) → Interview Analysis → Human Interview Scheduling (Round 3) → Final Evaluation → Results**

---

# 🎯 Problem

Recruitment teams face several challenges:

* Large numbers of applications are difficult to screen manually.
* Resume evaluation can be inconsistent and subjective.
* Initial screening calls consume significant recruiter time.
* Interview scheduling and candidate communication require repetitive manual work.
* Different recruiters may evaluate candidates using different criteria.
* Interview results are often scattered across emails, spreadsheets, and notes.
* Candidates have limited visibility into their interview progress and results.
* Coordinating final human interviews after AI screening adds scheduling overhead.

HireWise AI addresses these problems by creating an automated recruitment pipeline where AI handles the repetitive screening and interview stages, scheduling is automated via Cal.com, and a human recruiter makes the final call — keeping the process structured, measurable, and human-verified at the last mile.

---

# 💡 Solution

HireWise AI creates a complete automated hiring workflow around the **Job Description (JD)** and **Candidate Resume**.

The system:

1. Collects candidate information.
2. Stores and processes candidate data.
3. Compares the candidate's resume with the relevant JD.
4. Performs an **LLM-based Round 1 initial screening** and determines whether the candidate passes, fails, or requires manual review.
5. Sends an automated email with the Round 1 screening outcome.
6. Generates a unique dynamic interview link only for candidates who pass Round 1.
7. Includes the interview link in the email sent to passed candidates.
8. Conducts a **real-time AI voice interview (Round 2)** for candidates who access the link.
9. Generates a transcript of the interview.
10. Evaluates the candidate based on the interview.
11. Stores the resulting candidate assessment.
12. Sends candidates who pass Round 2 a **Cal.com booking link** to schedule their final human interview (Round 3).
13. Recruiter/hiring team conducts the final human interview.
14. Provides a candidate-facing results experience across all stages.

---

# 🔄 End-to-End Candidate Flow

## 1. Candidate Application

The candidate starts by filling out the application form.

The form collects information such as:

* Candidate name
* Email
* Contact information
* Resume
* Relevant application details

The application data enters the recruitment automation pipeline.

---

## 2. Resume + JD Matching

Once a candidate applies, their resume is evaluated against the **Job Description associated with the position**.

The system looks at relevant information such as:

* Skills
* Experience
* Education
* Job requirements
* Relevant technologies
* Role-specific qualifications
* Overall alignment with the JD

The purpose is not simply to identify keywords, but to determine how well the candidate's profile matches the requirements of the role.

---

# 🧠 Round 1 — AI Initial Screening

Candidates who pass the initial resume evaluation go through **Round 1: AI-based initial screening**.

An LLM is used to analyze the candidate's resume and the corresponding JD.

The screening evaluates:

* Candidate-JD relevance
* Required skills
* Experience alignment
* Technical/background fit
* Missing requirements
* Overall suitability

### Round 1 Pipeline

```text
Candidate Resume
       +
Job Description
       ↓
LLM-Based Evaluation
       ↓
Candidate Fit Analysis
       ↓
Screening Decision
       ↓
Shortlisted / Rejected
```

This removes a large amount of repetitive manual resume screening from the recruitment process.

---

# 📞 Round 2 — AI Voice Interview

Candidates who successfully clear the initial screening move to the AI interview stage.

Instead of requiring a recruiter to manually conduct every initial interview, HireWise AI provides the candidate with a **unique interview URL**.

The candidate opens the link and enters the interview interface.

The AI interviewer then conducts a real-time voice conversation with the candidate.

### Interview Flow

```text
Candidate receives unique interview link
                ↓
        Opens interview page
                ↓
        Candidate validation
                ↓
          Before You Begin
                ↓
        Starts AI Interview
                ↓
       AI asks interview questions
                ↓
       Candidate responds by voice
                ↓
        Conversation continues
                ↓
       Interview is completed
                ↓
         Transcript generated
                ↓
       Interview evaluation
                ↓
     Pass → Cal.com booking link sent
```

The AI interviewer can conduct a structured conversation rather than relying on a static questionnaire.

---

# 📅 Round 3 — Human Interview Scheduling (Cal.com)

Candidates who pass the AI voice interview (Round 2) move to a **human-led final round**.

Instead of manually coordinating availability over email, HireWise AI sends the candidate a **Cal.com scheduling link** as part of the automated workflow.

### Round 3 Flow

```text
Candidate passes Round 2 (AI Voice Interview)
                ↓
     Automated email sent with Cal.com booking link
                ↓
     Candidate selects an available slot on Cal.com
                ↓
     Interview is booked and confirmed automatically
                ↓
     Recruiter/hiring panel conducts final human interview
                ↓
     Final hiring decision
```

This removes the manual back-and-forth of scheduling, letting candidates self-select a convenient slot while keeping a human decision-maker in the loop for the final hiring call.

---

# 🔗 Dynamic Interview Links

Each shortlisted candidate receives a **unique interview URL** containing their candidate identifier.

Example:

```text
/interview?candidateId=<candidate-id>
```

This allows the interview system to identify which candidate is accessing the interview and associate the interview session with the correct candidate record.

The interview link can be dynamically generated and communicated to the candidate through the recruitment automation workflow. The same candidate identifier logic carries through to the Cal.com booking link sent after Round 2, keeping the candidate's scheduling activity tied to their record.

This eliminates the need for recruiters to manually create and send individual interview links or manually track scheduling.

---

# 🎙️ AI Interview Engine

The interview experience uses **Vapi AI** for real-time, speech-to-speech AI voice interaction.

The system handles:

* Voice-based candidate interaction
* AI interviewer responses
* Real-time conversation
* Interview session management
* Candidate-specific interview context
* Interview completion
* Transcript generation

The objective is to provide every candidate with a consistent interview experience while reducing recruiter involvement in repetitive first-stage interviews.

---

# 📝 Interview Transcript

After the AI interview is completed, the conversation produces a structured transcript.

The transcript becomes the primary input for the post-interview evaluation process.

The system can use the transcript to evaluate:

* Candidate responses
* Technical understanding
* Communication
* Relevant experience
* Role-specific knowledge
* Response quality
* Overall interview performance

---

# 🤖 AI-Based Interview Evaluation

The completed interview is analyzed using AI to generate a structured candidate assessment.

The evaluation can be represented through:

* Overall score
* Individual evaluation categories
* Strengths
* Weaknesses
* Interview summary
* Evidence from candidate responses
* Evidence quality
* Interview status

This converts an unstructured voice conversation into structured recruitment data that feeds directly into the Round 3 scheduling decision.

---

# ⚙️ Backend & Automation Flow

HireWise AI uses an automated backend workflow, built on **n8n**, to move candidate data through the recruitment pipeline.

### High-Level Architecture

```text
                  ┌─────────────────┐
                  │ Candidate Form  │
                  └────────┬────────┘
                           ↓
                  ┌─────────────────┐
                  │ Candidate Data  │
                  └────────┬────────┘
                           ↓
              ┌────────────────────────┐
              │ Resume + JD Processing │
              └────────────┬───────────┘
                           ↓
                 ┌──────────────────┐
                 │ LLM Screening    │
                 │    Round 1       │
                 └────────┬─────────┘
                          ↓
                    Screening Result
                     /           \
                   Pass          Fail
                    ↓              ↓
          ┌─────────────────┐    End
          │ Interview Link  │
          │   Generation    │
          └────────┬────────┘
                   ↓
          Candidate receives
            interview link
                   ↓
          ┌─────────────────┐
          │ AI Voice        │
          │ Interview       │
          │   (Round 2)     │
          └────────┬────────┘
                   ↓
             Transcript
                   ↓
          ┌─────────────────┐
          │ AI Evaluation   │
          └────────┬────────┘
                   ↓
             Round 2 Result
                /        \
              Pass        Fail
               ↓             ↓
     ┌───────────────────┐  End
     │ Cal.com Booking   │
     │ Link Sent          │
     │   (Round 3)         │
     └────────┬───────────┘
              ↓
     Candidate books slot
              ↓
     ┌───────────────────┐
     │ Human Interview   │
     └────────┬───────────┘
              ↓
       Final Candidate Result
```

---

# 🔁 Automation Layer

The recruitment workflow is connected through **n8n workflow automation and webhooks** rather than requiring every step to be manually triggered.

The automation layer coordinates:

* Candidate submission
* Candidate data processing
* Resume/JD screening
* Screening results
* Candidate progression
* Interview link generation
* Candidate communication
* Interview completion data
* Cal.com scheduling link dispatch
* Booking confirmation handling
* Result processing

This creates a continuous pipeline between the candidate application, AI interview stage, and final human interview scheduling.

---

# 📊 Candidate Results Portal

HireWise AI also includes a candidate-facing **Results Portal**.

The `/results` route provides a dedicated interface for candidates to access their interview outcome.

The results experience includes:

* Candidate validation
* Loading state
* Candidate not-found state
* Processing state
* Interview status
* Overall score
* Score breakdown
* Strengths
* Weaknesses
* Interview summary
* Evidence quality
* Final-round scheduling status (booked / pending)

The results interface is designed to be responsive and consistent with the HireWise AI product experience.

---

# 🏗️ Technical Architecture

```text
Frontend
   │
   ├── Candidate Application
   ├── Interview Interface
   └── Candidate Results Portal
   │
   ↓
Backend / Automation (n8n)
   │
   ├── Candidate Processing
   ├── Resume + JD Processing
   ├── Screening Workflow
   ├── Interview Workflow
   ├── Cal.com Scheduling Workflow
   └── Result Processing
   │
   ├───────────────┬───────────────┐
   ↓               ↓               ↓
 LLM             Vapi AI        Cal.com
   │               │               │
Resume/JD       AI Voice        Human
Screening       Interview      Interview
   │               │            Booking
   └───────┬───────┘               │
           ↓                       │
       Evaluation ←─────────────────
           ↓
     Candidate Result
```

---

# 🛠️ Tech Stack

### Frontend

* **React.js**
* **Vite**
* **JavaScript / JSX**
* **HTML5**
* **CSS3**
* **React Router** / client-side routing

### Voice AI

* **Vapi AI** — real-time AI voice interview agent
* Voice AI / Speech-to-Speech interaction
* AI-powered conversational workflows

### Scheduling

* **Cal.com** — automated final-round human interview booking

### Backend & Automation

* **n8n** — workflow automation and webhook handling
* Webhooks
* REST APIs
* API integrations

### Database & Data Management

* **Supabase**
* **PostgreSQL** (via Supabase)
* Dynamic candidate/interview data handling
* Unique Candidate IDs

### Integrations

* **Google Sheets API / Google Sheets** — candidate data and workflow integration
* Email automation — dynamic interview links and Cal.com booking links
* Dynamic URL generation with candidate-specific parameters

### Deployment & Dev Tools

* **Vercel** — frontend deployment and hosting
* **Git & GitHub**
* **VS Code**
* Environment Variables (`.env`)

---

# 🔐 Candidate-Specific Interview Architecture

The interview system uses a candidate-specific identifier to maintain the connection between:

```text
Candidate
   ↓
Application
   ↓
Resume
   ↓
JD
   ↓
Screening Result (Round 1)
   ↓
Interview Link
   ↓
Interview Session (Round 2)
   ↓
Transcript
   ↓
AI Evaluation
   ↓
Cal.com Booking Link (Round 3)
   ↓
Human Interview
   ↓
Final Result
```

This ensures that the interview, scheduling, and resulting assessment all belong to the correct candidate throughout the pipeline.

---

# 🔌 Webhook-Based Communication

Webhooks are used as event-driven communication points within the n8n workflow.

Instead of manually running each process, an event can trigger the next stage of the recruitment pipeline — including firing off the Cal.com invite once a Round 2 pass is recorded.

```text
Event
  ↓
Webhook
  ↓
n8n Automation
  ↓
Processing
  ↓
Next Recruitment Stage
```

The approach makes the platform easier to automate and scale as additional recruitment stages are introduced.

---

# 🌐 Production Deployment

The application is deployed using **Vercel**.

The production environment supports:

* Public candidate-facing pages
* Dynamic interview URLs
* Production routing
* Environment configuration
* Candidate interview access
* Cal.com booking integration

The application can therefore be accessed by candidates without requiring local development infrastructure.

---

# 📁 Application Structure

The frontend contains dedicated components/routes for the major candidate experiences.

Conceptually:

```text
src/
│
├── Interview
│   └── AI interview experience (Round 2)
│
├── Results
│   └── Candidate results portal
│
├── Header
│   └── Application navigation
│
├── Main Router
│   └── Application routing
│
└── Styles
    └── Responsive HireWise UI
```

The architecture separates the candidate interview experience from the candidate results experience, allowing both systems to evolve independently.

---

# 🔄 Complete Recruitment Lifecycle

### Stage 1 — Application
Candidate submits application and resume.

### Stage 2 — Resume Processing
Candidate resume is processed against the relevant JD.

### Stage 3 — AI Screening (Round 1)
LLM evaluates candidate-job compatibility.

### Stage 4 — Shortlisting
Suitable candidates proceed to the interview stage.

### Stage 5 — Interview Link
A unique candidate-specific interview URL is generated.

### Stage 6 — Candidate Communication
Interview details/link are sent to the candidate through the automated workflow.

### Stage 7 — AI Voice Interview (Round 2)
Candidate enters the interview and interacts with the AI interviewer through voice.

### Stage 8 — Transcript
The completed conversation is converted into a structured transcript.

### Stage 9 — AI Evaluation
The interview is analyzed and converted into structured candidate feedback.

### Stage 10 — Human Interview Scheduling (Round 3)
Candidates who pass Round 2 receive a Cal.com link to book their final human interview.

### Stage 11 — Human Interview
The recruiter/hiring panel conducts the final interview.

### Stage 12 — Candidate Results
The candidate's evaluation and scheduling status are represented through the results portal.

---

# 🎯 Key Advantages

### For Recruiters

* Reduces manual resume screening
* Automates initial candidate filtering
* Reduces repetitive screening calls
* Standardizes initial interviews
* Removes manual scheduling coordination via Cal.com
* Provides structured candidate evaluation
* Reduces administrative workload
* Enables a scalable recruitment workflow

### For Candidates

* Faster screening process
* No dependency on recruiter availability for initial interviews
* Unique interview access
* Conversational AI interview experience
* Self-service scheduling for the final human interview
* Structured interview evaluation
* Dedicated results experience

### For Organizations

* Consistent candidate evaluation
* Faster recruitment pipeline
* Automated workflows
* Human decision-making retained at the final stage
* Scalable candidate processing
* Centralized candidate journey

---

# 🔮 Future Extensibility

The architecture is designed so additional recruitment capabilities can be added without changing the complete candidate journey.

Potential extensions include:

* Production results API
* Recruiter dashboard
* Advanced candidate analytics
* Automated candidate ranking
* Multi-panel interview scheduling
* Additional interview rounds
* Recruiter review workflows
* Candidate comparison
* Detailed hiring analytics
* ATS integrations

---

# 📌 Project Summary

**HireWise AI transforms recruitment from a manually driven process into an AI-assisted automated pipeline — with a human in the loop for the final decision.**

```text
Apply
  ↓
Resume + JD Matching
  ↓
AI Screening (Round 1)
  ↓
Shortlist
  ↓
Dynamic Interview Link
  ↓
AI Voice Interview (Round 2)
  ↓
Transcript
  ↓
AI Evaluation
  ↓
Cal.com Booking Link (Round 3)
  ↓
Human Interview
  ↓
Candidate Results
```

The core objective is simple:

> **Automate repetitive recruitment operations while keeping a human decision-maker at the final stage — making candidate evaluation faster, more consistent, and data-driven.**

---

## 👨‍💻 Project Status

HireWise AI is an actively developed AI recruitment platform with the core candidate application, AI screening workflow, AI voice interview experience, dynamic interview routing, n8n automation layer, Cal.com-based final-round scheduling, production deployment, and candidate results experience implemented as part of the current system.
