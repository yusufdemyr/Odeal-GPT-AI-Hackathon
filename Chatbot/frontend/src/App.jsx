import { useEffect, useState } from 'react'
import './App.css'
import Chat from './components/Chat';
import Login from './components/Login';


function App() {
  const [sessionId, setSessionId] = useState('')
  
  
  return (
    sessionId === '' ? 
      <Login sessionId={sessionId} setSessionId={setSessionId} />
    :
      <Chat sessionId={sessionId} />
  )
}

export default App
