# One Piece Lore Map: YouTube Tutorial Series Breakdown

This document breaks down the "One Piece Lore Map" repository into technical categories and potential YouTube video modules. This curriculum is specifically designed for creatives who want to understand how to use AI (like Gemini, ChatGPT, or GitHub Copilot) to build complex web applications.

## Series Overview: "Vibe Coding the Grand Line"

The series will take viewers from zero to a fully deployed, immersive web app. It bridges the gap between creative vision and technical execution by showing how AI can act as a technical co-founder or pair programmer.

---

### Module 1: The Foundation – Project Setup & Architecture
*Focus: How to start a modern web project and ask AI the right questions for setup.*

*   **Video 1: The Tech Stack Explained (for non-coders):** Breaking down what Next.js, React, Tailwind, and Prisma actually do in simple terms.
*   **Video 2: Initializing the Project:** Using AI prompts to generate the `package.json`, set up Next.js 14 (App Router), and configure the folder structure (`app/`, `components/`, `lib/`).
*   **Video 3: The "Vibe" Setup:** Configuring Tailwind CSS and standardizing design tokens (colors, fonts, glassmorphism) so the AI knows what visual style to generate.

### Module 4: The Database & Lore – Structuring Worldbuilding
*Focus: Using AI to design databases and manage massive amounts of creative content.*

*   **Video 4: Designing the Lore Schema:** How to prompt AI to write a `schema.prisma` file. Defining Locations, Characters, and Lore entries.
*   **Video 5: Supabase Setup:** Connecting a frontend to a real, live database (PostgreSQL via Supabase) without needing a backend engineer.
*   **Video 6: Automated Data Seeding:** Using AI to write a `seed.ts` script and generate JSON files (`data/locations`) to automatically populate the map with initial lore.

### Module 3: The UI & Interactivity – Building the Map
*Focus: Translating creative UI/UX designs into code using AI.*

*   **Video 7: Building the Map Canvas:** Prompting for interactive, responsive map layouts.
*   **Video 8: Hotspots & Tooltips:** Creating reusable React components for map locations. How to ask AI to debug CSS positioning and z-indexes.
*   **Video 9: Smooth Animations with Framer Motion:** Adding page transitions, hover effects, and satisfying micro-interactions to make the map feel "alive."

### Module 4: State Management & Data Fetching – Connecting the Pieces
*Focus: Understanding how data moves in an app and using AI to handle complex logic.*

*   **Video 10: Building API Routes:** Creating Next.js backend routes (`app/api/`) to serve lore data to the frontend.
*   **Video 11: Data Fetching with React Query:** Using AI to implement caching and smooth loading states so the user never sees a broken page.
*   **Video 12: Creating the News Feed:** Using `rss-parser` to pull in external One Piece news, and how AI can write parsing logic effortlessly.

### Module 5: Multimedia Magic – Audio & Video
*Focus: Integrating immersive media and handling browser quirks with AI assistance.*

*   **Video 13: YouTube Integration:** Embedding dynamic video players for epic battles and scenes using `react-player`.
*   **Video 14: Global Audio State:** Building a global `AudioContext` to handle location-specific background music.
*   **Video 15: Debugging Audio Autoplay:** How to use AI to troubleshoot the dreaded "browser autoplay policy" and build user-friendly audio controls.

### Module 6: Community Driven – Handling User Input
*Focus: Building forms and safely accepting user-generated content.*

*   **Video 16: The Contribution Form:** Prompting AI to build complex, multi-step forms for users to submit new locations (`app/contribute`).
*   **Video 17: Validating & Saving Data:** Ensuring user submissions are safe and properly formatted before hitting the database.

### Module 7: Ship It! – Testing & Deployment
*Focus: Getting the project live on the internet.*

*   **Video 18: Testing the App:** Using AI to write Vitest tests to ensure nothing breaks when adding new features.
*   **Video 19: Deployment with Vercel:** The magical one-click deploy process and managing environment variables.
*   **Video 20: The Future of "Vibe Coding":** Wrapping up the series. How creatives can continue to use AI to maintain and scale the application.

---

### Tips for Content Delivery (For Creators):
*   **Show the Prompts:** Don't just show the code; show the *exact prompts* you used to get the AI to generate the code.
*   **Show the Errors:** Viewers learn most when AI gets it wrong. Show how to paste error logs back into the AI to let it fix its own mistakes.
*   **Focus on the "Why":** Explain *why* you chose a certain tool or pattern, rather than getting bogged down in the syntax (the AI handles the syntax).
