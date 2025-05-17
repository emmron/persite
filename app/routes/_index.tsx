import { Container, Card, Heading, Tabs, Text, Box, Separator } from "@radix-ui/themes";
import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState, useEffect } from "react";
import Header from "~/components/Header";
import { generateMetaTags } from "~/utils/generateMetaTags";
import GameInitialization from "~/components/AFLManager/GameInitialization";
import Dashboard from "~/components/AFLManager/Dashboard";
import TeamManagement from "~/components/AFLManager/TeamManagement";
import { GameState, initialGameState } from "~/data/AFLManager/gameState";
import { Player, players as initialPlayers, generatePlayersForTeam } from "~/data/AFLManager/players";
import { teams } from "~/data/AFLManager/teams";

export const meta: MetaFunction = () => generateMetaTags({
  title: "AFL Manager | Coach Simulation Game",
  description: "Simulate being an AFL head coach - manage your team, set tactics, and lead your club to premiership glory!",
});

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // In a real app, you would fetch this data from a database
  // For now, we'll use in-memory data
  return json({
    gameInitialized: false
  });
};

export default function Index() {
  // In a real app, this would be stored in a database or localStorage
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [allPlayers, setAllPlayers] = useState<Player[]>(initialPlayers);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Handle game initialization
  const handleGameStart = (newGameState: GameState) => {
    setGameState({
      ...newGameState,
      initialized: true
    });
    
    // Generate additional players for all teams if needed
    const generatedPlayers = [...initialPlayers];
    
    teams.forEach(team => {
      // Skip if we already have enough players for this team
      const existingPlayers = initialPlayers.filter(p => p.teamId === team.id);
      if (existingPlayers.length < 22) {
        const additionalPlayers = generatePlayersForTeam(
          team.id, 
          22 - existingPlayers.length
        );
        generatedPlayers.push(...additionalPlayers);
      }
    });
    
    setAllPlayers(generatedPlayers);
  };

  return (
    <Container size="2">
      <Card size={{ initial: '2', sm: '5' }}>
        <Header />
        
        <Box mt="4">
          <Heading size="8" align="center">AFL Manager</Heading>
          <Text size="2" color="gray" align="center" mb="4">
            Simulate being an AFL head coach - lead your team to premiership glory!
          </Text>
        </Box>

        <Separator size="4" my="4" />

        {!gameState.initialized ? (
          <GameInitialization onGameStart={handleGameStart} />
        ) : (
          <Tabs.Root defaultValue="dashboard" onValueChange={setActiveTab}>
            <Tabs.List>
              <Tabs.Trigger value="dashboard">Dashboard</Tabs.Trigger>
              <Tabs.Trigger value="team">Team</Tabs.Trigger>
              <Tabs.Trigger value="match">Match Center</Tabs.Trigger>
              <Tabs.Trigger value="league">League</Tabs.Trigger>
              <Tabs.Trigger value="players">Players</Tabs.Trigger>
              <Tabs.Trigger value="club">Club</Tabs.Trigger>
            </Tabs.List>
            
            <Box pt="4">
              <Tabs.Content value="dashboard">
                <Dashboard gameState={gameState} allPlayers={allPlayers} />
              </Tabs.Content>
              
              <Tabs.Content value="team">
                <TeamManagement gameState={gameState} allPlayers={allPlayers} />
              </Tabs.Content>
              
              <Tabs.Content value="match">
                <Text>Match center content will go here</Text>
              </Tabs.Content>
              
              <Tabs.Content value="league">
                <Text>League information content will go here</Text>
              </Tabs.Content>
              
              <Tabs.Content value="players">
                <Text>Player management content will go here</Text>
              </Tabs.Content>
              
              <Tabs.Content value="club">
                <Text>Club management content will go here</Text>
              </Tabs.Content>
            </Box>
          </Tabs.Root>
        )}
      </Card>
    </Container>
  );
}
