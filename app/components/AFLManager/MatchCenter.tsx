import { useState } from "react";
import { Card, Flex, Heading, Text, Box, Button, Separator, Grid, Badge, Table, Tabs } from "@radix-ui/themes";
import { GameState, Match, MatchEvent, MatchScore } from "~/data/AFLManager/gameState";
import { Team, teams } from "~/data/AFLManager/teams";
import { Player } from "~/data/AFLManager/players";
import { simulateMatch, TeamLineup } from "~/utils/AFLManager/matchEngine";

interface MatchCenterProps {
  gameState: GameState;
  allPlayers: Player[];
}

export default function MatchCenter({ gameState, allPlayers }: MatchCenterProps) {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [matchSimulation, setMatchSimulation] = useState<{
    inProgress: boolean;
    currentEvent: number;
    result?: {
      homeScore: MatchScore;
      awayScore: MatchScore;
      events: MatchEvent[];
    };
  }>({
    inProgress: false,
    currentEvent: 0
  });
  
  // Get user team
  const userTeam = teams.find(team => team.id === gameState.userTeamId);
  
  if (!userTeam) {
    return <Text>Error: Team not found</Text>;
  }
  
  // Get current round matches
  const currentRoundMatches = gameState.seasonFixtures.filter(match => 
    match.round === gameState.currentRound
  );
  
  // Get user team match for current round
  const userTeamMatch = currentRoundMatches.find(match => 
    match.homeTeamId === gameState.userTeamId || match.awayTeamId === gameState.userTeamId
  );
  
  // Format match date
  const formatMatchDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-AU', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    });
  };
  
  // Get team by ID
  const getTeamById = (teamId: string) => {
    return teams.find(team => team.id === teamId);
  };
  
  // Handle match selection
  const handleMatchSelect = (match: Match) => {
    setSelectedMatch(match);
    setMatchSimulation({
      inProgress: false,
      currentEvent: 0
    });
  };
  
  // Handle match simulation
  const handleSimulateMatch = () => {
    if (!selectedMatch) return;
    
    const homeTeam = getTeamById(selectedMatch.homeTeamId);
    const awayTeam = getTeamById(selectedMatch.awayTeamId);
    
    if (!homeTeam || !awayTeam) return;
    
    // Get players for each team
    const homePlayers = allPlayers.filter(player => player.teamId === homeTeam.id);
    const awayPlayers = allPlayers.filter(player => player.teamId === awayTeam.id);
    
    // Create lineups with detailed FM-style tactics
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
        default:
          role = "General";
          instructions = ["Follow team structure"];
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
        default:
          role = "General";
          instructions = ["Follow team structure"];
      }
      
      awayLineup.playerRoles[player.id] = {
        role,
        instructions
      };
    });
    
    // Simulate the match
    const result = simulateMatch(selectedMatch, homeTeam, awayTeam, homeLineup.players, awayLineup.players);
    
    // Start simulation display
    setMatchSimulation({
      inProgress: true,
      currentEvent: 0,
      result: {
        homeScore: result.homeScore,
        awayScore: result.awayScore,
        events: result.events
      }
    });
    
    // Simulate events over time
    const eventInterval = setInterval(() => {
      setMatchSimulation(prev => {
        if (!prev.result || prev.currentEvent >= prev.result.events.length - 1) {
          clearInterval(eventInterval);
          return { ...prev, inProgress: false, currentEvent: prev.result ? prev.result.events.length - 1 : 0 };
        }
        return { ...prev, currentEvent: prev.currentEvent + 1 };
      });
    }, 1500);
  };
  
  // Render match list
  const renderMatchList = () => (
    <Card variant="surface">
      <Heading size="4" mb="3">Round {gameState.currentRound} Fixtures</Heading>
      
      <Flex direction="column" gap="3">
        {currentRoundMatches.map(match => {
          const homeTeam = getTeamById(match.homeTeamId);
          const awayTeam = getTeamById(match.awayTeamId);
          
          if (!homeTeam || !awayTeam) return null;
          
          const isUserTeamMatch = match.homeTeamId === gameState.userTeamId || match.awayTeamId === gameState.userTeamId;
          
          return (
            <Card 
              key={match.id} 
              variant={selectedMatch?.id === match.id ? "classic" : "surface"} 
              size="1"
              style={{ cursor: 'pointer' }}
              onClick={() => handleMatchSelect(match)}
            >
              <Flex justify="between" align="center">
                <Box>
                  <Flex gap="2" align="center">
                    {isUserTeamMatch && <Badge size="1" color="blue">Your Match</Badge>}
                    <Text size="2" color="gray">{formatMatchDate(match.date)}</Text>
                  </Flex>
                  
                  <Flex gap="2" align="center" mt="1">
                    <Text size="3" weight="bold">{homeTeam.name}</Text>
                    <Text size="3">vs</Text>
                    <Text size="3" weight="bold">{awayTeam.name}</Text>
                  </Flex>
                  
                  <Text size="2">{match.venue}</Text>
                </Box>
                
                {match.completed ? (
                  <Box>
                    <Text weight="bold">
                      {match.result?.homeScore.goals}.{match.result?.homeScore.behinds} ({match.result?.homeScore.total}) - {match.result?.awayScore.goals}.{match.result?.awayScore.behinds} ({match.result?.awayScore.total})
                    </Text>
                    <Text size="2" color="gray">Final</Text>
                  </Box>
                ) : (
                  <Button 
                    size="1" 
                    variant="solid"
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      handleMatchSelect(match);
                    }}
                  >
                    View
                  </Button>
                )}
              </Flex>
            </Card>
          );
        })}
      </Flex>
    </Card>
  );
  
  // Render match details
  const renderMatchDetails = () => {
    if (!selectedMatch) return null;
    
    const homeTeam = getTeamById(selectedMatch.homeTeamId);
    const awayTeam = getTeamById(selectedMatch.awayTeamId);
    
    if (!homeTeam || !awayTeam) return null;
    
    const isUserTeamMatch = selectedMatch.homeTeamId === gameState.userTeamId || selectedMatch.awayTeamId === gameState.userTeamId;
    const isUserTeamHome = selectedMatch.homeTeamId === gameState.userTeamId;
    
    return (
      <Card variant="surface">
        <Heading size="4" mb="3">Match Details</Heading>
        
        <Flex justify="between" align="center" mb="3">
          <Box>
            <Text size="2" color="gray">{formatMatchDate(selectedMatch.date)}</Text>
            <Text size="2">{selectedMatch.venue}</Text>
          </Box>
          
          {isUserTeamMatch && !selectedMatch.completed && (
            <Button 
              variant="solid" 
              onClick={handleSimulateMatch}
              disabled={matchSimulation.inProgress}
            >
              {matchSimulation.inProgress ? "Simulating..." : "Simulate Match"}
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
                backgroundColor: homeTeam.colors.primary,
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
              {selectedMatch.completed || matchSimulation.result ? (
                <Flex direction="column" align="center">
                  <Text size="8" weight="bold">
                    {matchSimulation.result?.homeScore.goals || selectedMatch.result?.homeScore.goals || 0}.
                    {matchSimulation.result?.homeScore.behinds || selectedMatch.result?.homeScore.behinds || 0}
                  </Text>
                  <Text size="3">
                    ({matchSimulation.result?.homeScore.total || selectedMatch.result?.homeScore.total || 0})
                  </Text>
                </Flex>
              ) : (
                <Text size="8" weight="bold">-</Text>
              )}
            </Box>
            
            <Text size="6" weight="bold">vs</Text>
            
            <Box style={{ flex: 1, textAlign: 'center' }}>
              {selectedMatch.completed || matchSimulation.result ? (
                <Flex direction="column" align="center">
                  <Text size="8" weight="bold">
                    {matchSimulation.result?.awayScore.goals || selectedMatch.result?.awayScore.goals || 0}.
                    {matchSimulation.result?.awayScore.behinds || selectedMatch.result?.awayScore.behinds || 0}
                  </Text>
                  <Text size="3">
                    ({matchSimulation.result?.awayScore.total || selectedMatch.result?.awayScore.total || 0})
                  </Text>
                </Flex>
              ) : (
                <Text size="8" weight="bold">-</Text>
              )}
            </Box>
            
            <Flex direction="column" align="center" style={{ flex: 1 }}>
              <Box style={{ 
                width: '60px', 
                height: '60px', 
                borderRadius: '50%', 
                backgroundColor: awayTeam.colors.primary,
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
              {!isUserTeamHome && isUserTeamMatch && <Badge size="1">Your Team</Badge>}
            </Flex>
          </Flex>
        </Card>
        
        {/* Match Simulation Events */}
        {matchSimulation.result && (
          <Box>
            <Heading size="3" mb="2">Match Events</Heading>
            
            <Card variant="surface" style={{ maxHeight: '300px', overflow: 'auto' }}>
              {matchSimulation.result.events.slice(0, matchSimulation.currentEvent + 1).map((event, index) => {
                // Format timestamp as MM:SS
                const minutes = Math.floor(event.timestamp / 60);
                const seconds = event.timestamp % 60;
                const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                
                // Determine quarter
                const quarter = event.quarter || Math.floor(event.timestamp / (30 * 60)) + 1;
                
                // Determine event color
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
                
                return (
                  <Flex key={index} gap="3" align="start" p="2" style={{ borderBottom: index < matchSimulation.result!.events.length - 1 ? '1px solid #eee' : 'none' }}>
                    <Box>
                      <Text size="1" color="gray">Q{quarter}</Text>
                      <Text size="2" weight="bold">{formattedTime}</Text>
                    </Box>
                    
                    <Box style={{ flex: 1 }}>
                      <Text color={eventColor as any}>{event.message}</Text>
                    </Box>
                  </Flex>
                );
              })}
            </Card>
          </Box>
        )}
      </Card>
    );
  };
  
  // Render ladder
  const renderLadder = () => (
    <Card variant="surface">
      <Heading size="4" mb="3">Ladder</Heading>
      
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Pos</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Team</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>P</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>W</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>L</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>D</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>%</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Pts</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        
        <Table.Body>
          {gameState.ladder.sort((a, b) => {
            // Sort by points first
            if (b.points !== a.points) return b.points - a.points;
            // Then by percentage
            return b.percentage - a.percentage;
          }).map((position, index) => {
            const team = getTeamById(position.teamId);
            if (!team) return null;
            
            return (
              <Table.Row key={position.teamId}>
                <Table.Cell>{index + 1}</Table.Cell>
                <Table.Cell>
                  <Flex gap="2" align="center">
                    <Box style={{ 
                      width: '16px', 
                      height: '16px', 
                      borderRadius: '50%', 
                      backgroundColor: team.colors.primary
                    }} />
                    <Text weight={position.teamId === gameState.userTeamId ? "bold" : "regular"}>
                      {team.name}
                    </Text>
                  </Flex>
                </Table.Cell>
                <Table.Cell>{position.played}</Table.Cell>
                <Table.Cell>{position.wins}</Table.Cell>
                <Table.Cell>{position.losses}</Table.Cell>
                <Table.Cell>{position.draws}</Table.Cell>
                <Table.Cell>{position.percentage.toFixed(1)}</Table.Cell>
                <Table.Cell style={{ fontWeight: 'bold' }}>{position.points}</Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Root>
    </Card>
  );
  
  return (
    <Box>
      <Heading size="6" mb="4">Match Center</Heading>
      
      <Tabs.Root defaultValue="fixtures">
        <Tabs.List>
          <Tabs.Trigger value="fixtures">Fixtures</Tabs.Trigger>
          <Tabs.Trigger value="ladder">Ladder</Tabs.Trigger>
          <Tabs.Trigger value="results">Results</Tabs.Trigger>
        </Tabs.List>
        
        <Box pt="4">
          <Tabs.Content value="fixtures">
            <Grid columns={{ initial: "1", md: selectedMatch ? "2" : "1" }} gap="4">
              {renderMatchList()}
              {selectedMatch && renderMatchDetails()}
            </Grid>
          </Tabs.Content>
          
          <Tabs.Content value="ladder">
            {renderLadder()}
          </Tabs.Content>
          
          <Tabs.Content value="results">
            <Card variant="surface">
              <Heading size="4" mb="3">Recent Results</Heading>
              
              <Flex direction="column" gap="3">
                {gameState.seasonFixtures
                  .filter(match => match.completed)
                  .sort((a, b) => b.round - a.round)
                  .slice(0, 10)
                  .map(match => {
                    const homeTeam = getTeamById(match.homeTeamId);
                    const awayTeam = getTeamById(match.awayTeamId);
                    
                    if (!homeTeam || !awayTeam || !match.result) return null;
                    
                    const homeWon = match.result.homeScore.total > match.result.awayScore.total;
                    const draw = match.result.homeScore.total === match.result.awayScore.total;
                    
                    return (
                      <Card key={match.id} variant="surface" size="1">
                        <Flex justify="between" align="center">
                          <Box>
                            <Badge size="1">Round {match.round}</Badge>
                            <Text size="2" color="gray">{formatMatchDate(match.date)}</Text>
                          </Box>
                          
                          <Flex gap="3" align="center">
                            <Flex direction="column" align="end">
                              <Text 
                                weight={homeWon ? "bold" : "regular"}
                                color={homeWon ? undefined : "gray"}
                              >
                                {homeTeam.name}
                              </Text>
                              <Text 
                                weight={!homeWon && !draw ? "bold" : "regular"}
                                color={!homeWon && !draw ? undefined : "gray"}
                              >
                                {awayTeam.name}
                              </Text>
                            </Flex>
                            
                            <Flex direction="column" align="end">
                              <Text weight="bold">
                                {match.result.homeScore.goals}.{match.result.homeScore.behinds} ({match.result.homeScore.total})
                              </Text>
                              <Text weight="bold">
                                {match.result.awayScore.goals}.{match.result.awayScore.behinds} ({match.result.awayScore.total})
                              </Text>
                            </Flex>
                          </Flex>
                        </Flex>
                      </Card>
                    );
                  })}
              </Flex>
            </Card>
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </Box>
  );
}
