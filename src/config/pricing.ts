
export interface PricingTier {
  id: string;
  name: string;
  price: number | null;
  interval: string;
  description: string;
  features: string[];
  popular?: boolean;
  enterprise?: boolean;
  trial?: boolean;
  buttonText: string;
}

export interface PartnerProgramConfig {
  commission: number;
  duration: string;
  maxPartners: number;
  benefits: string[];
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'trial',
    name: 'Free Trial',
    price: 0,
    interval: '14 days',
    description: 'Perfect for trying out SmartBill',
    features: [
      'Full time tracking',
      'Basic analytics',
      'Invoice generation',
      'Desktop app integration',
      '14-day free trial'
    ],
    trial: true,
    buttonText: 'Start Free Trial'
  },
  {
    id: 'founder',
    name: 'Founder',
    price: 59,
    interval: 'month',
    description: 'Great for freelancers and small teams',
    features: [
      'Everything in Trial',
      'Unlimited time entries',
      'Client management',
      'Basic reporting',
      'Email support'
    ],
    popular: true,
    buttonText: 'Get Started'
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 249,
    interval: 'month',
    description: 'Perfect for growing businesses',
    features: [
      'Everything in Founder',
      'Advanced analytics',
      'Custom branding',
      'Priority support',
      'API access',
      'Advanced reporting'
    ],
    buttonText: 'Upgrade Now'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: null,
    interval: 'custom',
    description: 'For large organizations with custom needs',
    features: [
      'Everything in Professional',
      'Custom integrations',
      'Dedicated support',
      'On-premise deployment',
      'Custom SLA',
      'Training & onboarding'
    ],
    enterprise: true,
    buttonText: 'Contact Sales'
  }
];

export const PARTNER_PROGRAM: PartnerProgramConfig = {
  commission: 30,
  duration: '12 months',
  maxPartners: 50,
  benefits: [
    'Earn 30% commission on every sale',
    'Recurring monthly payments for 12 months',
    'Access to exclusive partner resources',
    'Dedicated partner support channel',
    'Co-marketing opportunities',
    'Early access to new features',
    'Custom referral tracking dashboard',
    'Marketing materials and assets'
  ]
};
