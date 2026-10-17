export interface ScheduleItem {
  days: string;
  hours: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export type CityName = 'Jacareí' | 'São José dos Campos' | 'Santa Branca' | 'Vale do Paraíba';

export interface Gym {
  id: string;
  name: string;
  alias?: string;
  city: CityName;
  address: string | null;
  cep?: string;
  coordinates: Coordinates | null;
  phoneDisplay: string | null;
  phoneRaw: string | null;
  schedules: ScheduleItem[];
  notes?: string;
  isPending?: boolean;
}

export interface KhanRank {
  level: number;
  title: string;
  colorName: string;
  primaryColor: string;
  tipColor?: string;
  description: string;
}

export interface FullKhanLevel {
  level: number;
  colorName: string;
  category: 'Aluno' | 'Graduado & Instrutor' | 'Professor & Mestre' | 'Mestre de Honra';
  title: string;
  primaryColor: string;
  tipColor?: string;
  description: string;
  teamMembers?: string[];
}

export interface PricingPlan {
  frequency1x: string;
  frequency2x: string;
  frequency3x: string;
  singleClass: string;
  trialClass: string;
  scheduleNote?: string;
}

export interface Professor {
  id: string;
  name: string;
  nickname: string | null;
  photoUrl: string;
  gymIds: string[];
  roleTitle?: string;
  bio?: string;
  khan: number;
  photoPosition?: string;
  isLeader?: boolean;
  storyTitle?: string;
  storyParagraphs?: string[];
  quote?: string;
  experienceYears?: number;
  highlightBadges?: string[];
  phoneDisplay?: string;
  phoneRaw?: string;
  scheduleNote?: string;
}

export interface PersonalFighter {
  id: string;
  name: string;
  nickname?: string | null;
  photoUrl: string;
  khan: number;
  city: CityName | string;
  price: string;
  priceNote?: string;
  roleTitle?: string;
  bio?: string;
  photoPosition?: string;
  highlightBadges?: string[];
  phoneDisplay?: string;
  phoneRaw?: string;
  gymIds?: string[];
  pricingPlan?: PricingPlan;
  scheduleNote?: string;
}

