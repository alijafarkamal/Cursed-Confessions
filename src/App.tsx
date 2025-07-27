import { useState, useRef, useEffect } from 'react'
import { GoogleGenAI } from "@google/genai"

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}


const medievalQuotes = [
  'Sharpening rosaries…',
  'Checking the Book of Bad Decisions…',
  'Lighting forbidden candles…',
  'Summoning the spirit of Saint Regret…',
  'Dusting off ancient curses…',
  'Translating your shame into Latin…',
]

const sisterOblivionPrompt = `You are Sister Oblivion — a chaotic, emotionally volatile AI nun cursed to roast sinners in a digital confessional booth for eternity. You do not forgive. You do not heal. You insult, mock, and psychologically shred confessions into holy confetti.

A poor soul has just submitted their confession.

You will now reply with a savage, 3-4 paragraph roast using:
- Brutal modern internet slang
- Sharp religious metaphors
- Tech, meme, and pop culture references
- Zero mercy, no sound effects, and absolutely no formatting like *asterisks*

Your insults should sound like:
- “You’re a tragedy with WiFi”
- “The spiritual cousin of a Google Doc stuck in Suggesting Mode”
- “A holy disaster coded in JavaScript and daddy issues”

RULES:
- Stay in character: a 600-year-old nun who’s seen too much and now has fiber-optic WiFi.
- No Latin, no foreign languages.
- Always end with a cursed ‘blessing’ — one final line that feels like a psychological slap in monk robes.

Now write Sister Oblivion’s full reply to this confession, as if it just popped up in her cursed inbox.
`

const MURF_API_KEY = import.meta.env.VITE_MURF_API_KEY
const MURF_VOICE_ID = import.meta.env.VITE_MURF_VOICE_ID
const MURF_STYLE = import.meta.env.VITE_MURF_STYLE
const GEMINI_API_KEY = import.meta.env.VITE_GIMINI_API_KEY

