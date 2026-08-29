import { NextResponse } from 'next/server';
import { db } from '../../../../data/db';
import { aiService } from '../../../../services/ai';
import { Ticket } from '../../../../types';

// This simulates a webhook receiver (e.g. GitHub issues webhook)
export async function POST(request: Request) {
  try {
    const payload = await request.json();
    
    // Simulate GitHub webhook payload structure
    if (payload.action === 'opened' && payload.issue) {
      const { title, body: description } = payload.issue;
      
      // Pass through AI Automation just like a normal ticket
      const aiAnalysis = await aiService.analyzeTicket(description || '');

      const newTicket: Ticket = {
        id: `github-${payload.issue.id || Math.random().toString(36).substring(7)}`,
        title: `[GitHub Issue] ${title}`,
        description: description || 'Sem descrição',
        status: 'OPEN',
        priority: aiAnalysis.priority,
        aiSuggestedReply: aiAnalysis.suggestedReply,
        createdAt: new Date().toISOString(),
      };

      db.addTicket(newTicket);
      return NextResponse.json({ message: 'Webhook received and ticket created' }, { status: 201 });
    }

    return NextResponse.json({ message: 'Ignored action' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid webhook payload' }, { status: 400 });
  }
}
