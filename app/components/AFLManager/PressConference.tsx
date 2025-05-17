import { Box, Heading, Text, Button, Card, Flex, Separator, RadioGroup } from "@radix-ui/themes";
import { useState } from "react";
import { GameState, PressConference as PressConferenceType } from "~/data/AFLManager/gameState";

type PressConferenceProps = {
  gameState: GameState;
  presserId: string;
  onComplete: (presserId: string, answers: string[]) => void;
  onCancel: () => void;
};

export default function PressConference({
  gameState,
  presserId,
  onComplete,
  onCancel,
}: PressConferenceProps) {
  // Find the press conference
  const presser = gameState.pressConferences.find(pc => pc.id === presserId);
  
  // Selected answers for each question
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>(
    presser ? presser.questions.map(q => q.options[0]) : []
  );
  
  if (!presser) {
    return (
      <Box>
        <Card style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Heading size="5">Press Conference Error</Heading>
          <Text>Could not find the requested press conference.</Text>
          <Button onClick={onCancel} mt="4">Return to Calendar</Button>
        </Card>
      </Box>
    );
  }
  
  // Handle answer selection
  const handleSelectAnswer = (questionIndex: number, answer: string) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[questionIndex] = answer;
    setSelectedAnswers(newAnswers);
  };
  
  // Handle press conference completion
  const handleComplete = () => {
    onComplete(presserId, selectedAnswers);
  };
  
  return (
    <Box>
      <Card style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Flex direction="column" gap="4">
          <Flex justify="between" align="baseline">
            <Heading size="5">Press Conference</Heading>
            <Text size="2" color="gray">{presser.date}</Text>
          </Flex>
          
          <Box>
            <Text weight="bold" size="4" mb="2">{presser.topic}</Text>
            <Text size="2" color="gray" mb="4">
              Answer the questions from the media carefully. Your responses will affect team morale,
              fan support, and board confidence.
            </Text>
          </Box>
          
          <Separator size="4" />
          
          {presser.questions.map((question, index) => (
            <Box key={index} mb="4">
              <Text weight="bold" mb="2">
                <Text color="blue" style={{ display: 'inline' }}>Reporter: </Text>
                {question.question}
              </Text>
              
              <RadioGroup.Root 
                value={selectedAnswers[index]} 
                onValueChange={(value: string) => handleSelectAnswer(index, value)}
              >
                <Flex direction="column" gap="2">
                  {question.options.map((option, optionIndex) => (
                    <RadioGroup.Item 
                      key={optionIndex} 
                      value={option}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '4px',
                        backgroundColor: selectedAnswers[index] === option ? '#2a4c6d' : 'transparent',
                        border: '1px solid #444',
                      }}
                    >
                      {option}
                    </RadioGroup.Item>
                  ))}
                </Flex>
              </RadioGroup.Root>
            </Box>
          ))}
          
          <Flex gap="2" justify="end" mt="4">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleComplete}>
              Complete Press Conference
            </Button>
          </Flex>
        </Flex>
      </Card>
    </Box>
  );
}
