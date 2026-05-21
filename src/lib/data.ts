export const DEMO_USER = {
  name: 'James Carlos',
  email: 'james.carlos@gmail.com',
  role: 'officer' as const,
  rank: 'Cadet',
  unit: 'Criminal Investigation Department',
}

export type DemoUser = typeof DEMO_USER

export const MODULES = [
  {
    id: '1',
    order: 1,
    title: 'Professional Standards and Code of Conduct',
    description: 'Core principles of professional policing, ethical standards, and the RSIPF Code of Conduct.',
    documents: [
      { id: 'd1', title: 'Code of Conduct Study Guide', fileType: 'pdf', description: 'Comprehensive guide to RSIPF professional standards.' },
      { id: 'd2', title: 'Ethics Reference Sheet', fileType: 'pdf', description: 'Quick reference for ethical decision-making.' },
      { id: 'd3', title: 'Assessment Criteria', fileType: 'word', description: 'Module assessment guidelines and marking criteria.' },
    ],
  },
  {
    id: '2',
    order: 2,
    title: 'Criminal Law Fundamentals',
    description: 'Introduction to criminal law, offences, and legal procedures under Solomon Islands law.',
    documents: [
      { id: 'd4', title: 'Criminal Law Overview', fileType: 'pdf', description: 'Summary of key criminal offences and procedures.' },
      { id: 'd5', title: 'Case Study Workbook', fileType: 'pdf', description: 'Practical case studies for applied learning.' },
    ],
  },
  {
    id: '3',
    order: 3,
    title: 'Traffic Law and Road Safety',
    description: 'Traffic enforcement, road safety legislation, and practical traffic management.',
    documents: [
      { id: 'd6', title: 'Traffic Law Manual', fileType: 'pdf', description: 'Full reference manual for traffic law enforcement.' },
      { id: 'd7', title: 'Road Safety Reference', fileType: 'pdf', description: 'Road safety statistics and intervention strategies.' },
      { id: 'd8', title: 'Assessment Criteria', fileType: 'word', description: 'Module assessment guidelines.' },
      { id: 'd9', title: 'Traffic Incident Report Template', fileType: 'word', description: 'Standard template for traffic incident reporting.' },
    ],
  },
  {
    id: '4',
    order: 4,
    title: 'Community Policing',
    description: 'Building community trust, conflict resolution, and policing in a Pacific context.',
    documents: [
      { id: 'd10', title: 'Community Policing Handbook', fileType: 'pdf', description: 'Strategies for effective community engagement.' },
      { id: 'd11', title: 'Conflict Resolution Guide', fileType: 'pdf', description: 'Techniques for de-escalation and community mediation.' },
    ],
  },
  {
    id: '5',
    order: 5,
    title: 'First Aid and Emergency Response',
    description: 'Essential first aid skills, emergency procedures, and critical incident response.',
    documents: [
      { id: 'd12', title: 'First Aid Manual', fileType: 'pdf', description: 'Step-by-step first aid procedures for field officers.' },
      { id: 'd13', title: 'Emergency Response Protocols', fileType: 'pdf', description: 'Standard operating procedures for emergency incidents.' },
      { id: 'd14', title: 'Assessment Criteria', fileType: 'word', description: 'Practical assessment checklist.' },
    ],
  },
  {
    id: '6',
    order: 6,
    title: 'Evidence Collection and Crime Scene Management',
    description: 'Proper evidence handling, chain of custody, and crime scene preservation techniques.',
    documents: [
      { id: 'd15', title: 'Evidence Handling Guide', fileType: 'pdf', description: 'Procedures for collecting and preserving evidence.' },
      { id: 'd16', title: 'Crime Scene Checklist', fileType: 'pdf', description: 'Field checklist for crime scene management.' },
    ],
  },
  {
    id: '7',
    order: 7,
    title: 'Use of Force Policy',
    description: 'Legal framework, proportionality principles, and RSIPF policy on use of force.',
    documents: [
      { id: 'd17', title: 'Use of Force Policy Document', fileType: 'pdf', description: 'Official RSIPF policy on use of force.' },
      { id: 'd18', title: 'Proportionality Framework', fileType: 'pdf', description: 'Decision-making framework for force incidents.' },
      { id: 'd19', title: 'Incident Report Template', fileType: 'word', description: 'Template for documenting use of force incidents.' },
    ],
  },
  {
    id: '8',
    order: 8,
    title: 'Human Rights and Policing',
    description: 'International human rights standards and their application in law enforcement.',
    documents: [
      { id: 'd20', title: 'Human Rights in Policing', fileType: 'pdf', description: 'Overview of human rights obligations for police officers.' },
      { id: 'd21', title: 'Case Studies', fileType: 'pdf', description: 'Real-world case studies on human rights and policing.' },
    ],
  },
]

export type Module = (typeof MODULES)[number]

export function findModule(id: string): Module | undefined {
  return MODULES.find((m) => m.id === id)
}
