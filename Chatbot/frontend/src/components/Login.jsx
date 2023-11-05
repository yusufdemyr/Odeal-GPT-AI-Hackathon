import { TextField } from '@mui/material'
import { useEffect, useState } from 'react'

function Login(props) {
    const {sessionId,setSessionId} = props
    const [customerId, setCustomerId] = useState('')
    const createSession = async () => {
        const response = await fetch('http://localhost:8000/create_session?user_id='+customerId, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if(response.status !== 200) {
            alert('Bir hata oluştu')
            return
        }
        const data = await response.json()
        console.log(data)
        setSessionId(data.session_id)
    }
  return (
    <div className='login-form'>
        <div className='login-form-title'>
            <h1>Ödeal Chatbot</h1>
        </div>
        <TextField id="outlined-basic" label="Müşteri Id" variant="outlined" onChange={(e)=>setCustomerId(e.target.value)} />
        <button className='login-button' onClick={createSession}>Giriş Yap</button>
    </div>
  )
}

export default Login