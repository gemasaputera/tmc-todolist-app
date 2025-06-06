// User types based on Prisma schema
export type UserData = {
  id: string;
  email: string;
  name: string;
  password?: string; // Optional for frontend, required in DB
  aiGenerations: number;
  subscriptionTier: string;
  resetDate: Date;
  image?: string; // Not in schema but used in frontend
};

// Form types for user operations
export type CreateUserData = {
  email: string;
  password: string;
  name: string;
};

export type UpdateUserData = {
  email?: string;
  name?: string;
  password?: string;
  aiGenerations?: number;
  subscriptionTier?: string;
  resetDate?: Date;
};

// Login/Auth types
export type LoginData = {
  email: string;
  password: string;
};

export type RegisterData = {
  email: string;
  password: string;
  name: string;
};

// User session/token data
export type UserSessionData = {
  id: string;
  email: string;
  name: string;
  subscriptionTier: string;
  aiGenerations: number;
};

// Subscription tiers
export enum SubscriptionTier {
  FREE = 'free',
  PREMIUM = 'premium',
  PRO = 'pro'
}

// Subscription limits
export const SUBSCRIPTION_LIMITS = {
  [SubscriptionTier.FREE]: {
    aiGenerations: 10,
    projects: 3,
    todosPerProject: 50
  },
  [SubscriptionTier.PREMIUM]: {
    aiGenerations: 100,
    projects: 10,
    todosPerProject: 200
  },
  [SubscriptionTier.PRO]: {
    aiGenerations: -1, // Unlimited
    projects: -1, // Unlimited
    todosPerProject: -1 // Unlimited
  }
} as const;
