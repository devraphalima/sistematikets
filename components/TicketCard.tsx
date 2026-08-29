import { Ticket } from '../types';

export default function TicketCard({ ticket }: { ticket: Ticket }) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-800 border-red-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LOW': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-5 mb-4 shadow-sm bg-white hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-900">{ticket.title}</h3>
        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded border ${getPriorityColor(ticket.priority)}`}>
          {ticket.priority}
        </span>
      </div>
      <p className="text-gray-600 text-sm mb-4">{ticket.description}</p>
      
      {ticket.aiSuggestedReply && (
        <div className="mt-4 bg-blue-50 border border-blue-100 rounded p-3">
          <p className="text-xs font-bold text-blue-800 mb-1 flex items-center">
            <span className="mr-1">🤖</span> IA Sugestão de Resposta:
          </p>
          <p className="text-sm text-blue-900">{ticket.aiSuggestedReply}</p>
        </div>
      )}
      
      <div className="mt-4 text-xs text-gray-400">
        Criado em: {new Date(ticket.createdAt).toLocaleString()}
      </div>
    </div>
  );
}
