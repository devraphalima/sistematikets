import { Ticket } from "../types";

// Mock Database (In-Memory)
// In a real app, this would be a connection to PostgreSQL, MongoDB, etc.
let tickets: Ticket[] = [
  {
    id: "1",
    title: "Sistema fora do ar",
    description: "Ninguém consegue fazer login na plataforma desde as 10h.",
    status: "OPEN",
    priority: "HIGH",
    aiSuggestedReply: "Pedimos desculpas pelo transtorno. Nossa equipe de engenharia já identificou o problema no servidor de autenticação e a previsão de normalização é em 30 minutos.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Dúvida sobre faturamento",
    description: "Como faço para emitir a segunda via do boleto?",
    status: "CLOSED",
    priority: "LOW",
    aiSuggestedReply: "Você pode emitir a segunda via diretamente no painel do cliente, na seção 'Financeiro' > 'Faturas'.",
    createdAt: new Date().toISOString(),
  }
];

export const db = {
  getTickets: () => tickets,
  addTicket: (ticket: Ticket) => {
    tickets.push(ticket);
    return ticket;
  }
};
