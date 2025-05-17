import { useState, useEffect } from "react";
import { Card, Flex, Heading, Text, Box, Button, Select, Separator, Grid, Badge } from "@radix-ui/themes";
import { Team, teams } from "~/data/AFLManager/teams";
import { initialGameState, initializeGameState } from "~/data/AFLManager/gameState";
import { players, generatePlayersForTeam } from "~/data/AFLManager/players";

interface GameInitializationProps {
  onGameStart: (gameState: any) => void;
}

export default function GameInitialization({ onGameStart }: GameInitializationProps) {
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [step, setStep] = useState<"team-selection" | "confirmation">("team-selection");
  
  // Update selected team when ID changes
  useEffect(() => {
    if (selectedTeamId) {
      const team = teams.find(t => t.id === selectedTeamId) || null;
      setSelectedTeam(team);
    } else {
      setSelectedTeam(null);
    }
  }, [selectedTeamId]);
  
  // Handle team selection
  const handleTeamSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTeamId(event.target.value);
  };
  
  // Handle difficulty selection
  const handleDifficultySelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDifficulty(event.target.value as "easy" | "medium" | "hard");
  };
  
  // Handle continue to confirmation
  const handleContinue = () => {
    if (selectedTeamId) {
      setStep("confirmation");
    }
  };
  
  // Handle back to team selection
  const handleBack = () => {
    setStep("team-selection");
  };
  
  // Handle game start
  const handleStartGame = () => {
    if (selectedTeamId) {
      // Generate additional players for all teams
      const allPlayers = [...players];
      
      teams.forEach(team => {
        // Skip if we already have enough players for this team
        const existingPlayers = players.filter(p => p.teamId === team.id);
        if (existingPlayers.length < 22) {
          const additionalPlayers = generatePlayersForTeam(
            team.id, 
            22 - existingPlayers.length
          );
          allPlayers.push(...additionalPlayers);
        }
      });
      
      // Initialize game state
      const gameState = initializeGameState(selectedTeamId, teams, allPlayers);
      
      // Apply difficulty settings
      gameState.settings.difficulty = difficulty;
      
      // Start the game
      onGameStart(gameState);
    }
  };
  
  // Render team selection step
  const renderTeamSelection = () => (
    <Box style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Flex justify="between" align="center" mb="4">
        <Heading size="6" style={{ color: '#fff' }}>Select Your Team</Heading>
        <Badge size="2" color="blue">New Career</Badge>
      </Flex>
      
      <Text mb="4" size="3" style={{ color: '#ddd' }}>
        Choose the AFL team you want to manage. Each team has different strengths, 
        weaknesses, and expectations.
      </Text>
      
      <Flex direction="column" gap="4">
        <Grid columns={{ initial: "1", md: "2" }} gap="4">
          <Box>
            <Text size="2" mb="2" weight="bold" style={{ color: '#aaa' }}>Team</Text>
            <Select.Root value={selectedTeamId} onValueChange={setSelectedTeamId}>
              <Select.Trigger placeholder="Select a team" />
              <Select.Content>
                <Select.Group>
                  {teams.map(team => (
                    <Select.Item key={team.id} value={team.id}>
                      {team.name}
                    </Select.Item>
                  ))}
                </Select.Group>
              </Select.Content>
            </Select.Root>
          </Box>
          
          <Box>
            <Text size="2" mb="2" weight="bold" style={{ color: '#aaa' }}>Difficulty</Text>
            <Select.Root value={difficulty} onValueChange={setDifficulty as any}>
              <Select.Trigger />
              <Select.Content>
                <Select.Item value="easy">Easy</Select.Item>
                <Select.Item value="medium">Medium</Select.Item>
                <Select.Item value="hard">Hard</Select.Item>
              </Select.Content>
            </Select.Root>
          </Box>
        </Grid>
        
        {selectedTeam && (
          <Card variant="surface" mt="4" style={{ backgroundColor: '#222', borderColor: '#444' }}>
            <Flex justify="between" align="center" mb="3">
              <Heading size="4" style={{ color: '#fff' }}>{selectedTeam.name}</Heading>
              <Box style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                backgroundColor: selectedTeam.colors.primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold'
              }}>
                {selectedTeam.name.substring(0, 2).toUpperCase()}
              </Box>
            </Flex>
            
            <Grid columns={{ initial: "1", md: "2" }} gap="4">
              <Box>
                <Text size="2" weight="bold" style={{ color: '#aaa' }}>Home Ground</Text>
                <Text style={{ color: '#fff' }}>{selectedTeam.homeGround}</Text>
              </Box>
              
              <Box>
                <Text size="2" weight="bold" style={{ color: '#aaa' }}>Team Colors</Text>
                <Flex gap="2" align="center">
                  <Box style={{ 
                    width: '20px', 
                    height: '20px', 
                    backgroundColor: selectedTeam.colors.primary,
                    borderRadius: '4px'
                  }} />
                  <Box style={{ 
                    width: '20px', 
                    height: '20px', 
                    backgroundColor: selectedTeam.colors.secondary || '#ffffff',
                    borderRadius: '4px'
                  }} />
                </Flex>
              </Box>
            </Grid>
            
            <Separator size="4" my="3" style={{ backgroundColor: '#444' }} />
            
            <Text size="2" weight="bold" mb="2" style={{ color: '#aaa' }}>Team Attributes</Text>
            <Grid columns="2" gap="3" width="auto">
              <Box>
                <Flex justify="between">
                  <Text size="2" style={{ color: '#fff' }}>Attack</Text>
                  <Text size="2" weight="bold" style={{ color: '#fff' }}>{selectedTeam.attributes.attack}</Text>
                </Flex>
                <Box style={{ 
                  width: '100%', 
                  height: '8px', 
                  backgroundColor: '#333',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <Box style={{ 
                    width: `${selectedTeam.attributes.attack}%`, 
                    height: '100%', 
                    backgroundColor: '#22c55e'
                  }} />
                </Box>
              </Box>
              
              <Box>
                <Flex justify="between">
                  <Text size="2" style={{ color: '#fff' }}>Midfield</Text>
                  <Text size="2" weight="bold" style={{ color: '#fff' }}>{selectedTeam.attributes.midfield}</Text>
                </Flex>
                <Box style={{ 
                  width: '100%', 
                  height: '8px', 
                  backgroundColor: '#333',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <Box style={{ 
                    width: `${selectedTeam.attributes.midfield}%`, 
                    height: '100%', 
                    backgroundColor: '#3b82f6'
                  }} />
                </Box>
              </Box>
              
              <Box>
                <Flex justify="between">
                  <Text size="2" style={{ color: '#fff' }}>Defense</Text>
                  <Text size="2" weight="bold" style={{ color: '#fff' }}>{selectedTeam.attributes.defense}</Text>
                </Flex>
                <Box style={{ 
                  width: '100%', 
                  height: '8px', 
                  backgroundColor: '#333',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <Box style={{ 
                    width: `${selectedTeam.attributes.defense}%`, 
                    height: '100%', 
                    backgroundColor: '#f59e0b'
                  }} />
                </Box>
              </Box>
              
              <Box>
                <Flex justify="between">
                  <Text size="2" style={{ color: '#fff' }}>Coaching</Text>
                  <Text size="2" weight="bold" style={{ color: '#fff' }}>{selectedTeam.attributes.coaching}</Text>
                </Flex>
                <Box style={{ 
                  width: '100%', 
                  height: '8px', 
                  backgroundColor: '#333',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <Box style={{ 
                    width: `${selectedTeam.attributes.coaching}%`, 
                    height: '100%', 
                    backgroundColor: '#8b5cf6'
                  }} />
                </Box>
              </Box>
            </Grid>
          </Card>
        )}
        
        <button 
          disabled={!selectedTeamId} 
          onClick={handleContinue}
          style={{ 
            marginTop: '16px',
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: selectedTeamId ? '#3b82f6' : '#555',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: selectedTeamId ? 'pointer' : 'not-allowed',
            width: '100%'
          }}
        >
          Continue
        </button>
      </Flex>
    </Box>
  );
  
  // Render confirmation step
  const renderConfirmation = () => {
    if (!selectedTeam) return null;
    
    // Calculate team overall rating
    const overallRating = Math.round(
      (selectedTeam.attributes.attack + 
       selectedTeam.attributes.midfield + 
       selectedTeam.attributes.defense + 
       selectedTeam.attributes.coaching) / 4
    );
    
    // Determine expectations based on team strength
    let expectations = "";
    if (overallRating >= 85) {
      expectations = "As one of the strongest teams in the competition, the board expects nothing less than a premiership challenge. Fans are demanding success.";
    } else if (overallRating >= 80) {
      expectations = "The board expects the team to make finals and challenge for the premiership. Fans are optimistic about the season ahead.";
    } else if (overallRating >= 75) {
      expectations = "The board expects the team to push for a finals position. Fans are hoping for improvement from last season.";
    } else {
      expectations = "The board understands this is a rebuilding phase. Focus on developing young players and showing improvement throughout the season.";
    }
    
    return (
      <Box style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Flex justify="between" align="center" mb="4">
          <Heading size="6" style={{ color: '#fff' }}>Confirm Your Selection</Heading>
          <Badge size="2" color="blue">New Career</Badge>
        </Flex>
        
        <Card variant="surface" style={{ backgroundColor: '#222', borderColor: '#444' }}>
          <Flex justify="between" align="center" mb="3">
            <Heading size="4" style={{ color: '#fff' }}>
              {selectedTeam.name} - {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Difficulty
            </Heading>
            <Box style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              backgroundColor: selectedTeam.colors.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold'
            }}>
              {selectedTeam.name.substring(0, 2).toUpperCase()}
            </Box>
          </Flex>
          
          <Text mb="3" style={{ color: '#ddd' }}>
            You are about to begin your journey as the head coach of the {selectedTeam.name}.
          </Text>
          
          <Separator size="4" my="3" style={{ backgroundColor: '#444' }} />
          
          <Box mb="3">
            <Text size="2" weight="bold" mb="2" style={{ color: '#aaa' }}>Board Expectations</Text>
            <Text style={{ color: '#ddd' }}>{expectations}</Text>
          </Box>
          
          <Box mb="3">
            <Text size="2" weight="bold" mb="2" style={{ color: '#aaa' }}>Team Overview</Text>
            <Flex align="center" gap="2">
              <Box style={{ 
                width: '50px', 
                height: '50px', 
                borderRadius: '50%', 
                backgroundColor: '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '18px'
              }}>
                {overallRating}
              </Box>
              <Box>
                <Text style={{ color: '#fff' }}>Overall Rating</Text>
                <Text size="2" style={{ color: '#aaa' }}>
                  {overallRating >= 85 ? "Premiership Contender" : 
                   overallRating >= 80 ? "Finals Contender" : 
                   overallRating >= 75 ? "Mid-table" : "Rebuilding"}
                </Text>
              </Box>
            </Flex>
          </Box>
          
          <Box mb="3">
            <Text size="2" weight="bold" mb="1" style={{ color: '#aaa' }}>Home Ground</Text>
            <Text style={{ color: '#ddd' }}>{selectedTeam.homeGround}</Text>
          </Box>
          
          <Separator size="4" my="3" style={{ backgroundColor: '#444' }} />
          
          <Text size="3" mb="3" style={{ color: '#fff' }}>
            Are you ready to take on the challenge of leading the {selectedTeam.name} to glory?
          </Text>
          
          <Flex gap="3" mt="3">
            <Button 
              variant="outline" 
              onClick={handleBack}
              style={{ borderColor: '#444', color: '#ddd' }}
            >
              Back
            </Button>
            <button 
              onClick={handleStartGame}
              style={{ 
                backgroundColor: '#3b82f6', 
                color: 'white',
                padding: '12px 24px',
                fontSize: '16px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Start Career
            </button>
          </Flex>
        </Card>
      </Box>
    );
  };
  
  return (
    <Box style={{ padding: '40px 20px' }}>
      {step === "team-selection" ? renderTeamSelection() : renderConfirmation()}
    </Box>
  );
}
