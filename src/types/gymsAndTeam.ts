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

export interface Professor {
  id: string;
  name: string;
  nickname: string | null;
  photoUrl: string;
  gymIds: string[];
  roleTitle?: string;
  bio?: string;
}
