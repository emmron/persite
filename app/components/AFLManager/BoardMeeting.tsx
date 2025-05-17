import { Box, Heading, Text, Button, Card, Flex, Separator, TextArea } from "@radix-ui/themes";
import { useState } from "react";
import { GameState } from "~/data/AFLManager/gameState";

type BoardMeetingOption = {
  id: string;
  text: string;
  effect?: {
    boardSupport?: number;
    fanSupport?: number;
    financialImpact?: number;
  };
};

type BoardMeetingProps = {
  gameState: GameState;
  meetingType: "performance" | "budget" | "strategy" | "crisis" | "general";
  onComplete: (meetingId: string, selectedOptionId: string) => void;
  onCancel: () => void;
};

export default function BoardMeeting({
  gameState,
  meetingType,
  onComplete,
  onCancel,
}: BoardMeetingProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const meetingId = `board_meeting_${Date.now()}`;
  
  // Generate meeting options based on type
  const getMeetingOptions = (): BoardMeetingOption[] => {
    switch (meetingType) {
      case "performance":
        return [
          {
            id: "perf_1",
            text: "We're working hard to improve our on-field performance. Our training methods are being refined and I believe results will follow.",
            effect: { boardSupport: 2, fanSupport: 1 }
          },
          {
            id: "perf_2",
            text: "We're in a rebuilding phase and need time. I've identified key areas to improve and have a plan to address them over the coming weeks.",
            effect: { boardSupport: 3, fanSupport: -1 }
          },
          {
            id: "perf_3",
            text: "I take full responsibility for our recent performances. I'll be making changes to the lineup and tactics immediately.",
            effect: { boardSupport: 0, fanSupport: 2 }
          }
        ];
      case "budget":
        return [
          {
            id: "budget_1",
            text: "We need additional investment in training facilities to compete with the top teams.",
            effect: { boardSupport: -1, financialImpact: -3, fanSupport: 1 }
          },
          {
            id: "budget_2",
            text: "I understand the financial constraints and will work within the current budget.",
            effect: { boardSupport: 4, financialImpact: 2, fanSupport: -1 }
          },
          {
            id: "budget_3",
            text: "I propose we focus our resources on youth development rather than expensive signings.",
            effect: { boardSupport: 2, financialImpact: 1, fanSupport: 0 }
          }
        ];
      case "strategy":
        return [
          {
            id: "strategy_1",
            text: "I believe we should focus on an aggressive attacking style to excite fans and win games.",
            effect: { boardSupport: 1, fanSupport: 3 }
          },
          {
            id: "strategy_2",
            text: "A balanced approach focusing on solid defense and tactical offense will bring consistent results.",
            effect: { boardSupport: 3, fanSupport: 0 }
          },
          {
            id: "strategy_3",
            text: "We should prioritize developing young talent and building for the future.",
            effect: { boardSupport: 2, fanSupport: 1, financialImpact: 2 }
          }
        ];
      case "crisis":
        return [
          {
            id: "crisis_1",
            text: "We need to address this issue head-on with transparency and accountability.",
            effect: { boardSupport: 3, fanSupport: 4, financialImpact: -1 }
          },
          {
            id: "crisis_2",
            text: "I suggest we downplay the situation and focus on upcoming matches instead.",
            effect: { boardSupport: -2, fanSupport: -3 }
          },
          {
            id: "crisis_3",
            text: "Let's implement immediate changes to our processes to ensure this doesn't happen again.",
            effect: { boardSupport: 4, fanSupport: 2, financialImpact: -2 }
          }
        ];
      case "general":
        return [
          {
            id: "general_1",
            text: "I'm confident in our direction and believe we're on track to achieve our season objectives.",
            effect: { boardSupport: 2, fanSupport: 1 }
          },
          {
            id: "general_2",
            text: "There are some challenges we're facing, but I have specific plans to address each one.",
            effect: { boardSupport: 3, fanSupport: 0 }
          },
          {
            id: "general_3",
            text: "I'd like to discuss some new ideas that could help improve our overall performance.",
            effect: { boardSupport: 1, fanSupport: 1, financialImpact: -1 }
          }
        ];
      default:
        return [];
    }
  };
  
  const meetingOptions = getMeetingOptions();
  
  // Get meeting topic
  const getMeetingTopic = (): string => {
    switch (meetingType) {
      case "performance":
        return "Team Performance Review";
      case "budget":
        return "Budget Discussion";
      case "strategy":
        return "Season Strategy Meeting";
      case "crisis":
        return "Crisis Management";
      case "general":
        return "General Board Meeting";
      default:
        return "Board Meeting";
    }
  };
  
  // Handle option selection
  const handleSelectOption = (optionId: string) => {
    setSelectedOption(optionId);
  };
  
  // Handle complete meeting
  const handleComplete = () => {
    if (selectedOption) {
      onComplete(meetingId, selectedOption);
    }
  };
  
  // Get board members based on game state
  const getBoardMembers = () => {
    // In a real implementation, this would come from the game state
    return [
      { name: "Richard Thompson", role: "Chairperson" },
      { name: "Sarah Reynolds", role: "Financial Director" },
      { name: "Michael Chen", role: "Operations Director" },
      { name: "Jennifer Walsh", role: "Commercial Director" }
    ];
  };
  
  const boardMembers = getBoardMembers();
  
  return (
    <Box>
      <Card style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Flex direction="column" gap="4">
          <Flex justify="between" align="baseline">
            <Heading size="5">{getMeetingTopic()}</Heading>
            <Text size="2" color="gray">Board Meeting</Text>
          </Flex>
          
          <Box>
            <Text size="3" mb="3">Board Members Present:</Text>
            <Flex direction="column" gap="2">
              {boardMembers.map((member, index) => (
                <Flex key={index} gap="2" align="center">
                  <Box style={{ 
                    width: '30px', 
                    height: '30px', 
                    borderRadius: '50%',
                    backgroundColor: '#2a4c6d',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px'
                  }}>
                    {member.name.charAt(0)}
                  </Box>
                  <Box>
                    <Text weight="bold">{member.name}</Text>
                    <Text size="1" color="gray">{member.role}</Text>
                  </Box>
                </Flex>
              ))}
            </Flex>
          </Box>
          
          <Separator size="4" />
          
          <Box>
            <Text size="3" mb="2">
              {meetingType === "performance" ? 
                "The board wants to discuss recent team performances." :
               meetingType === "budget" ?
                "The board needs to review the club's budget and financial outlook." :
               meetingType === "strategy" ?
                "The board is looking to align on the season's strategic objectives." :
               meetingType === "crisis" ?
                "The board has called an emergency meeting to address a pressing issue." :
                "The board has called a regular meeting to discuss club matters."
              }
            </Text>
            
            <Text weight="bold" mt="3" mb="2">Choose your response:</Text>
            
            <Flex direction="column" gap="2">
              {meetingOptions.map(option => (
                <Card 
                  key={option.id}
                  style={{ 
                    padding: '12px', 
                    cursor: 'pointer',
                    backgroundColor: selectedOption === option.id ? '#2a4c6d' : '#333',
                    border: selectedOption === option.id ? '1px solid #60a5fa' : '1px solid #444'
                  }}
                  onClick={() => handleSelectOption(option.id)}
                >
                  <Text>{option.text}</Text>
                  
                  {selectedOption === option.id && option.effect && (
                    <Flex gap="3" mt="2">
                      {option.effect.boardSupport !== undefined && (
                        <Text size="1" color={option.effect.boardSupport > 0 ? "green" : "red"}>
                          Board Support: {option.effect.boardSupport > 0 ? '+' : ''}{option.effect.boardSupport}
                        </Text>
                      )}
                      {option.effect.fanSupport !== undefined && (
                        <Text size="1" color={option.effect.fanSupport > 0 ? "green" : "red"}>
                          Fan Support: {option.effect.fanSupport > 0 ? '+' : ''}{option.effect.fanSupport}
                        </Text>
                      )}
                      {option.effect.financialImpact !== undefined && (
                        <Text size="1" color={option.effect.financialImpact > 0 ? "green" : "red"}>
                          Financial Impact: {option.effect.financialImpact > 0 ? '+' : ''}{option.effect.financialImpact}
                        </Text>
                      )}
                    </Flex>
                  )}
                </Card>
              ))}
            </Flex>
          </Box>
          
          <Flex gap="2" justify="end" mt="4">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button 
              onClick={handleComplete}
              disabled={!selectedOption}
            >
              Complete Meeting
            </Button>
          </Flex>
        </Flex>
      </Card>
    </Box>
  );
}
