// Game State Management for AFL Manager

import { Team, teams as allTeamsData } from "./teams";
import { Player, players as allPlayersData } from "./players";
import {
  SeasonPhase,
  SpecialRound,
  FormRecord,
  PerformanceTrend,
  PlayerDevelopmentRecord,
  TeamComparison,
  KeyEvent
} from "./calendarTypes";

export interface LadderPosition {
  teamId: string;
  played: number;
  wins: number;
  losses: number;
  draws: number;
  pointsFor: number;
  pointsAgainst: number;
  percentage: number;
  points: number;
}

export interface MatchScore {
  goals: number;
  behinds: number;
  total: number;
}

export interface MatchEvent {
  type: "goal" | "behind" | "injury" | "substitution" | "quarter" | "final";
  teamId?: string;
  playerId?: string;
  quarter?: number;
  message: string;
  timestamp: number; // seconds into the match
}

export interface MatchStats {
  disposals: Record<string, number>; // playerId: count
  marks: Record<string, number>;
  tackles: Record<string, number>;
  goals: Record<string, number>;
  behinds: Record<string, number>;
}

export interface Match {
  id: string;
  round: number;
  homeTeamId: string;
  awayTeamId: string;
  venue: string;
  date: string;
  completed: boolean;
  specialEvent?: string; // For special rounds like "ANZAC Day" or "Dreamtime at the 'G"
  result?: {
    homeScore: MatchScore;
    awayScore: MatchScore;
    events: MatchEvent[];
    stats: MatchStats;
  };
}

export type ObjectiveType = 
  | "ladder_position" 
  | "win_count" 
  | "develop_players" 
  | "finals" 
  | "premiership";

export interface Objective {
  type: ObjectiveType;
  description: string;
  target: number | string;
  reward: number; // financial reward in thousands
  completed: boolean;
}

export interface GameSettings {
  difficulty: "easy" | "medium" | "hard";
  matchSimSpeed: "slow" | "medium" | "fast";
  injuryFrequency: "low" | "medium" | "high";
  transferActivity: "low" | "medium" | "high";
}

export type TrainingFocus = 
  | "attack" 
  | "defense" 
  | "fitness" 
  | "teamwork" 
  | "set_pieces" 
  | "recovery";

export interface TrainingSession {
  id: string;
  date: string;
  focus: TrainingFocus;
  intensity: "light" | "medium" | "intense";
  playerIds: string[];
  completed: boolean;
}

export interface PressConference {
  id: string;
  date: string;
  topic: string;
  questions: {
    question: string;
    options: string[];
    selectedAnswer?: string;
  }[];
  completed: boolean;
  impact?: {
    morale?: number;
    fanSupport?: number;
    boardConfidence?: number;
  };
}

export interface UserPrompt {
  id: string;
  type: 'information' | 'decision'; // Information (e.g., event occurred) or Decision (e.g., draft pick)
  title: string;
  message: string;
  relatedEntityId?: string; // e.g., player ID for injury, event ID for calendar event
  // For decisions, options would be provided
  // options?: { text: string; actionId: string; payload?: any }[]; 
  // For now, prompts are informational and will be cleared, or require specific handling outside this system.
  requiresAcknowledgement?: boolean; // If true, user must actively dismiss it.
}

export interface GameState {
  initialized: boolean;
  userTeamId: string | null;
  currentSeason: number;
  currentRound: number;
  currentDate: string; // ISO date string
  currentDayOfWeek: number; // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
  seasonFixtures: Match[];
  ladder: LadderPosition[];
  objectives: Objective[];
  finances: {
    balance: number; // in thousands
    weeklyWage: number;
    sponsorships: number;
    matchDayRevenue: number;
    merchandiseRevenue: number;
  };
  settings: GameSettings;
  lastUpdated: string; // ISO date string
  trainingSessions: TrainingSession[];
  pressConferences: PressConference[];
  morale: number; // Team morale (0-100)
  fanSupport: number; // Fan support (0-100)
  boardConfidence: number; // Board confidence (0-100)
  
  // New properties for enhanced Calendar
  seasonPhases: SeasonPhase[];
  currentPhase: string; // "pre_season", "regular_season", "finals", "off_season"
  seasonProgress: number; // 0-100%
  specialRounds: SpecialRound[];
  
  // New properties for enhanced Dashboard
  formGuide: FormRecord[];
  performanceTrends: PerformanceTrend[];
  playerDevelopment: PlayerDevelopmentRecord[];
  teamComparisons: TeamComparison[];

  // New properties for interactive match flow
  activeMatchId?: string | null;
  matchDayPhase?: "none" | "pre_match" | "live_match" | "post_match";

  // New properties for calendar overhaul iteration 1
  lastDailySummary: string[] | null;
  userPrompts: UserPrompt[]; 
}

// Initial game state
export const initialGameState: GameState = {
  initialized: false,
  userTeamId: null,
  currentSeason: 2025,
  currentRound: 1,
  currentDate: "2025-03-01", // Start of season
  currentDayOfWeek: new Date("2025-03-01").getDay(), // Calculate initial day of week
  seasonFixtures: [],
  ladder: [],
  objectives: [],
  finances: {
    balance: 0,
    weeklyWage: 0,
    sponsorships: 0,
    matchDayRevenue: 0,
    merchandiseRevenue: 0
  },
  settings: {
    difficulty: "medium",
    matchSimSpeed: "medium",
    injuryFrequency: "medium",
    transferActivity: "medium"
  },
  lastUpdated: new Date().toISOString(),
  trainingSessions: [],
  pressConferences: [],
  morale: 75,
  fanSupport: 75,
  boardConfidence: 75,
  
  // Initialize new calendar properties
  seasonPhases: [],
  currentPhase: "pre_season",
  seasonProgress: 0,
  specialRounds: [],
  
  // Initialize new dashboard properties
  formGuide: [],
  performanceTrends: [],
  playerDevelopment: [],
  teamComparisons: [],
  activeMatchId: null,
  matchDayPhase: "none",
  lastDailySummary: null,
  userPrompts: [],
};

