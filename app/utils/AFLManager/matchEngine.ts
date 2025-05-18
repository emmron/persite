// Match Engine for AFL Manager
// Simulates AFL matches based on team and player attributes

import { Team } from "~/data/AFLManager/teams";
import { Player, Position } from "~/data/AFLManager/players";
import { Match, MatchEvent, MatchScore, MatchStats } from "~/data/AFLManager/gameState";

// Field dimensions for match simulation
export const FIELD_WIDTH = 700;
export const FIELD_HEIGHT = 500;
export const GOAL_WIDTH = 30;
export const BEHIND_WIDTH = 20;
export const CENTER_CIRCLE_RADIUS = 30;
export const FIFTY_METER_ARC_RADIUS = 120;

// Player constants
export const PLAYER_RADIUS = 8;
export const BALL_RADIUS = 5;
export const MAX_PLAYER_SPEED = 3.5;
export const BALL_SPEED = 7;
export const PLAYER_ACCELERATION = 0.2;
export const PLAYER_FATIGUE_RATE = 0.005;

// Game constants for match simulation
const MATCH_LENGTH_SECONDS = 120 * 60; // 120 minutes in seconds
const QUARTER_LENGTH_SECONDS = MATCH_LENGTH_SECONDS / 4;
const AVERAGE_SCORING_EVENTS_PER_MATCH = 30; // Combined goals and behinds
const AVERAGE_DISPOSALS_PER_MATCH = 400; // Total disposals per team
const AVERAGE_MARKS_PER_MATCH = 100; // Total marks per team
const AVERAGE_TACKLES_PER_MATCH = 70; // Total tackles per team
const AVERAGE_INSIDE_50S_PER_MATCH = 50; // Average inside 50s per team
const AVERAGE_CLEARANCES_PER_MATCH = 35; // Average clearances per team
const AVERAGE_CONTESTED_POSSESSIONS = 140; // Average contested possessions per team
const AVERAGE_UNCONTESTED_POSSESSIONS = 260; // Average uncontested possessions per team

// Player positions on field (percentages)
export const TEAM_FORMATIONS = {
  attack: [
    { x: 0.5, y: 0.15 }, // Full Forward
    { x: 0.35, y: 0.2 }, // Forward Pocket
    { x: 0.65, y: 0.2 }, // Forward Pocket
    { x: 0.5, y: 0.3 }, // Centre Half Forward
    { x: 0.3, y: 0.3 }, // Half Forward Flank
    { x: 0.7, y: 0.3 }, // Half Forward Flank
    { x: 0.5, y: 0.5 }, // Centre
    { x: 0.3, y: 0.5 }, // Wing
    { x: 0.7, y: 0.5 }, // Wing
    { x: 0.5, y: 0.7 }, // Centre Half Back
    { x: 0.3, y: 0.7 }, // Half Back Flank
    { x: 0.7, y: 0.7 }, // Half Back Flank
    { x: 0.5, y: 0.85 }, // Full Back
    { x: 0.35, y: 0.8 }, // Back Pocket
    { x: 0.65, y: 0.8 }, // Back Pocket
    { x: 0.5, y: 0.4 }, // Ruck
    { x: 0.4, y: 0.45 }, // Ruck Rover
    { x: 0.6, y: 0.45 }  // Rover
  ],
  defense: [
    { x: 0.5, y: 0.85 }, // Full Forward (playing defense)
    { x: 0.35, y: 0.8 }, // Forward Pocket (playing defense)
    { x: 0.65, y: 0.8 }, // Forward Pocket (playing defense)
    { x: 0.5, y: 0.7 }, // Centre Half Forward (playing defense)
    { x: 0.3, y: 0.7 }, // Half Forward Flank (playing defense)
    { x: 0.7, y: 0.7 }, // Half Forward Flank (playing defense)
    { x: 0.5, y: 0.5 }, // Centre
    { x: 0.3, y: 0.5 }, // Wing
    { x: 0.7, y: 0.5 }, // Wing
    { x: 0.5, y: 0.3 }, // Centre Half Back (playing defense)
    { x: 0.3, y: 0.3 }, // Half Back Flank (playing defense)
    { x: 0.7, y: 0.3 }, // Half Back Flank (playing defense)
    { x: 0.5, y: 0.15 }, // Full Back (playing defense)
    { x: 0.35, y: 0.2 }, // Back Pocket (playing defense)
    { x: 0.65, y: 0.2 }, // Back Pocket (playing defense)
    { x: 0.5, y: 0.6 }, // Ruck
    { x: 0.4, y: 0.55 }, // Ruck Rover
    { x: 0.6, y: 0.55 }  // Rover
  ]
};

// Interface for team lineup
export interface TeamLineup {
  teamId: string;
  players: Player[];
  tactics: {
    style: "defensive" | "balanced" | "attacking";
    pressure: number; // 1-10
    possession: number; // 1-10
    riskTaking: number; // 1-10
    
    // Ball Movement Style
    ballMovement: "fast-play-on" | "corridor-focused" | "boundary-line" | "chip-and-possess" |
                  "long-kicking" | "handball-chains" | "kick-mark" | "switch-play";
    
    // Defensive Structure
    defensiveStructure: "zone-defense" | "man-on-man" | "accountable-zone" | "flooding" |
                        "high-press" | "medium-press" | "defensive-press" | "loose-man-in-defense";
    
    // Attacking Structure
    attackingStructure: "forward-press" | "structure-hold" | "leading-patterns" | "forward-motion" |
                        "loose-man-in-attack" | "forward-target-focus" | "small-forward-crumbing" | "spread-from-contest";
    
    // Contest Approach
    contestApproach: "outnumber-at-contest" | "hit-and-run" | "physical-intimidation" | "technical-precision" |
                     "clean-hands-focus" | "quick-clearance" | "stoppage-structure" | "ruck-setup-variations";
                    
    // Center Bounce Setup
    centerBounceSetup: "5-7-5" | "6-6-6" | "5-8-4" | "4-8-5" | "5-6-6";
    
    // Quarter-by-Quarter Adjustments
    quarterAdjustments: {
      firstQuarter: "fast-start" | "set-tone-physically" | "assess-opposition" | "control-possession";
      thirdQuarter: "apply-pressure" | "run-opposition-off-feet" | "defensive-lockdown" | "risk-taking";
      finalQuarter: "protect-lead" | "chase-game" | "ice-the-clock" | "all-out-attack";
    };
    
    // Player Rotation System
    rotationSystem: {
      type: "time-based" | "exertion-based" | "situational" | "position-based" | "individual";
      forwardFrequency: number; // minutes (3-8)
      midfieldFrequency: number; // minutes (4-10)
      defenseFrequency: number; // minutes (8-15)
      ruckStrategy: "quarters" | "halves" | "situational";
    };
  };
  
  // Player roles (keyed by player ID)
  playerRoles: Record<string, {
    role: string;
    instructions: string[];
    matchupPlayerIds?: string[]; // For tagging assignments
  }>;
}

// Interface for match simulation result
export interface MatchSimulationResult {
  homeScore: MatchScore;
  awayScore: MatchScore;
  events: MatchEvent[];
  stats: MatchStats;
  homePlayerStats: Record<string, PlayerMatchStats>;
  awayPlayerStats: Record<string, PlayerMatchStats>;
  matchSummary: MatchSummary;
}

// Interface for player match stats
export interface PlayerMatchStats {
  playerId: string;
  disposals: number;
  kicks: number;
  handballs: number;
  marks: number;
  contestedMarks: number;
  tackles: number;
  hitouts: number;
  clearances: number;
  inside50s: number;
  rebound50s: number;
  contestedPossessions: number;
  uncontestPossessions: number;
  goals: number;
  behinds: number;
  meterGained: number;
  freeKicksFor: number;
  freeKicksAgainst: number;
  matchRating: number; // 0-10 scale
}

// Interface for match summary stats
export interface MatchSummary {
  home: TeamMatchSummary;
  away: TeamMatchSummary;
  quarterByQuarter: {
    home: number[];
    away: number[];
  };
  finalScores: {
    home: MatchScore;
    away: MatchScore;
  };
  bestPlayers: {
    home: string[];
    away: string[];
  };
  topScorers: {
    home: string[];
    away: string[];
  };
}

// Interface for team match summary
export interface TeamMatchSummary {
  disposals: number;
  kicks: number;
  handballs: number;
  marks: number;
  contestedMarks: number;
  tackles: number;
  hitouts: number;
  clearances: number;
  inside50s: number;
  goalEfficiency: number; // %
  contestedPossessions: number;
  uncontestPossessions: number;
  freeKicksFor: number;
  freeKicksAgainst: number;
}

