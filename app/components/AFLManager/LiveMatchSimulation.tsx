import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Flex, Text, Heading, Card, Separator, Grid, Avatar, Table } from "@radix-ui/themes";
import { Team } from "~/data/AFLManager/teams";
import { Player } from "~/data/AFLManager/players";
import { Match, MatchEvent, MatchScore, MatchStats } from "~/data/AFLManager/gameState";
import { 
  resetPositions, 
  kickBall, 
  moveBall,
  FIELD_WIDTH,
  FIELD_HEIGHT,
  GOAL_WIDTH,
  BEHIND_WIDTH,
  CENTER_CIRCLE_RADIUS,
  FIFTY_METER_ARC_RADIUS,
  PLAYER_RADIUS,
  BALL_RADIUS,
  MAX_PLAYER_SPEED,
  BALL_SPEED,
  PLAYER_ACCELERATION,
  PLAYER_FATIGUE_RATE,
  TEAM_FORMATIONS
} from "~/utils/AFLManager/matchEngine";

// Define field dimensions (in pixels)
const FIELD_WIDTH = 700;
const FIELD_HEIGHT = 500;
const GOAL_WIDTH = 30;
const BEHIND_WIDTH = 20; // Width of behind posts on each side
const CENTER_CIRCLE_RADIUS = 30;
const FIFTY_METER_ARC_RADIUS = 120;

// Player constants
const PLAYER_RADIUS = 8;
const BALL_RADIUS = 5;
const MAX_PLAYER_SPEED = 3.5; // Increased for more dynamic movement
const BALL_SPEED = 7; // Increased for more realistic ball movement
const PLAYER_ACCELERATION = 0.2; // New: acceleration factor for more realistic movement
const PLAYER_FATIGUE_RATE = 0.005; // New: players slow down over time

// Game constants
const QUARTER_LENGTH_MS = 120000; // 2 minutes per quarter for more realistic simulation
const FRAME_RATE = 60; // Frames per second
const PLAY_PAUSE_SPEED = 3; // How many times faster when fast-forwarding

// Weather conditions (new)
const WEATHER_CONDITIONS = ["Clear", "Rainy", "Windy", "Hot", "Overcast"];
const WEATHER_EFFECTS = {
  "Clear": { ballAccuracy: 1.0, playerSpeed: 1.0, description: "Perfect conditions for football" },
  "Rainy": { ballAccuracy: 0.7, playerSpeed: 0.85, description: "Slippery conditions affecting ball handling" },
  "Windy": { ballAccuracy: 0.8, playerSpeed: 0.95, description: "Strong winds affecting kick accuracy" },
  "Hot": { ballAccuracy: 0.9, playerSpeed: 0.9, description: "Hot conditions affecting player stamina" },
  "Overcast": { ballAccuracy: 0.95, playerSpeed: 0.98, description: "Overcast but good playing conditions" }
};

