'use client';

import { useState } from 'react';

export default function NewTicketForm({ onTicketCreated }: { onTicketCreated: () => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });

      if (res.ok) {
        setTitle('');
        setDescription('');
        onTicketCreated(); // Refresh the list
      }
    } catch (error) {
      console.error('Failed to create ticket', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Criar Novo Ticket</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
        <input 
          type="text" 
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ex: Sistema fora do ar"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
        <textarea 
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Descreva o problema com detalhes..."
        />
        <p className="text-xs text-gray-500 mt-1">
          Dica: Use palavras como "urgente" ou "erro 500" para ver a IA categorizar como Prioridade Alta.
        </p>
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:bg-blue-300"
      >
        {loading ? 'Processando com IA...' : 'Enviar Ticket'}
      </button>
    </form>
  );
}
