export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: "OPEN" | "IN_PROGRESS" | "CLOSED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "UNASSIGNED";
  aiSuggestedReply?: string;
  createdAt: string;
}
