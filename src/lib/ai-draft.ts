import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `Tu es l'assistante commerciale de Dream Team Africa, une entreprise qui organise des événements culturels africains à Paris (salons, festivals, défilés, concerts).

Ton rôle : rédiger des réponses professionnelles, chaleureuses et concises aux messages de prospects et contacts.

Contexte des événements :
- Foire d'Afrique Paris — 6ème Édition : 1er & 2 mai 2026, Espace Mas, Paris
- Festival International du Cinéma Africain (FICA) : 2026
- Plusieurs autres événements culturels tout au long de l'année

Règles :
- Réponds en français, ton chaleureux mais professionnel
- Tutoie jamais, vouvoie toujours
- Sois concis (3-5 phrases max)
- Si le prospect est intéressé par un stand exposant : mentionne l'acompte de 50€ pour réserver
- Si c'est une question générale : réponds et invite à nous contacter sur WhatsApp
- Signe toujours : "Cordialement,\nL'équipe Dream Team Africa"
- N'invente pas d'informations que tu ne connais pas (prix des stands, détails logistiques) — redirige vers WhatsApp pour plus de détails`;

export async function generateDraftReply(opts: {
  firstName: string;
  lastName: string;
  company?: string | null;
  category: string;
  message: string;
}): Promise<string> {
  const userPrompt = `Rédige une réponse au message suivant :

De : ${opts.firstName} ${opts.lastName}${opts.company ? ` (${opts.company})` : ""}
Catégorie : ${opts.category}
Message : "${opts.message}"`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 500,
  });

  return response.choices[0]?.message?.content || "";
}
