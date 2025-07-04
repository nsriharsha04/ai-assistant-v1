import React, { useState, useEffect, useRef } from 'react';

interface Message {
  speaker: 'user' | 'jarvis';
  text: string;
}

const App: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [conversation, setConversation] = useState<Message[]>([]);
  const [showTranscript, setShowTranscript] = useState(true);
  const [expectingWakeWord, setExpectingWakeWord] = useState(false); 
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    console.log('App component mounted. Initializing audio.');
    // Initialize Audio element for playing TTS
    audioRef.current = new Audio();
    audioRef.current.onended = () => {
      setIsSpeaking(false);
      console.log('Audio playback ended.');
    };

    // Request microphone access
    console.log('Requesting microphone access...');
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        console.log('Microphone access granted.');
        mediaRecorderRef.current = new MediaRecorder(stream);

        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
          console.log('Audio data available.', event.data.size, 'bytes');
        };

        mediaRecorderRef.current.onstop = async () => {
          console.log('MediaRecorder stopped.');
          setIsListening(false);
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          audioChunksRef.current = []; // Clear chunks for next recording
          console.log('Audio blob created.', audioBlob.size, 'bytes');
          await transcribeAudio(audioBlob);
        };
      })
      .catch(err => {
        console.error('Error accessing microphone:', err);
      });
  }, []);

  const transcribeAudio = async (audioBlob: Blob) => {
    console.log('Sending audio for transcription...');
    const formData = new FormData();
    formData.append('audio_file', audioBlob, 'audio.webm');

    try {
      const res = await fetch('http://localhost:8000/api/transcribe', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      const userTranscript = data.transcript;
      console.log('Transcription received:', userTranscript);

      if (expectingWakeWord) {
        if (userTranscript.toLowerCase().includes('hey jarvis')) {
          console.log('Wake word detected. Proceeding with conversation.');
          setExpectingWakeWord(false);
          setConversation(prev => [...prev, { speaker: 'user', text: userTranscript }]);
          await sendToJarvis(userTranscript);
        } else {
          console.log('Wake word not detected. Prompting user.');
          // Play a prompt to the user
          const prompt = "Please say 'Hey Jarvis' to begin.";
          setConversation(prev => [...prev, { speaker: 'jarvis', text: prompt }]);
          playAudioFromText(prompt); // Use a separate function for playing prompts
        }
      } else {
        setConversation(prev => [...prev, { speaker: 'user', text: userTranscript }]);
        await sendToJarvis(userTranscript);
      }

    } catch (error) {
      console.error('Error transcribing audio:', error);
    }
  };

  const sendToJarvis = async (message: string) => {
    console.log('Sending message to Jarvis:', message);
    try {
      const res = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      const jarvisResponse = data.response;
      const audioBase64 = data.audio;
      console.log('Jarvis response received:', jarvisResponse);

      setConversation(prev => [...prev, { speaker: 'jarvis', text: jarvisResponse }]);
      playAudio(audioBase64);
    } catch (error) {
      console.error('Error sending message to server:', error);
    }
  };

  const playAudio = (base64String: string) => {
    console.log('Playing audio from base64 string...');
    if (audioRef.current) {
      const audioBlob = base64toBlob(base64String, 'audio/mpeg'); // Assuming mpeg from OpenAI TTS
      const audioUrl = URL.createObjectURL(audioBlob);
      audioRef.current.src = audioUrl;
      audioRef.current.play();
      setIsSpeaking(true);
      console.log('Audio playback started.');
    }
  };

  const playAudioFromText = async (text: string) => {
    console.log('Playing audio from text (for prompts):', text);
    try {
      const res = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: text }), // Send the prompt text to get audio
      });
      const data = await res.json();
      const audioBase64 = data.audio;
      playAudio(audioBase64);
    } catch (error) {
      console.error('Error playing audio from text:', error);
    }
  };

  const base64toBlob = (base64: string, type: string) => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: type });
  };

  const handleOrbClick = () => {
    if (mediaRecorderRef.current) {
      if (isListening) {
        console.log('Stopping recording.');
        mediaRecorderRef.current.stop();
      } else {
        console.log('Starting recording.');
        audioChunksRef.current = []; // Clear previous chunks
        mediaRecorderRef.current.start();
        setIsListening(true);
      }
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center font-mono p-4">
      <div className="w-full max-w-2xl text-center p-4">
        <h1 className="text-5xl font-bold text-cyan-400 mb-4">JARVIS</h1>
        {/* <p className="text-lg text-cyan-300">Your Personal AI Assistant</p> */}
      </div>

      <div className="relative my-8">
        <div
          className={`w-48 h-48 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ease-in-out 
            ${isListening ? 'bg-cyan-600 shadow-[0_0_40px_15px_rgba(0,255,255,0.7)]' : 'bg-gray-800 shadow-lg'}
            ${isSpeaking ? 'animate-pulse-strong' : ''}`}
          onClick={handleOrbClick}
        >
          <div className="w-32 h-32 rounded-full bg-gray-900 flex items-center justify-center">
            <div className={`w-24 h-24 rounded-full transition-all duration-300 
              ${isListening ? 'bg-cyan-400' : 'bg-gray-700'}
              ${isSpeaking ? 'animate-ping-slow' : ''}
            `}></div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-2xl p-4 text-center">
        <p className="text-lg mb-2 text-gray-300">
          {isListening ? 'Listening...' : (expectingWakeWord ? 'Click the orb and say "Hey Jarvis"' : 'Click the orb to speak')}
        </p>
        <button
          onClick={() => setShowTranscript(!showTranscript)}
          className="mt-2 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
        >
          {showTranscript ? 'Hide Transcript' : 'Show Transcript'}
        </button>

        {showTranscript && (
          <div className="mt-6 p-4 bg-gray-800 rounded-lg max-h-60 overflow-y-auto text-left">
            {conversation.map((msg, index) => (
              <p key={index} className={`mb-2 ${msg.speaker === 'user' ? 'text-gray-400' : 'text-cyan-300'}`}>
                <strong>{msg.speaker === 'user' ? 'You:' : 'Jarvis:'}</strong> {msg.text}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