// Calculate team strength based on lineup and tactics
function calculateTeamStrength(
  team: Team, 
  lineup: TeamLineup, 
  opposingTeam: Team
): { attack: number; midfield: number; defense: number; overall: number } {
  // Base strength from team attributes
  let attack = team.attributes.attack;
  let midfield = team.attributes.midfield;
  let defense = team.attributes.defense;
  
  // Adjust based on player lineup
  const forwards = lineup.players.filter(p => p.position === "Forward");
  const midfielders = lineup.players.filter(p => p.position === "Midfielder");
  const defenders = lineup.players.filter(p => p.position === "Defender");
  const rucks = lineup.players.filter(p => p.position === "Ruck");
  
  // Calculate average player ratings by position
  const forwardRating = forwards.length > 0 
    ? forwards.reduce((sum, p) => sum + (p.attributes.kicking + p.attributes.marking + (p.attributes.goalkicking || 75)) / 3, 0) / forwards.length 
    : 70;
    
  const midfieldRating = midfielders.length > 0 
    ? midfielders.reduce((sum, p) => sum + (p.attributes.speed + p.attributes.stamina + p.attributes.handball) / 3, 0) / midfielders.length 
    : 70;
    
  const defenseRating = defenders.length > 0 
    ? defenders.reduce((sum, p) => sum + (p.attributes.marking + p.attributes.tackling + (p.attributes.intercept || 75)) / 3, 0) / defenders.length 
    : 70;
    
  const ruckRating = rucks.length > 0 
    ? rucks.reduce((sum, p) => sum + (p.attributes.marking + p.attributes.strength + (p.attributes.tapwork || 75)) / 3, 0) / rucks.length 
    : 70;
  
  // Adjust team ratings based on player quality (70% team rating, 30% player rating)
  attack = attack * 0.7 + forwardRating * 0.3;
  midfield = midfield * 0.6 + midfieldRating * 0.3 + ruckRating * 0.1;
  defense = defense * 0.7 + defenseRating * 0.3;
  
  // Adjust based on tactics
  if (lineup.tactics.style === "attacking") {
    attack += 5;
    defense -= 3;
  } else if (lineup.tactics.style === "defensive") {
    defense += 5;
    attack -= 3;
  }
  
  // Pressure affects midfield and defense
  midfield += (lineup.tactics.pressure - 5) * 0.5;
  defense += (lineup.tactics.pressure - 5) * 0.5;
  
  // Possession affects midfield control
  midfield += (lineup.tactics.possession - 5) * 0.5;
  
  // Risk taking affects attack and defense
  attack += (lineup.tactics.riskTaking - 5) * 0.7;
  defense -= (lineup.tactics.riskTaking - 5) * 0.5;
  
  // Calculate overall rating
  const overall = (attack + midfield + defense) / 3;
  
  return { attack, midfield, defense, overall };
}

// Generate a random event time within a quarter
function generateEventTime(quarter: number): number {
  const quarterStartTime = (quarter - 1) * QUARTER_LENGTH_SECONDS;
  return quarterStartTime + Math.floor(Math.random() * QUARTER_LENGTH_SECONDS);
}

// Select a random player from a specific position group
function selectRandomPlayer(lineup: TeamLineup, position?: Position): Player {
  let eligiblePlayers = lineup.players;
  
  if (position) {
    eligiblePlayers = lineup.players.filter(p => p.position === position);
    // Fallback if no players of that position
    if (eligiblePlayers.length === 0) {
      eligiblePlayers = lineup.players;
    }
  }
  
  const randomIndex = Math.floor(Math.random() * eligiblePlayers.length);
  return eligiblePlayers[randomIndex];
}

// Helper function to generate detailed goal events with build-up
function generateGoalEvent(
  quarter: number,
  timestamp: number,
  scoringTeamId: string,
  scoringTeam: Team,
  scoringLineup: TeamLineup,
  defendingTeam: Team,
  baseMessage: string
): MatchEvent[] {
  const events: MatchEvent[] = [];
  const goalTimestamp = timestamp;
  
  // Generate build-up sequence (happens before the goal)
  const sequenceStart = goalTimestamp - Math.floor(Math.random() * 20) - 10; // 10-30 seconds before goal
  
  // 1. Initial possession
  const initiatingPlayer = selectRandomPlayer(scoringLineup, "Midfielder");
  events.push({
    type: "possession",
    teamId: scoringTeamId,
    playerId: initiatingPlayer.id,
    quarter,
    message: `${initiatingPlayer.name} gathers in the center for ${scoringTeam.name}`,
    timestamp: sequenceStart
  });
  
  // 2. Middle sequence - varies based on ball movement style
  const ballMovementStyle = scoringLineup.tactics.ballMovement;
  let middlePlayer;
  let middleMessage = "";
  const middleTimestamp = sequenceStart + 5 + Math.floor(Math.random() * 5);
  
  switch(ballMovementStyle) {
    case "fast-play-on":
      middlePlayer = selectRandomPlayer(scoringLineup, "Midfielder");
      middleMessage = `${middlePlayer.name} plays on quickly and breaks through the middle`;
      break;
    case "corridor-focused":
      middlePlayer = selectRandomPlayer(scoringLineup, "Midfielder");
      middleMessage = `${middlePlayer.name} drives forward through the corridor`;
      break;
    case "boundary-line":
      middlePlayer = selectRandomPlayer(scoringLineup, "Midfielder");
      middleMessage = `${middlePlayer.name} carries along the boundary line`;
      break;
    case "chip-and-possess":
      middlePlayer = selectRandomPlayer(scoringLineup, "Midfielder");
      middleMessage = `${middlePlayer.name} chips to a teammate to maintain possession`;
      break;
    case "long-kicking":
      middlePlayer = selectRandomPlayer(scoringLineup, "Midfielder");
      middleMessage = `${middlePlayer.name} launches a long kick inside 50`;
      break;
    case "handball-chains":
      middlePlayer = selectRandomPlayer(scoringLineup, "Midfielder");
      middleMessage = `${middlePlayer.name} links in a chain of handballs`;
      break;
    case "kick-mark":
      middlePlayer = selectRandomPlayer(scoringLineup, "Midfielder");
      middleMessage = `${middlePlayer.name} takes a strong mark in the center`;
      break;
    case "switch-play":
      middlePlayer = selectRandomPlayer(scoringLineup, "Midfielder");
      middleMessage = `${middlePlayer.name} switches play to the opposite flank`;
      break;
    default:
      middlePlayer = selectRandomPlayer(scoringLineup, "Midfielder");
      middleMessage = `${middlePlayer.name} moves the ball forward`;
  }
  
  events.push({
    type: "buildup",
    teamId: scoringTeamId,
    playerId: middlePlayer.id,
    quarter,
    message: middleMessage,
    timestamp: middleTimestamp
  });
  
  // 3. Inside 50 entry
  const inside50Player = selectRandomPlayer(scoringLineup, "Forward");
  const inside50Timestamp = middleTimestamp + 5 + Math.floor(Math.random() * 5);
  
  events.push({
    type: "inside50",
    teamId: scoringTeamId,
    playerId: inside50Player.id,
    quarter,
    message: `${inside50Player.name} receives inside 50 and looks for options`,
    timestamp: inside50Timestamp
  });
  
  // 4. The goal itself
  events.push({
    type: "goal",
    teamId: scoringTeamId,
    playerId: inside50Player.id,
    quarter,
    message: baseMessage,
    timestamp: goalTimestamp
  });
  
  // 5. Occasional post-goal celebration
  if (Math.random() > 0.7) {
    events.push({
      type: "celebration",
      teamId: scoringTeamId,
      playerId: inside50Player.id,
      quarter,
      message: `${inside50Player.name} celebrates with teammates after a brilliant finish`,
      timestamp: goalTimestamp + 2
    });
  }
  
  return events;
}

