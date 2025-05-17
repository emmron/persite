import { Box, Heading, Text, Grid, Button, Card, Flex, Separator, RadioGroup } from "@radix-ui/themes";
import { useState } from "react";
import { GameState, TrainingFocus } from "~/data/AFLManager/gameState";
import { Player } from "~/data/AFLManager/players";

type TrainingProps = {
  gameState: GameState;
  allPlayers: Player[];
  selectedDate: string;
  onScheduleTraining: (
    date: string, 
    focus: TrainingFocus, 
    intensity: "light" | "medium" | "intense", 
    playerIds: string[]
  ) => void;
  onCancel: () => void;
};

export default function Training({
  gameState,
  allPlayers,
  selectedDate,
  onScheduleTraining,
  onCancel,
}: TrainingProps) {
  const [selectedFocus, setSelectedFocus] = useState<TrainingFocus>("fitness");
  const [selectedIntensity, setSelectedIntensity] = useState<"light" | "medium" | "intense">("medium");
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  
  const teamPlayers = allPlayers.filter(player => player.teamId === gameState.userTeamId);
  
  // Handle player selection toggle
  const togglePlayerSelection = (playerId: string) => {
    if (selectedPlayers.includes(playerId)) {
      setSelectedPlayers(selectedPlayers.filter(id => id !== playerId));
    } else {
      setSelectedPlayers([...selectedPlayers, playerId]);
    }
  };
  
  // Handle select all players
  const selectAllPlayers = () => {
    setSelectedPlayers(teamPlayers.map(player => player.id));
  };
  
  // Handle deselect all players
  const deselectAllPlayers = () => {
    setSelectedPlayers([]);
  };
  
  // Handle schedule training submission
  const handleSubmit = () => {
    onScheduleTraining(
      selectedDate,
      selectedFocus,
      selectedIntensity,
      selectedPlayers.length > 0 ? selectedPlayers : teamPlayers.map(player => player.id)
    );
  };
  
  return (
    <Box>
      <Card style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Flex direction="column" gap="4">
          <Heading size="5">Schedule Training Session</Heading>
          <Text>Date: {selectedDate}</Text>
          
          <Box>
            <Text weight="bold" mb="2">Training Focus</Text>
            <RadioGroup.Root 
              value={selectedFocus} 
              onValueChange={(value: string) => setSelectedFocus(value as TrainingFocus)}
            >
              <Flex gap="3" wrap="wrap">
                <RadioGroup.Item value="attack">
                  Attack
                </RadioGroup.Item>
                <RadioGroup.Item value="defense">
                  Defense
                </RadioGroup.Item>
                <RadioGroup.Item value="fitness">
                  Fitness
                </RadioGroup.Item>
                <RadioGroup.Item value="teamwork">
                  Teamwork
                </RadioGroup.Item>
                <RadioGroup.Item value="set_pieces">
                  Set Pieces
                </RadioGroup.Item>
                <RadioGroup.Item value="recovery">
                  Recovery
                </RadioGroup.Item>
              </Flex>
            </RadioGroup.Root>
          </Box>
          
          <Box>
            <Text weight="bold" mb="2">Training Intensity</Text>
            <RadioGroup.Root 
              value={selectedIntensity} 
              onValueChange={(value: string) => setSelectedIntensity(value as "light" | "medium" | "intense")}
            >
              <Flex gap="3" wrap="wrap">
                <RadioGroup.Item value="light">
                  Light
                </RadioGroup.Item>
                <RadioGroup.Item value="medium">
                  Medium
                </RadioGroup.Item>
                <RadioGroup.Item value="intense">
                  Intense
                </RadioGroup.Item>
              </Flex>
            </RadioGroup.Root>
          </Box>
          
          <Box>
            <Flex justify="between" align="center">
              <Text weight="bold">Player Selection</Text>
              <Flex gap="2">
                <Button variant="outline" size="1" onClick={selectAllPlayers}>
                  Select All
                </Button>
                <Button variant="outline" size="1" onClick={deselectAllPlayers}>
                  Deselect All
                </Button>
              </Flex>
            </Flex>
            
            <Text size="1" color="gray" mb="2">
              {selectedPlayers.length} of {teamPlayers.length} players selected
            </Text>
            
            <Card style={{ maxHeight: '300px', overflowY: 'auto' }}>
              <Grid columns="2" gap="2">
                {teamPlayers.map((player) => (
                  <Card 
                    key={player.id}
                    style={{ 
                      cursor: 'pointer',
                      backgroundColor: selectedPlayers.includes(player.id) ? '#2a4c6d' : '#333'
                    }}
                    onClick={() => togglePlayerSelection(player.id)}
                  >
                    <Flex gap="2" align="center">
                      <Box style={{ 
                        width: '20px', 
                        height: '20px', 
                        borderRadius: '50%', 
                        backgroundColor: selectedPlayers.includes(player.id) ? '#60a5fa' : '#555',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {selectedPlayers.includes(player.id) && (
                          <span style={{ color: 'white', fontSize: '12px' }}>✓</span>
                        )}
                      </Box>
                      <Box>
                        <Text weight="bold">{player.name}</Text>
                        <Text size="1">
                          {player.position} | Rating: {player.form}
                        </Text>
                      </Box>
                    </Flex>
                  </Card>
                ))}
              </Grid>
            </Card>
          </Box>
          
          <Flex gap="2" justify="end" mt="4">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Schedule Training
            </Button>
          </Flex>
        </Flex>
      </Card>
    </Box>
  );
}
