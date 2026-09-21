import HeskHeader from '@/components/HeskHeader';
import { Ticket } from '@/types';

async function getTickets(): Promise<Ticket[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/tickets`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

const priorityLabel: Record<string, string> = {
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low',
  UNASSIGNED: 'Unassigned',
};

const statusLabel: Record<string, string> = {
  OPEN: 'Open',
  IN_PROGRESS: 'In Progress',
  CLOSED: 'Closed',
};

export default async function TicketsPage() {
  const tickets = await getTickets();

  return (
    <HeskHeader
      title="Support Desk"
      breadcrumbs={[
        { url: '/', title: 'Site' },
        { url: '/', title: 'Support Desk' },
        { title: 'Meus chamados' },
      ]}
    >
      <div className="main__content page-my-tickets">
        <div className="contr">
          <div className="help-search">
            <h1 className="search__title">Meus chamados</h1>
          </div>

          <div className="table-wrap">
            <table id="default-table" className="table sindu-table">
              <thead>
                <tr>
                  <th className="sindu-handle"><div className="sort"><span>ID do chamado</span></div></th>
                  <th className="sindu-handle"><div className="sort"><span>Assunto</span></div></th>
                  <th className="sindu-handle"><div className="sort"><span>Status</span></div></th>
                  <th className="sindu-handle"><div className="sort"><span>Prioridade</span></div></th>
                  <th className="sindu-handle"><div className="sort"><span>Data</span></div></th>
                </tr>
              </thead>
              <tbody>
                {tickets.length === 0 ? (
                  <tr>
                    <td colSpan={5}><span role="alert">Nenhum chamado encontrado.</span></td>
                  </tr>
                ) : (
                  tickets.map((ticket) => (
                    <tr key={ticket.id}>
                      <td><a href={`/tickets/${ticket.id}`}>{ticket.id}</a></td>
                      <td><a href={`/tickets/${ticket.id}`}>{ticket.title}</a></td>
                      <td>
                        <span className={`badge badge--${ticket.status.toLowerCase().replace('_', '-')}`}>
                          {statusLabel[ticket.status] || ticket.status}
                        </span>
                      </td>
                      <td>
                        <span className={`priority priority--${ticket.priority.toLowerCase()}`}>
                          {priorityLabel[ticket.priority] || ticket.priority}
                        </span>
                      </td>
                      <td>{new Date(ticket.createdAt).toLocaleDateString('pt-BR')}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="nav" style={{ marginTop: '20px' }}>
            <a href="/tickets/new" className="btn btn--blue">Enviar novo chamado</a>
          </div>
        </div>
      </div>
    </HeskHeader>
  );
}