// Generate match events based on team strengths and tactics
function generateMatchEvents(
  homeTeam: Team,
  awayTeam: Team,
  homeLineup: TeamLineup,
  awayLineup: TeamLineup,
  homeStrength: { attack: number; midfield: number; defense: number; overall: number },
  awayStrength: { attack: number; midfield: number; defense: number; overall: number }
): { events: MatchEvent[]; homeScore: MatchScore; awayScore: MatchScore; quarterScores: { home: number[]; away: number[] } } {
  const events: MatchEvent[] = [];
  const quarterScores = { home: [0, 0, 0, 0], away: [0, 0, 0, 0] };
  
  // Add pre-match events
  events.push({
    type: "prematch",
    message: `Teams are warming up at ${homeTeam.venue}. Conditions are perfect for football.`,
    timestamp: -300 // 5 minutes before start
  });
  
  events.push({
    type: "prematch",
    message: `Captains meet for the coin toss as both teams prepare for the first bounce.`,
    timestamp: -60 // 1 minute before start
  });
  
  // Add quarter start events
  for (let quarter = 1; quarter <= 4; quarter++) {
    const quarterStartTime = (quarter - 1) * QUARTER_LENGTH_SECONDS;
    
    events.push({
      type: "quarter",
      quarter,
      message: `Start of Q${quarter}`,
      timestamp: quarterStartTime
    });
    
    // Add tactical notes at start of quarters based on team tactics
    if (quarter === 1) {
      const homeFirstQ = homeLineup.tactics.quarterAdjustments.firstQuarter;
      events.push({
        type: "tactical",
        teamId: homeTeam.id,
        quarter,
        message: `${homeTeam.name} looking to ${homeFirstQ === "fast-start" ? "get off to a fast start" :
                   homeFirstQ === "set-tone-physically" ? "set the physical tone early" :
                   homeFirstQ === "assess-opposition" ? "assess the opposition structure" :
                   "control possession in the early stages"}`,
        timestamp: quarterStartTime + 10
      });
      
      const awayFirstQ = awayLineup.tactics.quarterAdjustments.firstQuarter;
      events.push({
        type: "tactical",
        teamId: awayTeam.id,
        quarter,
        message: `${awayTeam.name} focusing on ${awayFirstQ === "fast-start" ? "starting quickly" :
                   awayFirstQ === "set-tone-physically" ? "physical intimidation" :
                   awayFirstQ === "assess-opposition" ? "reading the opposition" :
                   "maintaining possession"}`,
        timestamp: quarterStartTime + 20
      });
    } else if (quarter === 3) {
      // Third quarter tactical notes
      const homeThirdQ = homeLineup.tactics.quarterAdjustments.thirdQuarter;
      events.push({
        type: "tactical",
        teamId: homeTeam.id,
        quarter,
        message: `${homeTeam.name} ${homeThirdQ === "apply-pressure" ? "increasing their pressure in the premiership quarter" :
                   homeThirdQ === "run-opposition-off-feet" ? "looking to run the opposition off their feet" :
                   homeThirdQ === "defensive-lockdown" ? "focusing on defensive lockdown" :
                   "taking more risks to create scoring opportunities"}`,
        timestamp: quarterStartTime + 15
      });
    } else if (quarter === 4) {
      // Fourth quarter tactical notes
      const homeFinalQ = homeLineup.tactics.quarterAdjustments.finalQuarter;
      const awayFinalQ = awayLineup.tactics.quarterAdjustments.finalQuarter;
      
      // Only show relevant tactics based on score
      const scoreDifference =
        (quarterScores.home[0] + quarterScores.home[1] + quarterScores.home[2]) -
        (quarterScores.away[0] + quarterScores.away[1] + quarterScores.away[2]);
      
      if (scoreDifference > 12) { // Home team leading by more than 2 goals
        if (homeFinalQ === "protect-lead" || homeFinalQ === "ice-the-clock") {
          events.push({
            type: "tactical",
            teamId: homeTeam.id,
            quarter,
            message: `${homeTeam.name} looking to ${homeFinalQ === "protect-lead" ? "protect their lead" : "use the clock to their advantage"}`,
            timestamp: quarterStartTime + 10
          });
        }
        
        if (awayFinalQ === "chase-game" || awayFinalQ === "all-out-attack") {
          events.push({
            type: "tactical",
            teamId: awayTeam.id,
            quarter,
            message: `${awayTeam.name} ${awayFinalQ === "chase-game" ? "throwing everything at chasing the game" : "going with all-out attack to close the gap"}`,
            timestamp: quarterStartTime + 20
          });
        }
      } else if (scoreDifference < -12) { // Away team leading by more than 2 goals
        if (homeFinalQ === "chase-game" || homeFinalQ === "all-out-attack") {
          events.push({
            type: "tactical",
            teamId: homeTeam.id,
            quarter,
            message: `${homeTeam.name} ${homeFinalQ === "chase-game" ? "desperately trying to chase down the lead" : "committing to all-out attack"}`,
            timestamp: quarterStartTime + 10
          });
        }
        
        if (awayFinalQ === "protect-lead" || awayFinalQ === "ice-the-clock") {
          events.push({
            type: "tactical",
            teamId: awayTeam.id,
            quarter,
            message: `${awayTeam.name} focusing on ${awayFinalQ === "protect-lead" ? "protecting their advantage" : "icing the game by controlling the clock"}`,
            timestamp: quarterStartTime + 20
          });
        }
      } else { // Close game
        events.push({
          type: "tactical",
          quarter,
          message: `Tension building in a tight final quarter as both teams aim for victory`,
          timestamp: quarterStartTime + 15
        });
      }
    }
    
    // Add quarter end events
    if (quarter < 4) {
      const quarterEndTime = quarter * QUARTER_LENGTH_SECONDS - 1;
      events.push({
        type: "quarter_end",
        quarter,
        message: `End of Q${quarter}`,
        timestamp: quarterEndTime
      });
      
      // Add coach messages at quarter breaks
      const homeCoachMessage = `${homeTeam.coach || "Coach"} gathers the ${homeTeam.name} players for quarter time instructions`;
      const awayCoachMessage = `${awayTeam.coach || "Coach"} delivers feedback to the ${awayTeam.name} players`;
      
      events.push({
        type: "coach",
        teamId: homeTeam.id,
        quarter,
        message: homeCoachMessage,
        timestamp: quarterEndTime + 10
      });
      
      events.push({
        type: "coach",
        teamId: awayTeam.id,
        quarter,
        message: awayCoachMessage,
        timestamp: quarterEndTime + 20
      });
    }
  }
  
  // Calculate scoring probabilities based on team strengths and tactics
  let homeScoringChance = (homeStrength.attack * 0.7 + homeStrength.midfield * 0.3) / 100;
  let awayScoringChance = (awayStrength.attack * 0.7 + awayStrength.midfield * 0.3) / 100;
  
  // Adjust based on tactics
  if (homeLineup.tactics.style === "attacking") {
    homeScoringChance *= 1.2;
  } else if (homeLineup.tactics.style === "defensive") {
    homeScoringChance *= 0.8;
    awayScoringChance *= 0.9; // Opponent finds it harder to score
  }
  
  if (awayLineup.tactics.style === "attacking") {
    awayScoringChance *= 1.2;
  } else if (awayLineup.tactics.style === "defensive") {
    awayScoringChance *= 0.8;
    homeScoringChance *= 0.9; // Opponent finds it harder to score
  }
  
  // Adjust based on ball movement style
  if (homeLineup.tactics.ballMovement === "fast-play-on" || homeLineup.tactics.ballMovement === "long-kicking") {
    homeScoringChance *= 1.1; // More direct styles create more scoring chances
  }
  
  if (awayLineup.tactics.ballMovement === "fast-play-on" || awayLineup.tactics.ballMovement === "long-kicking") {
    awayScoringChance *= 1.1;
  }
  
  // Normalize to ensure reasonable number of scoring events
  const totalScoringChance = homeScoringChance + awayScoringChance;
  const normalizedHomeScoringChance = homeScoringChance / totalScoringChance;
  
  // Determine number of scoring events per quarter (more realistic distribution)
  const totalScoringEvents = Math.floor(AVERAGE_SCORING_EVENTS_PER_MATCH *
    (0.8 + Math.random() * 0.4)); // 80-120% of average
  
  // Distribute events across quarters with increasing intensity
  const quarterDistribution = [0.2, 0.25, 0.25, 0.3]; // Last quarter has more scoring
  
  // Generate non-scoring events
  const totalNonScoringEvents = 120; // Approximately one every 60 seconds on average
  const nonScoringEventTypes = [
    "mark", "tackle", "clearance", "intercept", "inside50", "rebound50", "injury", "substitution"
  ];
  
  for (let quarter = 1; quarter <= 4; quarter++) {
    const quarterStartTime = (quarter - 1) * QUARTER_LENGTH_SECONDS;
    const quarterEndTime = quarter * QUARTER_LENGTH_SECONDS;
    
    // Add non-scoring events
    const quarterNonScoringEvents = Math.floor(totalNonScoringEvents * quarterDistribution[quarter - 1]);
    for (let i = 0; i < quarterNonScoringEvents; i++) {
      const timestamp = quarterStartTime + Math.floor(Math.random() * QUARTER_LENGTH_SECONDS);
      const isHomeTeamEvent = Math.random() < normalizedHomeScoringChance;
      const team = isHomeTeamEvent ? homeTeam : awayTeam;
      const lineup = isHomeTeamEvent ? homeLineup : awayLineup;
      
      const eventType = nonScoringEventTypes[Math.floor(Math.random() * nonScoringEventTypes.length)];
      
      // Select appropriate player for event type
      let player;
      let message = "";
      
      switch (eventType) {
        case "mark":
          player = selectRandomPlayer(lineup, Math.random() < 0.6 ? "Forward" : undefined);
          message = `${player.name} takes a strong mark for ${team.name}`;
          break;
        case "tackle":
          player = selectRandomPlayer(lineup, Math.random() < 0.7 ? "Midfielder" : undefined);
          message = `${player.name} lays a fierce tackle in the midfield`;
          break;
        case "clearance":
          player = selectRandomPlayer(lineup, "Midfielder");
          message = `${player.name} wins the clearance for ${team.name}`;
          break;
        case "intercept":
          player = selectRandomPlayer(lineup, "Defender");
          message = `${player.name} reads the play perfectly to intercept`;
          break;
        case "inside50":
          player = selectRandomPlayer(lineup, Math.random() < 0.6 ? "Midfielder" : undefined);
          message = `${player.name} drives ${team.name} inside 50`;
          break;
        case "rebound50":
          player = selectRandomPlayer(lineup, "Defender");
          message = `${player.name} rebounds out of defensive 50`;
          break;
        case "injury":
          // Rare event
          if (Math.random() < 0.1) {
            player = selectRandomPlayer(lineup);
            message = `${player.name} appears to have picked up a knock`;
            break;
          }
          continue;
        case "substitution":
          // Occasional substitution
          if (Math.random() < 0.3) {
            player = selectRandomPlayer(lineup);
            message = `${player.name} rotates to the bench for a rest`;
            break;
          }
          continue;
        default:
          player = selectRandomPlayer(lineup);
          message = `${player.name} wins the ball for ${team.name}`;
      }
      
      events.push({
        type: eventType,
        teamId: team.id,
        playerId: player.id,
        quarter,
        message,
        timestamp
      });
    }
  }
  
  // Generate all four quarters of scoring events
  let homeGoals = 0;
  let homeBehinds = 0;
  let awayGoals = 0;
  let awayBehinds = 0;
  
  for (let quarter = 1; quarter <= 4; quarter++) {
    // Calculate events for this quarter
    const quarterEvents = Math.round(totalScoringEvents * quarterDistribution[quarter-1]);
    const homeEvents = Math.round(quarterEvents * normalizedHomeScoringChance);
    const awayEvents = quarterEvents - homeEvents;
    
    // Home team scoring in this quarter
    const homeGoalChance = 0.6 + (homeStrength.attack - 75) * 0.003; // Base 60% + adjustment
    
    for (let i = 0; i < homeEvents; i++) {
      const timestamp = generateEventTime(quarter);
      const isGoal = Math.random() < homeGoalChance;
      const player = selectRandomPlayer(homeLineup, isGoal ? "Forward" : undefined);
      
      if (isGoal) {
        homeGoals++;
        quarterScores.home[quarter-1] += 6;
        
        // Generate detailed goal sequence with build-up
        const goalMessage = `GOAL! ${player.name} kicks a goal for ${homeTeam.name}`;
        const goalSequence = generateGoalEvent(
          quarter,
          timestamp,
          homeTeam.id,
          homeTeam,
          homeLineup,
          awayTeam,
          goalMessage
        );
        
        // Add all goal sequence events
        events.push(...goalSequence);
      } else {
        homeBehinds++;
        quarterScores.home[quarter-1] += 1;
        
        // Different types of behinds
        let behindMessage = "";
        const behindType = Math.random();
        
        if (behindType < 0.4) {
          behindMessage = `Behind. ${player.name}'s shot is slightly offline for ${homeTeam.name}`;
        } else if (behindType < 0.7) {
          behindMessage = `Behind. ${player.name}'s kick is rushed through by the ${awayTeam.name} defense`;
        } else if (behindType < 0.9) {
          behindMessage = `Behind. ${player.name} hits the post for ${homeTeam.name}`;
        } else {
          behindMessage = `Behind. ${player.name}'s shot is touched on the line`;
        }
        
        events.push({
          type: "behind",
          teamId: homeTeam.id,
          playerId: player.id,
          quarter,
          message: behindMessage,
          timestamp
        });
      }
    }
    
    // Away team scoring in this quarter
    const awayGoalChance = 0.6 + (awayStrength.attack - 75) * 0.003;
    
    for (let i = 0; i < awayEvents; i++) {
      const timestamp = generateEventTime(quarter);
      const isGoal = Math.random() < awayGoalChance;
      const player = selectRandomPlayer(awayLineup, isGoal ? "Forward" : undefined);
      
      if (isGoal) {
        awayGoals++;
        quarterScores.away[quarter-1] += 6;
        
        // Generate detailed goal sequence with build-up
        const goalMessage = `GOAL! ${player.name} kicks a goal for ${awayTeam.name}`;
        const goalSequence = generateGoalEvent(
          quarter,
          timestamp,
          awayTeam.id,
          awayTeam,
          awayLineup,
          homeTeam,
          goalMessage
        );
        
        // Add all goal sequence events
        events.push(...goalSequence);
      } else {
        awayBehinds++;
        quarterScores.away[quarter-1] += 1;
        
        // Different types of behinds
        let behindMessage = "";
        const behindType = Math.random();
        
        if (behindType < 0.4) {
          behindMessage = `Behind. ${player.name}'s shot is slightly offline for ${awayTeam.name}`;
        } else if (behindType < 0.7) {
          behindMessage = `Behind. ${player.name}'s kick is rushed through by the ${homeTeam.name} defense`;
        } else if (behindType < 0.9) {
          behindMessage = `Behind. ${player.name} hits the post for ${awayTeam.name}`;
        } else {
          behindMessage = `Behind. ${player.name}'s shot is touched on the line`;
        }
        
        events.push({
          type: "behind",
          teamId: awayTeam.id,
          playerId: player.id,
          quarter,
          message: behindMessage,
          timestamp
        });
      }
    }
    
    // Add momentum shift events
    if (quarterScores.home[quarter-1] > 18 && quarterScores.home[quarter-1] > 2 * quarterScores.away[quarter-1]) {
      // Home team has a big lead in this quarter
      events.push({
        type: "momentum",
        teamId: homeTeam.id,
        quarter,
        message: `${homeTeam.name} with all the momentum in Q${quarter}`,
        timestamp: (quarter - 1) * QUARTER_LENGTH_SECONDS + QUARTER_LENGTH_SECONDS * 0.7 // Later in quarter
      });
    } else if (quarterScores.away[quarter-1] > 18 && quarterScores.away[quarter-1] > 2 * quarterScores.home[quarter-1]) {
      // Away team has a big lead in this quarter
      events.push({
        type: "momentum",
        teamId: awayTeam.id,
        quarter,
        message: `${awayTeam.name} dominating the flow of play in Q${quarter}`,
        timestamp: (quarter - 1) * QUARTER_LENGTH_SECONDS + QUARTER_LENGTH_SECONDS * 0.7
      });
    }
  }
  
  // Add final quarter drama events if the game is close
  const finalScore = {
    home: quarterScores.home.reduce((sum, score) => sum + score, 0),
    away: quarterScores.away.reduce((sum, score) => sum + score, 0)
  };
  
  const scoreDifference = Math.abs(finalScore.home - finalScore.away);
  
  if (scoreDifference <= 12) { // Within 2 goals
    const finalMinutes = MATCH_LENGTH_SECONDS - 180; // Last 3 minutes
    
    // Add tension narrative
    events.push({
      type: "commentary",
      message: "Tension building as we enter the final minutes with scores incredibly close",
      timestamp: finalMinutes
    });
    
    // Add final dramatic moment
    events.push({
      type: "commentary",
      message: "The crowd is on its feet as we approach the final siren in this nail-biter!",
      timestamp: MATCH_LENGTH_SECONDS - 30
    });
  }
  
  // Add final siren event
  events.push({
    type: "final",
    message: "FINAL SIREN! The match is over.",
    timestamp: MATCH_LENGTH_SECONDS
  });
  
  // Add post-match reaction based on result
  if (finalScore.home > finalScore.away) {
    events.push({
      type: "postmatch",
      teamId: homeTeam.id,
      message: `${homeTeam.name} players celebrate a well-earned victory`,
      timestamp: MATCH_LENGTH_SECONDS + 10
    });
    
    events.push({
      type: "postmatch",
      teamId: awayTeam.id,
      message: `Disappointment for ${awayTeam.name} as they reflect on where the match was lost`,
      timestamp: MATCH_LENGTH_SECONDS + 20
    });
  } else if (finalScore.away > finalScore.home) {
    events.push({
      type: "postmatch",
      teamId: awayTeam.id,
      message: `${awayTeam.name} players celebrate a terrific away win`,
      timestamp: MATCH_LENGTH_SECONDS + 10
    });
    
    events.push({
      type: "postmatch",
      teamId: homeTeam.id,
      message: `${homeTeam.name} will be disappointed to lose on home soil`,
      timestamp: MATCH_LENGTH_SECONDS + 20
    });
  } else {
    // Draw
    events.push({
      type: "postmatch",
      message: `Players from both teams share handshakes after a drawn match`,
      timestamp: MATCH_LENGTH_SECONDS + 15
    });
  }
  
  // Sort events by timestamp
  events.sort((a, b) => a.timestamp - b.timestamp);
  
  // Calculate final scores
  const homeScore: MatchScore = {
    goals: homeGoals,
    behinds: homeBehinds,
    total: homeGoals * 6 + homeBehinds
  };
  
  const awayScore: MatchScore = {
    goals: awayGoals,
    behinds: awayBehinds,
    total: awayGoals * 6 + awayBehinds
  };
  
  return { events, homeScore, awayScore, quarterScores };
}

