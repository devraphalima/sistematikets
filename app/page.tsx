'use client';

import { useEffect, useState } from 'react';
import TicketCard from '../components/TicketCard';
import NewTicketForm from '../components/NewTicketForm';
import { Ticket } from '../types';

export default function Home() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      // Consumindo nossa própria REST API
      const res = await fetch('/api/tickets');
      const data = await res.json();
      // Reverse to show newest first
      setTickets(data.reverse());
    } catch (error) {
      console.error("Failed to fetch tickets", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-8 text-black">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">TechStack Showcase</h1>
          <p className="text-gray-600">
            React, Next.js, Node.js (API Routes), REST API, Webhooks, GraphQL e Automação IA.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <NewTicketForm onTicketCreated={fetchTickets} />
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-bold text-gray-800 mb-2">Dica de Webhook</h3>
              <p className="text-xs text-gray-600 mb-4">
                Você pode simular um Webhook do GitHub enviando um POST para <code>/api/webhook/github</code>.
              </p>
              <h3 className="font-bold text-gray-800 mb-2">Dica GraphQL</h3>
              <p className="text-xs text-gray-600">
                Acesse <code>/api/graphql</code> no navegador para testar consultas GraphQL via Apollo Sandbox.
              </p>
            </div>
          </div>

          <div className="md:col-span-2">
            <h2 className="text-xl font-bold mb-4 text-gray-800 flex justify-between items-center">
              Tickets Recentes
              <button onClick={fetchTickets} className="text-sm font-normal text-blue-600 hover:underline">
                Atualizar
              </button>
            </h2>
            
            {loading ? (
              <p className="text-gray-500">Carregando tickets...</p>
            ) : tickets.length === 0 ? (
              <p className="text-gray-500">Nenhum ticket encontrado.</p>
            ) : (
              tickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
