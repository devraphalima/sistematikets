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
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Dúvida sobre faturamento",
    description: "Como faço para emitir a segunda via do boleto?",
    status: "CLOSED",
    priority: "LOW",
    createdAt: new Date().toISOString(),
  }
];

export const db = {
  getTickets: () => tickets,
  getTicketById: (id: string) => tickets.find((t) => t.id === id) || null,
  addTicket: (ticket: Ticket) => {
    tickets.push(ticket);
    return ticket;
  },
  updateTicket: (id: string, updates: Partial<Ticket>) => {
    const idx = tickets.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    tickets[idx] = { ...tickets[idx], ...updates };
    return tickets[idx];
  },
};
