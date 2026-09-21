import HeskHeader from '@/components/HeskHeader';
import { Ticket } from '@/types';

async function getTicket(id: string): Promise<Ticket | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/tickets/${id}`,
      { cache: 'no-store' }
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

const priorityLabel: Record<string, string> = {
  HIGH: 'Alta',
  MEDIUM: 'Média',
  LOW: 'Baixa',
  UNASSIGNED: 'Não atribuída',
};

const statusLabel: Record<string, string> = {
  OPEN: 'Aberto',
  IN_PROGRESS: 'Em andamento',
  CLOSED: 'Fechado',
};

export default async function ViewTicketPage({ params }: { params: { id: string } }) {
  const ticket = await getTicket(params.id);

  if (!ticket) {
    return (
      <HeskHeader
        title="Support Desk"
        breadcrumbs={[{ url: '/', title: 'Support Desk' }, { title: 'Chamado não encontrado' }]}
      >
        <div className="main__content">
          <div className="contr">
            <div className="alert alert--red">Chamado não encontrado.</div>
            <a href="/tickets" className="btn btn--blue" style={{ marginTop: '16px', display: 'inline-block' }}>
              Voltar aos chamados
            </a>
          </div>
        </div>
      </HeskHeader>
    );
  }

  return (
    <HeskHeader
      title="Support Desk"
      breadcrumbs={[
        { url: '/', title: 'Site' },
        { url: '/', title: 'Support Desk' },
        { url: '/tickets', title: 'Meus chamados' },
        { title: ticket.title },
      ]}
    >
      <div className="main__content page-view-ticket">
        <div className="contr">
          <div className="ticket">
            <div className="ticket__body">
              <article className="ticket__body_block original-message">
                <h1>{ticket.title}</h1>

                <div className="block--head">
                  <div className="d-flex">
                    <div className="contact grid">
                      <div className="requester-header"><span>Status:</span></div>
                      <div className="requester">
                        <span className={`badge badge--${ticket.status.toLowerCase().replace('_', '-')}`}>
                          {statusLabel[ticket.status] || ticket.status}
                        </span>
                      </div>
                    </div>
                    <div className="contact grid" style={{ marginLeft: '20px' }}>
                      <div className="requester-header"><span>Prioridade:</span></div>
                      <div className="requester">
                        <span className={`priority priority--${ticket.priority.toLowerCase()}`}>
                          {priorityLabel[ticket.priority] || ticket.priority}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="date" style={{ marginTop: '8px' }}>
                    <span>Enviado em: {new Date(ticket.createdAt).toLocaleString('pt-BR')}</span>
                  </div>
                </div>

                <div className="ticket__message" style={{ marginTop: '20px' }}>
                  <p>{ticket.description}</p>
                </div>
              </article>
            </div>
          </div>

          <div style={{ marginTop: '20px' }}>
            <a href="/tickets" className="btn btn--blue-border">← Voltar aos chamados</a>
          </div>
        </div>
      </div>
    </HeskHeader>
  );
}