// Generate a full season of fixtures with realistic AFL season structure
export function generateFixtures(teams: Team[], season: number): Match[] {
  const fixtures: Match[] = [];
  const totalRounds = 23; // Standard AFL season length

  // Generate round dates based on AFL season structure
  const roundDates = generateRoundDates(season);
  
  // Define traditional rivalries and blockbuster matches
  const rivalries = [
    { team1: "collingwood", team2: "essendon" }, // ANZAC Day
    { team1: "richmond", team2: "essendon" }, // Dreamtime at the 'G
    { team1: "collingwood", team2: "carlton" }, // Traditional rivalry
    { team1: "west-coast", team2: "fremantle" }, // Western Derby
    { team1: "adelaide", team2: "port-adelaide" }, // Showdown
    { team1: "sydney", team2: "gws" }, // Sydney Derby
    { team1: "geelong", team2: "hawthorn" }, // Easter Monday
    { team1: "brisbane", team2: "gold-coast" }, // QClash
    { team1: "melbourne", team2: "collingwood" }, // Queen's Birthday
  ];
  
  // For each round
  for (let round = 1; round <= totalRounds; round++) {
    // Start with all teams available for this round
    const availableTeams = [...teams];
    const roundMatches: Match[] = [];
    
    // First, schedule any special rivalries for this round
    if (round === 6) { // ANZAC Day round
      scheduleRivalryMatch(availableTeams, roundMatches, "collingwood", "essendon", round, roundDates[round-1], "MCG", "ANZAC Day Match");
    }
    
    if (round === 10) { // Indigenous Round (Sir Doug Nicholls Round)
      scheduleRivalryMatch(availableTeams, roundMatches, "richmond", "essendon", round, roundDates[round-1], "MCG", "Dreamtime at the 'G");
    }
    
    if (round === 13) { // Queen's Birthday
      scheduleRivalryMatch(availableTeams, roundMatches, "melbourne", "collingwood", round, roundDates[round-1], "MCG", "Queen's Birthday Match");
    }
    
    // Fill the rest of the round with random matches
    while (availableTeams.length >= 2) {
      const homeTeamIndex = Math.floor(Math.random() * availableTeams.length);
      const homeTeam = availableTeams[homeTeamIndex];
      availableTeams.splice(homeTeamIndex, 1);
      
      const awayTeamIndex = Math.floor(Math.random() * availableTeams.length);
      const awayTeam = availableTeams[awayTeamIndex];
      availableTeams.splice(awayTeamIndex, 1);
      
      roundMatches.push({
        id: `match_${round}_${homeTeam.id}_${awayTeam.id}`,
        round,
        homeTeamId: homeTeam.id,
        awayTeamId: awayTeam.id,
        venue: homeTeam.homeGround,
        date: roundDates[round-1],
        completed: false
      });
    }
    
    fixtures.push(...roundMatches);
  }
  
  return fixtures;
}

// Helper function to generate realistic round dates for an AFL season
function generateRoundDates(year: number): string[] {
  const roundDates: string[] = [];
  
  // Season typically starts in late March and ends in August
  const startDate = new Date(`${year}-03-15`); // Mid-March start
  
  // Generate a date for each round
  for (let i = 0; i < 23; i++) {
    const roundDate = new Date(startDate);
    // Add 7 days for each round
    roundDate.setDate(startDate.getDate() + (i * 7));
    
    // Format as YYYY-MM-DD
    const formattedDate = roundDate.toISOString().split('T')[0];
    roundDates.push(formattedDate);
  }
  
  return roundDates;
}

// Helper function to schedule rivalry matches
function scheduleRivalryMatch(
  availableTeams: Team[],
  roundMatches: Match[],
  team1Id: string,
  team2Id: string,
  round: number,
  date: string,
  venue: string,
  description?: string
): void {
  // Find the teams
  const team1Index = availableTeams.findIndex(t => t.id === team1Id);
  const team2Index = availableTeams.findIndex(t => t.id === team2Id);
  
  // If both teams are available, schedule the rivalry match
  if (team1Index !== -1 && team2Index !== -1) {
    const team1 = availableTeams[team1Index];
    const team2 = availableTeams[team2Index];
    
    // Remove teams from available list
    availableTeams.splice(Math.max(team1Index, team2Index), 1);
    availableTeams.splice(Math.min(team1Index, team2Index), 1);
    
    // Create the match
    roundMatches.push({
      id: `match_${round}_${team1.id}_${team2.id}`,
      round,
      homeTeamId: team1.id,
      awayTeamId: team2.id,
      venue: venue || team1.homeGround,
      date,
      completed: false,
      specialEvent: description
    });
  }
}

// Initialize ladder
export function initializeLadder(teams: Team[]): LadderPosition[] {
  return teams.map(team => ({
    teamId: team.id,
    played: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    pointsFor: 0,
    pointsAgainst: 0,
    percentage: 0,
    points: 0
  }));
}

