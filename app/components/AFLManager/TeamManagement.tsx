import { useState, useEffect } from "react";
import { Card, Flex, Heading, Text, Box, Button, Select, Separator, Grid, Badge, Table } from "@radix-ui/themes";
import { GameState } from "~/data/AFLManager/gameState";
import { Team, teams } from "~/data/AFLManager/teams";
import { Player, Position } from "~/data/AFLManager/players";

interface TeamManagementProps {
  gameState: GameState;
  allPlayers: Player[];
}

export default function TeamManagement({ gameState, allPlayers }: TeamManagementProps) {
  const [selectedPosition, setSelectedPosition] = useState<Position | "All">("All");
  const [sortBy, setSortBy] = useState<"name" | "position" | "age" | "rating">("rating");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  // Get user team
  const userTeam = teams.find(team => team.id === gameState.userTeamId);
  
  if (!userTeam) {
    return <Text>Error: Team not found</Text>;
  }
  
  // Get team players
  const teamPlayers = allPlayers.filter(player => player.teamId === gameState.userTeamId);
  
  // Filter players by position
  const filteredPlayers = selectedPosition === "All" 
    ? teamPlayers 
    : teamPlayers.filter(player => player.position === selectedPosition);
  
  // Sort players
  const sortedPlayers = [...filteredPlayers].sort((a, b) => {
    if (sortBy === "name") {
      return sortOrder === "asc" 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name);
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
  
  // Calculate overall rating for a player
  function calculateOverallRating(player: Player): number {
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
  }
  
  // Handle sort change
  const handleSortChange = (newSortBy: "name" | "position" | "age" | "rating") => {
    if (sortBy === newSortBy) {
      // Toggle sort order if clicking the same column
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Set new sort column and default to descending for rating, ascending for others
      setSortBy(newSortBy);
      setSortOrder(newSortBy === "rating" ? "desc" : "asc");
    }
  };
  
  // Get position counts
  const positionCounts = {
    Forward: teamPlayers.filter(p => p.position === "Forward").length,
    Midfielder: teamPlayers.filter(p => p.position === "Midfielder").length,
    Defender: teamPlayers.filter(p => p.position === "Defender").length,
    Ruck: teamPlayers.filter(p => p.position === "Ruck").length,
    Utility: teamPlayers.filter(p => p.position === "Utility").length,
  };
  
  return (
    <Box>
      <Heading size="6" mb="4">Team Management</Heading>
      
      <Card variant="surface" mb="4">
        <Heading size="4" mb="2">{userTeam.name} Squad</Heading>
        
        <Grid columns={{ initial: "1", sm: "2", md: "5" }} gap="3" mb="4">
          <Card variant="surface" size="1">
            <Text size="2" weight="bold">Forwards</Text>
            <Text size="6">{positionCounts.Forward}</Text>
          </Card>
          
          <Card variant="surface" size="1">
            <Text size="2" weight="bold">Midfielders</Text>
            <Text size="6">{positionCounts.Midfielder}</Text>
          </Card>
          
          <Card variant="surface" size="1">
            <Text size="2" weight="bold">Defenders</Text>
            <Text size="6">{positionCounts.Defender}</Text>
          </Card>
          
          <Card variant="surface" size="1">
            <Text size="2" weight="bold">Rucks</Text>
            <Text size="6">{positionCounts.Ruck}</Text>
          </Card>
          
          <Card variant="surface" size="1">
            <Text size="2" weight="bold">Utilities</Text>
            <Text size="6">{positionCounts.Utility}</Text>
          </Card>
        </Grid>
        
        <Flex gap="3" mb="4">
          <Box style={{ flex: 1 }}>
            <Text size="2" mb="1" weight="bold">Filter by Position</Text>
            <Select.Root value={selectedPosition} onValueChange={setSelectedPosition as any}>
              <Select.Trigger />
              <Select.Content>
                <Select.Item value="All">All Positions</Select.Item>
                <Select.Item value="Forward">Forwards</Select.Item>
                <Select.Item value="Midfielder">Midfielders</Select.Item>
                <Select.Item value="Defender">Defenders</Select.Item>
                <Select.Item value="Ruck">Rucks</Select.Item>
                <Select.Item value="Utility">Utilities</Select.Item>
              </Select.Content>
            </Select.Root>
          </Box>
        </Flex>
        
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell 
                onClick={() => handleSortChange("name")}
                style={{ cursor: 'pointer' }}
              >
                Name {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
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
                Fitness
              </Table.ColumnHeaderCell>
              
              <Table.ColumnHeaderCell>
                Contract
              </Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          
          <Table.Body>
            {sortedPlayers.map(player => (
              <Table.Row key={player.id}>
                <Table.Cell>
                  <Text weight="bold">{player.name}</Text>
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
                    {calculateOverallRating(player)}
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
                  <Flex align="center" gap="2">
                    <Box style={{ 
                      width: `${player.fitness}%`, 
                      height: '8px', 
                      backgroundColor: player.fitness > 80 ? '#22c55e' : player.fitness > 60 ? '#f59e0b' : '#ef4444',
                      borderRadius: '4px'
                    }} />
                    <Text size="1">{player.fitness}</Text>
                  </Flex>
                </Table.Cell>
                
                <Table.Cell>
                  <Text size="2">{player.contract.yearsRemaining} years</Text>
                  <Text size="2">${player.contract.salary}k/yr</Text>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Card>
      
      <Card variant="surface">
        <Heading size="4" mb="3">Team Tactics</Heading>
        
        <Text mb="3">
          Set your team's playing style and tactical approach. These settings will influence how your team performs in matches.
        </Text>
        
        <Grid columns={{ initial: "1", sm: "2" }} gap="4">
          <Box>
            <Text size="2" mb="1" weight="bold">Playing Style</Text>
            <Select.Root defaultValue="balanced">
              <Select.Trigger />
              <Select.Content>
                <Select.Item value="defensive">Defensive</Select.Item>
                <Select.Item value="balanced">Balanced</Select.Item>
                <Select.Item value="attacking">Attacking</Select.Item>
              </Select.Content>
            </Select.Root>
            
            <Text size="2" color="gray" mt="1">
              Defensive: Focus on preventing opposition scoring.
              Balanced: Equal focus on attack and defense.
              Attacking: Prioritize scoring over defense.
            </Text>
          </Box>
          
          <Box>
            <Text size="2" mb="1" weight="bold">Pressure Intensity</Text>
            <Select.Root defaultValue="5">
              <Select.Trigger />
              <Select.Content>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(value => (
                  <Select.Item key={value} value={value.toString()}>
                    {value} {value < 4 ? "(Low)" : value < 8 ? "(Medium)" : "(High)"}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
            
            <Text size="2" color="gray" mt="1">
              Higher pressure can force more turnovers but may tire players faster.
            </Text>
          </Box>
          
          <Box>
            <Text size="2" mb="1" weight="bold">Possession Style</Text>
            <Select.Root defaultValue="5">
              <Select.Trigger />
              <Select.Content>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(value => (
                  <Select.Item key={value} value={value.toString()}>
                    {value} {value < 4 ? "(Direct)" : value < 8 ? "(Mixed)" : "(Possession)"}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
            
            <Text size="2" color="gray" mt="1">
              Direct: Quick forward movement. Possession: Patient build-up play.
            </Text>
          </Box>
          
          <Box>
            <Text size="2" mb="1" weight="bold">Risk Taking</Text>
            <Select.Root defaultValue="5">
              <Select.Trigger />
              <Select.Content>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(value => (
                  <Select.Item key={value} value={value.toString()}>
                    {value} {value < 4 ? "(Conservative)" : value < 8 ? "(Balanced)" : "(Aggressive)"}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
            
            <Text size="2" color="gray" mt="1">
              Higher risk may lead to more scoring opportunities but also more turnovers.
            </Text>
          </Box>
        </Grid>
        
        <Button mt="4">Save Tactics</Button>
      </Card>
    </Box>
  );
}
