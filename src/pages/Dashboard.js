import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [problem, setProblem] = useState('');
  const [response, setResponse] = useState('');
  const [history, setHistory] = useState([]);

  const submit = async () => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/sessions`, { problem });
      setResponse(res.data.conversation.join("\n"));
      fetchHistory();
    } catch (err) {
      alert("Erro ao processar");
    }
  };

  const fetchHistory = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/sessions`);
    setHistory(res.data);
  };

  useEffect(() => { fetchHistory(); }, []);

  return (
    <div>
      <h2>Validação dos 5 Porquês com IA</h2>
      <label htmlFor="problemInput">Descreva o problema:</label><br />
      <input id="problemInput" aria-label="Problema" placeholder="Ex: Produto com atraso" onChange={e => setProblem(e.target.value)} />
      <button aria-label="Começar análise dos 5 porquês" title="Executar análise" onClick={submit}>Começar 5 Porquês</button>
      {response && <pre>{response}</pre>}
      <h3>Histórico</h3>
      <ul>
        {history.map((h, i) => (
          <li key={i}>{h.problem} - {new Date(h.createdAt).toLocaleString()}</li>
        ))}
      </ul>
    </div>
  );
}