// Generate objectives based on team strength
export function generateObjectives(team: Team): Objective[] {
  const objectives: Objective[] = [];
  
  // Calculate team overall rating
  const overallRating = (
    team.attributes.attack + 
    team.attributes.midfield + 
    team.attributes.defense + 
    team.attributes.coaching
  ) / 4;
  
  // Set objectives based on team strength
  if (overallRating >= 85) {
    // Top team - premiership contender
    objectives.push({
      type: "ladder_position",
      description: "Finish in the top 4",
      target: 4,
      reward: 500,
      completed: false
    });
    
    objectives.push({
      type: "finals",
      description: "Reach the Grand Final",
      target: "grand_final",
      reward: 1000,
      completed: false
    });
    
    objectives.push({
      type: "premiership",
      description: "Win the Premiership",
      target: "win",
      reward: 2000,
      completed: false
    });
  } else if (overallRating >= 80) {
    // Strong team - finals contender
    objectives.push({
      type: "ladder_position",
      description: "Finish in the top 8",
      target: 8,
      reward: 400,
      completed: false
    });
    
    objectives.push({
      type: "finals",
      description: "Win a finals match",
      target: "win_final",
      reward: 800,
      completed: false
    });
    
    objectives.push({
      type: "win_count",
      description: "Win at least 14 matches",
      target: 14,
      reward: 600,
      completed: false
    });
  } else if (overallRating >= 75) {
    // Mid-table team - pushing for finals
    objectives.push({
      type: "ladder_position",
      description: "Finish in the top 10",
      target: 10,
      reward: 300,
      completed: false
    });
    
    objectives.push({
      type: "win_count",
      description: "Win at least 12 matches",
      target: 12,
      reward: 500,
      completed: false
    });
    
    objectives.push({
      type: "develop_players",
      description: "Develop 3 players under 23 by +5 rating points",
      target: 3,
      reward: 400,
      completed: false
    });
  } else {
    // Rebuilding team - development focus
    objectives.push({
      type: "ladder_position",
      description: "Avoid finishing in the bottom 4",
      target: 14,
      reward: 300,
      completed: false
    });
    
    objectives.push({
      type: "win_count",
      description: "Win at least 8 matches",
      target: 8,
      reward: 400,
      completed: false
    });
    
    objectives.push({
      type: "develop_players",
      description: "Develop 5 players under 23 by +5 rating points",
      target: 5,
      reward: 500,
      completed: false
    });
  }
  
  return objectives;
}

// Generate season phases based on the current year
export function generateSeasonPhases(year: number): SeasonPhase[] {
  return [
    {
      id: "off_season",
      name: "Off-Season",
      startDate: `${year-1}-10-01`,
      endDate: `${year}-02-28`,
      description: "Off-season period including draft and trade periods",
      color: "#9c27b0",
      keyEvents: [
        {
          id: "trade_period",
          name: "Trade Period",
          date: `${year-1}-10-10`,
          type: "trade",
          description: "10-day trading period",
          completed: false
        },
        {
          id: "list_lodgment",
          name: "List Lodgment Deadline",
          date: `${year-1}-10-31`,
          type: "milestone",
          description: "Final list submissions due",
          completed: false
        },
        {
          id: "national_draft",
          name: "National Draft",
          date: `${year-1}-11-25`,
          type: "draft",
          description: "National Draft day",
          completed: false
        },
        {
          id: "rookie_draft",
          name: "Rookie Draft",
          date: `${year-1}-11-26`,
          type: "draft",
          description: "Rookie Draft day",
          completed: false
        },
        {
          id: "preseason_draft",
          name: "Pre-Season Draft",
          date: `${year-1}-12-03`,
          type: "draft",
          description: "Pre-Season Draft day",
          completed: false
        }
      ]
    },
    {
      id: "pre_season",
      name: "Pre-Season",
      startDate: `${year}-01-01`,
      endDate: `${year}-03-15`,
      description: "Pre-season competitions and preparation",
      color: "#ff9800",
      keyEvents: [
        {
          id: "training_block_1",
          name: "Training Block 1",
          date: `${year}-01-10`,
          type: "training",
          description: "Endurance and strength focus",
          completed: false
        },
        {
          id: "training_block_2",
          name: "Training Block 2",
          date: `${year}-02-01`,
          type: "training",
          description: "Skills and tactical development",
          completed: false
        },
        {
          id: "practice_match_1",
          name: "Practice Match 1",
          date: `${year}-02-20`,
          type: "match",
          description: "First pre-season match",
          completed: false
        },
        {
          id: "practice_match_2",
          name: "Practice Match 2",
          date: `${year}-02-27`,
          type: "match",
          description: "Second pre-season match",
          completed: false
        },
        {
          id: "captain_selection",
          name: "Captain Selection",
          date: `${year}-03-01`,
          type: "milestone",
          description: "Selection of team captain and leadership group",
          completed: false
        }
      ]
    },
    {
      id: "regular_season",
      name: "Regular Season",
      startDate: `${year}-03-16`,
      endDate: `${year}-08-31`,
      description: "Home and away season - 23 rounds",
      color: "#2196f3",
      keyEvents: [
        {
          id: "season_start",
          name: "Season Start",
          date: `${year}-03-16`,
          type: "milestone",
          description: "Start of the regular season",
          completed: false
        },
        {
          id: "anzac_day",
          name: "ANZAC Day",
          date: `${year}-04-25`,
          type: "special_round",
          description: "ANZAC Day commemorative matches",
          completed: false
        },
        {
          id: "indigenous_round",
          name: "Sir Doug Nicholls Round",
          date: `${year}-05-25`,
          type: "special_round",
          description: "Celebrating Indigenous players and culture",
          completed: false
        },
        {
          id: "mid_season_draft",
          name: "Mid-Season Draft",
          date: `${year}-06-01`,
          type: "draft",
          description: "Mid-season draft for injury replacements",
          completed: false
        }
      ]
    },
    {
      id: "finals",
      name: "Finals Series",
      startDate: `${year}-09-01`,
      endDate: `${year}-09-30`,
      description: "Finals series including Grand Final",
      color: "#f44336",
      keyEvents: [
        {
          id: "qualifying_finals",
          name: "Qualifying & Elimination Finals",
          date: `${year}-09-05`,
          type: "match",
          description: "Week 1 of Finals",
          completed: false
        },
        {
          id: "semi_finals",
          name: "Semi Finals",
          date: `${year}-09-12`,
          type: "match",
          description: "Week 2 of Finals",
          completed: false
        },
        {
          id: "preliminary_finals",
          name: "Preliminary Finals",
          date: `${year}-09-19`,
          type: "match",
          description: "Week 3 of Finals",
          completed: false
        },
        {
          id: "grand_final",
          name: "Grand Final",
          date: `${year}-09-27`,
          type: "match",
          description: "AFL Grand Final",
          completed: false
        }
      ]
    }
  ];
}