// Player positions on field (percentages)
const TEAM_FORMATIONS = {
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

// Create a custom type for custom events
type CustomMatchEvent = MatchEvent & {
  type: "goal" | "behind" | "injury" | "substitution" | "quarter" | "final" | "tackle" | "mark" | "free_kick" | "boundary_throw";
  player2Id?: string; // Second player involved in event (e.g. assist)
  position?: { x: number; y: number }; // Position on field where event occurred
  success?: boolean; // Whether attempt was successful
  distance?: number; // Distance of kick/event
};

// Commentary templates for more varied commentary
const COMMENTARY_TEMPLATES = {
  goal: [
    "{player} slots it through for a goal!",
    "GOAL! {player} kicks truly for {team}!",
    "Brilliant finish from {player} for a major!",
    "{player} converts from {distance} meters out!",
    "That's six points for {team} thanks to {player}!"
  ],
  behind: [
    "{player}'s shot drifts for a behind.",
    "Just a minor score for {team}.",
    "{player} misses narrowly for a behind.",
    "That'll be one point for {team}.",
    "So close! {player} hits the post for a behind."
  ],
  mark: [
    "Strong mark taken by {player}!",
    "{player} flies high for a spectacular mark!",
    "Good hands from {player} to take the mark.",
    "Clean grab by {player} in traffic!",
    "{player} uses his strength to mark that ball!"
  ],
  tackle: [
    "{player} lays a strong tackle on {player2}!",
    "Ball spills free after {player}'s tackle on {player2}!",
    "Great defensive pressure from {player}!",
    "{player} stops {player2} in his tracks!",
    "Brilliant tackle from {player}!"
  ]
};

// Interfaces for the simulation
interface SimulationPlayer {
  id: string;
  name: string;
  teamId: string;
  number: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  speed: number;
  hasBall: boolean;
  color: string;
  secondaryColor?: string; // For jersey details
  selected?: boolean; // If player is currently selected/highlighted
  attributes: {
    speed: number;
    stamina: number;
    kicking: number;
    marking: number;
    tackling: number;
    goalkicking?: number; // Added optional attribute
    strength?: number; // Added optional attribute
    agility?: number; // Added optional attribute
  };
  matchStats?: {
    disposals: number;
    kicks: number;
    handballs: number;
    marks: number;
    tackles: number;
    goals: number;
    behinds: number;
  };
}

interface SimulationBall {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  inAir: boolean;
  height: number;
  maxHeight: number;
  carrier: string | null; // Player ID who has the ball
  moving: boolean;
  spinFactor?: number; // Affects trajectory
  rotation?: number; // Visual rotation angle
}

interface GameSimulationState {
  quarter: number;
  timeElapsed: number;
  homeScore: MatchScore;
  awayScore: MatchScore;
  possession: string; // Team ID
  possessionPercentage?: { home: number; away: number }; // Possession stats
  lastEvent: string;
  commentary?: string[]; // Array of commentary lines
  players: SimulationPlayer[];
  ball: SimulationBall;
  events: CustomMatchEvent[];
  paused: boolean;
  fastForward: boolean;
  weather?: {
    condition: string;
    effects: { ballAccuracy: number; playerSpeed: number; description: string };
  };
  matchStats?: {
    home: {
      disposals: number;
      kicks: number;
      handballs: number;
      marks: number;
      tackles: number;
      inside50s: number;
      clearances: number;
    };
    away: {
      disposals: number;
      kicks: number;
      handballs: number;
      marks: number;
      tackles: number;
      inside50s: number;
      clearances: number;
    };
  };
}

interface LiveMatchSimulationProps {
  match: Match;
  homeTeam: Team;
  awayTeam: Team;
  homePlayers: Player[];
  awayPlayers: Player[];
  onSimulationComplete: (homeScore: MatchScore, awayScore: MatchScore, events: MatchEvent[]) => void;
}

// Player match rating interface for Football Manager style ratings
interface PlayerMatchRating {
  playerId: string;
  name: string;
  team: string;
  rating: number; // 0-10 rating
  keyStats: string; // Key stats to highlight
}

export default function LiveMatchSimulation({
  match,
  homeTeam,
  awayTeam,
  homePlayers,
  awayPlayers,
  onSimulationComplete
}: LiveMatchSimulationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Player positions mapping
  const positionNames = [
    "Full Forward", "Forward Pocket", "Forward Pocket", 
    "Centre Half Forward", "Half Forward Flank", "Half Forward Flank", 
    "Centre", "Wing", "Wing", 
    "Centre Half Back", "Half Back Flank", "Half Back Flank", 
    "Full Back", "Back Pocket", "Back Pocket", 
    "Ruck", "Ruck Rover", "Rover"
  ];
  
  const [gameState, setGameState] = useState<GameSimulationState>(() => {
    // Randomly select weather for the match
    const weatherCondition = WEATHER_CONDITIONS[Math.floor(Math.random() * WEATHER_CONDITIONS.length)];
    
    // Initialize game state with starting positions
    const initialPlayers: SimulationPlayer[] = [];
    
    // Add home team players
    homePlayers.slice(0, 18).forEach((player, index) => {
      const position = TEAM_FORMATIONS.attack[index];
      initialPlayers.push({
        id: player.id,
        name: player.name,
        teamId: homeTeam.id,
        number: index + 1, // Use index+1 as jersey number
        x: position.x * FIELD_WIDTH,
        y: position.y * FIELD_HEIGHT,
        targetX: position.x * FIELD_WIDTH,
        targetY: position.y * FIELD_HEIGHT,
        speed: (player.attributes.speed / 100) * MAX_PLAYER_SPEED,
        hasBall: false,
        color: homeTeam.colors.primary,
        secondaryColor: homeTeam.colors.secondary,
        selected: false,
        attributes: {
          speed: player.attributes.speed,
          stamina: player.attributes.stamina,
          kicking: player.attributes.kicking,
          marking: player.attributes.marking,
          tackling: player.attributes.tackling,
          goalkicking: player.attributes.goalkicking || 
            (player.position === "Forward" ? 80 : 65),
          strength: player.attributes.strength || 70,
          agility: player.attributes.agility || 70
        },
        matchStats: {
          disposals: 0,
          kicks: 0,
          handballs: 0,
          marks: 0,
          tackles: 0,
          goals: 0,
          behinds: 0
        }
      });
    });
    
    // Add away team players
    awayPlayers.slice(0, 18).forEach((player, index) => {
      const position = TEAM_FORMATIONS.defense[index];
      initialPlayers.push({
        id: player.id,
        name: player.name,
        teamId: awayTeam.id,
        number: index + 1, // Use index+1 as jersey number
        x: position.x * FIELD_WIDTH,
        y: position.y * FIELD_HEIGHT,
        targetX: position.x * FIELD_WIDTH,
        targetY: position.y * FIELD_HEIGHT,
        speed: (player.attributes.speed / 100) * MAX_PLAYER_SPEED,
        hasBall: false,
        color: awayTeam.colors.primary,
        secondaryColor: awayTeam.colors.secondary,
        selected: false,
        attributes: {
          speed: player.attributes.speed,
          stamina: player.attributes.stamina,
          kicking: player.attributes.kicking,
          marking: player.attributes.marking,
          tackling: player.attributes.tackling,
          goalkicking: player.attributes.goalkicking || 
            (player.position === "Forward" ? 80 : 65),
          strength: player.attributes.strength || 70,
          agility: player.attributes.agility || 70
        },
        matchStats: {
          disposals: 0,
          kicks: 0,
          handballs: 0,
          marks: 0,
          tackles: 0,
          goals: 0,
          behinds: 0
        }
      });
    });
    
    return {
      quarter: 1,
      timeElapsed: 0,
      homeScore: { goals: 0, behinds: 0, total: 0 },
      awayScore: { goals: 0, behinds: 0, total: 0 },
      possession: Math.random() > 0.5 ? homeTeam.id : awayTeam.id,
      possessionPercentage: { home: 50, away: 50 },
      lastEvent: "Game starting...",
      commentary: [
        `Welcome to ${match.venue} for this clash between ${homeTeam.name} and ${awayTeam.name}`,
        `Weather conditions today: ${weatherCondition}. ${WEATHER_EFFECTS[weatherCondition].description}`,
        "Players taking their positions as we get ready for the first bounce"
      ],
      players: initialPlayers,
      ball: {
        x: FIELD_WIDTH / 2,
        y: FIELD_HEIGHT / 2,
        targetX: FIELD_WIDTH / 2,
        targetY: FIELD_HEIGHT / 2,
        inAir: false,
        height: 0,
        maxHeight: 0,
        carrier: null,
        moving: false,
        spinFactor: 0,
        rotation: 0
      },
      events: [],
      paused: true,
      fastForward: false,
      weather: {
        condition: weatherCondition,
        effects: WEATHER_EFFECTS[weatherCondition]
      },
      matchStats: {
        home: {
          disposals: 0,
          kicks: 0,
          handballs: 0,
          marks: 0,
          tackles: 0, 
          inside50s: 0,
          clearances: 0
        },
        away: {
          disposals: 0,
          kicks: 0,
          handballs: 0,
          marks: 0,
          tackles: 0,
          inside50s: 0,
          clearances: 0
        }
      }
    };
  });
  
  const [selectedPlayer, setSelectedPlayer] = useState<SimulationPlayer | null>(null);
  const [playerRatings, setPlayerRatings] = useState<PlayerMatchRating[]>([]);
  const [matchTimeline, setMatchTimeline] = useState<CustomMatchEvent[]>([]);
  
  // Animation frame request ID
  const animationFrameId = useRef<number | null>(null);
  
  // Game time tracking
  const lastFrameTime = useRef<number>(0);
  const gameTimeAccumulator = useRef<number>(0);
  
  // Set up the game loop
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Game loop function
    const gameLoop = (timestamp: number) => {
      if (!lastFrameTime.current) {
        lastFrameTime.current = timestamp;
      }
      
      const deltaTime = timestamp - lastFrameTime.current;
      lastFrameTime.current = timestamp;
      
      if (!gameState.paused) {
        // Update game time
        const timeMultiplier = gameState.fastForward ? PLAY_PAUSE_SPEED : 1;
        gameTimeAccumulator.current += deltaTime * timeMultiplier;
        
        // Update once every 16ms (approx 60fps)
        if (gameTimeAccumulator.current >= 16) {
          updateGame(gameTimeAccumulator.current / 1000);
          gameTimeAccumulator.current = 0;
        }
      }
      
      renderGame();
      animationFrameId.current = requestAnimationFrame(gameLoop);
    };
    
    // Start the game loop
    animationFrameId.current = requestAnimationFrame(gameLoop);
    
    // Clean up
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [gameState]);
  
  // Calculate and update player ratings
  const updatePlayerRatings = (state: GameSimulationState) => {
    const ratings: PlayerMatchRating[] = state.players.map(player => {
      // Calculate rating based on match stats
      let rating = 6.0; // Base rating
      
      const stats = player.matchStats;
      if (stats) {
        // Add rating points based on key stats
        if (stats.goals > 0) rating += stats.goals * 0.5;
        if (stats.behinds > 0) rating += stats.behinds * 0.1;
        if (stats.disposals > 0) rating += stats.disposals * 0.1;
        if (stats.marks > 0) rating += stats.marks * 0.2;
        if (stats.tackles > 0) rating += stats.tackles * 0.2;
      }
      
      // Cap rating between 1 and 10
      rating = Math.max(1, Math.min(10, rating));
      
      // Determine key stat highlight
      let keyStats = "";
      if (stats?.goals > 0) keyStats = `${stats.goals} goals`;
      else if (stats?.disposals > 10) keyStats = `${stats.disposals} disposals`;
      else if (stats?.marks > 3) keyStats = `${stats.marks} marks`;
      else if (stats?.tackles > 3) keyStats = `${stats.tackles} tackles`;
      else keyStats = `${stats?.disposals || 0} disposals`;
      
      return {
        playerId: player.id,
        name: player.name,
        team: player.teamId === homeTeam.id ? homeTeam.name : awayTeam.name,
        rating: parseFloat(rating.toFixed(1)),
        keyStats
      };
    });
    
    setPlayerRatings(ratings);
  };
  
  // Update game state
  const updateGame = (deltaTime: number) => {
    setGameState(prevState => {
      const newState = { ...prevState };
      
      // Update match time
      newState.timeElapsed += deltaTime * 1000;
      
      // Update possession percentages
      if (newState.ball.carrier && newState.possessionPercentage) {
        const carrier = newState.players.find(p => p.id === newState.ball.carrier);
        if (carrier) {
          if (carrier.teamId === homeTeam.id) {
            newState.possessionPercentage.home += 0.01;
            newState.possessionPercentage.away -= 0.01;
          } else {
            newState.possessionPercentage.home -= 0.01;
            newState.possessionPercentage.away += 0.01;
          }
          
          // Ensure percentages stay within bounds
          newState.possessionPercentage.home = Math.max(0, Math.min(100, newState.possessionPercentage.home));
          newState.possessionPercentage.away = Math.max(0, Math.min(100, newState.possessionPercentage.away));
        }
      }
      
      // Check for quarter transitions
      if (newState.timeElapsed >= QUARTER_LENGTH_MS * newState.quarter) {
        if (newState.quarter < 4) {
          // Start new quarter
          newState.quarter += 1;
          newState.lastEvent = `Start of Quarter ${newState.quarter}`;
          
          // Add quarter commentary
          if (newState.commentary) {
            newState.commentary.unshift(`Start of Quarter ${newState.quarter}`);
          }
          
          newState.events.push({
            type: "quarter",
            quarter: newState.quarter,
            message: `Start of Q${newState.quarter}`,
            timestamp: newState.timeElapsed / 1000
          });
          
          // Calculate and update player ratings at quarter time
          updatePlayerRatings(newState);
          
          // Reset positions
          resetPositions(newState);
        } else {
          // Game over
          newState.lastEvent = "Final Siren! Game Over";
          
          // Add final commentary
          if (newState.commentary) {
            newState.commentary.unshift("FINAL SIREN! The match is over.");
            
            // Add final score commentary
            const scoreDiff = Math.abs(newState.homeScore.total - newState.awayScore.total);
            if (newState.homeScore.total > newState.awayScore.total) {
              newState.commentary.unshift(`${homeTeam.name} wins by ${scoreDiff} points: ${newState.homeScore.goals}.${newState.homeScore.behinds} (${newState.homeScore.total}) to ${newState.awayScore.goals}.${newState.awayScore.behinds} (${newState.awayScore.total})`);
            } else if (newState.awayScore.total > newState.homeScore.total) {
              newState.commentary.unshift(`${awayTeam.name} wins by ${scoreDiff} points: ${newState.awayScore.goals}.${newState.awayScore.behinds} (${newState.awayScore.total}) to ${newState.homeScore.goals}.${newState.homeScore.behinds} (${newState.homeScore.total})`);
            } else {
              newState.commentary.unshift(`It's a draw! ${newState.homeScore.goals}.${newState.homeScore.behinds} (${newState.homeScore.total}) apiece`);
            }
          }
          
          newState.events.push({
            type: "final",
            message: "FINAL SIREN! The match is over.",
            timestamp: newState.timeElapsed / 1000
          });
          
          newState.paused = true;
          
          // Calculate final player ratings
          updatePlayerRatings(newState);
          
          // Trigger the completion callback
          onSimulationComplete(newState.homeScore, newState.awayScore, newState.events);
        }
      }
      
      // Update ball position
      if (newState.ball.moving) {
        moveBall(newState);
      }
      
      // Update player positions with improved physics
      newState.players = newState.players.map(player => {
        const updatedPlayer = { ...player };
        
        // Move player towards target
        const dx = updatedPlayer.targetX - updatedPlayer.x;
        const dy = updatedPlayer.targetY - updatedPlayer.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 1) {
          // Apply weather effects to player speed
          const weatherSpeedFactor = newState.weather ? newState.weather.effects.playerSpeed : 1.0;
          const effectiveSpeed = updatedPlayer.speed * weatherSpeedFactor;
          
          const moveX = (dx / distance) * effectiveSpeed;
          const moveY = (dy / distance) * effectiveSpeed;
          
          updatedPlayer.x += moveX;
          updatedPlayer.y += moveY;
        } else {
          // Player reached target, potentially set new target
          if (Math.random() < 0.02) {
            // Small random movement
            const randomOffset = 30;
            updatedPlayer.targetX = Math.max(0, Math.min(FIELD_WIDTH, 
              updatedPlayer.x + (Math.random() * randomOffset * 2 - randomOffset)));
            updatedPlayer.targetY = Math.max(0, Math.min(FIELD_HEIGHT, 
              updatedPlayer.y + (Math.random() * randomOffset * 2 - randomOffset)));
          }
          
          // If player has the ball, update ball position
          if (updatedPlayer.hasBall && newState.ball.carrier === updatedPlayer.id) {
            newState.ball.x = updatedPlayer.x;
            newState.ball.y = updatedPlayer.y;
          }
        }
        
        return updatedPlayer;
      });
      
      // Check for ball possession changes or scoring
      if (!newState.ball.inAir && !newState.ball.moving) {
        // Ball is on the ground or with a player
        if (newState.ball.carrier === null) {
          // Ball is on the ground, check if any player can pick it up
          const closePlayers = newState.players.filter(player => {
            const dx = player.x - newState.ball.x;
            const dy = player.y - newState.ball.y;
            return Math.sqrt(dx * dx + dy * dy) < PLAYER_RADIUS * 2;
          });
          
          if (closePlayers.length > 0) {
            // Random player picks up the ball
            const pickingPlayer = closePlayers[Math.floor(Math.random() * closePlayers.length)];
            newState.ball.carrier = pickingPlayer.id;
            
            // Update player
            newState.players = newState.players.map(p => 
              p.id === pickingPlayer.id ? { ...p, hasBall: true } : { ...p, hasBall: false }
            );
            
            // Update possession
            newState.possession = pickingPlayer.teamId;
            newState.lastEvent = `${pickingPlayer.name} has the ball`;
            
            // Update match stats
            if (pickingPlayer.matchStats) {
              pickingPlayer.matchStats.disposals += 1;
            }
            
            // Add to team stats
            if (newState.matchStats) {
              if (pickingPlayer.teamId === homeTeam.id) {
                newState.matchStats.home.disposals += 1;
              } else {
                newState.matchStats.away.disposals += 1;
              }
            }
          }
        } else {
          // A player has the ball, decide what happens next
          const ballCarrier = newState.players.find(p => p.id === newState.ball.carrier);
          
          if (ballCarrier) {
            // Check if near the goals to shoot
            const isAttackingHomeGoal = ballCarrier.teamId === awayTeam.id;
            const goalY = isAttackingHomeGoal ? 0 : FIELD_HEIGHT;
            
            const distanceToGoal = Math.abs(ballCarrier.y - goalY);
            
            if (distanceToGoal < 150 && Math.random() < 0.1) {
              // Attempt a shot at goal
              kickBall(newState, ballCarrier, FIELD_WIDTH / 2, goalY);
              
              newState.lastEvent = `${ballCarrier.name} takes a shot at goal!`;
              
              // Update player stats
              if (ballCarrier.matchStats) {
                ballCarrier.matchStats.kicks += 1;
                ballCarrier.matchStats.disposals += 1;
              }
              
              // Update team stats
              if (newState.matchStats) {
                if (ballCarrier.teamId === homeTeam.id) {
                  newState.matchStats.home.kicks += 1;
                  newState.matchStats.home.disposals += 1;
                } else {
                  newState.matchStats.away.kicks += 1;
                  newState.matchStats.away.disposals += 1;
                }
              }
              
              // Add commentary
              if (newState.commentary) {
                newState.commentary.unshift(`${ballCarrier.name} takes a shot at goal from ${Math.round(distanceToGoal / 10)} meters out!`);
              }
              
              // The kick will be evaluated for scoring in the moveBall function
            } else if (Math.random() < 0.05) {
              // Randomly decide to kick to a teammate
              const teammates = newState.players.filter(p => 
                p.teamId === ballCarrier.teamId && p.id !== ballCarrier.id
              );
              
              if (teammates.length > 0) {
                const targetTeammate = teammates[Math.floor(Math.random() * teammates.length)];
                kickBall(newState, ballCarrier, targetTeammate.x, targetTeammate.y);
                
                newState.lastEvent = `${ballCarrier.name} kicks to ${targetTeammate.name}`;
                
                // Update player stats
                if (ballCarrier.matchStats) {
                  ballCarrier.matchStats.kicks += 1;
