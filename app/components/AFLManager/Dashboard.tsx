import { Card, Flex, Heading, Text, Box, Button, Separator, Grid, Badge, Callout } from "@radix-ui/themes";
import { GameState, Match, LadderPosition, UserPrompt } from "~/data/AFLManager/gameState";
import { Team, teams } from "~/data/AFLManager/teams";
import { Player } from "~/data/AFLManager/players";
import { InfoCircledIcon, ExclamationTriangleIcon, ChevronRightIcon, PlayIcon, CheckCircledIcon } from '@radix-ui/react-icons';

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
    // console.log(`Preparing for match: ${matchId}. User team ID: ${gameState.userTeamId}`);
    // alert(`Preparing for match ID: ${matchId}. Check console for more details.`);
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
    // Ensure this window doesn't overlap entirely with topNTeams if user is near the top
    // This is a simple way; more complex logic could merge/deduplicate if user is in top N
    if (userTeamIndex < topNTeams) { 
      // If user is in top N, the window might be redundant or show already displayed teams.
      // For now, we'll allow it, but it could be refined.
      // If user is, say, 1st, window is (0, 2) -> 0, 1. TopN is (0,3) -> 0,1,2
      // If user is 3rd, window is (2,4) -> 2,3. TopN is (0,3) -> 0,1,2
      // No special handling here yet to avoid over-complexity in this step.
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

  // 1. Start with default state (Advance Day)
  let mainButtonText = "Advance Day";
  let mainButtonAction = onAdvanceDay;
  let mainButtonDisabled = false;
  let mainButtonTitle = "Advance to next day";
  let mainButtonColor: "green" | "blue" | "gray" = "green";

  // 2. Check for blocking conditions in priority order
  
  // First priority: Active match takes precedence
  if (gameState.activeMatchId) {
    mainButtonDisabled = true;
    mainButtonTitle = "A match interaction is currently in progress. Please resolve it via the 'Upcoming Matches' card.";
    mainButtonColor = "gray";
  } 
  // Second priority: User prompts need resolution
  else if (userPrompts && userPrompts.length > 0) {
    mainButtonDisabled = true;
    mainButtonTitle = "Resolve pending prompts before advancing";
    mainButtonColor = "gray";
  }
  // Third priority: User match today
  else if (todayUserMatch) {
    mainButtonText = "Go to Match";
    mainButtonAction = () => onPrepareMatch(todayUserMatch.id);
    mainButtonTitle = `Prepare for your match: ${userTeam.name} vs ${getTeamNameById(
      todayUserMatch.homeTeamId === userTeam.id ? todayUserMatch.awayTeamId : todayUserMatch.homeTeamId
    )}`;
    mainButtonColor = "blue";
  }
  // Default is already set: Advance Day (green)
  
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
          onClick={mainButtonAction} // Added onClick handler to execute the appropriate action
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
              {onUserPromptAction && ( // Simplified button logic
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
                    <Badge color="purple" style={{textTransform: 'capitalize'}}>{event.type.replace(/_/g, ' ')}</Badge>
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
            <Box style={{ gridColumn: "1 / -1" }}> {/* Span full width if only three items or make it fit with others */}
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
        </Card>
        
        {/* Match Center Integration */}
        <Card variant="surface" style={{ gridColumn: "1 / -1" }}>
          <Heading size="4" mb="3">Match Center</Heading>
          
          <Tabs.Root defaultValue="nextMatch">
            <Tabs.List>
              <Tabs.Trigger value="nextMatch">Next Match</Tabs.Trigger>
              <Tabs.Trigger value="fixtures">Fixtures</Tabs.Trigger>
              <Tabs.Trigger value="results">Recent Results</Tabs.Trigger>
            </Tabs.List>
            
            <Box pt="3">
              {/* Next Match Tab */}
              <Tabs.Content value="nextMatch">
                {upcomingMatches.length > 0 ? (
                  <Box>
                    {(() => {
                      const nextMatch = upcomingMatches[0];
                      const opponent = getOpponentTeam(nextMatch);
                      
                      if (!opponent) return <Text>Match details not available</Text>;
                      
                      const homeTeam = nextMatch.homeTeamId === gameState.userTeamId ? userTeam : opponent;
                      const awayTeam = nextMatch.homeTeamId === gameState.userTeamId ? opponent : userTeam;
                      const isUserTeamHome = nextMatch.homeTeamId === gameState.userTeamId;
                      
                      return (
                        <>
                          <Flex justify="between" align="center" mb="3">
                            <Box>
                              <Badge size="1">Round {nextMatch.round}</Badge>
                              <Text size="2" color="gray" mt="1">{formatMatchDate(nextMatch.date)}</Text>
                              <Text size="2">{getMatchVenue(nextMatch)}</Text>
                            </Box>
                            
                            {nextMatch.round === gameState.currentRound && (
                              <Button 
                                size="2" 
                                variant="solid" 
                                color="blue"
                                onClick={() => handlePrepareMatch(nextMatch.id)}
                              >
                                Prepare for Match
                              </Button>
                            )}
                          </Flex>
                          
                          <Card variant="classic" mb="4">
                            <Flex justify="between" align="center">
                              <Flex direction="column" align="center" style={{ flex: 1 }}>
                                <Box style={{ 
                                  width: '60px', 
                                  height: '60px', 
                                  borderRadius: '50%', 
                                  backgroundColor: homeTeam.colors?.primary || '#333',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: 'white',
                                  fontWeight: 'bold',
                                  marginBottom: '8px'
                                }}>
                                  {homeTeam.name.substring(0, 3).toUpperCase()}
                                </Box>
                                <Text weight="bold">{homeTeam.name}</Text>
                                {isUserTeamHome && <Badge size="1">Your Team</Badge>}
                              </Flex>
                              
                              <Box style={{ flex: 1, textAlign: 'center' }}>
                                <Text size="8" weight="bold">vs</Text>
                              </Box>
                              
                              <Flex direction="column" align="center" style={{ flex: 1 }}>
                                <Box style={{ 
                                  width: '60px', 
                                  height: '60px', 
                                  borderRadius: '50%', 
                                  backgroundColor: awayTeam.colors?.primary || '#666',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: 'white',
                                  fontWeight: 'bold',
                                  marginBottom: '8px'
                                }}>
                                  {awayTeam.name.substring(0, 3).toUpperCase()}
                                </Box>
                                <Text weight="bold">{awayTeam.name}</Text>
                                {!isUserTeamHome && <Badge size="1">Your Team</Badge>}
                              </Flex>
                            </Flex>
                          </Card>
                          
                          {nextMatch.date === gameState.currentDate && !nextMatch.completed && (
                            <Box>
                              <Heading size="3" mb="2">Match Day!</Heading>
                              <Text mb="2">Today is match day. Get ready for the game against {opponent.name}.</Text>
                              <Flex direction="column" gap="2">
                                <Card variant="surface">
                                  <Flex gap="2" align="center">
                                    <Box style={{ 
                                      width: '32px', 
                                      height: '32px', 
                                      borderRadius: '50%', 
                                      backgroundColor: userTeam.colors?.primary || '#333',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      color: 'white',
                                      fontWeight: 'bold'
                                    }}>
                                      {userTeam.name.substring(0, 1).toUpperCase()}
                                    </Box>
                                    <Text>Review your team selection and tactics</Text>
                                  </Flex>
                                </Card>
                                
                                <Card variant="surface">
                                  <Flex gap="2" align="center">
                                    <Box style={{ 
                                      width: '32px', 
                                      height: '32px', 
                                      borderRadius: '50%', 
                                      backgroundColor: '#7c3aed',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      color: 'white',
                                      fontWeight: 'bold'
                                    }}>
                                      O
                                    </Box>
                                    <Text>Scout opponent information</Text>
                                  </Flex>
                                </Card>
                                
                                <Button 
                                  size="3" 
                                  variant="solid" 
                                  color="blue" 
                                  mt="2" 
                                  onClick={() => handlePrepareMatch(nextMatch.id)}
                                >
                                  Go to Match Day Preparation
                                </Button>
                              </Flex>
                            </Box>
                          )}
                        </>
                      );
                    })()}
                  </Box>
                ) : (
                  <Text color="gray">No upcoming matches scheduled</Text>
                )}
              </Tabs.Content>
              
              {/* Fixtures Tab */}
              <Tabs.Content value="fixtures">
                <Flex direction="column" gap="3">
                  {upcomingMatches.length > 0 ? (
                    upcomingMatches.map(match => {
                      const opponent = getOpponentTeam(match);
                      if (!opponent) return null;
                      
                      return (
                        <Card key={match.id} variant="surface" size="1">
                          <Flex justify="between" align="center">
                            <Box>
                              <Badge size="1">Round {match.round}</Badge>
                              <Text size="3" weight="bold" mt="1">
                                {match.homeTeamId === gameState.userTeamId ? 
                                  <>{userTeam.name} <span style={{ color: '#888' }}>vs</span> {opponent.name}</> : 
                                  <>{opponent.name} <span style={{ color: '#888' }}>vs</span> {userTeam.name}</>}
                              </Text>
                              <Text size="2" color="gray">{formatMatchDate(match.date)}</Text>
                              <Text size="2">{getMatchVenue(match)}</Text>
                            </Box>
                            
                            {match.round === gameState.currentRound && (
                              <Button 
                                size="1" 
                                variant="solid"
                                onClick={() => handlePrepareMatch(match.id)}
                              >
                                Prepare
                              </Button>
                            )}
                          </Flex>
                        </Card>
                      );
                    })
                  ) : (
                    <Text color="gray">No upcoming matches</Text>
                  )}
                </Flex>
              </Tabs.Content>
              
              {/* Recent Results Tab */}
              <Tabs.Content value="results">
                <Flex direction="column" gap="3">
                  {gameState.seasonFixtures
                    .filter(match => 
                      match.completed && 
                      (match.homeTeamId === gameState.userTeamId || match.awayTeamId === gameState.userTeamId)
                    )
                    .sort((a, b) => b.round - a.round)
                    .slice(0, 5)
                    .map(match => {
                      const opponent = getOpponentTeam(match);
                      if (!opponent || !match.result) return null;
                      
                      const userTeamScore = match.homeTeamId === gameState.userTeamId 
                        ? match.result.homeScore 
                        : match.result.awayScore;
                      
                      const opponentScore = match.homeTeamId === gameState.userTeamId 
                        ? match.result.awayScore 
                        : match.result.homeScore;
                      
                      const userTeamWon = userTeamScore.total > opponentScore.total;
                      const draw = userTeamScore.total === opponentScore.total;
                      
                      return (
                        <Card key={match.id} variant="surface" size="1">
                          <Flex justify="between" align="center">
                            <Box>
                              <Badge size="1">Round {match.round}</Badge>
                              <Text size="2" color="gray">{formatMatchDate(match.date)}</Text>
                            </Box>
                            
                            <Flex gap="3" align="center">
                              <Flex direction="column" align="end">
                                <Text weight="bold" color={userTeamWon ? "green" : draw ? undefined : "gray"}>
                                  {userTeam.name}
                                </Text>
                                <Text weight="bold" color={userTeamWon ? "gray" : draw ? undefined : "green"}>
                                  {opponent.name}
                                </Text>
                              </Flex>
                              
                              <Flex direction="column" align="end">
                                <Text weight="bold">
                                  {userTeamScore.goals}.{userTeamScore.behinds} ({userTeamScore.total})
                                </Text>
                                <Text weight="bold">
                                  {opponentScore.goals}.{opponentScore.behinds} ({opponentScore.total})
                                </Text>
                              </Flex>
                            </Flex>
                          </Flex>
                        </Card>
                      );
                    })}
                  
                  {gameState.seasonFixtures.filter(match => 
                    match.completed && 
                    (match.homeTeamId === gameState.userTeamId || match.awayTeamId === gameState.userTeamId)
                  ).length === 0 && (
                    <Text color="gray">No match results available yet</Text>
                  )}
                </Flex>
              </Tabs.Content>
            </Box>
          </Tabs.Root>
        </Card>
        
        {/* Top Players */}
        <Card variant="surface">
          <Heading size="4" mb="3">Top Players (by Overall Rating)</Heading>
          
          {topPlayers.length > 0 ? (
            topPlayers.map(player => (
              <Box key={player.id} mb="2">
                <Flex justify="between">
                  <Text weight="medium">{player.name} ({player.position})</Text>
                  {/* Basic overall rating display - can be refined */}
                  <Text color="gray">
                    Rating: {(
                      (player.attributes.speed + 
                      player.attributes.strength + 
                      player.attributes.stamina + 
                      player.attributes.agility + 
                      player.attributes.intelligence +
                      player.attributes.kicking +
                      player.attributes.marking +
                      player.attributes.handball +
                      player.attributes.tackling) / 9
                    ).toFixed(1)}
                  </Text>
                </Flex>
              </Box>
            ))
          ) : (
            <Text>No players found.</Text>
          )}
        </Card>
        
        {/* Ladder Snapshot - NEW CARD */}
        <Card variant="surface" style={{ gridColumn: "1 / -1" }}>
          <Heading size="4" mb="3">Ladder Snapshot</Heading>
          <Flex direction="column" gap="2">
            {/* Headers */}
            <Grid columns="7" gap="2" style={{ fontWeight: 'bold', fontSize: 'var(--font-size-2)' }}>
              <Text>#</Text>
              <Text>Team</Text>
              <Text align="center">P</Text>
              <Text align="center">W</Text>
              <Text align="center">L</Text>
              <Text align="center">D</Text>
              <Text align="right">Pts</Text>
              {/* <Text align="right">%</Text> // Percentage can make it too wide, optional */}
            </Grid>
            {ladderSnapshotTop.map((pos, index) => (
              <Grid columns="7" gap="2" key={`top-${pos.teamId}`} style={{ backgroundColor: pos.teamId === gameState.userTeamId ? 'var(--blue-3)' : undefined, padding: 'var(--space-1) 0', fontSize: 'var(--font-size-2)' }}>
                <Text>{index + 1}</Text>
                <Text>{getTeamNameById(pos.teamId)}</Text>
                <Text align="center">{pos.played}</Text>
                <Text align="center">{pos.wins}</Text>
                <Text align="center">{pos.losses}</Text>
                <Text align="center">{pos.draws}</Text>
                <Text align="right">{pos.points}</Text>
                {/* <Text align="right">{pos.percentage.toFixed(1)}</Text> */}
              </Grid>
            ))}
            {userTeamIndex >= topNTeams && ladderSnapshotUserWindow.length > 0 && ( // Only show separator and window if user is not in top N
              <>
                <Separator size="4" my="2" />
                {ladderSnapshotUserWindow.map((pos) => {
                  const rank = sortedLadder.findIndex(p => p.teamId === pos.teamId) + 1;
                  return (
                    <Grid columns="7" gap="2" key={`window-${pos.teamId}`} style={{ backgroundColor: pos.teamId === gameState.userTeamId ? 'var(--blue-4)' : undefined, padding: 'var(--space-1) 0', fontSize: 'var(--font-size-2)' }}>
                      <Text>{rank}</Text>
                      <Text>{getTeamNameById(pos.teamId)}</Text>
                      <Text align="center">{pos.played}</Text>
                      <Text align="center">{pos.wins}</Text>
                      <Text align="center">{pos.losses}</Text>
                      <Text align="center">{pos.draws}</Text>
                      <Text align="right">{pos.points}</Text>
                      {/* <Text align="right">{pos.percentage.toFixed(1)}</Text> */}
                    </Grid>
                  );
                })}
              </>
            )}
          </Flex>
        </Card>
        
        {/* Player Development Spotlight - NEW CARD */}
        {noteworthyPlayerDevelopment && (
          <Card variant="surface">
            <Heading size="4" mb="3">Player Development Spotlight</Heading>
            <Box mb="2">
              <Flex justify="between">
                <Text weight="medium">{noteworthyPlayerDevelopment.name || "Player"}</Text>
                <Text color="green">
                  Rating: {noteworthyPlayerDevelopment.startOfSeasonRating.toFixed(1)} → {noteworthyPlayerDevelopment.currentRating.toFixed(1)}
                   (Δ {(noteworthyPlayerDevelopment.currentRating - noteworthyPlayerDevelopment.startOfSeasonRating).toFixed(1)})
                </Text>
              </Flex>
              {significantAttributeChange && (
                <Text size="2" color="gray" mt="1">
                  Improved {significantAttributeChange.attribute}: +{significantAttributeChange.change}
                </Text>
              )}
              {!significantAttributeChange && (
                <Text size="2" color="gray" mt="1">
                  Overall improvement noted.
                </Text>
              )}
            </Box>
          </Card>
        )}
        
        {/* Objectives */}
        <Card variant="surface" style={{ gridColumn: "1 / -1" }}>
          <Heading size="4" mb="3">Season Objectives</Heading>
          
          <Grid columns={{ initial: "1", sm: "2", md: "3" }} gap="3">
            {gameState.objectives.map((objective, index) => (
              <Card key={index} variant="surface" size="1">
                <Flex justify="between" align="start">
                  <Box>
                    <Text weight="bold">{objective.description}</Text>
                    <Text size="2" color="gray">
                      Reward: ${objective.reward.toLocaleString()}k
                    </Text>
                  </Box>
                  
                  <Badge color={objective.completed ? "green" : "blue"}>
                    {objective.completed ? "Completed" : "Active"}
                  </Badge>
                </Flex>
              </Card>
            ))}
          </Grid>
        </Card>
      </Grid>
    </Box>
  );
}
