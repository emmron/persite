import { Heading, Text, Box, Flex, Separator, Button, Badge, IconButton } from "@radix-ui/themes";
import { useState, useEffect, useCallback, useRef } from "react";
import { generateMetaTags } from "~/utils/generateMetaTags";
import GameInitialization from "~/components/AFLManager/GameInitialization";
import Dashboard from "~/components/AFLManager/Dashboard";
import TeamManagement from "~/components/AFLManager/TeamManagement";
import MatchCenter from "~/components/AFLManager/MatchCenter";
import League from "~/components/AFLManager/League";
import Players from "~/components/AFLManager/Players";
import Club from "~/components/AFLManager/Club";
import SimulationCalendar from "~/components/AFLManager/SimulationCalendar";
import Training from "~/components/AFLManager/Training";
import PressConference from "~/components/AFLManager/PressConference";
import Resignation from "~/components/AFLManager/Resignation";
import { 
  GameState, 
  initialGameState, 
  advanceGameDay, 
  TrainingFocus, 
  scheduleTraining,
  completePresser
} from "~/data/AFLManager/gameState";
import { Player, players as initialPlayers, generatePlayersForTeam } from "~/data/AFLManager/players";
import { teams } from "~/data/AFLManager/teams";

export const meta = generateMetaTags({
  title: "AFL Manager | Coach Simulation Game",
  description: "Simulate being an AFL head coach - manage your team, set tactics, and lead your club to premiership glory!",
});

// Simple type for the navigation item props
type NavItemProps = {
  label: string;
  active: boolean;
  onClick: () => void;
};

// Navigation Item Component
function NavItem({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <Box 
      onClick={onClick}
      style={{ 
        padding: '10px 16px',
        backgroundColor: active ? '#3b82f6' : 'transparent',
        color: active ? 'white' : '#aaa',
        cursor: 'pointer',
        borderLeft: active ? '4px solid #60a5fa' : '4px solid transparent',
        transition: 'all 0.2s ease'
      }}
    >
      <Text weight={active ? "bold" : "regular"}>{label}</Text>
    </Box>
  );
}