// Distribute kicks and handballs among players
function distributeDisposals(
  lineup: TeamLineup,
  playerStats: Record<string, PlayerMatchStats>,
  kicks: number,
  handballs: number
) {
  // Calculate weights for each player based on position and attributes
  const kickWeights: Record<string, number> = {};
  const handballWeights: Record<string, number> = {};
  let totalKickWeight = 0;
  let totalHandballWeight = 0;
  
  lineup.players.forEach(player => {
    const playerStat = playerStats[player.id];
    if (!playerStat) return;
    
    // Calculate kick weight
    let kickWeight = 1;
    if (player.position === "Midfielder") kickWeight = 1.8;
    else if (player.position === "Forward") kickWeight = 1.2;
    else if (player.position === "Defender") kickWeight = 1.5;
    else if (player.position === "Ruck") kickWeight = 0.7;
    
    // Adjust by kicking attribute
    kickWeight *= (player.attributes.kicking / 75);
    
    // Calculate handball weight
    let handballWeight = 1;
    if (player.position === "Midfielder") handballWeight = 2;
    else if (player.position === "Forward") handballWeight = 0.9;
    else if (player.position === "Defender") handballWeight = 1.1;
    else if (player.position === "Ruck") handballWeight = 0.8;
    
    // Adjust by handball attribute
    handballWeight *= (player.attributes.handball / 75);
    
    kickWeights[player.id] = kickWeight;
    handballWeights[player.id] = handballWeight;
    
    totalKickWeight += kickWeight;
    totalHandballWeight += handballWeight;
  });
  
  // Distribute kicks based on weights
  let remainingKicks = kicks;
  
  lineup.players.forEach((player, index) => {
    const playerStat = playerStats[player.id];
    if (!playerStat) return;
    
    if (index === lineup.players.length - 1) {
      // Last player gets all remaining kicks
      playerStat.kicks += remainingKicks;
    } else {
      const playerKicks = Math.round((kickWeights[player.id] / totalKickWeight) * kicks);
      playerStat.kicks += playerKicks;
      remainingKicks -= playerKicks;
    }
  });
  
  // Distribute handballs based on weights
  let remainingHandballs = handballs;
  
  lineup.players.forEach((player, index) => {
    const playerStat = playerStats[player.id];
    if (!playerStat) return;
    
    if (index === lineup.players.length - 1) {
      // Last player gets all remaining handballs
      playerStat.handballs += remainingHandballs;
    } else {
      const playerHandballs = Math.round((handballWeights[player.id] / totalHandballWeight) * handballs);
      playerStat.handballs += playerHandballs;
      remainingHandballs -= playerHandballs;
    }
    
    // Update total disposals
    playerStat.disposals = playerStat.kicks + playerStat.handballs;
  });
}

