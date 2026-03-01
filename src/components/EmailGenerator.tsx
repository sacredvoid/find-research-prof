"use client";

import { useState } from "react";

interface EmailGeneratorProps {
  professorName: string;
  institution: string;
  topics: { name: string }[];
  recentPaperTitle?: string;
}

export default function EmailGenerator({
  professorName,
  institution,
  topics,
  recentPaperTitle,
}: EmailGeneratorProps) {
  const [open, setOpen] = useState(false);
  const [yourName, setYourName] = useState("");
  const [yourProgram, setYourProgram] = useState("");
  const [purpose, setPurpose] = useState<"phd" | "masters" | "undergrad" | "collab">("phd");

  const topicStr = topics.slice(0, 3).map((t) => t.name).join(", ");
  const lastName = professorName.split(" ").pop() || professorName;

  const templates: Record<string, string> = {
    phd: `Dear Professor ${lastName},

I am ${yourName || "[Your Name]"}, ${yourProgram ? `a student in ${yourProgram}` : "[your current program/position]"}. I am writing to express my interest in pursuing a Ph.D. under your supervision.

I have been following your research on ${topicStr || "[research area]"}${recentPaperTitle ? `, and I was particularly drawn to your recent paper "${recentPaperTitle}"` : ""}. Your work aligns closely with my research interests in [specific interest area].

[1-2 sentences about your relevant experience or why their work excites you.]

I would welcome the opportunity to discuss potential research opportunities in your lab. Would you have availability for a brief conversation?

Thank you for your time.

Best regards,
${yourName || "[Your Name]"}`,

    masters: `Dear Professor ${lastName},

I am ${yourName || "[Your Name]"}, ${yourProgram ? `a student in ${yourProgram}` : "[your current program/position]"}. I am exploring Master's programs and am very interested in ${topicStr || "[research area]"} at ${institution}.

${recentPaperTitle ? `Your recent paper "${recentPaperTitle}" caught my attention. ` : ""}I would love to learn more about research opportunities in your group and whether you are accepting Master's students.

[1-2 sentences about your background and what you hope to work on.]

Thank you for considering my inquiry.

Best regards,
${yourName || "[Your Name]"}`,

    undergrad: `Dear Professor ${lastName},

I am ${yourName || "[Your Name]"}, ${yourProgram ? `an undergraduate student in ${yourProgram}` : "an undergraduate student at [your university]"}. I am reaching out to inquire about research opportunities in your lab.

I am very interested in ${topicStr || "[research area]"}${recentPaperTitle ? `, and I found your paper "${recentPaperTitle}" fascinating` : ""}. I am eager to gain hands-on research experience in this area.

[1-2 sentences about relevant coursework or skills.]

Would it be possible to discuss any available positions for undergraduate researchers?

Thank you for your time.

Best regards,
${yourName || "[Your Name]"}`,

    collab: `Dear Professor ${lastName},

I am ${yourName || "[Your Name]"}, ${yourProgram ? `a researcher in ${yourProgram}` : "[your position and affiliation]"}. I am writing regarding a potential research collaboration.

Your work on ${topicStr || "[research area]"}${recentPaperTitle ? `, particularly "${recentPaperTitle},"` : ""} aligns with my current research in [your research area]. I believe there could be valuable synergies between our work.

[1-2 sentences about the specific collaboration idea.]

Would you be open to a brief meeting to discuss this further?

Best regards,
${yourName || "[Your Name]"}`,
  };

  const purposeLabels: Record<string, string> = {
    phd: "Ph.D. Application",
    masters: "Master's Inquiry",
    undergrad: "Undergrad Research",
    collab: "Research Collaboration",
  };

  const email = templates[purpose];
  const subject = purpose === "collab"
    ? `Research Collaboration Inquiry — ${topicStr || "[Topic]"}`
    : `Prospective ${purposeLabels[purpose]} Student — ${topicStr || "[Topic]"}`;

  function copyEmail() {
    navigator.clipboard.writeText(email);
  }

  function openMailto() {
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(email)}`;
    window.open(mailtoUrl, "_blank");
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 text-accent bg-accent-bg hover:bg-accent-border px-2.5 py-1 rounded-md font-medium transition-all text-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
          <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
        </svg>
        Draft Email
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-ink/30 z-50 flex items-center justify-center p-4">
      <div className="bg-paper rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-rule flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink">
            Draft Email to Prof. {lastName}
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="text-ink-tertiary hover:text-ink p-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-4 space-y-4">
          {/* Purpose selector */}
          <div>
            <label className="text-xs font-medium text-ink-tertiary uppercase tracking-widest block mb-2">
              Purpose
            </label>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(purposeLabels).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setPurpose(key as typeof purpose)}
                  className={`px-3 py-1 rounded-full text-sm transition-all ${
                    purpose === key
                      ? "bg-accent text-white font-medium"
                      : "text-ink-tertiary hover:text-ink-secondary bg-paper-elevated"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick fill fields */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-ink-tertiary block mb-1">
                Your Name
              </label>
              <input
                type="text"
                value={yourName}
                onChange={(e) => setYourName(e.target.value)}
                placeholder="Jane Smith"
                className="w-full bg-paper-inset border border-rule rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-ink-tertiary block mb-1">
                Your Program / Position
              </label>
              <input
                type="text"
                value={yourProgram}
                onChange={(e) => setYourProgram(e.target.value)}
                placeholder="Computer Science at Stanford"
                className="w-full bg-paper-inset border border-rule rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Email preview */}
          <div>
            <label className="text-xs font-medium text-ink-tertiary block mb-1">
              Subject: {subject}
            </label>
            <pre className="bg-paper-inset border border-rule rounded-lg p-4 text-sm text-ink whitespace-pre-wrap font-sans leading-relaxed max-h-64 overflow-y-auto">
              {email}
            </pre>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={copyEmail}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-accent text-white px-4 py-2 rounded-lg font-medium hover:bg-accent-hover transition-colors text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0117 6.622V12.5a1.5 1.5 0 01-1.5 1.5h-1v-3.379a3 3 0 00-.879-2.121L10.5 5.379A3 3 0 008.379 4.5H7v-1z" />
                <path d="M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L9.44 6.439A1.5 1.5 0 008.378 6H4.5z" />
              </svg>
              Copy to Clipboard
            </button>
            <button
              onClick={openMailto}
              className="inline-flex items-center justify-center gap-2 border border-accent text-accent px-4 py-2 rounded-lg font-medium hover:bg-accent-bg transition-colors text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
                <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
              </svg>
              Open in Email
            </button>
          </div>

          <p className="text-xs text-ink-tertiary leading-relaxed">
            Tip: Personalize the bracketed sections before sending. Professors value authentic, specific emails that show you&apos;ve read their work.
          </p>
        </div>
      </div>
    </div>
  );
}
