  <div align="center">
    <img src="https://img.shields.io/badge/-React_JS-black?style=for-the-badge&logoColor=white&logo=react&color=61DAFB" alt="react.js" />
    <img src="https://img.shields.io/badge/-Vite-black?style=for-the-badge&logoColor=white&logo=vite&color=646CFF" alt="vite" />
    <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="tailwindcss" />
  </div>

<h3 align="center">AuxHR  <img src="/Salesplat.png" alt="auxhr" /> </h3>

</div>

## 📋 <a name="table">Table of Contents</a>

1. 🤖 [Introduction](#introduction)
2. ⚙️ [Tech Stack](#tech-stack)
3. 🔋 [Features](#features)
4. 🤸 [Quick Start](#quick-start)
5. 🕸️ [Snippets (Code to Copy)](#snippets)
6. 🔗 [Assets](#links)

## <a name="introduction">🤖 Introduction</a>

AuxHr is an AI-driven platform designed to streamline the recruitment process by automatically assessing talents and determining their compatibility with job descriptions. It eliminates the need for recruiters to manually review countless talent profiles, making it easier to scale hiring efforts efficiently.

## <a name="tech-stack">⚙️ Tech Stack</a>

- Vite
- React.js
- Tailwind CSS
- Typescript
- Material UI
- Sass/Scss

## <a name="features">🔋 Features of AuxHr</a>

✅ Automated Talent Assessment – Uses AI to evaluate candidate profiles based on job requirements.<br/>
✅ Compatibility Scoring – Assigns a match score to each talent, helping recruiters focus on the best candidates.<br/>
✅ Effortless Profile Scanning – Eliminates the need for recruiters to manually review resumes.<br/>
✅ Scalability – Enables companies to process high volumes of applicants seamlessly.<br/>
✅ Scout & Recruit – Recruiters can post job openings and scout for talent efficiently.<br/>
✅ Talent Registration & Profile Creation – Simplifies the onboarding process for job seekers.<br/>

## 🚀 AI-Powered Assessments

🔹 AI: CV Assessment – Analyzes resumes to extract key skills and qualifications.<br/>
🔹 AI: Pre-Screening Assessment – Filters out unqualified candidates before they reach recruiters.<br/>
🔹 AI: Personalized Assessment – Evaluates candidates based on job-specific criteria.<br/>
🔹 AI: Personality Assessment – Assesses soft skills and cultural fit.<br/>
🔹 AI: Assessment Grading – Scores candidates based on their performance in various tests.

## ⚡ Recruiter Features

🔹 Recruiter Job Post Creation – Allows companies to list job openings with AI-driven recommendations.<br/>
🔹 Recruiter Shortlisting – Automatically ranks and shortlists candidates based on their compatibility score.

With AuxHr, companies can enhance their hiring efficiency, reduce bias, and connect with the right talent faster than ever. 🚀

## <a name="quick-start">🤸 Quick Start</a>

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

Install the project dependencies using npm:

```bash
npm install
```

**Running the Project**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the project.

## <a name="snippets">🕸️ Snippets</a>

<details>
<summary><code>tailwind.config.js</code></summary>

```jsx
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Adjust according to your project structure
    './src/**/*.scss', // Include SCSS files
  ],
  theme: {
    extend: {
      fontFamily: {
        raleway: ['Raleway, san-serif'],
        poppins: ['Poppins, san-serif'],
      },
      boxShadow: {
        custom: '0px 1.52px 3.05px 0px rgba(16, 24, 40, 0.05)',
      },
    },
  },
  plugins: [],
}
```

</details>

<details>
<summary><code>index.css</code></summary>

```css
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Raleway:ital,wght@0,100..900;1,100..900&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

.hoverEffect {
  @apply hover:text-white ease-in duration-200 cursor-pointer;
}

.flip-2-ver-right-fwd {
  -webkit-animation: flip-2-ver-right-fwd 0.5s cubic-bezier(
      0.455,
      0.03,
      0.515,
      0.955
    ) both;
  animation: flip-2-ver-right-fwd 0.5s cubic-bezier(0.455, 0.03, 0.515, 0.955) both;
}

.scale-up-tr {
  -webkit-animation: scale-up-tr 0.5s cubic-bezier(0.39, 0.575, 0.565, 1) both;
  animation: scale-up-tr 0.5s cubic-bezier(0.39, 0.575, 0.565, 1) both;
}

@-webkit-keyframes scale-up-tr {
  0% {
    -webkit-transform: scale(0.5);
    transform: scale(0.5);
    -webkit-transform-origin: 100% 0%;
    transform-origin: 100% 0%;
  }
  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
    -webkit-transform-origin: 100% 0%;
    transform-origin: 100% 0%;
  }
}
@keyframes scale-up-tr {
  0% {
    -webkit-transform: scale(0.5);
    transform: scale(0.5);
    -webkit-transform-origin: 100% 0%;
    transform-origin: 100% 0%;
  }
  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
    -webkit-transform-origin: 100% 0%;
    transform-origin: 100% 0%;
  }
}

@-webkit-keyframes flip-2-ver-right-fwd {
  0% {
    -webkit-transform: translateX(0) translateZ(0) rotateY(0);
    transform: translateX(0) translateZ(0) rotateY(0);
    -webkit-transform-origin: 100% 50%;
    transform-origin: 100% 50%;
  }
  100% {
    -webkit-transform: translateX(100%) translateZ(160px) rotateY(-180deg);
    transform: translateX(100%) translateZ(160px) rotateY(-180deg);
    -webkit-transform-origin: 0% 50%;
    transform-origin: 0% 50%;
  }
}
@keyframes flip-2-ver-right-fwd {
  0% {
    -webkit-transform: translateX(0) translateZ(0) rotateY(0);
    transform: translateX(0) translateZ(0) rotateY(0);
    -webkit-transform-origin: 100% 50%;
    transform-origin: 100% 50%;
  }
  100% {
    -webkit-transform: translateX(100%) translateZ(160px) rotateY(-180deg);
    transform: translateX(100%) translateZ(160px) rotateY(-180deg);
    -webkit-transform-origin: 0% 50%;
    transform-origin: 0% 50%;
  }
}

.activeTab {
  @apply text-white;
}

.w-full {
  width: 100vw;
}

.container {
  /* max-width: 1280px; */
}

.wrapper {
  padding: 40px auto;
}

.navbar {
  max-height: 52px;
  height: 52px;
}

.nav-navigate {
  margin: 0px 64px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Home */
.main-container {
  max-height: 640px;
  height: 640px;
  padding: 64px 0px 96px 80px;
  overflow: hidden;
}

.home-pg {
  height: 100%;
  display: flex;
  width: inherit;
  flex-direction: row;
}

.metrics {
  max-height: 524px;
  height: 524px;
  overflow: hidden;
}

/* End Home */

.scale-up-center {
  -webkit-animation: scale-up-center 0.8s cubic-bezier(0.39, 0.575, 0.565, 1) both;
  animation: scale-up-center 0.8s cubic-bezier(0.39, 0.575, 0.565, 1) both;
}

@-webkit-keyframes scale-up-center {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.5);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

@keyframes scale-up-center {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.5);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}
```

</details>

## <a name="links">📦 Assets </a>

Assets used in the project can be
found [here](https://github.com/Salesplatpro/frontend/tree/development/src/assets)

<br />
<br />
