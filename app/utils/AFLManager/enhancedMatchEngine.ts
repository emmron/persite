// Enhanced Match Engine for AFL Manager
// Brings Football Manager level depth to match simulation

import { Team } from "~/data/AFLManager/teams";
import { Player, Position } from "~/data/AFLManager/players";
import { Match, MatchEvent, MatchScore, MatchStats } from "~/data/AFLManager/gameState";
import {
  simulateMatch as baseSimulateMatch,
  PlayerMatchStats,
  TeamLineup,
  TeamMatchSummary,
  MatchSummary,
  MatchSimulationResult,
  FIELD_WIDTH,
  FIELD_HEIGHT,
  PLAYER_RADIUS,
  BALL_RADIUS,
  resetPositions,
  kickBall,
  moveBall,
  TEAM_FORMATIONS
} from "./matchEngine";

// Enhanced constants for more detailed simulation
const WEATHER_TYPES = ["Sunny", "Overcast", "Light Rain", "Heavy Rain", "Windy"] as const;
type Weather = typeof WEATHER_TYPES[number];

const GROUND_CONDITIONS = ["Perfect", "Good", "Soft", "Wet", "Heavy"] as const;
type GroundCondition = typeof GROUND_CONDITIONS[number];

const CROWD_SIZES = ["Small", "Average", "Large", "Capacity"] as const;
type CrowdSize = typeof CROWD_SIZES[number];

const REFEREE_STRICTNESS = ["Lenient", "Balanced", "Strict"] as const;
type RefereeStyle = typeof REFEREE_STRICTNESS[number];

// Additional injury types for more detailed injury simulation
const INJURY_TYPES = [
  "Minor Knock", "Bruised Shoulder", "Corked Thigh", "Rolled Ankle", "Hamstring Tightness", 
  "Jarred Knee", "Back Spasm", "Concussion", "Hamstring Strain", "Calf Strain", 
  "Quad Strain", "Groin Strain", "Ankle Sprain", "Knee Sprain", "Shoulder Dislocation",
  "Broken Finger", "Broken Nose", "ACL Tear", "PCL Tear", "MCL Tear"
] as const;
type InjuryType = typeof INJURY_TYPES[number];

// Match context for richer simulation
interface MatchContext {
  weather: Weather;
  groundCondition: GroundCondition;
  crowdSize: CrowdSize;
  crowdSupport: "Home" | "Away" | "Even";
  refereeStyle: RefereeStyle;
  rivalryIntensity: number; // 1-10
  temperature: number; // Celsius
  timeOfDay: "Day" | "Twilight" | "Night";
  stadiumSize: "Small" | "Medium" | "Large";
  key_narratives: string[]; // Story elements like "player milestone", "coach under pressure"
}

// Enhanced player match stats including more detailed metrics
interface EnhancedPlayerMatchStats extends PlayerMatchStats {
  // New detailed stats
  freesFor: number;
  freesAgainst: number;
  bounces: number;
  spoils: number;
  interceptPossessions: number;
  shotEfficiency: number; // percentage
  metersGainedPerDisposal: number;
  timeOnGround: number; // minutes
  heatmap: number[][]; // Position heatmap
  playerInfluence: number[]; // Influence by quarter (0-10)
  tackles_inside_50: number;
  scoreInvolvements: number;
  pressureActs: number;
  
  // Performance metrics
  workRate: number; // 0-100
  fatigue: number; // 0-100
  confidence: number; // 0-100
  impact: number; // 0-100
  
  // Specialized metrics by position
  forwardPressure?: number;
  reboundEfficiency?: number;
  contestsWon?: number;
  
  // Tracking
  possessionChains: number;
  effectiveDisposals: number;
  clangers: number;
  shotsOnGoal: number;
  oneTwoPerceners: number; // Shepherds, smothers, spoils
  
  // Current injury if applicable
  injury?: {
    type: InjuryType;
    severity: "Minor" | "Moderate" | "Major";
    duration: number; // estimated games out
    occurred: number; // timestamp when injury occurred
  };
}

// Enhanced team match stats for more comprehensive team data
interface EnhancedTeamMatchStats extends TeamMatchSummary {
  // Quarter-by-quarter breakdown
  quarterBreakdown: {
    goals: number[];
    behinds: number[];
    scores: number[];
    inside50s: number[];
    clearances: number[];
    stoppages: number[];
    tackles: number[];
    contestedPossessions: number[];
    uncontestPossessions: number[];
    marks: number[];
    hitouts: number[];
  };
  
  // Detailed team stats
  scoreFromTurnover: number;
  scoreFromStoppage: number;
  scoreFromCenterBounce: number;
  interceptPossessions: number;
  marksInside50: number;
  reboundFrom50: number;
  pressureGauge: number; // 0-100
  timeInForwardHalf: number; // percentage
  disposalEfficiency: number; // percentage
  contestWinPercentage: number;
  effectiveKicks: number;
  tackleEfficiency: number; // percentage
  
  // Team performance metrics
  teamwork: number; // 0-100
  pressure: number; // 0-100
  structure: number; // 0-100
  composure: number; // 0-100
  discipline: number; // 0-100
  
  // Tactical effectiveness metrics
  offensiveEfficiency: number; // 0-100
  defensiveEfficiency: number; // 0-100
  stoppage_efficiency: number; // 0-100
  transition_efficiency: number; // 0-100
  