// Distribute contested vs uncontested possessions
function distributeContestedStats(
  lineup: TeamLineup,
  playerStats: Record<string, PlayerMatchStats>,
  teamStrength: { attack: number; midfield: number; defense: number; overall: number }
) {
  // Calculate total contested possessions based on team strength
  const totalContested = Math.round(AVERAGE_CONTESTED_POSSESSIONS * 
    (0.85 + (teamStrength.overall - 70) * 0.005));
  
  const totalUncontested = Math.round(AVERAGE_UNCONTESTED_POSSESSIONS * 
    (0.85 + (teamStrength.overall - 70) * 0.005));
  
  // Calculate weights for contested possessions
  const contestedWeights: Record<string, number> = {};
  let totalContestedWeight = 0;
  
  lineup.players.forEach(player => {
    const playerStat = playerStats[player.id];
    if (!playerStat) return;
    
    // Calculate contested possession weight
    let contestedWeight = 1;
    if (player.position === "Midfielder") contestedWeight = 2;
    else if (player.position === "Forward") contestedWeight = 1.1;
    else if (player.position === "Defender") contestedWeight = 1.1;
    else if (player.position === "Ruck") contestedWeight = 1.5;
    
    // Adjust by player attributes
    contestedWeight *= (player.attributes.strength / 75);
    
    contestedWeights[player.id] = contestedWeight;
    totalContestedWeight += contestedWeight;
  });
  
  // Distribute contested possessions
  let remainingContested = totalContested;
  
  lineup.players.forEach((player, index) => {
    const playerStat = playerStats[player.id];
    if (!playerStat) return;
    
    if (index === lineup.players.length - 1) {
      // Last player gets all remaining contested possessions
      playerStat.contestedPossessions = remainingContested;
    } else {
      const playerContested = Math.round((contestedWeights[player.id] / totalContestedWeight) * totalContested);
      playerStat.contestedPossessions = playerContested;
      remainingContested -= playerContested;
    }
  });
  
  // Distribute uncontested possessions based on total disposals
  let totalDisposals = 0;
  lineup.players.forEach(player => {
    const playerStat = playerStats[player.id];
    if (playerStat) totalDisposals += playerStat.disposals;
  });
  
  lineup.players.forEach(player => {
    const playerStat = playerStats[player.id];
    if (!playerStat) return;
    
    // Distribute uncontested possessions proportionally to disposals
    const disposalRatio = playerStat.disposals / totalDisposals;
    playerStat.uncontestPossessions = Math.round(totalUncontested * disposalRatio);
    
    // Adjust if contested + uncontested don't match total disposals
    const totalPossessions = playerStat.contestedPossessions + playerStat.uncontestPossessions;
    if (totalPossessions !== playerStat.disposals) {
      // Adjust uncontested to make the total match
      playerStat.uncontestPossessions = Math.max(0, playerStat.disposals - playerStat.contestedPossessions);
    }
  });
}

// Distribute marks among players
function distributeMarks(
  lineup: TeamLineup,
  playerStats: Record<string, PlayerMatchStats>,
  totalMarks: number
) {
  // Calculate weights for marks
  const markWeights: Record<string, number> = {};
  let totalMarkWeight = 0;
  
  lineup.players.forEach(player => {
    const playerStat = playerStats[player.id];
    if (!playerStat) return;
    
    // Calculate mark weight
    let markWeight = 1;
    if (player.position === "Forward") markWeight = 1.6;
    else if (player.position === "Defender") markWeight = 1.4;
    else if (player.position === "Ruck") markWeight = 1.5;
    else if (player.position === "Midfielder") markWeight = 0.8;
    
    // Adjust by marking attribute
    markWeight *= (player.attributes.marking / 75);
    
    markWeights[player.id] = markWeight;
    totalMarkWeight += markWeight;
  });
  
  // Distribute marks
  let remainingMarks = totalMarks;
  let contestedMarksTotal = Math.round(totalMarks * 0.3); // About 30% of marks are contested
  let remainingContested = contestedMarksTotal;
  
  lineup.players.forEach((player, index) => {
    const playerStat = playerStats[player.id];
    if (!playerStat) return;
    
    if (index === lineup.players.length - 1) {
      // Last player gets all remaining marks
      playerStat.marks = remainingMarks;
      playerStat.contestedMarks = remainingContested;
    } else {
      const playerMarks = Math.round((markWeights[player.id] / totalMarkWeight) * totalMarks);
      playerStat.marks = playerMarks;
      remainingMarks -= playerMarks;
      
      // Calculate contested marks
      // Key position players get more contested marks
      let contestedRatio = 0.3; // Default
      if (player.position === "Forward" || player.position === "Defender" || player.position === "Ruck") {
        contestedRatio = 0.4;
      }
      
      const playerContested = Math.round(playerMarks * contestedRatio);
      playerStat.contestedMarks = playerContested;
      remainingContested -= playerContested;
    }
  });
}

// Distribute special stats like tackles, inside50s, clearances
function distributeSpecialStats(
  lineup: TeamLineup,
  playerStats: Record<string, PlayerMatchStats>,
  statType: "tackles" | "inside50s" | "clearances" | "rebound50s",
  totalStats: number
) {
  // Calculate weights based on stat type and position
  const weights: Record<string, number> = {};
  let totalWeight = 0;
  
  lineup.players.forEach(player => {
    const playerStat = playerStats[player.id];
    if (!playerStat) return;
    
    let weight = 1;
    
    if (statType === "tackles") {
      // Adjust tackle weights by position
      if (player.position === "Midfielder") weight = 2;
      else if (player.position === "Forward") weight = 1.2;
      else if (player.position === "Defender") weight = 1.1;
      else if (player.position === "Ruck") weight = 0.7;
      
      // Adjust by tackling attribute
      weight *= (player.attributes.tackling / 75);
    } 
    else if (statType === "inside50s") {
      // Adjust inside50s weights by position
      if (player.position === "Midfielder") weight = 2;
      else if (player.position === "Forward") weight = 1.5;
      else if (player.position === "Defender") weight = 0.5;
      else if (player.position === "Ruck") weight = 0.8;
      
      // Adjust by kicking attribute
      weight *= (player.attributes.kicking / 75);
    }
    else if (statType === "clearances") {
      // Adjust clearances weights by position
      if (player.position === "Midfielder") weight = 2.5;
      else if (player.position === "Ruck") weight = 1.8;
      else if (player.position === "Forward") weight = 0.4;
      else if (player.position === "Defender") weight = 0.3;
    }
    else if (statType === "rebound50s") {
      // Adjust rebound50s weights by position
      if (player.position === "Defender") weight = 2.5;
      else if (player.position === "Midfielder") weight = 1.2;
      else if (player.position === "Forward") weight = 0.3;
      else if (player.position === "Ruck") weight = 0.5;
    }
    
    weights[player.id] = weight;
    totalWeight += weight;
  });
  
  // Distribute stats
  let remainingStats = totalStats;
  
  lineup.players.forEach((player, index) => {
    const playerStat = playerStats[player.id];
    if (!playerStat) return;
    
    if (index === lineup.players.length - 1) {
      // Last player gets all remaining stats
      if (statType === "tackles") playerStat.tackles = remainingStats;
      else if (statType === "inside50s") playerStat.inside50s = remainingStats;
      else if (statType === "clearances") playerStat.clearances = remainingStats;
      else if (statType === "rebound50s") playerStat.rebound50s = remainingStats;
    } else {
      const playerStats = Math.round((weights[player.id] / totalWeight) * totalStats);
      
      if (statType === "tackles") playerStat.tackles = playerStats;
      else if (statType === "inside50s") playerStat.inside50s = playerStats;
      else if (statType === "clearances") playerStat.clearances = playerStats;
      else if (statType === "rebound50s") playerStat.rebound50s = playerStats;
      
      remainingStats -= playerStats;
    }
  });
}

