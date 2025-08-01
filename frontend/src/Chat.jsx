import { useState } from 'react'
import axios from 'axios'

function Chat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')

  const sendMessage = async () => {
    if (!input) return
    const userMessage = { role: 'user', text: input }
    setMessages(prev => [...prev, userMessage])

    const res = await axios.post('https://your-api-url/chat', { message: input }) // заменишь ссылку
    const botReply = { role: 'bot', text: res.data.response }

    setMessages(prev => [...prev, botReply])
    setInput('')
  }

  return (
    <div>
      <div style={{ maxHeight: '60vh', overflowY: 'auto', marginBottom: '1rem' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ textAlign: m.role === 'user' ? 'right' : 'left', margin: '0.5rem 0' }}>
            <strong>{m.role === 'user' ? 'You' : 'Bot'}:</strong> {m.text}
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && sendMessage()}
        style={{ width: '80%' }}
        placeholder="Введите сообщение..."
      />
      <button onClick={sendMessage}>Отправить</button>
    </div>
  )
}

export default Chat