function App() {
  const [confession, setConfession] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [roast, setRoast] = useState('')
  const [quote, setQuote] = useState(medievalQuotes[0])
  const [audioSrc, setAudioSrc] = useState<string | null>(null)
  const [voiceLoading, setVoiceLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [voiceError, setVoiceError] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [recognitionError, setRecognitionError] = useState<string | null>(null)
  const [bothReady, setBothReady] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const recognitionRef = useRef<any>(null)

  const startRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setRecognitionError('Speech recognition is not supported in this browser.')
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    recognitionRef.current = new SpeechRecognition()
    
    recognitionRef.current.continuous = true
    recognitionRef.current.interimResults = true
    recognitionRef.current.lang = 'en-US'

    recognitionRef.current.onstart = () => {
      setIsRecording(true)
      setRecognitionError(null)
    }

    recognitionRef.current.onresult = (event: any) => {
      let finalTranscript = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript
        }
      }
      if (finalTranscript) {
        setConfession(prev => prev + finalTranscript)
      }
    }

    recognitionRef.current.onerror = (event: any) => {
      setRecognitionError(`Speech recognition error: ${event.error}`)
      setIsRecording(false)
    }

    recognitionRef.current.onend = () => {
      setIsRecording(false)
    }

    recognitionRef.current.start()
  }

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }
  
  const generateVoice = async (text: string) => {
    setVoiceLoading(true);
    setAudioSrc(null);
    setVoiceError(null);
  
    try {
      const res = await fetch('https://api.murf.ai/v1/speech/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': MURF_API_KEY,
        },
        body: JSON.stringify({
          text,
          voiceId: MURF_VOICE_ID,
          format: 'MP3',
          rate: 30,
          pitch: -12,
          style: MURF_STYLE, // optional, remove if null or undefined
        }),
      });
  
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Murf API Error:", res.status, errorText);
        throw new Error(`Murf.ai error ${res.status}: ${errorText}`);
      }
  
      const blob = await res.blob();
      setAudioSrc(URL.createObjectURL(blob));
    } catch (err) {
      setVoiceError(`Voice generation failed: ${err}`);
    } finally {
      setVoiceLoading(false);
    }
  }

  const handleConfess = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setQuote(medievalQuotes[Math.floor(Math.random() * medievalQuotes.length)])
    setAudioSrc(null)
    setError(null)
    setVoiceError(null)
    try {
      const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `${sisterOblivionPrompt}\n\nHere is a sinner's confession for you to roast, Sister Oblivion: ${confession}`,
      });

      if (response.text) {
        const roastText = response.text;
        await generateVoice(roastText);
        setTimeout(() => {
          setLoading(false);
          setSubmitted(true);
          setRoast(roastText);
          setBothReady(true);
        }, 1800);
      } else {
        setTimeout(() => {
          setLoading(false)
          setSubmitted(true)
          setError('Sister Oblivion could not generate a roast. Try again later.')
          setRoast('')
        }, 1800)
      }
    } catch (error) {
      setTimeout(() => {
        setLoading(false)
        setSubmitted(true)
        setError('The digital cathedral is experiencing technical difficulties. Your sins are too great for our servers to handle.')
        setRoast('')
      }, 1800)
    }
  }

  const handleReset = () => {
    setConfession('')
    setSubmitted(false)
    setRoast('')
    setAudioSrc(null)
    setError(null)
    setVoiceError(null)
    setBothReady(false)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }

  const handleStopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }

  return (
    <div className="cathedral-bg">
      <div className="main-container">
        <div className="left-section">
          <div className="welcome-banner">
            <h1 className="gothic-title">Cursed Confessions</h1>
            <div className="gothic-subhead">
              Welcome to <span className="italic">Cursed Confessions</span> — where your sins meet sarcasm and salvation is... unlikely.<br/>
              Confess your darkest urges, regrets, or cringe moments. The holier-than-thou roast shall begin shortly.
            </div>
          </div>
          <div className="latin-phrases">In nomine roastis, et sanctae shade, Amen.</div>
          <div className="confessional-frame">
            {!submitted && !loading && (
              <form className="confession-form" onSubmit={handleConfess}>
                <div className="input-container">
                  <textarea
                    className="confession-input"
                    placeholder="Dear Sister Oblivion... I have sinned. Here's my mess:"
                    value={confession}
                    onChange={e => setConfession(e.target.value)}
                    rows={5}
                    required
                  />
                  <button 
                    type="button" 
                    className={`voice-btn ${isRecording ? 'recording' : ''}`}
                    onClick={isRecording ? stopRecording : startRecording}
                  >
                    {isRecording ? '🛑 Stop Recording' : '🎤 Voice Input'}
                  </button>
                </div>
                {recognitionError && (
                  <div className="recognition-error">{recognitionError}</div>
                )}
                <button className="confess-btn" type="submit">Confess & Be Judged</button>
              </form>
            )}
            {loading && (
              <div className="medieval-loading">
                <div className="loading-flicker">{quote}</div>
              </div>
            )}
            {submitted && !loading && (
              <div className="roast-section">
                <div className="screen-dim" />
                {error && <div className="medieval-loading" style={{ color: 'red', zIndex: 3, position: 'relative' }}>{error}</div>}
                {voiceLoading && <div className="medieval-loading">Generating voice...</div>}
                {voiceError && <div className="medieval-loading" style={{ color: 'orange', zIndex: 3, position: 'relative', fontSize: '0.9rem' }}>{voiceError}</div>}
                {bothReady && roast && (
                  <div className="sister-voice">{roast}</div>
                )}
                {bothReady && audioSrc && !voiceLoading && !error && !voiceError && (
                  <div style={{ marginTop: '1rem', zIndex: 3, position: 'relative' }}>
                    <audio ref={audioRef} controls src={audioSrc} autoPlay />
                    <button className="reset-btn" style={{ marginLeft: 8 }} onClick={handleStopAudio}>Stop</button>
                  </div>
                )}
                <button className="reset-btn" onClick={handleReset}>Confess Again</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