// Distribute ruck stats (hitouts)
function distributeRuckStats(
  homeLineup: TeamLineup,
  homePlayerStats: Record<string, PlayerMatchStats>,
  awayLineup: TeamLineup,
  awayPlayerStats: Record<string, PlayerMatchStats>,
  homeStrength: { attack: number; midfield: number; defense: number; overall: number },
  awayStrength: { attack: number; midfield: number; defense: number; overall: number }
) {
  // Get ruck players
  const homeRucks = homeLineup.players.filter(p => p.position === "Ruck");
  const awayRucks = awayLineup.players.filter(p => p.position === "Ruck");
  
  // If no rucks, assign hitouts to tallest players
  if (homeRucks.length === 0) {
    homeRucks.push(homeLineup.players.reduce((tallest, player) => 
      (player.attributes.strength || 70) > (tallest.attributes.strength || 70) ? player : tallest
    ));
  }
  
  if (awayRucks.length === 0) {
    awayRucks.push(awayLineup.players.reduce((tallest, player) => 
      (player.attributes.strength || 70) > (tallest.attributes.strength || 70) ? player : tallest
    ));
  }
  
  // Calculate total hitouts (30-40 per team is typical)
  const totalHitouts = 70;
  
  // Calculate main ruck strength
  const homeRuckStrength = homeRucks.reduce((total, ruck) => 
    total + (ruck.attributes.tapwork || 75) + (ruck.attributes.strength || 75), 0
  ) / (homeRucks.length * 2);
  
  const awayRuckStrength = awayRucks.reduce((total, ruck) => 
    total + (ruck.attributes.tapwork || 75) + (ruck.attributes.strength || 75), 0
  ) / (awayRucks.length * 2);
  
  // Calculate home hitout percentage
  const homeHitoutPercentage = homeRuckStrength / (homeRuckStrength + awayRuckStrength);
  
  // Distribute hitouts
  const homeHitouts = Math.round(totalHitouts * homeHitoutPercentage);
  const awayHitouts = totalHitouts - homeHitouts;
  
  // Distribute home hitouts among rucks
  let remainingHomeHitouts = homeHitouts;
  homeRucks.forEach((ruck, index) => {
    const playerStat = homePlayerStats[ruck.id];
    if (!playerStat) return;
    
    if (index === homeRucks.length - 1) {
      playerStat.hitouts = remainingHomeHitouts;
    } else {
      const ruckRating = ((ruck.attributes.tapwork || 75) + (ruck.attributes.strength || 75)) / 2;
      const hitoutShare = Math.round(homeHitouts * (ruckRating / homeRuckStrength));
      playerStat.hitouts = hitoutShare;
      remainingHomeHitouts -= hitoutShare;
    }
  });
  
  // Distribute away hitouts among rucks
  let remainingAwayHitouts = awayHitouts;
  awayRucks.forEach((ruck, index) => {
    const playerStat = awayPlayerStats[ruck.id];
    if (!playerStat) return;
    
    if (index === awayRucks.length - 1) {
      playerStat.hitouts = remainingAwayHitouts;
    } else {
      const ruckRating = ((ruck.attributes.tapwork || 75) + (ruck.attributes.strength || 75)) / 2;
      const hitoutShare = Math.round(awayHitouts * (ruckRating / awayRuckStrength));
      playerStat.hitouts = hitoutShare;
      remainingAwayHitouts -= hitoutShare;
    }
  });
}

// Calculate meters gained for players
function calculateMetersGained(
  lineup: TeamLineup,
  playerStats: Record<string, PlayerMatchStats>
) {
  lineup.players.forEach(player => {
    const playerStat = playerStats[player.id];
    if (!playerStat) return;
    
    // Meters gained is roughly proportional to kicks * 20 + handballs * 5
    // Adjusted by position and player attributes
    const baseMeters = playerStat.kicks * 20 + playerStat.handballs * 5;
    
    // Position modifier
    let positionMod = 1.0;
    if (player.position === "Midfielder") positionMod = 1.2;
    else if (player.position === "Forward") positionMod = 0.9;
    else if (player.position === "Defender") positionMod = 1.1;
    
    // Attribute modifier
    const attributeMod = (player.attributes.speed + player.attributes.kicking) / 150;
    
    playerStat.meterGained = Math.round(baseMeters * positionMod * attributeMod);
  });
}

// Create match summary from player stats
function createMatchSummary(
  homeLineup: TeamLineup,
  awayLineup: TeamLineup,
  homePlayerStats: Record<string, PlayerMatchStats>,
  awayPlayerStats: Record<string, PlayerMatchStats>,
  homeScore: MatchScore,
  awayScore: MatchScore
): MatchSummary {
  // Calculate team totals
  const homeTeamSummary: TeamMatchSummary = {
    disposals: 0,
    kicks: 0,
    handballs: 0,
    marks: 0,
    contestedMarks: 0,
    tackles: 0,
    hitouts: 0,
    clearances: 0,
    inside50s: 0,
    goalEfficiency: 0,
    contestedPossessions: 0,
    uncontestPossessions: 0,
    freeKicksFor: 0,
    freeKicksAgainst: 0
  };
  
  const awayTeamSummary: TeamMatchSummary = {
    disposals: 0,
    kicks: 0,
    handballs: 0,
    marks: 0,
    contestedMarks: 0,
    tackles: 0,
    hitouts: 0,
    clearances: 0,
    inside50s: 0,
    goalEfficiency: 0,
    contestedPossessions: 0,
    uncontestPossessions: 0,
    freeKicksFor: 0,
    freeKicksAgainst: 0
  };
  
  // Sum up team stats
  Object.values(homePlayerStats).forEach(player => {
    homeTeamSummary.disposals += player.disposals;
    homeTeamSummary.kicks += player.kicks;
    homeTeamSummary.handballs += player.handballs;
    homeTeamSummary.marks += player.marks;
    homeTeamSummary.contestedMarks += player.contestedMarks;
    homeTeamSummary.tackles += player.tackles;
    homeTeamSummary.hitouts += player.hitouts;
    homeTeamSummary.clearances += player.clearances;
    homeTeamSummary.inside50s += player.inside50s;
    homeTeamSummary.contestedPossessions += player.contestedPossessions;
    homeTeamSummary.uncontestPossessions += player.uncontestPossessions;
    homeTeamSummary.freeKicksFor += player.freeKicksFor;
    homeTeamSummary.freeKicksAgainst += player.freeKicksAgainst;
  });
  
  Object.values(awayPlayerStats).forEach(player => {
    awayTeamSummary.disposals += player.disposals;
    awayTeamSummary.kicks += player.kicks;
    awayTeamSummary.handballs += player.handballs;
    awayTeamSummary.marks += player.marks;
    awayTeamSummary.contestedMarks += player.contestedMarks;
    awayTeamSummary.tackles += player.tackles;
    awayTeamSummary.hitouts += player.hitouts;
    awayTeamSummary.clearances += player.clearances;
    awayTeamSummary.inside50s += player.inside50s;
    awayTeamSummary.contestedPossessions += player.contestedPossessions;
    awayTeamSummary.uncontestPossessions += player.uncontestPossessions;
    awayTeamSummary.freeKicksFor += player.freeKicksFor;
    awayTeamSummary.freeKicksAgainst += player.freeKicksAgainst;
  });
  
  // Calculate goal efficiency (goals per inside 50)
  homeTeamSummary.goalEfficiency = homeTeamSummary.inside50s > 0 
    ? (homeScore.goals / homeTeamSummary.inside50s) * 100 
    : 0;
    
  awayTeamSummary.goalEfficiency = awayTeamSummary.inside50s > 0 
    ? (awayScore.goals / awayTeamSummary.inside50s) * 100 
    : 0;
  
  // Find best players (top 3 by match rating)
  const homeBestPlayers = Object.keys(homePlayerStats)
    .sort((a, b) => homePlayerStats[b].matchRating - homePlayerStats[a].matchRating)
    .slice(0, 3);
    
  const awayBestPlayers = Object.keys(awayPlayerStats)
    .sort((a, b) => awayPlayerStats[b].matchRating - awayPlayerStats[a].matchRating)
    .slice(0, 3);
  
  // Find top scorers (top 3 by goals)
  const homeTopScorers = Object.keys(homePlayerStats)
    .sort((a, b) => homePlayerStats[b].goals - homePlayerStats[a].goals)
    .slice(0, 3);
    
  const awayTopScorers = Object.keys(awayPlayerStats)
    .sort((a, b) => awayPlayerStats[b].goals - awayPlayerStats[a].goals)
    .slice(0, 3);
  
  return {
    home: homeTeamSummary,
    away: awayTeamSummary,
    quarterByQuarter: {
      home: [0, 0, 0, 0], // Will be populated with actual quarter scores later
      away: [0, 0, 0, 0]
    },
    finalScores: {
      home: homeScore,
      away: awayScore
    },
    bestPlayers: {
      home: homeBestPlayers,
      away: awayBestPlayers
    },
    topScorers: {
      home: homeTopScorers,
      away: awayTopScorers
    }
  };
}