// Generate special rounds for the season
export function generateSpecialRounds(year: number): SpecialRound[] {
  return [
    {
      id: "anzac_round",
      name: "ANZAC Round",
      round: 6,
      startDate: `${year}-04-24`,
      endDate: `${year}-04-26`,
      description: "Commemorating ANZAC Day with special matches",
      iconPath: "/afl-images/anzac-round.png"
    },
    {
      id: "indigenous_round",
      name: "Sir Doug Nicholls Round",
      round: 10,
      startDate: `${year}-05-24`,
      endDate: `${year}-05-26`,
      description: "Celebrating Indigenous players and culture",
      iconPath: "/afl-images/indigenous-round.png"
    },
    {
      id: "rivalry_round",
      name: "Rivalry Round",
      round: 15,
      startDate: `${year}-06-28`,
      endDate: `${year}-06-30`,
      description: "Featuring traditional club rivalries",
      iconPath: "/afl-images/rivalry-round.png"
    },
    {
      id: "multicultural_round",
      name: "Multicultural Round",
      round: 18,
      startDate: `${year}-07-19`,
      endDate: `${year}-07-21`,
      description: "Celebrating diversity in Australian Football",
      iconPath: "/afl-images/multicultural-round.png"
    }
  ];
}

// Initialize player development records from player data
export function initializePlayerDevelopment(players: Player[], teamId: string): PlayerDevelopmentRecord[] {
  return players
    .filter(player => player.teamId === teamId)
    .map(player => {
      // Calculate average of all player attributes
      const attributeValues = [
        player.attributes.speed,
        player.attributes.strength,
        player.attributes.stamina,
        player.attributes.agility,
        player.attributes.intelligence,
        player.attributes.kicking,
        player.attributes.marking,
        player.attributes.handball,
        player.attributes.tackling
      ];
      
      // Add optional attributes if they exist
      if (player.attributes.goalkicking) attributeValues.push(player.attributes.goalkicking);
      if (player.attributes.crumbing) attributeValues.push(player.attributes.crumbing);
      if (player.attributes.clearances) attributeValues.push(player.attributes.clearances);
      if (player.attributes.insidePlay) attributeValues.push(player.attributes.insidePlay);
      if (player.attributes.intercept) attributeValues.push(player.attributes.intercept);
      if (player.attributes.rebound) attributeValues.push(player.attributes.rebound);
      if (player.attributes.tapwork) attributeValues.push(player.attributes.tapwork);
      if (player.attributes.followUp) attributeValues.push(player.attributes.followUp);
      
      // Calculate overall rating as the average of all attributes
      const overallRating = Math.floor(
        attributeValues.reduce((sum, val) => sum + val, 0) / attributeValues.length
      );
      
      // Calculate potential based on age - younger players have higher potential
      const potentialModifier = Math.max(0, 25 - player.age);
      const potentialRating = Math.min(99, overallRating + potentialModifier);
      
      return {
        playerId: player.id,
        name: player.name,
        position: player.position,
        age: player.age,
        startOfSeasonRating: overallRating,
        currentRating: overallRating,
        potentialRating: potentialRating,
        attributeChanges: {}
      };
    });
}

// Initialize game state with a selected team
export function initializeGameState(teamId: string, teams: Team[], players: Player[]): GameState {
  const selectedTeam = teams.find(team => team.id === teamId);
  
  if (!selectedTeam) {
    throw new Error("Invalid team selected");
  }
  
  const fixtures = generateFixtures(teams, 2025);
  const ladder = initializeLadder(teams);
  const objectives = generateObjectives(selectedTeam);
  
  // Calculate team finances based on team attributes
  const teamRating = (
    selectedTeam.attributes.attack + 
    selectedTeam.attributes.midfield + 
    selectedTeam.attributes.defense + 
    selectedTeam.attributes.coaching
  ) / 4;
  
  // Calculate weekly wage
  const teamPlayers = players.filter(player => player.teamId === teamId);
  const weeklyWage = teamPlayers.reduce((total, player) => total + player.contract.salary / 52, 0);
  
  // Generate initial press conference
  const initialPressConference: PressConference = {
    id: "initial_press_conference",
    date: "2025-03-01",
    topic: "Season Expectations",
    questions: [
      {
        question: "What are your expectations for the season?",
        options: [
          "We're aiming for the premiership.",
          "We want to make the finals.",
          "We're focusing on development this season.",
          "I prefer not to set specific targets."
        ]
      },
      {
        question: "How would you describe your coaching style?",
        options: [
          "Attacking and aggressive.",
          "Balanced and adaptable.",
          "Defensive and disciplined.",
          "Player-focused and developmental."
        ]
      },
      {
        question: "What's your plan for developing young talent?",
        options: [
          "Give them game time immediately.",
          "Gradually integrate them with experienced players.",
          "Focus on training before giving them matches.",
          "Loan them out to get experience elsewhere."
        ]
      }
    ],
    completed: false
  };
  
  // Generate season phases and special rounds
  const seasonPhases = generateSeasonPhases(2025);
  const specialRounds = generateSpecialRounds(2025);
  
  // Initialize player development
  const playerDevelopment = initializePlayerDevelopment(players, teamId);
  
  const initialDate = "2025-03-01";

  return {
    initialized: true,
    userTeamId: teamId,
    currentSeason: 2025,
    currentRound: 1,
    currentDate: initialDate,
    currentDayOfWeek: new Date(initialDate).getDay(),
    seasonFixtures: fixtures,
    ladder,
    objectives,
    finances: {
      balance: 5000 + (teamRating - 70) * 100, // Base 5M with adjustment for team quality
      weeklyWage: Math.round(weeklyWage),
      sponsorships: 1000 + (teamRating - 70) * 50,
      matchDayRevenue: 500 + (teamRating - 70) * 25,
      merchandiseRevenue: 300 + (teamRating - 70) * 20
    },
    settings: {
      difficulty: "medium",
      matchSimSpeed: "medium",
      injuryFrequency: "medium",
      transferActivity: "medium"
    },
    lastUpdated: new Date().toISOString(),
    trainingSessions: [],
    pressConferences: [initialPressConference],
    morale: 75,
    fanSupport: 75,
    boardConfidence: 75,
    
    // Initialize new calendar properties
    seasonPhases,
    currentPhase: "pre_season",
    seasonProgress: 0,
    specialRounds,
    
    // Initialize new dashboard properties
    formGuide: [],
    performanceTrends: [],
    playerDevelopment,
    teamComparisons: [],
    activeMatchId: null,
    matchDayPhase: "none",
    lastDailySummary: null,
    userPrompts: [],
  };
}

