import './App.css';
import React, { useState, useEffect, useRef } from 'react';

function MorseCodeTrainer() {
  // Morse code dictionary
  const morseCode = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.',
    'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---',
    'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---',
    'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-',
    'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--',
    'Z': '--..'
  };

  // State management
  const [currentLetter, setCurrentLetter] = useState('');
  const [userGuess, setUserGuess] = useState('');
  const [feedback, setFeedback] = useState('');
  const [feedbackColor, setFeedbackColor] = useState('');
  const [correctCount, setCorrectCount] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  
  // Audio context ref
  const audioCtxRef = useRef(null);

  // Audio parameters
  const dotDuration = 100;
  const dashDuration = 300;
  const elementGap = 100;
  const letterGap = 300;

  // Initialize component
  useEffect(() => {
    generateRandomLetter();
  }, []);

  // Play morse code when currentLetter changes
  useEffect(() => {
    if (currentLetter) {
      playMorseCode();
    }
  }, [currentLetter]);

  // Generate random letter
  const generateRandomLetter = () => {
    const letters = Object.keys(morseCode);
    const randomLetter = letters[Math.floor(Math.random() * letters.length)];
    setCurrentLetter(randomLetter);
    setUserGuess('');
    setFeedback('');
  };

  // Play a single beep
  const playBeep = (startTime, duration) => {
    const oscillator = audioCtxRef.current.createOscillator();
    const gainNode = audioCtxRef.current.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.value = 600;
    oscillator.connect(gainNode);
    gainNode.connect(audioCtxRef.current.destination);
    
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(1, startTime + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, startTime + duration/1000);
    
    oscillator.start(startTime);
    oscillator.stop(startTime + duration/1000 + 0.01);
  };

  // Play the current letter's morse code
  const playMorseCode = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new window.AudioContext();
    }
    
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }

    const code = morseCode[currentLetter];
    let time = audioCtxRef.current.currentTime;
    
    code.split('').forEach((symbol, index) => {
      const duration = symbol === '.' ? dotDuration : dashDuration;
      playBeep(time, duration);
      time += duration / 1000 + elementGap / 1000;
      
      if (index === code.length - 1) {
        time += letterGap / 1000;
      }
    });
  };

  // Handle user input change
  const handleInputChange = (e) => {
    setUserGuess(e.target.value.toUpperCase());
  };

  // Check user's answer
  const checkAnswer = () => {
    if (!userGuess) {
      setFeedback('Please enter a letter');
      setFeedbackColor('orange');
      return;
    }
    
    if (userGuess === currentLetter) {
      // Correct answer
      setFeedback('Correct!');
      setFeedbackColor('green');
      setCorrectCount(prev => prev + 1);
      setCurrentStreak(prev => prev + 1);
      
      // Move to next letter after short delay
      setTimeout(() => {
        generateRandomLetter();
      }, 1000);
    } else {
      // Incorrect answer
      setFeedback('Try again');
      setFeedbackColor('red');
      setCurrentStreak(0);
      setUserGuess('');
    }
  };

  // Handle key press (Enter key)
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      checkAnswer();
    }
  };

  return (
    <div className="morse-trainer">
      <h2>Morse Code Trainer</h2>
      <div className="audio-controls">
        <button onClick={playMorseCode}>Play Morse Code</button>
      </div>
      <div className="user-input">
        <input 
          type="text" 
          value={userGuess}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          maxLength={1} 
          placeholder="Enter letter"
        />
        <button onClick={checkAnswer}>Submit</button>
      </div>
      <div className="feedback" style={{ color: feedbackColor }}>
        {feedback}
      </div>
      <div className="stats">
        <p>Correct: <span>{correctCount}</span></p>
        <p>Current streak: <span>{currentStreak}</span></p>
      </div>
    </div>
  );
}

export default MorseCodeTrainer;
