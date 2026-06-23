import './App.css'
import { useState } from 'react'
import axios from "axios";

function App() {
  const [showRoles, setShowRoles] = useState(false);
  const [question, setQuestion] = useState("");
  const [allQuestions, setAllQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [history, setHistory] = useState([]);

  const getQuestion = async (role) => {
    const res = await axios.get(`http://localhost:5000/questions/${role}`);

    setAllQuestions(res.data);
    setCurrentIndex(0);
    setQuestion(res.data[0]);
    setAnswer("");
    setScore(null);
    setFeedback("");
  };

  const submitAnswer = () => {
    let calculatedScore = 0;
    let feedbackText = "";

    if (answer.length < 20) {
      calculatedScore = 3;
      feedbackText = "Your answer is too short. Please explain more clearly.";
    } else if (answer.length < 60) {
      calculatedScore = 6;
      feedbackText = "Good attempt. Add more details and examples.";
    } else {
      calculatedScore = 8;
      feedbackText = "Good answer. You explained the concept well.";
    }

    setScore(calculatedScore);
    setFeedback(feedbackText);

    setHistory([
      ...history,
      {
        question: question,
        answer: answer,
        score: calculatedScore,
        feedback: feedbackText
      }
    ]);
  };

  const nextQuestion = () => {
    if (currentIndex < allQuestions.length - 1) {
      const next = currentIndex + 1;

      setCurrentIndex(next);
      setQuestion(allQuestions[next]);
      setAnswer("");
      setScore(null);
      setFeedback("");
    } else {
      alert("Interview completed!");
    }
  };

  const startVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser. Please use Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      setAnswer(event.results[0][0].transcript);
    };

    recognition.start();
  };

  return (
    <div className="container">
      <h1>AI Mock Interview</h1>
      <p>Practice interviews and improve your confidence</p>

      <button onClick={() => setShowRoles(true)}>
        Start Interview
      </button>

      {showRoles && (
        <div>
          <h2>Select Role</h2>

          <button onClick={() => getQuestion("python")}>
            Python Developer
          </button>

          <button onClick={() => getQuestion("java")}>
            Java Developer
          </button>

          <button onClick={() => getQuestion("fullstack")}>
            Full Stack Developer
          </button>
        </div>
      )}

      {question && (
        <div className="question-box">
          <h3>
            Question {currentIndex + 1}: {question}
          </h3>

          <textarea
            placeholder="Type your answer here..."
            rows="5"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          ></textarea>

          <br />

          <button onClick={startVoiceInput}>🎤 Speak Answer</button>
          <button onClick={submitAnswer}>Submit Answer</button>
          <button onClick={nextQuestion}>Next Question</button>

          {score !== null && (
            <div className="score-box">
              <h2>Score: {score}/10</h2>
            </div>
          )}

          {feedback && (
            <div className="feedback-box">
              <h3>Feedback:</h3>
              <p>{feedback}</p>
            </div>
          )}
        </div>
      )}

      {history.length > 0 && (
        <div className="question-box">
          <h2>Interview History</h2>

          {history.map((item, index) => (
            <div key={index}>
              <p><b>Question:</b> {item.question}</p>
              <p><b>Answer:</b> {item.answer}</p>
              <p><b>Score:</b> {item.score}/10</p>
              <hr />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;