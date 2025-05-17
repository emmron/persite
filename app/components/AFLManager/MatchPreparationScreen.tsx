import { useState, useMemo } from "react";
import { Box, Button, Heading, Text, Flex, Grid, Card, Badge, Separator } from "@radix-ui/themes";
import { GameState, Match } from "~/data/AFLManager/gameState";
import { Player } from "~/data/AFLManager/players";
import { teams, Team } from "~/data/AFLManager/teams";

interface MatchPreparationScreenProps {
  matchId: string;
  gameState: GameState;
  allPlayers: Player[];
  allTeams: Team[];
  onPreparationComplete: (selectedTeam: Player[], selectedEmergencies: Player[]) => void;
}

const MAX_SQUAD_SIZE = 22;
const MAX_EMERGENCIES = 4;

export default function MatchPreparationScreen({ 
  matchId, 
  gameState, 
  allPlayers,
  allTeams,
  onPreparationComplete 
}: MatchPreparationScreenProps) {
  const [selectedSquadPlayers, setSelectedSquadPlayers] = useState<Player[]>([]);
  const [selectedEmergencyPlayers, setSelectedEmergencyPlayers] = useState<Player[]>([]);

  const matchDetails = gameState.seasonFixtures.find(m => m.id === matchId);
  const userTeam = allTeams.find(t => t.id === gameState.userTeamId);

  const userTeamPlayers = useMemo(() => {
    return allPlayers.filter(p => p.teamId === gameState.userTeamId);
  }, [allPlayers, gameState.userTeamId]);

  if (!matchDetails || !userTeam) {
    return <Text>Error: Match or User Team details not found for preparation.</Text>;
  }

  const opponentId = matchDetails.homeTeamId === userTeam.id 
    ? matchDetails.awayTeamId 
    : matchDetails.homeTeamId;
  const opponentTeam = allTeams.find(t => t.id === opponentId);

  const handleSelectPlayer = (player: Player, type: 'squad' | 'emergency') => {
    const alreadySelected = selectedSquadPlayers.some(p => p.id === player.id) || selectedEmergencyPlayers.some(p => p.id === player.id);
    if (alreadySelected) {
      if (type === 'squad' && selectedEmergencyPlayers.some(p => p.id === player.id)) {
        setSelectedEmergencyPlayers(prev => prev.filter(p => p.id !== player.id));
      }
      if (type === 'emergency' && selectedSquadPlayers.some(p => p.id === player.id)) {
        setSelectedSquadPlayers(prev => prev.filter(p => p.id !== player.id));
      }
    }

    if (type === 'squad') {
      if (selectedSquadPlayers.length < MAX_SQUAD_SIZE && !selectedSquadPlayers.some(p => p.id === player.id)) {
        setSelectedSquadPlayers(prev => [...prev, player]);
      }
    } else if (type === 'emergency') {
      if (selectedEmergencyPlayers.length < MAX_EMERGENCIES && !selectedEmergencyPlayers.some(p => p.id === player.id)) {
        setSelectedEmergencyPlayers(prev => [...prev, player]);
      }
    }
  };

  const handleDeselectPlayer = (playerId: string, type: 'squad' | 'emergency') => {
    if (type === 'squad') {
      setSelectedSquadPlayers(prev => prev.filter(p => p.id !== playerId));
    } else {
      setSelectedEmergencyPlayers(prev => prev.filter(p => p.id !== playerId));
    }
  };

  const availablePlayersToSelect = useMemo(() => {
    return userTeamPlayers.filter(
      p => !selectedSquadPlayers.some(sp => sp.id === p.id) && 
           !selectedEmergencyPlayers.some(ep => ep.id === p.id)
    );
  }, [userTeamPlayers, selectedSquadPlayers, selectedEmergencyPlayers]);
  
  const canProceed = selectedSquadPlayers.length === MAX_SQUAD_SIZE && selectedEmergencyPlayers.length === MAX_EMERGENCIES;

  return (
    <Box p="4">
      <Flex justify="between" align="center" mb="4">
        <Heading>Match Preparation: {userTeam.name} vs {opponentTeam?.name || 'Opponent'}</Heading>
        <Button size="3" onClick={() => onPreparationComplete(selectedSquadPlayers, selectedEmergencyPlayers)} disabled={!canProceed}>
          Proceed to Match ({selectedSquadPlayers.length}/{MAX_SQUAD_SIZE}, {selectedEmergencyPlayers.length}/{MAX_EMERGENCIES} Emerg)
        </Button>
      </Flex>
      <Text mb="2">Round: {matchDetails.round}, Venue: {matchDetails.venue}</Text>
      
      <Grid columns={{initial: "1", md: "3"}} gap="4">
        <Card>
          <Heading size="3" mb="2">Available Players ({availablePlayersToSelect.length})</Heading>
          <Flex direction="column" gap="2" style={{maxHeight: '60vh', overflowY: 'auto'}}>
            {availablePlayersToSelect.map(player => (
              <Card key={player.id} size="1">
                <Flex justify="between" align="center">
                  <Box>
                    <Text weight="bold">{player.name}</Text>
                    <Flex gap="2">
                      <Badge>{player.position}</Badge>
                      <Text size="1">Fit: {player.fitness}%</Text>
                      <Text size="1">Form: {player.form}</Text>
                    </Flex>
                  </Box>
                  <Flex direction="column" gap="1">
                    <Button size="1" variant="outline" onClick={() => handleSelectPlayer(player, 'squad')} disabled={selectedSquadPlayers.length >= MAX_SQUAD_SIZE}>
                      To Squad
                    </Button>
                    <Button size="1" variant="outline" onClick={() => handleSelectPlayer(player, 'emergency')} disabled={selectedEmergencyPlayers.length >= MAX_EMERGENCIES}>
                      To Emerg
                    </Button>
                  </Flex>
                </Flex>
              </Card>
            ))}
          </Flex>
        </Card>

        <Card>
          <Heading size="3" mb="2">Selected Squad ({selectedSquadPlayers.length}/{MAX_SQUAD_SIZE})</Heading>
          <Flex direction="column" gap="2" style={{maxHeight: '60vh', overflowY: 'auto'}}>
            {selectedSquadPlayers.map(player => (
              <Card key={player.id} size="1" style={{backgroundColor: 'var(--green-3)'}}>
                <Flex justify="between" align="center">
                  <Box>
                    <Text weight="bold">{player.name}</Text>
                    <Flex gap="2">
                      <Badge>{player.position}</Badge>
                      <Text size="1">Fit: {player.fitness}%</Text>
                    </Flex>
                  </Box>
                  <Button size="1" variant="soft" color="red" onClick={() => handleDeselectPlayer(player.id, 'squad')}>
                    Remove
                  </Button>
                </Flex>
              </Card>
            ))}
          </Flex>
        </Card>

        <Card>
          <Heading size="3" mb="2">Emergencies ({selectedEmergencyPlayers.length}/{MAX_EMERGENCIES})</Heading>
          <Flex direction="column" gap="2" style={{maxHeight: '60vh', overflowY: 'auto'}}>
            {selectedEmergencyPlayers.map(player => (
              <Card key={player.id} size="1" style={{backgroundColor: 'var(--amber-3)'}}>
                <Flex justify="between" align="center">
                  <Box>
                    <Text weight="bold">{player.name}</Text>
                     <Flex gap="2">
                      <Badge>{player.position}</Badge>
                      <Text size="1">Fit: {player.fitness}%</Text>
                    </Flex>
                  </Box>
                  <Button size="1" variant="soft" color="red" onClick={() => handleDeselectPlayer(player.id, 'emergency')}>
                    Remove
                  </Button>
                </Flex>
              </Card>
            ))}
          </Flex>
        </Card>
      </Grid>

      <Separator size="4" my="4" />

      <Box mb="4" p="3" style={{ border: '1px solid var(--gray-a7)', borderRadius: 'var(--radius-3)'}}>
        <Heading size="3" mb="2">Tactical Planning</Heading>
        <Text color="gray">(Placeholder for game plans, structures, set plays)</Text>
      </Box>
      
      <Box mb="4" p="3" style={{ border: '1px solid var(--gray-a7)', borderRadius: 'var(--radius-3)'}}>
        <Heading size="3" mb="2">Team Talk</Heading>
        <Text color="gray">(Placeholder for pre-match team talk options)</Text>
      </Box>

    </Box>
  );
} 