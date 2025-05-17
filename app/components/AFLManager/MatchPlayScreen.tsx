import { Box, Button, Heading, Text } from "@radix-ui/themes";
import { GameState, Match } from "~/data/AFLManager/gameState"; // Adjust imports

interface MatchPlayScreenProps {
  matchId: string;
  gameState: GameState;
  onMatchEnd: () => void; // Callback when match finishes
}

export default function MatchPlayScreen({ matchId, gameState, onMatchEnd }: MatchPlayScreenProps) {
  const matchDetails = gameState.seasonFixtures.find(m => m.id === matchId);
  // Further logic to get team names etc.

  return (
    <Box p="4" style={{ 
      width: '100%', 
      height: '100%', // Or use 100vh if parent doesn't restrict height
      display: 'flex', 
      flexDirection: 'column',
      backgroundColor: 'var(--gray-1)' // A slightly different background for the match screen
    }}>
      <Heading mb="4" align="center">Match Live: {matchDetails?.homeTeamId} vs {matchDetails?.awayTeamId}</Heading>
      
      {/* Main content area for match simulation - should expand */}
      <Box style={{
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        border: '1px dashed var(--gray-a7)',
        borderRadius: 'var(--radius-3)',
        backgroundColor: 'var(--gray-2)'
      }}>
        <Text mb="4">(Placeholder for 2D/3D match simulation or text commentary - Rule 5.1)</Text>
      </Box>
      
      {/* This button would eventually be triggered by the simulation ending */}
      <Button size="3" onClick={onMatchEnd} mt="4" style={{alignSelf: 'center'}}>
        Simulate to End / Finish Match
      </Button>
    </Box>
  );
} 