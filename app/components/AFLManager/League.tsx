import { useState } from "react";
import { Card, Flex, Heading, Text, Box, Button, Separator, Grid, Badge, Table, Tabs } from "@radix-ui/themes";
import { GameState, LadderPosition } from "~/data/AFLManager/gameState";
import { Team, teams } from "~/data/AFLManager/teams";
import { Player } from "~/data/AFLManager/players";

interface LeagueProps {
  gameState: GameState;
  allPlayers: Player[];
}

export default function League({ gameState, allPlayers }: LeagueProps) {
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  
  // Get user team
  const userTeam = teams.find(team => team.id === gameState.userTeamId);
  
  if (!userTeam) {
    return <Text>Error: Team not found</Text>;
  }
  
  // Get team by ID
  const getTeamById = (teamId: string) => {
    return teams.find(team => team.id === teamId);
  };
  
  // Format match date
  const formatMatchDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-AU', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    });
  };
  
  // Calculate team statistics
  const calculateTeamStats = () => {
    const teamStats: Record<string, {
      played: number;
      wins: number;
      losses: number;
      draws: number;
      pointsFor: number;
      pointsAgainst: number;
      percentage: number;
      homeWins: number;
      awayWins: number;
      form: string[]; // Last 5 results: W, L, D
    }> = {};
    
    // Initialize stats for all teams
    teams.forEach(team => {
      teamStats[team.id] = {
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
    
    // Calculate stats from completed matches
    const completedMatches = gameState.seasonFixtures.filter(match => match.completed && match.result);
    
    completedMatches.forEach(match => {
      if (!match.result) return;
      
      const homeTeamStats = teamStats[match.homeTeamId];
      const awayTeamStats = teamStats[match.awayTeamId];
      
      // Update played games
      homeTeamStats.played++;
      awayTeamStats.played++;
      
      // Update points for/against
      homeTeamStats.pointsFor += match.result.homeScore.total;
      homeTeamStats.pointsAgainst += match.result.awayScore.total;
      awayTeamStats.pointsFor += match.result.awayScore.total;
      awayTeamStats.pointsAgainst += match.result.homeScore.total;
      
      // Update wins/losses/draws
      if (match.result.homeScore.total > match.result.awayScore.total) {
        // Home team won
        homeTeamStats.wins++;
        homeTeamStats.homeWins++;
        awayTeamStats.losses++;
        
        // Update form
        if (homeTeamStats.form.length >= 5) homeTeamStats.form.pop();
        if (awayTeamStats.form.length >= 5) awayTeamStats.form.pop();
        homeTeamStats.form.unshift("W");
        awayTeamStats.form.unshift("L");
      } else if (match.result.homeScore.total < match.result.awayScore.total) {
        // Away team won
        homeTeamStats.losses++;
        awayTeamStats.wins++;
        awayTeamStats.awayWins++;
        
        // Update form
        if (homeTeamStats.form.length >= 5) homeTeamStats.form.pop();
        if (awayTeamStats.form.length >= 5) awayTeamStats.form.pop();
        homeTeamStats.form.unshift("L");
        awayTeamStats.form.unshift("W");
      } else {
        // Draw
        homeTeamStats.draws++;
        awayTeamStats.draws++;
        
        // Update form
        if (homeTeamStats.form.length >= 5) homeTeamStats.form.pop();
        if (awayTeamStats.form.length >= 5) awayTeamStats.form.pop();
        homeTeamStats.form.unshift("D");
        awayTeamStats.form.unshift("D");
      }
      
      // Calculate percentage
      homeTeamStats.percentage = homeTeamStats.pointsAgainst === 0 
        ? 100 
        : (homeTeamStats.pointsFor / homeTeamStats.pointsAgainst) * 100;
      
      awayTeamStats.percentage = awayTeamStats.pointsAgainst === 0 
        ? 100 
        : (awayTeamStats.pointsFor / awayTeamStats.pointsAgainst) * 100;
    });
    
    return teamStats;
  };
  
  // Calculate player statistics
  const calculatePlayerStats = () => {
    const playerStats: Record<string, {
      disposals: number;
      marks: number;
      tackles: number;
      goals: number;
      behinds: number;
      gamesPlayed: number;
    }> = {};
    
    // Initialize stats for all players
    allPlayers.forEach(player => {
      playerStats[player.id] = {
        disposals: 0,
        marks: 0,
        tackles: 0,
        goals: 0,
        behinds: 0,
        gamesPlayed: 0
      };
    });
    
    // Calculate stats from completed matches
    const completedMatches = gameState.seasonFixtures.filter(match => match.completed && match.result);
    
    completedMatches.forEach(match => {
      if (!match.result) return;
      
      // Update games played
      const homeTeamPlayers = allPlayers.filter(p => p.teamId === match.homeTeamId);
      const awayTeamPlayers = allPlayers.filter(p => p.teamId === match.awayTeamId);
      
      [...homeTeamPlayers, ...awayTeamPlayers].forEach(player => {
        if (playerStats[player.id]) {
          playerStats[player.id].gamesPlayed++;
        }
      });
      
      // Update stats
      if (match.result.stats) {
        Object.entries(match.result.stats.disposals).forEach(([playerId, value]) => {
          if (playerStats[playerId]) {
            playerStats[playerId].disposals += value;
          }
        });
        
        Object.entries(match.result.stats.marks).forEach(([playerId, value]) => {
          if (playerStats[playerId]) {
            playerStats[playerId].marks += value;
          }
        });
        
        Object.entries(match.result.stats.tackles).forEach(([playerId, value]) => {
          if (playerStats[playerId]) {
            playerStats[playerId].tackles += value;
          }
        });
        
        Object.entries(match.result.stats.goals).forEach(([playerId, value]) => {
          if (playerStats[playerId]) {
            playerStats[playerId].goals += value;
          }
        });
        
        Object.entries(match.result.stats.behinds).forEach(([playerId, value]) => {
          if (playerStats[playerId]) {
            playerStats[playerId].behinds += value;
          }
        });
      }
    });
    
    return playerStats;
  };
  
  // Get team stats
  const teamStats = calculateTeamStats();
  
  // Get player stats
  const playerStats = calculatePlayerStats();
  
  // Render ladder
  const renderLadder = () => (
    <Card variant="surface">
      <Heading size="4" mb="3">League Ladder</Heading>
      
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
            <Table.ColumnHeaderCell>Form</Table.ColumnHeaderCell>
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
              <Table.Row 
                key={position.teamId}
                style={{ 
                  cursor: 'pointer',
                  backgroundColor: selectedTeamId === position.teamId ? 'rgba(59, 130, 246, 0.1)' : undefined
                }}
                onClick={() => setSelectedTeamId(position.teamId)}
              >
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
                <Table.Cell weight="bold">{position.points}</Table.Cell>
                <Table.Cell>
                  <Flex gap="1">
                    {teamStats[position.teamId]?.form.map((result, i) => (
                      <Box 
                        key={i}
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          backgroundColor: result === 'W' ? '#22c55e' : result === 'L' ? '#ef4444' : '#f59e0b',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}
                      >
                        {result}
                      </Box>
                    ))}
                  </Flex>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Root>
    </Card>
  );
  
  // Render team details
  const renderTeamDetails = () => {
    if (!selectedTeamId) return null;
    
    const team = getTeamById(selectedTeamId);
    if (!team) return null;
    
    const teamPlayers = allPlayers.filter(player => player.teamId === selectedTeamId);
    
    // Get upcoming matches for this team
    const upcomingMatches = gameState.seasonFixtures
      .filter(match => 
        !match.completed && 
        (match.homeTeamId === selectedTeamId || match.awayTeamId === selectedTeamId)
      )
      .slice(0, 5);
    
    // Get recent results for this team
    const recentResults = gameState.seasonFixtures
      .filter(match => 
        match.completed && 
        match.result &&
        (match.homeTeamId === selectedTeamId || match.awayTeamId === selectedTeamId)
      )
      .sort((a, b) => b.round - a.round)
      .slice(0, 5);
    
    return (
      <Card variant="surface">
        <Flex justify="between" align="center" mb="3">
          <Heading size="4">{team.name}</Heading>
          <Box style={{ 
            width: '30px', 
            height: '30px', 
            borderRadius: '50%', 
            backgroundColor: team.colors.primary
          }} />
        </Flex>
        
        <Separator size="4" my="3" />
        
        <Grid columns={{ initial: "1", md: "2" }} gap="4">
          {/* Team Attributes */}
          <Card variant="surface">
            <Heading size="3" mb="2">Team Attributes</Heading>
            
            <Grid columns="1" gap="3" width="auto">
              <Box>
                <Text size="2">Attack</Text>
                <Flex align="center" gap="2">
                  <Box style={{ 
                    width: `${team.attributes.attack}%`, 
                    height: '8px', 
                    backgroundColor: '#22c55e',
                    borderRadius: '4px'
                  }} />
                  <Text size="1">{team.attributes.attack}</Text>
                </Flex>
              </Box>
              
              <Box>
                <Text size="2">Midfield</Text>
                <Flex align="center" gap="2">
                  <Box style={{ 
                    width: `${team.attributes.midfield}%`, 
                    height: '8px', 
                    backgroundColor: '#3b82f6',
                    borderRadius: '4px'
                  }} />
                  <Text size="1">{team.attributes.midfield}</Text>
                </Flex>
              </Box>
              
              <Box>
                <Text size="2">Defense</Text>
                <Flex align="center" gap="2">
                  <Box style={{ 
                    width: `${team.attributes.defense}%`, 
                    height: '8px', 
                    backgroundColor: '#f59e0b',
                    borderRadius: '4px'
                  }} />
                  <Text size="1">{team.attributes.defense}</Text>
                </Flex>
              </Box>
              
              <Box>
                <Text size="2">Coaching</Text>
                <Flex align="center" gap="2">
                  <Box style={{ 
                    width: `${team.attributes.coaching}%`, 
                    height: '8px', 
                    backgroundColor: '#8b5cf6',
                    borderRadius: '4px'
                  }} />
                  <Text size="1">{team.attributes.coaching}</Text>
                </Flex>
              </Box>
            </Grid>
            
            <Box mt="3">
              <Text size="2" weight="bold">Home Ground</Text>
              <Text>{team.homeGround}</Text>
            </Box>
          </Card>
          
          {/* Team Statistics */}
          <Card variant="surface">
            <Heading size="3" mb="2">Team Statistics</Heading>
            
            <Grid columns="2" gap="3" width="auto">
              <Box>
                <Text size="2" weight="bold">Home Record</Text>
                <Text>{teamStats[selectedTeamId]?.homeWins || 0}W - {(teamStats[selectedTeamId]?.played || 0) - (teamStats[selectedTeamId]?.homeWins || 0) - (teamStats[selectedTeamId]?.awayWins || 0)}L</Text>
              </Box>
              
              <Box>
                <Text size="2" weight="bold">Away Record</Text>
                <Text>{teamStats[selectedTeamId]?.awayWins || 0}W - {(teamStats[selectedTeamId]?.played || 0) - (teamStats[selectedTeamId]?.homeWins || 0) - (teamStats[selectedTeamId]?.awayWins || 0)}L</Text>
              </Box>
              
              <Box>
                <Text size="2" weight="bold">Points For</Text>
                <Text>{teamStats[selectedTeamId]?.pointsFor || 0}</Text>
              </Box>
              
              <Box>
                <Text size="2" weight="bold">Points Against</Text>
                <Text>{teamStats[selectedTeamId]?.pointsAgainst || 0}</Text>
              </Box>
              
              <Box>
                <Text size="2" weight="bold">Percentage</Text>
                <Text>{teamStats[selectedTeamId]?.percentage.toFixed(1) || 0}%</Text>
              </Box>
              
              <Box>
                <Text size="2" weight="bold">Form</Text>
                <Flex gap="1">
                  {teamStats[selectedTeamId]?.form.map((result, i) => (
                    <Box 
                      key={i}
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: result === 'W' ? '#22c55e' : result === 'L' ? '#ef4444' : '#f59e0b',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}
                    >
                      {result}
                    </Box>
                  ))}
                </Flex>
              </Box>
            </Grid>
          </Card>
          
          {/* Upcoming Matches */}
          <Card variant="surface">
            <Heading size="3" mb="2">Upcoming Matches</Heading>
            
            {upcomingMatches.length > 0 ? (
              <Flex direction="column" gap="2">
                {upcomingMatches.map(match => {
                  const opponent = getTeamById(
                    match.homeTeamId === selectedTeamId ? match.awayTeamId : match.homeTeamId
                  );
                  if (!opponent) return null;
                  
                  const isHome = match.homeTeamId === selectedTeamId;
                  
                  return (
                    <Card key={match.id} variant="surface" size="1">
                      <Flex justify="between" align="center">
                        <Box>
                          <Badge size="1">Round {match.round}</Badge>
                          <Text size="2" color="gray">{formatMatchDate(match.date)}</Text>
                          <Text size="2" weight="bold">
                            {isHome ? `${team.name} vs ${opponent.name}` : `${opponent.name} vs ${team.name}`}
                          </Text>
                          <Text size="2">{match.venue}</Text>
                        </Box>
                        
                        <Badge size="1" color={isHome ? "blue" : "gray"}>
                          {isHome ? "Home" : "Away"}
                        </Badge>
                      </Flex>
                    </Card>
                  );
                })}
              </Flex>
            ) : (
              <Text color="gray">No upcoming matches</Text>
            )}
          </Card>
          
          {/* Recent Results */}
          <Card variant="surface">
            <Heading size="3" mb="2">Recent Results</Heading>
            
            {recentResults.length > 0 ? (
              <Flex direction="column" gap="2">
                {recentResults.map(match => {
                  if (!match.result) return null;
                  
                  const opponent = getTeamById(
                    match.homeTeamId === selectedTeamId ? match.awayTeamId : match.homeTeamId
                  );
                  if (!opponent) return null;
                  
                  const isHome = match.homeTeamId === selectedTeamId;
                  const teamScore = isHome ? match.result.homeScore : match.result.awayScore;
                  const opponentScore = isHome ? match.result.awayScore : match.result.homeScore;
                  const won = teamScore.total > opponentScore.total;
                  const draw = teamScore.total === opponentScore.total;
                  
                  return (
                    <Card key={match.id} variant="surface" size="1">
                      <Flex justify="between" align="center">
                        <Box>
                          <Badge size="1">Round {match.round}</Badge>
                          <Text size="2" color="gray">{formatMatchDate(match.date)}</Text>
                          <Text size="2" weight="bold">
                            {isHome ? `${team.name} vs ${opponent.name}` : `${opponent.name} vs ${team.name}`}
                          </Text>
                        </Box>
                        
                        <Flex direction="column" align="end">
                          <Badge size="1" color={won ? "green" : draw ? "orange" : "red"}>
                            {won ? "Win" : draw ? "Draw" : "Loss"}
                          </Badge>
                          <Text weight="bold" mt="1">
                            {teamScore.goals}.{teamScore.behinds} ({teamScore.total}) - {opponentScore.goals}.{opponentScore.behinds} ({opponentScore.total})
                          </Text>
                        </Flex>
                      </Flex>
                    </Card>
                  );
                })}
              </Flex>
            ) : (
              <Text color="gray">No recent results</Text>
            )}
          </Card>
          
          {/* Top Players */}
          <Card variant="surface" style={{ gridColumn: "1 / -1" }}>
            <Heading size="3" mb="2">Top Players</Heading>
            
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Player</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Position</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Age</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Rating</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Games</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Disposals</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Goals</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              
              <Table.Body>
                {teamPlayers
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
                  .slice(0, 10)
                  .map(player => {
                    // Calculate overall rating
                    const overallRating = Math.round(
                      (player.attributes.speed + 
                       player.attributes.strength + 
                       player.attributes.stamina + 
                       player.attributes.agility + 
                       player.attributes.intelligence +
                       player.attributes.kicking +
                       player.attributes.marking +
                       player.attributes.handball +
                       player.attributes.tackling) / 9
                    );
                    
                    return (
                      <Table.Row key={player.id}>
                        <Table.Cell>
                          <Text weight="bold">{player.name}</Text>
                        </Table.Cell>
                        <Table.Cell>
                          <Badge size="1">{player.position}</Badge>
                        </Table.Cell>
                        <Table.Cell>{player.age}</Table.Cell>
                        <Table.Cell>
                          <Box style={{ 
                            width: '30px', 
                            height: '30px', 
                            borderRadius: '50%', 
                            backgroundColor: '#3b82f6',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold'
                          }}>
                            {overallRating}
                          </Box>
                        </Table.Cell>
                        <Table.Cell>{playerStats[player.id]?.gamesPlayed || 0}</Table.Cell>
                        <Table.Cell>{playerStats[player.id]?.disposals || 0}</Table.Cell>
                        <Table.Cell>{playerStats[player.id]?.goals || 0}</Table.Cell>
                      </Table.Row>
                    );
                  })}
              </Table.Body>
            </Table.Root>
          </Card>
        </Grid>
      </Card>
    );
  };
  
  // Render league statistics
  const renderLeagueStats = () => {
    // Get top goal kickers
    const topGoalKickers = Object.entries(playerStats)
      .map(([playerId, stats]) => {
        const player = allPlayers.find(p => p.id === playerId);
        if (!player) return null;
        
        return {
          player,
          goals: stats.goals,
          behinds: stats.behinds,
          team: getTeamById(player.teamId)
        };
      })
      .filter(Boolean)
      .sort((a, b) => b!.goals - a!.goals)
      .slice(0, 10);
    
    // Get top disposal getters
    const topDisposalGetters = Object.entries(playerStats)
      .map(([playerId, stats]) => {
        const player = allPlayers.find(p => p.id === playerId);
        if (!player) return null;
        
        return {
          player,
          disposals: stats.disposals,
          gamesPlayed: stats.gamesPlayed,
          average: stats.gamesPlayed > 0 ? stats.disposals / stats.gamesPlayed : 0,
          team: getTeamById(player.teamId)
        };
      })
      .filter(Boolean)
      .sort((a, b) => b!.average - a!.average)
      .slice(0, 10);
    
    return (
      <Grid columns={{ initial: "1", md: "2" }} gap="4">
        {/* Top Goal Kickers */}
        <Card variant="surface">
          <Heading size="4" mb="3">Top Goal Kickers</Heading>
          
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Player</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Team</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Goals</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Behinds</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            
            <Table.Body>
              {topGoalKickers.map((entry, index) => {
                if (!entry) return null;
                
                return (
                  <Table.Row key={entry.player.id}>
                    <Table.Cell>
                      <Text weight="bold">{entry.player.name}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Flex gap="2" align="center">
                        {entry.team && (
                          <Box style={{ 
                            width: '12px', 
                            height: '12px', 
                            borderRadius: '50%', 
                            backgroundColor: entry.team.colors.primary
                          }} />
                        )}
                        <Text>{entry.team?.name}</Text>
                      </Flex>
                    </Table.Cell>
                    <Table.Cell>{entry.goals}</Table.Cell>
                    <Table.Cell>{entry.behinds}</Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table.Root>
        </Card>
        
        {/* Top Disposal Getters */}
        <Card variant="surface">
          <Heading size="4" mb="3">Top Disposal Getters</Heading>
          
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Player</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Team</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Avg</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Total</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            
            <Table.Body>
              {topDisposalGetters.map((entry, index) => {
                if (!entry) return null;
                
                return (
                  <Table.Row key={entry.player.id}>
                    <Table.Cell>
                      <Text weight="bold">{entry.player.name}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Flex gap="2" align="center">
                        {entry.team && (
                          <Box style={{ 
                            width: '12px', 
                            height: '12px', 
                            borderRadius: '50%', 
                            backgroundColor: entry.team.colors.primary
                          }} />
                        )}
                        <Text>{entry.team?.name}</Text>
                      </Flex>
                    </Table.Cell>
                    <Table.Cell>{entry.average.toFixed(1)}</Table.Cell>
                    <Table.Cell>{entry.disposals}</Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table.Root>
        </Card>
      </Grid>
    );
  };
  
  // Render season schedule
  const renderSchedule = () => {
    // Group fixtures by round
    const fixturesByRound: Record<number, typeof gameState.seasonFixtures> = {};
    
    gameState.seasonFixtures.forEach(match => {
      if (!fixturesByRound[match.round]) {
        fixturesByRound[match.round] = [];
      }
      fixturesByRound[match.round].push(match);
    });
    
    return (
      <Card variant="surface">
        <Heading size="4" mb="3">Season Schedule</Heading>
        
        <Tabs.Root defaultValue="1">
          <Tabs.List>
            {Object.keys(fixturesByRound).map(round => (
              <Tabs.Trigger key={round} value={round}>
                Round {round}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
          
          <Box pt="4">
            {Object.entries(fixturesByRound).map(([round, matches]) => (
              <Tabs.Content key={round} value={round}>
                <Flex direction="column" gap="3">
                  {matches.map(match => {
                    const homeTeam = getTeamById(match.homeTeamId);
                    const awayTeam = getTeamById(match.awayTeamId);
                    
                    if (!homeTeam || !awayTeam) return null;
                    
                    const isUserTeamMatch = match.homeTeamId === gameState.userTeamId || match.awayTeamId === gameState.userTeamId;
                    
                    return (
                      <Card key={match.id} variant="surface" size="1">
                        <Flex justify="between" align="center">
                          <Box>
                            <Flex gap="2" align="center">
                              {isUserTeamMatch && <Badge size="1" color="blue">Your Match</Badge>}
                              <Text size="2" color="gray">{formatMatchDate(match.date)}</Text>
                            </Flex>
                            
                            <Flex gap="2" align="center" mt="1">
                              <Text 
                                size="3" 
                                weight={match.homeTeamId === gameState.userTeamId ? "bold" : "regular"}
                              >
                                {homeTeam.name}
                              </Text>
                              <Text size="3">vs</Text>
                              <Text 
                                size="3" 
                                weight={match.awayTeamId === gameState.userTeamId ? "bold" : "regular"}
                              >
                                {awayTeam.name}
                              </Text>
                            </Flex>
                            
                            <Text size="2">{match.venue}</Text>
                          </Box>
                          
                          {match.completed && match.result ? (
                            <Box>
                              <Text weight="bold">
                                {match.result.homeScore.goals}.{match.result.homeScore.behinds} ({match.result.homeScore.total}) - {match.result.awayScore.goals}.{match.result.awayScore.behinds} ({match.result.awayScore.total})
                              </Text>
                              <Text size="2" color="gray">Final</Text>
                            </Box>
                          ) : (
                            <Badge size="1" color="gray">Upcoming</Badge>
                          )}
                        </Flex>
                      </Card>
                    );
                  })}
                </Flex>
              </Tabs.Content>
            ))}
          </Box>
        </Tabs.Root>
      </Card>
    );
  };
  
  return (
    <Box>
      <Heading size="6" mb="4">League</Heading>
      
      <Tabs.Root defaultValue="ladder">
        <Tabs.List>
          <Tabs.Trigger value="ladder">Ladder</Tabs.Trigger>
          <Tabs.Trigger value="stats">Statistics</Tabs.Trigger>
          <Tabs.Trigger value="schedule">Schedule</Tabs.Trigger>
        </Tabs.List>
        
        <Box pt="4">
          <Tabs.Content value="ladder">
            <Grid columns={{ initial: "1" }} gap="4">
              {renderLadder()}
              {selectedTeamId && renderTeamDetails()}
            </Grid>
          </Tabs.Content>
          
          <Tabs.Content value="stats">
            {renderLeagueStats()}
          </Tabs.Content>
          
          <Tabs.Content value="schedule">
            {renderSchedule()}
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </Box>
  );
}
