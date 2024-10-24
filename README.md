# Tic-Tac-Toe Game

A simple, interactive Tic-Tac-Toe game built with **Next.js** and **Firebase**. Play against the computer (bot) or with another player, track your score, and customize the game board!

## Features

- **Play against a bot** or with a second player.
- **Track player scores** using Firebase Firestore.
- **Google Authentication** for user login.
- **Customizable game board** with color picker.
- **Sound effects** for player and bot moves.
- **Victory celebration effect** when a player wins.
- **Reset button** to start a new game.
- **Responsive design** for mobile and desktop.

## Tech Stack

- **Next.js**: React framework for building the game interface.
- **Firebase**: Handles authentication and Firestore for score tracking.
- **TypeScript**: For type-safe code.
- **Tailwind CSS**: For inline, custom styling.
- **React**: For state management and game logic.

## Installation

To get started with this project locally, follow these steps:

### Prerequisites

- **Node.js** (v14 or later)
- **npm** or **yarn**
- A Firebase project with **Google Authentication** and **Firestore** enabled.

### Steps

1. Clone this repository:

   ```bash
   git clone https://github.com/your-username/tic-tac-toe.git
   cd tic-tac-toe

2. Install dependencies
   ``` bash
   pnpm install

3. Set up Firebase:
Go to the Firebase Console.
Create a new project and enable Google Authentication.
Set up Firestore for storing user scores.
Copy your Firebase configuration into a .env.local file in the project root:

   ``` bash
    NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

4. Run development server
     ``` bash
   pnpm run dev
