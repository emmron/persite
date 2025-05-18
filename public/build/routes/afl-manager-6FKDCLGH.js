import {
  Dashboard,
  GameInitialization,
  TeamManagement,
  advanceGameDay,
  completePresser,
  generatePlayersForTeam,
  initialGameState,
  players,
  scheduleTraining,
  teams
} from "/build/_shared/chunk-VXOW7BRJ.js";
import {
  generateMetaTags
} from "/build/_shared/chunk-X6TQ4243.js";
import {
  e,
  o,
  o2,
  o3,
  o4,
  p,
  p2,
  p3,
  r,
  r3 as r2,
  radio_group_exports,
  s,
  select_exports,
  table_exports,
  tabs_exports,
  text_field_exports
} from "/build/_shared/chunk-IJYMBMRR.js";
import "/build/_shared/chunk-B43JI2TA.js";
import {
  require_jsx_dev_runtime
} from "/build/_shared/chunk-XGOTYLZ5.js";
import "/build/_shared/chunk-U4FRFQSK.js";
import {
  require_react
} from "/build/_shared/chunk-7M6SC7J5.js";
import {
  createHotContext
} from "/build/_shared/chunk-U65RCIF3.js";
import "/build/_shared/chunk-UWV35TSL.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// app/routes/afl-manager.tsx
var import_react8 = __toESM(require_react(), 1);

// app/components/AFLManager/MatchCenter.tsx
var import_react = __toESM(require_react(), 1);

