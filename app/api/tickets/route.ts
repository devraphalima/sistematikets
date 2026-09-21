import { NextResponse } from 'next/server';
import { db } from '@/data/db';
import { Ticket } from '@/types';

export async function GET() {
  const tickets = db.getTickets();
  return NextResponse.json(tickets);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const title = body.title ?? body.subject;
    const description = body.description ?? body.message;
    const customerName = body.name;
    const customerEmail = body.email;

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }

    const newTicket: Ticket = {
      id: Math.random().toString(36).substring(7),
      title,
      description,
      customerName,
      customerEmail,
      status: 'OPEN',
      priority: body.priority ?? 'UNASSIGNED',
      createdAt: new Date().toISOString(),
    };

    db.addTicket(newTicket);

    return NextResponse.json(newTicket, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
