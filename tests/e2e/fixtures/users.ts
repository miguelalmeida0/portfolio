export const users = {
  anonymous: {
    label: 'anonymous visitor',
    authenticated: false
  },
  recruiter: {
    label: 'recruiter',
    authenticated: false,
    expectedFlow: 'recruiter'
  },
  collaborator: {
    label: 'collaborator',
    authenticated: false,
    expectedFlow: 'collaborator'
  }
} as const;

export type UserFixture = (typeof users)[keyof typeof users];