// app/utils/AFLManager/matchEngine.ts
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\utils\\AFLManager\\matchEngine.ts"
  );
  import.meta.hot.lastModified = "1747552386615.2893";
}
var MATCH_LENGTH_SECONDS = 120 * 60;
var QUARTER_LENGTH_SECONDS = MATCH_LENGTH_SECONDS / 4;
var AVERAGE_SCORING_EVENTS_PER_MATCH = 30;
var AVERAGE_DISPOSALS_PER_MATCH = 400;
var AVERAGE_MARKS_PER_MATCH = 100;
var AVERAGE_TACKLES_PER_MATCH = 70;
var AVERAGE_INSIDE_50S_PER_MATCH = 50;
var AVERAGE_CLEARANCES_PER_MATCH = 35;
var AVERAGE_CONTESTED_POSSESSIONS = 140;
var AVERAGE_UNCONTESTED_POSSESSIONS = 260;
function calculateTeamStrength(team, lineup, opposingTeam) {
  let attack = team.attributes.attack;
  let midfield = team.attributes.midfield;
  let defense = team.attributes.defense;
  const forwards = lineup.players.filter((p4) => p4.position === "Forward");
  const midfielders = lineup.players.filter((p4) => p4.position === "Midfielder");
  const defenders = lineup.players.filter((p4) => p4.position === "Defender");
  const rucks = lineup.players.filter((p4) => p4.position === "Ruck");
  const forwardRating = forwards.length > 0 ? forwards.reduce((sum, p4) => sum + (p4.attributes.kicking + p4.attributes.marking + (p4.attributes.goalkicking || 75)) / 3, 0) / forwards.length : 70;
  const midfieldRating = midfielders.length > 0 ? midfielders.reduce((sum, p4) => sum + (p4.attributes.speed + p4.attributes.stamina + p4.attributes.handball) / 3, 0) / midfielders.length : 70;
  const defenseRating = defenders.length > 0 ? defenders.reduce((sum, p4) => sum + (p4.attributes.marking + p4.attributes.tackling + (p4.attributes.intercept || 75)) / 3, 0) / defenders.length : 70;
  const ruckRating = rucks.length > 0 ? rucks.reduce((sum, p4) => sum + (p4.attributes.marking + p4.attributes.strength + (p4.attributes.tapwork || 75)) / 3, 0) / rucks.length : 70;
  attack = attack * 0.7 + forwardRating * 0.3;
  midfield = midfield * 0.6 + midfieldRating * 0.3 + ruckRating * 0.1;
  defense = defense * 0.7 + defenseRating * 0.3;
  if (lineup.tactics.style === "attacking") {
    attack += 5;
    defense -= 3;
  } else if (lineup.tactics.style === "defensive") {
    defense += 5;
    attack -= 3;
  }
  midfield += (lineup.tactics.pressure - 5) * 0.5;
  defense += (lineup.tactics.pressure - 5) * 0.5;
  midfield += (lineup.tactics.possession - 5) * 0.5;
  attack += (lineup.tactics.riskTaking - 5) * 0.7;
  defense -= (lineup.tactics.riskTaking - 5) * 0.5;
  const overall = (attack + midfield + defense) / 3;
  return { attack, midfield, defense, overall };
}
function generateEventTime(quarter) {
  const quarterStartTime = (quarter - 1) * QUARTER_LENGTH_SECONDS;
  return quarterStartTime + Math.floor(Math.random() * QUARTER_LENGTH_SECONDS);
}
function selectRandomPlayer(lineup, position) {
  let eligiblePlayers = lineup.players;
  if (position) {
    eligiblePlayers = lineup.players.filter((p4) => p4.position === position);
    if (eligiblePlayers.length === 0) {
      eligiblePlayers = lineup.players;
    }
  }
  const randomIndex = Math.floor(Math.random() * eligiblePlayers.length);
  return eligiblePlayers[randomIndex];
}
function generateGoalEvent(quarter, timestamp, scoringTeamId, scoringTeam, scoringLineup, defendingTeam, baseMessage) {
  const events = [];
  const goalTimestamp = timestamp;
  const sequenceStart = goalTimestamp - Math.floor(Math.random() * 20) - 10;
  const initiatingPlayer = selectRandomPlayer(scoringLineup, "Midfielder");
  events.push({
    type: "possession",
    teamId: scoringTeamId,
    playerId: initiatingPlayer.id,
    quarter,
    message: `${initiatingPlayer.name} gathers in the center for ${scoringTeam.name}`,
    timestamp: sequenceStart
  });
  const ballMovementStyle = scoringLineup.tactics.ballMovement;
  let middlePlayer;
  let middleMessage = "";
  const middleTimestamp = sequenceStart + 5 + Math.floor(Math.random() * 5);
  switch (ballMovementStyle) {
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
  events.push({
    type: "goal",
    teamId: scoringTeamId,
    playerId: inside50Player.id,
    quarter,
    message: baseMessage,
    timestamp: goalTimestamp
  });
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
function generateMatchEvents(homeTeam, awayTeam, homeLineup, awayLineup, homeStrength, awayStrength) {
  const events = [];
  const quarterScores = { home: [0, 0, 0, 0], away: [0, 0, 0, 0] };
  events.push({
    type: "prematch",
    message: `Teams are warming up at ${homeTeam.venue}. Conditions are perfect for football.`,
    timestamp: -300
    // 5 minutes before start
  });
  events.push({
    type: "prematch",
    message: `Captains meet for the coin toss as both teams prepare for the first bounce.`,
    timestamp: -60
    // 1 minute before start
  });
  for (let quarter = 1; quarter <= 4; quarter++) {
    const quarterStartTime = (quarter - 1) * QUARTER_LENGTH_SECONDS;
    events.push({
      type: "quarter",
      quarter,
      message: `Start of Q${quarter}`,
      timestamp: quarterStartTime
    });
    if (quarter === 1) {
      const homeFirstQ = homeLineup.tactics.quarterAdjustments.firstQuarter;
      events.push({
        type: "tactical",
        teamId: homeTeam.id,
        quarter,
        message: `${homeTeam.name} looking to ${homeFirstQ === "fast-start" ? "get off to a fast start" : homeFirstQ === "set-tone-physically" ? "set the physical tone early" : homeFirstQ === "assess-opposition" ? "assess the opposition structure" : "control possession in the early stages"}`,
        timestamp: quarterStartTime + 10
      });
      const awayFirstQ = awayLineup.tactics.quarterAdjustments.firstQuarter;
      events.push({
        type: "tactical",
        teamId: awayTeam.id,
        quarter,
        message: `${awayTeam.name} focusing on ${awayFirstQ === "fast-start" ? "starting quickly" : awayFirstQ === "set-tone-physically" ? "physical intimidation" : awayFirstQ === "assess-opposition" ? "reading the opposition" : "maintaining possession"}`,
        timestamp: quarterStartTime + 20
      });
    } else if (quarter === 3) {
      const homeThirdQ = homeLineup.tactics.quarterAdjustments.thirdQuarter;
      events.push({
        type: "tactical",
        teamId: homeTeam.id,
        quarter,
        message: `${homeTeam.name} ${homeThirdQ === "apply-pressure" ? "increasing their pressure in the premiership quarter" : homeThirdQ === "run-opposition-off-feet" ? "looking to run the opposition off their feet" : homeThirdQ === "defensive-lockdown" ? "focusing on defensive lockdown" : "taking more risks to create scoring opportunities"}`,
        timestamp: quarterStartTime + 15
      });
    } else if (quarter === 4) {
      const homeFinalQ = homeLineup.tactics.quarterAdjustments.finalQuarter;
      const awayFinalQ = awayLineup.tactics.quarterAdjustments.finalQuarter;
      const scoreDifference2 = quarterScores.home[0] + quarterScores.home[1] + quarterScores.home[2] - (quarterScores.away[0] + quarterScores.away[1] + quarterScores.away[2]);
      if (scoreDifference2 > 12) {
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
      } else if (scoreDifference2 < -12) {
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
      } else {
        events.push({
          type: "tactical",
          quarter,
          message: `Tension building in a tight final quarter as both teams aim for victory`,
          timestamp: quarterStartTime + 15
        });
      }
    }
    if (quarter < 4) {
      const quarterEndTime = quarter * QUARTER_LENGTH_SECONDS - 1;
      events.push({
        type: "quarter_end",
        quarter,
        message: `End of Q${quarter}`,
        timestamp: quarterEndTime
      });
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
  let homeScoringChance = (homeStrength.attack * 0.7 + homeStrength.midfield * 0.3) / 100;
  let awayScoringChance = (awayStrength.attack * 0.7 + awayStrength.midfield * 0.3) / 100;
  if (homeLineup.tactics.style === "attacking") {
    homeScoringChance *= 1.2;
  } else if (homeLineup.tactics.style === "defensive") {
    homeScoringChance *= 0.8;
    awayScoringChance *= 0.9;
  }
  if (awayLineup.tactics.style === "attacking") {
    awayScoringChance *= 1.2;
  } else if (awayLineup.tactics.style === "defensive") {
    awayScoringChance *= 0.8;
    homeScoringChance *= 0.9;
  }
  if (homeLineup.tactics.ballMovement === "fast-play-on" || homeLineup.tactics.ballMovement === "long-kicking") {
    homeScoringChance *= 1.1;
  }
  if (awayLineup.tactics.ballMovement === "fast-play-on" || awayLineup.tactics.ballMovement === "long-kicking") {
    awayScoringChance *= 1.1;
  }
  const totalScoringChance = homeScoringChance + awayScoringChance;
  const normalizedHomeScoringChance = homeScoringChance / totalScoringChance;
  const totalScoringEvents = Math.floor(AVERAGE_SCORING_EVENTS_PER_MATCH * (0.8 + Math.random() * 0.4));
  const quarterDistribution = [0.2, 0.25, 0.25, 0.3];
  const totalNonScoringEvents = 120;
  const nonScoringEventTypes = [
    "mark",
    "tackle",
    "clearance",
    "intercept",
    "inside50",
    "rebound50",
    "injury",
    "substitution"
  ];
  for (let quarter = 1; quarter <= 4; quarter++) {
    const quarterStartTime = (quarter - 1) * QUARTER_LENGTH_SECONDS;
    const quarterEndTime = quarter * QUARTER_LENGTH_SECONDS;
    const quarterNonScoringEvents = Math.floor(totalNonScoringEvents * quarterDistribution[quarter - 1]);
    for (let i = 0; i < quarterNonScoringEvents; i++) {
      const timestamp = quarterStartTime + Math.floor(Math.random() * QUARTER_LENGTH_SECONDS);
      const isHomeTeamEvent = Math.random() < normalizedHomeScoringChance;
      const team = isHomeTeamEvent ? homeTeam : awayTeam;
      const lineup = isHomeTeamEvent ? homeLineup : awayLineup;
      const eventType = nonScoringEventTypes[Math.floor(Math.random() * nonScoringEventTypes.length)];
      let player;
      let message = "";
      switch (eventType) {
        case "mark":
          player = selectRandomPlayer(lineup, Math.random() < 0.6 ? "Forward" : void 0);
          message = `${player.name} takes a strong mark for ${team.name}`;
          break;
        case "tackle":
          player = selectRandomPlayer(lineup, Math.random() < 0.7 ? "Midfielder" : void 0);
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
          player = selectRandomPlayer(lineup, Math.random() < 0.6 ? "Midfielder" : void 0);
          message = `${player.name} drives ${team.name} inside 50`;
          break;
        case "rebound50":
          player = selectRandomPlayer(lineup, "Defender");
          message = `${player.name} rebounds out of defensive 50`;
          break;
        case "injury":
          if (Math.random() < 0.1) {
            player = selectRandomPlayer(lineup);
            message = `${player.name} appears to have picked up a knock`;
            break;
          }
          continue;
        case "substitution":
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
  let homeGoals = 0;
  let homeBehinds = 0;
  let awayGoals = 0;
  let awayBehinds = 0;
  for (let quarter = 1; quarter <= 4; quarter++) {
    const quarterEvents = Math.round(totalScoringEvents * quarterDistribution[quarter - 1]);
    const homeEvents = Math.round(quarterEvents * normalizedHomeScoringChance);
    const awayEvents = quarterEvents - homeEvents;
    const homeGoalChance = 0.6 + (homeStrength.attack - 75) * 3e-3;
    for (let i = 0; i < homeEvents; i++) {
      const timestamp = generateEventTime(quarter);
      const isGoal = Math.random() < homeGoalChance;
      const player = selectRandomPlayer(homeLineup, isGoal ? "Forward" : void 0);
      if (isGoal) {
        homeGoals++;
        quarterScores.home[quarter - 1] += 6;
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
        events.push(...goalSequence);
      } else {
        homeBehinds++;
        quarterScores.home[quarter - 1] += 1;
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
    const awayGoalChance = 0.6 + (awayStrength.attack - 75) * 3e-3;
    for (let i = 0; i < awayEvents; i++) {
      const timestamp = generateEventTime(quarter);
      const isGoal = Math.random() < awayGoalChance;
      const player = selectRandomPlayer(awayLineup, isGoal ? "Forward" : void 0);
      if (isGoal) {
        awayGoals++;
        quarterScores.away[quarter - 1] += 6;
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
        events.push(...goalSequence);
      } else {
        awayBehinds++;
        quarterScores.away[quarter - 1] += 1;
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
    if (quarterScores.home[quarter - 1] > 18 && quarterScores.home[quarter - 1] > 2 * quarterScores.away[quarter - 1]) {
      events.push({
        type: "momentum",
        teamId: homeTeam.id,
        quarter,
        message: `${homeTeam.name} with all the momentum in Q${quarter}`,
        timestamp: (quarter - 1) * QUARTER_LENGTH_SECONDS + QUARTER_LENGTH_SECONDS * 0.7
        // Later in quarter
      });
    } else if (quarterScores.away[quarter - 1] > 18 && quarterScores.away[quarter - 1] > 2 * quarterScores.home[quarter - 1]) {
      events.push({
        type: "momentum",
        teamId: awayTeam.id,
        quarter,
        message: `${awayTeam.name} dominating the flow of play in Q${quarter}`,
        timestamp: (quarter - 1) * QUARTER_LENGTH_SECONDS + QUARTER_LENGTH_SECONDS * 0.7
      });
    }
  }
  const finalScore = {
    home: quarterScores.home.reduce((sum, score) => sum + score, 0),
    away: quarterScores.away.reduce((sum, score) => sum + score, 0)
  };
  const scoreDifference = Math.abs(finalScore.home - finalScore.away);
  if (scoreDifference <= 12) {
    const finalMinutes = MATCH_LENGTH_SECONDS - 180;
    events.push({
      type: "commentary",
      message: "Tension building as we enter the final minutes with scores incredibly close",
      timestamp: finalMinutes
    });
    events.push({
      type: "commentary",
      message: "The crowd is on its feet as we approach the final siren in this nail-biter!",
      timestamp: MATCH_LENGTH_SECONDS - 30
    });
  }
  events.push({
    type: "final",
    message: "FINAL SIREN! The match is over.",
    timestamp: MATCH_LENGTH_SECONDS
  });
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
    events.push({
      type: "postmatch",
      message: `Players from both teams share handshakes after a drawn match`,
      timestamp: MATCH_LENGTH_SECONDS + 15
    });
  }
  events.sort((a, b) => a.timestamp - b.timestamp);
  const homeScore = {
    goals: homeGoals,
    behinds: homeBehinds,
    total: homeGoals * 6 + homeBehinds
  };
  const awayScore = {
    goals: awayGoals,
    behinds: awayBehinds,
    total: awayGoals * 6 + awayBehinds
  };
  return { events, homeScore, awayScore, quarterScores };
}
function distributeDisposals(lineup, playerStats, kicks, handballs) {
  const kickWeights = {};
  const handballWeights = {};
  let totalKickWeight = 0;
  let totalHandballWeight = 0;
  lineup.players.forEach((player) => {
    const playerStat = playerStats[player.id];
    if (!playerStat)
      return;
    let kickWeight = 1;
    if (player.position === "Midfielder")
      kickWeight = 1.8;
    else if (player.position === "Forward")
      kickWeight = 1.2;
    else if (player.position === "Defender")
      kickWeight = 1.5;
    else if (player.position === "Ruck")
      kickWeight = 0.7;
    kickWeight *= player.attributes.kicking / 75;
    let handballWeight = 1;
    if (player.position === "Midfielder")
      handballWeight = 2;
    else if (player.position === "Forward")
      handballWeight = 0.9;
    else if (player.position === "Defender")
      handballWeight = 1.1;
    else if (player.position === "Ruck")
      handballWeight = 0.8;
    handballWeight *= player.attributes.handball / 75;
    kickWeights[player.id] = kickWeight;
    handballWeights[player.id] = handballWeight;
    totalKickWeight += kickWeight;
    totalHandballWeight += handballWeight;
  });
  let remainingKicks = kicks;
  lineup.players.forEach((player, index) => {
    const playerStat = playerStats[player.id];
    if (!playerStat)
      return;
    if (index === lineup.players.length - 1) {
      playerStat.kicks += remainingKicks;
    } else {
      const playerKicks = Math.round(kickWeights[player.id] / totalKickWeight * kicks);
      playerStat.kicks += playerKicks;
      remainingKicks -= playerKicks;
    }
  });
  let remainingHandballs = handballs;
  lineup.players.forEach((player, index) => {
    const playerStat = playerStats[player.id];
    if (!playerStat)
      return;
    if (index === lineup.players.length - 1) {
      playerStat.handballs += remainingHandballs;
    } else {
      const playerHandballs = Math.round(handballWeights[player.id] / totalHandballWeight * handballs);
      playerStat.handballs += playerHandballs;
      remainingHandballs -= playerHandballs;
    }
    playerStat.disposals = playerStat.kicks + playerStat.handballs;
  });
}
function distributeContestedStats(lineup, playerStats, teamStrength) {
  const totalContested = Math.round(AVERAGE_CONTESTED_POSSESSIONS * (0.85 + (teamStrength.overall - 70) * 5e-3));
  const totalUncontested = Math.round(AVERAGE_UNCONTESTED_POSSESSIONS * (0.85 + (teamStrength.overall - 70) * 5e-3));
  const contestedWeights = {};
  let totalContestedWeight = 0;
  lineup.players.forEach((player) => {
    const playerStat = playerStats[player.id];
    if (!playerStat)
      return;
    let contestedWeight = 1;
    if (player.position === "Midfielder")
      contestedWeight = 2;
    else if (player.position === "Forward")
      contestedWeight = 1.1;
    else if (player.position === "Defender")
      contestedWeight = 1.1;
    else if (player.position === "Ruck")
      contestedWeight = 1.5;
    contestedWeight *= player.attributes.strength / 75;
    contestedWeights[player.id] = contestedWeight;
    totalContestedWeight += contestedWeight;
  });
  let remainingContested = totalContested;
  lineup.players.forEach((player, index) => {
    const playerStat = playerStats[player.id];
    if (!playerStat)
      return;
    if (index === lineup.players.length - 1) {
      playerStat.contestedPossessions = remainingContested;
    } else {
      const playerContested = Math.round(contestedWeights[player.id] / totalContestedWeight * totalContested);
      playerStat.contestedPossessions = playerContested;
      remainingContested -= playerContested;
    }
  });
  let totalDisposals = 0;
  lineup.players.forEach((player) => {
    const playerStat = playerStats[player.id];
    if (playerStat)
      totalDisposals += playerStat.disposals;
  });
  lineup.players.forEach((player) => {
    const playerStat = playerStats[player.id];
    if (!playerStat)
      return;
    const disposalRatio = playerStat.disposals / totalDisposals;
    playerStat.uncontestPossessions = Math.round(totalUncontested * disposalRatio);
    const totalPossessions = playerStat.contestedPossessions + playerStat.uncontestPossessions;
    if (totalPossessions !== playerStat.disposals) {
      playerStat.uncontestPossessions = Math.max(0, playerStat.disposals - playerStat.contestedPossessions);
    }
  });
}
function distributeMarks(lineup, playerStats, totalMarks) {
  const markWeights = {};
  let totalMarkWeight = 0;
  lineup.players.forEach((player) => {
    const playerStat = playerStats[player.id];
    if (!playerStat)
      return;
    let markWeight = 1;
    if (player.position === "Forward")
      markWeight = 1.6;
    else if (player.position === "Defender")
      markWeight = 1.4;
    else if (player.position === "Ruck")
      markWeight = 1.5;
    else if (player.position === "Midfielder")
      markWeight = 0.8;
    markWeight *= player.attributes.marking / 75;
    markWeights[player.id] = markWeight;
    totalMarkWeight += markWeight;
  });
  let remainingMarks = totalMarks;
  let contestedMarksTotal = Math.round(totalMarks * 0.3);
  let remainingContested = contestedMarksTotal;
  lineup.players.forEach((player, index) => {
    const playerStat = playerStats[player.id];
    if (!playerStat)
      return;
    if (index === lineup.players.length - 1) {
      playerStat.marks = remainingMarks;
      playerStat.contestedMarks = remainingContested;
    } else {
      const playerMarks = Math.round(markWeights[player.id] / totalMarkWeight * totalMarks);
      playerStat.marks = playerMarks;
      remainingMarks -= playerMarks;
      let contestedRatio = 0.3;
      if (player.position === "Forward" || player.position === "Defender" || player.position === "Ruck") {
        contestedRatio = 0.4;
      }
      const playerContested = Math.round(playerMarks * contestedRatio);
      playerStat.contestedMarks = playerContested;
      remainingContested -= playerContested;
    }
  });
}
function distributeSpecialStats(lineup, playerStats, statType, totalStats) {
  const weights = {};
  let totalWeight = 0;
  lineup.players.forEach((player) => {
    const playerStat = playerStats[player.id];
    if (!playerStat)
      return;
    let weight = 1;
    if (statType === "tackles") {
      if (player.position === "Midfielder")
        weight = 2;
      else if (player.position === "Forward")
        weight = 1.2;
      else if (player.position === "Defender")
        weight = 1.1;
      else if (player.position === "Ruck")
        weight = 0.7;
      weight *= player.attributes.tackling / 75;
    } else if (statType === "inside50s") {
      if (player.position === "Midfielder")
        weight = 2;
      else if (player.position === "Forward")
        weight = 1.5;
      else if (player.position === "Defender")
        weight = 0.5;
      else if (player.position === "Ruck")
        weight = 0.8;
      weight *= player.attributes.kicking / 75;
    } else if (statType === "clearances") {
      if (player.position === "Midfielder")
        weight = 2.5;
      else if (player.position === "Ruck")
        weight = 1.8;
      else if (player.position === "Forward")
        weight = 0.4;
      else if (player.position === "Defender")
        weight = 0.3;
    } else if (statType === "rebound50s") {
      if (player.position === "Defender")
        weight = 2.5;
      else if (player.position === "Midfielder")
        weight = 1.2;
      else if (player.position === "Forward")
        weight = 0.3;
      else if (player.position === "Ruck")
        weight = 0.5;
    }
    weights[player.id] = weight;
    totalWeight += weight;
  });
  let remainingStats = totalStats;
  lineup.players.forEach((player, index) => {
    const playerStat = playerStats[player.id];
    if (!playerStat)
      return;
    if (index === lineup.players.length - 1) {
      if (statType === "tackles")
        playerStat.tackles = remainingStats;
      else if (statType === "inside50s")
        playerStat.inside50s = remainingStats;
      else if (statType === "clearances")
        playerStat.clearances = remainingStats;
      else if (statType === "rebound50s")
        playerStat.rebound50s = remainingStats;
    } else {
      const playerStats2 = Math.round(weights[player.id] / totalWeight * totalStats);
      if (statType === "tackles")
        playerStat.tackles = playerStats2;
      else if (statType === "inside50s")
        playerStat.inside50s = playerStats2;
      else if (statType === "clearances")
        playerStat.clearances = playerStats2;
      else if (statType === "rebound50s")
        playerStat.rebound50s = playerStats2;
      remainingStats -= playerStats2;
    }
  });
}
function distributeRuckStats(homeLineup, homePlayerStats, awayLineup, awayPlayerStats, homeStrength, awayStrength) {
  const homeRucks = homeLineup.players.filter((p4) => p4.position === "Ruck");
  const awayRucks = awayLineup.players.filter((p4) => p4.position === "Ruck");
  if (homeRucks.length === 0) {
    homeRucks.push(homeLineup.players.reduce(
      (tallest, player) => (player.attributes.strength || 70) > (tallest.attributes.strength || 70) ? player : tallest
    ));
  }
  if (awayRucks.length === 0) {
    awayRucks.push(awayLineup.players.reduce(
      (tallest, player) => (player.attributes.strength || 70) > (tallest.attributes.strength || 70) ? player : tallest
    ));
  }
  const totalHitouts = 70;
  const homeRuckStrength = homeRucks.reduce(
    (total, ruck) => total + (ruck.attributes.tapwork || 75) + (ruck.attributes.strength || 75),
    0
  ) / (homeRucks.length * 2);
  const awayRuckStrength = awayRucks.reduce(
    (total, ruck) => total + (ruck.attributes.tapwork || 75) + (ruck.attributes.strength || 75),
    0
  ) / (awayRucks.length * 2);
  const homeHitoutPercentage = homeRuckStrength / (homeRuckStrength + awayRuckStrength);
  const homeHitouts = Math.round(totalHitouts * homeHitoutPercentage);
  const awayHitouts = totalHitouts - homeHitouts;
  let remainingHomeHitouts = homeHitouts;
  homeRucks.forEach((ruck, index) => {
    const playerStat = homePlayerStats[ruck.id];
    if (!playerStat)
      return;
    if (index === homeRucks.length - 1) {
      playerStat.hitouts = remainingHomeHitouts;
    } else {
      const ruckRating = ((ruck.attributes.tapwork || 75) + (ruck.attributes.strength || 75)) / 2;
      const hitoutShare = Math.round(homeHitouts * (ruckRating / homeRuckStrength));
      playerStat.hitouts = hitoutShare;
      remainingHomeHitouts -= hitoutShare;
    }
  });
  let remainingAwayHitouts = awayHitouts;
  awayRucks.forEach((ruck, index) => {
    const playerStat = awayPlayerStats[ruck.id];
    if (!playerStat)
      return;
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
function calculateMetersGained(lineup, playerStats) {
  lineup.players.forEach((player) => {
    const playerStat = playerStats[player.id];
    if (!playerStat)
      return;
    const baseMeters = playerStat.kicks * 20 + playerStat.handballs * 5;
    let positionMod = 1;
    if (player.position === "Midfielder")
      positionMod = 1.2;
    else if (player.position === "Forward")
      positionMod = 0.9;
    else if (player.position === "Defender")
      positionMod = 1.1;
    const attributeMod = (player.attributes.speed + player.attributes.kicking) / 150;
    playerStat.meterGained = Math.round(baseMeters * positionMod * attributeMod);
  });
}
function createMatchSummary(homeLineup, awayLineup, homePlayerStats, awayPlayerStats, homeScore, awayScore) {
  const homeTeamSummary = {
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
  const awayTeamSummary = {
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
  Object.values(homePlayerStats).forEach((player) => {
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
  Object.values(awayPlayerStats).forEach((player) => {
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
  homeTeamSummary.goalEfficiency = homeTeamSummary.inside50s > 0 ? homeScore.goals / homeTeamSummary.inside50s * 100 : 0;
  awayTeamSummary.goalEfficiency = awayTeamSummary.inside50s > 0 ? awayScore.goals / awayTeamSummary.inside50s * 100 : 0;
  const homeBestPlayers = Object.keys(homePlayerStats).sort((a, b) => homePlayerStats[b].matchRating - homePlayerStats[a].matchRating).slice(0, 3);
  const awayBestPlayers = Object.keys(awayPlayerStats).sort((a, b) => awayPlayerStats[b].matchRating - awayPlayerStats[a].matchRating).slice(0, 3);
  const homeTopScorers = Object.keys(homePlayerStats).sort((a, b) => homePlayerStats[b].goals - homePlayerStats[a].goals).slice(0, 3);
  const awayTopScorers = Object.keys(awayPlayerStats).sort((a, b) => awayPlayerStats[b].goals - awayPlayerStats[a].goals).slice(0, 3);
  return {
    home: homeTeamSummary,
    away: awayTeamSummary,
    quarterByQuarter: {
      home: [0, 0, 0, 0],
      // Will be populated with actual quarter scores later
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
function calculatePlayerRatings(lineup, playerStats, teamStrength, oppositionStrength) {
  lineup.players.forEach((player) => {
    const playerStat = playerStats[player.id];
    if (!playerStat)
      return;
    let rating = 5;
    let disposalValue = 0.04;
    if (player.position === "Midfielder")
      disposalValue = 0.03;
    else if (player.position === "Defender" || player.position === "Forward")
      disposalValue = 0.04;
    else if (player.position === "Ruck")
      disposalValue = 0.05;
    rating += playerStat.disposals * disposalValue;
    rating += playerStat.marks * 0.1;
    rating += playerStat.contestedMarks * 0.2;
    rating += playerStat.tackles * 0.1;
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
    const oppositionFactor = 1 + (oppositionStrength.overall - 70) * 5e-3;
    rating *= oppositionFactor;
    playerStat.matchRating = Math.max(1, Math.min(10, rating));
  });
}
function generatePlayerStats(homeLineup, awayLineup, homeStrength, awayStrength, events, homeScore, awayScore, quarterScores) {
  const disposals = {};
  const marks = {};
  const tackles = {};
  const goals = {};
  const behinds = {};
  const homePlayerStats = {};
  const awayPlayerStats = {};
  [...homeLineup.players, ...awayLineup.players].forEach((player) => {
    disposals[player.id] = 0;
    marks[player.id] = 0;
    tackles[player.id] = 0;
    goals[player.id] = 0;
    behinds[player.id] = 0;
    const playerStats = {
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
      matchRating: 5
      // starting rating
    };
    if (player.teamId === homeLineup.teamId) {
      homePlayerStats[player.id] = playerStats;
    } else {
      awayPlayerStats[player.id] = playerStats;
    }
  });
  events.forEach((event) => {
    if (event.type === "goal" && event.playerId) {
      goals[event.playerId] = (goals[event.playerId] || 0) + 1;
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
  const totalDisposals = AVERAGE_DISPOSALS_PER_MATCH * 2;
  const homeMidfieldRatio = homeStrength.midfield / (homeStrength.midfield + awayStrength.midfield);
  const homeDisposals = Math.round(totalDisposals * homeMidfieldRatio);
  const awayDisposals = totalDisposals - homeDisposals;
  const homeKicks = Math.round(homeDisposals * 0.6);
  const homeHandballs = homeDisposals - homeKicks;
  const awayKicks = Math.round(awayDisposals * 0.6);
  const awayHandballs = awayDisposals - awayKicks;
  distributeDisposals(homeLineup, homePlayerStats, homeKicks, homeHandballs);
  distributeDisposals(awayLineup, awayPlayerStats, awayKicks, awayHandballs);
  distributeContestedStats(homeLineup, homePlayerStats, homeStrength);
  distributeContestedStats(awayLineup, awayPlayerStats, awayStrength);
  const totalMarks = AVERAGE_MARKS_PER_MATCH * 2;
  const homeMarkRatio = (homeStrength.attack * 0.4 + homeStrength.midfield * 0.3 + homeStrength.defense * 0.3) / ((homeStrength.attack + awayStrength.attack) * 0.4 + (homeStrength.midfield + awayStrength.midfield) * 0.3 + (homeStrength.defense + awayStrength.defense) * 0.3);
  const homeMarks = Math.round(totalMarks * homeMarkRatio);
  const awayMarks = totalMarks - homeMarks;
  distributeMarks(homeLineup, homePlayerStats, homeMarks);
  distributeMarks(awayLineup, awayPlayerStats, awayMarks);
  const totalTackles = AVERAGE_TACKLES_PER_MATCH * 2;
  const homeTackleRatio = (homeStrength.defense * 0.5 + homeStrength.midfield * 0.5) / ((homeStrength.defense + awayStrength.defense) * 0.5 + (homeStrength.midfield + awayStrength.midfield) * 0.5);
  const homeTackles = Math.round(totalTackles * homeTackleRatio);
  const awayTackles = totalTackles - homeTackles;
  distributeSpecialStats(homeLineup, homePlayerStats, "tackles", homeTackles);
  distributeSpecialStats(awayLineup, awayPlayerStats, "tackles", awayTackles);
  const totalInside50s = AVERAGE_INSIDE_50S_PER_MATCH * 2;
  const homeInside50Ratio = (homeStrength.midfield * 0.7 + homeStrength.attack * 0.3) / ((homeStrength.midfield + awayStrength.midfield) * 0.7 + (homeStrength.attack + awayStrength.attack) * 0.3);
  const homeInside50s = Math.round(totalInside50s * homeInside50Ratio);
  const awayInside50s = totalInside50s - homeInside50s;
  distributeSpecialStats(homeLineup, homePlayerStats, "inside50s", homeInside50s);
  distributeSpecialStats(awayLineup, awayPlayerStats, "inside50s", awayInside50s);
  const totalClearances = AVERAGE_CLEARANCES_PER_MATCH * 2;
  const homeClearanceRatio = homeStrength.midfield / (homeStrength.midfield + awayStrength.midfield);
  const homeClearances = Math.round(totalClearances * homeClearanceRatio);
  const awayClearances = totalClearances - homeClearances;
  distributeSpecialStats(homeLineup, homePlayerStats, "clearances", homeClearances);
  distributeSpecialStats(awayLineup, awayPlayerStats, "clearances", awayClearances);
  distributeRuckStats(homeLineup, homePlayerStats, awayLineup, awayPlayerStats, homeStrength, awayStrength);
  calculateMetersGained(homeLineup, homePlayerStats);
  calculateMetersGained(awayLineup, awayPlayerStats);
  calculatePlayerRatings(homeLineup, homePlayerStats, homeStrength, awayStrength);
  calculatePlayerRatings(awayLineup, awayPlayerStats, awayStrength, homeStrength);
  const matchSummary = createMatchSummary(
    homeLineup,
    awayLineup,
    homePlayerStats,
    awayPlayerStats,
    homeScore,
    awayScore
  );
  matchSummary.quarterByQuarter.home = quarterScores.home;
  matchSummary.quarterByQuarter.away = quarterScores.away;
  const matchStats = {
    disposals,
    marks,
    tackles,
    goals,
    behinds
  };
  return { matchStats, homePlayerStats, awayPlayerStats, matchSummary };
}
function simulateMatch(match, homeTeam, awayTeam, homePlayers, awayPlayers) {
  const homeLineup = {
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
  const awayLineup = {
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
  homePlayers.forEach((player) => {
    let role = "";
    let instructions = [];
    switch (player.position) {
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
  awayPlayers.forEach((player) => {
    let role = "";
    let instructions = [];
    switch (player.position) {
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
  const homeStrength = calculateTeamStrength(homeTeam, homeLineup, awayTeam);
  const awayStrength = calculateTeamStrength(awayTeam, awayLineup, homeTeam);
  const { events, homeScore, awayScore, quarterScores } = generateMatchEvents(
    homeTeam,
    awayTeam,
    homeLineup,
    awayLineup,
    homeStrength,
    awayStrength
  );
  const { matchStats, homePlayerStats, awayPlayerStats, matchSummary } = generatePlayerStats(
    homeLineup,
    awayLineup,
    homeStrength,
    awayStrength,
    events,
    homeScore,
    awayScore,
    quarterScores
  );
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

// app/components/AFLManager/MatchCenter.tsx
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\components\\\\AFLManager\\\\MatchCenter.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\components\\AFLManager\\MatchCenter.tsx"
  );
  import.meta.hot.lastModified = "1747552157162.0967";
}
function MatchCenter({
  gameState,
  allPlayers
}) {
  _s();
  const [selectedMatch, setSelectedMatch] = (0, import_react.useState)(null);
  const [matchSimulation, setMatchSimulation] = (0, import_react.useState)({
    inProgress: false,
    currentEvent: 0
  });
  const userTeam = teams.find((team) => team.id === gameState.userTeamId);
  if (!userTeam) {
    return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p, { children: "Error: Team not found" }, void 0, false, {
      fileName: "app/components/AFLManager/MatchCenter.tsx",
      lineNumber: 40,
      columnNumber: 12
    }, this);
  }
  const currentRoundMatches = gameState.seasonFixtures.filter((match) => match.round === gameState.currentRound);
  const userTeamMatch = currentRoundMatches.find((match) => match.homeTeamId === gameState.userTeamId || match.awayTeamId === gameState.userTeamId);
  const formatMatchDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-AU", {
      weekday: "short",
      day: "numeric",
      month: "short"
    });
  };
  const getTeamById = (teamId) => {
    return teams.find((team) => team.id === teamId);
  };
  const handleMatchSelect = (match) => {
    setSelectedMatch(match);
    setMatchSimulation({
      inProgress: false,
      currentEvent: 0
    });
  };
  const handleSimulateMatch = () => {
    if (!selectedMatch)
      return;
    const homeTeam = getTeamById(selectedMatch.homeTeamId);
    const awayTeam = getTeamById(selectedMatch.awayTeamId);
    if (!homeTeam || !awayTeam)
      return;
    const homePlayers = allPlayers.filter((player) => player.teamId === homeTeam.id);
    const awayPlayers = allPlayers.filter((player) => player.teamId === awayTeam.id);
    const homeLineup = {
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
    const awayLineup = {
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
    homePlayers.forEach((player) => {
      let role = "";
      let instructions = [];
      switch (player.position) {
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
        default:
          role = "General";
          instructions = ["Follow team structure"];
      }
      homeLineup.playerRoles[player.id] = {
        role,
        instructions
      };
    });
    awayPlayers.forEach((player) => {
      let role = "";
      let instructions = [];
      switch (player.position) {
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
        default:
          role = "General";
          instructions = ["Follow team structure"];
      }
      awayLineup.playerRoles[player.id] = {
        role,
        instructions
      };
    });
    const result = simulateMatch(selectedMatch, homeTeam, awayTeam, homeLineup.players, awayLineup.players);
    setMatchSimulation({
      inProgress: true,
      currentEvent: 0,
      result: {
        homeScore: result.homeScore,
        awayScore: result.awayScore,
        events: result.events
      }
    });
    const eventInterval = setInterval(() => {
      setMatchSimulation((prev) => {
        if (!prev.result || prev.currentEvent >= prev.result.events.length - 1) {
          clearInterval(eventInterval);
          return {
            ...prev,
            inProgress: false,
            currentEvent: prev.result ? prev.result.events.length - 1 : 0
          };
        }
        return {
          ...prev,
          currentEvent: prev.currentEvent + 1
        };
      });
    }, 1500);
  };
  const renderMatchList = () => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(o2, { variant: "surface", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(r, { size: "4", mb: "3", children: [
      "Round ",
      gameState.currentRound,
      " Fixtures"
    ] }, void 0, true, {
      fileName: "app/components/AFLManager/MatchCenter.tsx",
      lineNumber: 239,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p3, { direction: "column", gap: "3", children: currentRoundMatches.map((match) => {
      const homeTeam = getTeamById(match.homeTeamId);
      const awayTeam = getTeamById(match.awayTeamId);
      if (!homeTeam || !awayTeam)
        return null;
      const isUserTeamMatch = match.homeTeamId === gameState.userTeamId || match.awayTeamId === gameState.userTeamId;
      return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(o2, { variant: selectedMatch?.id === match.id ? "classic" : "surface", size: "1", style: {
        cursor: "pointer"
      }, onClick: () => handleMatchSelect(match), children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p3, { justify: "between", align: "center", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p2, { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p3, { gap: "2", align: "center", children: [
            isUserTeamMatch && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(e, { size: "1", color: "blue", children: "Your Match" }, void 0, false, {
              fileName: "app/components/AFLManager/MatchCenter.tsx",
              lineNumber: 253,
              columnNumber: 41
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p, { size: "2", color: "gray", children: formatMatchDate(match.date) }, void 0, false, {
              fileName: "app/components/AFLManager/MatchCenter.tsx",
              lineNumber: 254,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/MatchCenter.tsx",
            lineNumber: 252,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p3, { gap: "2", align: "center", mt: "1", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p, { size: "3", weight: "bold", children: homeTeam.name }, void 0, false, {
              fileName: "app/components/AFLManager/MatchCenter.tsx",
              lineNumber: 258,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p, { size: "3", children: "vs" }, void 0, false, {
              fileName: "app/components/AFLManager/MatchCenter.tsx",
              lineNumber: 259,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p, { size: "3", weight: "bold", children: awayTeam.name }, void 0, false, {
              fileName: "app/components/AFLManager/MatchCenter.tsx",
              lineNumber: 260,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/MatchCenter.tsx",
            lineNumber: 257,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p, { size: "2", children: match.venue }, void 0, false, {
            fileName: "app/components/AFLManager/MatchCenter.tsx",
            lineNumber: 263,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/MatchCenter.tsx",
          lineNumber: 251,
          columnNumber: 17
        }, this),
        match.completed ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p2, { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p, { weight: "bold", children: [
            match.result?.homeScore.goals,
            ".",
            match.result?.homeScore.behinds,
            " (",
            match.result?.homeScore.total,
            ") - ",
            match.result?.awayScore.goals,
            ".",
            match.result?.awayScore.behinds,
            " (",
            match.result?.awayScore.total,
            ")"
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/MatchCenter.tsx",
            lineNumber: 267,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p, { size: "2", color: "gray", children: "Final" }, void 0, false, {
            fileName: "app/components/AFLManager/MatchCenter.tsx",
            lineNumber: 270,
            columnNumber: 21
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/MatchCenter.tsx",
          lineNumber: 266,
          columnNumber: 36
        }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(o, { size: "1", variant: "solid", onClick: (e2) => {
          e2.stopPropagation();
          handleMatchSelect(match);
        }, children: "View" }, void 0, false, {
          fileName: "app/components/AFLManager/MatchCenter.tsx",
          lineNumber: 271,
          columnNumber: 28
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/AFLManager/MatchCenter.tsx",
        lineNumber: 250,
        columnNumber: 15
      }, this) }, match.id, false, {
        fileName: "app/components/AFLManager/MatchCenter.tsx",
        lineNumber: 247,
        columnNumber: 16
      }, this);
    }) }, void 0, false, {
      fileName: "app/components/AFLManager/MatchCenter.tsx",
      lineNumber: 241,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/AFLManager/MatchCenter.tsx",
    lineNumber: 238,
    columnNumber: 33
  }, this);
  const renderMatchDetails = () => {
    if (!selectedMatch)
      return null;
    const homeTeam = getTeamById(selectedMatch.homeTeamId);
    const awayTeam = getTeamById(selectedMatch.awayTeamId);
    if (!homeTeam || !awayTeam)
      return null;
    const isUserTeamMatch = selectedMatch.homeTeamId === gameState.userTeamId || selectedMatch.awayTeamId === gameState.userTeamId;
    const isUserTeamHome = selectedMatch.homeTeamId === gameState.userTeamId;
    return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(o2, { variant: "surface", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(r, { size: "4", mb: "3", children: "Match Details" }, void 0, false, {
        fileName: "app/components/AFLManager/MatchCenter.tsx",
        lineNumber: 292,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p3, { justify: "between", align: "center", mb: "3", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p2, { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p, { size: "2", color: "gray", children: formatMatchDate(selectedMatch.date) }, void 0, false, {
            fileName: "app/components/AFLManager/MatchCenter.tsx",
            lineNumber: 296,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p, { size: "2", children: selectedMatch.venue }, void 0, false, {
            fileName: "app/components/AFLManager/MatchCenter.tsx",
            lineNumber: 297,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/MatchCenter.tsx",
          lineNumber: 295,
          columnNumber: 11
        }, this),
        isUserTeamMatch && !selectedMatch.completed && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(o, { variant: "solid", onClick: handleSimulateMatch, disabled: matchSimulation.inProgress, children: matchSimulation.inProgress ? "Simulating..." : "Simulate Match" }, void 0, false, {
          fileName: "app/components/AFLManager/MatchCenter.tsx",
          lineNumber: 300,
          columnNumber: 59
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/AFLManager/MatchCenter.tsx",
        lineNumber: 294,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(o2, { variant: "classic", mb: "4", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p3, { justify: "between", align: "center", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p3, { direction: "column", align: "center", style: {
          flex: 1
        }, children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p2, { style: {
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            backgroundColor: homeTeam.colors.primary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
            marginBottom: "8px"
          }, children: homeTeam.name.substring(0, 3).toUpperCase() }, void 0, false, {
            fileName: "app/components/AFLManager/MatchCenter.tsx",
            lineNumber: 310,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p, { weight: "bold", children: homeTeam.name }, void 0, false, {
            fileName: "app/components/AFLManager/MatchCenter.tsx",
            lineNumber: 324,
            columnNumber: 15
          }, this),
          isUserTeamHome && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(e, { size: "1", children: "Your Team" }, void 0, false, {
            fileName: "app/components/AFLManager/MatchCenter.tsx",
            lineNumber: 325,
            columnNumber: 34
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/MatchCenter.tsx",
          lineNumber: 307,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p2, { style: {
          flex: 1,
          textAlign: "center"
        }, children: selectedMatch.completed || matchSimulation.result ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p3, { direction: "column", align: "center", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p, { size: "8", weight: "bold", children: [
            matchSimulation.result?.homeScore.goals || selectedMatch.result?.homeScore.goals || 0,
            ".",
            matchSimulation.result?.homeScore.behinds || selectedMatch.result?.homeScore.behinds || 0
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/MatchCenter.tsx",
            lineNumber: 333,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p, { size: "3", children: [
            "(",
            matchSimulation.result?.homeScore.total || selectedMatch.result?.homeScore.total || 0,
            ")"
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/MatchCenter.tsx",
            lineNumber: 337,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/MatchCenter.tsx",
          lineNumber: 332,
          columnNumber: 68
        }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p, { size: "8", weight: "bold", children: "-" }, void 0, false, {
          fileName: "app/components/AFLManager/MatchCenter.tsx",
          lineNumber: 340,
          columnNumber: 27
        }, this) }, void 0, false, {
          fileName: "app/components/AFLManager/MatchCenter.tsx",
          lineNumber: 328,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p, { size: "6", weight: "bold", children: "vs" }, void 0, false, {
          fileName: "app/components/AFLManager/MatchCenter.tsx",
          lineNumber: 343,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p2, { style: {
          flex: 1,
          textAlign: "center"
        }, children: selectedMatch.completed || matchSimulation.result ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p3, { direction: "column", align: "center", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p, { size: "8", weight: "bold", children: [
            matchSimulation.result?.awayScore.goals || selectedMatch.result?.awayScore.goals || 0,
            ".",
            matchSimulation.result?.awayScore.behinds || selectedMatch.result?.awayScore.behinds || 0
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/MatchCenter.tsx",
            lineNumber: 350,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p, { size: "3", children: [
            "(",
            matchSimulation.result?.awayScore.total || selectedMatch.result?.awayScore.total || 0,
            ")"
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/MatchCenter.tsx",
            lineNumber: 354,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/MatchCenter.tsx",
          lineNumber: 349,
          columnNumber: 68
        }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p, { size: "8", weight: "bold", children: "-" }, void 0, false, {
          fileName: "app/components/AFLManager/MatchCenter.tsx",
          lineNumber: 357,
          columnNumber: 27
        }, this) }, void 0, false, {
          fileName: "app/components/AFLManager/MatchCenter.tsx",
          lineNumber: 345,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p3, { direction: "column", align: "center", style: {
          flex: 1
        }, children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p2, { style: {
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            backgroundColor: awayTeam.colors.primary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
            marginBottom: "8px"
          }, children: awayTeam.name.substring(0, 3).toUpperCase() }, void 0, false, {
            fileName: "app/components/AFLManager/MatchCenter.tsx",
            lineNumber: 363,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p, { weight: "bold", children: awayTeam.name }, void 0, false, {
            fileName: "app/components/AFLManager/MatchCenter.tsx",
            lineNumber: 377,
            columnNumber: 15
          }, this),
          !isUserTeamHome && isUserTeamMatch && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(e, { size: "1", children: "Your Team" }, void 0, false, {
            fileName: "app/components/AFLManager/MatchCenter.tsx",
            lineNumber: 378,
            columnNumber: 54
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/MatchCenter.tsx",
          lineNumber: 360,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/AFLManager/MatchCenter.tsx",
        lineNumber: 306,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "app/components/AFLManager/MatchCenter.tsx",
        lineNumber: 305,
        columnNumber: 9
      }, this),
      matchSimulation.result && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p2, { children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(r, { size: "3", mb: "2", children: "Match Events" }, void 0, false, {
          fileName: "app/components/AFLManager/MatchCenter.tsx",
          lineNumber: 385,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(o2, { variant: "surface", style: {
          maxHeight: "300px",
          overflow: "auto"
        }, children: matchSimulation.result.events.slice(0, matchSimulation.currentEvent + 1).map((event, index) => {
          const minutes = Math.floor(event.timestamp / 60);
          const seconds = event.timestamp % 60;
          const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
          const quarter = event.quarter || Math.floor(event.timestamp / (30 * 60)) + 1;
          let eventColor = "gray";
          if (event.type === "goal") {
            eventColor = event.teamId === gameState.userTeamId ? "blue" : "gray";
          } else if (event.type === "behind") {
            eventColor = event.teamId === gameState.userTeamId ? "blue" : "gray";
          } else if (event.type === "quarter") {
            eventColor = "orange";
          } else if (event.type === "final") {
            eventColor = "green";
          }
          return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p3, { gap: "3", align: "start", p: "2", style: {
            borderBottom: index < matchSimulation.result.events.length - 1 ? "1px solid #eee" : "none"
          }, children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p2, { children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p, { size: "1", color: "gray", children: [
                "Q",
                quarter
              ] }, void 0, true, {
                fileName: "app/components/AFLManager/MatchCenter.tsx",
                lineNumber: 415,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p, { size: "2", weight: "bold", children: formattedTime }, void 0, false, {
                fileName: "app/components/AFLManager/MatchCenter.tsx",
                lineNumber: 416,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "app/components/AFLManager/MatchCenter.tsx",
              lineNumber: 414,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p2, { style: {
              flex: 1
            }, children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p, { color: eventColor, children: event.message }, void 0, false, {
              fileName: "app/components/AFLManager/MatchCenter.tsx",
              lineNumber: 422,
              columnNumber: 23
            }, this) }, void 0, false, {
              fileName: "app/components/AFLManager/MatchCenter.tsx",
              lineNumber: 419,
              columnNumber: 21
            }, this)
          ] }, index, true, {
            fileName: "app/components/AFLManager/MatchCenter.tsx",
            lineNumber: 411,
            columnNumber: 20
          }, this);
        }) }, void 0, false, {
          fileName: "app/components/AFLManager/MatchCenter.tsx",
          lineNumber: 387,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/AFLManager/MatchCenter.tsx",
        lineNumber: 384,
        columnNumber: 36
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/AFLManager/MatchCenter.tsx",
      lineNumber: 291,
      columnNumber: 12
    }, this);
  };
  const renderLadder = () => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(o2, { variant: "surface", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(r, { size: "4", mb: "3", children: "Ladder" }, void 0, false, {
      fileName: "app/components/AFLManager/MatchCenter.tsx",
      lineNumber: 433,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(table_exports.Root, { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(table_exports.Header, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(table_exports.Row, { children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(table_exports.ColumnHeaderCell, { children: "Pos" }, void 0, false, {
          fileName: "app/components/AFLManager/MatchCenter.tsx",
          lineNumber: 438,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(table_exports.ColumnHeaderCell, { children: "Team" }, void 0, false, {
          fileName: "app/components/AFLManager/MatchCenter.tsx",
          lineNumber: 439,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(table_exports.ColumnHeaderCell, { children: "P" }, void 0, false, {
          fileName: "app/components/AFLManager/MatchCenter.tsx",
          lineNumber: 440,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(table_exports.ColumnHeaderCell, { children: "W" }, void 0, false, {
          fileName: "app/components/AFLManager/MatchCenter.tsx",
          lineNumber: 441,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(table_exports.ColumnHeaderCell, { children: "L" }, void 0, false, {
          fileName: "app/components/AFLManager/MatchCenter.tsx",
          lineNumber: 442,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(table_exports.ColumnHeaderCell, { children: "D" }, void 0, false, {
          fileName: "app/components/AFLManager/MatchCenter.tsx",
          lineNumber: 443,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(table_exports.ColumnHeaderCell, { children: "%" }, void 0, false, {
          fileName: "app/components/AFLManager/MatchCenter.tsx",
          lineNumber: 444,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(table_exports.ColumnHeaderCell, { children: "Pts" }, void 0, false, {
          fileName: "app/components/AFLManager/MatchCenter.tsx",
          lineNumber: 445,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/AFLManager/MatchCenter.tsx",
        lineNumber: 437,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "app/components/AFLManager/MatchCenter.tsx",
        lineNumber: 436,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(table_exports.Body, { children: gameState.ladder.sort((a, b) => {
        if (b.points !== a.points)
          return b.points - a.points;
        return b.percentage - a.percentage;
      }).map((position, index) => {
        const team = getTeamById(position.teamId);
        if (!team)
          return null;
        return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(table_exports.Row, { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(table_exports.Cell, { children: index + 1 }, void 0, false, {
            fileName: "app/components/AFLManager/MatchCenter.tsx",
            lineNumber: 459,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(table_exports.Cell, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p3, { gap: "2", align: "center", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p2, { style: {
              width: "16px",
              height: "16px",
              borderRadius: "50%",
              backgroundColor: team.colors.primary
            } }, void 0, false, {
              fileName: "app/components/AFLManager/MatchCenter.tsx",
              lineNumber: 462,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p, { weight: position.teamId === gameState.userTeamId ? "bold" : "regular", children: team.name }, void 0, false, {
              fileName: "app/components/AFLManager/MatchCenter.tsx",
              lineNumber: 468,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/MatchCenter.tsx",
            lineNumber: 461,
            columnNumber: 19
          }, this) }, void 0, false, {
            fileName: "app/components/AFLManager/MatchCenter.tsx",
            lineNumber: 460,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(table_exports.Cell, { children: position.played }, void 0, false, {
            fileName: "app/components/AFLManager/MatchCenter.tsx",
            lineNumber: 473,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(table_exports.Cell, { children: position.wins }, void 0, false, {
            fileName: "app/components/AFLManager/MatchCenter.tsx",
            lineNumber: 474,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(table_exports.Cell, { children: position.losses }, void 0, false, {
            fileName: "app/components/AFLManager/MatchCenter.tsx",
            lineNumber: 475,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(table_exports.Cell, { children: position.draws }, void 0, false, {
            fileName: "app/components/AFLManager/MatchCenter.tsx",
            lineNumber: 476,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(table_exports.Cell, { children: position.percentage.toFixed(1) }, void 0, false, {
            fileName: "app/components/AFLManager/MatchCenter.tsx",
            lineNumber: 477,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(table_exports.Cell, { style: {
            fontWeight: "bold"
          }, children: position.points }, void 0, false, {
            fileName: "app/components/AFLManager/MatchCenter.tsx",
            lineNumber: 478,
            columnNumber: 17
          }, this)
        ] }, position.teamId, true, {
          fileName: "app/components/AFLManager/MatchCenter.tsx",
          lineNumber: 458,
          columnNumber: 18
        }, this);
      }) }, void 0, false, {
        fileName: "app/components/AFLManager/MatchCenter.tsx",
        lineNumber: 449,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/AFLManager/MatchCenter.tsx",
      lineNumber: 435,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/AFLManager/MatchCenter.tsx",
    lineNumber: 432,
    columnNumber: 30
  }, this);
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p2, { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(r, { size: "6", mb: "4", children: "Match Center" }, void 0, false, {
      fileName: "app/components/AFLManager/MatchCenter.tsx",
      lineNumber: 487,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(tabs_exports.Root, { defaultValue: "fixtures", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(tabs_exports.List, { children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(tabs_exports.Trigger, { value: "fixtures", children: "Fixtures" }, void 0, false, {
          fileName: "app/components/AFLManager/MatchCenter.tsx",
          lineNumber: 491,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(tabs_exports.Trigger, { value: "ladder", children: "Ladder" }, void 0, false, {
          fileName: "app/components/AFLManager/MatchCenter.tsx",
          lineNumber: 492,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(tabs_exports.Trigger, { value: "results", children: "Results" }, void 0, false, {
          fileName: "app/components/AFLManager/MatchCenter.tsx",
          lineNumber: 493,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/AFLManager/MatchCenter.tsx",
        lineNumber: 490,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p2, { pt: "4", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(tabs_exports.Content, { value: "fixtures", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(o3, { columns: {
          initial: "1",
          md: selectedMatch ? "2" : "1"
        }, gap: "4", children: [
          renderMatchList(),
          selectedMatch && renderMatchDetails()
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/MatchCenter.tsx",
          lineNumber: 498,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "app/components/AFLManager/MatchCenter.tsx",
          lineNumber: 497,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(tabs_exports.Content, { value: "ladder", children: renderLadder() }, void 0, false, {
          fileName: "app/components/AFLManager/MatchCenter.tsx",
          lineNumber: 507,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(tabs_exports.Content, { value: "results", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(o2, { variant: "surface", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(r, { size: "4", mb: "3", children: "Recent Results" }, void 0, false, {
            fileName: "app/components/AFLManager/MatchCenter.tsx",
            lineNumber: 513,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p3, { direction: "column", gap: "3", children: gameState.seasonFixtures.filter((match) => match.completed).sort((a, b) => b.round - a.round).slice(0, 10).map((match) => {
            const homeTeam = getTeamById(match.homeTeamId);
            const awayTeam = getTeamById(match.awayTeamId);
            if (!homeTeam || !awayTeam || !match.result)
              return null;
            const homeWon = match.result.homeScore.total > match.result.awayScore.total;
            const draw = match.result.homeScore.total === match.result.awayScore.total;
            return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(o2, { variant: "surface", size: "1", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p3, { justify: "between", align: "center", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p2, { children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(e, { size: "1", children: [
                  "Round ",
                  match.round
                ] }, void 0, true, {
                  fileName: "app/components/AFLManager/MatchCenter.tsx",
                  lineNumber: 525,
                  columnNumber: 29
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p, { size: "2", color: "gray", children: formatMatchDate(match.date) }, void 0, false, {
                  fileName: "app/components/AFLManager/MatchCenter.tsx",
                  lineNumber: 526,
                  columnNumber: 29
                }, this)
              ] }, void 0, true, {
                fileName: "app/components/AFLManager/MatchCenter.tsx",
                lineNumber: 524,
                columnNumber: 27
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p3, { gap: "3", align: "center", children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p3, { direction: "column", align: "end", children: [
                  /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p, { weight: homeWon ? "bold" : "regular", color: homeWon ? void 0 : "gray", children: homeTeam.name }, void 0, false, {
                    fileName: "app/components/AFLManager/MatchCenter.tsx",
                    lineNumber: 531,
                    columnNumber: 31
                  }, this),
                  /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p, { weight: !homeWon && !draw ? "bold" : "regular", color: !homeWon && !draw ? void 0 : "gray", children: awayTeam.name }, void 0, false, {
                    fileName: "app/components/AFLManager/MatchCenter.tsx",
                    lineNumber: 534,
                    columnNumber: 31
                  }, this)
                ] }, void 0, true, {
                  fileName: "app/components/AFLManager/MatchCenter.tsx",
                  lineNumber: 530,
                  columnNumber: 29
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p3, { direction: "column", align: "end", children: [
                  /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p, { weight: "bold", children: [
                    match.result.homeScore.goals,
                    ".",
                    match.result.homeScore.behinds,
                    " (",
                    match.result.homeScore.total,
                    ")"
                  ] }, void 0, true, {
                    fileName: "app/components/AFLManager/MatchCenter.tsx",
                    lineNumber: 540,
                    columnNumber: 31
                  }, this),
                  /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(p, { weight: "bold", children: [
                    match.result.awayScore.goals,
                    ".",
                    match.result.awayScore.behinds,
                    " (",
                    match.result.awayScore.total,
                    ")"
                  ] }, void 0, true, {
                    fileName: "app/components/AFLManager/MatchCenter.tsx",
                    lineNumber: 543,
                    columnNumber: 31
                  }, this)
                ] }, void 0, true, {
                  fileName: "app/components/AFLManager/MatchCenter.tsx",
                  lineNumber: 539,
                  columnNumber: 29
                }, this)
              ] }, void 0, true, {
                fileName: "app/components/AFLManager/MatchCenter.tsx",
                lineNumber: 529,
                columnNumber: 27
              }, this)
            ] }, void 0, true, {
              fileName: "app/components/AFLManager/MatchCenter.tsx",
              lineNumber: 523,
              columnNumber: 25
            }, this) }, match.id, false, {
              fileName: "app/components/AFLManager/MatchCenter.tsx",
              lineNumber: 522,
              columnNumber: 24
            }, this);
          }) }, void 0, false, {
            fileName: "app/components/AFLManager/MatchCenter.tsx",
            lineNumber: 515,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/MatchCenter.tsx",
          lineNumber: 512,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "app/components/AFLManager/MatchCenter.tsx",
          lineNumber: 511,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/AFLManager/MatchCenter.tsx",
        lineNumber: 496,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/AFLManager/MatchCenter.tsx",
      lineNumber: 489,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/AFLManager/MatchCenter.tsx",
    lineNumber: 486,
    columnNumber: 10
  }, this);
}
_s(MatchCenter, "s2ih6hLbat1E/2E3bIBsGizq/Ds=");
_c = MatchCenter;
var _c;
$RefreshReg$(_c, "MatchCenter");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

// app/components/AFLManager/League.tsx
var import_react2 = __toESM(require_react(), 1);
var import_jsx_dev_runtime2 = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\components\\\\AFLManager\\\\League.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s2 = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\components\\AFLManager\\League.tsx"
  );
  import.meta.hot.lastModified = "1747543677752.8933";
}
function League({
  gameState,
  allPlayers
}) {
  _s2();
  const [selectedTeamId, setSelectedTeamId] = (0, import_react2.useState)(null);
  const userTeam = teams.find((team) => team.id === gameState.userTeamId);
  if (!userTeam) {
    return /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p, { children: "Error: Team not found" }, void 0, false, {
      fileName: "app/components/AFLManager/League.tsx",
      lineNumber: 35,
      columnNumber: 12
    }, this);
  }
  const getTeamById = (teamId) => {
    return teams.find((team) => team.id === teamId);
  };
  const formatMatchDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-AU", {
      weekday: "short",
      day: "numeric",
      month: "short"
    });
  };
  const calculateTeamStats = () => {
    const teamStats2 = {};
    teams.forEach((team) => {
      teamStats2[team.id] = {
        played: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        pointsFor: 0,
        pointsAgainst: 0,
        percentage: 0,
        homeWins: 0,
        awayWins: 0,
        form: []
      };
    });
    const completedMatches = gameState.seasonFixtures.filter((match) => match.completed && match.result);
    completedMatches.forEach((match) => {
      if (!match.result)
        return;
      const homeTeamStats = teamStats2[match.homeTeamId];
      const awayTeamStats = teamStats2[match.awayTeamId];
      homeTeamStats.played++;
      awayTeamStats.played++;
      homeTeamStats.pointsFor += match.result.homeScore.total;
      homeTeamStats.pointsAgainst += match.result.awayScore.total;
      awayTeamStats.pointsFor += match.result.awayScore.total;
      awayTeamStats.pointsAgainst += match.result.homeScore.total;
      if (match.result.homeScore.total > match.result.awayScore.total) {
        homeTeamStats.wins++;
        homeTeamStats.homeWins++;
        awayTeamStats.losses++;
        if (homeTeamStats.form.length >= 5)
          homeTeamStats.form.pop();
        if (awayTeamStats.form.length >= 5)
          awayTeamStats.form.pop();
        homeTeamStats.form.unshift("W");
        awayTeamStats.form.unshift("L");
      } else if (match.result.homeScore.total < match.result.awayScore.total) {
        homeTeamStats.losses++;
        awayTeamStats.wins++;
        awayTeamStats.awayWins++;
        if (homeTeamStats.form.length >= 5)
          homeTeamStats.form.pop();
        if (awayTeamStats.form.length >= 5)
          awayTeamStats.form.pop();
        homeTeamStats.form.unshift("L");
        awayTeamStats.form.unshift("W");
      } else {
        homeTeamStats.draws++;
        awayTeamStats.draws++;
        if (homeTeamStats.form.length >= 5)
          homeTeamStats.form.pop();
        if (awayTeamStats.form.length >= 5)
          awayTeamStats.form.pop();
        homeTeamStats.form.unshift("D");
        awayTeamStats.form.unshift("D");
      }
      homeTeamStats.percentage = homeTeamStats.pointsAgainst === 0 ? 100 : homeTeamStats.pointsFor / homeTeamStats.pointsAgainst * 100;
      awayTeamStats.percentage = awayTeamStats.pointsAgainst === 0 ? 100 : awayTeamStats.pointsFor / awayTeamStats.pointsAgainst * 100;
    });
    return teamStats2;
  };
  const calculatePlayerStats = () => {
    const playerStats2 = {};
    allPlayers.forEach((player) => {
      playerStats2[player.id] = {
        disposals: 0,
        marks: 0,
        tackles: 0,
        goals: 0,
        behinds: 0,
        gamesPlayed: 0
      };
    });
    const completedMatches = gameState.seasonFixtures.filter((match) => match.completed && match.result);
    completedMatches.forEach((match) => {
      if (!match.result)
        return;
      const homeTeamPlayers = allPlayers.filter((p4) => p4.teamId === match.homeTeamId);
      const awayTeamPlayers = allPlayers.filter((p4) => p4.teamId === match.awayTeamId);
      [...homeTeamPlayers, ...awayTeamPlayers].forEach((player) => {
        if (playerStats2[player.id]) {
          playerStats2[player.id].gamesPlayed++;
        }
      });
      if (match.result.stats) {
        Object.entries(match.result.stats.disposals).forEach(([playerId, value]) => {
          if (playerStats2[playerId]) {
            playerStats2[playerId].disposals += value;
          }
        });
        Object.entries(match.result.stats.marks).forEach(([playerId, value]) => {
          if (playerStats2[playerId]) {
            playerStats2[playerId].marks += value;
          }
        });
        Object.entries(match.result.stats.tackles).forEach(([playerId, value]) => {
          if (playerStats2[playerId]) {
            playerStats2[playerId].tackles += value;
          }
        });
        Object.entries(match.result.stats.goals).forEach(([playerId, value]) => {
          if (playerStats2[playerId]) {
            playerStats2[playerId].goals += value;
          }
        });
        Object.entries(match.result.stats.behinds).forEach(([playerId, value]) => {
          if (playerStats2[playerId]) {
            playerStats2[playerId].behinds += value;
          }
        });
      }
    });
    return playerStats2;
  };
  const teamStats = calculateTeamStats();
  const playerStats = calculatePlayerStats();
  const renderLadder = () => /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(o2, { variant: "surface", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(r, { size: "4", mb: "3", children: "League Ladder" }, void 0, false, {
      fileName: "app/components/AFLManager/League.tsx",
      lineNumber: 202,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(table_exports.Root, { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(table_exports.Header, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(table_exports.Row, { children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(table_exports.ColumnHeaderCell, { children: "Pos" }, void 0, false, {
          fileName: "app/components/AFLManager/League.tsx",
          lineNumber: 207,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(table_exports.ColumnHeaderCell, { children: "Team" }, void 0, false, {
          fileName: "app/components/AFLManager/League.tsx",
          lineNumber: 208,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(table_exports.ColumnHeaderCell, { children: "P" }, void 0, false, {
          fileName: "app/components/AFLManager/League.tsx",
          lineNumber: 209,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(table_exports.ColumnHeaderCell, { children: "W" }, void 0, false, {
          fileName: "app/components/AFLManager/League.tsx",
          lineNumber: 210,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(table_exports.ColumnHeaderCell, { children: "L" }, void 0, false, {
          fileName: "app/components/AFLManager/League.tsx",
          lineNumber: 211,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(table_exports.ColumnHeaderCell, { children: "D" }, void 0, false, {
          fileName: "app/components/AFLManager/League.tsx",
          lineNumber: 212,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(table_exports.ColumnHeaderCell, { children: "%" }, void 0, false, {
          fileName: "app/components/AFLManager/League.tsx",
          lineNumber: 213,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(table_exports.ColumnHeaderCell, { children: "Pts" }, void 0, false, {
          fileName: "app/components/AFLManager/League.tsx",
          lineNumber: 214,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(table_exports.ColumnHeaderCell, { children: "Form" }, void 0, false, {
          fileName: "app/components/AFLManager/League.tsx",
          lineNumber: 215,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/AFLManager/League.tsx",
        lineNumber: 206,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "app/components/AFLManager/League.tsx",
        lineNumber: 205,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(table_exports.Body, { children: gameState.ladder.sort((a, b) => {
        if (b.points !== a.points)
          return b.points - a.points;
        return b.percentage - a.percentage;
      }).map((position, index) => {
        const team = getTeamById(position.teamId);
        if (!team)
          return null;
        return /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(table_exports.Row, { style: {
          cursor: "pointer",
          backgroundColor: selectedTeamId === position.teamId ? "rgba(59, 130, 246, 0.1)" : void 0
        }, onClick: () => setSelectedTeamId(position.teamId), children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(table_exports.Cell, { children: index + 1 }, void 0, false, {
            fileName: "app/components/AFLManager/League.tsx",
            lineNumber: 232,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(table_exports.Cell, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p3, { gap: "2", align: "center", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p2, { style: {
              width: "16px",
              height: "16px",
              borderRadius: "50%",
              backgroundColor: team.colors.primary
            } }, void 0, false, {
              fileName: "app/components/AFLManager/League.tsx",
              lineNumber: 235,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p, { weight: position.teamId === gameState.userTeamId ? "bold" : "regular", children: team.name }, void 0, false, {
              fileName: "app/components/AFLManager/League.tsx",
              lineNumber: 241,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/League.tsx",
            lineNumber: 234,
            columnNumber: 19
          }, this) }, void 0, false, {
            fileName: "app/components/AFLManager/League.tsx",
            lineNumber: 233,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(table_exports.Cell, { children: position.played }, void 0, false, {
            fileName: "app/components/AFLManager/League.tsx",
            lineNumber: 246,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(table_exports.Cell, { children: position.wins }, void 0, false, {
            fileName: "app/components/AFLManager/League.tsx",
            lineNumber: 247,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(table_exports.Cell, { children: position.losses }, void 0, false, {
            fileName: "app/components/AFLManager/League.tsx",
            lineNumber: 248,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(table_exports.Cell, { children: position.draws }, void 0, false, {
            fileName: "app/components/AFLManager/League.tsx",
            lineNumber: 249,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(table_exports.Cell, { children: position.percentage.toFixed(1) }, void 0, false, {
            fileName: "app/components/AFLManager/League.tsx",
            lineNumber: 250,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(table_exports.Cell, { weight: "bold", children: position.points }, void 0, false, {
            fileName: "app/components/AFLManager/League.tsx",
            lineNumber: 251,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(table_exports.Cell, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p3, { gap: "1", children: teamStats[position.teamId]?.form.map((result, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p2, { style: {
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            backgroundColor: result === "W" ? "#22c55e" : result === "L" ? "#ef4444" : "#f59e0b",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "12px",
            fontWeight: "bold"
          }, children: result }, i, false, {
            fileName: "app/components/AFLManager/League.tsx",
            lineNumber: 254,
            columnNumber: 74
          }, this)) }, void 0, false, {
            fileName: "app/components/AFLManager/League.tsx",
            lineNumber: 253,
            columnNumber: 19
          }, this) }, void 0, false, {
            fileName: "app/components/AFLManager/League.tsx",
            lineNumber: 252,
            columnNumber: 17
          }, this)
        ] }, position.teamId, true, {
          fileName: "app/components/AFLManager/League.tsx",
          lineNumber: 228,
          columnNumber: 18
        }, this);
      }) }, void 0, false, {
        fileName: "app/components/AFLManager/League.tsx",
        lineNumber: 219,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/AFLManager/League.tsx",
      lineNumber: 204,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/AFLManager/League.tsx",
    lineNumber: 201,
    columnNumber: 30
  }, this);
  const renderTeamDetails = () => {
    if (!selectedTeamId)
      return null;
    const team = getTeamById(selectedTeamId);
    if (!team)
      return null;
    const teamPlayers = allPlayers.filter((player) => player.teamId === selectedTeamId);
    const upcomingMatches = gameState.seasonFixtures.filter((match) => !match.completed && (match.homeTeamId === selectedTeamId || match.awayTeamId === selectedTeamId)).slice(0, 5);
    const recentResults = gameState.seasonFixtures.filter((match) => match.completed && match.result && (match.homeTeamId === selectedTeamId || match.awayTeamId === selectedTeamId)).sort((a, b) => b.round - a.round).slice(0, 5);
    return /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(o2, { variant: "surface", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p3, { justify: "between", align: "center", mb: "3", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(r, { size: "4", children: team.name }, void 0, false, {
          fileName: "app/components/AFLManager/League.tsx",
          lineNumber: 290,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p2, { style: {
          width: "30px",
          height: "30px",
          borderRadius: "50%",
          backgroundColor: team.colors.primary
        } }, void 0, false, {
          fileName: "app/components/AFLManager/League.tsx",
          lineNumber: 291,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/AFLManager/League.tsx",
        lineNumber: 289,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(o4, { size: "4", my: "3" }, void 0, false, {
        fileName: "app/components/AFLManager/League.tsx",
        lineNumber: 299,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(o3, { columns: {
        initial: "1",
        md: "2"
      }, gap: "4", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(o2, { variant: "surface", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(r, { size: "3", mb: "2", children: "Team Attributes" }, void 0, false, {
            fileName: "app/components/AFLManager/League.tsx",
            lineNumber: 307,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(o3, { columns: "1", gap: "3", width: "auto", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p2, { children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p, { size: "2", children: "Attack" }, void 0, false, {
                fileName: "app/components/AFLManager/League.tsx",
                lineNumber: 311,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p3, { align: "center", gap: "2", children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p2, { style: {
                  width: `${team.attributes.attack}%`,
                  height: "8px",
                  backgroundColor: "#22c55e",
                  borderRadius: "4px"
                } }, void 0, false, {
                  fileName: "app/components/AFLManager/League.tsx",
                  lineNumber: 313,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p, { size: "1", children: team.attributes.attack }, void 0, false, {
                  fileName: "app/components/AFLManager/League.tsx",
                  lineNumber: 319,
                  columnNumber: 19
                }, this)
              ] }, void 0, true, {
                fileName: "app/components/AFLManager/League.tsx",
                lineNumber: 312,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "app/components/AFLManager/League.tsx",
              lineNumber: 310,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p2, { children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p, { size: "2", children: "Midfield" }, void 0, false, {
                fileName: "app/components/AFLManager/League.tsx",
                lineNumber: 324,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p3, { align: "center", gap: "2", children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p2, { style: {
                  width: `${team.attributes.midfield}%`,
                  height: "8px",
                  backgroundColor: "#3b82f6",
                  borderRadius: "4px"
                } }, void 0, false, {
                  fileName: "app/components/AFLManager/League.tsx",
                  lineNumber: 326,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p, { size: "1", children: team.attributes.midfield }, void 0, false, {
                  fileName: "app/components/AFLManager/League.tsx",
                  lineNumber: 332,
                  columnNumber: 19
                }, this)
              ] }, void 0, true, {
                fileName: "app/components/AFLManager/League.tsx",
                lineNumber: 325,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "app/components/AFLManager/League.tsx",
              lineNumber: 323,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p2, { children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p, { size: "2", children: "Defense" }, void 0, false, {
                fileName: "app/components/AFLManager/League.tsx",
                lineNumber: 337,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p3, { align: "center", gap: "2", children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p2, { style: {
                  width: `${team.attributes.defense}%`,
                  height: "8px",
                  backgroundColor: "#f59e0b",
                  borderRadius: "4px"
                } }, void 0, false, {
                  fileName: "app/components/AFLManager/League.tsx",
                  lineNumber: 339,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p, { size: "1", children: team.attributes.defense }, void 0, false, {
                  fileName: "app/components/AFLManager/League.tsx",
                  lineNumber: 345,
                  columnNumber: 19
                }, this)
              ] }, void 0, true, {
                fileName: "app/components/AFLManager/League.tsx",
                lineNumber: 338,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "app/components/AFLManager/League.tsx",
              lineNumber: 336,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p2, { children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p, { size: "2", children: "Coaching" }, void 0, false, {
                fileName: "app/components/AFLManager/League.tsx",
                lineNumber: 350,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p3, { align: "center", gap: "2", children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p2, { style: {
                  width: `${team.attributes.coaching}%`,
                  height: "8px",
                  backgroundColor: "#8b5cf6",
                  borderRadius: "4px"
                } }, void 0, false, {
                  fileName: "app/components/AFLManager/League.tsx",
                  lineNumber: 352,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p, { size: "1", children: team.attributes.coaching }, void 0, false, {
                  fileName: "app/components/AFLManager/League.tsx",
                  lineNumber: 358,
                  columnNumber: 19
                }, this)
              ] }, void 0, true, {
                fileName: "app/components/AFLManager/League.tsx",
                lineNumber: 351,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "app/components/AFLManager/League.tsx",
              lineNumber: 349,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/League.tsx",
            lineNumber: 309,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p2, { mt: "3", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p, { size: "2", weight: "bold", children: "Home Ground" }, void 0, false, {
              fileName: "app/components/AFLManager/League.tsx",
              lineNumber: 364,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p, { children: team.homeGround }, void 0, false, {
              fileName: "app/components/AFLManager/League.tsx",
              lineNumber: 365,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/League.tsx",
            lineNumber: 363,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/League.tsx",
          lineNumber: 306,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(o2, { variant: "surface", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(r, { size: "3", mb: "2", children: "Team Statistics" }, void 0, false, {
            fileName: "app/components/AFLManager/League.tsx",
            lineNumber: 371,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(o3, { columns: "2", gap: "3", width: "auto", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p2, { children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p, { size: "2", weight: "bold", children: "Home Record" }, void 0, false, {
                fileName: "app/components/AFLManager/League.tsx",
                lineNumber: 375,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p, { children: [
                teamStats[selectedTeamId]?.homeWins || 0,
                "W - ",
                (teamStats[selectedTeamId]?.played || 0) - (teamStats[selectedTeamId]?.homeWins || 0) - (teamStats[selectedTeamId]?.awayWins || 0),
                "L"
              ] }, void 0, true, {
                fileName: "app/components/AFLManager/League.tsx",
                lineNumber: 376,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "app/components/AFLManager/League.tsx",
              lineNumber: 374,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p2, { children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p, { size: "2", weight: "bold", children: "Away Record" }, void 0, false, {
                fileName: "app/components/AFLManager/League.tsx",
                lineNumber: 380,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p, { children: [
                teamStats[selectedTeamId]?.awayWins || 0,
                "W - ",
                (teamStats[selectedTeamId]?.played || 0) - (teamStats[selectedTeamId]?.homeWins || 0) - (teamStats[selectedTeamId]?.awayWins || 0),
                "L"
              ] }, void 0, true, {
                fileName: "app/components/AFLManager/League.tsx",
                lineNumber: 381,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "app/components/AFLManager/League.tsx",
              lineNumber: 379,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p2, { children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p, { size: "2", weight: "bold", children: "Points For" }, void 0, false, {
                fileName: "app/components/AFLManager/League.tsx",
                lineNumber: 385,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p, { children: teamStats[selectedTeamId]?.pointsFor || 0 }, void 0, false, {
                fileName: "app/components/AFLManager/League.tsx",
                lineNumber: 386,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "app/components/AFLManager/League.tsx",
              lineNumber: 384,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p2, { children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p, { size: "2", weight: "bold", children: "Points Against" }, void 0, false, {
                fileName: "app/components/AFLManager/League.tsx",
                lineNumber: 390,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p, { children: teamStats[selectedTeamId]?.pointsAgainst || 0 }, void 0, false, {
                fileName: "app/components/AFLManager/League.tsx",
                lineNumber: 391,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "app/components/AFLManager/League.tsx",
              lineNumber: 389,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p2, { children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p, { size: "2", weight: "bold", children: "Percentage" }, void 0, false, {
                fileName: "app/components/AFLManager/League.tsx",
                lineNumber: 395,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p, { children: [
                teamStats[selectedTeamId]?.percentage.toFixed(1) || 0,
                "%"
              ] }, void 0, true, {
                fileName: "app/components/AFLManager/League.tsx",
                lineNumber: 396,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "app/components/AFLManager/League.tsx",
              lineNumber: 394,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p2, { children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p, { size: "2", weight: "bold", children: "Form" }, void 0, false, {
                fileName: "app/components/AFLManager/League.tsx",
                lineNumber: 400,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p3, { gap: "1", children: teamStats[selectedTeamId]?.form.map((result, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p2, { style: {
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                backgroundColor: result === "W" ? "#22c55e" : result === "L" ? "#ef4444" : "#f59e0b",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "12px",
                fontWeight: "bold"
              }, children: result }, i, false, {
                fileName: "app/components/AFLManager/League.tsx",
                lineNumber: 402,
                columnNumber: 71
              }, this)) }, void 0, false, {
                fileName: "app/components/AFLManager/League.tsx",
                lineNumber: 401,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "app/components/AFLManager/League.tsx",
              lineNumber: 399,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/League.tsx",
            lineNumber: 373,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/League.tsx",
          lineNumber: 370,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(o2, { variant: "surface", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(r, { size: "3", mb: "2", children: "Upcoming Matches" }, void 0, false, {
            fileName: "app/components/AFLManager/League.tsx",
            lineNumber: 423,
            columnNumber: 13
          }, this),
          upcomingMatches.length > 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p3, { direction: "column", gap: "2", children: upcomingMatches.map((match) => {
            const opponent = getTeamById(match.homeTeamId === selectedTeamId ? match.awayTeamId : match.homeTeamId);
            if (!opponent)
              return null;
            const isHome = match.homeTeamId === selectedTeamId;
            return /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(o2, { variant: "surface", size: "1", children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p3, { justify: "between", align: "center", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p2, { children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(e, { size: "1", children: [
                  "Round ",
                  match.round
                ] }, void 0, true, {
                  fileName: "app/components/AFLManager/League.tsx",
                  lineNumber: 433,
                  columnNumber: 27
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p, { size: "2", color: "gray", children: formatMatchDate(match.date) }, void 0, false, {
                  fileName: "app/components/AFLManager/League.tsx",
                  lineNumber: 434,
                  columnNumber: 27
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p, { size: "2", weight: "bold", children: isHome ? `${team.name} vs ${opponent.name}` : `${opponent.name} vs ${team.name}` }, void 0, false, {
                  fileName: "app/components/AFLManager/League.tsx",
                  lineNumber: 435,
                  columnNumber: 27
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p, { size: "2", children: match.venue }, void 0, false, {
                  fileName: "app/components/AFLManager/League.tsx",
                  lineNumber: 438,
                  columnNumber: 27
                }, this)
              ] }, void 0, true, {
                fileName: "app/components/AFLManager/League.tsx",
                lineNumber: 432,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(e, { size: "1", color: isHome ? "blue" : "gray", children: isHome ? "Home" : "Away" }, void 0, false, {
                fileName: "app/components/AFLManager/League.tsx",
                lineNumber: 441,
                columnNumber: 25
              }, this)
            ] }, void 0, true, {
              fileName: "app/components/AFLManager/League.tsx",
              lineNumber: 431,
              columnNumber: 23
            }, this) }, match.id, false, {
              fileName: "app/components/AFLManager/League.tsx",
              lineNumber: 430,
              columnNumber: 22
            }, this);
          }) }, void 0, false, {
            fileName: "app/components/AFLManager/League.tsx",
            lineNumber: 425,
            columnNumber: 43
          }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p, { color: "gray", children: "No upcoming matches" }, void 0, false, {
            fileName: "app/components/AFLManager/League.tsx",
            lineNumber: 447,
            columnNumber: 25
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/League.tsx",
          lineNumber: 422,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(o2, { variant: "surface", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(r, { size: "3", mb: "2", children: "Recent Results" }, void 0, false, {
            fileName: "app/components/AFLManager/League.tsx",
            lineNumber: 452,
            columnNumber: 13
          }, this),
          recentResults.length > 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p3, { direction: "column", gap: "2", children: recentResults.map((match) => {
            if (!match.result)
              return null;
            const opponent = getTeamById(match.homeTeamId === selectedTeamId ? match.awayTeamId : match.homeTeamId);
            if (!opponent)
              return null;
            const isHome = match.homeTeamId === selectedTeamId;
            const teamScore = isHome ? match.result.homeScore : match.result.awayScore;
            const opponentScore = isHome ? match.result.awayScore : match.result.homeScore;
            const won = teamScore.total > opponentScore.total;
            const draw = teamScore.total === opponentScore.total;
            return /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(o2, { variant: "surface", size: "1", children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p3, { justify: "between", align: "center", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p2, { children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(e, { size: "1", children: [
                  "Round ",
                  match.round
                ] }, void 0, true, {
                  fileName: "app/components/AFLManager/League.tsx",
                  lineNumber: 467,
                  columnNumber: 27
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p, { size: "2", color: "gray", children: formatMatchDate(match.date) }, void 0, false, {
                  fileName: "app/components/AFLManager/League.tsx",
                  lineNumber: 468,
                  columnNumber: 27
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p, { size: "2", weight: "bold", children: isHome ? `${team.name} vs ${opponent.name}` : `${opponent.name} vs ${team.name}` }, void 0, false, {
                  fileName: "app/components/AFLManager/League.tsx",
                  lineNumber: 469,
                  columnNumber: 27
                }, this)
              ] }, void 0, true, {
                fileName: "app/components/AFLManager/League.tsx",
                lineNumber: 466,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p3, { direction: "column", align: "end", children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(e, { size: "1", color: won ? "green" : draw ? "orange" : "red", children: won ? "Win" : draw ? "Draw" : "Loss" }, void 0, false, {
                  fileName: "app/components/AFLManager/League.tsx",
                  lineNumber: 475,
                  columnNumber: 27
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p, { weight: "bold", mt: "1", children: [
                  teamScore.goals,
                  ".",
                  teamScore.behinds,
                  " (",
                  teamScore.total,
                  ") - ",
                  opponentScore.goals,
                  ".",
                  opponentScore.behinds,
                  " (",
                  opponentScore.total,
                  ")"
                ] }, void 0, true, {
                  fileName: "app/components/AFLManager/League.tsx",
                  lineNumber: 478,
                  columnNumber: 27
                }, this)
              ] }, void 0, true, {
                fileName: "app/components/AFLManager/League.tsx",
                lineNumber: 474,
                columnNumber: 25
              }, this)
            ] }, void 0, true, {
              fileName: "app/components/AFLManager/League.tsx",
              lineNumber: 465,
              columnNumber: 23
            }, this) }, match.id, false, {
              fileName: "app/components/AFLManager/League.tsx",
              lineNumber: 464,
              columnNumber: 22
            }, this);
          }) }, void 0, false, {
            fileName: "app/components/AFLManager/League.tsx",
            lineNumber: 454,
            columnNumber: 41
          }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p, { color: "gray", children: "No recent results" }, void 0, false, {
            fileName: "app/components/AFLManager/League.tsx",
            lineNumber: 485,
            columnNumber: 25
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/League.tsx",
          lineNumber: 451,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(o2, { variant: "surface", style: {
          gridColumn: "1 / -1"
        }, children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(r, { size: "3", mb: "2", children: "Top Players" }, void 0, false, {
            fileName: "app/components/AFLManager/League.tsx",
            lineNumber: 492,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(table_exports.Root, { children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(table_exports.Header, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(table_exports.Row, { children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(table_exports.ColumnHeaderCell, { children: "Player" }, void 0, false, {
                fileName: "app/components/AFLManager/League.tsx",
                lineNumber: 497,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(table_exports.ColumnHeaderCell, { children: "Position" }, void 0, false, {
                fileName: "app/components/AFLManager/League.tsx",
                lineNumber: 498,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(table_exports.ColumnHeaderCell, { children: "Age" }, void 0, false, {
                fileName: "app/components/AFLManager/League.tsx",
                lineNumber: 499,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(table_exports.ColumnHeaderCell, { children: "Rating" }, void 0, false, {
                fileName: "app/components/AFLManager/League.tsx",
                lineNumber: 500,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(table_exports.ColumnHeaderCell, { children: "Games" }, void 0, false, {
                fileName: "app/components/AFLManager/League.tsx",
                lineNumber: 501,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(table_exports.ColumnHeaderCell, { children: "Disposals" }, void 0, false, {
                fileName: "app/components/AFLManager/League.tsx",
                lineNumber: 502,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(table_exports.ColumnHeaderCell, { children: "Goals" }, void 0, false, {
                fileName: "app/components/AFLManager/League.tsx",
                lineNumber: 503,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "app/components/AFLManager/League.tsx",
              lineNumber: 496,
              columnNumber: 17
            }, this) }, void 0, false, {
              fileName: "app/components/AFLManager/League.tsx",
              lineNumber: 495,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(table_exports.Body, { children: teamPlayers.sort((a, b) => {
              const aRating = (a.attributes.speed + a.attributes.strength + a.attributes.stamina + a.attributes.agility + a.attributes.intelligence + a.attributes.kicking + a.attributes.marking + a.attributes.handball + a.attributes.tackling) / 9;
              const bRating = (b.attributes.speed + b.attributes.strength + b.attributes.stamina + b.attributes.agility + b.attributes.intelligence + b.attributes.kicking + b.attributes.marking + b.attributes.handball + b.attributes.tackling) / 9;
              return bRating - aRating;
            }).slice(0, 10).map((player) => {
              const overallRating = Math.round((player.attributes.speed + player.attributes.strength + player.attributes.stamina + player.attributes.agility + player.attributes.intelligence + player.attributes.kicking + player.attributes.marking + player.attributes.handball + player.attributes.tackling) / 9);
              return /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(table_exports.Row, { children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(table_exports.Cell, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p, { weight: "bold", children: player.name }, void 0, false, {
                  fileName: "app/components/AFLManager/League.tsx",
                  lineNumber: 518,
                  columnNumber: 27
                }, this) }, void 0, false, {
                  fileName: "app/components/AFLManager/League.tsx",
                  lineNumber: 517,
                  columnNumber: 25
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(table_exports.Cell, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(e, { size: "1", children: player.position }, void 0, false, {
                  fileName: "app/components/AFLManager/League.tsx",
                  lineNumber: 521,
                  columnNumber: 27
                }, this) }, void 0, false, {
                  fileName: "app/components/AFLManager/League.tsx",
                  lineNumber: 520,
                  columnNumber: 25
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(table_exports.Cell, { children: player.age }, void 0, false, {
                  fileName: "app/components/AFLManager/League.tsx",
                  lineNumber: 523,
                  columnNumber: 25
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(table_exports.Cell, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p2, { style: {
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  backgroundColor: "#3b82f6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: "bold"
                }, children: overallRating }, void 0, false, {
                  fileName: "app/components/AFLManager/League.tsx",
                  lineNumber: 525,
                  columnNumber: 27
                }, this) }, void 0, false, {
                  fileName: "app/components/AFLManager/League.tsx",
                  lineNumber: 524,
                  columnNumber: 25
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(table_exports.Cell, { children: playerStats[player.id]?.gamesPlayed || 0 }, void 0, false, {
                  fileName: "app/components/AFLManager/League.tsx",
                  lineNumber: 539,
                  columnNumber: 25
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(table_exports.Cell, { children: playerStats[player.id]?.disposals || 0 }, void 0, false, {
                  fileName: "app/components/AFLManager/League.tsx",
                  lineNumber: 540,
                  columnNumber: 25
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(table_exports.Cell, { children: playerStats[player.id]?.goals || 0 }, void 0, false, {
                  fileName: "app/components/AFLManager/League.tsx",
                  lineNumber: 541,
                  columnNumber: 25
                }, this)
              ] }, player.id, true, {
                fileName: "app/components/AFLManager/League.tsx",
                lineNumber: 516,
                columnNumber: 24
              }, this);
            }) }, void 0, false, {
              fileName: "app/components/AFLManager/League.tsx",
              lineNumber: 507,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/League.tsx",
            lineNumber: 494,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/League.tsx",
          lineNumber: 489,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/AFLManager/League.tsx",
        lineNumber: 301,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/AFLManager/League.tsx",
      lineNumber: 288,
      columnNumber: 12
    }, this);
  };
  const renderLeagueStats = () => {
    const topGoalKickers = Object.entries(playerStats).map(([playerId, stats]) => {
      const player = allPlayers.find((p4) => p4.id === playerId);
      if (!player)
        return null;
      return {
        player,
        goals: stats.goals,
        behinds: stats.behinds,
        team: getTeamById(player.teamId)
      };
    }).filter(Boolean).sort((a, b) => b.goals - a.goals).slice(0, 10);
    const topDisposalGetters = Object.entries(playerStats).map(([playerId, stats]) => {
      const player = allPlayers.find((p4) => p4.id === playerId);
      if (!player)
        return null;
      return {
        player,
        disposals: stats.disposals,
        gamesPlayed: stats.gamesPlayed,
        average: stats.gamesPlayed > 0 ? stats.disposals / stats.gamesPlayed : 0,
        team: getTeamById(player.teamId)
      };
    }).filter(Boolean).sort((a, b) => b.average - a.average).slice(0, 10);
    return /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(o3, { columns: {
      initial: "1",
      md: "2"
    }, gap: "4", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(o2, { variant: "surface", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(r, { size: "4", mb: "3", children: "Top Goal Kickers" }, void 0, false, {
          fileName: "app/components/AFLManager/League.tsx",
          lineNumber: 583,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(table_exports.Root, { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(table_exports.Header, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(table_exports.Row, { children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(table_exports.ColumnHeaderCell, { children: "Player" }, void 0, false, {
              fileName: "app/components/AFLManager/League.tsx",
              lineNumber: 588,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(table_exports.ColumnHeaderCell, { children: "Team" }, void 0, false, {
              fileName: "app/components/AFLManager/League.tsx",
              lineNumber: 589,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(table_exports.ColumnHeaderCell, { children: "Goals" }, void 0, false, {
              fileName: "app/components/AFLManager/League.tsx",
              lineNumber: 590,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(table_exports.ColumnHeaderCell, { children: "Behinds" }, void 0, false, {
              fileName: "app/components/AFLManager/League.tsx",
              lineNumber: 591,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/League.tsx",
            lineNumber: 587,
            columnNumber: 15
          }, this) }, void 0, false, {
            fileName: "app/components/AFLManager/League.tsx",
            lineNumber: 586,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(table_exports.Body, { children: topGoalKickers.map((entry, index) => {
            if (!entry)
              return null;
            return /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(table_exports.Row, { children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(table_exports.Cell, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p, { weight: "bold", children: entry.player.name }, void 0, false, {
                fileName: "app/components/AFLManager/League.tsx",
                lineNumber: 600,
                columnNumber: 23
              }, this) }, void 0, false, {
                fileName: "app/components/AFLManager/League.tsx",
                lineNumber: 599,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(table_exports.Cell, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p3, { gap: "2", align: "center", children: [
                entry.team && /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p2, { style: {
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: entry.team.colors.primary
                } }, void 0, false, {
                  fileName: "app/components/AFLManager/League.tsx",
                  lineNumber: 604,
                  columnNumber: 40
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p, { children: entry.team?.name }, void 0, false, {
                  fileName: "app/components/AFLManager/League.tsx",
                  lineNumber: 610,
                  columnNumber: 25
                }, this)
              ] }, void 0, true, {
                fileName: "app/components/AFLManager/League.tsx",
                lineNumber: 603,
                columnNumber: 23
              }, this) }, void 0, false, {
                fileName: "app/components/AFLManager/League.tsx",
                lineNumber: 602,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(table_exports.Cell, { children: entry.goals }, void 0, false, {
                fileName: "app/components/AFLManager/League.tsx",
                lineNumber: 613,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(table_exports.Cell, { children: entry.behinds }, void 0, false, {
                fileName: "app/components/AFLManager/League.tsx",
                lineNumber: 614,
                columnNumber: 21
              }, this)
            ] }, entry.player.id, true, {
              fileName: "app/components/AFLManager/League.tsx",
              lineNumber: 598,
              columnNumber: 22
            }, this);
          }) }, void 0, false, {
            fileName: "app/components/AFLManager/League.tsx",
            lineNumber: 595,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/League.tsx",
          lineNumber: 585,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/AFLManager/League.tsx",
        lineNumber: 582,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(o2, { variant: "surface", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(r, { size: "4", mb: "3", children: "Top Disposal Getters" }, void 0, false, {
          fileName: "app/components/AFLManager/League.tsx",
          lineNumber: 623,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(table_exports.Root, { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(table_exports.Header, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(table_exports.Row, { children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(table_exports.ColumnHeaderCell, { children: "Player" }, void 0, false, {
              fileName: "app/components/AFLManager/League.tsx",
              lineNumber: 628,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(table_exports.ColumnHeaderCell, { children: "Team" }, void 0, false, {
              fileName: "app/components/AFLManager/League.tsx",
              lineNumber: 629,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(table_exports.ColumnHeaderCell, { children: "Avg" }, void 0, false, {
              fileName: "app/components/AFLManager/League.tsx",
              lineNumber: 630,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(table_exports.ColumnHeaderCell, { children: "Total" }, void 0, false, {
              fileName: "app/components/AFLManager/League.tsx",
              lineNumber: 631,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/League.tsx",
            lineNumber: 627,
            columnNumber: 15
          }, this) }, void 0, false, {
            fileName: "app/components/AFLManager/League.tsx",
            lineNumber: 626,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(table_exports.Body, { children: topDisposalGetters.map((entry, index) => {
            if (!entry)
              return null;
            return /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(table_exports.Row, { children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(table_exports.Cell, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p, { weight: "bold", children: entry.player.name }, void 0, false, {
                fileName: "app/components/AFLManager/League.tsx",
                lineNumber: 640,
                columnNumber: 23
              }, this) }, void 0, false, {
                fileName: "app/components/AFLManager/League.tsx",
                lineNumber: 639,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(table_exports.Cell, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p3, { gap: "2", align: "center", children: [
                entry.team && /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p2, { style: {
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: entry.team.colors.primary
                } }, void 0, false, {
                  fileName: "app/components/AFLManager/League.tsx",
                  lineNumber: 644,
                  columnNumber: 40
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p, { children: entry.team?.name }, void 0, false, {
                  fileName: "app/components/AFLManager/League.tsx",
                  lineNumber: 650,
                  columnNumber: 25
                }, this)
              ] }, void 0, true, {
                fileName: "app/components/AFLManager/League.tsx",
                lineNumber: 643,
                columnNumber: 23
              }, this) }, void 0, false, {
                fileName: "app/components/AFLManager/League.tsx",
                lineNumber: 642,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(table_exports.Cell, { children: entry.average.toFixed(1) }, void 0, false, {
                fileName: "app/components/AFLManager/League.tsx",
                lineNumber: 653,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(table_exports.Cell, { children: entry.disposals }, void 0, false, {
                fileName: "app/components/AFLManager/League.tsx",
                lineNumber: 654,
                columnNumber: 21
              }, this)
            ] }, entry.player.id, true, {
              fileName: "app/components/AFLManager/League.tsx",
              lineNumber: 638,
              columnNumber: 22
            }, this);
          }) }, void 0, false, {
            fileName: "app/components/AFLManager/League.tsx",
            lineNumber: 635,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/League.tsx",
          lineNumber: 625,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/AFLManager/League.tsx",
        lineNumber: 622,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/AFLManager/League.tsx",
      lineNumber: 577,
      columnNumber: 12
    }, this);
  };
  const renderSchedule = () => {
    const fixturesByRound = {};
    gameState.seasonFixtures.forEach((match) => {
      if (!fixturesByRound[match.round]) {
        fixturesByRound[match.round] = [];
      }
      fixturesByRound[match.round].push(match);
    });
    return /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(o2, { variant: "surface", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(r, { size: "4", mb: "3", children: "Season Schedule" }, void 0, false, {
        fileName: "app/components/AFLManager/League.tsx",
        lineNumber: 674,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(tabs_exports.Root, { defaultValue: "1", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(tabs_exports.List, { children: Object.keys(fixturesByRound).map((round) => /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(tabs_exports.Trigger, { value: round, children: [
          "Round ",
          round
        ] }, round, true, {
          fileName: "app/components/AFLManager/League.tsx",
          lineNumber: 678,
          columnNumber: 56
        }, this)) }, void 0, false, {
          fileName: "app/components/AFLManager/League.tsx",
          lineNumber: 677,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p2, { pt: "4", children: Object.entries(fixturesByRound).map(([round, matches]) => /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(tabs_exports.Content, { value: round, children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p3, { direction: "column", gap: "3", children: matches.map((match) => {
          const homeTeam = getTeamById(match.homeTeamId);
          const awayTeam = getTeamById(match.awayTeamId);
          if (!homeTeam || !awayTeam)
            return null;
          const isUserTeamMatch = match.homeTeamId === gameState.userTeamId || match.awayTeamId === gameState.userTeamId;
          return /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(o2, { variant: "surface", size: "1", children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p3, { justify: "between", align: "center", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p2, { children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p3, { gap: "2", align: "center", children: [
                isUserTeamMatch && /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(e, { size: "1", color: "blue", children: "Your Match" }, void 0, false, {
                  fileName: "app/components/AFLManager/League.tsx",
                  lineNumber: 695,
                  columnNumber: 51
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p, { size: "2", color: "gray", children: formatMatchDate(match.date) }, void 0, false, {
                  fileName: "app/components/AFLManager/League.tsx",
                  lineNumber: 696,
                  columnNumber: 31
                }, this)
              ] }, void 0, true, {
                fileName: "app/components/AFLManager/League.tsx",
                lineNumber: 694,
                columnNumber: 29
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p3, { gap: "2", align: "center", mt: "1", children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p, { size: "3", weight: match.homeTeamId === gameState.userTeamId ? "bold" : "regular", children: homeTeam.name }, void 0, false, {
                  fileName: "app/components/AFLManager/League.tsx",
                  lineNumber: 700,
                  columnNumber: 31
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p, { size: "3", children: "vs" }, void 0, false, {
                  fileName: "app/components/AFLManager/League.tsx",
                  lineNumber: 703,
                  columnNumber: 31
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p, { size: "3", weight: match.awayTeamId === gameState.userTeamId ? "bold" : "regular", children: awayTeam.name }, void 0, false, {
                  fileName: "app/components/AFLManager/League.tsx",
                  lineNumber: 704,
                  columnNumber: 31
                }, this)
              ] }, void 0, true, {
                fileName: "app/components/AFLManager/League.tsx",
                lineNumber: 699,
                columnNumber: 29
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p, { size: "2", children: match.venue }, void 0, false, {
                fileName: "app/components/AFLManager/League.tsx",
                lineNumber: 709,
                columnNumber: 29
              }, this)
            ] }, void 0, true, {
              fileName: "app/components/AFLManager/League.tsx",
              lineNumber: 693,
              columnNumber: 27
            }, this),
            match.completed && match.result ? /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p2, { children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p, { weight: "bold", children: [
                match.result.homeScore.goals,
                ".",
                match.result.homeScore.behinds,
                " (",
                match.result.homeScore.total,
                ") - ",
                match.result.awayScore.goals,
                ".",
                match.result.awayScore.behinds,
                " (",
                match.result.awayScore.total,
                ")"
              ] }, void 0, true, {
                fileName: "app/components/AFLManager/League.tsx",
                lineNumber: 713,
                columnNumber: 31
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p, { size: "2", color: "gray", children: "Final" }, void 0, false, {
                fileName: "app/components/AFLManager/League.tsx",
                lineNumber: 716,
                columnNumber: 31
              }, this)
            ] }, void 0, true, {
              fileName: "app/components/AFLManager/League.tsx",
              lineNumber: 712,
              columnNumber: 62
            }, this) : /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(e, { size: "1", color: "gray", children: "Upcoming" }, void 0, false, {
              fileName: "app/components/AFLManager/League.tsx",
              lineNumber: 717,
              columnNumber: 38
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/League.tsx",
            lineNumber: 692,
            columnNumber: 25
          }, this) }, match.id, false, {
            fileName: "app/components/AFLManager/League.tsx",
            lineNumber: 691,
            columnNumber: 24
          }, this);
        }) }, void 0, false, {
          fileName: "app/components/AFLManager/League.tsx",
          lineNumber: 685,
          columnNumber: 17
        }, this) }, round, false, {
          fileName: "app/components/AFLManager/League.tsx",
          lineNumber: 684,
          columnNumber: 72
        }, this)) }, void 0, false, {
          fileName: "app/components/AFLManager/League.tsx",
          lineNumber: 683,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/AFLManager/League.tsx",
        lineNumber: 676,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/AFLManager/League.tsx",
      lineNumber: 673,
      columnNumber: 12
    }, this);
  };
  return /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p2, { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(r, { size: "6", mb: "4", children: "League" }, void 0, false, {
      fileName: "app/components/AFLManager/League.tsx",
      lineNumber: 728,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(tabs_exports.Root, { defaultValue: "ladder", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(tabs_exports.List, { children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(tabs_exports.Trigger, { value: "ladder", children: "Ladder" }, void 0, false, {
          fileName: "app/components/AFLManager/League.tsx",
          lineNumber: 732,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(tabs_exports.Trigger, { value: "stats", children: "Statistics" }, void 0, false, {
          fileName: "app/components/AFLManager/League.tsx",
          lineNumber: 733,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(tabs_exports.Trigger, { value: "schedule", children: "Schedule" }, void 0, false, {
          fileName: "app/components/AFLManager/League.tsx",
          lineNumber: 734,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/AFLManager/League.tsx",
        lineNumber: 731,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(p2, { pt: "4", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(tabs_exports.Content, { value: "ladder", children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(o3, { columns: {
          initial: "1"
        }, gap: "4", children: [
          renderLadder(),
          selectedTeamId && renderTeamDetails()
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/League.tsx",
          lineNumber: 739,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "app/components/AFLManager/League.tsx",
          lineNumber: 738,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(tabs_exports.Content, { value: "stats", children: renderLeagueStats() }, void 0, false, {
          fileName: "app/components/AFLManager/League.tsx",
          lineNumber: 747,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(tabs_exports.Content, { value: "schedule", children: renderSchedule() }, void 0, false, {
          fileName: "app/components/AFLManager/League.tsx",
          lineNumber: 751,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/AFLManager/League.tsx",
        lineNumber: 737,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/AFLManager/League.tsx",
      lineNumber: 730,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/AFLManager/League.tsx",
    lineNumber: 727,
    columnNumber: 10
  }, this);
}
_s2(League, "gFAiMqZJjV7fVLzEzO6/1nrVKwA=");
_c2 = League;
var _c2;
$RefreshReg$(_c2, "League");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

// app/components/AFLManager/Players.tsx
var import_react3 = __toESM(require_react(), 1);
var import_jsx_dev_runtime3 = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\components\\\\AFLManager\\\\Players.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s3 = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\components\\AFLManager\\Players.tsx"
  );
  import.meta.hot.lastModified = "1747543677757.8333";
}
function Players({
  gameState,
  allPlayers
}) {
  _s3();
  const [selectedTeamId, setSelectedTeamId] = (0, import_react3.useState)("all");
  const [selectedPosition, setSelectedPosition] = (0, import_react3.useState)("all");
  const [sortBy, setSortBy] = (0, import_react3.useState)("rating");
  const [sortOrder, setSortOrder] = (0, import_react3.useState)("desc");
  const [searchQuery, setSearchQuery] = (0, import_react3.useState)("");
  const [selectedPlayer, setSelectedPlayer] = (0, import_react3.useState)(null);
  const userTeam = teams.find((team) => team.id === gameState.userTeamId);
  if (!userTeam) {
    return /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p, { children: "Error: Team not found" }, void 0, false, {
      fileName: "app/components/AFLManager/Players.tsx",
      lineNumber: 40,
      columnNumber: 12
    }, this);
  }
  const getTeamById = (teamId) => {
    return teams.find((team) => team.id === teamId);
  };
  const calculatePlayerStats = () => {
    const playerStats2 = {};
    allPlayers.forEach((player) => {
      playerStats2[player.id] = {
        disposals: 0,
        marks: 0,
        tackles: 0,
        goals: 0,
        behinds: 0,
        gamesPlayed: 0
      };
    });
    const completedMatches = gameState.seasonFixtures.filter((match) => match.completed && match.result);
    completedMatches.forEach((match) => {
      if (!match.result)
        return;
      const homeTeamPlayers = allPlayers.filter((p4) => p4.teamId === match.homeTeamId);
      const awayTeamPlayers = allPlayers.filter((p4) => p4.teamId === match.awayTeamId);
      [...homeTeamPlayers, ...awayTeamPlayers].forEach((player) => {
        if (playerStats2[player.id]) {
          playerStats2[player.id].gamesPlayed++;
        }
      });
      if (match.result.stats) {
        Object.entries(match.result.stats.disposals).forEach(([playerId, value]) => {
          if (playerStats2[playerId]) {
            playerStats2[playerId].disposals += value;
          }
        });
        Object.entries(match.result.stats.marks).forEach(([playerId, value]) => {
          if (playerStats2[playerId]) {
            playerStats2[playerId].marks += value;
          }
        });
        Object.entries(match.result.stats.tackles).forEach(([playerId, value]) => {
          if (playerStats2[playerId]) {
            playerStats2[playerId].tackles += value;
          }
        });
        Object.entries(match.result.stats.goals).forEach(([playerId, value]) => {
          if (playerStats2[playerId]) {
            playerStats2[playerId].goals += value;
          }
        });
        Object.entries(match.result.stats.behinds).forEach(([playerId, value]) => {
          if (playerStats2[playerId]) {
            playerStats2[playerId].behinds += value;
          }
        });
      }
    });
    return playerStats2;
  };
  const playerStats = calculatePlayerStats();
  const calculateOverallRating = (player) => {
    return Math.round((player.attributes.speed + player.attributes.strength + player.attributes.stamina + player.attributes.agility + player.attributes.intelligence + player.attributes.kicking + player.attributes.marking + player.attributes.handball + player.attributes.tackling) / 9);
  };
  const filteredPlayers = allPlayers.filter((player) => {
    if (selectedTeamId !== "all" && player.teamId !== selectedTeamId) {
      return false;
    }
    if (selectedPosition !== "all" && player.position !== selectedPosition) {
      return false;
    }
    if (searchQuery && !player.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });
  const sortedPlayers = [...filteredPlayers].sort((a, b) => {
    if (sortBy === "name") {
      return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    } else if (sortBy === "team") {
      const teamA = getTeamById(a.teamId);
      const teamB = getTeamById(b.teamId);
      if (!teamA || !teamB)
        return 0;
      return sortOrder === "asc" ? teamA.name.localeCompare(teamB.name) : teamB.name.localeCompare(teamA.name);
    } else if (sortBy === "position") {
      return sortOrder === "asc" ? a.position.localeCompare(b.position) : b.position.localeCompare(a.position);
    } else if (sortBy === "age") {
      return sortOrder === "asc" ? a.age - b.age : b.age - a.age;
    } else {
      const aRating = calculateOverallRating(a);
      const bRating = calculateOverallRating(b);
      return sortOrder === "asc" ? aRating - bRating : bRating - aRating;
    }
  });
  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(newSortBy);
      setSortOrder(newSortBy === "rating" ? "desc" : "asc");
    }
  };
  const renderPlayerDetails = () => {
    if (!selectedPlayer)
      return null;
    const team = getTeamById(selectedPlayer.teamId);
    if (!team)
      return null;
    const overallRating = calculateOverallRating(selectedPlayer);
    const stats = playerStats[selectedPlayer.id] || {
      disposals: 0,
      marks: 0,
      tackles: 0,
      goals: 0,
      behinds: 0,
      gamesPlayed: 0
    };
    return /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(o2, { variant: "surface", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p3, { justify: "between", align: "start", mb: "3", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p2, { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(r, { size: "4", children: selectedPlayer.name }, void 0, false, {
            fileName: "app/components/AFLManager/Players.tsx",
            lineNumber: 191,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p3, { gap: "2", align: "center", mt: "1", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(e, { size: "1", children: selectedPlayer.position }, void 0, false, {
              fileName: "app/components/AFLManager/Players.tsx",
              lineNumber: 193,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p, { size: "2", color: "gray", children: [
              "Age: ",
              selectedPlayer.age
            ] }, void 0, true, {
              fileName: "app/components/AFLManager/Players.tsx",
              lineNumber: 194,
              columnNumber: 15
            }, this),
            team && /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p3, { gap: "2", align: "center", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p2, { style: {
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: team.colors.primary
              } }, void 0, false, {
                fileName: "app/components/AFLManager/Players.tsx",
                lineNumber: 196,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p, { size: "2", children: team.name }, void 0, false, {
                fileName: "app/components/AFLManager/Players.tsx",
                lineNumber: 202,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "app/components/AFLManager/Players.tsx",
              lineNumber: 195,
              columnNumber: 24
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/Players.tsx",
            lineNumber: 192,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/Players.tsx",
          lineNumber: 190,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p2, { style: {
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          backgroundColor: "#3b82f6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: "bold",
          fontSize: "24px"
        }, children: overallRating }, void 0, false, {
          fileName: "app/components/AFLManager/Players.tsx",
          lineNumber: 207,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/AFLManager/Players.tsx",
        lineNumber: 189,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(o4, { size: "4", my: "3" }, void 0, false, {
        fileName: "app/components/AFLManager/Players.tsx",
        lineNumber: 223,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(o3, { columns: {
        initial: "1",
        md: "2"
      }, gap: "4", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(o2, { variant: "surface", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(r, { size: "3", mb: "3", children: "Attributes" }, void 0, false, {
            fileName: "app/components/AFLManager/Players.tsx",
            lineNumber: 231,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(o3, { columns: "1", gap: "3", width: "auto", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p2, { children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p, { size: "2", children: "Speed" }, void 0, false, {
                fileName: "app/components/AFLManager/Players.tsx",
                lineNumber: 235,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p3, { align: "center", gap: "2", children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p2, { style: {
                  width: `${selectedPlayer.attributes.speed}%`,
                  height: "8px",
                  backgroundColor: "#22c55e",
                  borderRadius: "4px"
                } }, void 0, false, {
                  fileName: "app/components/AFLManager/Players.tsx",
                  lineNumber: 237,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p, { size: "1", children: selectedPlayer.attributes.speed }, void 0, false, {
                  fileName: "app/components/AFLManager/Players.tsx",
                  lineNumber: 243,
                  columnNumber: 19
                }, this)
              ] }, void 0, true, {
                fileName: "app/components/AFLManager/Players.tsx",
                lineNumber: 236,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "app/components/AFLManager/Players.tsx",
              lineNumber: 234,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p2, { children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p, { size: "2", children: "Strength" }, void 0, false, {
                fileName: "app/components/AFLManager/Players.tsx",
                lineNumber: 248,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p3, { align: "center", gap: "2", children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p2, { style: {
                  width: `${selectedPlayer.attributes.strength}%`,
                  height: "8px",
                  backgroundColor: "#3b82f6",
                  borderRadius: "4px"
                } }, void 0, false, {
                  fileName: "app/components/AFLManager/Players.tsx",
                  lineNumber: 250,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p, { size: "1", children: selectedPlayer.attributes.strength }, void 0, false, {
                  fileName: "app/components/AFLManager/Players.tsx",
                  lineNumber: 256,
                  columnNumber: 19
                }, this)
              ] }, void 0, true, {
                fileName: "app/components/AFLManager/Players.tsx",
                lineNumber: 249,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "app/components/AFLManager/Players.tsx",
              lineNumber: 247,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p2, { children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p, { size: "2", children: "Stamina" }, void 0, false, {
                fileName: "app/components/AFLManager/Players.tsx",
                lineNumber: 261,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p3, { align: "center", gap: "2", children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p2, { style: {
                  width: `${selectedPlayer.attributes.stamina}%`,
                  height: "8px",
                  backgroundColor: "#f59e0b",
                  borderRadius: "4px"
                } }, void 0, false, {
                  fileName: "app/components/AFLManager/Players.tsx",
                  lineNumber: 263,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p, { size: "1", children: selectedPlayer.attributes.stamina }, void 0, false, {
                  fileName: "app/components/AFLManager/Players.tsx",
                  lineNumber: 269,
                  columnNumber: 19
                }, this)
              ] }, void 0, true, {
                fileName: "app/components/AFLManager/Players.tsx",
                lineNumber: 262,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "app/components/AFLManager/Players.tsx",
              lineNumber: 260,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p2, { children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p, { size: "2", children: "Agility" }, void 0, false, {
                fileName: "app/components/AFLManager/Players.tsx",
                lineNumber: 274,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p3, { align: "center", gap: "2", children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p2, { style: {
                  width: `${selectedPlayer.attributes.agility}%`,
                  height: "8px",
                  backgroundColor: "#8b5cf6",
                  borderRadius: "4px"
                } }, void 0, false, {
                  fileName: "app/components/AFLManager/Players.tsx",
                  lineNumber: 276,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p, { size: "1", children: selectedPlayer.attributes.agility }, void 0, false, {
                  fileName: "app/components/AFLManager/Players.tsx",
                  lineNumber: 282,
                  columnNumber: 19
                }, this)
              ] }, void 0, true, {
                fileName: "app/components/AFLManager/Players.tsx",
                lineNumber: 275,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "app/components/AFLManager/Players.tsx",
              lineNumber: 273,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p2, { children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p, { size: "2", children: "Intelligence" }, void 0, false, {
                fileName: "app/components/AFLManager/Players.tsx",
                lineNumber: 287,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p3, { align: "center", gap: "2", children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p2, { style: {
                  width: `${selectedPlayer.attributes.intelligence}%`,
                  height: "8px",
                  backgroundColor: "#ec4899",
                  borderRadius: "4px"
                } }, void 0, false, {
                  fileName: "app/components/AFLManager/Players.tsx",
                  lineNumber: 289,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p, { size: "1", children: selectedPlayer.attributes.intelligence }, void 0, false, {
                  fileName: "app/components/AFLManager/Players.tsx",
                  lineNumber: 295,
                  columnNumber: 19
                }, this)
              ] }, void 0, true, {
                fileName: "app/components/AFLManager/Players.tsx",
                lineNumber: 288,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "app/components/AFLManager/Players.tsx",
              lineNumber: 286,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/Players.tsx",
            lineNumber: 233,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/Players.tsx",
          lineNumber: 230,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(o2, { variant: "surface", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(r, { size: "3", mb: "3", children: "Skills" }, void 0, false, {
            fileName: "app/components/AFLManager/Players.tsx",
            lineNumber: 303,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(o3, { columns: "1", gap: "3", width: "auto", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p2, { children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p, { size: "2", children: "Kicking" }, void 0, false, {
                fileName: "app/components/AFLManager/Players.tsx",
                lineNumber: 307,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p3, { align: "center", gap: "2", children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p2, { style: {
                  width: `${selectedPlayer.attributes.kicking}%`,
                  height: "8px",
                  backgroundColor: "#22c55e",
                  borderRadius: "4px"
                } }, void 0, false, {
                  fileName: "app/components/AFLManager/Players.tsx",
                  lineNumber: 309,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p, { size: "1", children: selectedPlayer.attributes.kicking }, void 0, false, {
                  fileName: "app/components/AFLManager/Players.tsx",
                  lineNumber: 315,
                  columnNumber: 19
                }, this)
              ] }, void 0, true, {
                fileName: "app/components/AFLManager/Players.tsx",
                lineNumber: 308,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "app/components/AFLManager/Players.tsx",
              lineNumber: 306,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p2, { children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p, { size: "2", children: "Marking" }, void 0, false, {
                fileName: "app/components/AFLManager/Players.tsx",
                lineNumber: 320,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p3, { align: "center", gap: "2", children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p2, { style: {
                  width: `${selectedPlayer.attributes.marking}%`,
                  height: "8px",
                  backgroundColor: "#3b82f6",
                  borderRadius: "4px"
                } }, void 0, false, {
                  fileName: "app/components/AFLManager/Players.tsx",
                  lineNumber: 322,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p, { size: "1", children: selectedPlayer.attributes.marking }, void 0, false, {
                  fileName: "app/components/AFLManager/Players.tsx",
                  lineNumber: 328,
                  columnNumber: 19
                }, this)
              ] }, void 0, true, {
                fileName: "app/components/AFLManager/Players.tsx",
                lineNumber: 321,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "app/components/AFLManager/Players.tsx",
              lineNumber: 319,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p2, { children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p, { size: "2", children: "Handball" }, void 0, false, {
                fileName: "app/components/AFLManager/Players.tsx",
                lineNumber: 333,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p3, { align: "center", gap: "2", children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p2, { style: {
                  width: `${selectedPlayer.attributes.handball}%`,
                  height: "8px",
                  backgroundColor: "#f59e0b",
                  borderRadius: "4px"
                } }, void 0, false, {
                  fileName: "app/components/AFLManager/Players.tsx",
                  lineNumber: 335,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p, { size: "1", children: selectedPlayer.attributes.handball }, void 0, false, {
                  fileName: "app/components/AFLManager/Players.tsx",
                  lineNumber: 341,
                  columnNumber: 19
                }, this)
              ] }, void 0, true, {
                fileName: "app/components/AFLManager/Players.tsx",
                lineNumber: 334,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "app/components/AFLManager/Players.tsx",
              lineNumber: 332,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p2, { children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p, { size: "2", children: "Tackling" }, void 0, false, {
                fileName: "app/components/AFLManager/Players.tsx",
                lineNumber: 346,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p3, { align: "center", gap: "2", children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p2, { style: {
                  width: `${selectedPlayer.attributes.tackling}%`,
                  height: "8px",
                  backgroundColor: "#8b5cf6",
                  borderRadius: "4px"
                } }, void 0, false, {
                  fileName: "app/components/AFLManager/Players.tsx",
                  lineNumber: 348,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p, { size: "1", children: selectedPlayer.attributes.tackling }, void 0, false, {
                  fileName: "app/components/AFLManager/Players.tsx",
                  lineNumber: 354,
                  columnNumber: 19
                }, this)
              ] }, void 0, true, {
                fileName: "app/components/AFLManager/Players.tsx",
                lineNumber: 347,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "app/components/AFLManager/Players.tsx",
              lineNumber: 345,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/Players.tsx",
            lineNumber: 305,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/Players.tsx",
          lineNumber: 302,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(o2, { variant: "surface", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(r, { size: "3", mb: "3", children: "Status" }, void 0, false, {
            fileName: "app/components/AFLManager/Players.tsx",
            lineNumber: 362,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(o3, { columns: "2", gap: "3", width: "auto", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p2, { children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p, { size: "2", weight: "bold", children: "Form" }, void 0, false, {
                fileName: "app/components/AFLManager/Players.tsx",
                lineNumber: 366,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p3, { align: "center", gap: "2", children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p2, { style: {
                  width: `${selectedPlayer.form}%`,
                  height: "8px",
                  backgroundColor: selectedPlayer.form > 80 ? "#22c55e" : selectedPlayer.form > 60 ? "#f59e0b" : "#ef4444",
                  borderRadius: "4px"
                } }, void 0, false, {
                  fileName: "app/components/AFLManager/Players.tsx",
                  lineNumber: 368,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p, { size: "1", children: selectedPlayer.form }, void 0, false, {
                  fileName: "app/components/AFLManager/Players.tsx",
                  lineNumber: 374,
                  columnNumber: 19
                }, this)
              ] }, void 0, true, {
                fileName: "app/components/AFLManager/Players.tsx",
                lineNumber: 367,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "app/components/AFLManager/Players.tsx",
              lineNumber: 365,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p2, { children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p, { size: "2", weight: "bold", children: "Fitness" }, void 0, false, {
                fileName: "app/components/AFLManager/Players.tsx",
                lineNumber: 379,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p3, { align: "center", gap: "2", children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p2, { style: {
                  width: `${selectedPlayer.fitness}%`,
                  height: "8px",
                  backgroundColor: selectedPlayer.fitness > 80 ? "#22c55e" : selectedPlayer.fitness > 60 ? "#f59e0b" : "#ef4444",
                  borderRadius: "4px"
                } }, void 0, false, {
                  fileName: "app/components/AFLManager/Players.tsx",
                  lineNumber: 381,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p, { size: "1", children: selectedPlayer.fitness }, void 0, false, {
                  fileName: "app/components/AFLManager/Players.tsx",
                  lineNumber: 387,
                  columnNumber: 19
                }, this)
              ] }, void 0, true, {
                fileName: "app/components/AFLManager/Players.tsx",
                lineNumber: 380,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "app/components/AFLManager/Players.tsx",
              lineNumber: 378,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p2, { children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p, { size: "2", weight: "bold", children: "Contract" }, void 0, false, {
                fileName: "app/components/AFLManager/Players.tsx",
                lineNumber: 392,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p, { children: [
                selectedPlayer.contract.yearsRemaining,
                " years"
              ] }, void 0, true, {
                fileName: "app/components/AFLManager/Players.tsx",
                lineNumber: 393,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "app/components/AFLManager/Players.tsx",
              lineNumber: 391,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p2, { children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p, { size: "2", weight: "bold", children: "Salary" }, void 0, false, {
                fileName: "app/components/AFLManager/Players.tsx",
                lineNumber: 397,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p, { children: [
                "$",
                selectedPlayer.contract.salary,
                "k/yr"
              ] }, void 0, true, {
                fileName: "app/components/AFLManager/Players.tsx",
                lineNumber: 398,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "app/components/AFLManager/Players.tsx",
              lineNumber: 396,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/Players.tsx",
            lineNumber: 364,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/Players.tsx",
          lineNumber: 361,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(o2, { variant: "surface", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(r, { size: "3", mb: "3", children: "Season Statistics" }, void 0, false, {
            fileName: "app/components/AFLManager/Players.tsx",
            lineNumber: 405,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(o3, { columns: "2", gap: "3", width: "auto", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p2, { children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p, { size: "2", weight: "bold", children: "Games Played" }, void 0, false, {
                fileName: "app/components/AFLManager/Players.tsx",
                lineNumber: 409,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p, { children: stats.gamesPlayed }, void 0, false, {
                fileName: "app/components/AFLManager/Players.tsx",
                lineNumber: 410,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "app/components/AFLManager/Players.tsx",
              lineNumber: 408,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p2, { children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p, { size: "2", weight: "bold", children: "Disposals" }, void 0, false, {
                fileName: "app/components/AFLManager/Players.tsx",
                lineNumber: 414,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p, { children: [
                stats.disposals,
                " (",
                stats.gamesPlayed > 0 ? (stats.disposals / stats.gamesPlayed).toFixed(1) : "0",
                " avg)"
              ] }, void 0, true, {
                fileName: "app/components/AFLManager/Players.tsx",
                lineNumber: 415,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "app/components/AFLManager/Players.tsx",
              lineNumber: 413,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p2, { children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p, { size: "2", weight: "bold", children: "Marks" }, void 0, false, {
                fileName: "app/components/AFLManager/Players.tsx",
                lineNumber: 419,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p, { children: [
                stats.marks,
                " (",
                stats.gamesPlayed > 0 ? (stats.marks / stats.gamesPlayed).toFixed(1) : "0",
                " avg)"
              ] }, void 0, true, {
                fileName: "app/components/AFLManager/Players.tsx",
                lineNumber: 420,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "app/components/AFLManager/Players.tsx",
              lineNumber: 418,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p2, { children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p, { size: "2", weight: "bold", children: "Tackles" }, void 0, false, {
                fileName: "app/components/AFLManager/Players.tsx",
                lineNumber: 424,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p, { children: [
                stats.tackles,
                " (",
                stats.gamesPlayed > 0 ? (stats.tackles / stats.gamesPlayed).toFixed(1) : "0",
                " avg)"
              ] }, void 0, true, {
                fileName: "app/components/AFLManager/Players.tsx",
                lineNumber: 425,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "app/components/AFLManager/Players.tsx",
              lineNumber: 423,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p2, { children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p, { size: "2", weight: "bold", children: "Goals" }, void 0, false, {
                fileName: "app/components/AFLManager/Players.tsx",
                lineNumber: 429,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p, { children: [
                stats.goals,
                " (",
                stats.gamesPlayed > 0 ? (stats.goals / stats.gamesPlayed).toFixed(1) : "0",
                " avg)"
              ] }, void 0, true, {
                fileName: "app/components/AFLManager/Players.tsx",
                lineNumber: 430,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "app/components/AFLManager/Players.tsx",
              lineNumber: 428,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p2, { children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p, { size: "2", weight: "bold", children: "Behinds" }, void 0, false, {
                fileName: "app/components/AFLManager/Players.tsx",
                lineNumber: 434,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p, { children: [
                stats.behinds,
                " (",
                stats.gamesPlayed > 0 ? (stats.behinds / stats.gamesPlayed).toFixed(1) : "0",
                " avg)"
              ] }, void 0, true, {
                fileName: "app/components/AFLManager/Players.tsx",
                lineNumber: 435,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "app/components/AFLManager/Players.tsx",
              lineNumber: 433,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/Players.tsx",
            lineNumber: 407,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/Players.tsx",
          lineNumber: 404,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/AFLManager/Players.tsx",
        lineNumber: 225,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/AFLManager/Players.tsx",
      lineNumber: 188,
      columnNumber: 12
    }, this);
  };
  return /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p2, { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(r, { size: "6", mb: "4", children: "Players" }, void 0, false, {
      fileName: "app/components/AFLManager/Players.tsx",
      lineNumber: 443,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(o2, { variant: "surface", mb: "4", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p3, { gap: "3", wrap: "wrap", mb: "3", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p2, { style: {
          flex: 1,
          minWidth: "200px"
        }, children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p, { size: "2", mb: "1", weight: "bold", children: "Filter by Team" }, void 0, false, {
            fileName: "app/components/AFLManager/Players.tsx",
            lineNumber: 451,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(select_exports.Root, { value: selectedTeamId, onValueChange: setSelectedTeamId, children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(select_exports.Trigger, {}, void 0, false, {
              fileName: "app/components/AFLManager/Players.tsx",
              lineNumber: 453,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(select_exports.Content, { children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(select_exports.Item, { value: "all", children: "All Teams" }, void 0, false, {
                fileName: "app/components/AFLManager/Players.tsx",
                lineNumber: 455,
                columnNumber: 17
              }, this),
              teams.map((team) => /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(select_exports.Item, { value: team.id, children: team.name }, team.id, false, {
                fileName: "app/components/AFLManager/Players.tsx",
                lineNumber: 456,
                columnNumber: 36
              }, this))
            ] }, void 0, true, {
              fileName: "app/components/AFLManager/Players.tsx",
              lineNumber: 454,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/Players.tsx",
            lineNumber: 452,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/Players.tsx",
          lineNumber: 447,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p2, { style: {
          flex: 1,
          minWidth: "200px"
        }, children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p, { size: "2", mb: "1", weight: "bold", children: "Filter by Position" }, void 0, false, {
            fileName: "app/components/AFLManager/Players.tsx",
            lineNumber: 465,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(select_exports.Root, { value: selectedPosition, onValueChange: setSelectedPosition, children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(select_exports.Trigger, {}, void 0, false, {
              fileName: "app/components/AFLManager/Players.tsx",
              lineNumber: 467,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(select_exports.Content, { children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(select_exports.Item, { value: "all", children: "All Positions" }, void 0, false, {
                fileName: "app/components/AFLManager/Players.tsx",
                lineNumber: 469,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(select_exports.Item, { value: "Forward", children: "Forwards" }, void 0, false, {
                fileName: "app/components/AFLManager/Players.tsx",
                lineNumber: 470,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(select_exports.Item, { value: "Midfielder", children: "Midfielders" }, void 0, false, {
                fileName: "app/components/AFLManager/Players.tsx",
                lineNumber: 471,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(select_exports.Item, { value: "Defender", children: "Defenders" }, void 0, false, {
                fileName: "app/components/AFLManager/Players.tsx",
                lineNumber: 472,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(select_exports.Item, { value: "Ruck", children: "Rucks" }, void 0, false, {
                fileName: "app/components/AFLManager/Players.tsx",
                lineNumber: 473,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(select_exports.Item, { value: "Utility", children: "Utilities" }, void 0, false, {
                fileName: "app/components/AFLManager/Players.tsx",
                lineNumber: 474,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "app/components/AFLManager/Players.tsx",
              lineNumber: 468,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/Players.tsx",
            lineNumber: 466,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/Players.tsx",
          lineNumber: 461,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p2, { style: {
          flex: 1,
          minWidth: "200px"
        }, children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p, { size: "2", mb: "1", weight: "bold", children: "Search" }, void 0, false, {
            fileName: "app/components/AFLManager/Players.tsx",
            lineNumber: 483,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(text_field_exports.Root, { placeholder: "Search players...", value: searchQuery, onChange: (e2) => setSearchQuery(e2.target.value) }, void 0, false, {
            fileName: "app/components/AFLManager/Players.tsx",
            lineNumber: 484,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/Players.tsx",
          lineNumber: 479,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/AFLManager/Players.tsx",
        lineNumber: 446,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p, { size: "2", color: "gray", children: [
        "Showing ",
        sortedPlayers.length,
        " of ",
        allPlayers.length,
        " players"
      ] }, void 0, true, {
        fileName: "app/components/AFLManager/Players.tsx",
        lineNumber: 488,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/AFLManager/Players.tsx",
      lineNumber: 445,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(o3, { columns: {
      initial: "1",
      md: selectedPlayer ? "2" : "1"
    }, gap: "4", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(o2, { variant: "surface", children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(table_exports.Root, { children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(table_exports.Header, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(table_exports.Row, { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(table_exports.ColumnHeaderCell, { onClick: () => handleSortChange("name"), style: {
            cursor: "pointer"
          }, children: [
            "Name ",
            sortBy === "name" && (sortOrder === "asc" ? "\u2191" : "\u2193")
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/Players.tsx",
            lineNumber: 501,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(table_exports.ColumnHeaderCell, { onClick: () => handleSortChange("team"), style: {
            cursor: "pointer"
          }, children: [
            "Team ",
            sortBy === "team" && (sortOrder === "asc" ? "\u2191" : "\u2193")
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/Players.tsx",
            lineNumber: 507,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(table_exports.ColumnHeaderCell, { onClick: () => handleSortChange("position"), style: {
            cursor: "pointer"
          }, children: [
            "Position ",
            sortBy === "position" && (sortOrder === "asc" ? "\u2191" : "\u2193")
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/Players.tsx",
            lineNumber: 513,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(table_exports.ColumnHeaderCell, { onClick: () => handleSortChange("age"), style: {
            cursor: "pointer"
          }, children: [
            "Age ",
            sortBy === "age" && (sortOrder === "asc" ? "\u2191" : "\u2193")
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/Players.tsx",
            lineNumber: 519,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(table_exports.ColumnHeaderCell, { onClick: () => handleSortChange("rating"), style: {
            cursor: "pointer"
          }, children: [
            "Rating ",
            sortBy === "rating" && (sortOrder === "asc" ? "\u2191" : "\u2193")
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/Players.tsx",
            lineNumber: 525,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(table_exports.ColumnHeaderCell, { children: "Form" }, void 0, false, {
            fileName: "app/components/AFLManager/Players.tsx",
            lineNumber: 531,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(table_exports.ColumnHeaderCell, { children: "Stats" }, void 0, false, {
            fileName: "app/components/AFLManager/Players.tsx",
            lineNumber: 535,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/Players.tsx",
          lineNumber: 500,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "app/components/AFLManager/Players.tsx",
          lineNumber: 499,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(table_exports.Body, { children: sortedPlayers.map((player) => {
          const team = getTeamById(player.teamId);
          if (!team)
            return null;
          const overallRating = calculateOverallRating(player);
          const stats = playerStats[player.id] || {
            disposals: 0,
            marks: 0,
            tackles: 0,
            goals: 0,
            behinds: 0,
            gamesPlayed: 0
          };
          return /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(table_exports.Row, { style: {
            cursor: "pointer",
            backgroundColor: selectedPlayer?.id === player.id ? "rgba(59, 130, 246, 0.1)" : void 0
          }, onClick: () => setSelectedPlayer(player), children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(table_exports.Cell, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p, { weight: player.teamId === gameState.userTeamId ? "bold" : "regular", children: player.name }, void 0, false, {
              fileName: "app/components/AFLManager/Players.tsx",
              lineNumber: 563,
              columnNumber: 23
            }, this) }, void 0, false, {
              fileName: "app/components/AFLManager/Players.tsx",
              lineNumber: 562,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(table_exports.Cell, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p3, { gap: "2", align: "center", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p2, { style: {
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: team.colors.primary
              } }, void 0, false, {
                fileName: "app/components/AFLManager/Players.tsx",
                lineNumber: 570,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p, { children: team.name }, void 0, false, {
                fileName: "app/components/AFLManager/Players.tsx",
                lineNumber: 576,
                columnNumber: 25
              }, this)
            ] }, void 0, true, {
              fileName: "app/components/AFLManager/Players.tsx",
              lineNumber: 569,
              columnNumber: 23
            }, this) }, void 0, false, {
              fileName: "app/components/AFLManager/Players.tsx",
              lineNumber: 568,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(table_exports.Cell, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(e, { size: "1", children: player.position }, void 0, false, {
              fileName: "app/components/AFLManager/Players.tsx",
              lineNumber: 581,
              columnNumber: 23
            }, this) }, void 0, false, {
              fileName: "app/components/AFLManager/Players.tsx",
              lineNumber: 580,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(table_exports.Cell, { children: player.age }, void 0, false, {
              fileName: "app/components/AFLManager/Players.tsx",
              lineNumber: 584,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(table_exports.Cell, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p2, { style: {
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              backgroundColor: "#3b82f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "bold"
            }, children: overallRating }, void 0, false, {
              fileName: "app/components/AFLManager/Players.tsx",
              lineNumber: 589,
              columnNumber: 23
            }, this) }, void 0, false, {
              fileName: "app/components/AFLManager/Players.tsx",
              lineNumber: 588,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(table_exports.Cell, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p3, { align: "center", gap: "2", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p2, { style: {
                width: `${player.form}%`,
                height: "8px",
                backgroundColor: player.form > 80 ? "#22c55e" : player.form > 60 ? "#f59e0b" : "#ef4444",
                borderRadius: "4px"
              } }, void 0, false, {
                fileName: "app/components/AFLManager/Players.tsx",
                lineNumber: 606,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p, { size: "1", children: player.form }, void 0, false, {
                fileName: "app/components/AFLManager/Players.tsx",
                lineNumber: 612,
                columnNumber: 25
              }, this)
            ] }, void 0, true, {
              fileName: "app/components/AFLManager/Players.tsx",
              lineNumber: 605,
              columnNumber: 23
            }, this) }, void 0, false, {
              fileName: "app/components/AFLManager/Players.tsx",
              lineNumber: 604,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(table_exports.Cell, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p3, { gap: "2", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p, { size: "2", children: [
                stats.disposals,
                " D"
              ] }, void 0, true, {
                fileName: "app/components/AFLManager/Players.tsx",
                lineNumber: 618,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(p, { size: "2", children: [
                stats.goals,
                " G"
              ] }, void 0, true, {
                fileName: "app/components/AFLManager/Players.tsx",
                lineNumber: 619,
                columnNumber: 25
              }, this)
            ] }, void 0, true, {
              fileName: "app/components/AFLManager/Players.tsx",
              lineNumber: 617,
              columnNumber: 23
            }, this) }, void 0, false, {
              fileName: "app/components/AFLManager/Players.tsx",
              lineNumber: 616,
              columnNumber: 21
            }, this)
          ] }, player.id, true, {
            fileName: "app/components/AFLManager/Players.tsx",
            lineNumber: 558,
            columnNumber: 22
          }, this);
        }) }, void 0, false, {
          fileName: "app/components/AFLManager/Players.tsx",
          lineNumber: 541,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/AFLManager/Players.tsx",
        lineNumber: 498,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "app/components/AFLManager/Players.tsx",
        lineNumber: 497,
        columnNumber: 9
      }, this),
      selectedPlayer && renderPlayerDetails()
    ] }, void 0, true, {
      fileName: "app/components/AFLManager/Players.tsx",
      lineNumber: 493,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/AFLManager/Players.tsx",
    lineNumber: 442,
    columnNumber: 10
  }, this);
}
_s3(Players, "THn8br6mNXum01w4yAWjZqJixHE=");
_c3 = Players;
var _c3;
$RefreshReg$(_c3, "Players");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

// app/components/AFLManager/Club.tsx
var import_jsx_dev_runtime4 = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\components\\\\AFLManager\\\\Club.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\components\\AFLManager\\Club.tsx"
  );
  import.meta.hot.lastModified = "1747543677750.3247";
}
function Club({
  gameState,
  allPlayers
}) {
  const userTeam = teams.find((team) => team.id === gameState.userTeamId);
  if (!userTeam) {
    return /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { children: "Error: Team not found" }, void 0, false, {
      fileName: "app/components/AFLManager/Club.tsx",
      lineNumber: 30,
      columnNumber: 12
    }, this);
  }
  const teamPlayers = allPlayers.filter((player) => player.teamId === gameState.userTeamId);
  const totalSalary = teamPlayers.reduce((sum, player) => sum + player.contract.salary, 0);
  const salaryCap = 1e4;
  const salaryCapPercentage = Math.min(100, totalSalary / salaryCap * 100);
  const finances = {
    balance: 15e6,
    // $15M
    weeklyRevenue: 85e4,
    // $850k
    weeklyExpenses: 75e4,
    // $750k
    sponsorships: [{
      name: "Major Sponsor",
      amount: 5e6,
      duration: "2 years"
    }, {
      name: "Secondary Sponsor",
      amount: 25e5,
      duration: "3 years"
    }, {
      name: "Minor Sponsor",
      amount: 1e6,
      duration: "1 year"
    }],
    revenueBreakdown: {
      ticketSales: 45,
      sponsorships: 30,
      merchandise: 15,
      broadcasting: 10
    },
    expensesBreakdown: {
      playerSalaries: 65,
      staffSalaries: 15,
      facilities: 10,
      operations: 10
    }
  };
  const facilities = {
    stadium: {
      name: userTeam.homeGround,
      capacity: 5e4,
      condition: 85,
      modernization: 80,
      fanAmenities: 75
    },
    trainingFacilities: {
      condition: 70,
      technology: 65,
      recovery: 75,
      gymQuality: 80
    },
    medicalFacilities: {
      quality: 75,
      staff: 70,
      equipment: 80,
      rehabilitation: 75
    },
    youthAcademy: {
      quality: 65,
      coaching: 70,
      recruitment: 60,
      development: 65
    }
  };
  const staff = [{
    id: "1",
    name: "John Smith",
    role: "Head Coach",
    quality: 85,
    specialization: "Tactical",
    salary: 800
  }, {
    id: "2",
    name: "Sarah Johnson",
    role: "Assistant Coach",
    quality: 75,
    specialization: "Player Development",
    salary: 400
  }, {
    id: "3",
    name: "Michael Brown",
    role: "Fitness Coach",
    quality: 80,
    specialization: "Conditioning",
    salary: 350
  }, {
    id: "4",
    name: "David Wilson",
    role: "Medical Officer",
    quality: 90,
    specialization: "Injury Prevention",
    salary: 500
  }, {
    id: "5",
    name: "Emma Davis",
    role: "Scout",
    quality: 70,
    specialization: "Youth Talent",
    salary: 300
  }, {
    id: "6",
    name: "Robert Taylor",
    role: "Physiotherapist",
    quality: 85,
    specialization: "Rehabilitation",
    salary: 400
  }];
  const renderClubOverview = () => /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(o3, { columns: {
    initial: "1",
    md: "2"
  }, gap: "4", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(o2, { variant: "surface", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p3, { justify: "between", align: "center", mb: "3", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(r, { size: "4", children: userTeam.name }, void 0, false, {
          fileName: "app/components/AFLManager/Club.tsx",
          lineNumber: 157,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p2, { style: {
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          backgroundColor: userTeam.colors.primary,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: "bold"
        }, children: userTeam.name.substring(0, 2).toUpperCase() }, void 0, false, {
          fileName: "app/components/AFLManager/Club.tsx",
          lineNumber: 158,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/AFLManager/Club.tsx",
        lineNumber: 156,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(o4, { size: "4", my: "3" }, void 0, false, {
        fileName: "app/components/AFLManager/Club.tsx",
        lineNumber: 173,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(o3, { columns: "1", gap: "3", width: "auto", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p2, { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "2", weight: "bold", children: "Home Ground" }, void 0, false, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 177,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { children: userTeam.homeGround }, void 0, false, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 178,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/Club.tsx",
          lineNumber: 176,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p2, { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "2", weight: "bold", children: "Established" }, void 0, false, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 182,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { children: "1897" }, void 0, false, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 183,
            columnNumber: 13
          }, this),
          " "
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/Club.tsx",
          lineNumber: 181,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p2, { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "2", weight: "bold", children: "Club Colors" }, void 0, false, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 187,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p3, { gap: "2", align: "center", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p2, { style: {
              width: "20px",
              height: "20px",
              borderRadius: "4px",
              backgroundColor: userTeam.colors.primary
            } }, void 0, false, {
              fileName: "app/components/AFLManager/Club.tsx",
              lineNumber: 189,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p2, { style: {
              width: "20px",
              height: "20px",
              borderRadius: "4px",
              backgroundColor: userTeam.colors.secondary || "#ffffff"
            } }, void 0, false, {
              fileName: "app/components/AFLManager/Club.tsx",
              lineNumber: 195,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 188,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/Club.tsx",
          lineNumber: 186,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p2, { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "2", weight: "bold", children: "Current Season" }, void 0, false, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 205,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { children: [
            "Round ",
            gameState.currentRound
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 206,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/Club.tsx",
          lineNumber: 204,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p2, { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "2", weight: "bold", children: "League Position" }, void 0, false, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 210,
            columnNumber: 13
          }, this),
          (() => {
            const position = gameState.ladder.sort((a, b) => {
              if (b.points !== a.points)
                return b.points - a.points;
              return b.percentage - a.percentage;
            }).findIndex((pos) => pos.teamId === gameState.userTeamId) + 1;
            return /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { children: [
              position,
              getOrdinalSuffix(position)
            ] }, void 0, true, {
              fileName: "app/components/AFLManager/Club.tsx",
              lineNumber: 216,
              columnNumber: 20
            }, this);
          })()
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/Club.tsx",
          lineNumber: 209,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/AFLManager/Club.tsx",
        lineNumber: 175,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/AFLManager/Club.tsx",
      lineNumber: 155,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(o2, { variant: "surface", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(r, { size: "4", mb: "3", children: "Team Attributes" }, void 0, false, {
        fileName: "app/components/AFLManager/Club.tsx",
        lineNumber: 223,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(o3, { columns: "1", gap: "3", width: "auto", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p2, { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p3, { justify: "between", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "2", children: "Attack" }, void 0, false, {
              fileName: "app/components/AFLManager/Club.tsx",
              lineNumber: 228,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "2", weight: "bold", children: userTeam.attributes.attack }, void 0, false, {
              fileName: "app/components/AFLManager/Club.tsx",
              lineNumber: 229,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 227,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(s, { value: userTeam.attributes.attack, max: 100, size: "2", color: "green" }, void 0, false, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 231,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/Club.tsx",
          lineNumber: 226,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p2, { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p3, { justify: "between", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "2", children: "Midfield" }, void 0, false, {
              fileName: "app/components/AFLManager/Club.tsx",
              lineNumber: 236,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "2", weight: "bold", children: userTeam.attributes.midfield }, void 0, false, {
              fileName: "app/components/AFLManager/Club.tsx",
              lineNumber: 237,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 235,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(s, { value: userTeam.attributes.midfield, max: 100, size: "2", color: "blue" }, void 0, false, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 239,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/Club.tsx",
          lineNumber: 234,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p2, { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p3, { justify: "between", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "2", children: "Defense" }, void 0, false, {
              fileName: "app/components/AFLManager/Club.tsx",
              lineNumber: 244,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "2", weight: "bold", children: userTeam.attributes.defense }, void 0, false, {
              fileName: "app/components/AFLManager/Club.tsx",
              lineNumber: 245,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 243,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(s, { value: userTeam.attributes.defense, max: 100, size: "2", color: "orange" }, void 0, false, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 247,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/Club.tsx",
          lineNumber: 242,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p2, { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p3, { justify: "between", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "2", children: "Coaching" }, void 0, false, {
              fileName: "app/components/AFLManager/Club.tsx",
              lineNumber: 252,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "2", weight: "bold", children: userTeam.attributes.coaching }, void 0, false, {
              fileName: "app/components/AFLManager/Club.tsx",
              lineNumber: 253,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 251,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(s, { value: userTeam.attributes.coaching, max: 100, size: "2", color: "purple" }, void 0, false, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 255,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/Club.tsx",
          lineNumber: 250,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p2, { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p3, { justify: "between", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "2", children: "Overall" }, void 0, false, {
              fileName: "app/components/AFLManager/Club.tsx",
              lineNumber: 260,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "2", weight: "bold", children: Math.round((userTeam.attributes.attack + userTeam.attributes.midfield + userTeam.attributes.defense + userTeam.attributes.coaching) / 4) }, void 0, false, {
              fileName: "app/components/AFLManager/Club.tsx",
              lineNumber: 261,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 259,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(s, { value: Math.round((userTeam.attributes.attack + userTeam.attributes.midfield + userTeam.attributes.defense + userTeam.attributes.coaching) / 4), max: 100, size: "2", color: "indigo" }, void 0, false, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 265,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/Club.tsx",
          lineNumber: 258,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/AFLManager/Club.tsx",
        lineNumber: 225,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/AFLManager/Club.tsx",
      lineNumber: 222,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(o2, { variant: "surface", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(r, { size: "4", mb: "3", children: "Salary Cap" }, void 0, false, {
        fileName: "app/components/AFLManager/Club.tsx",
        lineNumber: 271,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p2, { mb: "3", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p3, { justify: "between", mb: "1", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "2", children: "Salary Cap Usage" }, void 0, false, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 275,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "2", weight: "bold", children: [
            "$",
            totalSalary,
            "k / $",
            salaryCap,
            "k"
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 276,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/Club.tsx",
          lineNumber: 274,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(s, { value: salaryCapPercentage, max: 100, size: "2", color: salaryCapPercentage > 95 ? "red" : salaryCapPercentage > 85 ? "orange" : "green" }, void 0, false, {
          fileName: "app/components/AFLManager/Club.tsx",
          lineNumber: 278,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/AFLManager/Club.tsx",
        lineNumber: 273,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "2", color: "gray", children: salaryCapPercentage >= 100 ? "You are at the salary cap limit. You must reduce salaries before signing new players." : `You have $${salaryCap - totalSalary}k available under the salary cap.` }, void 0, false, {
        fileName: "app/components/AFLManager/Club.tsx",
        lineNumber: 281,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(o4, { size: "4", my: "3" }, void 0, false, {
        fileName: "app/components/AFLManager/Club.tsx",
        lineNumber: 285,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(r, { size: "3", mb: "2", children: "Position Breakdown" }, void 0, false, {
        fileName: "app/components/AFLManager/Club.tsx",
        lineNumber: 287,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(o3, { columns: "2", gap: "3", width: "auto", children: ["Forward", "Midfielder", "Defender", "Ruck", "Utility"].map((position) => {
        const positionPlayers = teamPlayers.filter((p4) => p4.position === position);
        const positionSalary = positionPlayers.reduce((sum, p4) => sum + p4.contract.salary, 0);
        const percentage = Math.round(positionSalary / totalSalary * 100) || 0;
        return /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p2, { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p3, { justify: "between", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "2", children: [
              position,
              "s"
            ] }, void 0, true, {
              fileName: "app/components/AFLManager/Club.tsx",
              lineNumber: 296,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "2", children: [
              percentage,
              "%"
            ] }, void 0, true, {
              fileName: "app/components/AFLManager/Club.tsx",
              lineNumber: 297,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 295,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p3, { align: "center", gap: "2", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p2, { style: {
              width: `${percentage}%`,
              height: "8px",
              backgroundColor: position === "Forward" ? "#22c55e" : position === "Midfielder" ? "#3b82f6" : position === "Defender" ? "#f59e0b" : position === "Ruck" ? "#8b5cf6" : "#ec4899",
              borderRadius: "4px"
            } }, void 0, false, {
              fileName: "app/components/AFLManager/Club.tsx",
              lineNumber: 300,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "1", children: [
              "$",
              positionSalary,
              "k"
            ] }, void 0, true, {
              fileName: "app/components/AFLManager/Club.tsx",
              lineNumber: 306,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 299,
            columnNumber: 17
          }, this)
        ] }, position, true, {
          fileName: "app/components/AFLManager/Club.tsx",
          lineNumber: 294,
          columnNumber: 18
        }, this);
      }) }, void 0, false, {
        fileName: "app/components/AFLManager/Club.tsx",
        lineNumber: 289,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/AFLManager/Club.tsx",
      lineNumber: 270,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(o2, { variant: "surface", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(r, { size: "4", mb: "3", children: "Squad Summary" }, void 0, false, {
        fileName: "app/components/AFLManager/Club.tsx",
        lineNumber: 314,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(o3, { columns: "2", gap: "3", width: "auto", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p2, { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "2", weight: "bold", children: "Total Players" }, void 0, false, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 318,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { children: teamPlayers.length }, void 0, false, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 319,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/Club.tsx",
          lineNumber: 317,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p2, { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "2", weight: "bold", children: "Average Age" }, void 0, false, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 323,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { children: Math.round(teamPlayers.reduce((sum, p4) => sum + p4.age, 0) / teamPlayers.length) }, void 0, false, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 324,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/Club.tsx",
          lineNumber: 322,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p2, { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "2", weight: "bold", children: "Average Rating" }, void 0, false, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 330,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { children: Math.round(teamPlayers.reduce((sum, p4) => {
            const rating = (p4.attributes.speed + p4.attributes.strength + p4.attributes.stamina + p4.attributes.agility + p4.attributes.intelligence + p4.attributes.kicking + p4.attributes.marking + p4.attributes.handball + p4.attributes.tackling) / 9;
            return sum + rating;
          }, 0) / teamPlayers.length) }, void 0, false, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 331,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/Club.tsx",
          lineNumber: 329,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p2, { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "2", weight: "bold", children: "Average Salary" }, void 0, false, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 340,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { children: [
            "$",
            Math.round(totalSalary / teamPlayers.length),
            "k"
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 341,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/Club.tsx",
          lineNumber: 339,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/AFLManager/Club.tsx",
        lineNumber: 316,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(o4, { size: "4", my: "3" }, void 0, false, {
        fileName: "app/components/AFLManager/Club.tsx",
        lineNumber: 345,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(r, { size: "3", mb: "2", children: "Position Distribution" }, void 0, false, {
        fileName: "app/components/AFLManager/Club.tsx",
        lineNumber: 347,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p3, { gap: "2", wrap: "wrap", children: ["Forward", "Midfielder", "Defender", "Ruck", "Utility"].map((position) => {
        const count = teamPlayers.filter((p4) => p4.position === position).length;
        const percentage = Math.round(count / teamPlayers.length * 100);
        return /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p2, { style: {
          flex: 1,
          minWidth: "120px"
        }, children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "2", weight: "bold", children: [
            position,
            "s"
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 357,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { children: [
            count,
            " (",
            percentage,
            "%)"
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 358,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p2, { style: {
            width: `${percentage}%`,
            height: "8px",
            backgroundColor: position === "Forward" ? "#22c55e" : position === "Midfielder" ? "#3b82f6" : position === "Defender" ? "#f59e0b" : position === "Ruck" ? "#8b5cf6" : "#ec4899",
            borderRadius: "4px",
            marginTop: "4px"
          } }, void 0, false, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 359,
            columnNumber: 17
          }, this)
        ] }, position, true, {
          fileName: "app/components/AFLManager/Club.tsx",
          lineNumber: 353,
          columnNumber: 18
        }, this);
      }) }, void 0, false, {
        fileName: "app/components/AFLManager/Club.tsx",
        lineNumber: 349,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/AFLManager/Club.tsx",
      lineNumber: 313,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/AFLManager/Club.tsx",
    lineNumber: 151,
    columnNumber: 36
  }, this);
  const renderFinances = () => /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(o3, { columns: {
    initial: "1",
    md: "2"
  }, gap: "4", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(o2, { variant: "surface", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(r, { size: "4", mb: "3", children: "Financial Overview" }, void 0, false, {
        fileName: "app/components/AFLManager/Club.tsx",
        lineNumber: 378,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(o3, { columns: "1", gap: "3", width: "auto", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p2, { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "2", weight: "bold", children: "Current Balance" }, void 0, false, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 382,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "6", weight: "bold", children: [
            "$",
            formatCurrency(finances.balance)
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 383,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/Club.tsx",
          lineNumber: 381,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(o4, { size: "4", my: "1" }, void 0, false, {
          fileName: "app/components/AFLManager/Club.tsx",
          lineNumber: 386,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p2, { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "2", weight: "bold", children: "Weekly Revenue" }, void 0, false, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 389,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { color: "green", children: [
            "$",
            formatCurrency(finances.weeklyRevenue)
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 390,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/Club.tsx",
          lineNumber: 388,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p2, { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "2", weight: "bold", children: "Weekly Expenses" }, void 0, false, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 394,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { color: "red", children: [
            "$",
            formatCurrency(finances.weeklyExpenses)
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 395,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/Club.tsx",
          lineNumber: 393,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p2, { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "2", weight: "bold", children: "Weekly Profit/Loss" }, void 0, false, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 399,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { color: finances.weeklyRevenue > finances.weeklyExpenses ? "green" : "red", children: [
            "$",
            formatCurrency(finances.weeklyRevenue - finances.weeklyExpenses)
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 400,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/Club.tsx",
          lineNumber: 398,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(o4, { size: "4", my: "1" }, void 0, false, {
          fileName: "app/components/AFLManager/Club.tsx",
          lineNumber: 405,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p2, { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "2", weight: "bold", children: "Salary Cap Space" }, void 0, false, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 408,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { children: [
            "$",
            (salaryCap - totalSalary).toLocaleString(),
            "k"
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 409,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/Club.tsx",
          lineNumber: 407,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/AFLManager/Club.tsx",
        lineNumber: 380,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/AFLManager/Club.tsx",
      lineNumber: 377,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(o2, { variant: "surface", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(r, { size: "4", mb: "3", children: "Sponsorships" }, void 0, false, {
        fileName: "app/components/AFLManager/Club.tsx",
        lineNumber: 415,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(table_exports.Root, { children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(table_exports.Header, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(table_exports.Row, { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(table_exports.ColumnHeaderCell, { children: "Sponsor" }, void 0, false, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 420,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(table_exports.ColumnHeaderCell, { children: "Amount" }, void 0, false, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 421,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(table_exports.ColumnHeaderCell, { children: "Duration" }, void 0, false, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 422,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/Club.tsx",
          lineNumber: 419,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "app/components/AFLManager/Club.tsx",
          lineNumber: 418,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(table_exports.Body, { children: finances.sponsorships.map((sponsor, index) => /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(table_exports.Row, { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(table_exports.Cell, { children: sponsor.name }, void 0, false, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 428,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(table_exports.Cell, { children: [
            "$",
            formatCurrency(sponsor.amount)
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 429,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(table_exports.Cell, { children: sponsor.duration }, void 0, false, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 430,
            columnNumber: 17
          }, this)
        ] }, index, true, {
          fileName: "app/components/AFLManager/Club.tsx",
          lineNumber: 427,
          columnNumber: 60
        }, this)) }, void 0, false, {
          fileName: "app/components/AFLManager/Club.tsx",
          lineNumber: 426,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/AFLManager/Club.tsx",
        lineNumber: 417,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(o, { variant: "outline", size: "2", mt: "3", children: "Negotiate New Sponsorship" }, void 0, false, {
        fileName: "app/components/AFLManager/Club.tsx",
        lineNumber: 435,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/AFLManager/Club.tsx",
      lineNumber: 414,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(o2, { variant: "surface", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(r, { size: "4", mb: "3", children: "Revenue Breakdown" }, void 0, false, {
        fileName: "app/components/AFLManager/Club.tsx",
        lineNumber: 439,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(o3, { columns: "1", gap: "3", width: "auto", children: Object.entries(finances.revenueBreakdown).map(([source, percentage]) => /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p2, { children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p3, { justify: "between", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "2", style: {
            textTransform: "capitalize"
          }, children: source }, void 0, false, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 444,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "2", children: [
            percentage,
            "%"
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 447,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/Club.tsx",
          lineNumber: 443,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p2, { style: {
          width: `${percentage}%`,
          height: "8px",
          backgroundColor: source === "ticketSales" ? "#22c55e" : source === "sponsorships" ? "#3b82f6" : source === "merchandise" ? "#f59e0b" : "#8b5cf6",
          borderRadius: "4px"
        } }, void 0, false, {
          fileName: "app/components/AFLManager/Club.tsx",
          lineNumber: 449,
          columnNumber: 15
        }, this)
      ] }, source, true, {
        fileName: "app/components/AFLManager/Club.tsx",
        lineNumber: 442,
        columnNumber: 84
      }, this)) }, void 0, false, {
        fileName: "app/components/AFLManager/Club.tsx",
        lineNumber: 441,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/AFLManager/Club.tsx",
      lineNumber: 438,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(o2, { variant: "surface", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(r, { size: "4", mb: "3", children: "Expenses Breakdown" }, void 0, false, {
        fileName: "app/components/AFLManager/Club.tsx",
        lineNumber: 460,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(o3, { columns: "1", gap: "3", width: "auto", children: Object.entries(finances.expensesBreakdown).map(([source, percentage]) => /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p2, { children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p3, { justify: "between", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "2", style: {
            textTransform: "capitalize"
          }, children: source }, void 0, false, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 465,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "2", children: [
            percentage,
            "%"
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 468,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/Club.tsx",
          lineNumber: 464,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p2, { style: {
          width: `${percentage}%`,
          height: "8px",
          backgroundColor: source === "playerSalaries" ? "#ef4444" : source === "staffSalaries" ? "#f97316" : source === "facilities" ? "#f59e0b" : "#8b5cf6",
          borderRadius: "4px"
        } }, void 0, false, {
          fileName: "app/components/AFLManager/Club.tsx",
          lineNumber: 470,
          columnNumber: 15
        }, this)
      ] }, source, true, {
        fileName: "app/components/AFLManager/Club.tsx",
        lineNumber: 463,
        columnNumber: 85
      }, this)) }, void 0, false, {
        fileName: "app/components/AFLManager/Club.tsx",
        lineNumber: 462,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/AFLManager/Club.tsx",
      lineNumber: 459,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/AFLManager/Club.tsx",
    lineNumber: 373,
    columnNumber: 32
  }, this);
  const renderFacilities = () => /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(o3, { columns: {
    initial: "1",
    md: "2"
  }, gap: "4", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(o2, { variant: "surface", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(r, { size: "4", mb: "3", children: "Stadium" }, void 0, false, {
        fileName: "app/components/AFLManager/Club.tsx",
        lineNumber: 487,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p2, { mb: "3", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "2", weight: "bold", children: facilities.stadium.name }, void 0, false, {
          fileName: "app/components/AFLManager/Club.tsx",
          lineNumber: 490,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { children: [
          "Capacity: ",
          facilities.stadium.capacity.toLocaleString(),
          " seats"
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/Club.tsx",
          lineNumber: 491,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/AFLManager/Club.tsx",
        lineNumber: 489,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(o3, { columns: "1", gap: "3", width: "auto", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p2, { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p3, { justify: "between", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "2", children: "Condition" }, void 0, false, {
              fileName: "app/components/AFLManager/Club.tsx",
              lineNumber: 497,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "2", weight: "bold", children: [
              facilities.stadium.condition,
              "/100"
            ] }, void 0, true, {
              fileName: "app/components/AFLManager/Club.tsx",
              lineNumber: 498,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 496,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(s, { value: facilities.stadium.condition, max: 100, size: "2" }, void 0, false, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 500,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/Club.tsx",
          lineNumber: 495,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p2, { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p3, { justify: "between", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "2", children: "Modernization" }, void 0, false, {
              fileName: "app/components/AFLManager/Club.tsx",
              lineNumber: 505,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "2", weight: "bold", children: [
              facilities.stadium.modernization,
              "/100"
            ] }, void 0, true, {
              fileName: "app/components/AFLManager/Club.tsx",
              lineNumber: 506,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 504,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(s, { value: facilities.stadium.modernization, max: 100, size: "2" }, void 0, false, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 508,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/Club.tsx",
          lineNumber: 503,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p2, { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p3, { justify: "between", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "2", children: "Fan Amenities" }, void 0, false, {
              fileName: "app/components/AFLManager/Club.tsx",
              lineNumber: 513,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "2", weight: "bold", children: [
              facilities.stadium.fanAmenities,
              "/100"
            ] }, void 0, true, {
              fileName: "app/components/AFLManager/Club.tsx",
              lineNumber: 514,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 512,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(s, { value: facilities.stadium.fanAmenities, max: 100, size: "2" }, void 0, false, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 516,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/Club.tsx",
          lineNumber: 511,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/AFLManager/Club.tsx",
        lineNumber: 494,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p3, { gap: "2", mt: "3", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(o, { variant: "outline", size: "2", children: "Upgrade" }, void 0, false, {
          fileName: "app/components/AFLManager/Club.tsx",
          lineNumber: 521,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(o, { variant: "outline", size: "2", children: "Maintenance" }, void 0, false, {
          fileName: "app/components/AFLManager/Club.tsx",
          lineNumber: 522,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/AFLManager/Club.tsx",
        lineNumber: 520,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/AFLManager/Club.tsx",
      lineNumber: 486,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(o2, { variant: "surface", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(r, { size: "4", mb: "3", children: "Training Facilities" }, void 0, false, {
        fileName: "app/components/AFLManager/Club.tsx",
        lineNumber: 527,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(o3, { columns: "1", gap: "3", width: "auto", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p2, { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p3, { justify: "between", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "2", children: "Condition" }, void 0, false, {
              fileName: "app/components/AFLManager/Club.tsx",
              lineNumber: 532,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "2", weight: "bold", children: [
              facilities.trainingFacilities.condition,
              "/100"
            ] }, void 0, true, {
              fileName: "app/components/AFLManager/Club.tsx",
              lineNumber: 533,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 531,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(s, { value: facilities.trainingFacilities.condition, max: 100, size: "2" }, void 0, false, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 535,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/Club.tsx",
          lineNumber: 530,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p2, { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p3, { justify: "between", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "2", children: "Technology" }, void 0, false, {
              fileName: "app/components/AFLManager/Club.tsx",
              lineNumber: 540,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "2", weight: "bold", children: [
              facilities.trainingFacilities.technology,
              "/100"
            ] }, void 0, true, {
              fileName: "app/components/AFLManager/Club.tsx",
              lineNumber: 541,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 539,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(s, { value: facilities.trainingFacilities.technology, max: 100, size: "2" }, void 0, false, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 543,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/Club.tsx",
          lineNumber: 538,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p2, { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p3, { justify: "between", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "2", children: "Recovery" }, void 0, false, {
              fileName: "app/components/AFLManager/Club.tsx",
              lineNumber: 548,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "2", weight: "bold", children: [
              facilities.trainingFacilities.recovery,
              "/100"
            ] }, void 0, true, {
              fileName: "app/components/AFLManager/Club.tsx",
              lineNumber: 549,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 547,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(s, { value: facilities.trainingFacilities.recovery, max: 100, size: "2" }, void 0, false, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 551,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/Club.tsx",
          lineNumber: 546,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p2, { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p3, { justify: "between", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "2", children: "Gym Quality" }, void 0, false, {
              fileName: "app/components/AFLManager/Club.tsx",
              lineNumber: 556,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "2", weight: "bold", children: [
              facilities.trainingFacilities.gymQuality,
              "/100"
            ] }, void 0, true, {
              fileName: "app/components/AFLManager/Club.tsx",
              lineNumber: 557,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 555,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(s, { value: facilities.trainingFacilities.gymQuality, max: 100, size: "2" }, void 0, false, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 559,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/Club.tsx",
          lineNumber: 554,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/AFLManager/Club.tsx",
        lineNumber: 529,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(o, { variant: "outline", size: "2", mt: "3", children: "Upgrade" }, void 0, false, {
        fileName: "app/components/AFLManager/Club.tsx",
        lineNumber: 563,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/AFLManager/Club.tsx",
      lineNumber: 526,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(o2, { variant: "surface", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(r, { size: "4", mb: "3", children: "Medical Facilities" }, void 0, false, {
        fileName: "app/components/AFLManager/Club.tsx",
        lineNumber: 567,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(o3, { columns: "1", gap: "3", width: "auto", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p2, { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p3, { justify: "between", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "2", children: "Quality" }, void 0, false, {
              fileName: "app/components/AFLManager/Club.tsx",
              lineNumber: 572,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "2", weight: "bold", children: [
              facilities.medicalFacilities.quality,
              "/100"
            ] }, void 0, true, {
              fileName: "app/components/AFLManager/Club.tsx",
              lineNumber: 573,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 571,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(s, { value: facilities.medicalFacilities.quality, max: 100, size: "2" }, void 0, false, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 575,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/Club.tsx",
          lineNumber: 570,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p2, { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p3, { justify: "between", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "2", children: "Staff" }, void 0, false, {
              fileName: "app/components/AFLManager/Club.tsx",
              lineNumber: 580,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "2", weight: "bold", children: [
              facilities.medicalFacilities.staff,
              "/100"
            ] }, void 0, true, {
              fileName: "app/components/AFLManager/Club.tsx",
              lineNumber: 581,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 579,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(s, { value: facilities.medicalFacilities.staff, max: 100, size: "2" }, void 0, false, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 583,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/Club.tsx",
          lineNumber: 578,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p2, { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p3, { justify: "between", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "2", children: "Equipment" }, void 0, false, {
              fileName: "app/components/AFLManager/Club.tsx",
              lineNumber: 588,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "2", weight: "bold", children: [
              facilities.medicalFacilities.equipment,
              "/100"
            ] }, void 0, true, {
              fileName: "app/components/AFLManager/Club.tsx",
              lineNumber: 589,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 587,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(s, { value: facilities.medicalFacilities.equipment, max: 100, size: "2" }, void 0, false, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 591,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/Club.tsx",
          lineNumber: 586,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p2, { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p3, { justify: "between", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "2", children: "Rehabilitation" }, void 0, false, {
              fileName: "app/components/AFLManager/Club.tsx",
              lineNumber: 596,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "2", weight: "bold", children: [
              facilities.medicalFacilities.rehabilitation,
              "/100"
            ] }, void 0, true, {
              fileName: "app/components/AFLManager/Club.tsx",
              lineNumber: 597,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 595,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(s, { value: facilities.medicalFacilities.rehabilitation, max: 100, size: "2" }, void 0, false, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 599,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/Club.tsx",
          lineNumber: 594,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/AFLManager/Club.tsx",
        lineNumber: 569,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(o, { variant: "outline", size: "2", mt: "3", children: "Upgrade" }, void 0, false, {
        fileName: "app/components/AFLManager/Club.tsx",
        lineNumber: 603,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/AFLManager/Club.tsx",
      lineNumber: 566,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(o2, { variant: "surface", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(r, { size: "4", mb: "3", children: "Youth Academy" }, void 0, false, {
        fileName: "app/components/AFLManager/Club.tsx",
        lineNumber: 607,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(o3, { columns: "1", gap: "3", width: "auto", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p2, { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p3, { justify: "between", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "2", children: "Quality" }, void 0, false, {
              fileName: "app/components/AFLManager/Club.tsx",
              lineNumber: 612,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "2", weight: "bold", children: [
              facilities.youthAcademy.quality,
              "/100"
            ] }, void 0, true, {
              fileName: "app/components/AFLManager/Club.tsx",
              lineNumber: 613,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 611,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(s, { value: facilities.youthAcademy.quality, max: 100, size: "2" }, void 0, false, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 615,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/Club.tsx",
          lineNumber: 610,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p2, { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p3, { justify: "between", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "2", children: "Coaching" }, void 0, false, {
              fileName: "app/components/AFLManager/Club.tsx",
              lineNumber: 620,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "2", weight: "bold", children: [
              facilities.youthAcademy.coaching,
              "/100"
            ] }, void 0, true, {
              fileName: "app/components/AFLManager/Club.tsx",
              lineNumber: 621,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 619,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(s, { value: facilities.youthAcademy.coaching, max: 100, size: "2" }, void 0, false, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 623,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/Club.tsx",
          lineNumber: 618,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p2, { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p3, { justify: "between", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "2", children: "Recruitment" }, void 0, false, {
              fileName: "app/components/AFLManager/Club.tsx",
              lineNumber: 628,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "2", weight: "bold", children: [
              facilities.youthAcademy.recruitment,
              "/100"
            ] }, void 0, true, {
              fileName: "app/components/AFLManager/Club.tsx",
              lineNumber: 629,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 627,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(s, { value: facilities.youthAcademy.recruitment, max: 100, size: "2" }, void 0, false, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 631,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/Club.tsx",
          lineNumber: 626,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p2, { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p3, { justify: "between", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "2", children: "Development" }, void 0, false, {
              fileName: "app/components/AFLManager/Club.tsx",
              lineNumber: 636,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "2", weight: "bold", children: [
              facilities.youthAcademy.development,
              "/100"
            ] }, void 0, true, {
              fileName: "app/components/AFLManager/Club.tsx",
              lineNumber: 637,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 635,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(s, { value: facilities.youthAcademy.development, max: 100, size: "2" }, void 0, false, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 639,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/Club.tsx",
          lineNumber: 634,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/AFLManager/Club.tsx",
        lineNumber: 609,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p3, { gap: "2", mt: "3", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(o, { variant: "outline", size: "2", children: "Upgrade" }, void 0, false, {
          fileName: "app/components/AFLManager/Club.tsx",
          lineNumber: 644,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(o, { variant: "outline", size: "2", children: "Scout Youth" }, void 0, false, {
          fileName: "app/components/AFLManager/Club.tsx",
          lineNumber: 645,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/AFLManager/Club.tsx",
        lineNumber: 643,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/AFLManager/Club.tsx",
      lineNumber: 606,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/AFLManager/Club.tsx",
    lineNumber: 482,
    columnNumber: 34
  }, this);
  const renderStaff = () => /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(o3, { columns: {
    initial: "1"
  }, gap: "4", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(o2, { variant: "surface", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(r, { size: "4", mb: "3", children: "Club Staff" }, void 0, false, {
        fileName: "app/components/AFLManager/Club.tsx",
        lineNumber: 655,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(table_exports.Root, { children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(table_exports.Header, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(table_exports.Row, { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(table_exports.ColumnHeaderCell, { children: "Name" }, void 0, false, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 660,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(table_exports.ColumnHeaderCell, { children: "Role" }, void 0, false, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 661,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(table_exports.ColumnHeaderCell, { children: "Specialization" }, void 0, false, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 662,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(table_exports.ColumnHeaderCell, { children: "Quality" }, void 0, false, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 663,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(table_exports.ColumnHeaderCell, { children: "Salary (k)" }, void 0, false, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 664,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(table_exports.ColumnHeaderCell, { children: "Actions" }, void 0, false, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 665,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/Club.tsx",
          lineNumber: 659,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "app/components/AFLManager/Club.tsx",
          lineNumber: 658,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(table_exports.Body, { children: staff.map((member) => /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(table_exports.Row, { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(table_exports.Cell, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { weight: "bold", children: member.name }, void 0, false, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 672,
            columnNumber: 19
          }, this) }, void 0, false, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 671,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(table_exports.Cell, { children: member.role }, void 0, false, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 674,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(table_exports.Cell, { children: member.specialization }, void 0, false, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 675,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(table_exports.Cell, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p3, { align: "center", gap: "2", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p2, { style: {
              width: `${member.quality}%`,
              height: "8px",
              backgroundColor: member.quality > 85 ? "#22c55e" : member.quality > 70 ? "#3b82f6" : "#f59e0b",
              borderRadius: "4px"
            } }, void 0, false, {
              fileName: "app/components/AFLManager/Club.tsx",
              lineNumber: 678,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "2", children: member.quality }, void 0, false, {
              fileName: "app/components/AFLManager/Club.tsx",
              lineNumber: 684,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 677,
            columnNumber: 19
          }, this) }, void 0, false, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 676,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(table_exports.Cell, { children: [
            "$",
            member.salary,
            "k"
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 687,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(table_exports.Cell, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p3, { gap: "2", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(o, { variant: "outline", size: "1", children: "Details" }, void 0, false, {
              fileName: "app/components/AFLManager/Club.tsx",
              lineNumber: 690,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(o, { variant: "outline", size: "1", children: "Replace" }, void 0, false, {
              fileName: "app/components/AFLManager/Club.tsx",
              lineNumber: 691,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 689,
            columnNumber: 19
          }, this) }, void 0, false, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 688,
            columnNumber: 17
          }, this)
        ] }, member.id, true, {
          fileName: "app/components/AFLManager/Club.tsx",
          lineNumber: 670,
          columnNumber: 34
        }, this)) }, void 0, false, {
          fileName: "app/components/AFLManager/Club.tsx",
          lineNumber: 669,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/AFLManager/Club.tsx",
        lineNumber: 657,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(o, { variant: "solid", size: "2", mt: "3", children: "Hire New Staff" }, void 0, false, {
        fileName: "app/components/AFLManager/Club.tsx",
        lineNumber: 698,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/AFLManager/Club.tsx",
      lineNumber: 654,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(o2, { variant: "surface", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(r, { size: "4", mb: "3", children: "Staff Budget" }, void 0, false, {
        fileName: "app/components/AFLManager/Club.tsx",
        lineNumber: 702,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(o3, { columns: {
        initial: "1",
        md: "2"
      }, gap: "4", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p2, { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "2", weight: "bold", children: "Total Staff Salary" }, void 0, false, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 709,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "6", weight: "bold", children: [
            "$",
            staff.reduce((sum, member) => sum + member.salary, 0),
            "k"
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 710,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "2", color: "gray", children: "per year" }, void 0, false, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 711,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/Club.tsx",
          lineNumber: 708,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p2, { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "2", weight: "bold", children: "Staff Budget Allocation" }, void 0, false, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 715,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(o3, { columns: "1", gap: "2", width: "auto", children: [{
            role: "Coaching",
            percentage: 45
          }, {
            role: "Medical",
            percentage: 25
          }, {
            role: "Scouting",
            percentage: 15
          }, {
            role: "Administration",
            percentage: 15
          }].map((item) => /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p2, { children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p3, { justify: "between", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "2", children: item.role }, void 0, false, {
                fileName: "app/components/AFLManager/Club.tsx",
                lineNumber: 731,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p, { size: "2", children: [
                item.percentage,
                "%"
              ] }, void 0, true, {
                fileName: "app/components/AFLManager/Club.tsx",
                lineNumber: 732,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "app/components/AFLManager/Club.tsx",
              lineNumber: 730,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p2, { style: {
              width: `${item.percentage}%`,
              height: "8px",
              backgroundColor: item.role === "Coaching" ? "#22c55e" : item.role === "Medical" ? "#3b82f6" : item.role === "Scouting" ? "#f59e0b" : "#8b5cf6",
              borderRadius: "4px"
            } }, void 0, false, {
              fileName: "app/components/AFLManager/Club.tsx",
              lineNumber: 734,
              columnNumber: 19
            }, this)
          ] }, item.role, true, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 729,
            columnNumber: 28
          }, this)) }, void 0, false, {
            fileName: "app/components/AFLManager/Club.tsx",
            lineNumber: 716,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/Club.tsx",
          lineNumber: 714,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/AFLManager/Club.tsx",
        lineNumber: 704,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/AFLManager/Club.tsx",
      lineNumber: 701,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/AFLManager/Club.tsx",
    lineNumber: 651,
    columnNumber: 29
  }, this);
  function getOrdinalSuffix(num) {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) {
      return "st";
    }
    if (j === 2 && k !== 12) {
      return "nd";
    }
    if (j === 3 && k !== 13) {
      return "rd";
    }
    return "th";
  }
  function formatCurrency(amount) {
    if (amount >= 1e6) {
      return (amount / 1e6).toFixed(2) + "M";
    } else if (amount >= 1e3) {
      return (amount / 1e3).toFixed(1) + "k";
    } else {
      return amount.toString();
    }
  }
  return /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p2, { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(r, { size: "6", mb: "4", children: "Club" }, void 0, false, {
      fileName: "app/components/AFLManager/Club.tsx",
      lineNumber: 774,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(tabs_exports.Root, { defaultValue: "overview", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(tabs_exports.List, { children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(tabs_exports.Trigger, { value: "overview", children: "Overview" }, void 0, false, {
          fileName: "app/components/AFLManager/Club.tsx",
          lineNumber: 778,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(tabs_exports.Trigger, { value: "finances", children: "Finances" }, void 0, false, {
          fileName: "app/components/AFLManager/Club.tsx",
          lineNumber: 779,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(tabs_exports.Trigger, { value: "facilities", children: "Facilities" }, void 0, false, {
          fileName: "app/components/AFLManager/Club.tsx",
          lineNumber: 780,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(tabs_exports.Trigger, { value: "staff", children: "Staff" }, void 0, false, {
          fileName: "app/components/AFLManager/Club.tsx",
          lineNumber: 781,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/AFLManager/Club.tsx",
        lineNumber: 777,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(p2, { pt: "4", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(tabs_exports.Content, { value: "overview", children: renderClubOverview() }, void 0, false, {
          fileName: "app/components/AFLManager/Club.tsx",
          lineNumber: 785,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(tabs_exports.Content, { value: "finances", children: renderFinances() }, void 0, false, {
          fileName: "app/components/AFLManager/Club.tsx",
          lineNumber: 789,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(tabs_exports.Content, { value: "facilities", children: renderFacilities() }, void 0, false, {
          fileName: "app/components/AFLManager/Club.tsx",
          lineNumber: 793,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime4.jsxDEV)(tabs_exports.Content, { value: "staff", children: renderStaff() }, void 0, false, {
          fileName: "app/components/AFLManager/Club.tsx",
          lineNumber: 797,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/AFLManager/Club.tsx",
        lineNumber: 784,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/AFLManager/Club.tsx",
      lineNumber: 776,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/AFLManager/Club.tsx",
    lineNumber: 773,
    columnNumber: 10
  }, this);
}
_c4 = Club;
var _c4;
$RefreshReg$(_c4, "Club");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

// app/components/AFLManager/SimulationCalendar.tsx
var import_react4 = __toESM(require_react(), 1);
var import_jsx_dev_runtime5 = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\components\\\\AFLManager\\\\SimulationCalendar.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s4 = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\components\\AFLManager\\SimulationCalendar.tsx"
  );
  import.meta.hot.lastModified = "1747543677759.8467";
}
var formatDateDisplay = (date) => {
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
};
var getWeekdayName = (date) => {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString("en-AU", {
    weekday: "long"
  });
};
function SimulationCalendar({
  gameState,
  allPlayers,
  onAdvanceDay,
  onScheduleTraining,
  onViewPressConference,
  onResign
}) {
  _s4();
  const [selectedWeek, setSelectedWeek] = (0, import_react4.useState)(0);
  const generateWeekDays = () => {
    const startDate = new Date(gameState.currentDate);
    startDate.setDate(startDate.getDate() + selectedWeek * 7);
    const weekDays2 = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const dateString = currentDate.toISOString().split("T")[0];
      const hasMatch = gameState.seasonFixtures.some((fixture) => fixture.date === dateString && (fixture.homeTeamId === gameState.userTeamId || fixture.awayTeamId === gameState.userTeamId));
      const hasTraining = gameState.trainingSessions && gameState.trainingSessions.some((session) => session.date === dateString);
      const pressEvents = gameState.pressConferences?.filter((presser) => presser.date === dateString && !presser.completed) || [];
      const isPastDay = new Date(dateString) < new Date(gameState.currentDate);
      const isToday = dateString === gameState.currentDate;
      const todayFixture = gameState.seasonFixtures.find((fixture) => fixture.date === dateString && (fixture.homeTeamId === gameState.userTeamId || fixture.awayTeamId === gameState.userTeamId));
      const opponentId = todayFixture ? todayFixture.homeTeamId === gameState.userTeamId ? todayFixture.awayTeamId : todayFixture.homeTeamId : null;
      const opponent = opponentId ? teams.find((team) => team.id === opponentId)?.name : null;
      const isHome = todayFixture?.homeTeamId === gameState.userTeamId;
      const trainingSession = gameState.trainingSessions?.find((session) => session.date === dateString);
      weekDays2.push({
        date: dateString,
        dayName: getWeekdayName(dateString),
        isToday,
        isPast: isPastDay,
        hasMatch,
        hasTraining,
        pressEvents,
        opponent,
        isHome,
        trainingSession
      });
    }
    return weekDays2;
  };
  const weekDays = generateWeekDays();
  const userTeam = teams.find((team) => team.id === gameState.userTeamId);
  return /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(p2, { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(p3, { justify: "between", align: "center", mb: "4", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(r, { size: "6", children: "Season Calendar" }, void 0, false, {
        fileName: "app/components/AFLManager/SimulationCalendar.tsx",
        lineNumber: 107,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(p3, { gap: "2", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(o, { variant: "outline", onClick: () => setSelectedWeek(Math.max(0, selectedWeek - 1)), disabled: selectedWeek === 0, children: "Previous Week" }, void 0, false, {
          fileName: "app/components/AFLManager/SimulationCalendar.tsx",
          lineNumber: 109,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(o, { variant: "outline", onClick: () => setSelectedWeek(selectedWeek + 1), children: "Next Week" }, void 0, false, {
          fileName: "app/components/AFLManager/SimulationCalendar.tsx",
          lineNumber: 112,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(o, { color: "red", variant: "outline", onClick: onResign, children: [
          "Resign from ",
          userTeam?.name || "Team"
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/SimulationCalendar.tsx",
          lineNumber: 115,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/AFLManager/SimulationCalendar.tsx",
        lineNumber: 108,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/AFLManager/SimulationCalendar.tsx",
      lineNumber: 106,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(o3, { columns: "7", gap: "3", mb: "4", children: weekDays.map((day) => /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(o2, { style: {
      opacity: day.isPast ? 0.5 : 1,
      backgroundColor: day.isToday ? "#2f4f4f" : "#1a1a1a",
      border: day.isToday ? "2px solid #4caf50" : "1px solid #333",
      height: "180px"
    }, children: /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(p3, { direction: "column", gap: "1", height: "100%", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(p3, { justify: "between", align: "center", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(p, { weight: "bold", children: day.dayName }, void 0, false, {
          fileName: "app/components/AFLManager/SimulationCalendar.tsx",
          lineNumber: 130,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(p, { size: "1", children: formatDateDisplay(day.date) }, void 0, false, {
          fileName: "app/components/AFLManager/SimulationCalendar.tsx",
          lineNumber: 131,
          columnNumber: 17
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/AFLManager/SimulationCalendar.tsx",
        lineNumber: 129,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(o4, { size: "4", mb: "1" }, void 0, false, {
        fileName: "app/components/AFLManager/SimulationCalendar.tsx",
        lineNumber: 134,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(p2, { style: {
        flex: 1
      }, children: [
        day.hasMatch && /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(p3, { direction: "column", gap: "1", mb: "2", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(p, { size: "2", color: "crimson", weight: "bold", children: "Match Day" }, void 0, false, {
            fileName: "app/components/AFLManager/SimulationCalendar.tsx",
            lineNumber: 140,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(p, { size: "1", children: [
            "vs ",
            day.opponent,
            day.isHome ? " (Home)" : " (Away)"
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/SimulationCalendar.tsx",
            lineNumber: 141,
            columnNumber: 21
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/SimulationCalendar.tsx",
          lineNumber: 139,
          columnNumber: 34
        }, this),
        day.hasTraining && day.trainingSession && /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(p3, { direction: "column", gap: "1", mb: "2", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(p, { size: "2", color: "orange", weight: "bold", children: "Training" }, void 0, false, {
            fileName: "app/components/AFLManager/SimulationCalendar.tsx",
            lineNumber: 148,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(p, { size: "1", children: [
            day.trainingSession.focus,
            " (",
            day.trainingSession.intensity,
            ")"
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/SimulationCalendar.tsx",
            lineNumber: 149,
            columnNumber: 21
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/SimulationCalendar.tsx",
          lineNumber: 147,
          columnNumber: 60
        }, this),
        day.pressEvents.length > 0 && /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(p3, { direction: "column", gap: "1", mb: "2", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(p, { size: "2", color: "blue", weight: "bold", children: "Press Conference" }, void 0, false, {
            fileName: "app/components/AFLManager/SimulationCalendar.tsx",
            lineNumber: 155,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(p, { size: "1", children: [
            day.pressEvents.length,
            " event(s)"
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/SimulationCalendar.tsx",
            lineNumber: 156,
            columnNumber: 21
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/SimulationCalendar.tsx",
          lineNumber: 154,
          columnNumber: 48
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/AFLManager/SimulationCalendar.tsx",
        lineNumber: 136,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(p3, { gap: "1", justify: "end", mt: "auto", children: [
        !day.isPast && !day.hasMatch && /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(o, { size: "1", variant: "outline", onClick: () => onScheduleTraining(day.date), disabled: day.hasTraining, children: day.hasTraining ? "Scheduled" : "Training" }, void 0, false, {
          fileName: "app/components/AFLManager/SimulationCalendar.tsx",
          lineNumber: 161,
          columnNumber: 50
        }, this),
        day.pressEvents.length > 0 && !day.isPast && /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(o, { size: "1", color: "blue", onClick: () => onViewPressConference(day.pressEvents[0].id), children: "Press" }, void 0, false, {
          fileName: "app/components/AFLManager/SimulationCalendar.tsx",
          lineNumber: 165,
          columnNumber: 63
        }, this),
        day.isToday && /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(o, { size: "1", color: "green", onClick: onAdvanceDay, children: "Next Day" }, void 0, false, {
          fileName: "app/components/AFLManager/SimulationCalendar.tsx",
          lineNumber: 169,
          columnNumber: 33
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/AFLManager/SimulationCalendar.tsx",
        lineNumber: 160,
        columnNumber: 15
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/AFLManager/SimulationCalendar.tsx",
      lineNumber: 128,
      columnNumber: 13
    }, this) }, day.date, false, {
      fileName: "app/components/AFLManager/SimulationCalendar.tsx",
      lineNumber: 122,
      columnNumber: 30
    }, this)) }, void 0, false, {
      fileName: "app/components/AFLManager/SimulationCalendar.tsx",
      lineNumber: 121,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(p2, { my: "4", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(r, { size: "5", mb: "2", children: "Team Schedule Overview" }, void 0, false, {
        fileName: "app/components/AFLManager/SimulationCalendar.tsx",
        lineNumber: 178,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(o2, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(p3, { direction: "column", gap: "3", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(p, { children: [
          "Next Match: ",
          gameState.seasonFixtures.filter((fixture) => new Date(fixture.date) >= new Date(gameState.currentDate) && (fixture.homeTeamId === gameState.userTeamId || fixture.awayTeamId === gameState.userTeamId)).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0] ? `${formatDateDisplay(gameState.seasonFixtures.filter((fixture) => new Date(fixture.date) >= new Date(gameState.currentDate) && (fixture.homeTeamId === gameState.userTeamId || fixture.awayTeamId === gameState.userTeamId)).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0].date)} vs ${teams.find((team) => team.id === (gameState.seasonFixtures.filter((fixture) => new Date(fixture.date) >= new Date(gameState.currentDate) && (fixture.homeTeamId === gameState.userTeamId || fixture.awayTeamId === gameState.userTeamId)).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0].homeTeamId === gameState.userTeamId ? gameState.seasonFixtures.filter((fixture) => new Date(fixture.date) >= new Date(gameState.currentDate) && (fixture.homeTeamId === gameState.userTeamId || fixture.awayTeamId === gameState.userTeamId)).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0].awayTeamId : gameState.seasonFixtures.filter((fixture) => new Date(fixture.date) >= new Date(gameState.currentDate) && (fixture.homeTeamId === gameState.userTeamId || fixture.awayTeamId === gameState.userTeamId)).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0].homeTeamId))?.name}` : "None scheduled"
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/SimulationCalendar.tsx",
          lineNumber: 181,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(p, { children: [
          "Upcoming Training: ",
          gameState.trainingSessions && gameState.trainingSessions.filter((session) => new Date(session.date) >= new Date(gameState.currentDate)).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0] ? `${formatDateDisplay(gameState.trainingSessions.filter((session) => new Date(session.date) >= new Date(gameState.currentDate)).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0].date)} (${gameState.trainingSessions.filter((session) => new Date(session.date) >= new Date(gameState.currentDate)).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0].focus})` : "None scheduled"
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/SimulationCalendar.tsx",
          lineNumber: 185,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime5.jsxDEV)(p, { children: [
          "Pending Press Conferences: ",
          gameState.pressConferences?.filter((presser) => new Date(presser.date) >= new Date(gameState.currentDate) && !presser.completed).length || 0
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/SimulationCalendar.tsx",
          lineNumber: 189,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/AFLManager/SimulationCalendar.tsx",
        lineNumber: 180,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "app/components/AFLManager/SimulationCalendar.tsx",
        lineNumber: 179,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/AFLManager/SimulationCalendar.tsx",
      lineNumber: 177,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/AFLManager/SimulationCalendar.tsx",
    lineNumber: 105,
    columnNumber: 10
  }, this);
}
_s4(SimulationCalendar, "Y9XElcUJLbPIurNn7T4x6bqzCik=");
_c5 = SimulationCalendar;
var _c5;
$RefreshReg$(_c5, "SimulationCalendar");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

// app/components/AFLManager/Training.tsx
var import_react5 = __toESM(require_react(), 1);
var import_jsx_dev_runtime6 = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\components\\\\AFLManager\\\\Training.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s5 = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\components\\AFLManager\\Training.tsx"
  );
  import.meta.hot.lastModified = "1747543677761.1943";
}
function Training({
  gameState,
  allPlayers,
  selectedDate,
  onScheduleTraining,
  onCancel
}) {
  _s5();
  const [selectedFocus, setSelectedFocus] = (0, import_react5.useState)("fitness");
  const [selectedIntensity, setSelectedIntensity] = (0, import_react5.useState)("medium");
  const [selectedPlayers, setSelectedPlayers] = (0, import_react5.useState)([]);
  const teamPlayers = allPlayers.filter((player) => player.teamId === gameState.userTeamId);
  const togglePlayerSelection = (playerId) => {
    if (selectedPlayers.includes(playerId)) {
      setSelectedPlayers(selectedPlayers.filter((id) => id !== playerId));
    } else {
      setSelectedPlayers([...selectedPlayers, playerId]);
    }
  };
  const selectAllPlayers = () => {
    setSelectedPlayers(teamPlayers.map((player) => player.id));
  };
  const deselectAllPlayers = () => {
    setSelectedPlayers([]);
  };
  const handleSubmit = () => {
    onScheduleTraining(selectedDate, selectedFocus, selectedIntensity, selectedPlayers.length > 0 ? selectedPlayers : teamPlayers.map((player) => player.id));
  };
  return /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)(p2, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)(o2, { style: {
    maxWidth: "800px",
    margin: "0 auto"
  }, children: /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)(p3, { direction: "column", gap: "4", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)(r, { size: "5", children: "Schedule Training Session" }, void 0, false, {
      fileName: "app/components/AFLManager/Training.tsx",
      lineNumber: 66,
      columnNumber: 11
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)(p, { children: [
      "Date: ",
      selectedDate
    ] }, void 0, true, {
      fileName: "app/components/AFLManager/Training.tsx",
      lineNumber: 67,
      columnNumber: 11
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)(p2, { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)(p, { weight: "bold", mb: "2", children: "Training Focus" }, void 0, false, {
        fileName: "app/components/AFLManager/Training.tsx",
        lineNumber: 70,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)(radio_group_exports.Root, { value: selectedFocus, onValueChange: (value) => setSelectedFocus(value), children: /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)(p3, { gap: "3", wrap: "wrap", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)(radio_group_exports.Item, { value: "attack", children: "Attack" }, void 0, false, {
          fileName: "app/components/AFLManager/Training.tsx",
          lineNumber: 73,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)(radio_group_exports.Item, { value: "defense", children: "Defense" }, void 0, false, {
          fileName: "app/components/AFLManager/Training.tsx",
          lineNumber: 76,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)(radio_group_exports.Item, { value: "fitness", children: "Fitness" }, void 0, false, {
          fileName: "app/components/AFLManager/Training.tsx",
          lineNumber: 79,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)(radio_group_exports.Item, { value: "teamwork", children: "Teamwork" }, void 0, false, {
          fileName: "app/components/AFLManager/Training.tsx",
          lineNumber: 82,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)(radio_group_exports.Item, { value: "set_pieces", children: "Set Pieces" }, void 0, false, {
          fileName: "app/components/AFLManager/Training.tsx",
          lineNumber: 85,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)(radio_group_exports.Item, { value: "recovery", children: "Recovery" }, void 0, false, {
          fileName: "app/components/AFLManager/Training.tsx",
          lineNumber: 88,
          columnNumber: 17
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/AFLManager/Training.tsx",
        lineNumber: 72,
        columnNumber: 15
      }, this) }, void 0, false, {
        fileName: "app/components/AFLManager/Training.tsx",
        lineNumber: 71,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/AFLManager/Training.tsx",
      lineNumber: 69,
      columnNumber: 11
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)(p2, { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)(p, { weight: "bold", mb: "2", children: "Training Intensity" }, void 0, false, {
        fileName: "app/components/AFLManager/Training.tsx",
        lineNumber: 96,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)(radio_group_exports.Root, { value: selectedIntensity, onValueChange: (value) => setSelectedIntensity(value), children: /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)(p3, { gap: "3", wrap: "wrap", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)(radio_group_exports.Item, { value: "light", children: "Light" }, void 0, false, {
          fileName: "app/components/AFLManager/Training.tsx",
          lineNumber: 99,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)(radio_group_exports.Item, { value: "medium", children: "Medium" }, void 0, false, {
          fileName: "app/components/AFLManager/Training.tsx",
          lineNumber: 102,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)(radio_group_exports.Item, { value: "intense", children: "Intense" }, void 0, false, {
          fileName: "app/components/AFLManager/Training.tsx",
          lineNumber: 105,
          columnNumber: 17
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/AFLManager/Training.tsx",
        lineNumber: 98,
        columnNumber: 15
      }, this) }, void 0, false, {
        fileName: "app/components/AFLManager/Training.tsx",
        lineNumber: 97,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/AFLManager/Training.tsx",
      lineNumber: 95,
      columnNumber: 11
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)(p2, { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)(p3, { justify: "between", align: "center", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)(p, { weight: "bold", children: "Player Selection" }, void 0, false, {
          fileName: "app/components/AFLManager/Training.tsx",
          lineNumber: 114,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)(p3, { gap: "2", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)(o, { variant: "outline", size: "1", onClick: selectAllPlayers, children: "Select All" }, void 0, false, {
            fileName: "app/components/AFLManager/Training.tsx",
            lineNumber: 116,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)(o, { variant: "outline", size: "1", onClick: deselectAllPlayers, children: "Deselect All" }, void 0, false, {
            fileName: "app/components/AFLManager/Training.tsx",
            lineNumber: 119,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/Training.tsx",
          lineNumber: 115,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/AFLManager/Training.tsx",
        lineNumber: 113,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)(p, { size: "1", color: "gray", mb: "2", children: [
        selectedPlayers.length,
        " of ",
        teamPlayers.length,
        " players selected"
      ] }, void 0, true, {
        fileName: "app/components/AFLManager/Training.tsx",
        lineNumber: 125,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)(o2, { style: {
        maxHeight: "300px",
        overflowY: "auto"
      }, children: /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)(o3, { columns: "2", gap: "2", children: teamPlayers.map((player) => /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)(o2, { style: {
        cursor: "pointer",
        backgroundColor: selectedPlayers.includes(player.id) ? "#2a4c6d" : "#333"
      }, onClick: () => togglePlayerSelection(player.id), children: /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)(p3, { gap: "2", align: "center", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)(p2, { style: {
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          backgroundColor: selectedPlayers.includes(player.id) ? "#60a5fa" : "#555",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }, children: selectedPlayers.includes(player.id) && /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)("span", { style: {
          color: "white",
          fontSize: "12px"
        }, children: "\u2713" }, void 0, false, {
          fileName: "app/components/AFLManager/Training.tsx",
          lineNumber: 148,
          columnNumber: 65
        }, this) }, void 0, false, {
          fileName: "app/components/AFLManager/Training.tsx",
          lineNumber: 139,
          columnNumber: 23
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)(p2, { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)(p, { weight: "bold", children: player.name }, void 0, false, {
            fileName: "app/components/AFLManager/Training.tsx",
            lineNumber: 154,
            columnNumber: 25
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)(p, { size: "1", children: [
            player.position,
            " | Rating: ",
            player.form
          ] }, void 0, true, {
            fileName: "app/components/AFLManager/Training.tsx",
            lineNumber: 155,
            columnNumber: 25
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/AFLManager/Training.tsx",
          lineNumber: 153,
          columnNumber: 23
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/AFLManager/Training.tsx",
        lineNumber: 138,
        columnNumber: 21
      }, this) }, player.id, false, {
        fileName: "app/components/AFLManager/Training.tsx",
        lineNumber: 134,
        columnNumber: 44
      }, this)) }, void 0, false, {
        fileName: "app/components/AFLManager/Training.tsx",
        lineNumber: 133,
        columnNumber: 15
      }, this) }, void 0, false, {
        fileName: "app/components/AFLManager/Training.tsx",
        lineNumber: 129,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/AFLManager/Training.tsx",
      lineNumber: 112,
      columnNumber: 11
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)(p3, { gap: "2", justify: "end", mt: "4", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)(o, { variant: "outline", onClick: onCancel, children: "Cancel" }, void 0, false, {
        fileName: "app/components/AFLManager/Training.tsx",
        lineNumber: 166,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime6.jsxDEV)(o, { onClick: handleSubmit, children: "Schedule Training" }, void 0, false, {
        fileName: "app/components/AFLManager/Training.tsx",
        lineNumber: 169,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/AFLManager/Training.tsx",
      lineNumber: 165,
      columnNumber: 11
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/AFLManager/Training.tsx",
    lineNumber: 65,
    columnNumber: 9
  }, this) }, void 0, false, {
    fileName: "app/components/AFLManager/Training.tsx",
    lineNumber: 61,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "app/components/AFLManager/Training.tsx",
    lineNumber: 60,
    columnNumber: 10
  }, this);
}
_s5(Training, "CjIrLMXoAjl6TlsRZEsciM4dbqo=");
_c6 = Training;
var _c6;
$RefreshReg$(_c6, "Training");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

// app/components/AFLManager/PressConference.tsx
var import_react6 = __toESM(require_react(), 1);
var import_jsx_dev_runtime7 = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\components\\\\AFLManager\\\\PressConference.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s6 = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\components\\AFLManager\\PressConference.tsx"
  );
  import.meta.hot.lastModified = "1747543677758.8257";
}
function PressConference({
  gameState,
  presserId,
  onComplete,
  onCancel
}) {
  _s6();
  const presser = gameState.pressConferences.find((pc) => pc.id === presserId);
  const [selectedAnswers, setSelectedAnswers] = (0, import_react6.useState)(presser ? presser.questions.map((q) => q.options[0]) : []);
  if (!presser) {
    return /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)(p2, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)(o2, { style: {
      maxWidth: "800px",
      margin: "0 auto"
    }, children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)(r, { size: "5", children: "Press Conference Error" }, void 0, false, {
        fileName: "app/components/AFLManager/PressConference.tsx",
        lineNumber: 42,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)(p, { children: "Could not find the requested press conference." }, void 0, false, {
        fileName: "app/components/AFLManager/PressConference.tsx",
        lineNumber: 43,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)(o, { onClick: onCancel, mt: "4", children: "Return to Calendar" }, void 0, false, {
        fileName: "app/components/AFLManager/PressConference.tsx",
        lineNumber: 44,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/AFLManager/PressConference.tsx",
      lineNumber: 38,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/components/AFLManager/PressConference.tsx",
      lineNumber: 37,
      columnNumber: 12
    }, this);
  }
  const handleSelectAnswer = (questionIndex, answer) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[questionIndex] = answer;
    setSelectedAnswers(newAnswers);
  };
  const handleComplete = () => {
    onComplete(presserId, selectedAnswers);
  };
  return /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)(p2, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)(o2, { style: {
    maxWidth: "800px",
    margin: "0 auto"
  }, children: /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)(p3, { direction: "column", gap: "4", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)(p3, { justify: "between", align: "baseline", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)(r, { size: "5", children: "Press Conference" }, void 0, false, {
        fileName: "app/components/AFLManager/PressConference.tsx",
        lineNumber: 67,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)(p, { size: "2", color: "gray", children: presser.date }, void 0, false, {
        fileName: "app/components/AFLManager/PressConference.tsx",
        lineNumber: 68,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/AFLManager/PressConference.tsx",
      lineNumber: 66,
      columnNumber: 11
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)(p2, { children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)(p, { weight: "bold", size: "4", mb: "2", children: presser.topic }, void 0, false, {
        fileName: "app/components/AFLManager/PressConference.tsx",
        lineNumber: 72,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)(p, { size: "2", color: "gray", mb: "4", children: "Answer the questions from the media carefully. Your responses will affect team morale, fan support, and board confidence." }, void 0, false, {
        fileName: "app/components/AFLManager/PressConference.tsx",
        lineNumber: 73,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/AFLManager/PressConference.tsx",
      lineNumber: 71,
      columnNumber: 11
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)(o4, { size: "4" }, void 0, false, {
      fileName: "app/components/AFLManager/PressConference.tsx",
      lineNumber: 79,
      columnNumber: 11
    }, this),
    presser.questions.map((question, index) => /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)(p2, { mb: "4", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)(p, { weight: "bold", mb: "2", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)(p, { color: "blue", style: {
          display: "inline"
        }, children: "Reporter: " }, void 0, false, {
          fileName: "app/components/AFLManager/PressConference.tsx",
          lineNumber: 83,
          columnNumber: 17
        }, this),
        question.question
      ] }, void 0, true, {
        fileName: "app/components/AFLManager/PressConference.tsx",
        lineNumber: 82,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)(radio_group_exports.Root, { value: selectedAnswers[index], onValueChange: (value) => handleSelectAnswer(index, value), children: /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)(p3, { direction: "column", gap: "2", children: question.options.map((option, optionIndex) => /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)(radio_group_exports.Item, { value: option, style: {
        padding: "8px 12px",
        borderRadius: "4px",
        backgroundColor: selectedAnswers[index] === option ? "#2a4c6d" : "transparent",
        border: "1px solid #444"
      }, children: option }, optionIndex, false, {
        fileName: "app/components/AFLManager/PressConference.tsx",
        lineNumber: 91,
        columnNumber: 66
      }, this)) }, void 0, false, {
        fileName: "app/components/AFLManager/PressConference.tsx",
        lineNumber: 90,
        columnNumber: 17
      }, this) }, void 0, false, {
        fileName: "app/components/AFLManager/PressConference.tsx",
        lineNumber: 89,
        columnNumber: 15
      }, this)
    ] }, index, true, {
      fileName: "app/components/AFLManager/PressConference.tsx",
      lineNumber: 81,
      columnNumber: 55
    }, this)),
    /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)(p3, { gap: "2", justify: "end", mt: "4", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)(o, { variant: "outline", onClick: onCancel, children: "Cancel" }, void 0, false, {
        fileName: "app/components/AFLManager/PressConference.tsx",
        lineNumber: 104,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime7.jsxDEV)(o, { onClick: handleComplete, children: "Complete Press Conference" }, void 0, false, {
        fileName: "app/components/AFLManager/PressConference.tsx",
        lineNumber: 107,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/AFLManager/PressConference.tsx",
      lineNumber: 103,
      columnNumber: 11
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/AFLManager/PressConference.tsx",
    lineNumber: 65,
    columnNumber: 9
  }, this) }, void 0, false, {
    fileName: "app/components/AFLManager/PressConference.tsx",
    lineNumber: 61,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "app/components/AFLManager/PressConference.tsx",
    lineNumber: 60,
    columnNumber: 10
  }, this);
}
_s6(PressConference, "edNz80yB+7Zy1wAZ25Bo31c7mDQ=");
_c7 = PressConference;
var _c7;
$RefreshReg$(_c7, "PressConference");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

// app/components/AFLManager/Resignation.tsx
var import_react7 = __toESM(require_react(), 1);
var import_jsx_dev_runtime8 = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\components\\\\AFLManager\\\\Resignation.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s7 = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\components\\AFLManager\\Resignation.tsx"
  );
  import.meta.hot.lastModified = "1747543677758.8257";
}
function Resignation({
  gameState,
  onConfirmResign,
  onCancel
}) {
  _s7();
  const [resignReason, setResignReason] = (0, import_react7.useState)("");
  const [showConfirmation, setShowConfirmation] = (0, import_react7.useState)(false);
  const userTeam = teams.find((team) => team.id === gameState.userTeamId);
  const handleResignRequest = () => {
    setShowConfirmation(true);
  };
  const handleConfirmResign = () => {
    onConfirmResign(resignReason);
  };
  if (!showConfirmation) {
    return /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(p2, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(o2, { style: {
      maxWidth: "800px",
      margin: "0 auto"
    }, children: /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(p3, { direction: "column", gap: "4", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(r, { size: "5", color: "red", children: "Considering Resignation" }, void 0, false, {
        fileName: "app/components/AFLManager/Resignation.tsx",
        lineNumber: 51,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(p, { children: [
        "Are you sure you want to resign as coach of ",
        userTeam?.name,
        "? This action cannot be undone."
      ] }, void 0, true, {
        fileName: "app/components/AFLManager/Resignation.tsx",
        lineNumber: 53,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(p, { size: "2", color: "gray", children: "Your resignation will end your current career, and you'll need to start a new game." }, void 0, false, {
        fileName: "app/components/AFLManager/Resignation.tsx",
        lineNumber: 57,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(p2, { children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(p, { weight: "bold", mb: "2", children: "Reason for Resignation:" }, void 0, false, {
          fileName: "app/components/AFLManager/Resignation.tsx",
          lineNumber: 62,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(r2, { placeholder: "Please provide a reason for your resignation...", value: resignReason, onChange: (e2) => setResignReason(e2.target.value), style: {
          width: "100%",
          minHeight: "120px"
        } }, void 0, false, {
          fileName: "app/components/AFLManager/Resignation.tsx",
          lineNumber: 63,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/AFLManager/Resignation.tsx",
        lineNumber: 61,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(p3, { gap: "2", justify: "end", mt: "4", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(o, { variant: "outline", onClick: onCancel, children: "Cancel" }, void 0, false, {
          fileName: "app/components/AFLManager/Resignation.tsx",
          lineNumber: 70,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(o, { color: "red", onClick: handleResignRequest, disabled: resignReason.trim().length === 0, children: "Submit Resignation" }, void 0, false, {
          fileName: "app/components/AFLManager/Resignation.tsx",
          lineNumber: 73,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "app/components/AFLManager/Resignation.tsx",
        lineNumber: 69,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/AFLManager/Resignation.tsx",
      lineNumber: 50,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "app/components/AFLManager/Resignation.tsx",
      lineNumber: 46,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/components/AFLManager/Resignation.tsx",
      lineNumber: 45,
      columnNumber: 12
    }, this);
  }
  return /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(p2, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(o2, { style: {
    maxWidth: "800px",
    margin: "0 auto"
  }, children: /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(p3, { direction: "column", gap: "4", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(r, { size: "5", color: "red", children: "Confirm Resignation" }, void 0, false, {
      fileName: "app/components/AFLManager/Resignation.tsx",
      lineNumber: 87,
      columnNumber: 11
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(p, { children: [
      "You are about to resign as head coach of ",
      userTeam?.name,
      ". This will end your current career. Are you absolutely sure?"
    ] }, void 0, true, {
      fileName: "app/components/AFLManager/Resignation.tsx",
      lineNumber: 89,
      columnNumber: 11
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(p2, { style: {
      padding: "16px",
      backgroundColor: "#332222",
      borderRadius: "4px",
      border: "1px solid #663333"
    }, children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(p, { weight: "bold", mb: "2", children: "Your Resignation Statement:" }, void 0, false, {
        fileName: "app/components/AFLManager/Resignation.tsx",
        lineNumber: 100,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(p, { style: {
        fontStyle: "italic"
      }, children: [
        '"',
        resignReason,
        '"'
      ] }, void 0, true, {
        fileName: "app/components/AFLManager/Resignation.tsx",
        lineNumber: 101,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/AFLManager/Resignation.tsx",
      lineNumber: 94,
      columnNumber: 11
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(p, { size: "2", color: "gray", children: "Career statistics:" }, void 0, false, {
      fileName: "app/components/AFLManager/Resignation.tsx",
      lineNumber: 106,
      columnNumber: 11
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(p2, { children: /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(p3, { direction: "column", gap: "1", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(p, { children: [
        "Seasons: ",
        1
      ] }, void 0, true, {
        fileName: "app/components/AFLManager/Resignation.tsx",
        lineNumber: 112,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(p, { children: [
        "Win-Loss Record: ",
        gameState.ladder.find((pos) => pos.teamId === gameState.userTeamId)?.wins || 0,
        "-",
        gameState.ladder.find((pos) => pos.teamId === gameState.userTeamId)?.losses || 0
      ] }, void 0, true, {
        fileName: "app/components/AFLManager/Resignation.tsx",
        lineNumber: 113,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(p, { children: [
        "Final Position: ",
        gameState.ladder.sort((a, b) => {
          if (b.points !== a.points)
            return b.points - a.points;
          return b.percentage - a.percentage;
        }).findIndex((pos) => pos.teamId === gameState.userTeamId) + 1
      ] }, void 0, true, {
        fileName: "app/components/AFLManager/Resignation.tsx",
        lineNumber: 117,
        columnNumber: 15
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/AFLManager/Resignation.tsx",
      lineNumber: 111,
      columnNumber: 13
    }, this) }, void 0, false, {
      fileName: "app/components/AFLManager/Resignation.tsx",
      lineNumber: 110,
      columnNumber: 11
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(p3, { gap: "2", justify: "end", mt: "4", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(o, { variant: "outline", onClick: () => setShowConfirmation(false), children: "Go Back" }, void 0, false, {
        fileName: "app/components/AFLManager/Resignation.tsx",
        lineNumber: 127,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime8.jsxDEV)(o, { color: "red", onClick: handleConfirmResign, children: "Confirm Resignation" }, void 0, false, {
        fileName: "app/components/AFLManager/Resignation.tsx",
        lineNumber: 130,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "app/components/AFLManager/Resignation.tsx",
      lineNumber: 126,
      columnNumber: 11
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/AFLManager/Resignation.tsx",
    lineNumber: 86,
    columnNumber: 9
  }, this) }, void 0, false, {
    fileName: "app/components/AFLManager/Resignation.tsx",
    lineNumber: 82,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "app/components/AFLManager/Resignation.tsx",
    lineNumber: 81,
    columnNumber: 10
  }, this);
}
_s7(Resignation, "gUx7m5bEJaDybqgMCM0n5Zvq9IM=");
_c8 = Resignation;
var _c8;
$RefreshReg$(_c8, "Resignation");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

// app/routes/afl-manager.tsx
var import_jsx_dev_runtime9 = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\routes\\\\afl-manager.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s8 = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\routes\\afl-manager.tsx"
  );
  import.meta.hot.lastModified = "1747545755489.4038";
}
var meta = generateMetaTags({
  title: "AFL Manager | Coach Simulation Game",
  description: "Simulate being an AFL head coach - manage your team, set tactics, and lead your club to premiership glory!"
});
function NavItem({
  label,
  active,
  onClick
}) {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)(p2, { onClick, style: {
    padding: "10px 16px",
    backgroundColor: active ? "#3b82f6" : "transparent",
    color: active ? "white" : "#aaa",
    cursor: "pointer",
    borderLeft: active ? "4px solid #60a5fa" : "4px solid transparent",
    transition: "all 0.2s ease"
  }, children: /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)(p, { weight: active ? "bold" : "regular", children: label }, void 0, false, {
    fileName: "app/routes/afl-manager.tsx",
    lineNumber: 60,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "app/routes/afl-manager.tsx",
    lineNumber: 52,
    columnNumber: 10
  }, this);
}
_c9 = NavItem;
function AFLManager() {
  _s8();
  const [gameState, setGameState] = (0, import_react8.useState)(initialGameState);
  const [allPlayers, setAllPlayers] = (0, import_react8.useState)(players);
  const [activeSection, setActiveSection] = (0, import_react8.useState)("dashboard");
  const [showTraining, setShowTraining] = (0, import_react8.useState)(false);
  const [showPressConference, setShowPressConference] = (0, import_react8.useState)(false);
  const [showResignation, setShowResignation] = (0, import_react8.useState)(false);
  const [selectedDate, setSelectedDate] = (0, import_react8.useState)(null);
  const [selectedPresserId, setSelectedPresserId] = (0, import_react8.useState)(null);
  const handleGameStart = (newGameState) => {
    setGameState({
      ...newGameState,
      initialized: true
    });
    const generatedPlayers = [...players];
    teams.forEach((team) => {
      const existingPlayers = players.filter((p4) => p4.teamId === team.id);
      if (existingPlayers.length < 22) {
        const additionalPlayers = generatePlayersForTeam(team.id, 22 - existingPlayers.length);
        generatedPlayers.push(...additionalPlayers);
      }
    });
    setAllPlayers(generatedPlayers);
  };
  const handleAdvanceDay = (0, import_react8.useCallback)(() => {
    const {
      newState,
      dailySummary
    } = advanceGameDay(gameState, teams);
    setGameState(newState);
  }, [gameState]);
  const handleScheduleTraining = (0, import_react8.useCallback)((date) => {
    setSelectedDate(date);
    setShowTraining(true);
  }, []);
  const handleCompleteTrainingSetup = (0, import_react8.useCallback)((date, focus, intensity, playerIds) => {
    const newGameState = scheduleTraining(gameState, date, focus, intensity, playerIds);
    setGameState(newGameState);
    setShowTraining(false);
  }, [gameState]);
  const handleViewPressConference = (0, import_react8.useCallback)((presserId) => {
    setSelectedPresserId(presserId);
    setShowPressConference(true);
  }, []);
  const handleCompletePressConference = (0, import_react8.useCallback)((presserId, answers) => {
    const newGameState = completePresser(gameState, presserId, answers);
    setGameState(newGameState);
    setShowPressConference(false);
  }, [gameState]);
  const handleCancelModal = (0, import_react8.useCallback)(() => {
    setShowTraining(false);
    setShowPressConference(false);
    setShowResignation(false);
  }, []);
  const handleShowResignation = (0, import_react8.useCallback)(() => {
    setShowResignation(true);
  }, []);
  const handleConfirmResignation = (0, import_react8.useCallback)((reason) => {
    setGameState(initialGameState);
    setShowResignation(false);
  }, []);
  const renderContent = () => {
    if (!gameState.initialized) {
      return /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)(GameInitialization, { onGameStart: handleGameStart }, void 0, false, {
        fileName: "app/routes/afl-manager.tsx",
        lineNumber: 154,
        columnNumber: 14
      }, this);
    }
    if (showTraining && selectedDate) {
      return /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)(Training, { gameState, allPlayers, selectedDate, onScheduleTraining: handleCompleteTrainingSetup, onCancel: handleCancelModal }, void 0, false, {
        fileName: "app/routes/afl-manager.tsx",
        lineNumber: 159,
        columnNumber: 14
      }, this);
    }
    if (showPressConference && selectedPresserId) {
      return /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)(PressConference, { gameState, presserId: selectedPresserId, onComplete: handleCompletePressConference, onCancel: handleCancelModal }, void 0, false, {
        fileName: "app/routes/afl-manager.tsx",
        lineNumber: 162,
        columnNumber: 14
      }, this);
    }
    if (showResignation) {
      return /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)(Resignation, { gameState, onConfirmResign: handleConfirmResignation, onCancel: handleCancelModal }, void 0, false, {
        fileName: "app/routes/afl-manager.tsx",
        lineNumber: 165,
        columnNumber: 14
      }, this);
    }
    switch (activeSection) {
      case "dashboard":
        return /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)(Dashboard, { gameState, allPlayers, onAdvanceDay: handleAdvanceDay, onPrepareMatch: (matchId) => {
          const match = gameState.seasonFixtures.find((m) => m.id === matchId);
          if (match) {
            setGameState({
              ...gameState,
              activeMatchId: matchId
            });
            setActiveSection("match");
          }
        }, onSimulateToDate: (date) => {
          console.log(`Simulating to date: ${date}`);
          setGameState({
            ...gameState,
            currentDate: date
          });
        }, lastDailySummary: gameState.lastDailySummary, userPrompts: gameState.userPrompts, onUserPromptAction: (prompt) => {
          console.log(`Handling prompt: ${prompt.id}`);
          setGameState({
            ...gameState,
            userPrompts: gameState.userPrompts.filter((p4) => p4.id !== prompt.id)
          });
        } }, void 0, false, {
          fileName: "app/routes/afl-manager.tsx",
          lineNumber: 169,
          columnNumber: 16
        }, this);
      case "team":
        return /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)(TeamManagement, { gameState, allPlayers }, void 0, false, {
          fileName: "app/routes/afl-manager.tsx",
          lineNumber: 196,
          columnNumber: 16
        }, this);
      case "match":
        return /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)(MatchCenter, { gameState, allPlayers }, void 0, false, {
          fileName: "app/routes/afl-manager.tsx",
          lineNumber: 198,
          columnNumber: 16
        }, this);
      case "league":
        return /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)(League, { gameState, allPlayers }, void 0, false, {
          fileName: "app/routes/afl-manager.tsx",
          lineNumber: 200,
          columnNumber: 16
        }, this);
      case "players":
        return /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)(Players, { gameState, allPlayers }, void 0, false, {
          fileName: "app/routes/afl-manager.tsx",
          lineNumber: 202,
          columnNumber: 16
        }, this);
      case "club":
        return /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)(Club, { gameState, allPlayers }, void 0, false, {
          fileName: "app/routes/afl-manager.tsx",
          lineNumber: 204,
          columnNumber: 16
        }, this);
      case "calendar":
        return /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)(SimulationCalendar, { gameState, allPlayers, onAdvanceDay: handleAdvanceDay, onScheduleTraining: handleScheduleTraining, onViewPressConference: handleViewPressConference, onResign: handleShowResignation }, void 0, false, {
          fileName: "app/routes/afl-manager.tsx",
          lineNumber: 206,
          columnNumber: 16
        }, this);
      default:
        return /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)(Dashboard, { gameState, allPlayers, onAdvanceDay: handleAdvanceDay, onPrepareMatch: (matchId) => {
          const match = gameState.seasonFixtures.find((m) => m.id === matchId);
          if (match) {
            setGameState({
              ...gameState,
              activeMatchId: matchId
            });
            setActiveSection("match");
          }
        } }, void 0, false, {
          fileName: "app/routes/afl-manager.tsx",
          lineNumber: 208,
          columnNumber: 16
        }, this);
    }
  };
  const userTeam = teams.find((team) => team.id === gameState.userTeamId);
  const teamName = userTeam?.name || "AFL Manager";
  (0, import_react8.useEffect)(() => {
    document.body.classList.add("afl-manager-fullscreen");
    return () => {
      document.body.classList.remove("afl-manager-fullscreen");
    };
  }, []);
  return /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)(p2, { className: "afl-manager-container", style: {
    height: "100vh",
    width: "100vw",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden"
  }, children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)(p3, { justify: "between", align: "center", px: "4", py: "2", style: {
      backgroundColor: "#0f0f0f",
      borderBottom: "1px solid #333",
      height: "60px"
    }, children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)(p3, { align: "center", gap: "3", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)(r, { size: "5", style: {
          color: "#fff"
        }, children: gameState.initialized ? teamName : "AFL Manager" }, void 0, false, {
          fileName: "app/routes/afl-manager.tsx",
          lineNumber: 249,
          columnNumber: 11
        }, this),
        gameState.initialized && /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)(p, { size: "2", style: {
          color: "#aaa"
        }, children: [
          "Round ",
          gameState.currentRound
        ] }, void 0, true, {
          fileName: "app/routes/afl-manager.tsx",
          lineNumber: 254,
          columnNumber: 37
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/afl-manager.tsx",
        lineNumber: 248,
        columnNumber: 9
      }, this),
      gameState.initialized && /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)(p3, { gap: "4", align: "center", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)(p2, { style: {
          textAlign: "center"
        }, children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)(p, { size: "1", style: {
            color: "#aaa"
          }, children: "Ladder Position" }, void 0, false, {
            fileName: "app/routes/afl-manager.tsx",
            lineNumber: 265,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)(p, { size: "3", weight: "bold", children: gameState.ladder.sort((a, b) => {
            if (b.points !== a.points)
              return b.points - a.points;
            return b.percentage - a.percentage;
          }).findIndex((pos) => pos.teamId === gameState.userTeamId) + 1 }, void 0, false, {
            fileName: "app/routes/afl-manager.tsx",
            lineNumber: 268,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/afl-manager.tsx",
          lineNumber: 262,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)(p2, { style: {
          textAlign: "center"
        }, children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)(p, { size: "1", style: {
            color: "#aaa"
          }, children: "Record" }, void 0, false, {
            fileName: "app/routes/afl-manager.tsx",
            lineNumber: 279,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)(p, { size: "3", weight: "bold", children: [
            gameState.ladder.find((pos) => pos.teamId === gameState.userTeamId)?.wins || 0,
            " -",
            gameState.ladder.find((pos) => pos.teamId === gameState.userTeamId)?.losses || 0
          ] }, void 0, true, {
            fileName: "app/routes/afl-manager.tsx",
            lineNumber: 282,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/afl-manager.tsx",
          lineNumber: 276,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)(o, { variant: "outline", size: "1", onClick: handleAdvanceDay, style: {
          transition: "all 0.2s ease",
          position: "relative",
          overflow: "hidden"
        }, onMouseDown: (e2) => {
          const button = e2.currentTarget;
          button.style.transform = "scale(0.95)";
          const ripple = document.createElement("span");
          const rect = button.getBoundingClientRect();
          const size = Math.max(rect.width, rect.height) * 2;
          ripple.style.width = ripple.style.height = `${size}px`;
          ripple.style.left = `${e2.clientX - rect.left - size / 2}px`;
          ripple.style.top = `${e2.clientY - rect.top - size / 2}px`;
          ripple.style.position = "absolute";
          ripple.style.borderRadius = "50%";
          ripple.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
          ripple.style.transform = "scale(0)";
          ripple.style.animation = "ripple 0.6s linear";
          button.appendChild(ripple);
          setTimeout(() => {
            ripple.remove();
            button.style.transform = "";
          }, 600);
        }, children: "Continue" }, void 0, false, {
          fileName: "app/routes/afl-manager.tsx",
          lineNumber: 288,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/afl-manager.tsx",
        lineNumber: 261,
        columnNumber: 35
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/afl-manager.tsx",
      lineNumber: 243,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)(p3, { style: {
      flex: 1,
      overflow: "hidden"
    }, children: [
      gameState.initialized && /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)(p2, { style: {
        width: "200px",
        backgroundColor: "#222",
        borderRight: "1px solid #333",
        padding: "16px 0",
        overflowY: "auto"
      }, children: /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)(p3, { direction: "column", gap: "1", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)(NavItem, { label: "Dashboard", active: activeSection === "dashboard", onClick: () => setActiveSection("dashboard") }, void 0, false, {
          fileName: "app/routes/afl-manager.tsx",
          lineNumber: 333,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)(NavItem, { label: "Team", active: activeSection === "team", onClick: () => setActiveSection("team") }, void 0, false, {
          fileName: "app/routes/afl-manager.tsx",
          lineNumber: 334,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)(NavItem, { label: "Match Center", active: activeSection === "match", onClick: () => setActiveSection("match") }, void 0, false, {
          fileName: "app/routes/afl-manager.tsx",
          lineNumber: 335,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)(NavItem, { label: "League", active: activeSection === "league", onClick: () => setActiveSection("league") }, void 0, false, {
          fileName: "app/routes/afl-manager.tsx",
          lineNumber: 336,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)(NavItem, { label: "Players", active: activeSection === "players", onClick: () => setActiveSection("players") }, void 0, false, {
          fileName: "app/routes/afl-manager.tsx",
          lineNumber: 337,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)(NavItem, { label: "Club", active: activeSection === "club", onClick: () => setActiveSection("club") }, void 0, false, {
          fileName: "app/routes/afl-manager.tsx",
          lineNumber: 338,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)(NavItem, { label: "Calendar", active: activeSection === "calendar", onClick: () => setActiveSection("calendar") }, void 0, false, {
          fileName: "app/routes/afl-manager.tsx",
          lineNumber: 339,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/afl-manager.tsx",
        lineNumber: 332,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "app/routes/afl-manager.tsx",
        lineNumber: 325,
        columnNumber: 35
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime9.jsxDEV)(p2, { style: {
        flex: 1,
        padding: gameState.initialized ? "20px" : "0",
        overflowY: "auto",
        backgroundColor: "#2a2a2a"
      }, children: renderContent() }, void 0, false, {
        fileName: "app/routes/afl-manager.tsx",
        lineNumber: 344,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/afl-manager.tsx",
      lineNumber: 320,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/afl-manager.tsx",
    lineNumber: 235,
    columnNumber: 10
  }, this);
}
_s8(AFLManager, "QJH54+QIAbQdNw0r4jB6cvPcJW4=");
_c22 = AFLManager;
var _c9;
var _c22;
$RefreshReg$(_c9, "NavItem");
$RefreshReg$(_c22, "AFLManager");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  AFLManager as default,
  meta
};
//# sourceMappingURL=/build/routes/afl-manager-6FKDCLGH.js.map
