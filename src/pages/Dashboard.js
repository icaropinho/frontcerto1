import React, { useState } from 'react';
import axios from 'axios';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Menu, MenuItem } from "@/components/ui/menu";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { MenuIcon, Moon, Sun, Download } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";

export default function Dashboard() {
  const [problem, setProblem] = useState('');
  const [answer, setAnswer] = useState('');
  const [conversation, setConversation] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [question, setQuestion] = useState('');
  const [finalResult, setFinalResult] = useState(null);

  const { theme, setTheme } = useTheme();
  const api = process.env.REACT_APP_API_URL;

  const startSession = async () => {
    try {
      const res = await axios.post(`${api}/api/sessions`, { problem });
      setSessionId(res.data.sessionId);
      setConversation([`🟡 Problema: ${problem}`, `🤖 ${res.data.question}`]);
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

      setConversation(prev => [...prev, `👤 ${answer}`]);
      setAnswer('');

      if (res.data.final) {
        setConversation(prev => [...prev, `✅ ${res.data.result}`]);
        setFinalResult(res.data.result);
        setQuestion('');
      } else {
        setConversation(prev => [...prev, `🤖 ${res.data.question}`]);
        setQuestion(res.data.question);
      }
    } catch (err) {
      alert("Erro ao enviar resposta.");
    }
  };

  const exportToTextFile = () => {
    const blob = new Blob([conversation.join('\n') + '\n' + finalResult], { type: 'text/plain' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "analise-5porques.txt";
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 text-gray-800 dark:text-gray-100">
      <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 shadow-md">
        <h1 className="text-xl font-bold">5 Porquês IA</h1>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <MenuIcon className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <Menu>
                <MenuItem>Início</MenuItem>
                <MenuItem>Sobre</MenuItem>
                <MenuItem>Contato</MenuItem>
              </Menu>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="max-w-3xl mx-auto py-10 px-4 space-y-6">
        {!sessionId && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardContent className="space-y-4 p-6">
                <label htmlFor="problemInput" className="block text-sm font-medium">Descreva o problema:</label>
                <Textarea
                  id="problemInput"
                  placeholder="Ex: Produto com defeito"
                  value={problem}
                  onChange={e => setProblem(e.target.value)}
                />
                <Button onClick={startSession} className="w-full">Iniciar Análise</Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {sessionId && !finalResult && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardContent className="space-y-4 p-6">
                <p className="text-lg font-medium">{question}</p>
                <Input
                  placeholder="Sua resposta..."
                  value={answer}
                  onChange={e => setAnswer(e.target.value)}
                />
                <Button onClick={sendAnswer} className="w-full">Responder</Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {finalResult && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="shadow-lg">
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-green-500">🎯 Resultado Final</h3>
                  <Button variant="outline" size="sm" onClick={exportToTextFile}>
                    <Download className="w-4 h-4 mr-2" /> Exportar
                  </Button>
                </div>
                <p className="whitespace-pre-wrap text-sm">{finalResult}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="p-6 space-y-2">
              <h4 className="text-md font-semibold">📜 Histórico da Sessão</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {conversation.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}

      </div>
    </div>
  );
}
