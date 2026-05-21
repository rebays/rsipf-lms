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
    title: 'Being a Professional Police Officer',
    documents: [
      {
        id: 'd1',
        title: 'Being a Professional Police Officer',
        fileType: 'pdf',
        url: '/modules/being-a-police-officer/Being%20a%20Professional%20Police%20Officer.pdf',
      },
    ],
  },
  { id: '2',  order: 2,  title: 'Police Administrative Duties',                  documents: [] },
  { id: '3',  order: 3,  title: 'Community and Police Working Together',          documents: [] },
  { id: '4',  order: 4,  title: 'Useful Communication at Work',                  documents: [] },
  { id: '5',  order: 5,  title: 'Maintain Operational Equipment',                documents: [] },
  { id: '6',  order: 6,  title: 'Address Community Needs',                       documents: [] },
  { id: '7',  order: 7,  title: 'Introduction to Criminal Law',                  documents: [] },
  { id: '8',  order: 8,  title: 'Police Powers of Arrest',                       documents: [] },
  { id: '9',  order: 9,  title: 'Conduct Initial Police Investigation',           documents: [] },
  { id: '10', order: 10, title: 'Gather, Collate and Record Information',         documents: [] },
  { id: '11', order: 11, title: 'Use Police Methods',                             documents: [] },
  { id: '12', order: 12, title: 'Assist in the Judicial',                         documents: [] },
  { id: '13', order: 13, title: 'Attempts to Commit Offences',                   documents: [] },
  { id: '14', order: 14, title: 'Parties to Offences',                           documents: [] },
  { id: '15', order: 15, title: 'Criminal Responsibility',                        documents: [] },
  { id: '16', order: 16, title: 'Public Order Offences',                          documents: [] },
  { id: '17', order: 17, title: 'Offences Against Property',                      documents: [] },
  { id: '18', order: 18, title: 'Offences Against Persons',                       documents: [] },
  { id: '19', order: 19, title: 'Family Violence',                                documents: [] },
  { id: '20', order: 20, title: 'Common Firearms Offences for General Duties Police', documents: [] },
  { id: '21', order: 21, title: 'Common Drug Offences for General Duties Police', documents: [] },
  { id: '22', order: 22, title: 'Common Liquor Offences for General Duties Police', documents: [] },
  { id: '23', order: 23, title: 'Traffic Offences',                               documents: [] },
  { id: '24', order: 24, title: 'Cell and Custody Procedures',                    documents: [] },
  { id: '25', order: 25, title: 'Give Evidence in Court',                         documents: [] },
  { id: '26', order: 26, title: 'Leadership',                                     documents: [] },
  { id: '27', order: 27, title: 'First Response – Incident Management',           documents: [] },
  { id: '28', order: 28, title: 'First Aid',                                      documents: [] },
  { id: '29', order: 29, title: 'People Skills and Conflict Resolution',          documents: [] },
  { id: '30', order: 30, title: 'Operational Safety Training',                    documents: [] },
]

export type Module = (typeof MODULES)[number]

export function findModule(id: string): Module | undefined {
  return MODULES.find((m) => m.id === id)
}