// Calculate player match ratings
function calculatePlayerRatings(
  lineup: TeamLineup,
  playerStats: Record<string, PlayerMatchStats>,
  teamStrength: { attack: number; midfield: number; defense: number; overall: number },
  oppositionStrength: { attack: number; midfield: number; defense: number; overall: number }
) {
  lineup.players.forEach(player => {
    const playerStat = playerStats[player.id];
    if (!playerStat) return;
    
    // Base rating - everyone starts at 5.0
    let rating = 5.0;
    
    // Add points for disposals (scaled by position)
    let disposalValue = 0.04; // Base value per disposal
    if (player.position === "Midfielder") disposalValue = 0.03; // Mids get less per disposal (expected more)
    else if (player.position === "Defender" || player.position === "Forward") disposalValue = 0.04;
    else if (player.position === "Ruck") disposalValue = 0.05; // Rucks get more per disposal (expected fewer)
    
    rating += playerStat.disposals * disposalValue;
    
    // Add for marks, tackles, etc.
    rating += playerStat.marks * 0.1;
    rating += playerStat.contestedMarks * 0.2; // Contested marks worth more
    rating += playerStat.tackles * 0.1;
    
    // Add for position-specific stats
    if (player.position === "Forward") {
      rating += playerStat.goals * 0.5;
      rating += playerStat.behinds * 0.1;
    } else if (player.position === "Midfielder") {
      rating += playerStat.clearances * 0.15;
      rating += playerStat.inside50s * 0.1;
    } else if (player.position === "Defender") {
      rating += playerStat.rebound50s * 0.15;
    } else if (player.position === "Ruck") {
      rating += playerStat.hitouts * 0.04;
    }
    
    // Adjust based on opposition strength
    const oppositionFactor = 1 + ((oppositionStrength.overall - 70) * 0.005);
    rating *= oppositionFactor;
    
    // Cap between 1 and 10
    playerStat.matchRating = Math.max(1, Math.min(10, rating));
  });
}

// Generate player and team statistics for a match
function generatePlayerStats(
  homeLineup: TeamLineup,
  awayLineup: TeamLineup,
  homeStrength: { attack: number; midfield: number; defense: number; overall: number },
  awayStrength: { attack: number; midfield: number; defense: number; overall: number },
  events: MatchEvent[],
  homeScore: MatchScore,
  awayScore: MatchScore,
  quarterScores: { home: number[]; away: number[] }
): { 
  matchStats: MatchStats, 
  homePlayerStats: Record<string, PlayerMatchStats>, 
  awayPlayerStats: Record<string, PlayerMatchStats>,
  matchSummary: MatchSummary 
} {
  // Initialize stats objects for backward compatibility
  const disposals: Record<string, number> = {};
  const marks: Record<string, number> = {};
  const tackles: Record<string, number> = {};
  const goals: Record<string, number> = {};
  const behinds: Record<string, number> = {};
  
  // Initialize player stats records
  const homePlayerStats: Record<string, PlayerMatchStats> = {};
  const awayPlayerStats: Record<string, PlayerMatchStats> = {};
  
  // Initialize all players with zero basic stats
  [...homeLineup.players, ...awayLineup.players].forEach(player => {
    disposals[player.id] = 0;
    marks[player.id] = 0;
    tackles[player.id] = 0;
    goals[player.id] = 0;
    behinds[player.id] = 0;
    
    // Initialize detailed player stats
    const playerStats: PlayerMatchStats = {
      playerId: player.id,
      disposals: 0,
      kicks: 0,
      handballs: 0,
      marks: 0,
      contestedMarks: 0,
      tackles: 0,
      hitouts: 0,
      clearances: 0,
      inside50s: 0,
      rebound50s: 0,
      contestedPossessions: 0,
      uncontestPossessions: 0,
      goals: 0,
      behinds: 0,
      meterGained: 0,
      freeKicksFor: 0,
      freeKicksAgainst: 0,
      matchRating: 5.0 // starting rating
    };
    
    if (player.teamId === homeLineup.teamId) {
      homePlayerStats[player.id] = playerStats;
    } else {
      awayPlayerStats[player.id] = playerStats;
    }
  });
  
  // Record goals and behinds from events
  events.forEach(event => {
    if (event.type === "goal" && event.playerId) {
      goals[event.playerId] = (goals[event.playerId] || 0) + 1;
      
      // Update detailed player stats
      if (event.teamId === homeLineup.teamId && homePlayerStats[event.playerId]) {
        homePlayerStats[event.playerId].goals += 1;
        homePlayerStats[event.playerId].kicks += 1;
        homePlayerStats[event.playerId].disposals += 1;
      } else if (event.teamId === awayLineup.teamId && awayPlayerStats[event.playerId]) {
        awayPlayerStats[event.playerId].goals += 1;
        awayPlayerStats[event.playerId].kicks += 1;
        awayPlayerStats[event.playerId].disposals += 1;
      }
    } else if (event.type === "behind" && event.playerId) {
      behinds[event.playerId] = (behinds[event.playerId] || 0) + 1;
      
      // Update detailed player stats
      if (event.teamId === homeLineup.teamId && homePlayerStats[event.playerId]) {
        homePlayerStats[event.playerId].behinds += 1;
        homePlayerStats[event.playerId].kicks += 1;
        homePlayerStats[event.playerId].disposals += 1;
      } else if (event.teamId === awayLineup.teamId && awayPlayerStats[event.playerId]) {
        awayPlayerStats[event.playerId].behinds += 1;
        awayPlayerStats[event.playerId].kicks += 1;
        awayPlayerStats[event.playerId].disposals += 1;
      }
    }
  });
  
  // Calculate team disposals based on midfield strength
  const totalDisposals = AVERAGE_DISPOSALS_PER_MATCH * 2; // For both teams
  const homeMidfieldRatio = homeStrength.midfield / (homeStrength.midfield + awayStrength.midfield);
  const homeDisposals = Math.round(totalDisposals * homeMidfieldRatio);
  const awayDisposals = totalDisposals - homeDisposals;
  
  // Calculate distribution of kicks vs handballs (typically ~60/40 split)
  const homeKicks = Math.round(homeDisposals * 0.6);
  const homeHandballs = homeDisposals - homeKicks;
  const awayKicks = Math.round(awayDisposals * 0.6);
  const awayHandballs = awayDisposals - awayKicks;
  
  // Distribute disposals among players based on position and attributes
  distributeDisposals(homeLineup, homePlayerStats, homeKicks, homeHandballs);
  distributeDisposals(awayLineup, awayPlayerStats, awayKicks, awayHandballs);
  
  // Calculate and distribute contested vs uncontested possessions
  distributeContestedStats(homeLineup, homePlayerStats, homeStrength);
  distributeContestedStats(awayLineup, awayPlayerStats, awayStrength);
  
  // Calculate team marks
  const totalMarks = AVERAGE_MARKS_PER_MATCH * 2;
  const homeMarkRatio = (homeStrength.attack * 0.4 + homeStrength.midfield * 0.3 + homeStrength.defense * 0.3) / 
                        ((homeStrength.attack + awayStrength.attack) * 0.4 + 
                         (homeStrength.midfield + awayStrength.midfield) * 0.3 + 
                         (homeStrength.defense + awayStrength.defense) * 0.3);
  const homeMarks = Math.round(totalMarks * homeMarkRatio);
  const awayMarks = totalMarks - homeMarks;
  
  distributeMarks(homeLineup, homePlayerStats, homeMarks);
  distributeMarks(awayLineup, awayPlayerStats, awayMarks);
  
  // Calculate team tackles
  const totalTackles = AVERAGE_TACKLES_PER_MATCH * 2;
  const homeTackleRatio = (homeStrength.defense * 0.5 + homeStrength.midfield * 0.5) / 
                          ((homeStrength.defense + awayStrength.defense) * 0.5 + 
                           (homeStrength.midfield + awayStrength.midfield) * 0.5);
  const homeTackles = Math.round(totalTackles * homeTackleRatio);
  const awayTackles = totalTackles - homeTackles;
  
  distributeSpecialStats(homeLineup, homePlayerStats, "tackles", homeTackles);
  distributeSpecialStats(awayLineup, awayPlayerStats, "tackles", awayTackles);
  
  // Calculate inside 50s
  const totalInside50s = AVERAGE_INSIDE_50S_PER_MATCH * 2;
  const homeInside50Ratio = (homeStrength.midfield * 0.7 + homeStrength.attack * 0.3) / 
                            ((homeStrength.midfield + awayStrength.midfield) * 0.7 + 
                             (homeStrength.attack + awayStrength.attack) * 0.3);
  const homeInside50s = Math.round(totalInside50s * homeInside50Ratio);
  const awayInside50s = totalInside50s - homeInside50s;
  
  distributeSpecialStats(homeLineup, homePlayerStats, "inside50s", homeInside50s);
  distributeSpecialStats(awayLineup, awayPlayerStats, "inside50s", awayInside50s);
  
  // Calculate clearances
  const totalClearances = AVERAGE_CLEARANCES_PER_MATCH * 2;
  const homeClearanceRatio = homeStrength.midfield / (homeStrength.midfield + awayStrength.midfield);
  const homeClearances = Math.round(totalClearances * homeClearanceRatio);
  const awayClearances = totalClearances - homeClearances;
  
  distributeSpecialStats(homeLineup, homePlayerStats, "clearances", homeClearances);
  distributeSpecialStats(awayLineup, awayPlayerStats, "clearances", awayClearances);
  
  // Calculate hitouts
  distributeRuckStats(homeLineup, homePlayerStats, awayLineup, awayPlayerStats, homeStrength, awayStrength);
  
  // Calculate meters gained
  calculateMetersGained(homeLineup, homePlayerStats);
  calculateMetersGained(awayLineup, awayPlayerStats);
  
  // Calculate player ratings
  calculatePlayerRatings(homeLineup, homePlayerStats, homeStrength, awayStrength);
  calculatePlayerRatings(awayLineup, awayPlayerStats, awayStrength, homeStrength);
  
  // Create match summary
  const matchSummary = createMatchSummary(
    homeLineup, awayLineup, 
    homePlayerStats, awayPlayerStats, 
    homeScore, awayScore
  );
  
  // Update quarter scores in match summary
  matchSummary.quarterByQuarter.home = quarterScores.home;
  matchSummary.quarterByQuarter.away = quarterScores.away;
  
  // Legacy stats object for backward compatibility
  const matchStats: MatchStats = {
    disposals,
    marks,
    tackles,
    goals,
    behinds
  };
  
  return { matchStats, homePlayerStats, awayPlayerStats, matchSummary };
}

