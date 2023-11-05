import Logo from '../assets/logo.png'
import SendIcon from '@mui/icons-material/Send';
import ScheduleSendIcon from '@mui/icons-material/ScheduleSend';
import { useEffect, useState } from 'react'

function Chat(props) {
    const { sessionId } = props
    const [input, setInput] = useState('')
    const [inputPlaceholder, setInputPlaceholder] = useState('Bir şeyler yazın...')
    const [isTyping, setIsTyping] = useState(false)
    const [conversation, setConversation] = useState([])

    const handleSend = async () => {
        if (input === '') {
            return
        }
        setIsTyping(true)
        setInput('')
        setInputPlaceholder('Yanıt bekleniyor...')
        //uuid ile soru id oluşturulacak
        let uuid = Math.random().toString(36).substring(7)

        const response = await fetch('http://localhost:8000/question?session_id=' + sessionId, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ question: input, question_id: uuid })
        })
        if (response.status !== 200) {
            alert('Bir hata oluştu')
            return
        }
        const data = await response.json()
        console.log(data)   

        setConversation([...conversation, { "question": input, "answer": data }])
        setIsTyping(false)
        // scroll to bottom
        
        setInputPlaceholder('Bir şeyler yazın...')
    }
    useEffect(() => {
        window.scrollTo(
            {
                top: document.documentElement.scrollHeight,
                behavior: 'smooth'
            }
        )
    },[])
    return (
        <>
            <div className='main'>
                <div className='header'>
                    <div className='header-title'>
                        <img src={Logo} alt='logo' />
                    </div>
                </div>
                <div className='chatbot-conversation'>
                    {conversation.map((item, index) => {
                        return (
                            <>
                                <div className='chatbot-conversation-item question'>{item.question}</div>
                                <div className='chatbot-conversation-item answer'>
                                    {/*inner html */}
                                    {(item.answer.image && item.answer.image !== "data:image/png;base64,") ? <img className="chat-img" src={item.answer.image} alt='chatbot-image' /> :
                                        <div dangerouslySetInnerHTML={{ __html: item.answer.response }}></div>}
                                </div>
                            </>
                        )
                    })}
                </div>
                <div className='chatbot-input-area'>
                    <div className='chatbot-input'>
                        <textarea type='text' placeholder={inputPlaceholder} value={input} onChange={(e) => setInput(e.target.value)} />
                        {isTyping ?
                            <div className='chatbot-input-typing-icon'>
                                <ScheduleSendIcon />
                            </div>
                            :
                            <div className='chatbot-input-send-icon' onClick={handleSend}>
                                <SendIcon />
                            </div>
                        }

                    </div>
                </div>
            </div>
        </>
    )
}

export default Chat