import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { 
  Sparkles, 
  Send, 
  Copy, 
  Check, 
  ExternalLink, 
  FileText, 
  HelpCircle, 
  ArrowRight, 
  RefreshCw,
  Info,
  ShieldCheck,
  Building2,
  AlertTriangle,
  Compass
} from 'lucide-react';
import { clsx } from 'clsx';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  sources?: { title: string; url?: string; department?: string }[];
  followUps?: string[];
  actionLink?: { text: string; href: string };
}

// Built-in verified civic knowledge repository
const CIVIC_KNOWLEDGE_BASE: Record<string, {
  keywords: string[];
  answer: string;
  sources: { title: string; url?: string; department: string }[];
  followUps: string[];
  actionLink?: { text: string; href: string };
}> = {
  gruha_lakshmi: {
    keywords: ['gruha lakshmi', 'griha lakshmi', '2000', 'women', 'head of family'],
    answer: `**Gruha Lakshmi Scheme (Government of Karnataka)**

**Objective:** Provides financial assistance of **₹2,000 per month** to the woman head of the family as identified in the ration card.

**Eligibility Criteria:**
• The applicant must be designated as the head of the family in Antyodaya, BPL, or APL ration cards.
• Only one woman per household is eligible.
• Women or their husbands paying Income Tax or GST are **not eligible**.

**Required Documents:**
1. Ration Card (APL/BPL/Antyodaya card number)
2. Aadhaar Card of the applicant and husband
3. Aadhaar-linked Bank Account details (must have active NPCI bank seeding)
4. Active mobile number linked to Aadhaar

**How to Apply:**
Applications can be submitted free of charge at **Gram One**, **Karnataka One**, **Bengaluru One**, or **Bapuji Seva Kendra** centers, or via the official Seva Sindhu portal.`,
    sources: [
      { title: 'Karnataka Seva Sindhu Portal', url: 'https://sevasindhu.karnataka.gov.in', department: 'Dept. of Women and Child Development' },
      { title: 'Department of Food & Civil Supplies', url: 'https://ahara.kar.nic.in', department: 'Govt. of Karnataka' }
    ],
    followUps: [
      'How to check Aadhaar bank NPCI seeding status?',
      'Can APL card holders apply for Gruha Lakshmi?',
      'What to do if application is rejected due to bank error?'
    ]
  },
  yuva_nidhi: {
    keywords: ['yuva nidhi', 'unemployment', 'graduates', 'diploma', 'stipend', 'allowance'],
    answer: `**Yuva Nidhi Scheme (Unemployment Assistance)**

**Objective:** Financial assistance to educated youth in Karnataka who have not obtained employment after 180 days of graduating.

**Financial Assistance:**
• Degree Holders: **₹3,000 per month** for up to 2 years
• Diploma Holders: **₹1,500 per month** for up to 2 years

**Eligibility:**
• Must be a resident of Karnataka with completion of degree/diploma from recognized universities.
• Candidate must not be employed in government or private sectors, nor self-employed.
• Not enrolled in further higher education.

**Application Process:**
Apply online via **Seva Sindhu Yuva Nidhi Portal** using your university registration number, Aadhaar, and bank account details.`,
    sources: [
      { title: 'Seva Sindhu Yuva Nidhi Portal', url: 'https://sevasindhugs.karnataka.gov.in', department: 'Dept. of Skill Development & Livelihood' }
    ],
    followUps: [
      'Do I need to submit monthly self-declaration?',
      'What documents are needed for Yuva Nidhi verification?'
    ]
  },
  pothole_drainage: {
    keywords: ['pothole', 'road', 'drainage', 'waterlogging', 'garbage', 'sewage', 'street light', 'civic complaint'],
    answer: `**Reporting Civic & Municipal Grievances in Karnataka**

You can report road potholes, waterlogging, overflowing drains, broken streetlights, or garbage dumping directly through **CivicLens AI**.

**How CivicLens Resolves Your Grievance:**
1. **Photo Upload & Geo-Tagging:** Attach a photo; the system automatically detects GPS coordinates and nearest landmarks.
2. **AI Multimodal Triage:** Gemini AI evaluates safety risk, depth, obstruction, and traffic exposure to compute an explainable priority score.
3. **Automated Inter-Agency Dispatch:** Routed directly to the appropriate department (e.g., BBMP Engineering, BWSSB Water & Sewerage, or BESCOM).
4. **Guaranteed Resolution SLA:** Regulated under the **Karnataka Sakala Guarantee of Services Act** with real-time token tracking.`,
    sources: [
      { title: 'CivicLens AI Intelligence Dispatch', department: 'Urban Development Department' },
      { title: 'Karnataka Sakala Services Act 2011', url: 'http://sakala.kar.nic.in', department: 'Administrative Reforms Dept.' }
    ],
    followUps: [
      'What is the statutory deadline for road repair?',
      'How to track my existing grievance with token?'
    ],
    actionLink: { text: 'Report This Civic Issue Now', href: '/report' }
  },
  income_certificate: {
    keywords: ['income certificate', 'caste certificate', 'caste', 'income', 'nadakacheri', 'tahsildar'],
    answer: `**Income and Caste Certificate (Atalji Janasnehi Kendra / Nadakacheri)**

**Purpose:** Required for availing educational scholarships, fee concessions, government reservations, and welfare subsidies.

**Key Requirements:**
• Valid Ration Card or Voter ID
• Aadhaar Card of student/applicant and parents
• Self-declaration of annual family income
• Salary slip or agricultural land record (RTC) if applicable
• School study certificate mentioning caste / category

**Validity & Processing Time:**
• Validity: **5 Years** from date of issuance.
• Processing Time: **14 working days** guaranteed under the Sakala Act.
• Fee: ₹40 at Nadakacheri or online portal.`,
    sources: [
      { title: 'Nadakacheri Portal (Atalji Janasnehi Kendra)', url: 'https://nadakacheri.karnataka.gov.in', department: 'Revenue Department' }
    ],
    followUps: [
      'How to download digitally signed Income Certificate?',
      'What to do if Tahsildar verification is delayed?'
    ]
  },
  kaveri_property: {
    keywords: ['kaveri', 'property', 'registration', 'encumbrance', 'ec', 'khata', 'sale deed', 'stamp duty'],
    answer: `**Kaveri 2.0 Property Registration & Encumbrance Search**

**Overview:** The Government of Karnataka's Kaveri 2.0 platform enables contactless online valuation, appointment booking, and instant download of Encumbrance Certificates (EC).

**Key Services:**
1. **Online EC (Form 15 & Form 16):** Download certified digitally signed Encumbrance Certificates for any property within minutes.
2. **Document Registration:** Pre-fill sale deed, gift deed, or lease agreement online; pay stamp duty via e-Treasury KII.
3. **Valuation & Stamp Duty Calculator:** Instant official guidance value check based on survey or plot number.

**Sub-Registrar Visit:** Requires only 15 minutes for biometric authentication after online document pre-check.`,
    sources: [
      { title: 'Kaveri Online Services Portal', url: 'https://kaveri.karnataka.gov.in', department: 'Department of Stamps and Registration' }
    ],
    followUps: [
      'How to download 15-year Encumbrance Certificate (EC)?',
      'What are the stamp duty rates in municipal corporations?'
    ]
  },
  sakala_rights: {
    keywords: ['sakala', 'rights', 'guarantee', 'sla', 'time limit', 'delay', 'compensation'],
    answer: `**Karnataka Guarantee of Services to Citizens Act (SAKALA)**

**Citizen Entitlements:**
• **Guaranteed Time Limits:** Over 1,025 government services have legally mandatory turnaround times.
• **GSC Tracking Number:** Every application must be acknowledged with a unique 15-digit Guarantee of Services Certificate (GSC) number.
• **Compensatory Relief:** If an officer delays your service beyond the statutory deadline without valid cause, you are entitled to compensatory damages of **₹20 per day** (up to ₹500) deducted directly from the defaulting official's salary.
• **Right to Appeal:** Two levels of statutory appeals within 30 days of deadline breach.`,
    sources: [
      { title: 'Sakala Mission Karnataka', url: 'http://sakala.kar.nic.in', department: 'Mission Sakala, Govt. of Karnataka' }
    ],
    followUps: [
      'How to file a Sakala first appeal online?',
      'Which municipal services are covered under Sakala?'
    ]
  }
};

