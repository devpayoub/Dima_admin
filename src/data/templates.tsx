import type { Template } from '../types';
import { ICON_REGISTRY } from '../lib/iconRegistry';

export const templates: Template[] = [
  {
    id: 'cookie-classic',
    name: 'Cookie Classic',
    createdAt: '2024-01-01',
    description: 'The original warm and cozy cookie loyalty card.',
    rewardName: 'Free Jumbo Cookie',
    backgroundOpacity: 100,
    social: {
      instagram: '@cookieclassic',
      youtube: '@cookieclassic',
      website: 'https://example.com'
    },
    icon: ICON_REGISTRY.cookie,
    totalStamps: 5,
    colors: {
      background: '#F9F7F2',
      cardBackground: '#ffffff',
      text: '#1F2937',
      muted: '#6B7280',
      stampActive: '#D4BFA6',
      stampInactive: '#EBD6C7',
      iconActive: '#5D4037',
      iconInactive: '#8D7B68',
      button: '#111111',
      buttonText: '#ffffff',
      border: '#E5E7EB'
    }
  },
  {
    id: 'midnight-brew',
    name: 'Midnight Brew',
    createdAt: '2024-01-01',
    description: 'Dark and sophisticated coffee shop vibes.',
    rewardName: 'Free Handcrafted Drink',
    backgroundOpacity: 100,
    social: {
      instagram: '@midnightbrew',
      youtube: '@midnightbrew',
      website: 'https://example.com'
    },
    icon: ICON_REGISTRY.coffee,
    totalStamps: 6,
    colors: {
      background: '#1a1614',
      cardBackground: '#2c2420',
      text: '#e6dcd3',
      muted: '#9c8e85',
      stampActive: '#cfb096',
      stampInactive: '#3E342F',
      iconActive: '#2c2420',
      iconInactive: '#8A786E',
      button: '#cfb096',
      buttonText: '#2c2420',
      border: '#4a3e36'
    }
  },
  {
    id: 'pizza-party',
    name: 'Pizza Party',
    createdAt: '2024-01-01',
    description: 'Fun and vibrant styles for the best slice in town.',
    rewardName: 'Free Slice + Soda',
    backgroundOpacity: 100,
    social: {
      instagram: '@pizzaparty',
      youtube: '@pizzaparty',
      website: 'https://example.com'
    },
    icon: ICON_REGISTRY.pizza,
    totalStamps: 8,
    colors: {
      background: '#FFF5F5',
      cardBackground: '#ffffff',
      text: '#C53030',
      muted: '#E53E3E',
      stampActive: '#F6E05E',
      stampInactive: '#FFEEEE',
      iconActive: '#C53030',
      iconInactive: '#F56565',
      button: '#C53030',
      buttonText: '#ffffff',
      border: '#FEB2B2'
    }
  },
  {
    id: 'sweet-scoops',
    name: 'Sweet Scoops',
    createdAt: '2024-01-01',
    description: 'Pastel perfection for ice cream lovers.',
    rewardName: 'Free Sundae',
    backgroundOpacity: 100,
    social: {
      instagram: '@sweetscoops',
      youtube: '@sweetscoops',
      website: 'https://example.com'
    },
    icon: ICON_REGISTRY.iceCream,
    titleSize: 'text-3xl md:text-4xl',
    totalStamps: 5,
    colors: {
      background: '#F0F9FF',
      cardBackground: '#ffffff',
      text: '#0C4A6E',
      muted: '#38BDF8',
      stampActive: '#F472B6',
      stampInactive: '#E0F2FE',
      iconActive: '#ffffff',
      iconInactive: '#0284C7',
      button: '#F472B6',
      buttonText: '#ffffff',
      border: '#BAE6FD'
    }
  },
  {
    id: 'massage-bliss',
    name: 'Massage Bliss',
    createdAt: '2024-01-01',
    description: 'Relax, unwind, and rejuvenate your senses.',
    rewardName: 'Free 60min Massage',
    backgroundOpacity: 100,
    social: {
      instagram: '@massagebliss',
      youtube: '@massagebliss',
      website: 'https://example.com'
    },
    icon: ICON_REGISTRY.sparkles,
    totalStamps: 10,
    colors: {
      background: '#F3E8FF',
      cardBackground: '#ffffff',
      text: '#581C87',
      muted: '#A855F7',
      stampActive: '#D8B4FE',
      stampInactive: '#FAF5FF',
      iconActive: '#581C87',
      iconInactive: '#9333EA',
      button: '#7E22CE',
      buttonText: '#ffffff',
      border: '#E9D5FF'
    }
  },
  {
    id: 'laundry-fresh',
    name: 'Fresh Laundry',
    createdAt: '2024-01-01',
    description: 'Crisp, clean, and professional fabric care.',
    rewardName: 'Free Dry Cleaning Item',
    backgroundOpacity: 100,
    social: {
      instagram: '@laundryfresh',
      youtube: '@laundryfresh',
      website: 'https://example.com'
    },
    icon: ICON_REGISTRY.shirt,
    totalStamps: 8,
    colors: {
      background: '#F0F9FF',
      cardBackground: '#ffffff',
      text: '#0369A1',
      muted: '#38BDF8',
      stampActive: '#7DD3FC',
      stampInactive: '#E0F2FE',
      iconActive: '#0369A1',
      iconInactive: '#0284C7',
      button: '#0EA5E9',
      buttonText: '#ffffff',
      border: '#BAE6FD'
    }
  },
  {
    id: 'sharp-cuts',
    name: 'Sharp Cuts',
    createdAt: '2024-01-01',
    description: 'Modern styling for the contemporary look.',
    rewardName: 'Free Haircut or Trim',
    backgroundOpacity: 100,
    social: {
      instagram: '@sharpcuts',
      youtube: '@sharpcuts',
      website: 'https://example.com'
    },
    icon: ICON_REGISTRY.scissors,
    totalStamps: 6,
    colors: {
      background: '#F8FAFC',
      cardBackground: '#ffffff',
      text: '#0F172A',
      muted: '#64748B',
      stampActive: '#94A3B8',
      stampInactive: '#F1F5F9',
      iconActive: '#0F172A',
      iconInactive: '#475569',
      button: '#0F172A',
      buttonText: '#ffffff',
      border: '#E2E8F0'
    }
  },
  {
    id: 'boba-time',
    name: 'Boba Time',
    createdAt: '2024-01-01',
    description: 'Chewy pearls and creamy milk tea goodness.',
    rewardName: 'Free Milk Tea w/ Topping',
    backgroundOpacity: 100,
    social: {
      instagram: '@bobatime',
      youtube: '@bobatime',
      website: 'https://example.com'
    },
    icon: ICON_REGISTRY.cupSoda,
    totalStamps: 8,
    colors: {
      background: '#FFFBEB',
      cardBackground: '#ffffff',
      text: '#78350F',
      muted: '#B45309',
      stampActive: '#FCD34D',
      stampInactive: '#FEF3C7',
      iconActive: '#78350F',
      iconInactive: '#D97706',
      button: '#D97706',
      buttonText: '#ffffff',
      border: '#FDE68A'
    }
  },
  {
    id: 'burger-joint',
    name: 'Burger Joint',
    createdAt: '2024-01-01',
    description: 'Juicy, grilled-to-perfection gourmet burgers.',
    rewardName: 'Free Classic Burger',
    backgroundOpacity: 100,
    social: {
      instagram: '@burgerjoint',
      youtube: '@burgerjoint',
      website: 'https://example.com'
    },
    icon: ICON_REGISTRY.burger,
    totalStamps: 5,
    colors: {
      background: '#FEF2F2',
      cardBackground: '#ffffff',
      text: '#991B1B',
      muted: '#EF4444',
      stampActive: '#FCA5A5',
      stampInactive: '#FEE2E2',
      iconActive: '#991B1B',
      iconInactive: '#DC2626',
      button: '#DC2626',
      buttonText: '#ffffff',
      border: '#FECACA'
    }
  },
  {
    id: 'cookie-classic-points',
    name: 'Cookie Classic',
    createdAt: '2024-01-01',
    description: 'The original warm and cozy cookie loyalty card.',
    rewardName: 'Free Jumbo Cookie',
    mode: 'points',
    backgroundOpacity: 100,
    social: {
      instagram: '@cookieclassic',
      youtube: '@cookieclassic',
      website: 'https://example.com'
    },
    icon: ICON_REGISTRY.cookie,
    totalStamps: 5,
    colors: {
      background: '#F9F7F2',
      cardBackground: '#ffffff',
      text: '#1F2937',
      muted: '#6B7280',
      stampActive: '#D4BFA6',
      stampInactive: '#EBD6C7',
      iconActive: '#5D4037',
      iconInactive: '#8D7B68',
      button: '#111111',
      buttonText: '#ffffff',
      border: '#E5E7EB'
    }
  },
  {
    id: 'midnight-brew-points',
    name: 'Midnight Brew',
    createdAt: '2024-01-01',
    description: 'Dark and sophisticated coffee shop vibes.',
    rewardName: 'Free Handcrafted Drink',
    mode: 'points',
    backgroundOpacity: 100,
    social: {
      instagram: '@midnightbrew',
      youtube: '@midnightbrew',
      website: 'https://example.com'
    },
    icon: ICON_REGISTRY.coffee,
    totalStamps: 6,
    colors: {
      background: '#1a1614',
      cardBackground: '#2c2420',
      text: '#e6dcd3',
      muted: '#9c8e85',
      stampActive: '#cfb096',
      stampInactive: '#3E342F',
      iconActive: '#2c2420',
      iconInactive: '#8A786E',
      button: '#cfb096',
      buttonText: '#2c2420',
      border: '#4a3e36'
    }
  },
  {
    id: 'pizza-party-points',
    name: 'Pizza Party',
    createdAt: '2024-01-01',
    description: 'Fun and vibrant styles for the best slice in town.',
    rewardName: 'Free Slice + Soda',
    mode: 'points',
    backgroundOpacity: 100,
    social: {
      instagram: '@pizzaparty',
      youtube: '@pizzaparty',
      website: 'https://example.com'
    },
    icon: ICON_REGISTRY.pizza,
    totalStamps: 8,
    colors: {
      background: '#FFF5F5',
      cardBackground: '#ffffff',
      text: '#C53030',
      muted: '#E53E3E',
      stampActive: '#F6E05E',
      stampInactive: '#FFEEEE',
      iconActive: '#C53030',
      iconInactive: '#F56565',
      button: '#C53030',
      buttonText: '#ffffff',
      border: '#FEB2B2'
    }
  },
  {
    id: 'sweet-scoops-points',
    name: 'Sweet Scoops',
    createdAt: '2024-01-01',
    description: 'Pastel perfection for ice cream lovers.',
    rewardName: 'Free Sundae',
    mode: 'points',
    backgroundOpacity: 100,
    social: {
      instagram: '@sweetscoops',
      youtube: '@sweetscoops',
      website: 'https://example.com'
    },
    icon: ICON_REGISTRY.iceCream,
    titleSize: 'text-3xl md:text-4xl',
    totalStamps: 5,
    colors: {
      background: '#F0F9FF',
      cardBackground: '#ffffff',
      text: '#0C4A6E',
      muted: '#38BDF8',
      stampActive: '#F472B6',
      stampInactive: '#E0F2FE',
      iconActive: '#ffffff',
      iconInactive: '#0284C7',
      button: '#F472B6',
      buttonText: '#ffffff',
      border: '#BAE6FD'
    }
  },
  {
    id: 'massage-bliss-points',
    name: 'Massage Bliss',
    createdAt: '2024-01-01',
    description: 'Relax, unwind, and rejuvenate your senses.',
    rewardName: 'Free 60min Massage',
    mode: 'points',
    backgroundOpacity: 100,
    social: {
      instagram: '@massagebliss',
      youtube: '@massagebliss',
      website: 'https://example.com'
    },
    icon: ICON_REGISTRY.sparkles,
    totalStamps: 10,
    colors: {
      background: '#F3E8FF',
      cardBackground: '#ffffff',
      text: '#581C87',
      muted: '#A855F7',
      stampActive: '#D8B4FE',
      stampInactive: '#FAF5FF',
      iconActive: '#581C87',
      iconInactive: '#9333EA',
      button: '#7E22CE',
      buttonText: '#ffffff',
      border: '#E9D5FF'
    }
  },
  {
    id: 'laundry-fresh-points',
    name: 'Fresh Laundry',
    createdAt: '2024-01-01',
    description: 'Crisp, clean, and professional fabric care.',
    rewardName: 'Free Dry Cleaning Item',
    mode: 'points',
    backgroundOpacity: 100,
    social: {
      instagram: '@laundryfresh',
      youtube: '@laundryfresh',
      website: 'https://example.com'
    },
    icon: ICON_REGISTRY.shirt,
    totalStamps: 8,
    colors: {
      background: '#F0F9FF',
      cardBackground: '#ffffff',
      text: '#0369A1',
      muted: '#38BDF8',
      stampActive: '#7DD3FC',
      stampInactive: '#E0F2FE',
      iconActive: '#0369A1',
      iconInactive: '#0284C7',
      button: '#0EA5E9',
      buttonText: '#ffffff',
      border: '#BAE6FD'
    }
  },
  {
    id: 'sharp-cuts-points',
    name: 'Sharp Cuts',
    createdAt: '2024-01-01',
    description: 'Modern styling for the contemporary look.',
    rewardName: 'Free Haircut or Trim',
    mode: 'points',
    backgroundOpacity: 100,
    social: {
      instagram: '@sharpcuts',
      youtube: '@sharpcuts',
      website: 'https://example.com'
    },
    icon: ICON_REGISTRY.scissors,
    totalStamps: 6,
    colors: {
      background: '#F8FAFC',
      cardBackground: '#ffffff',
      text: '#0F172A',
      muted: '#64748B',
      stampActive: '#94A3B8',
      stampInactive: '#F1F5F9',
      iconActive: '#0F172A',
      iconInactive: '#475569',
      button: '#0F172A',
      buttonText: '#ffffff',
      border: '#E2E8F0'
    }
  },
  {
    id: 'boba-time-points',
    name: 'Boba Time',
    createdAt: '2024-01-01',
    description: 'Chewy pearls and creamy milk tea goodness.',
    rewardName: 'Free Milk Tea w/ Topping',
    mode: 'points',
    backgroundOpacity: 100,
    social: {
      instagram: '@bobatime',
      youtube: '@bobatime',
      website: 'https://example.com'
    },
    icon: ICON_REGISTRY.cupSoda,
    totalStamps: 8,
    colors: {
      background: '#FFFBEB',
      cardBackground: '#ffffff',
      text: '#78350F',
      muted: '#B45309',
      stampActive: '#FCD34D',
      stampInactive: '#FEF3C7',
      iconActive: '#78350F',
      iconInactive: '#D97706',
      button: '#D97706',
      buttonText: '#ffffff',
      border: '#FDE68A'
    }
  },
  {
    id: 'burger-joint-points',
    name: 'Burger Joint',
    createdAt: '2024-01-01',
    description: 'Juicy, grilled-to-perfection gourmet burgers.',
    rewardName: 'Free Classic Burger',
    mode: 'points',
    backgroundOpacity: 100,
    social: {
      instagram: '@burgerjoint',
      youtube: '@burgerjoint',
      website: 'https://example.com'
    },
    icon: ICON_REGISTRY.burger,
    totalStamps: 5,
    colors: {
      background: '#FEF2F2',
      cardBackground: '#ffffff',
      text: '#991B1B',
      muted: '#EF4444',
      stampActive: '#FCA5A5',
      stampInactive: '#FEE2E2',
      iconActive: '#991B1B',
      iconInactive: '#DC2626',
      button: '#DC2626',
      buttonText: '#ffffff',
      border: '#FECACA'
    }
  }
];
