import { Box, Heading, Text, Grid, Button, Card, Flex, Separator } from "@radix-ui/themes";
import { useState } from "react";
import { GameState, Match, TrainingSession, PressConference } from "~/data/AFLManager/gameState";
import { Player } from "~/data/AFLManager/players";
import { teams } from "~/data/AFLManager/teams";

// Helper function to format date
const formatDateDisplay = (date: string) => {
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
};

// Helper function to get weekday name
const getWeekdayName = (date: string) => {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString('en-AU', { weekday: 'long' });
};

type SimulationCalendarProps = {
  gameState: GameState;
  allPlayers: Player[];
  onAdvanceDay: () => void;
  onScheduleTraining: (date: string) => void;
  onViewPressConference: (presserId: string) => void;
  onResign: () => void;
};

export default function SimulationCalendar({
  gameState,
  allPlayers,
  onAdvanceDay,
  onScheduleTraining,
  onViewPressConference,
  onResign
}: SimulationCalendarProps) {
  const [selectedWeek, setSelectedWeek] = useState(0); // 0 = current week
  
  // Generate calendar days for the selected week
  const generateWeekDays = () => {
    // Start from the current day in the game
    const startDate = new Date(gameState.currentDate);
    
    // Adjust for selected week (future weeks)
    startDate.setDate(startDate.getDate() + (selectedWeek * 7));
    
    // Generate 7 days starting from the adjusted start date
    const weekDays = [];
    
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      const dateString = currentDate.toISOString().split('T')[0];
      
      // Determine if this day has a match
      const hasMatch = gameState.seasonFixtures.some(
        (fixture: Match) => fixture.date === dateString && 
        (fixture.homeTeamId === gameState.userTeamId || 
         fixture.awayTeamId === gameState.userTeamId)
      );
      
      // Determine if this day has training
      const hasTraining = gameState.trainingSessions && 
        gameState.trainingSessions.some((session: TrainingSession) => session.date === dateString);
      
      // Determine if this day has press conference
      const pressEvents = gameState.pressConferences?.filter(
        (presser: PressConference) => presser.date === dateString && !presser.completed
      ) || [];
      
      // Check if day is in the past
      const isPastDay = new Date(dateString) < new Date(gameState.currentDate);
      
      // Check if the day is today
      const isToday = dateString === gameState.currentDate;
      
      // Get fixture details if there is a match this day
      const todayFixture = gameState.seasonFixtures.find(
        (fixture: Match) => fixture.date === dateString && 
        (fixture.homeTeamId === gameState.userTeamId || 
         fixture.awayTeamId === gameState.userTeamId)
      );
      
      const opponentId = todayFixture ? 
        (todayFixture.homeTeamId === gameState.userTeamId ? 
          todayFixture.awayTeamId : todayFixture.homeTeamId) : 
        null;
      
      const opponent = opponentId ? 
        teams.find(team => team.id === opponentId)?.name : 
        null;
      
      const isHome = todayFixture?.homeTeamId === gameState.userTeamId;
      
      // Get training details if there is training this day
      const trainingSession = gameState.trainingSessions?.find(
        (session: TrainingSession) => session.date === dateString
      );
      
      weekDays.push({
        date: dateString,
        dayName: getWeekdayName(dateString),
        isToday,
        isPast: isPastDay,
        hasMatch,
        hasTraining,
        pressEvents,
        opponent,
        isHome,
        trainingSession
      });
    }
    
    return weekDays;
  };
  
  const weekDays = generateWeekDays();
  const userTeam = teams.find(team => team.id === gameState.userTeamId);
  
  return (
    <Box>
      <Flex justify="between" align="center" mb="4">
        <Heading size="6">Season Calendar</Heading>
        <Flex gap="2">
          <Button 
            variant="outline" 
            onClick={() => setSelectedWeek(Math.max(0, selectedWeek - 1))} 
            disabled={selectedWeek === 0}
          >
            Previous Week
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setSelectedWeek(selectedWeek + 1)}
          >
            Next Week
          </Button>
          <Button 
            color="red" 
            variant="outline" 
            onClick={onResign}
          >
            Resign from {userTeam?.name || "Team"}
          </Button>
        </Flex>
      </Flex>
      
      <Grid columns="7" gap="3" mb="4">
        {weekDays.map((day) => (
          <Card 
            key={day.date} 
            style={{ 
              opacity: day.isPast ? 0.5 : 1,
              backgroundColor: day.isToday ? '#2f4f4f' : '#1a1a1a',
              border: day.isToday ? '2px solid #4caf50' : '1px solid #333',
              height: '180px'
            }}
          >
            <Flex direction="column" gap="1" height="100%">
              <Flex justify="between" align="center">
                <Text weight="bold">{day.dayName}</Text>
                <Text size="1">{formatDateDisplay(day.date)}</Text>
              </Flex>
              
              <Separator size="4" mb="1" />
              
              <Box style={{ flex: 1 }}>
                {day.hasMatch && (
                  <Flex direction="column" gap="1" mb="2">
                    <Text size="2" color="crimson" weight="bold">Match Day</Text>
                    <Text size="1">
                      vs {day.opponent}
                      {day.isHome ? ' (Home)' : ' (Away)'}
                    </Text>
                  </Flex>
                )}
                
                {day.hasTraining && day.trainingSession && (
                  <Flex direction="column" gap="1" mb="2">
                    <Text size="2" color="orange" weight="bold">Training</Text>
                    <Text size="1">
                      {day.trainingSession.focus} ({day.trainingSession.intensity})
                    </Text>
                  </Flex>
                )}
                
                {day.pressEvents.length > 0 && (
                  <Flex direction="column" gap="1" mb="2">
                    <Text size="2" color="blue" weight="bold">Press Conference</Text>
                    <Text size="1">{day.pressEvents.length} event(s)</Text>
                  </Flex>
                )}
              </Box>
              
              <Flex gap="1" justify="end" mt="auto">
                {!day.isPast && !day.hasMatch && (
                  <Button 
                    size="1" 
                    variant="outline"
                    onClick={() => onScheduleTraining(day.date)}
                    disabled={day.hasTraining}
                  >
                    {day.hasTraining ? 'Scheduled' : 'Training'}
                  </Button>
                )}
                
                {day.pressEvents.length > 0 && !day.isPast && (
                  <Button 
                    size="1" 
                    color="blue" 
                    onClick={() => onViewPressConference(day.pressEvents[0].id)}
                  >
                    Press
                  </Button>
                )}
                
                {day.isToday && (
                  <Button 
                    size="1" 
                    color="green" 
                    onClick={onAdvanceDay}
                  >
                    Next Day
                  </Button>
                )}
              </Flex>
            </Flex>
          </Card>
        ))}
      </Grid>
      
      <Box my="4">
        <Heading size="5" mb="2">Team Schedule Overview</Heading>
        <Card>
          <Flex direction="column" gap="3">
            <Text>
              Next Match: {
                gameState.seasonFixtures
                  .filter((fixture: Match) => 
                    new Date(fixture.date) >= new Date(gameState.currentDate) && 
                    (fixture.homeTeamId === gameState.userTeamId || 
                     fixture.awayTeamId === gameState.userTeamId)
                  )
                  .sort((a: Match, b: Match) => new Date(a.date).getTime() - new Date(b.date).getTime())[0]
                  ? `${formatDateDisplay(
                      gameState.seasonFixtures
                        .filter((fixture: Match) => 
                          new Date(fixture.date) >= new Date(gameState.currentDate) && 
                          (fixture.homeTeamId === gameState.userTeamId || 
                           fixture.awayTeamId === gameState.userTeamId)
                        )
                        .sort((a: Match, b: Match) => new Date(a.date).getTime() - new Date(b.date).getTime())[0].date
                    )} vs ${
                      teams.find(team => 
                        team.id === (
                          gameState.seasonFixtures
                            .filter((fixture: Match) => 
                              new Date(fixture.date) >= new Date(gameState.currentDate) && 
                              (fixture.homeTeamId === gameState.userTeamId || 
                               fixture.awayTeamId === gameState.userTeamId)
                            )
                            .sort((a: Match, b: Match) => new Date(a.date).getTime() - new Date(b.date).getTime())[0].homeTeamId === gameState.userTeamId
                          ? gameState.seasonFixtures
                            .filter((fixture: Match) => 
                              new Date(fixture.date) >= new Date(gameState.currentDate) && 
                              (fixture.homeTeamId === gameState.userTeamId || 
                               fixture.awayTeamId === gameState.userTeamId)
                            )
                            .sort((a: Match, b: Match) => new Date(a.date).getTime() - new Date(b.date).getTime())[0].awayTeamId
                          : gameState.seasonFixtures
                            .filter((fixture: Match) => 
                              new Date(fixture.date) >= new Date(gameState.currentDate) && 
                              (fixture.homeTeamId === gameState.userTeamId || 
                               fixture.awayTeamId === gameState.userTeamId)
                            )
                            .sort((a: Match, b: Match) => new Date(a.date).getTime() - new Date(b.date).getTime())[0].homeTeamId
                        )
                      )?.name
                    }`
                  : 'None scheduled'
              }
            </Text>
            
            <Text>
              Upcoming Training: {
                gameState.trainingSessions && gameState.trainingSessions
                  .filter((session: TrainingSession) => new Date(session.date) >= new Date(gameState.currentDate))
                  .sort((a: TrainingSession, b: TrainingSession) => new Date(a.date).getTime() - new Date(b.date).getTime())[0]
                  ? `${formatDateDisplay(
                      gameState.trainingSessions
                        .filter((session: TrainingSession) => new Date(session.date) >= new Date(gameState.currentDate))
                        .sort((a: TrainingSession, b: TrainingSession) => new Date(a.date).getTime() - new Date(b.date).getTime())[0].date
                    )} (${
                      gameState.trainingSessions
                        .filter((session: TrainingSession) => new Date(session.date) >= new Date(gameState.currentDate))
                        .sort((a: TrainingSession, b: TrainingSession) => new Date(a.date).getTime() - new Date(b.date).getTime())[0].focus
                    })`
                  : 'None scheduled'
              }
            </Text>
            
            <Text>
              Pending Press Conferences: {
                (gameState.pressConferences?.filter(
                  (presser: PressConference) => 
                    new Date(presser.date) >= new Date(gameState.currentDate) && 
                    !presser.completed
                ).length || 0)
              }
            </Text>
          </Flex>
        </Card>
      </Box>
    </Box>
  );
}
