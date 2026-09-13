import { NextResponse } from 'next/server';
import { db } from '../../../data/db';
import { aiService } from '../../../services/ai';
import { Ticket } from '../../../types';
import { db } from '@/data/db';
import { aiService } from '@/services/ai';
import { Ticket } from '@/types';

export async function GET() {
  const tickets = db.getTickets();
  return NextResponse.json(tickets);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description } = body;

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }

    // AI Automation: Analyze ticket to define priority and suggested reply
    const aiAnalysis = await aiService.analyzeTicket(description);

    const newTicket: Ticket = {
      id: Math.random().toString(36).substring(7),
      title,
      description,
      status: 'OPEN',
      priority: aiAnalysis.priority,
      aiSuggestedReply: aiAnalysis.suggestedReply,
      createdAt: new Date().toISOString(),
    };

    db.addTicket(newTicket);

    return NextResponse.json(newTicket, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