  // Zones effectiveness
  forward_line_efficiency: number; // 0-100
  midfield_efficiency: number; // 0-100
  defensive_efficiency: number; // 0-100
  
  // Injuries incurred
  injuries: {
    player: string;
    injury: InjuryType;
    severity: "Minor" | "Moderate" | "Major";
    duration: number; // estimated games out
  }[];
  
  // Fatigue metrics
  teamFatigue: number; // 0-100
  rotationQuality: number; // 0-100
}

// Enhanced match result for detailed post-match analysis
interface EnhancedMatchSummary extends Omit<MatchSummary, 'bestPlayers'> {
  homePlayerStats: EnhancedPlayerMatchStats[];
  awayPlayerStats: EnhancedPlayerMatchStats[];
  homeTeamStats: EnhancedTeamMatchStats;
  awayTeamStats: EnhancedTeamMatchStats;
  
  matchContext: MatchContext;
  
  // Timeline of key events
  keyEvents: {
    quarter: number;
    timestamp: number; // seconds into quarter
    event: string;
    player?: string;
    team: "home" | "away";
    impactLevel: number; // 1-10 significance
    description: string;
  }[];
  
  // Momentum chart (0-100 for each team at regular intervals)
  momentumChart: {
    time: number;
    homeTeamMomentum: number;
    awayTeamMomentum: number;
  }[];
  
  // Coaching effectiveness
  coachingImpact: {
    home: {
      rotationEffectiveness: number; // 0-100
      tacticalAdjustments: number; // 0-100
      playerUtilization: number; // 0-100
      overallImpact: number; // 0-100
    };
    away: {
      rotationEffectiveness: number; // 0-100
      tacticalAdjustments: number; // 0-100
      playerUtilization: number; // 0-100
      overallImpact: number; // 0-100
    };
  };
  
  // Best players (3-2-1 votes) - making this compatible with the original interface
  bestPlayers: {
    home: string[];
    away: string[];
  } & {
    detailedBestPlayers: {
      player: string;
      team: "home" | "away";
      votes: number;
      reason: string;
    }[];
  };
  
  // Commentary highlights
  commentaryHighlights: string[];
}

// Interface for enhanced match simulation result
interface EnhancedMatchSimulationResult extends Omit<MatchSimulationResult, 'matchSummary'> {
  matchSummary: EnhancedMatchSummary;
  enhancedHomePlayerStats: Record<string, EnhancedPlayerMatchStats>;
  enhancedAwayPlayerStats: Record<string, EnhancedPlayerMatchStats>;
}

// Enhanced team lineup with more tactical options
interface EnhancedTeamLineup extends TeamLineup {
  // Enhanced tactical options
  enhancedTactics: {
    // Intensity settings
    intensitySettings: {
      tacklingIntensity: number; // 1-10
      pressureIntensity: number; // 1-10
      markingIntensity: number; // 1-10
      runningIntensity: number; // 1-10
    };
    
    // Tactical triggers 
    triggers: {
      whenLeadingBy: "maintain-style" | "defensive" | "time-wasting" | "counter-attack";
      whenTrailingBy: "maintain-style" | "attacking" | "high-risk" | "direct-play";
      inWetConditions: "adapt-kicks" | "handball-chains" | "maintain-style";
      inFinalQuarter: "fresh-legs" | "experience" | "defensive-lock" | "all-out-attack";
    };
    
    // Set play specific instructions
    setPlays: {
      centerBounceStructures: Record<string, {
        formation: string;
        primaryTarget: string;
        secondaryTarget: string;
        clearanceDirection: "corridor" | "boundary" | "adaptive";
      }>;
      kickInStrategy: "play-on" | "chip-short" | "long-corridor" | "long-boundary" | "switch";
      stoppageSetups: Record<string, {
        formation: string;
        primaryTarget: string;
      }>;
    };
    
    // Team rules
    teamRules: {
      kickInTaker: string;
      zoneCoverage: "strict" | "loose" | "adaptive";
      defenderInterceptRisk: number; // 1-10
      forwardDefensivePressure: number; // 1-10
      midfielderDefensiveTracking: "always" | "situational" | "rarely"; 
      handballReceiveMovement: "static" | "dynamic" | "both";
    };
  };
  
  // Player specific tactics (more detailed)
  enhancedPlayerTactics: Record<string, {
    basePosition: Position;
    role: string;
    detailedInstructions: string[];
    zoneCoverage: {
      primary: { x1: number, y1: number, x2: number, y2: number }; // zone boundaries
      secondary?: { x1: number, y1: number, x2: number, y2: number };
    };
    movementFreedom: number; // 1-10
    riskTaking: number; // 1-10
    creativeFreedoom: number; // 1-10
    defensiveResponsibility: number; // 1-10
    specialAssignments: {
      tagPlayer?: string;
      runWith?: string;
      linkUpWith?: string[];
    };
  }>;
  
  // Rotation Plans
  rotationPlans: {
    plannedRotations: {
      player: string;
      replacedBy: string;
      timing: string; // e.g. "Q2 5:00"
      reason: string;
    }[];
    
    positionSwaps: {
      player1: string;
      player2: string;
      timing: string;
    }[];
    
    conditionalRotations: {
      condition: string; // e.g. "if trailing by 3 goals"
      changes: {
        player: string;
        replacedBy: string;
      }[];
    }[];
  };
}