// --- START OF NEW MATCH SIMULATION AND LADDER LOGIC ---

/**
 * Simulates a single match outcome based on team attributes.
 * For now, player stats (MatchStats) and detailed events are not generated.
 */
function simulateMatch(
  matchToSimulate: Match,
  homeTeam: Team,
  awayTeam: Team
): NonNullable<Match['result']> { // Ensure result is not undefined
  const homeAdvantage = 5; // Small advantage for home team

  // Base score potential on team attributes (simplified)
  let homeScorePotential =
    homeTeam.attributes.attack * (Math.random() * 0.6 + 0.7) + // Attack strength
    homeTeam.attributes.midfield * (Math.random() * 0.4 + 0.3) + // Midfield control
    (Math.random() * 20) + // Random factor
    homeAdvantage;
  
  let awayScorePotential =
    awayTeam.attributes.attack * (Math.random() * 0.6 + 0.7) + // Attack strength
    awayTeam.attributes.midfield * (Math.random() * 0.4 + 0.3) + // Midfield control
    (Math.random() * 20); // Random factor

  // Adjust based on defense (opponent's defense reduces potential)
  homeScorePotential -= awayTeam.attributes.defense * (Math.random() * 0.3);
  awayScorePotential -= homeTeam.attributes.defense * (Math.random() * 0.3);
  
  // Ensure potential is not negative
  homeScorePotential = Math.max(0, homeScorePotential);
  awayScorePotential = Math.max(0, awayScorePotential);

  // Convert potential to goals (e.g., every 8-10 points of potential is a goal)
  const homeGoals = Math.floor(homeScorePotential / (Math.random() * 3 + 7)); 
  const awayGoals = Math.floor(awayScorePotential / (Math.random() * 3 + 7));

  // Behinds: typically similar to or slightly more than goals
  const homeBehinds = Math.floor(homeGoals * (Math.random() * 0.8 + 0.7) + (Math.random() * 5));
  const awayBehinds = Math.floor(awayGoals * (Math.random() * 0.8 + 0.7) + (Math.random() * 5));

  const homeTotalScore = homeGoals * 6 + homeBehinds;
  const awayTotalScore = awayGoals * 6 + awayBehinds;

  return {
    homeScore: { goals: homeGoals, behinds: homeBehinds, total: homeTotalScore },
    awayScore: { goals: awayGoals, behinds: awayBehinds, total: awayTotalScore },
    events: [ // Basic event to signify match completion
      { type: "final", message: `Final Siren: ${homeTeam.name} ${homeTotalScore} vs ${awayTeam.name} ${awayTotalScore}`, timestamp: 0 }
    ],
    stats: { // Player stats are not simulated in this basic version
      disposals: {},
      marks: {},
      tackles: {},
      goals: {},
      behinds: {}
    }
  };
}

/**
 * Updates the ladder based on a single completed match.
 */
function updateLadderAfterMatch(
  currentLadder: LadderPosition[],
  completedMatch: Match,
  homeTeamId: string,
  awayTeamId: string
): LadderPosition[] {
  if (!completedMatch.result) {
    console.error("Match result missing for ladder update:", completedMatch);
    return currentLadder;
  }

  const { homeScore, awayScore } = completedMatch.result;
  const newLadder = currentLadder.map(pos => ({ ...pos })); // Deep copy

  const homeTeamLadderPos = newLadder.find(p => p.teamId === homeTeamId);
  const awayTeamLadderPos = newLadder.find(p => p.teamId === awayTeamId);

  if (homeTeamLadderPos) {
    homeTeamLadderPos.played += 1;
    homeTeamLadderPos.pointsFor += homeScore.total;
    homeTeamLadderPos.pointsAgainst += awayScore.total;
  } else {
    console.error(`Ladder position not found for home team ID: ${homeTeamId}`);
  }

  if (awayTeamLadderPos) {
    awayTeamLadderPos.played += 1;
    awayTeamLadderPos.pointsFor += awayScore.total;
    awayTeamLadderPos.pointsAgainst += homeScore.total;
  } else {
     console.error(`Ladder position not found for away team ID: ${awayTeamId}`);
  }

  if (homeTeamLadderPos && awayTeamLadderPos) {
    if (homeScore.total > awayScore.total) { // Home win
      homeTeamLadderPos.wins += 1;
      homeTeamLadderPos.points += 4;
      awayTeamLadderPos.losses += 1;
    } else if (awayScore.total > homeScore.total) { // Away win
      awayTeamLadderPos.wins += 1;
      awayTeamLadderPos.points += 4;
      homeTeamLadderPos.losses += 1;
    } else { // Draw
      homeTeamLadderPos.draws += 1;
      homeTeamLadderPos.points += 2;
      awayTeamLadderPos.draws += 1;
      awayTeamLadderPos.points += 2;
    }

    // Recalculate percentage
    homeTeamLadderPos.percentage = homeTeamLadderPos.pointsAgainst === 0 ? (homeTeamLadderPos.pointsFor > 0 ? 9999 : 0) : (homeTeamLadderPos.pointsFor / homeTeamLadderPos.pointsAgainst) * 100;
    awayTeamLadderPos.percentage = awayTeamLadderPos.pointsAgainst === 0 ? (awayTeamLadderPos.pointsFor > 0 ? 9999 : 0) : (awayTeamLadderPos.pointsFor / awayTeamLadderPos.pointsAgainst) * 100;
  }
  
  return newLadder;
}

