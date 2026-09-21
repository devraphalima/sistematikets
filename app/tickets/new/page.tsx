'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import HeskHeader from '@/components/HeskHeader';

export default function NewTicketPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const form = e.currentTarget;
    const data = {
      title: (form.elements.namedItem('subject') as HTMLInputElement).value,
      description: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
    };

    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Falha ao criar ticket');
      const ticket = await res.json();
      router.push(`/tickets/${ticket.id}`);
    } catch {
      setError('Ocorreu um erro ao enviar o ticket. Tente novamente.');
      setLoading(false);
    }
  }

  return (
    <HeskHeader
      title="Support Desk"
      breadcrumbs={[
        { url: '/', title: 'Site' },
        { url: '/', title: 'Support Desk' },
        { title: 'Enviar chamado' },
      ]}
    >
      <div className="main__content page-create-ticket">
        <div className="contr">
          {error && (
            <div style={{ marginBottom: '20px' }}>
              <div className="alert alert--red">{error}</div>
            </div>
          )}

          <h1 className="article__heading article__heading--form">
            <span className="icon-in-circle" aria-hidden="true">
              <svg className="icon icon-submit-ticket">
                <use xlinkHref="/hesk/img/sprite.svg#icon-submit-ticket" />
              </svg>
            </span>
            <span className="ml-1">Enviar uma solicitação de suporte</span>
          </h1>

          <div className="article-heading-tip">
            <span>Os campos obrigatórios estão marcados com</span>
            <span className="label required"></span>
          </div>

          <form
            className="form form-submit-ticket ticket-create"
            onSubmit={handleSubmit}
            id="form1"
            name="form1"
          >
            <div className="form-group">
              <label className="label required" htmlFor="name">Nome:</label>
              <input type="text" id="name" name="name" className="form-control" maxLength={50} required />
            </div>

            <div className="form-group">
              <label className="label required" htmlFor="email">E-mail:</label>
              <input type="email" id="email" name="email" className="form-control" maxLength={1000} required />
            </div>

            <div className="form-group">
              <label className="label required" htmlFor="subject">Assunto:</label>
              <input type="text" id="subject" name="subject" className="form-control" maxLength={100} required />
            </div>

            <div className="form-group">
              <label className="label required" htmlFor="message">Mensagem:</label>
              <textarea id="message" name="message" className="form-control" rows={8} required />
            </div>

            <div className="form-group">
              <label className="label" htmlFor="priority">Prioridade:</label>
              <select id="priority" name="priority" className="form-control">
                <option value="LOW">Baixa</option>
                <option value="MEDIUM">Média</option>
                <option value="HIGH">Alta</option>
              </select>
            </div>

            <div className="form-group">
              <button type="submit" className="btn btn--blue" disabled={loading} id="submit-btn">
                {loading ? 'Enviando...' : 'Enviar chamado'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </HeskHeader>
  );
}
