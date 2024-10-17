'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Star, Award, Trophy, Gift, ChevronUp, ChevronDown, Book, Calculator, MessageSquare, Send, Edit2 } from 'lucide-react'
import confetti from 'canvas-confetti'

const LiveBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const particles: { x: number; y: number; radius: number; color: string; vx: number; vy: number }[] = []

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        color: `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.1})`,
        vx: Math.random() * 2 - 1,
        vy: Math.random() * 2 - 1,
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach(particle => {
        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.x < 0 || particle.x > canvas.width) particle.vx = -particle.vx
        if (particle.y < 0 || particle.y > canvas.height) particle.vy = -particle.vy

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full -z-10" />
}

const FloatingWord = ({ children }: { children: React.ReactNode }) => {
  const [position, setPosition] = useState({ x: Math.random() * 100, y: Math.random() * 100 })
  const [direction, setDirection] = useState({ x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 })

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition(prev => {
        let newX = prev.x + direction.x
        let newY = prev.y + direction.y

        if (newX < 0 || newX > 100) {
          setDirection(prev => ({ ...prev, x: -prev.x }))
          newX = Math.max(0, Math.min(100, newX))
        }
        if (newY < 0 || newY > 100) {
          setDirection(prev => ({ ...prev, y: -prev.y }))
          newY = Math.max(0, Math.min(100, newY))
        }

        return { x: newX, y: newY }
      })
    }, 50)

    return () => clearInterval(interval)
  }, [direction])

  return (
    <div
      className="absolute text-white text-opacity-20 pointer-events-none select-none"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
        fontSize: '2rem',
        fontWeight: 'bold',
      }}
      aria-hidden="true"
    >
      {children}
    </div>
  )
}

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface ChatMessage {
  role: 'user' | 'teacher';
  content: string;
}

interface Badge {
  name: string;
  icon: string;
}

