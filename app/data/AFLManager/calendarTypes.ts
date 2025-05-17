// New types for AFL Manager Calendar and Season Structure

/** 
 * Represents a phase of the AFL season (Pre-season, Regular Season, Finals, Off-season)
 */
export interface SeasonPhase {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  description: string;
  color: string;
  keyEvents: KeyEvent[];
}

/**
 * Represents a significant event in the AFL calendar
 */
export interface KeyEvent {
  id: string;
  name: string;
  date: string;
  type: "match" | "draft" | "trade" | "training" | "special_round" | "milestone";
  description: string;
  completed: boolean;
  iconPath?: string;
}

/**
 * Represents a special round in the AFL season
 */
export interface SpecialRound {
  id: string;
  name: string;
  round: number;
  startDate: string;
  endDate: string;
  description: string;
  iconPath?: string;
}

/**
 * Records a team's form over recent matches
 */
export interface FormRecord {
  matchId: string;
  opponent: string;
  result: "W" | "L" | "D";
  score: string;
  performance: number; // 0-100
  date: string;
}

/**
 * Tracks performance trends for different statistical categories
 */
export interface PerformanceTrend {
  category: string;
  values: number[];
  dates: string[];
  leagueAverage: number;
  leagueTop: number;
  trend: "up" | "down" | "stable";
}

/**
 * Records the development of a player's attributes over the season
 */
export interface PlayerDevelopmentRecord {
  playerId: string;
  name: string;
  position: string;
  age: number;
  startOfSeasonRating: number;
  currentRating: number;
  potentialRating: number;
  attributeChanges: {
    [key: string]: number; // attribute name: change value
  };
}

/**
 * Comparison of team statistics against league averages
 */
export interface TeamComparison {
  category: string;
  teamValue: number;
  leagueAverage: number;
  leagueTop: number;
  ranking: number;
}