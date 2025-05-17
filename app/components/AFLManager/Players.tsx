import { useState, useEffect } from "react";
import { Card, Flex, Heading, Text, Box, Button, Separator, Grid, Badge, Table, Select, TextField } from "@radix-ui/themes";
import { GameState } from "~/data/AFLManager/gameState";
import { Team, teams } from "~/data/AFLManager/teams";
import { Player, Position } from "~/data/AFLManager/players";

interface PlayersProps {
  gameState: GameState;
  allPlayers: Player[];
}

export default function Players({ gameState, allPlayers }: PlayersProps) {
  const [selectedTeamId, setSelectedTeamId] = useState<string | "all">("all");
  const [selectedPosition, setSelectedPosition] = useState<Position | "all">("all");
  const [sortBy, setSortBy] = useState<"name" | "team" | "position" | "age" | "rating">("rating");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  
  // Get user team
  const userTeam = teams.find(team => team.id === gameState.userTeamId);
  
  if (!userTeam) {
    return <Text>Error: Team not found</Text>;
  }
  
  // Get team by ID
  const getTeamById = (teamId: string) => {
    return teams.find(team => team.id === teamId);
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
  
  // Get player stats
  const playerStats = calculatePlayerStats();
  
  // Calculate overall rating for a player
  const calculateOverallRating = (player: Player): number => {
    return Math.round(
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
  };
  
  // Filter players based on selected filters
  const filteredPlayers = allPlayers.filter(player => {
    // Filter by team
    if (selectedTeamId !== "all" && player.teamId !== selectedTeamId) {
      return false;
    }
    
    // Filter by position
    if (selectedPosition !== "all" && player.position !== selectedPosition) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !player.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Sort players
  const sortedPlayers = [...filteredPlayers].sort((a, b) => {
    if (sortBy === "name") {
      return sortOrder === "asc" 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name);
    } 
    else if (sortBy === "team") {
      const teamA = getTeamById(a.teamId);
      const teamB = getTeamById(b.teamId);
      
      if (!teamA || !teamB) return 0;
      
      return sortOrder === "asc" 
        ? teamA.name.localeCompare(teamB.name) 
        : teamB.name.localeCompare(teamA.name);
    }
    else if (sortBy === "position") {
      return sortOrder === "asc" 
        ? a.position.localeCompare(b.position) 
        : b.position.localeCompare(a.position);
    } 
    else if (sortBy === "age") {
      return sortOrder === "asc" 
        ? a.age - b.age 
        : b.age - a.age;
    } 
    else { // rating
      const aRating = calculateOverallRating(a);
      const bRating = calculateOverallRating(b);
      return sortOrder === "asc" 
        ? aRating - bRating 
        : bRating - aRating;
    }
  });
  
  // Handle sort change
  const handleSortChange = (newSortBy: "name" | "team" | "position" | "age" | "rating") => {
    if (sortBy === newSortBy) {
      // Toggle sort order if clicking the same column
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Set new sort column and default to descending for rating, ascending for others
      setSortBy(newSortBy);
      setSortOrder(newSortBy === "rating" ? "desc" : "asc");
    }
  };
  
  // Render player details
  const renderPlayerDetails = () => {
    if (!selectedPlayer) return null;
    
    const team = getTeamById(selectedPlayer.teamId);
    if (!team) return null;
    
    // Calculate overall rating
    const overallRating = calculateOverallRating(selectedPlayer);
    
    // Get player stats
    const stats = playerStats[selectedPlayer.id] || {
      disposals: 0,
      marks: 0,
      tackles: 0,
      goals: 0,
      behinds: 0,
      gamesPlayed: 0
    };
    
    return (
      <Card variant="surface">
        <Flex justify="between" align="start" mb="3">
          <Box>
            <Heading size="4">{selectedPlayer.name}</Heading>
            <Flex gap="2" align="center" mt="1">
              <Badge size="1">{selectedPlayer.position}</Badge>
              <Text size="2" color="gray">Age: {selectedPlayer.age}</Text>
              {team && (
                <Flex gap="2" align="center">
                  <Box style={{ 
                    width: '12px', 
                    height: '12px', 
                    borderRadius: '50%', 
                    backgroundColor: team.colors.primary
                  }} />
                  <Text size="2">{team.name}</Text>
                </Flex>
              )}
            </Flex>
          </Box>
          
          <Box style={{ 
            width: '60px', 
            height: '60px', 
            borderRadius: '50%', 
            backgroundColor: '#3b82f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '24px'
          }}>
            {overallRating}
          </Box>
        </Flex>
        
        <Separator size="4" my="3" />
        
        <Grid columns={{ initial: "1", md: "2" }} gap="4">
          {/* Player Attributes */}
          <Card variant="surface">
            <Heading size="3" mb="3">Attributes</Heading>
            
            <Grid columns="1" gap="3" width="auto">
              <Box>
                <Text size="2">Speed</Text>
                <Flex align="center" gap="2">
                  <Box style={{ 
                    width: `${selectedPlayer.attributes.speed}%`, 
                    height: '8px', 
                    backgroundColor: '#22c55e',
                    borderRadius: '4px'
                  }} />
                  <Text size="1">{selectedPlayer.attributes.speed}</Text>
                </Flex>
              </Box>
              
              <Box>
                <Text size="2">Strength</Text>
                <Flex align="center" gap="2">
                  <Box style={{ 
                    width: `${selectedPlayer.attributes.strength}%`, 
                    height: '8px', 
                    backgroundColor: '#3b82f6',
                    borderRadius: '4px'
                  }} />
                  <Text size="1">{selectedPlayer.attributes.strength}</Text>
                </Flex>
              </Box>
              
              <Box>
                <Text size="2">Stamina</Text>
                <Flex align="center" gap="2">
                  <Box style={{ 
                    width: `${selectedPlayer.attributes.stamina}%`, 
                    height: '8px', 
                    backgroundColor: '#f59e0b',
                    borderRadius: '4px'
                  }} />
                  <Text size="1">{selectedPlayer.attributes.stamina}</Text>
                </Flex>
              </Box>
              
              <Box>
                <Text size="2">Agility</Text>
                <Flex align="center" gap="2">
                  <Box style={{ 
                    width: `${selectedPlayer.attributes.agility}%`, 
                    height: '8px', 
                    backgroundColor: '#8b5cf6',
                    borderRadius: '4px'
                  }} />
                  <Text size="1">{selectedPlayer.attributes.agility}</Text>
                </Flex>
              </Box>
              
              <Box>
                <Text size="2">Intelligence</Text>
                <Flex align="center" gap="2">
                  <Box style={{ 
                    width: `${selectedPlayer.attributes.intelligence}%`, 
                    height: '8px', 
                    backgroundColor: '#ec4899',
                    borderRadius: '4px'
                  }} />
                  <Text size="1">{selectedPlayer.attributes.intelligence}</Text>
                </Flex>
              </Box>
            </Grid>
          </Card>
          
          {/* Player Skills */}
          <Card variant="surface">
            <Heading size="3" mb="3">Skills</Heading>
            
            <Grid columns="1" gap="3" width="auto">
              <Box>
                <Text size="2">Kicking</Text>
                <Flex align="center" gap="2">
                  <Box style={{ 
                    width: `${selectedPlayer.attributes.kicking}%`, 
                    height: '8px', 
                    backgroundColor: '#22c55e',
                    borderRadius: '4px'
                  }} />
                  <Text size="1">{selectedPlayer.attributes.kicking}</Text>
                </Flex>
              </Box>
              
              <Box>
                <Text size="2">Marking</Text>
                <Flex align="center" gap="2">
                  <Box style={{ 
                    width: `${selectedPlayer.attributes.marking}%`, 
                    height: '8px', 
                    backgroundColor: '#3b82f6',
                    borderRadius: '4px'
                  }} />
                  <Text size="1">{selectedPlayer.attributes.marking}</Text>
                </Flex>
              </Box>
              
              <Box>
                <Text size="2">Handball</Text>
                <Flex align="center" gap="2">
                  <Box style={{ 
                    width: `${selectedPlayer.attributes.handball}%`, 
                    height: '8px', 
                    backgroundColor: '#f59e0b',
                    borderRadius: '4px'
                  }} />
                  <Text size="1">{selectedPlayer.attributes.handball}</Text>
                </Flex>
              </Box>
              
              <Box>
                <Text size="2">Tackling</Text>
                <Flex align="center" gap="2">
                  <Box style={{ 
                    width: `${selectedPlayer.attributes.tackling}%`, 
                    height: '8px', 
                    backgroundColor: '#8b5cf6',
                    borderRadius: '4px'
                  }} />
                  <Text size="1">{selectedPlayer.attributes.tackling}</Text>
                </Flex>
              </Box>
            </Grid>
          </Card>
          
          {/* Player Status */}
          <Card variant="surface">
            <Heading size="3" mb="3">Status</Heading>
            
            <Grid columns="2" gap="3" width="auto">
              <Box>
                <Text size="2" weight="bold">Form</Text>
                <Flex align="center" gap="2">
                  <Box style={{ 
                    width: `${selectedPlayer.form}%`, 
                    height: '8px', 
                    backgroundColor: selectedPlayer.form > 80 ? '#22c55e' : selectedPlayer.form > 60 ? '#f59e0b' : '#ef4444',
                    borderRadius: '4px'
                  }} />
                  <Text size="1">{selectedPlayer.form}</Text>
                </Flex>
              </Box>
              
              <Box>
                <Text size="2" weight="bold">Fitness</Text>
                <Flex align="center" gap="2">
                  <Box style={{ 
                    width: `${selectedPlayer.fitness}%`, 
                    height: '8px', 
                    backgroundColor: selectedPlayer.fitness > 80 ? '#22c55e' : selectedPlayer.fitness > 60 ? '#f59e0b' : '#ef4444',
                    borderRadius: '4px'
                  }} />
                  <Text size="1">{selectedPlayer.fitness}</Text>
                </Flex>
              </Box>
              
              <Box>
                <Text size="2" weight="bold">Contract</Text>
                <Text>{selectedPlayer.contract.yearsRemaining} years</Text>
              </Box>
              
              <Box>
                <Text size="2" weight="bold">Salary</Text>
                <Text>${selectedPlayer.contract.salary}k/yr</Text>
              </Box>
            </Grid>
          </Card>
          
          {/* Player Statistics */}
          <Card variant="surface">
            <Heading size="3" mb="3">Season Statistics</Heading>
            
            <Grid columns="2" gap="3" width="auto">
              <Box>
                <Text size="2" weight="bold">Games Played</Text>
                <Text>{stats.gamesPlayed}</Text>
              </Box>
              
              <Box>
                <Text size="2" weight="bold">Disposals</Text>
                <Text>{stats.disposals} ({stats.gamesPlayed > 0 ? (stats.disposals / stats.gamesPlayed).toFixed(1) : '0'} avg)</Text>
              </Box>
              
              <Box>
                <Text size="2" weight="bold">Marks</Text>
                <Text>{stats.marks} ({stats.gamesPlayed > 0 ? (stats.marks / stats.gamesPlayed).toFixed(1) : '0'} avg)</Text>
              </Box>
              
              <Box>
                <Text size="2" weight="bold">Tackles</Text>
                <Text>{stats.tackles} ({stats.gamesPlayed > 0 ? (stats.tackles / stats.gamesPlayed).toFixed(1) : '0'} avg)</Text>
              </Box>
              
              <Box>
                <Text size="2" weight="bold">Goals</Text>
                <Text>{stats.goals} ({stats.gamesPlayed > 0 ? (stats.goals / stats.gamesPlayed).toFixed(1) : '0'} avg)</Text>
              </Box>
              
              <Box>
                <Text size="2" weight="bold">Behinds</Text>
                <Text>{stats.behinds} ({stats.gamesPlayed > 0 ? (stats.behinds / stats.gamesPlayed).toFixed(1) : '0'} avg)</Text>
              </Box>
            </Grid>
          </Card>
        </Grid>
      </Card>
    );
  };
  
  return (
    <Box>
      <Heading size="6" mb="4">Players</Heading>
      
      <Card variant="surface" mb="4">
        <Flex gap="3" wrap="wrap" mb="3">
          <Box style={{ flex: 1, minWidth: '200px' }}>
            <Text size="2" mb="1" weight="bold">Filter by Team</Text>
            <Select.Root value={selectedTeamId} onValueChange={setSelectedTeamId as any}>
              <Select.Trigger />
              <Select.Content>
                <Select.Item value="all">All Teams</Select.Item>
                {teams.map(team => (
                  <Select.Item key={team.id} value={team.id}>{team.name}</Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </Box>
          
          <Box style={{ flex: 1, minWidth: '200px' }}>
            <Text size="2" mb="1" weight="bold">Filter by Position</Text>
            <Select.Root value={selectedPosition} onValueChange={setSelectedPosition as any}>
              <Select.Trigger />
              <Select.Content>
                <Select.Item value="all">All Positions</Select.Item>
                <Select.Item value="Forward">Forwards</Select.Item>
                <Select.Item value="Midfielder">Midfielders</Select.Item>
                <Select.Item value="Defender">Defenders</Select.Item>
                <Select.Item value="Ruck">Rucks</Select.Item>
                <Select.Item value="Utility">Utilities</Select.Item>
              </Select.Content>
            </Select.Root>
          </Box>
          
          <Box style={{ flex: 1, minWidth: '200px' }}>
            <Text size="2" mb="1" weight="bold">Search</Text>
            <TextField.Root 
              placeholder="Search players..." 
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            />
          </Box>
        </Flex>
        
        <Text size="2" color="gray">
          Showing {sortedPlayers.length} of {allPlayers.length} players
        </Text>
      </Card>
      
      <Grid columns={{ initial: "1", md: selectedPlayer ? "2" : "1" }} gap="4">
        <Card variant="surface">
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell 
                  onClick={() => handleSortChange("name")}
                  style={{ cursor: 'pointer' }}
                >
                  Name {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                </Table.ColumnHeaderCell>
                
                <Table.ColumnHeaderCell 
                  onClick={() => handleSortChange("team")}
                  style={{ cursor: 'pointer' }}
                >
                  Team {sortBy === "team" && (sortOrder === "asc" ? "↑" : "↓")}
                </Table.ColumnHeaderCell>
                
                <Table.ColumnHeaderCell 
                  onClick={() => handleSortChange("position")}
                  style={{ cursor: 'pointer' }}
                >
                  Position {sortBy === "position" && (sortOrder === "asc" ? "↑" : "↓")}
                </Table.ColumnHeaderCell>
                
                <Table.ColumnHeaderCell 
                  onClick={() => handleSortChange("age")}
                  style={{ cursor: 'pointer' }}
                >
                  Age {sortBy === "age" && (sortOrder === "asc" ? "↑" : "↓")}
                </Table.ColumnHeaderCell>
                
                <Table.ColumnHeaderCell 
                  onClick={() => handleSortChange("rating")}
                  style={{ cursor: 'pointer' }}
                >
                  Rating {sortBy === "rating" && (sortOrder === "asc" ? "↑" : "↓")}
                </Table.ColumnHeaderCell>
                
                <Table.ColumnHeaderCell>
                  Form
                </Table.ColumnHeaderCell>
                
                <Table.ColumnHeaderCell>
                  Stats
                </Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            
            <Table.Body>
              {sortedPlayers.map(player => {
                const team = getTeamById(player.teamId);
                if (!team) return null;
                
                // Calculate overall rating
                const overallRating = calculateOverallRating(player);
                
                // Get player stats
                const stats = playerStats[player.id] || {
                  disposals: 0,
                  marks: 0,
                  tackles: 0,
                  goals: 0,
                  behinds: 0,
                  gamesPlayed: 0
                };
                
                return (
                  <Table.Row 
                    key={player.id}
                    style={{ 
                      cursor: 'pointer',
                      backgroundColor: selectedPlayer?.id === player.id ? 'rgba(59, 130, 246, 0.1)' : undefined
                    }}
                    onClick={() => setSelectedPlayer(player)}
                  >
                    <Table.Cell>
                      <Text weight={player.teamId === gameState.userTeamId ? "bold" : "regular"}>
                        {player.name}
                      </Text>
                    </Table.Cell>
                    
                    <Table.Cell>
                      <Flex gap="2" align="center">
                        <Box style={{ 
                          width: '12px', 
                          height: '12px', 
                          borderRadius: '50%', 
                          backgroundColor: team.colors.primary
                        }} />
                        <Text>{team.name}</Text>
                      </Flex>
                    </Table.Cell>
                    
                    <Table.Cell>
                      <Badge size="1">{player.position}</Badge>
                    </Table.Cell>
                    
                    <Table.Cell>
                      {player.age}
                    </Table.Cell>
                    
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
                    
                    <Table.Cell>
                      <Flex align="center" gap="2">
                        <Box style={{ 
                          width: `${player.form}%`, 
                          height: '8px', 
                          backgroundColor: player.form > 80 ? '#22c55e' : player.form > 60 ? '#f59e0b' : '#ef4444',
                          borderRadius: '4px'
                        }} />
                        <Text size="1">{player.form}</Text>
                      </Flex>
                    </Table.Cell>
                    
                    <Table.Cell>
                      <Flex gap="2">
                        <Text size="2">{stats.disposals} D</Text>
                        <Text size="2">{stats.goals} G</Text>
                      </Flex>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table.Root>
        </Card>
        
        {selectedPlayer && renderPlayerDetails()}
      </Grid>
    </Box>
  );
}
