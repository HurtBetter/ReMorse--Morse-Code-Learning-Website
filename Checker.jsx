import './App.css';
import React, { useState, useEffect, useRef } from 'react';

function MorseSequenceMatcher() {
  // Morse code dictionary (letter to code)
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
  const [userSequence, setUserSequence] = useState('');
  const [feedback, setFeedback] = useState('');
  const [feedbackColor, setFeedbackColor] = useState('');
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  // Initialize with random letter
  useEffect(() => {
    generateRandomLetter();
  }, []);

  // Generate random letter
  const generateRandomLetter = () => {
    const letters = Object.keys(morseCode);
    const randomLetter = letters[Math.floor(Math.random() * letters.length)];
    setCurrentLetter(randomLetter);
    setUserSequence('');
    setFeedback('');
    setShowAnswer(false);
  };

  // Handle user input
  const handleInputChange = (e) => {
    const input = e.target.value;
    // Only allow dots, dashes, and backspace
    if (/^[.-]*$/.test(input) || input === '') {
      setUserSequence(input);
    }
  };

  // Check user's sequence
  const checkSequence = () => {
    if (userSequence === '') {
      setFeedback('Please enter a sequence');
      setFeedbackColor('orange');
      return;
    }

    if (userSequence === morseCode[currentLetter]) {
      // Correct answer
      setFeedback('Correct!');
      setFeedbackColor('green');
      setCorrectCount(prev => prev + 1);
      setStreak(prev => prev + 1);
      
      // Move to next letter after delay
      setTimeout(() => {
        generateRandomLetter();
      }, 1500);
    } else {
      // Incorrect answer
      setFeedback('Try again');
      setFeedbackColor('red');
      setStreak(0);
      setShowAnswer(true);
    }
  };

  // Handle key press (Enter key)
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      checkSequence();
    }
  };

  return (
    <div className="morse-trainer">
      <h2>Morse Code Sequence Matcher</h2>
      
      <div className="letter-display">
        <p>Match the Morse code for:</p>
        <div className="target-letter">{currentLetter}</div>
      </div>
      
      <div className="input-section">
        <input 
          type="text" 
          value={userSequence}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Enter sequence (e.g. .-)"
          className="sequence-input"
        />
        <button onClick={checkSequence}>Check</button>
      </div>
      
      {showAnswer && (
        <div className="correct-sequence">
          Correct sequence: <strong>{morseCode[currentLetter]}</strong>
        </div>
      )}
      
      <div className="feedback" style={{ color: feedbackColor }}>
        {feedback}
      </div>
      
      <div className="controls">
        <button onClick={generateRandomLetter}>Skip Letter</button>
        <button onClick={() => setShowAnswer(!showAnswer)}>
          {showAnswer ? 'Hide Answer' : 'Show Answer'}
        </button>
      </div>
      
      <div className="stats">
        <p>Correct: <span>{correctCount}</span></p>
        <p>Current streak: <span>{streak}</span></p>
      </div>
    </div>
  );
}

export default MorseSequenceMatcher;