export default function GamifiedLearningUI() {
  const [xp, setXp] = useState(750)
  const [level, setLevel] = useState(1)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState('')
  const [showQuiz, setShowQuiz] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [score, setScore] = useState({ passed: 0, failed: 0 })
  const [currentQuiz, setCurrentQuiz] = useState<'general' | 'math'>('general')
  const [mathWhizUnlocked, setMathWhizUnlocked] = useState(false)
  const [activeTab, setActiveTab] = useState<'progress' | 'askTeacher' | 'badges'>('progress')
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [currentMessage, setCurrentMessage] = useState('')
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [lessonQuestions, setLessonQuestions] = useState<Question[]>([])
  const [currentLessonQuestion, setCurrentLessonQuestion] = useState(0)
  const [lessonCompleted, setLessonCompleted] = useState(false)
  const [showLessonQuiz, setShowLessonQuiz] = useState(false)
  const [lessonScore, setLessonScore] = useState(0)
  const [openBookAvailable, setOpenBookAvailable] = useState(true)
  const [earnedBadges, setEarnedBadges] = useState<Badge[]>([])
  const [username, setUsername] = useState('Student')
  const [isEditingUsername, setIsEditingUsername] = useState(false)

  useEffect(() => {
    const newLevel = Math.floor(xp / 1000) + 1
    if (newLevel !== level) {
      setLevel(newLevel)
    }
  }, [xp, level])

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [chatMessages])

  const badges: Badge[] = [
    { name: 'Quick Learner', icon: '🚀' },
    { name: 'Math Whiz', icon: '🧮' },
    { name: 'Science Pro', icon: '🔬' },
    { name: 'Language Master', icon: '🗣️' },
    { name: 'Quiz Master', icon: '🏆' },
  ]

  const leaderboard = [
    { name: 'Shadownet', xp: 5200 },
    { name: 'Klaus', xp: 4800 },
    { name: 'Peter', xp: 4600 },
    { name: 'David', xp: 4400 },
    { name: 'John', xp: 4200 },
  ]

  const challenges = [
    { name: 'Complete 5 lessons', reward: 100, progress: 3 },
    { name: 'Achieve 90% in a quiz', reward: 200, progress: 0 },
    { name: 'Earn the "Math Whiz" badge', reward: 300, progress: 0 },
  ]

  const generateLessonQuestions = (): Question[] => {
    const questions = [
      {
        question: "What is the capital of France?",
        options: ["Berlin", "Madrid", "Paris", "Rome"],
        correctAnswer: "Paris"
      },
      {
        question: "Who wrote 'Romeo and Juliet'?",
        options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
        correctAnswer: "William Shakespeare"
      },
      {
        question: "What is the chemical symbol for water?",
        options: ["H2O", "CO2", "NaCl", "O2"],
        correctAnswer: "H2O"
      },
      {
        question: "What is 15 x 7?",
        options: ["95", "105", "110", "120"],
        correctAnswer: "105"
      },
      {
        question: "What is the square root of 144?",
        options: ["10", "12", "14", "16"],
        correctAnswer: "12"
      },
      {
        question: "What is 3/4 as a percentage?",
        options: ["65%", "70%", "75%", "80%"],
        correctAnswer: "75%"
      },
      {
        question: "What planet is known as the Red Planet?",
        options: ["Mars", "Venus", "Jupiter", "Saturn"],
        correctAnswer: "Mars"
      },
      {
        question: "In which year did World War II end?",
        options: ["1939", "1941", "1945", "1950"],
        correctAnswer: "1945"
      },
      {
        question: "What is the largest planet in our solar system?",
        options: ["Earth", "Mars", "Jupiter", "Saturn"],
        correctAnswer: "Jupiter"
      },
      {
        question: "What is the boiling point of water in Celsius?",
        options: ["0°C", "50°C", "100°C", "200°C"],
        correctAnswer: "100°C"
      }
    ]
    return questions.sort(() => Math.random() - 0.5).slice(0, 10)
  }

  const startLessonQuiz = () => {
    setLessonQuestions(generateLessonQuestions())
    setCurrentLessonQuestion(0)
    setLessonCompleted(false)
    setLessonScore(0)
    setShowLessonQuiz(true)
  }

  const answerLessonQuestion = (selectedAnswer: string) => {
    const currentQuestion = lessonQuestions[currentLessonQuestion]
    if (!currentQuestion) return

    if (selectedAnswer === currentQuestion.correctAnswer) {
      setLessonScore(prevScore => prevScore + 1)
    } else {
      setXp(prevXp => prevXp - 10)
      setNotificationMessage("Incorrect answer. You've lost 10 XP. Consult the teacher and make short notes.")
      setShowNotification(true)
      setTimeout(() => setShowNotification(false), 5000)
    }

    if (currentLessonQuestion < lessonQuestions.length - 1) {
      setCurrentLessonQuestion(prevQuestion => prevQuestion + 1)
    } else {
      finishLessonQuiz()
    }
  }

  const finishLessonQuiz = () => {
    setLessonCompleted(true)
    if (lessonScore >= 6) {
      setXp(prevXp => prevXp + 50)
      setNotificationMessage("Congratulations! You've completed the lesson and earned 50 XP!")
      setOpenBookAvailable(false)
      
      // Award the Quiz Master badge
      if (!earnedBadges.some(badge => badge.name === 'Quiz Master')) {
        const quizMasterBadge = badges.find(badge => badge.name === 'Quiz Master')
        if (quizMasterBadge) {
          setEarnedBadges(prevBadges => [...prevBadges, quizMasterBadge])
          setNotificationMessage(prevMessage => prevMessage + " You've also earned the Quiz Master badge!")
        }
      }
    } else {
      setNotificationMessage("You didn't pass the lesson quiz. Please consult the teacher and try again later.")
    }
    setShowNotification(true)
    setTimeout(() => {
      setShowNotification(false)
      setShowLessonQuiz(false)
    }, 5000)
  }

  const giveUpLessonQuiz = () => {
    setShowLessonQuiz(false)
    setLessonCompleted(false)
    setCurrentLessonQuestion(0)
    setLessonScore(0)
    setNotificationMessage("You've given up on the lesson quiz. Keep practicing and try again later!")
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 5000)
  }

  const claimReward = (reward: number) => {
    setXp(prevXp => prevXp + reward)
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    } catch (error) {
      console.error("Error with confetti:", error)
    }
    setNotificationMessage(`Congratulations! You've earned ${reward} XP!`)
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 5000)
  }

  const sendMessage = () => {
    if (currentMessage.trim() === '') return

    const userMessage: ChatMessage = { role: 'user', content: currentMessage }
    setChatMessages(prevMessages => [...prevMessages, userMessage])
    setCurrentMessage('')

    setTimeout(() => {
      const teacherResponse: ChatMessage = { 
        role: 'teacher', 
        content: `Thank you for your question. As a teacher, I'm here to help you learn and grow. Could you please provide more context or specify what aspect of this topic you'd like me to explain further?`
      }
      setChatMessages(prevMessages => [...prevMessages, teacherResponse])
    }, 1000)
  }

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value)
  }

  const toggleUsernameEdit = () => {
    setIsEditingUsername(!isEditingUsername)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-blue-600 to-cyan-500 text-white p-8 relative overflow-hidden">
      <LiveBackground />
      <FloatingWord>MKU</FloatingWord>
      <FloatingWord>HACKATHON</FloatingWord>
      {showNotification && (
        <div className="fixed top-0 left-0 right-0 bg-green-500 text-white p-4 text-center transition-all duration-500 ease-in-out z-50">
          {notificationMessage}
        </div>
      )}
      <div className="max-w-4xl mx-auto relative z-10">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-4xl">
              👤
            </div>
            <div>
              <h1 className="text-2xl font-bold flex items-center">
                Welcome, 
                {isEditingUsername ? (
                  <input
                    type="text"
                    value={username}
                    onChange={handleUsernameChange}
                    onBlur={toggleUsernameEdit}
                    className="ml-2 bg-transparent border-b border-white focus:outline-none"
                    autoFocus
                  />
                ) : (
                  <span className="ml-2">{username}</span>
                )}
                <button onClick={toggleUsernameEdit} className="ml-2" aria-label="Edit username">
                  <Edit2 size={16} />
                </button>
              </h1>
              <p className="text-xl">Level {level}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">{xp} XP</p>
            <p>Next level: {(level * 1000) - xp} XP to go</p>
          </div>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="bg-white bg-opacity-20 rounded-lg p-6 backdrop-blur-lg col-span-2">
            <div className="flex space-x-4 mb-4">
              <button
                onClick={() => setActiveTab('progress')}
                className={`px-4 py-2 rounded-t-lg ${activeTab === 'progress' ? 'bg-white text-blue-600' : 'bg-blue-600 text-white'}`}
              >
                Progress
              </button>
              <button
                onClick={() => setActiveTab('askTeacher')}
                className={`px-4 py-2 rounded-t-lg ${activeTab === 'askTeacher' ? 'bg-white text-blue-600' : 'bg-blue-600 text-white'}`}
              >
                Ask Teacher
              </button>
              <button
                onClick={() => setActiveTab('badges')}
                className={`px-4 py-2 rounded-t-lg ${activeTab === 'badges' ? 'bg-white text-blue-600' : 'bg-blue-600 text-white'}`}
              >
                Badges
              </button>
            </div>
            {activeTab === 'progress' && (
              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <Star className="mr-2" /> Points & Progress
                </h2>
                <div className="w-full bg-white bg-opacity-30  rounded-full h-6 mb-4">
                  <div
                    className="bg-yellow-400 rounded-full h-6 transition-all duration-500 ease-out"
                    style={{ width: `${(xp % 1000) / 10}%` }}
                  ></div>
                </div>

                <button
                  onClick={startLessonQuiz}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300 mr-2"
                >
                  Complete Lesson
                </button>

                {openBookAvailable && (
                  <button
                    onClick={() => setShowQuiz(true)}
                    className="bg-blue-500  hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
                  >
                    <Book className="inline-block mr-2" /> Open Book
                  </button>
                )}

                {mathWhizUnlocked && (
                  <button
                    onClick={() => setShowQuiz(true)}
                    className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded transition duration-300 mt-2"
                  >
                    <Calculator className="inline-block mr-2" /> Math Whiz
                  </button>
                )}

                <div className="flex space-x-4 mt-4">
                  <button onClick={() => setXp(prevXp => prevXp + 100)}>
                    <ChevronUp className="text-2xl text-white" />
                  </button>
                  <button onClick={() => setXp(prevXp => prevXp - 100)}>
                    <ChevronDown className="text-2xl text-white" />
                  </button>
                </div>
              </div>
            )}
            {activeTab === 'askTeacher' && (
              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <MessageSquare className="mr-2" /> Ask Teacher
                </h2>
                <div 
                  ref={chatContainerRef}
                  className="bg-white bg-opacity-10 rounded-lg p-4 h-64 overflow-y-auto mb-4"
                >
                  {chatMessages.map((message, index) => (
                    <div key={index} className={`mb-2 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                      <span className={`inline-block p-2 rounded-lg ${message.role === 'user' ? 'bg-blue-500' : 'bg-green-500'}`}>
                        {message.role === 'teacher' && <strong>Teacher: </strong>}
                        {message.content}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex">
                  <input
                    type="text"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type your question here..."
                    className="flex-grow px-4 py-2 rounded-l-lg text-black"
                  />
                  <button
                    onClick={sendMessage}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-r-lg transition duration-300"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
            {activeTab === 'badges' && (
              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <Award className="mr-2" /> Badges
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {badges.map((badge, index) => (
                    <div key={index} className={`flex items-center space-x-2 rounded-lg p-2 ${earnedBadges.some(earned => earned.name === badge.name) ? 'bg-green-500' : 'bg-white bg-opacity-30'}`}>
                      <span className="text-3xl">{badge.icon}</span>
                      <span>{badge.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          <section className="bg-white bg-opacity-20 rounded-lg p-6 backdrop-blur-lg">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Trophy className="mr-2" /> Leaderboard
            </h2>
            <button
              onClick={() => setShowLeaderboard(!showLeaderboard)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 mb-4"
            >
              {showLeaderboard ? 'Hide Leaderboard' : 'Show Leaderboard'}
            </button>
            {showLeaderboard && (
              <ul className="space-y-2">
                {leaderboard.map((player, index) => (
                  <li key={index} className="flex justify-between items-center bg-white bg-opacity-30 rounded-lg p-2">
                    <span>{player.name}</span>
                    <span>{player.xp} XP</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="bg-white bg-opacity-20 rounded-lg p-6 backdrop-blur-lg">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Gift className="mr-2" /> Challenges & Rewards
            </h2>
            <ul className="space-y-4">
              {challenges.map((challenge, index) => (
                <li key={index} className="bg-white bg-opacity-30 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span>{challenge.name}</span>
                    <span className="font-bold">{challenge.reward} XP</span>
                  </div>
                  <div className="w-full bg-white bg-opacity-30 rounded-full h-4 mb-2">
                    <div
                      className="bg-green-400 rounded-full h-4 transition-all duration-500 ease-out"
                      style={{ width: `${(challenge.progress / 5) * 100}%` }}
                    ></div>
                  </div>
                  <button
                    onClick={() => claimReward(challenge.reward)}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded transition duration-300"
                  >
                    Claim Reward
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </main>

        {showLessonQuiz && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white text-black p-8 rounded-lg max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Lesson Quiz</h2>
                <div className="text-sm">
                  Question: {currentLessonQuestion + 1}/{lessonQuestions.length}
                </div>
              </div>
              {!lessonCompleted ? (
                <>
                  <p className="mb-4">{lessonQuestions[currentLessonQuestion]?.question}</p>
                  <div className="space-y-2">
                    {lessonQuestions[currentLessonQuestion]?.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => answerLessonQuestion(option)}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={giveUpLessonQuiz}
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mt-4"
                    aria-label="Give up on lesson quiz"
                  >
                    Give Up
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold mb-4">Lesson Quiz Completed!</h2>
                  <p className="mb-4">
                    You answered {lessonScore} out of {lessonQuestions.length} questions correctly.
                  </p>
                  <button
                    onClick={() => setShowLessonQuiz(false)}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                  >
                    Close
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {showQuiz && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white text-black p-8 rounded-lg max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">
                  {currentQuiz === 'general' ? 'General Knowledge' : 'Math Whiz'} Quiz
                </h2>
                <div className="text-sm">
                  Score: {score.passed}/{score.passed + score.failed}
                </div>
              </div>
              {!quizCompleted ? (
                <>
                  <p className="mb-4">Quiz question here</p>
                  <div className="space-y-2">
                    <button
                      onClick={() => setQuizCompleted(true)}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                    >
                      Answer Option
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
                  <p className="mb-4">
                    You answered {score.passed} out of {score.passed + score.failed} questions correctly.
                  </p>
                  <button
                    onClick={() => setShowQuiz(false)}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                  >
                    Finish Quiz
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        <footer className="mt-8 text-center">
          <p>Keep learning and leveling up! 🚀</p>
        </footer>
      </div>
    </div>
  )
}