export default function AFLManager() {
  // In a real app, this would be stored in a database or localStorage
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [allPlayers, setAllPlayers] = useState<Player[]>(initialPlayers);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showTraining, setShowTraining] = useState(false);
  const [showPressConference, setShowPressConference] = useState(false);
  const [showResignation, setShowResignation] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedPresserId, setSelectedPresserId] = useState<string | null>(null);

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

  // Handle advance day
  const handleAdvanceDay = useCallback(() => {
    const newGameState = advanceGameDay(gameState);
    setGameState(newGameState);
  }, [gameState]);
  
  // Handle schedule training
  const handleScheduleTraining = useCallback((date: string) => {
    setSelectedDate(date);
    setShowTraining(true);
  }, []);
  
  // Handle complete training setup
  const handleCompleteTrainingSetup = useCallback((
    date: string, 
    focus: TrainingFocus, 
    intensity: "light" | "medium" | "intense",
    playerIds: string[]
  ) => {
    const newGameState = scheduleTraining(gameState, date, focus, intensity, playerIds);
    setGameState(newGameState);
    setShowTraining(false);
  }, [gameState]);
  
  // Handle view press conference
  const handleViewPressConference = useCallback((presserId: string) => {
    setSelectedPresserId(presserId);
    setShowPressConference(true);
  }, []);
  
  // Handle complete press conference
  const handleCompletePressConference = useCallback((presserId: string, answers: string[]) => {
    const newGameState = completePresser(gameState, presserId, answers);
    setGameState(newGameState);
    setShowPressConference(false);
  }, [gameState]);
  
  // Handle cancel modal
  const handleCancelModal = useCallback(() => {
    setShowTraining(false);
    setShowPressConference(false);
    setShowResignation(false);
  }, []);
  
  // Handle show resignation
  const handleShowResignation = useCallback(() => {
    setShowResignation(true);
  }, []);
  
  // Handle confirm resignation
  const handleConfirmResignation = useCallback((reason: string) => {
    // In a real implementation, this would save the resignation reason and transition to a new game state
    // For now, we'll just reset to the initialization screen
    setGameState(initialGameState);
    setShowResignation(false);
  }, []);
  
  // Render the active section content
  const renderContent = () => {
    if (!gameState.initialized) {
      return <GameInitialization onGameStart={handleGameStart} />;
    }
    
    // If a modal is shown, render it on top of the content
    if (showTraining && selectedDate) {
      return (
        <Training 
          gameState={gameState}
          allPlayers={allPlayers}
          selectedDate={selectedDate}
          onScheduleTraining={handleCompleteTrainingSetup}
          onCancel={handleCancelModal}
        />
      );
    }
    
    if (showPressConference && selectedPresserId) {
      return (
        <PressConference 
          gameState={gameState}
          presserId={selectedPresserId}
          onComplete={handleCompletePressConference}
          onCancel={handleCancelModal}
        />
      );
    }
    
    if (showResignation) {
      return (
        <Resignation 
          gameState={gameState}
          onConfirmResign={handleConfirmResignation}
          onCancel={handleCancelModal}
        />
      );
    }

    switch (activeSection) {
      case "dashboard":
        return <Dashboard gameState={gameState} allPlayers={allPlayers} />;
      case "team":
        return <TeamManagement gameState={gameState} allPlayers={allPlayers} />;
      case "match":
        return <MatchCenter gameState={gameState} allPlayers={allPlayers} />;
      case "league":
        return <League gameState={gameState} allPlayers={allPlayers} />;
      case "players":
        return <Players gameState={gameState} allPlayers={allPlayers} />;
      case "club":
        return <Club gameState={gameState} allPlayers={allPlayers} />;
      case "calendar":
        return (
          <SimulationCalendar 
            gameState={gameState}
            allPlayers={allPlayers}
            onAdvanceDay={handleAdvanceDay}
            onScheduleTraining={handleScheduleTraining}
            onViewPressConference={handleViewPressConference}
            onResign={handleShowResignation}
          />
        );
      default:
        return <Dashboard gameState={gameState} allPlayers={allPlayers} />;
    }
  };

  // Get the team name for the header
  const userTeam = teams.find(team => team.id === gameState.userTeamId);
  const teamName = userTeam?.name || "AFL Manager";

  // Add effect to add fullscreen class to body
  useEffect(() => {
    // Add fullscreen class to body
    document.body.classList.add('afl-manager-fullscreen');
    
    // Remove class when component unmounts
    return () => {
      document.body.classList.remove('afl-manager-fullscreen');
    };
  }, []);

  return (
    <Box 
      className="afl-manager-container"
      style={{ 
        height: '100vh', 
        width: '100vw', 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* Top Bar */}
      <Flex 
        justify="between" 
        align="center" 
        px="4" 
        py="2" 
        style={{ 
          backgroundColor: '#0f0f0f', 
          borderBottom: '1px solid #333',
          height: '60px'
        }}
      >
        <Flex align="center" gap="3">
          <Heading size="5" style={{ color: '#fff' }}>
            {gameState.initialized ? teamName : "AFL Manager"}
          </Heading>
          {gameState.initialized && (
            <Text size="2" style={{ color: '#aaa' }}>
              Round {gameState.currentRound}
            </Text>
          )}
        </Flex>
        
        {gameState.initialized && (
          <Flex gap="4" align="center">
            <Box style={{ textAlign: 'center' }}>
              <Text size="1" style={{ color: '#aaa' }}>Ladder Position</Text>
              <Text size="3" weight="bold">
                {gameState.ladder
                  .sort((a, b) => {
                    if (b.points !== a.points) return b.points - a.points;
                    return b.percentage - a.percentage;
                  })
                  .findIndex(pos => pos.teamId === gameState.userTeamId) + 1}
              </Text>
            </Box>
            
            <Box style={{ textAlign: 'center' }}>
              <Text size="1" style={{ color: '#aaa' }}>Record</Text>
              <Text size="3" weight="bold">
                {(gameState.ladder.find(pos => pos.teamId === gameState.userTeamId)?.wins || 0)} - 
                {(gameState.ladder.find(pos => pos.teamId === gameState.userTeamId)?.losses || 0)}
              </Text>
            </Box>
            
            <Button 
              variant="outline" 
              size="1"
              onClick={handleAdvanceDay}
              style={{ 
                transition: "all 0.2s ease",
                position: "relative",
                overflow: "hidden"
              }}
              onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) => {
                const button = e.currentTarget;
                button.style.transform = "scale(0.95)";
                
                // Create ripple effect
                const ripple = document.createElement("span");
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height) * 2;
                
                ripple.style.width = ripple.style.height = `${size}px`;
                ripple.style.left = `${e.clientX - rect.left - size/2}px`;
                ripple.style.top = `${e.clientY - rect.top - size/2}px`;
                ripple.style.position = "absolute";
                ripple.style.borderRadius = "50%";
                ripple.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
                ripple.style.transform = "scale(0)";
                ripple.style.animation = "ripple 0.6s linear";
                
                button.appendChild(ripple);
                
                setTimeout(() => {
                  ripple.remove();
                  button.style.transform = "";
                }, 600);
              }}
            >
              Continue
            </Button>
          </Flex>
        )}
      </Flex>
      
      {/* Main Content Area */}
      <Flex style={{ flex: 1, overflow: 'hidden' }}>
        {/* Sidebar Navigation */}
        {gameState.initialized && (
          <Box 
            style={{ 
              width: '200px', 
              backgroundColor: '#222', 
              borderRight: '1px solid #333',
              padding: '16px 0',
              overflowY: 'auto'
            }}
          >
            <Flex direction="column" gap="1">
              <NavItem 
                label="Dashboard" 
                active={activeSection === "dashboard"} 
                onClick={() => setActiveSection("dashboard")} 
              />
              <NavItem 
                label="Team" 
                active={activeSection === "team"} 
                onClick={() => setActiveSection("team")} 
              />
              <NavItem 
                label="Match Center" 
                active={activeSection === "match"} 
                onClick={() => setActiveSection("match")} 
              />
              <NavItem 
                label="League" 
                active={activeSection === "league"} 
                onClick={() => setActiveSection("league")} 
              />
              <NavItem 
                label="Players" 
                active={activeSection === "players"} 
                onClick={() => setActiveSection("players")} 
              />
              <NavItem 
                label="Club" 
                active={activeSection === "club"} 
                onClick={() => setActiveSection("club")} 
              />
              <NavItem 
                label="Calendar" 
                active={activeSection === "calendar"} 
                onClick={() => setActiveSection("calendar")} 
              />
            </Flex>
          </Box>
        )}
        
        {/* Content Area */}
        <Box 
          style={{ 
            flex: 1, 
            padding: gameState.initialized ? '20px' : '0',
            overflowY: 'auto',
            backgroundColor: '#2a2a2a'
          }}
        >
          {renderContent()}
        </Box>
      </Flex>
    </Box>
  );
}
