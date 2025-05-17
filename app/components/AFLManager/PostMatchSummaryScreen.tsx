import { Box, Button, Heading, Text, Grid } from "@radix-ui/themes";
import { GameState, Match } from "~/data/AFLManager/gameState"; 
import { teams } from "~/data/AFLManager/teams"; // Import teams for team name lookup

interface PostMatchSummaryScreenProps {
  matchId: string;
  gameState: GameState;
  onContinue: () => void; // Callback to return to dashboard/main flow
}

export default function PostMatchSummaryScreen({ matchId, gameState, onContinue }: PostMatchSummaryScreenProps) {
  const matchDetails = gameState.seasonFixtures.find(m => m.id === matchId);

  if (!matchDetails || !matchDetails.result) {
    return <Text>Error: Match details or result not found for summary.</Text>;
  }
  
  const homeTeam = teams.find(t => t.id === matchDetails.homeTeamId);
  const awayTeam = teams.find(t => t.id === matchDetails.awayTeamId);

  return (
    <Box p="4">
      <Heading mb="4">Post-Match Summary</Heading>
      <Text size="4" weight="bold" mb="2">
        {homeTeam?.name || 'Home'} {matchDetails.result.homeScore.total} - {awayTeam?.name || 'Away'} {matchDetails.result.awayScore.total}
      </Text>
      <Grid columns="2" gap="3" mb="4">
        <Box>
          <Text weight="bold">{homeTeam?.name}</Text>
          <Text>Goals: {matchDetails.result.homeScore.goals}</Text>
          <Text>Behinds: {matchDetails.result.homeScore.behinds}</Text>
        </Box>
        <Box>
          <Text weight="bold">{awayTeam?.name}</Text>
          <Text>Goals: {matchDetails.result.awayScore.goals}</Text>
          <Text>Behinds: {matchDetails.result.awayScore.behinds}</Text>
        </Box>
      </Grid>
      
      {/* TODO: Display detailed player stats (Rule 5.1.3), KPIs, Coach's votes etc. (Rule 5.3.1) */}
      <Text color="gray" mb="4">(Placeholder for detailed match statistics and analysis)</Text>

      <Button size="3" onClick={onContinue}>
        Continue
      </Button>
    </Box>
  );
} 