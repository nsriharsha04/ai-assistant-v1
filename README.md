# JARVIS - Personal AI Assistant

This project aims to create a local, voice-controlled AI assistant similar to Alexa or Siri, with a focus on technology and tech news. It features a futuristic UI and is designed to run on a Mac server with minimal to no cost.

## My Learning Journey

This project started out of pure curiosity and a desire to dive deep into the world of AI, speech processing, and modern web development. My goal was to build something tangible that combined several cutting-edge technologies, all running locally on my Mac.

It's been an incredible learning experience, tackling challenges like:

*   **Integrating diverse technologies:** Connecting a Python backend (FastAPI) with a React frontend, and then weaving in powerful AI models like Ollama, Whisper, and OpenAI's TTS.
*   **Real-time audio processing:** Handling microphone input, transcribing speech, and generating audio responses efficiently.
*   **Frontend development with modern tools:** Getting hands-on with React, TypeScript, and the sometimes-tricky setup of Tailwind CSS (especially navigating between v3 and v4 configurations!).
*   **Managing conversation context:** Ensuring the AI remembers previous interactions to provide a more natural and helpful experience.

Every error and every successful build has been a step forward in understanding how these complex systems work together. This project is a testament to the power of open-source tools and the exciting possibilities of local AI.

## Technical Notes

### Architecture

The application consists of two main parts:

1.  **Backend (Python/FastAPI):** Handles AI logic, speech-to-text transcription, text-to-speech generation, and conversation context.
2.  **Frontend (React/TypeScript/Tailwind CSS):** Provides the futuristic user interface, handles audio recording, and plays back audio responses.

### Key Technologies

*   **Backend:**
    *   **FastAPI:** A modern, fast (high-performance) web framework for building APIs with Python 3.7+.
    *   **Ollama:** Used for running Large Language Models (LLMs) locally (e.g., Llama 3) for generating AI responses.
    *   **OpenAI Whisper (Local):** Utilized for highly accurate speech-to-text transcription of user input.
    *   **OpenAI TTS (API):** Used for generating natural-sounding speech for Jarvis's responses. (Note: This incurs a small cost per use).
    *   **`python-dotenv`:** For securely loading environment variables (like your OpenAI API key).

*   **Frontend:**
    *   **React:** A JavaScript library for building user interfaces.
    *   **TypeScript:** A superset of JavaScript that adds static typing.
    *   **Tailwind CSS:** A utility-first CSS framework for rapidly building custom designs.
    *   **Web MediaRecorder API:** For recording audio from the user's microphone.
    *   **Web Audio API:** For playing back audio responses.

### Features Implemented

*   **Voice Interaction:** Speak to Jarvis, and it will respond verbally.
*   **Local LLM:** Powered by Ollama, allowing for offline AI processing.
*   **High-Quality Speech-to-Text:** Uses OpenAI's Whisper model for accurate transcription.
*   **Natural Text-to-Speech:** Leverages OpenAI's TTS API for realistic voice output.
*   **Conversation Context:** Jarvis remembers previous turns in the conversation.
*   **Simulated Wake Word:** Say "Hey Jarvis" to initiate a conversation (after clicking the orb).
*   **Transcript Toggle:** Option to show or hide the conversation history on the UI.
*   **Detailed Logging:** Extensive `print` statements in the backend and `console.log` in the frontend for debugging and performance monitoring.


### Setup and Running the Application

#### Prerequisites

*   **Python 3.8+**
*   **Node.js & npm**
*   **Ollama:** Download and install from [https://ollama.com/](https://ollama.com/).
*   **ffmpeg:** Install via your system's package manager (e.g., `brew install ffmpeg` on macOS).

#### 1. Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Create a `.env` file:**
    In the `backend` directory, create a file named `.env` and add your OpenAI API key:
    ```
    OPENAI_API_KEY=your_openai_api_key_here
    ```

3.  **Install Python dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Pull the Ollama model (e.g., Llama 3):**
    ```bash
    ollama pull llama3
    ```

5.  **Start the backend server:**
    ```bash
    python main.py
    ```
    You should see logs indicating the server is running and components are initialized.

#### 2. Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install Node.js dependencies:**
    ```bash
    npm install
    ```

3.  **Start the frontend development server:**
    ```bash
    npm start
    ```
    This will open the application in your default web browser at `http://localhost:3000`.

### Usage

1.  Ensure both the backend and frontend servers are running.
2.  Open your web browser to `http://localhost:3000`.
3.  Click the central orb to start listening.
4.  Say "Hey Jarvis" to initiate the conversation.
5.  Ask your technology or tech news-related questions.
6.  Observe the console logs in your browser and the terminal logs for the backend to monitor performance and internal processes.

### Troubleshooting

*   **`Module build failed (from ./node_modules/postcss-loader/dist/cjs.js): Error: It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin.`**
    This indicates a Tailwind CSS v4 configuration issue. Ensure you have Tailwind CSS v3 installed (`tailwindcss@^3`) and your `postcss.config.js` is configured as follows:
    ```javascript
    module.exports = {
      plugins: {
        tailwindcss: {},
        autoprefixer: {},
      },
    };
    ```
    Also, verify your `frontend/src/index.css` contains:
    ```css
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    ```



