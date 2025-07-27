# 🏛️ Cursed Confessions

A darkly humorous web application where users confess their sins to **Sister Oblivion** — a deranged AI nun who roasts confessions with savage wit and modern internet slang.

## ✨ Features

- **🎤 Voice Input**: Speak your confessions using speech-to-text
- **🤖 AI Roasts**: Sister Oblivion delivers brutal 4-paragraph roasts
- **🎵 Voice Generation**: AI-generated voice reads the roasts aloud
- **📜 Medieval Aesthetic**: Gothic church theme with old manuscript styling
- **🎭 Interactive Experience**: Click to start voice recording, submit confessions

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/alijafarkamal/Cursed-Confessions
cd cursed-confessions
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Create a `.env` file in the root directory:

```env
# Google Gemini AI (for Sister Oblivion's roasts)
VITE_GIMINI_API_KEY=your_gemini_api_key_here

# Murf.ai (for text-to-speech voice generation)
VITE_MURF_API_KEY=your_murf_api_key_here
VITE_MURF_VOICE_ID=en-US-naomi
VITE_MURF_STYLE=Conversational
```

### 4. Get API Keys

#### Google Gemini AI
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key to `VITE_GIMINI_API_KEY`

#### Murf.ai
1. Visit [Murf.ai](https://murf.ai/)
2. Sign up and get your API key
3. Copy the key to `VITE_MURF_API_KEY`

### 5. Run the Application
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🎮 How to Use

1. **Confess Your Sins**: Type or speak your confession in the text area
2. **Voice Input**: Click the 🎤 button to record your confession by voice
3. **Submit**: Click "Confess & Be Judged" to send your confession to Sister Oblivion
4. **Receive Your Roast**: Wait for Sister Oblivion's savage response with voice
5. **Listen**: The roast will be read aloud by AI-generated voice
6. **Confess Again**: Click "Confess Again" to start over

## 🛠️ Technical Stack

- **Frontend**: React + TypeScript + Vite
- **AI Text Generation**: Google Gemini 2.5 Flash
- **Text-to-Speech**: Murf.ai API
- **Speech Recognition**: Web Speech API
- **Styling**: CSS with Gothic/Medieval theme

## 🎨 Features in Detail

### Voice Recording
- Uses browser's built-in Speech Recognition API
- Real-time speech-to-text conversion
- Works in Chrome, Edge, and Firefox
- Visual feedback during recording

### AI Roast Generation
- Powered by Google's Gemini 2.5 Flash model
- Sister Oblivion character with 600-year-old nun personality
- Modern internet slang and meme references
- 4-paragraph brutal roasts

### Voice Synthesis
- Murf.ai text-to-speech integration
- Synchronized text and audio display
- Automatic audio playback
- Manual controls for audio

### Visual Design
- Gothic cathedral background
- Old manuscript styling for input
- Medieval fonts and animations
- Responsive design for mobile

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Project Structure
```
src/
├── App.tsx          # Main application component
├── main.tsx         # Application entry point
├── index.css        # Global styles
└── assets/          # Static assets
```

## 🌐 Browser Compatibility

- ✅ Chrome (recommended)
- ✅ Edge
- ✅ Firefox
- ❌ Safari (limited speech recognition support)

## 🐛 Troubleshooting

### Voice Recording Not Working
- Ensure you're using a supported browser
- Check microphone permissions
- Try refreshing the page

### API Errors
- Verify your API keys are correct
- Check your `.env` file is in the root directory
- Restart the development server after adding API keys

### Audio Not Playing
- Check browser autoplay settings
- Ensure Murf.ai API key is valid
- Check browser console for errors

## 📝 License

This project is for educational and entertainment purposes.

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

---

**May Sister Oblivion have mercy on your soul... or not.** 🏛️👻
