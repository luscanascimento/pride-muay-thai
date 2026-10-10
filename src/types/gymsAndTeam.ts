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
}
