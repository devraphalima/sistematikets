import { NextResponse } from 'next/server';
import { db } from '@/data/db';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const ticket = db.getTicketById(params.id);
  if (!ticket) {
    return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
  }
  return NextResponse.json(ticket);
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updated = db.updateTicket(params.id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
