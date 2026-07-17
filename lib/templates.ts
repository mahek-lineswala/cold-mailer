export type TemplateKey = "application" | "referral" | "followup";

export interface Template {
  label: string;
  subject: string;
  body: string; // HTML with {{variable}} placeholders
}

export const templates: Record<TemplateKey, Template> = {
  application: {
    label: "Job Application",
    subject: "Application for {{position}} at {{company}}",
    body: `
      <p>Dear Hiring Manager,</p>
      <p>I'm writing to express my interest in the <strong>{{position}}</strong> position at <strong>{{company}}</strong>. I believe my skills and experience make me a strong fit for this role.</p>
      <p>I've attached my resume for your review. I'd welcome the opportunity to discuss how I can contribute to your team.</p>
      <p>Thank you for your time and consideration.</p>
      <p>Best regards,<br/>{{yourName}}</p>
    `,
  },
  referral: {
    label: "Referral Request",
    subject: "Referral request for {{position}} at {{company}}",
    body: `
      <p>Hi {{recruiterName}},</p>
      <p>I hope you're doing well. I noticed {{company}} has an opening for <strong>{{position}}</strong>, and I'm very interested in applying.</p>
      <p>Would you be open to referring me for this role, or pointing me in the right direction? I've attached my resume for context.</p>
      <p>Thanks so much for considering — I really appreciate it.</p>
      <p>Best,<br/>{{yourName}}</p>
    `,
  },
  followup: {
    label: "Follow-up",
    subject: "Following up: {{position}} application at {{company}}",
    body: `
      <p>Hi {{recruiterName}},</p>
      <p>I wanted to follow up on my application for the <strong>{{position}}</strong> role at {{company}}, submitted on {{applicationDate}}.</p>
      <p>I remain very interested in the opportunity and would love to hear about next steps whenever convenient.</p>
      <p>Thank you again for your time.</p>
      <p>Best regards,<br/>{{yourName}}</p>
    `,
  },
};

export function fillTemplate(text: string, vars: Record<string, string>): string {
  return text.replace(/{{\s*(\w+)\s*}}/g, (_, key) => vars[key] ?? `{{${key}}}`);
}

export function extractVariables(template: Template): string[] {
  const matches = new Set<string>();
  const regex = /{{\s*(\w+)\s*}}/g;
  let m;
  for (const text of [template.subject, template.body]) {
    while ((m = regex.exec(text)) !== null) {
      matches.add(m[1]);
    }
  }
  return Array.from(matches);
}