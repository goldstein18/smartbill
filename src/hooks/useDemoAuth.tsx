
import { useDemo } from '@/context/DemoContext';

interface DemoUser {
  uid: string;
  email: string;
  displayName: string;
}

interface DemoProfile {
  id: string;
  email: string;
  display_name: string;
  role: string;
  onboarding_completed: boolean;
}

export const useDemoAuth = () => {
  const { isDemoMode } = useDemo();

  const demoUser: DemoUser = {
    uid: 'demo-user-123',
    email: 'demo@smartbill.com',
    displayName: 'Sarah Johnson, Esq.'
  };

  const demoProfile: DemoProfile = {
    id: 'demo-user-123',
    email: 'demo@smartbill.com',
    display_name: 'Sarah Johnson, Esq.',
    role: 'user',
    onboarding_completed: true
  };

  if (!isDemoMode) {
    return {
      isDemoAuth: false,
      demoUser: null,
      demoProfile: null
    };
  }

  return {
    isDemoAuth: true,
    demoUser,
    demoProfile
  };
};