// Helper function to process all scheduled matches for a given date
function processScheduledMatches(
  currentFixtures: Match[],
  currentDate: string,
  allTeams: Team[],
  dailySummary: string[]
): { updatedFixtures: Match[]; newlyCompleted: Match[] } {
  const newlyCompleted: Match[] = [];
  let matchesProcessedToday = 0;
  const updatedFixtures = currentFixtures.map(match => {
    if (match.date === currentDate && !match.completed) {
      const homeTeam = allTeams.find(t => t.id === match.homeTeamId);
      const awayTeam = allTeams.find(t => t.id === match.awayTeamId);
      let simulatedResult: NonNullable<Match['result']>;

      if (homeTeam && awayTeam) {
        simulatedResult = simulateMatch(match, homeTeam, awayTeam);
        dailySummary.push(`Match ${match.id} simulated. ${homeTeam.name} ${simulatedResult.homeScore.total} vs ${awayTeam.name} ${simulatedResult.awayScore.total}`);
        matchesProcessedToday++;
      } else {
        dailySummary.push(`Error: Could not find home or away team for match: ${match.id}`);
        simulatedResult = { // Default forfeit result
          homeScore: { goals: 0, behinds: 0, total: 0 },
          awayScore: { goals: 0, behinds: 0, total: 0 },
          events: [{type: "final", message: "Match forfeited due to missing team data.", timestamp: 0}],
          stats: { disposals: {}, marks: {}, tackles: {}, goals: {}, behinds: {} }
        };
      }
      const completedMatch = { ...match, result: simulatedResult, completed: true };
      newlyCompleted.push(completedMatch);
      return completedMatch;
    }
    return match;
  });
  if (matchesProcessedToday === 0 && newlyCompleted.length === 0) {
    dailySummary.push("No matches scheduled or processed today.");
  }
  return { updatedFixtures, newlyCompleted };
}

// Helper function to update the ladder based on newly completed matches
function updateLadderForCompletedMatches(
  currentLadder: LadderPosition[],
  newlyCompletedMatches: Match[],
  dailySummary: string[]
): LadderPosition[] {
  let updatedLadder = [...currentLadder.map(l => ({...l}))]; 
  if (newlyCompletedMatches.length > 0) {
    newlyCompletedMatches.forEach(completedMatch => {
      updatedLadder = updateLadderAfterMatch(updatedLadder, completedMatch, completedMatch.homeTeamId, completedMatch.awayTeamId);
    });
    dailySummary.push(`Ladder updated reflecting ${newlyCompletedMatches.length} completed match(es).`);
  }
  return updatedLadder;
}

// Helper function to handle user-specific events if their match was today
function handleUserTeamMatchDayEvents(
  currentState: GameState, 
  newlyCompletedMatches: Match[],
  allTeams: Team[],
  dailySummary: string[]
): GameState {
  const userTeamId = currentState.userTeamId;
  if (!userTeamId) return currentState;

  const userMatchJustCompleted = newlyCompletedMatches.find(
    m => m.homeTeamId === userTeamId || m.awayTeamId === userTeamId
  );

  if (userMatchJustCompleted) {
    if (userMatchJustCompleted.round > currentState.currentRound) {
      currentState.currentRound = userMatchJustCompleted.round;
      dailySummary.push(`Advanced to Round ${currentState.currentRound}.`);
    }
    const opponentId = userMatchJustCompleted.homeTeamId === userTeamId 
      ? userMatchJustCompleted.awayTeamId 
      : userMatchJustCompleted.homeTeamId;
    const opponent = allTeams.find(t => t.id === opponentId);
    const userTeam = allTeams.find(t => t.id === userTeamId);

    // Generate post-match press conference only if not already existing for this match
    const presserId = `post_match_${userMatchJustCompleted.id}`;
    if (!currentState.pressConferences.some(pc => pc.id === presserId)) {
      currentState.pressConferences.push({
        id: presserId,
        date: currentState.currentDate, // Should be current game date
        topic: `Post-Match: ${userTeam?.name || 'Your Team'} vs ${opponent?.name || 'Opponent'}`,
        questions: [
          {
            question: "What are your thoughts on the team's performance today?",
            options: ["Very pleased, a great effort.", "A mixed bag, some positives and negatives.", "Disappointed, we need to improve.", "No comment right now."]
          },
        ],
        completed: false
      });
      dailySummary.push(`Post-match press conference scheduled for ${userTeam?.name || 'Your Team'}.`);
    }
  }
  return currentState; 
}