// Main function to simulate a match
export function simulateMatch(
  match: Match,
  homeTeam: Team,
  awayTeam: Team,
  homePlayers: Player[],
  awayPlayers: Player[]
): MatchSimulationResult {
  // Create lineups with detailed tactics
  const homeLineup: TeamLineup = {
    teamId: homeTeam.id,
    players: homePlayers,
    tactics: {
      style: "balanced",
      pressure: 5,
      possession: 5,
      riskTaking: 5,
      ballMovement: "corridor-focused",
      defensiveStructure: "accountable-zone",
      attackingStructure: "leading-patterns",
      contestApproach: "outnumber-at-contest",
      centerBounceSetup: "6-6-6",
      quarterAdjustments: {
        firstQuarter: "fast-start",
        thirdQuarter: "apply-pressure",
        finalQuarter: "protect-lead"
      },
      rotationSystem: {
        type: "time-based",
        forwardFrequency: 5,
        midfieldFrequency: 7,
        defenseFrequency: 10,
        ruckStrategy: "quarters"
      }
    },
    playerRoles: {}
  };
  
  const awayLineup: TeamLineup = {
    teamId: awayTeam.id,
    players: awayPlayers,
    tactics: {
      style: "balanced",
      pressure: 5,
      possession: 5,
      riskTaking: 5,
      ballMovement: "boundary-line",
      defensiveStructure: "zone-defense",
      attackingStructure: "forward-target-focus",
      contestApproach: "physical-intimidation",
      centerBounceSetup: "5-7-5",
      quarterAdjustments: {
        firstQuarter: "assess-opposition",
        thirdQuarter: "apply-pressure",
        finalQuarter: "protect-lead"
      },
      rotationSystem: {
        type: "time-based",
        forwardFrequency: 5,
        midfieldFrequency: 6,
        defenseFrequency: 12,
        ruckStrategy: "quarters"
      }
    },
    playerRoles: {}
  };
  
  // Assign default roles based on position
  homePlayers.forEach(player => {
    let role = "";
    let instructions: string[] = [];
    
    switch(player.position) {
      case "Forward":
        role = "Key Target";
        instructions = ["Lead up at ball carrier", "Take contested marks"];
        break;
      case "Midfielder":
        role = "Inside Midfielder";
        instructions = ["Win clearances", "Distribute by hand"];
        break;
      case "Defender":
        role = "Lockdown";
        instructions = ["Stick to opponent", "Spoil contests"];
        break;
      case "Ruck":
        role = "Tap Specialist";
        instructions = ["Win hitouts", "Follow up at ground level"];
        break;
      case "Utility":
        role = "Link";
        instructions = ["Provide options", "Cover multiple positions"];
        break;
    }
    
    homeLineup.playerRoles[player.id] = {
      role,
      instructions
    };
  });
  
  // Same for away team
  awayPlayers.forEach(player => {
    let role = "";
    let instructions: string[] = [];
    
    switch(player.position) {
      case "Forward":
        role = "Crumber";
        instructions = ["Crumb from contests", "Apply forward pressure"];
        break;
      case "Midfielder":
        role = "Outside Midfielder";
        instructions = ["Receive from contests", "Use pace on wings"];
        break;
      case "Defender":
        role = "Interceptor";
        instructions = ["Read the play", "Take intercept marks"];
        break;
      case "Ruck":
        role = "Around-the-Ground";
        instructions = ["Compete in hitouts", "Be a marking target around ground"];
        break;
      case "Utility":
        role = "Distributor";
        instructions = ["Link up play", "Use skills in transition"];
        break;
    }
    
    awayLineup.playerRoles[player.id] = {
      role,
      instructions
    };
  });
  
  // Calculate team strengths
  const homeStrength = calculateTeamStrength(homeTeam, homeLineup, awayTeam);
  const awayStrength = calculateTeamStrength(awayTeam, awayLineup, homeTeam);
  
  // Generate match events and scores
  const { events, homeScore, awayScore, quarterScores } = generateMatchEvents(
    homeTeam, awayTeam, homeLineup, awayLineup, homeStrength, awayStrength
  );
  
  // Generate player and team statistics
  const { matchStats, homePlayerStats, awayPlayerStats, matchSummary } = generatePlayerStats(
    homeLineup, awayLineup, homeStrength, awayStrength, events, homeScore, awayScore, quarterScores
  );
  
  // Return simulation result
  return {
    homeScore,
    awayScore,
    events,
    stats: matchStats,
    homePlayerStats,
    awayPlayerStats,
    matchSummary
  };
}

// Export utility functions for LiveMatchSimulation component
export function resetPositions(state: any) {
  if (!state.players || !state.ball) return state;
  
  // Reset ball position to center
  state.ball.x = FIELD_WIDTH / 2;
  state.ball.y = FIELD_HEIGHT / 2;
  state.ball.targetX = FIELD_WIDTH / 2;
  state.ball.targetY = FIELD_HEIGHT / 2;
  state.ball.carrier = null;
  state.ball.moving = false;
  state.ball.inAir = false;
  state.ball.height = 0;
  
  // Reset player positions
  const homeTeamId = state.players.find((p: any) => p.teamId)?.teamId;
  if (!homeTeamId) return state;
  
  state.players = state.players.map((player: any, index: number) => {
    const isHomeTeam = player.teamId === homeTeamId;
    const formation = isHomeTeam ? TEAM_FORMATIONS.attack : TEAM_FORMATIONS.defense;
    const position = formation[index % formation.length]; // Use modulo to avoid issues if more than 18 players
    
    return {
      ...player,
      x: position.x * FIELD_WIDTH,
      y: position.y * FIELD_HEIGHT,
      targetX: position.x * FIELD_WIDTH,
      targetY: position.y * FIELD_HEIGHT,
      hasBall: false
    };
  });
  
  return state;
}

export function kickBall(state: any, player: any, targetX: number, targetY: number) {
  // Player kicks the ball
  state.ball.carrier = null;
  state.ball.moving = true;
  state.ball.inAir = true;
  state.ball.targetX = targetX;
  state.ball.targetY = targetY;
  state.ball.height = 0;
  state.ball.maxHeight = 50 + Math.random() * 50;
  state.ball.spinFactor = (Math.random() - 0.5) * 0.2;
  
  // Update player
  state.players = state.players.map((p: any) => 
    p.id === player.id ? { ...p, hasBall: false } : p
  );
  
  return state;
}

export function moveBall(state: any) {
  // Ball movement logic
  if (!state.ball.moving) return state;
  
  const dx = state.ball.targetX - state.ball.x;
  const dy = state.ball.targetY - state.ball.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  if (distance < 5) {
    // Ball has reached target
    state.ball.x = state.ball.targetX;
    state.ball.y = state.ball.targetY;
    state.ball.moving = false;
    state.ball.inAir = false;
    state.ball.height = 0;
    return state;
  }
  
  // Move ball towards target
  const speed = distance > 100 ? 8 : 4; // Slow down as it approaches target
  const moveX = (dx / distance) * speed;
  const moveY = (dy / distance) * speed;
  
  state.ball.x += moveX;
  state.ball.y += moveY;
  
  // Update ball height if in air
  if (state.ball.inAir) {
    // Parabolic arc
    const progress = 1 - (distance / Math.sqrt(
      Math.pow(state.ball.targetX - state.ball.x, 2) +
      Math.pow(state.ball.targetY - state.ball.y, 2)
    ));
    
    state.ball.height = state.ball.maxHeight * Math.sin(progress * Math.PI);
    
    if (progress >= 1) {
      state.ball.inAir = false;
      state.ball.height = 0;
    }
  }
  
  // Add spin factor to trajectory
  if (state.ball.spinFactor) {
    const perpX = -dy / distance;
    const perpY = dx / distance;
    state.ball.x += perpX * state.ball.spinFactor * speed;
    state.ball.y += perpY * state.ball.spinFactor * speed;
  }
  
  // Update ball rotation
  state.ball.rotation = (state.ball.rotation || 0) + 10;
  
  return state;
}
