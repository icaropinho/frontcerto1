import React, { useState } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [problem, setProblem] = useState('');
  const [answer, setAnswer] = useState('');
  const [conversation, setConversation] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [question, setQuestion] = useState('');
  const [finalResult, setFinalResult] = useState(null);

  const api = process.env.REACT_APP_API_URL;

  const startSession = async () => {
    try {
      const res = await axios.post(`${api}/api/sessions`, { problem });
      setSessionId(res.data.sessionId);
      setConversation([`Problema: ${problem}`, `IA: ${res.data.question}`]);
      setQuestion(res.data.question);
    } catch (err) {
      alert("Erro ao iniciar análise.");
    }
  };

  const sendAnswer = async () => {
    if (!answer.trim()) return;
    try {
      const res = await axios.post(`${api}/api/sessions/${sessionId}`, {
        answer: answer.trim()
      });

      setConversation(prev => [...prev, `Usuário: ${answer}`]);
      setAnswer('');

      if (res.data.final) {
        setConversation(prev => [...prev, `IA: ${res.data.result}`]);
        setFinalResult(res.data.result);
        setQuestion('');
      } else {
        setConversation(prev => [...prev, `IA: ${res.data.question}`]);
        setQuestion(res.data.question);
      }
    } catch (err) {
      alert("Erro ao enviar resposta.");
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 20 }}>
      <h2>Técnica dos 5 Porquês com IA</h2>

      {!sessionId && (
        <>
          <label htmlFor="problemInput">Descreva o problema:</label><br />
          <input
            id="problemInput"
            placeholder="Ex: Produto com defeito"
            value={problem}
            onChange={e => setProblem(e.target.value)}
            style={{ width: '100%', marginBottom: 10 }}
          />
          <button onClick={startSession}>Iniciar</button>
        </>
      )}

      {sessionId && !finalResult && (
        <>
          <p><strong>{question}</strong></p>
          <input
            placeholder="Sua resposta..."
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            style={{ width: '100%', marginBottom: 10 }}
          />
          <button onClick={sendAnswer}>Responder</button>
        </>
      )}

      {finalResult && (
        <div style={{ background: '#f8f8f8', padding: 15, marginTop: 20, borderRadius: 8 }}>
          <strong>Resultado Final:</strong>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{finalResult}</pre>
        </div>
      )}

      <div style={{ marginTop: 30 }}>
        <h4>Histórico da Sessão:</h4>
        <ul>
          {conversation.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