// Helper function to process training sessions for the day
function processTrainingSessions(currentState: GameState, dailySummary: string[]): GameState {
  const trainingToday = currentState.trainingSessions.find(
    session => session.date === currentState.currentDate && !session.completed
  );
  
  if (trainingToday) {
    currentState.trainingSessions = currentState.trainingSessions.map(session =>
      session.id === trainingToday.id ? { ...session, completed: true } : session
    );
    

    // Simplified training effects
    let moraleBoost = 0;
    switch (trainingToday.focus) {
      case "attack": moraleBoost = 1; break;
      case "defense": moraleBoost = 1; break;
      case "fitness": moraleBoost = 2; break;
      case "teamwork": moraleBoost = 3; break;
      case "set_pieces": moraleBoost = 1; break;
      case "recovery": moraleBoost = 2; break;
    }
    currentState.morale = Math.min(100, Math.max(0, currentState.morale + moraleBoost));
  }
  return currentState; // Return the modified state
}

// Helper function to apply random events and metric decay
function applyRandomEventsAndDecay(currentState: GameState, dailySummary: string[]): GameState {
  const randomEvent = Math.random();
  let eventDescription: string | null = null;
  if (randomEvent > 0.95) { // Rare positive event
    currentState.morale = Math.min(100, currentState.morale + 5);
    currentState.fanSupport = Math.min(100, currentState.fanSupport + 3);
    eventDescription = "Unexpected boost in team morale and fan support!";
  } else if (randomEvent > 0.90) { // Uncommon positive event
    currentState.morale = Math.min(100, currentState.morale + 2);
    currentState.fanSupport = Math.min(100, currentState.fanSupport + 1);
    eventDescription = "Minor positive vibe around the club today.";
  } else if (randomEvent < 0.05) { // Rare negative event
    currentState.morale = Math.max(0, currentState.morale - 5);
    currentState.fanSupport = Math.max(0, currentState.fanSupport - 3);
    eventDescription = "A tough day, morale and fan support took a hit.";
  } else if (randomEvent < 0.10) { // Uncommon negative event
    currentState.morale = Math.max(0, currentState.morale - 2);
    currentState.fanSupport = Math.max(0, currentState.fanSupport - 1);
    eventDescription = "Slight dip in morale and fan support.";
  }

  if (eventDescription) {
    dailySummary.push(`Random Event: ${eventDescription}`);
  }

  // Natural decay - these are subtle, maybe don't log unless significant or for debugging
  const oldMorale = currentState.morale;
  currentState.morale = Math.max(0, currentState.morale - 0.2);
  // if (oldMorale - currentState.morale > 0.1) dailySummary.push("Slight natural decay in team morale.");
  
  currentState.fanSupport = Math.max(0, currentState.fanSupport - 0.1);
  currentState.boardConfidence = Math.max(0, currentState.boardConfidence - 0.1);
  
  return currentState;
}

// Helper function to process key calendar events for the day
function processKeyEvents(currentState: GameState, dailySummary: string[]): GameState {
  const today = currentState.currentDate;
  const currentPhaseDetails = currentState.seasonPhases.find(p => p.id === currentState.currentPhase);

  if (currentPhaseDetails) {
    currentPhaseDetails.keyEvents.forEach(event => {
      if (event.date === today && !event.completed) {
        dailySummary.push(`Key Event Today: ${event.name} (${event.type}) - ${event.description}`);
        event.completed = true; // Mark as completed in the newState structure

        // Example of generating a user prompt for a key event
        if (event.type === 'draft' || event.type === 'trade') {
          currentState.userPrompts.push({
            id: `prompt_${event.id}_${Date.now()}`,
            type: 'decision', // Or 'information'
            title: event.name,
            message: `Today is ${event.name}. Prepare for ${event.description}.`,
            relatedEntityId: event.id,
            requiresAcknowledgement: true,
          });
          dailySummary.push(`User prompt generated for ${event.name}.`);
        }
        // Add more specific handling for other event types if needed
      }
    });
  }

  currentState.specialRounds.forEach(round => {
    if (round.startDate === today) { // Assuming special rounds trigger on their start date
      dailySummary.push(`Special Round Starting: ${round.name} - ${round.description}`);
      // Potentially add UserPrompt or other logic for special rounds
    }
  });
  
  return currentState;
}

// Helper function to check for and handle season phase transitions
function checkPhaseTransition(currentState: GameState, dailySummary: string[]): GameState {
  const today = new Date(currentState.currentDate);
  const currentPhaseDetails = currentState.seasonPhases.find(p => p.id === currentState.currentPhase);

  if (!currentPhaseDetails) {
    dailySummary.push("Error: Current season phase details not found. Cannot check for transition.");
    return currentState;
  }

  const currentPhaseEndDate = new Date(currentPhaseDetails.endDate);

  if (today > currentPhaseEndDate) {
    let nextPhaseId = "";
    let newSeason = currentState.currentSeason;

    switch (currentState.currentPhase) {
      case "pre_season":
        nextPhaseId = "regular_season";
        break;
      case "regular_season":
        const teamLadderPos = currentState.ladder.find(lp => lp.teamId === currentState.userTeamId);
        // Ensure ladder is sorted before finding rank
        const sortedLadder = [...currentState.ladder].sort((a,b) => {
            if (b.points !== a.points) return b.points - a.points;
            return b.percentage - a.percentage;
        });
        const rank = sortedLadder.findIndex(lp => lp.teamId === currentState.userTeamId) + 1;

        if (teamLadderPos && rank > 0 && rank <= 8) { 
            nextPhaseId = "finals";
             dailySummary.push("Regular season ended. Qualified for Finals!");
        } else {
            nextPhaseId = "off_season";
             dailySummary.push("Regular season ended. Did not qualify for finals. Moving to Off-Season.");
        }
        break;
      case "finals":
        nextPhaseId = "off_season";
        dailySummary.push("Finals series concluded. Moving to Off-Season.");
        // TODO: Add logic here to check if user won premiership and generate a special prompt/event
        break;
      case "off_season":
        nextPhaseId = "pre_season";
        newSeason = currentState.currentSeason + 1;
        dailySummary.push(`Transitioning to new season: ${newSeason}.`);
        currentState.currentSeason = newSeason;
        currentState.currentRound = 1; 
        currentState.seasonPhases = generateSeasonPhases(newSeason);
        currentState.seasonFixtures = generateFixtures(allTeamsData, newSeason);
        currentState.ladder = initializeLadder(allTeamsData);
        currentState.specialRounds = generateSpecialRounds(newSeason);
        // Use imported allPlayersData for initializing player development
        currentState.playerDevelopment = initializePlayerDevelopment(allPlayersData, currentState.userTeamId || ""); 
        // Remove newSeason from generateObjectives call if it only takes team
        const userTeamForObjectives = allTeamsData.find(t => t.id === currentState.userTeamId);
        if (userTeamForObjectives) {
            currentState.objectives = generateObjectives(userTeamForObjectives);
        } else {
            dailySummary.push("Error: Could not find user team to generate new season objectives.");
            currentState.objectives = [];
        }
        currentState.userPrompts = [];
        currentState.trainingSessions = currentState.trainingSessions.filter(ts => !ts.completed);
        dailySummary.push(`New season ${newSeason} setup: Fixtures, Ladder, Objectives, and Phases regenerated.`);
        break;
      default:
        dailySummary.push(`Unknown current phase: ${currentState.currentPhase}. Cannot transition.`);
        return currentState;
    }
    
    const nextPhaseDetails = currentState.seasonPhases.find(p => p.id === nextPhaseId);
    if (nextPhaseDetails) {
      currentState.currentPhase = nextPhaseId;
      dailySummary.push(`Transitioned to new phase: ${nextPhaseDetails.name}.`);
    } else {
      dailySummary.push(`Error: Could not find details for next phase: ${nextPhaseId}.`);
    }
  }
  return currentState;
}

