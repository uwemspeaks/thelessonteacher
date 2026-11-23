# The Lesson Teacher

A mobile-first English learning web app for Nigerian JSS 1–3 students, built with HTML, CSS and vanilla JavaScript.

## Features
- Responsive student dashboard and mobile bottom navigation
- 12 English learning areas
- 200 scenario-based multiple-choice questions
- Immediate feedback, explanations and learning tips
- Randomised 10-question practice sessions
- Mixed-topic mock assessment
- Points, accuracy and topic-level performance
- Progress saved locally with LocalStorage
- Reduced-motion support and accessible button labels

## Run locally
Open `index.html` in a modern browser. For best results, use a local static server.

## Deploy to Netlify
1. Create a GitHub repository named `lesson-teacher`.
2. Upload the contents of this folder to the repository root.
3. In Netlify, choose **Add new site → Import an existing project**.
4. Connect the GitHub repository.
5. Set the publish directory to `.` and leave the build command empty.
6. Deploy.

## Important notes
- The first release is a front-end MVP. It does not create secure student accounts or sync progress between devices.
- Student progress is stored in the browser on the current device.
- Google Fonts require an internet connection. The app itself and question bank are local static files.
- Before school-wide use, have an English Studies teacher review the full question bank against the school's approved scheme of work and adapt it to the current curriculum.
- The question bank is stored in `data/questions.js` for browser use and `data/questions.json` for editing.
