export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';

export type LocalizedName = {
  language: string;
  translatedName: string;
};

export type GameItem = {
  key: string;
  germanName: string;
  releaseYear?: number;
  difficulty: Difficulty;
  languages: LocalizedName[];
};