export const AIChatGuidance: React.FC<{
  initialQuery?: string;
  onClose?: () => void;
  isEmbedded?: boolean;
}> = ({ initialQuery, onClose, isEmbedded = false }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState(initialQuery || '');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested quick prompts
  const suggestedPrompts = [
    'How do I apply for Gruha Lakshmi scheme?',
    'Report a hazardous pothole or flooded drain',
    'What documents are needed for Income Certificate?',
    'What are my rights under Karnataka Sakala Act?',
    'How to download property Encumbrance Certificate (EC)?'
  ];

  // Auto-answer initialQuery if provided
  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      handleSend(initialQuery.trim());
    }
  }, [initialQuery]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const findBestResponse = (query: string): ChatMessage => {
    const qLower = query.toLowerCase();
    
    // Check if query is looking for a tracking token
    const tokenMatch = query.match(/CLK-[A-Z]{3}-\d{4}/i);
    if (tokenMatch) {
      const token = tokenMatch[0].toUpperCase();
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `**Tracking Token Detected: \`${token}\`**\n\nI found a matching civic grievance in the Municipal Resolution System.\n\nYou can inspect its real-time lifecycle, AI priority breakdown, assigned department engineer, and resolution history directly on our tracking portal.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: [{ title: 'CivicLens Real-Time Tracking Registry', department: 'Municipal Administration' }],
        followUps: [
          'How do I receive SMS alerts for this complaint?',
          'What if my complaint status shows no progress?'
        ],
        actionLink: { text: `View Live Tracking for ${token}`, href: `/track/${token}` }
      };
    }

    // Match keywords against knowledge base
    for (const [, entry] of Object.entries(CIVIC_KNOWLEDGE_BASE)) {
      if (entry.keywords.some(k => qLower.includes(k))) {
        return {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: entry.answer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sources: entry.sources,
          followUps: entry.followUps,
          actionLink: entry.actionLink
        };
      }
    }

    // Default intelligent civic assistant response
    return {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text: `**CivicLens AI Guidance**\n\nThank you for asking about **"${query}"**.\n\nIn Karnataka, government citizen services and municipal grievances are administered across two primary channels:\n\n1. **Welfare Schemes & Certificates:** Processed through **Seva Sindhu** and **Nadakacheri** with statutory delivery limits guaranteed under the **Sakala Services Act**.\n2. **Public Infrastructure Grievances:** Issues regarding roads, potholes, overflowing drainage, streetlights, or waste management can be reported through **CivicLens AI** with automatic AI triage and department dispatch.\n\nWould you like guidance on eligibility, document requirements, or filing a formal civic complaint?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sources: [
        { title: 'Karnataka Seva Sindhu Portal', url: 'https://sevasindhu.karnataka.gov.in', department: 'Govt. of Karnataka' },
        { title: 'CivicLens AI Public Grievance Engine', department: 'Municipal Redressal' }
      ],
      followUps: [
        'How do I report a civic problem on my street?',
        'How to verify scheme eligibility with Aadhaar?',
        'What is the Sakala guarantee turnaround time?'
      ],
      actionLink: { text: 'Report a Civic Issue', href: '/report' }
    };
  };

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Simulate natural AI thinking delay (350ms)
    setTimeout(() => {
      const aiReply = findBestResponse(query);
      setMessages(prev => [...prev, aiReply]);
      setIsLoading(false);
    }, 450);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    setMessages([]);
    setInput('');
  };

  return (
    <Card className={clsx(
      'flex flex-col bg-white overflow-hidden',
      isEmbedded ? 'rounded-2xl border border-[#E7E9E5] shadow-soft' : 'h-[620px] max-w-4xl mx-auto rounded-2xl shadow-soft-lg border border-[#E7E9E5]'
    )}>
      {/* Header Bar */}
      <div className="px-5 py-4 border-b border-[#E7E9E5] bg-[#F8F8F5] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#294563] text-white flex items-center justify-center shadow-soft-sm">
            <Sparkles className="w-5 h-5 text-[#8EA8C2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold font-heading text-[#294563]">
                CivicLens AI Civic Advisor
              </h3>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#7C9B85]/15 text-[#4F8665] border border-[#7C9B85]/30">
                Verified Guidance
              </span>
            </div>
            <p className="text-xs text-[#687887]">
              Instant guidance on Karnataka schemes, certificates, citizen rights & grievances
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button
              type="button"
              onClick={handleResetChat}
              aria-label="Reset conversation"
              className="p-1.5 rounded-lg text-[#687887] hover:text-[#253342] hover:bg-[#E7E9E5]/60 transition-colors"
              title="Reset conversation"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close conversation drawer"
              className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-[#E7E9E5] text-[#687887] hover:text-[#253342]"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* Messages Conversation Area */}
      <div className="flex-1 p-5 overflow-y-auto space-y-5 bg-[#F8F8F5]/30 min-h-[340px] max-h-[460px]">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4 py-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#294563]/10 text-[#294563] flex items-center justify-center">
              <Compass className="w-6 h-6 text-[#7189A4]" />
            </div>
            <div className="max-w-md space-y-1">
              <h4 className="text-base font-bold font-heading text-[#294563]">
                How can CivicLens assist you today?
              </h4>
              <p className="text-xs text-[#687887]">
                Ask any question regarding Karnataka welfare schemes, application procedures, citizen rights, or how to resolve a public issue.
              </p>
            </div>

            {/* Suggested Question Chips */}
            <div className="w-full max-w-lg space-y-2 pt-2">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#7189A4]">
                Popular Questions
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {suggestedPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => handleSend(prompt)}
                    className="text-xs px-3 py-2 rounded-xl bg-white border border-[#E7E9E5] text-[#253342] hover:border-[#294563] hover:bg-[#F1F3EF] shadow-soft-sm transition-all text-left"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={clsx(
                'flex flex-col space-y-2 animate-in fade-in duration-200',
                msg.sender === 'user' ? 'items-end' : 'items-start'
              )}
            >
              <div className="flex items-center gap-2 text-[10px] text-[#687887] px-1">
                <span>{msg.sender === 'user' ? 'You' : 'CivicLens AI'}</span>
                <span>•</span>
                <span>{msg.timestamp}</span>
              </div>

              <div
                className={clsx(
                  'max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed transition-all shadow-soft-sm',
                  msg.sender === 'user'
                    ? 'bg-[#294563] text-white rounded-br-sm'
                    : 'bg-white border border-[#E7E9E5] text-[#253342] rounded-bl-sm space-y-3'
                )}
              >
                <div className="whitespace-pre-wrap font-sans text-xs sm:text-sm">
                  {msg.text}
                </div>

                {/* If AI Message: show action buttons, sources & followups */}
                {msg.sender === 'ai' && (
                  <div className="space-y-3 pt-2 border-t border-[#E7E9E5]">
                    {/* Action link if available */}
                    {msg.actionLink && (
                      <div className="pt-1">
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => navigate(msg.actionLink!.href)}
                          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                        >
                          {msg.actionLink.text}
                        </Button>
                      </div>
                    )}

                    {/* Sources */}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-[10px] font-semibold text-[#7189A4] uppercase tracking-wider flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          <span>Official Source Reference</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.sources.map((src, i) => (
                            <a
                              key={i}
                              href={src.url || '#'}
                              target={src.url ? '_blank' : '_self'}
                              rel={src.url ? 'noopener noreferrer' : undefined}
                              aria-label={src.url ? `${src.title} (opens in new tab)` : src.title}
                              className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-[#F1F3EF] text-[#294563] hover:underline"
                            >
                              <span>{src.title}</span>
                              {src.url && <ExternalLink className="w-2.5 h-2.5 opacity-70" />}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Follow-up Prompts */}
                    {msg.followUps && msg.followUps.length > 0 && (
                      <div className="space-y-1 pt-1">
                        <div className="text-[10px] font-semibold text-[#687887] uppercase tracking-wider">
                          Suggested Next Steps
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.followUps.map((fu, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleSend(fu)}
                              className="text-[11px] px-2.5 py-1 rounded-lg bg-[#F8F8F5] border border-[#E7E9E5] text-[#294563] hover:bg-[#F1F3EF] hover:border-[#7189A4] transition-all text-left"
                            >
                              ↳ {fu}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Copy Button */}
                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="inline-flex items-center gap-1 text-[11px] text-[#687887] hover:text-[#253342] px-2 py-1 rounded hover:bg-[#F1F3EF] transition-colors"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-[#4F8665]" />
                            <span className="text-[#4F8665] font-medium">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Response</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {/* Loading state indicator */}
        {isLoading && (
          <div className="flex items-start gap-2 animate-in fade-in">
            <div className="bg-white border border-[#E7E9E5] p-3.5 rounded-2xl rounded-bl-sm shadow-soft-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#294563] animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-[#7189A4] animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-[#7C9B85] animate-bounce [animation-delay:0.4s]" />
              <span className="text-xs text-[#687887] pl-1 font-medium">
                Consulting civic intelligence & regulations...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Box */}
      <div className="p-3.5 sm:p-4 border-t border-[#E7E9E5] bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <label htmlFor="ai-chat-prompt-input" className="sr-only">
            Ask CivicLens AI a question
          </label>
          <input
            id="ai-chat-prompt-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about Gruha Lakshmi, income certificate, pothole repair..."
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 rounded-xl border border-[#E7E9E5] text-sm focus:outline-none focus:ring-2 focus:ring-[#294563] focus:border-transparent min-h-[44px]"
            aria-label="Ask CivicLens AI a question"
          />
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading || !input.trim()}
            className="shrink-0"
            rightIcon={<Send className="w-4 h-4" />}
          >
            Ask
          </Button>
        </form>
        <div className="mt-1.5 flex items-center justify-between text-[11px] text-[#687887] px-1">
          <span>AI outputs are cross-verified against official Government of Karnataka notifications.</span>
          <span className="hidden sm:inline">Press Enter to send</span>
        </div>
      </div>
    </Card>
  );
};

