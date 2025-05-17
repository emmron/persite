import { Box, Heading, Text, Button, Card, Flex, Separator, TextArea } from "@radix-ui/themes";
import { useState } from "react";
import { GameState } from "~/data/AFLManager/gameState";
import { teams } from "~/data/AFLManager/teams";

type ResignationProps = {
  gameState: GameState;
  onConfirmResign: (reason: string) => void;
  onCancel: () => void;
};

export default function Resignation({
  gameState,
  onConfirmResign,
  onCancel,
}: ResignationProps) {
  const [resignReason, setResignReason] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const userTeam = teams.find(team => team.id === gameState.userTeamId);
  
  // Handle initial resignation request
  const handleResignRequest = () => {
    setShowConfirmation(true);
  };
  
  // Handle confirming resignation
  const handleConfirmResign = () => {
    onConfirmResign(resignReason);
  };
  
  if (!showConfirmation) {
    return (
      <Box>
        <Card style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Flex direction="column" gap="4">
            <Heading size="5" color="red">Considering Resignation</Heading>
            
            <Text>
              Are you sure you want to resign as coach of {userTeam?.name}? This action cannot be undone.
            </Text>
            
            <Text size="2" color="gray">
              Your resignation will end your current career, and you'll need to start a new game.
            </Text>
            
            <Box>
              <Text weight="bold" mb="2">Reason for Resignation:</Text>
              <TextArea 
                placeholder="Please provide a reason for your resignation..." 
                value={resignReason}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setResignReason(e.target.value)}
                style={{ width: '100%', minHeight: '120px' }}
              />
            </Box>
            
            <Flex gap="2" justify="end" mt="4">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button 
                color="red" 
                onClick={handleResignRequest}
                disabled={resignReason.trim().length === 0}
              >
                Submit Resignation
              </Button>
            </Flex>
          </Flex>
        </Card>
      </Box>
    );
  }
  
  return (
    <Box>
      <Card style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Flex direction="column" gap="4">
          <Heading size="5" color="red">Confirm Resignation</Heading>
          
          <Text>
            You are about to resign as head coach of {userTeam?.name}.
            This will end your current career. Are you absolutely sure?
          </Text>
          
          <Box style={{ 
            padding: '16px', 
            backgroundColor: '#332222', 
            borderRadius: '4px', 
            border: '1px solid #663333' 
          }}>
            <Text weight="bold" mb="2">Your Resignation Statement:</Text>
            <Text style={{ fontStyle: 'italic' }}>"{resignReason}"</Text>
          </Box>
          
          <Text size="2" color="gray">
            Career statistics:
          </Text>
          
          <Box>
            <Flex direction="column" gap="1">
              <Text>Seasons: {1}</Text>
              <Text>
                Win-Loss Record: {gameState.ladder.find(pos => pos.teamId === gameState.userTeamId)?.wins || 0}-
                {gameState.ladder.find(pos => pos.teamId === gameState.userTeamId)?.losses || 0}
              </Text>
              <Text>
                Final Position: {gameState.ladder
                  .sort((a, b) => {
                    if (b.points !== a.points) return b.points - a.points;
                    return b.percentage - a.percentage;
                  })
                  .findIndex(pos => pos.teamId === gameState.userTeamId) + 1}
              </Text>
            </Flex>
          </Box>
          
          <Flex gap="2" justify="end" mt="4">
            <Button variant="outline" onClick={() => setShowConfirmation(false)}>
              Go Back
            </Button>
            <Button 
              color="red" 
              onClick={handleConfirmResign}
            >
              Confirm Resignation
            </Button>
          </Flex>
        </Flex>
      </Card>
    </Box>
  );
}
