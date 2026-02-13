import { simpleParser } from 'mailparser';

export async function parseEmail(rawEmail: string): Promise<{
  subject: string;
  body: string;
  sender: string;
  timestamp: Date;
}> {
  const parsed = await simpleParser(rawEmail);

  const bodyText = parsed.text || '';
  const cleanedBody = stripEmailNoise(bodyText);

  return {
    subject: parsed.subject || '',
    body: cleanedBody,
    sender: parsed.from?.text || '',
    timestamp: parsed.date || new Date(),
  };
}

function stripEmailNoise(emailBody: string): string {
  let cleaned = emailBody.split(/Sent from|Best regards|Thanks|Sincerely/i)[0];

  cleaned = cleaned.replace(/^(From|To|Date|Subject):.*/gm, '');
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  cleaned = cleaned.replace(/_{5,}|On .* wrote:/g, '');

  return cleaned.trim();
}