export function advanceGameDay(gameState: GameState, allTeams: Team[]): { newState: GameState; dailySummary: string[] } {
  let newState = JSON.parse(JSON.stringify(gameState)); 
  const dailySummary: string[] = [];

  newState.userPrompts = newState.userPrompts.filter((prompt: UserPrompt) => prompt.requiresAcknowledgement || prompt.type === 'decision');

  const newCurrentDate = new Date(newState.currentDate);
  newCurrentDate.setDate(newCurrentDate.getDate() + 1);
  newState.currentDate = newCurrentDate.toISOString().split('T')[0];
  newState.currentDayOfWeek = newCurrentDate.getDay();
  newState.lastUpdated = new Date().toISOString();
  dailySummary.push(`Date advanced to ${newState.currentDate} (Day ${newState.currentDayOfWeek}).`);

  const matchProcessingResult = processScheduledMatches(
    newState.seasonFixtures,
    newState.currentDate, 
    allTeams,
    dailySummary 
  );
  newState.seasonFixtures = matchProcessingResult.updatedFixtures;
  const newlyCompletedToday = matchProcessingResult.newlyCompleted;

  if (newlyCompletedToday.length > 0) {
    newState.ladder = updateLadderForCompletedMatches(newState.ladder, newlyCompletedToday, dailySummary);
  }
  
  newState = handleUserTeamMatchDayEvents(newState, newlyCompletedToday, allTeams, dailySummary);
  newState = processTrainingSessions(newState, dailySummary);
  newState = processKeyEvents(newState, dailySummary);
  newState = checkPhaseTransition(newState, dailySummary);
  newState = applyRandomEventsAndDecay(newState, dailySummary);

  if (newState.userTeamId && newlyCompletedToday.every(m => m.homeTeamId !== newState.userTeamId && m.awayTeamId !== newState.userTeamId)) {
    const userTeamNextMatch = newState.seasonFixtures.find(
      (match: Match) => !match.completed && (match.homeTeamId === newState.userTeamId || match.awayTeamId === newState.userTeamId) && new Date(match.date) >= new Date(newState.currentDate)
    );
    if (userTeamNextMatch && userTeamNextMatch.round > newState.currentRound && newState.currentPhase === 'regular_season') {
      const userGamesThisRoundPending = newState.seasonFixtures.some(
        (match: Match) => !match.completed && match.round === newState.currentRound && (match.homeTeamId === newState.userTeamId || match.awayTeamId === newState.userTeamId)
      );
      if (!userGamesThisRoundPending) {
         newState.currentRound = userTeamNextMatch.round;
         dailySummary.push(`Advanced to Round ${newState.currentRound} based on upcoming fixtures.`);
      }
    }
  }
  
  newState.lastDailySummary = [...dailySummary]; 

  return { newState, dailySummary };
}

// Schedule a training session
export function scheduleTraining(
  gameState: GameState, 
  date: string, 
  focus: TrainingFocus, 
  intensity: "light" | "medium" | "intense",
  playerIds: string[]
): GameState {
  const newState = { ...gameState };
  const newTrainingSession: TrainingSession = {
    id: `training_${Date.now()}`,
    date,
    focus,
    intensity,
    playerIds,
    completed: false
  };
  newState.trainingSessions = [...gameState.trainingSessions, newTrainingSession];
  newState.lastUpdated = new Date().toISOString();
  return newState;
}

// Complete a press conference
export function completePresser(
  gameState: GameState,
  presserId: string,
  answers: string[]
): GameState {
  const newState = { ...gameState };
  const presserIndex = gameState.pressConferences.findIndex(pc => pc.id === presserId);
  if (presserIndex === -1) {
    return gameState; 
  }
  const updatedPresser = { ...gameState.pressConferences[presserIndex] };
  updatedPresser.completed = true;
  // TODO: Apply impact of answers to morale, fan support, board confidence
  // For now, just marking as complete
  const updatedPressConferences = [...gameState.pressConferences];
  updatedPressConferences[presserIndex] = updatedPresser;
  newState.pressConferences = updatedPressConferences;
  newState.lastUpdated = new Date().toISOString();
  return newState;
}
