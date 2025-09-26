<p align="center">
  <b>AuxHR</b>
  <img src="https://github.com/Salesplatpro/frontend/blob/Paul/public/Salesplat.png" alt="AuxHR Logo" width="20" height="20"/>
</p>

</div>

##  <a name="table">Table of Contents</a>

1.  [Introduction](#introduction)
2.  [Tech Stack](#tech-stack)
3.  [Features](#features)
4.  [Quick Start](#quick-start)
5.  [Project Structure](#project-structure)
6.  [Git Workflow & Code Management](#git-workflow--code-management)
7.  [Assets](#links)

## <a name="introduction"> Introduction</a>

AuxHr is an AI-driven platform designed to streamline the recruitment process by automatically assessing talents and determining their compatibility with job descriptions. It eliminates the need for recruiters to manually review countless talent profiles, making it easier to scale hiring efforts efficiently.

## <a name="tech-stack"> Tech Stack</a>

- Vite
- React.js
- Tailwind CSS
- Typescript
- Material UI
- Sass/Scss

## <a name="features"> Features of AuxHr</a>

- Automated Talent Assessment – Uses AI to evaluate candidate profiles based on job requirements.<br/>
- Compatibility Scoring – Assigns a match score to each talent, helping recruiters focus on the best candidates.<br/>
- Effortless Profile Scanning – Eliminates the need for recruiters to manually review resumes.<br/>
- Scalability – Enables companies to process high volumes of applicants seamlessly.<br/>
- Scout & Recruit – Recruiters can post job openings and scout for talent efficiently.<br/>
- Talent Registration & Profile Creation – Simplifies the onboarding process for job seekers.<br/>

##  AI-Powered Assessments

- AI: CV Assessment – Analyzes resumes to extract key skills and qualifications.<br/>
- AI: Pre-Screening Assessment – Filters out unqualified candidates before they reach recruiters.<br/>
- AI: Personalized Assessment – Evaluates candidates based on job-specific criteria.<br/>
- AI: Personality Assessment – Assesses soft skills and cultural fit.<br/>
- AI: Assessment Grading – Scores candidates based on their performance in various tests.

##  Recruiter Features

- Recruiter Job Post Creation – Allows companies to list job openings with AI-driven recommendations.<br/>
- Recruiter Shortlisting – Automatically ranks and shortlists candidates based on their compatibility score.

With AuxHr, companies can enhance their hiring efficiency, reduce bias, and connect with the right talent faster than ever. 🚀

## <a name="quick-start"> Quick Start</a>

Follow these steps to set up the project locally on your machine.

**Prerequisites**

Make sure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/) (Node Package Manager)

**Cloning the Repository**

```bash
git clone https://github.com/Salesplatpro/frontend.git
cd frontend
```

**Installation**

Install the project dependencies using yarn:

```bash
yarn install
```

**Running the Project**

```bash
yarn run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the project.

## <a name="project-structure"> Project Structure</a>
```
      /src
      ├── assets/ # Local images, icons, static files
      ├── components/ # Reusable UI components 
      ├── hooks/ # Custom React hooks
      ├── pages/ # Page-level components (mapped to routes)
      ├── redux/ # Handles global state and API calls (slices, API calls)
      ├── index.css/ # Global styles (Tailwind config, theme)
      ├── utils/ # Helper functions, constants, formatters
      ├── App.tsx # Root component
      └── main.tsx # Entry point (React DOM mount, providers)
```

## <a name="git-workflow--code-management"> Git Workflow & Code Management</a>
We follow a **branching strategy** to keep development organized and production stable.

### Branching
- **`main`** → Production-ready code only (always stable).  
- **`development`** → Active development branch where features are tested together.  
- **Feature branches** → Create a new branch for every task or bugfix:  

### Committing
- Use clear, conventional commit messages:
- feat: add recruiter job post form
- fix: resolve navbar alignment issue
- chore: update dependencies

### Pull Requests (PRs)
- Create a **PR from your feature branch → development**.  
- Another team member reviews and approves the PR in the **admin repo**.  
- Once merged, your feature becomes part of the `development` branch.  
- After testing on `development`, create a **PR from development → main**.  
  - This is for production release.  
-  Note: Merges into `main` and `development` can only be done from the **admin repo** because we are on the free Git version.  

### Best Practices
- Always pull the latest development before creating a new branch.
- Resolve merge conflicts locally before submitting PRs.
- Don’t commit directly to main or development.

## <a name="links"> Assets </a>

Assets used in the project can be
found [here](https://github.com/Salesplatpro/frontend/tree/development/src/assets)

<br />
<br />
