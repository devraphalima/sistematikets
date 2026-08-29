// Mock AI Service to represent "Automações com IA"
export const aiService = {
  analyzeTicket: async (description: string): Promise<{ priority: "LOW" | "MEDIUM" | "HIGH", suggestedReply: string }> => {
    // Simulate API delay (e.g., calling OpenAI or Gemini)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const text = description.toLowerCase();
    
    if (text.includes("urgente") || text.includes("fora do ar") || text.includes("quebrado") || text.includes("erro 500")) {
      return {
        priority: "HIGH",
        suggestedReply: "[🤖 IA Auto-Resposta] Olá! Notamos que sua solicitação é urgente. Nossa equipe técnica já foi notificada com prioridade máxima e está analisando o caso."
      };
    }

    if (text.includes("faturamento") || text.includes("boleto") || text.includes("pagamento")) {
      return {
        priority: "MEDIUM",
        suggestedReply: "[🤖 IA Auto-Resposta] Olá! Para questões financeiras, por favor, verifique a aba 'Financeiro' no seu painel. Se a dúvida persistir, um atendente falará com você em breve."
      };
    }

    return {
      priority: "LOW",
      suggestedReply: "[🤖 IA Auto-Resposta] Recebemos seu ticket! Em breve um de nossos analistas entrará em contato para ajudar."
    };
  }
}
