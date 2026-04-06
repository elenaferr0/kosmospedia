export type Difficulty = number | null;

export type LocalizedName = {
  language: string;
  translatedName: string;
};

export type GameItem = {
  key: string;
  name: string;
  releaseYear?: number;
  difficulty: Difficulty;
  languages: LocalizedName[];
};
