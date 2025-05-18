import { Card, Flex, Heading, Text, Box, Button, Separator, Grid, Badge, Callout } from "@radix-ui/themes";
import { GameState, Match, LadderPosition, UserPrompt } from "~/data/AFLManager/gameState";
import { Team, teams } from "~/data/AFLManager/teams";
import { Player } from "~/data/AFLManager/players";
import { InfoCircledIcon, ExclamationTriangleIcon, ChevronRightIcon, PlayIcon, CheckCircledIcon } from '@radix-ui/react-icons';
import { useState } from "react";
import moment from 'moment';

interface DashboardProps {
  gameState: GameState;
  allPlayers: Player[];
  onAdvanceDay: () => void;
  onPrepareMatch: (matchId: string) => void;
  onSimulateToDate?: (targetDate: string) => void;
  lastDailySummary?: string[] | null;
  userPrompts?: UserPrompt[];
  onUserPromptAction?: (prompt: UserPrompt) => void;
}

export default function Dashboard({ gameState, allPlayers, onAdvanceDay, onPrepareMatch, onSimulateToDate, lastDailySummary, userPrompts, onUserPromptAction }: DashboardProps) {

  // Get user team
  const userTeam = teams.find(team => team.id === gameState.userTeamId);
  
  if (!userTeam) {
    return <Text>Error: Team not found</Text>;
  }
  
  // Get upcoming matches
  const upcomingMatches = gameState.seasonFixtures
    .filter(match => 
      match.round >= gameState.currentRound && 
      !match.completed &&
      (match.homeTeamId === gameState.userTeamId || match.awayTeamId === gameState.userTeamId)
    )
    .slice(0, 3);
  
  // Get team position in ladder
  const sortedLadder = [...gameState.ladder].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return b.percentage - a.percentage;
  });
  const teamLadderPosition = gameState.ladder.find(pos => pos.teamId === gameState.userTeamId);
  const ladderPosition = teamLadderPosition 
    ? sortedLadder.findIndex(pos => pos.teamId === gameState.userTeamId) + 1
    : "N/A";
  
  // Get team players
  const teamPlayers = allPlayers.filter(player => player.teamId === gameState.userTeamId);
  
  // Calculate squad status metrics
  const totalTeamPlayersCount = teamPlayers.length;

  // Rule 4.1.3 Player Status Types - adjusted for available data
  // Players at peak fitness (100)
  const availableAtPeakFitnessPlayersCount = teamPlayers.filter(
    (player: Player) => player.fitness === 100
  ).length;
  
  // Players with fitness below 100 are considered to have fitness concerns.
  const playersWithFitnessConcernsCount = teamPlayers.filter(
    (player: Player) => player.fitness < 100 
  ).length;

  // Suspended player count is commented out as 'isSuspended' or equivalent is not in Player type.
  // To re-integrate, ensure Player type has a boolean field like 'isSuspended'.
  // const suspendedPlayersCount = teamPlayers.filter(player => player.isSuspended).length;

  // Rule 4.1.4 Squad Harmony - using gameState.morale (0-100)
  const teamMoraleDisplay = gameState.morale !== undefined 
    ? `${gameState.morale}/100`
    : "N/A";
  
  // Get top players
  const topPlayers = [...teamPlayers]
    .sort((a, b) => {
      // Calculate overall rating
      const aRating = (
        a.attributes.speed + 
        a.attributes.strength + 
        a.attributes.stamina + 
        a.attributes.agility + 
        a.attributes.intelligence +
        a.attributes.kicking +
        a.attributes.marking +
        a.attributes.handball +
        a.attributes.tackling
      ) / 9;
      
      const bRating = (
        b.attributes.speed + 
        b.attributes.strength + 
        b.attributes.stamina + 
        b.attributes.agility + 
        b.attributes.intelligence +
        b.attributes.kicking +
        b.attributes.marking +
        b.attributes.handball +
        b.attributes.tackling
      ) / 9;
      
      return bRating - aRating;
    })
    .slice(0, 5);
  
  // Format match date
  const formatMatchDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-AU', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    });
  };
  
  // Get opponent team
  const getOpponentTeam = (match: Match) => {
    const opponentId = match.homeTeamId === gameState.userTeamId 
      ? match.awayTeamId 
      : match.homeTeamId;
    return teams.find(team => team.id === opponentId);
  };
  
  // Get venue for match
  const getMatchVenue = (match: Match) => {
    if (match.homeTeamId === gameState.userTeamId) {
      return userTeam.homeGround + " (Home)";
    } else {
      const awayTeam = teams.find(team => team.id === match.homeTeamId);
      return awayTeam ? awayTeam.homeGround + " (Away)" : match.venue;
    }
  };

  const getTeamNameById = (teamId: string): string => {
    const team = teams.find(t => t.id === teamId);
    return team ? team.name : "Unknown Team";
  };

  const handlePrepareMatch = (matchId: string) => {
    onPrepareMatch(matchId);
  };
  
  // Ladder Snapshot Logic
  const topNTeams = 3;
  const ladderSnapshotTop = sortedLadder.slice(0, topNTeams);
  
  let ladderSnapshotUserWindow: LadderPosition[] = [];
  const userTeamIndex = sortedLadder.findIndex(pos => pos.teamId === gameState.userTeamId);

  if (userTeamIndex !== -1) {
    const startIndex = Math.max(0, userTeamIndex - 1);
    const endIndex = Math.min(sortedLadder.length, userTeamIndex + 2);
    ladderSnapshotUserWindow = sortedLadder.slice(startIndex, endIndex);
    if (userTeamIndex < topNTeams) { 
      // If user is in top N, the window might be redundant or show already displayed teams.
      // No special handling here yet to avoid over-complexity.
    }
  }

  // Player Development Spotlight Logic
  const noteworthyPlayerDevelopment = gameState.playerDevelopment?.find(
    pd => pd.currentRating > pd.startOfSeasonRating
  );
  let significantAttributeChange: { attribute: string; change: number } | null = null;
  if (noteworthyPlayerDevelopment?.attributeChanges) {
    for (const [attr, change] of Object.entries(noteworthyPlayerDevelopment.attributeChanges)) {
      if (change > 0) { // Highlight a positive change
        significantAttributeChange = { attribute: attr, change };
        break;
      }
    }
  }

  // Format current game date for Season Status card
  const formatCurrentGameDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-AU', { 
      year: 'numeric',
      month: 'long', 
      day: 'numeric', 
      weekday: 'long'
    });
  };

  // --- QoL Calendar Enhancements Start ---
  const getCurrentWeekDates = (currentDateStr: string): Date[] => {
    const dates: Date[] = [];
    const today = new Date(currentDateStr);
    const currentDayOfWeek = today.getDay(); // Sunday - 0, Monday - 1, ..., Saturday - 6
    // Adjust to make Monday the start of the week (0 for Monday, 6 for Sunday)
    const adjustedDayOfWeek = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;

    const monday = new Date(today);
    monday.setDate(today.getDate() - adjustedDayOfWeek);

    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      dates.push(day);
    }
    return dates;
  };

  const weekDates = getCurrentWeekDates(gameState.currentDate);
  
  const dailyActivities = weekDates.map(date => {
    const dateStr = date.toISOString().split('T')[0];
    const userMatch = gameState.seasonFixtures.find(m => 
      m.date === dateStr && 
      (m.homeTeamId === gameState.userTeamId || m.awayTeamId === gameState.userTeamId)
    );
    const training = gameState.trainingSessions.find(ts => ts.date === dateStr && !ts.completed);
    return {
      date,
      dateStr,
      isToday: dateStr === gameState.currentDate,
      userMatch,
      training
    };
  });

  const upcomingKeyEvents: { name: string; date: string; type: string }[] = [];
  const currentPhaseDetails = gameState.seasonPhases.find(p => p.id === gameState.currentPhase);
  
  if (currentPhaseDetails) {
    currentPhaseDetails.keyEvents
      .filter(event => new Date(event.date) >= new Date(gameState.currentDate))
      .forEach(event => upcomingKeyEvents.push({ name: event.name, date: event.date, type: event.type }));
  }
  gameState.specialRounds
    .filter(sr => new Date(sr.startDate) >= new Date(gameState.currentDate))
    .forEach(sr => upcomingKeyEvents.push({ name: sr.name, date: sr.startDate, type: 'special_round' }));

  upcomingKeyEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const nextThreeKeyEvents = upcomingKeyEvents.slice(0, 3);
  // --- QoL Calendar Enhancements End ---

  // --- Logic for main Advance Day / Play Match button ---
  const todayUserMatch = gameState.seasonFixtures.find(match => 
    match.date === gameState.currentDate && 
    !match.completed &&
    (match.homeTeamId === gameState.userTeamId || match.awayTeamId === gameState.userTeamId)
  );

  let mainButtonText = "Advance Day";
  let mainButtonAction = onAdvanceDay;
  let mainButtonDisabled = !!gameState.activeMatchId; // Default: disable if any match is active
  let mainButtonTitle = gameState.activeMatchId ? "Complete active match process first" : "Advance to next day";
  let mainButtonColor: "green" | "blue" | "gray" = "green";

  // New logic for disabling button due to user prompts
  if (userPrompts && userPrompts.length > 0) {
    mainButtonDisabled = true;
    mainButtonTitle = "Resolve pending prompts before advancing";
    mainButtonColor = "gray";
  }

  if (todayUserMatch && !gameState.activeMatchId && (!userPrompts || userPrompts.length === 0)) {
    mainButtonText = "Go to Match";
    mainButtonAction = () => onPrepareMatch(todayUserMatch.id);
    mainButtonDisabled = false; // Explicitly enable if it's user's match day and no other interaction
    mainButtonTitle = `Prepare for your match: ${userTeam.name} vs ${getTeamNameById(todayUserMatch.homeTeamId === userTeam.id ? todayUserMatch.awayTeamId : todayUserMatch.homeTeamId)}`;
    mainButtonColor = "blue";
  } else if (gameState.activeMatchId) {
    // If a match is active (could be today's user match in a specific phase, or another match)
    // The individual match button logic (getMatchButtonTextAndAction) will handle its state.
    // The main button should remain disabled if an active match ID exists, to avoid conflicting actions.
    mainButtonText = "Advance Day"; // Or could be context-specific like "Match in Progress"
    mainButtonAction = onAdvanceDay; // Action remains advance day but it's disabled
    mainButtonDisabled = true;
    mainButtonTitle = "A match interaction is currently in progress. Please resolve it via the 'Upcoming Matches' card.";
  }
  
  // --- End of Logic for main Advance Day / Play Match button ---


  return (
    <Box>
      <Flex justify="between" align="center" mb="4">
        <Heading size="6">Dashboard</Heading>
        <Button 
          size="3" 
          variant="solid" 
          disabled={mainButtonDisabled}
          title={mainButtonTitle}
          color={mainButtonColor}
        >
          {mainButtonColor === "blue" ? <PlayIcon /> : mainButtonColor === "gray" ? <InfoCircledIcon /> : <ChevronRightIcon />} {mainButtonText}
        </Button>
      </Flex>
      
      {/* User Prompts Display */}
      {userPrompts && userPrompts.length > 0 && (
        <Box my="4">
          {userPrompts.map((prompt) => (
            <Callout.Root key={prompt.id} color="orange" role="alert" highContrast mb="2">
              <Callout.Icon>
                <ExclamationTriangleIcon />
              </Callout.Icon>
              <Callout.Text mr="3">{prompt.message}</Callout.Text>
              {onUserPromptAction && (
                <Button 
                  size="1" 
                  variant="soft" 
                  color="orange"
                  onClick={() => onUserPromptAction(prompt)}
                  style={{ cursor: 'pointer' }}
                >
                  {prompt.type === 'decision' ? 'Decide' : prompt.requiresAcknowledgement ? 'Acknowledge' : 'View Details'}
                </Button>
              )}
            </Callout.Root>
          ))}
        </Box>
      )}

      {/* Last Day's Events Display */}
      {lastDailySummary && lastDailySummary.length > 0 && (
        <Card mt="4" mb="4">
          <Heading size="3" mb="2">Last Day's Events</Heading>
          <Flex direction="column" gap="1">
            {lastDailySummary.map((event, index) => (
              <Text key={index} size="2" color="gray"> - {event}</Text>
            ))}
          </Flex>
        </Card>
      )}
      
      <Grid columns={{ initial: "1", md: "2", lg: "3" }} gap="4">
        {/* Team Overview */}
        <Card variant="surface">
          <Flex justify="between" align="center" mb="2">
            <Heading size="4">{userTeam.name}</Heading>
            <Badge size="1" color="blue">Round {gameState.currentRound}</Badge>
          </Flex>
          
          <Text size="2" color="gray" mb="3">Season {gameState.currentSeason}</Text>
          
          <Separator size="4" my="3" />
          
          <Grid columns="2" gap="3" width="auto">
            <Box>
              <Text size="2" weight="bold">Ladder Position</Text>
              <Text>{ladderPosition !== "N/A" ? `${ladderPosition}` : "N/A"}</Text>
            </Box>
            
            <Box>
              <Text size="2" weight="bold">Record</Text>
              <Text>
                {teamLadderPosition ? 
                  `${teamLadderPosition.wins} W - ${teamLadderPosition.losses} L - ${teamLadderPosition.draws} D` : 
                  "0 W - 0 L - 0 D"}
              </Text>
            </Box>
            
            <Box>
              <Text size="2" weight="bold">Points</Text>
              <Text>{teamLadderPosition?.points || 0}</Text>
            </Box>
            
            <Box>
              <Text size="2" weight="bold">Percentage</Text>
              <Text>
                {teamLadderPosition ? 
                  `${teamLadderPosition.percentage.toFixed(2)}%` : 
                  "0.00%"}
              </Text>
            </Box>
          </Grid>
        </Card>
        
        {/* Season Status - MODIFIED CARD to This Week & Upcoming Events */}
        <Card variant="surface">
          <Heading size="4" mb="2">This Week & Upcoming</Heading>
          <Grid columns={{ initial: "1", sm: "2" }} gap="3" width="auto" mb="3">
            <Box>
              <Text size="2" weight="bold">Current Date</Text>
              <Text>{formatCurrentGameDate(gameState.currentDate)}</Text>
            </Box>
            <Box>
              <Text size="2" weight="bold">Season / Round / Phase</Text>
              <Text>
                {gameState.currentSeason} / R{gameState.currentRound} / <span style={{ textTransform: 'capitalize' }}>{gameState.currentPhase.replace(/_/g, ' ')}</span>
              </Text>
            </Box>
          </Grid>

          <Separator size="4" my="3" />

          <Heading size="3" mb="2">This Week's Agenda</Heading>
          <Grid columns="7" gap="1" mb="3" style={{textAlign: 'center'}}>
            {dailyActivities.map((activity) => {
              const isClickable = onSimulateToDate && 
                                !activity.isToday && 
                                new Date(activity.dateStr) > new Date(gameState.currentDate) && 
                                !gameState.activeMatchId &&
                                (!userPrompts || userPrompts.length === 0); // Added prompt check for clickable days
              
              const buttonStyle: React.CSSProperties = {
                textAlign: 'left',
                width: '100%',
                cursor: isClickable ? 'pointer' : 'default',
                opacity: isClickable || activity.isToday ? 1 : 0.7,
              };
              const dayDate = activity.date.getDate();
              const dayName = activity.date.toLocaleDateString('en-AU', { weekday: 'short' });

              let title = `Events for ${dayName}, ${dayDate}`;
              if (isClickable) {
                title = `Simulate to ${dayName}, ${dayDate}`;
              } else if (gameState.activeMatchId) {
                title = "Resolve active match before simulating.";
              } else if (userPrompts && userPrompts.length > 0) {
                title = "Resolve pending prompts before simulating.";
              }

              return (
                <Box 
                  key={activity.dateStr} 
                  p="1" 
                  onClick={isClickable ? () => onSimulateToDate(activity.dateStr) : undefined}
                  style={buttonStyle}
                  title={title}
                  onMouseEnter={(e: React.MouseEvent) => {
                    if (isClickable) (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--gray-a3)';
                  }}
                  onMouseLeave={(e: React.MouseEvent) => {
                    if (isClickable) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                  }}
                >
                  <Text size="1" weight={activity.isToday ? "bold" : "regular"}>
                    {dayName}
                  </Text>
                  
                  <Text size="1" color="gray">
                    {dayDate}
                  </Text>
                  
                  
                  {activity.userMatch && (
                    <Badge 
                      color={activity.userMatch.completed ? "gray" : "red"} 
                      variant="soft" 
                      mt="1"
                      style={{ display: 'inline-flex', alignItems: 'center' }}
                    >
                      <PlayIcon style={{ marginRight: '4px' }} />
                      {activity.userMatch.completed ? "Played vs" : "Match vs"} {getTeamNameById(activity.userMatch.homeTeamId === gameState.userTeamId ? activity.userMatch.awayTeamId : activity.userMatch.homeTeamId)}
                    </Badge>
                  )}
                  
                  {activity.training && (
                    <Badge 
                      color={activity.training.completed ? "gray" : "cyan"} 
                      variant="soft" 
                      mt="1"
                      style={{ display: 'inline-flex', alignItems: 'center' }}
                    >
                      <CheckCircledIcon style={{ marginRight: '4px' }}/>
                      {activity.training.focus} Training {activity.training.completed ? "(Done)" : ""}
                    </Badge>
                  )}
                  
                  {!activity.userMatch && !activity.training && activity.isToday && (
                    <Text size="1" color="gray" mt="1" >No scheduled events.</Text>
                  )}
                  
                  {!activity.userMatch && !activity.training && !activity.isToday && (
                    <Text size="1" color="gray" mt="1" >-</Text>
                  )}
                </Box>
              );
            })}
          </Grid>
          
          <Separator size="4" my="3" />

          <Heading size="3" mb="2">Next Key Events</Heading>
          {nextThreeKeyEvents.length > 0 ? (
            <Flex direction="column" gap="2">
              {nextThreeKeyEvents.map((event, index) => (
                <Card key={index} size="1" variant="surface">
                  <Flex justify="between" align="center">
                    <Box>
                      <Text weight="bold" style={{textTransform: 'capitalize'}}>{event.name}</Text>
                      <Text size="2" color="gray">{formatMatchDate(event.date)}</Text>
                    </Box>
                    <Badge color="purple" style={{textTransform: 'capitalize'}}>
                      {event.type.replace(/_/g, ' ')}
                    </Badge>
                  </Flex>
                </Card>
              ))}
            </Flex>
          ) : (
            <Text color="gray">No major upcoming events scheduled in the near future.</Text>
          )}
        </Card>
        
        {/* Club Health - NEW CARD */}
        <Card variant="surface">
          <Heading size="4" mb="2">Club Health</Heading>
          <Grid columns={{ initial: "1", sm: "2" }} gap="3" width="auto">
            <Box>
              <Text size="2" weight="bold">Board Confidence</Text>
              <Flex align="center" gap="2">
                <Text size="5" weight="bold">{gameState.boardConfidence}%</Text>
                {/* Optional: Add a small trend indicator if data exists */}
              </Flex>
            </Box>
            <Box>
              <Text size="2" weight="bold">Fan Support</Text>
              <Flex align="center" gap="2">
                <Text size="5" weight="bold">{gameState.fanSupport}%</Text>
              </Flex>
            </Box>
            <Box style={{ gridColumn: "1 / -1" }}> 
              <Text size="2" weight="bold">Overall Team Morale</Text>
              <Flex align="center" gap="2">
                <Text size="5" weight="bold">{gameState.morale}%</Text>
              </Flex>
            </Box>
          </Grid>
        </Card>
        
        {/* Financial Overview */}
        <Card variant="surface">
          <Heading size="4" mb="2">Club Finances</Heading>
          
          <Grid columns="2" gap="3" width="auto">
            <Box>
              <Text size="2" weight="bold">Balance</Text>
              <Text>${gameState.finances.balance.toLocaleString()}k</Text>
            </Box>
            
            <Box>
              <Text size="2" weight="bold">Weekly Wage</Text>
              <Text>${gameState.finances.weeklyWage.toLocaleString()}k</Text>
            </Box>
            
            <Box>
              <Text size="2" weight="bold">Sponsorships</Text>
              <Text>${gameState.finances.sponsorships.toLocaleString()}k</Text>
            </Box>
            
            <Box>
              <Text size="2" weight="bold">Match Day Revenue</Text>
              <Text>${gameState.finances.matchDayRevenue.toLocaleString()}k</Text>
            </Box>
          </Grid>
        </Card>
        
        {/* Squad Status */}
        <Card variant="surface">
          <Heading size="4" mb="2">Squad Status</Heading>
          <Grid columns="2" gap="3" width="auto">
            <Box>
              <Text size="2" weight="bold">Total Players</Text>
              <Text>{totalTeamPlayersCount}</Text>
            </Box>
            <Box>
              <Text size="2" weight="bold">Peak Fitness</Text>
              <Text>{availableAtPeakFitnessPlayersCount}</Text>
            </Box>
            <Box>
              <Text size="2" weight="bold">Fitness Concerns</Text>
              <Text color={playersWithFitnessConcernsCount > 0 ? "orange" : undefined}>
                {playersWithFitnessConcernsCount}
              </Text>
            </Box>
            {/* Placeholder for Suspended Players count. 
                To enable, add a field like 'isSuspended: boolean' to Player type 
                and uncomment the logic above and the JSX block below.
            <Box>
              <Text size="2" weight="bold">Suspended</Text>
              <Text color={suspendedPlayersCount > 0 ? "red" : undefined}>{suspendedPlayersCount}</Text>
            </Box> 
            */}
            <Box>
              <Text size="2" weight="bold">Team Morale</Text>
              <Text>{teamMoraleDisplay}</Text>
            </Box>
          </Grid>
