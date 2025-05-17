import { Box, Heading, Text, Button, Card, Flex, Separator, TextArea } from "@radix-ui/themes";
import { useState } from "react";
import { GameState } from "~/data/AFLManager/gameState";
import { Player } from "~/data/AFLManager/players";

type ConversationOption = {
  id: string;
  text: string;
  effect?: {
    morale?: number;
    fitness?: number;
    form?: number;
  };
};

type PlayerConversationProps = {
  gameState: GameState;
  player: Player;
  conversationType: "morale" | "fitness" | "role" | "contract" | "performance";
  onComplete: (playerId: string, selectedOptionId: string) => void;
  onCancel: () => void;
};

export default function PlayerConversation({
  gameState,
  player,
  conversationType,
  onComplete,
  onCancel,
}: PlayerConversationProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  // Generate conversation options based on type
  const getConversationOptions = (): ConversationOption[] => {
    switch (conversationType) {
      case "morale":
        return [
          {
            id: "morale_1",
            text: "You've been doing great work recently. Keep it up!",
            effect: { morale: 5 }
          },
          {
            id: "morale_2",
            text: "I've noticed you seem a bit down lately. Is everything okay?",
            effect: { morale: 3 }
          },
          {
            id: "morale_3",
            text: "I need you to focus more in training. Your attitude has been lacking.",
            effect: { morale: -2, fitness: 2 }
          }
        ];
      case "fitness":
        return [
          {
            id: "fitness_1",
            text: "I want you to focus on your recovery program. Take it easy this week.",
            effect: { fitness: 3, form: -1 }
          },
          {
            id: "fitness_2",
            text: "You need to put in extra time on your conditioning. Your fitness levels aren't where they need to be.",
            effect: { fitness: 4, morale: -1 }
          },
          {
            id: "fitness_3",
            text: "The medical team has put together a specialized program for you. I expect you to follow it diligently.",
            effect: { fitness: 5, form: 1 }
          }
        ];
      case "role":
        return [
          {
            id: "role_1",
            text: "I see you as a key player for our team this season.",
            effect: { morale: 4 }
          },
          {
            id: "role_2",
            text: "You'll need to earn your spot in the team by performing in training.",
            effect: { morale: -2, fitness: 2, form: 1 }
          },
          {
            id: "role_3",
            text: "I'm considering giving you more responsibilities on the field.",
            effect: { morale: 3, form: 2 }
          }
        ];
      case "contract":
        return [
          {
            id: "contract_1",
            text: "We're very happy with your contribution and will look at improving your contract soon.",
            effect: { morale: 5 }
          },
          {
            id: "contract_2",
            text: "Your current contract is fair based on your performances so far.",
            effect: { morale: -1 }
          },
          {
            id: "contract_3",
            text: "Perform well consistently and we'll discuss an improved contract at the end of the season.",
            effect: { morale: 2, form: 2 }
          }
        ];
      case "performance":
        return [
          {
            id: "performance_1",
            text: "Your recent performances have been excellent. The team really appreciates your efforts.",
            effect: { morale: 5, form: 2 }
          },
          {
            id: "performance_2",
            text: "I've noticed some areas of your game that need improvement. Let's focus on those in training.",
            effect: { morale: -1, form: 3, fitness: 1 }
          },
          {
            id: "performance_3",
            text: "You have the potential to be even better. I want to help you reach that next level.",
            effect: { morale: 3, form: 2 }
          }
        ];
      default:
        return [];
    }
  };
  
  const conversationOptions = getConversationOptions();
  
  // Get conversation topic
  const getConversationTopic = (): string => {
    switch (conversationType) {
      case "morale":
        return "Player Morale Discussion";
      case "fitness":
        return "Fitness and Conditioning";
      case "role":
        return "Team Role Discussion";
      case "contract":
        return "Contract Situation";
      case "performance":
        return "Performance Review";
      default:
        return "Player Meeting";
    }
  };
  
  // Handle option selection
  const handleSelectOption = (optionId: string) => {
    setSelectedOption(optionId);
  };
  
  // Handle complete conversation
  const handleComplete = () => {
    if (selectedOption) {
      onComplete(player.id, selectedOption);
    }
  };
  
  return (
    <Box>
      <Card style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Flex direction="column" gap="4">
          <Flex justify="between" align="baseline">
            <Heading size="5">{getConversationTopic()}</Heading>
            <Text size="2" color="gray">Meeting with {player.name}</Text>
          </Flex>
          
          <Box>
            <Flex gap="3" align="start">
              <Box style={{ 
                width: '60px', 
                height: '60px', 
                borderRadius: '50%',
                backgroundColor: '#2a4c6d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
              }}>
                👤
              </Box>
              
              <Box>
                <Text weight="bold">{player.name}</Text>
                <Text size="2">{player.position} | Age: {player.age}</Text>
                <Flex gap="3" mt="2">
                  <Box>
                    <Text size="1" color="gray">Form</Text>
                    <Text size="2" weight="bold">{player.form}</Text>
                  </Box>
                  <Box>
                    <Text size="1" color="gray">Fitness</Text>
                    <Text size="2" weight="bold">{player.fitness}</Text>
                  </Box>
                  <Box>
                    <Text size="1" color="gray">Morale</Text>
                    <Text size="2" weight="bold">{player.morale}</Text>
                  </Box>
                </Flex>
              </Box>
            </Flex>
          </Box>
          
          <Separator size="4" />
          
          <Box>
            <Text weight="bold" mb="2">Choose your approach:</Text>
            
            <Flex direction="column" gap="2">
              {conversationOptions.map(option => (
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
                      {option.effect.morale && (
                        <Text size="1" color={option.effect.morale > 0 ? "green" : "red"}>
                          Morale: {option.effect.morale > 0 ? '+' : ''}{option.effect.morale}
                        </Text>
                      )}
                      {option.effect.fitness && (
                        <Text size="1" color={option.effect.fitness > 0 ? "green" : "red"}>
                          Fitness: {option.effect.fitness > 0 ? '+' : ''}{option.effect.fitness}
                        </Text>
                      )}
                      {option.effect.form && (
                        <Text size="1" color={option.effect.form > 0 ? "green" : "red"}>
                          Form: {option.effect.form > 0 ? '+' : ''}{option.effect.form}
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
              Complete Conversation
            </Button>
          </Flex>
        </Flex>
      </Card>
    </Box>
  );
}
