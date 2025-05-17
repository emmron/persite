import { Box, Heading, Text, Button, Card, Flex, Separator, Badge, ScrollArea } from "@radix-ui/themes";
import { useState } from "react";
import { GameState, PressConference } from "~/data/AFLManager/gameState";

// Define inbox message types
export type InboxMessageType = 
  | "press_conference" 
  | "player_conversation" 
  | "board_message" 
  | "match_preview" 
  | "match_report"
  | "transfer_news"
  | "injury_news"
  | "general";

export interface InboxMessage {
  id: string;
  type: InboxMessageType;
  date: string;
  subject: string;
  content: string;
  from: string;
  read: boolean;
  actionId?: string; // Reference to a related entity like a press conference ID
  actionType?: string; // Type of action that can be taken
}

const getIconForMessageType = (type: InboxMessageType) => {
  switch (type) {
    case "press_conference":
      return "📰";
    case "player_conversation":
      return "👤";
    case "board_message":
      return "🏢";
    case "match_preview":
      return "🏉";
    case "match_report":
      return "📊";
    case "transfer_news":
      return "💰";
    case "injury_news":
      return "🚑";
    case "general":
      return "📬";
  }
};

const getColorForMessageType = (type: InboxMessageType) => {
  switch (type) {
    case "press_conference":
      return "blue";
    case "player_conversation":
      return "green";
    case "board_message":
      return "crimson";
    case "match_preview":
      return "orange";
    case "match_report":
      return "cyan";
    case "transfer_news":
      return "gold";
    case "injury_news":
      return "red";
    case "general":
      return "gray";
  }
};

type InboxProps = {
  gameState: GameState;
  messages: InboxMessage[];
  onViewMessage: (messageId: string) => void;
  onHandleAction: (messageId: string, actionId: string, actionType: string) => void;
  onClose: () => void;
};

export default function Inbox({
  gameState,
  messages,
  onViewMessage,
  onHandleAction,
  onClose,
}: InboxProps) {
  const [selectedMessage, setSelectedMessage] = useState<InboxMessage | null>(null);
  const [selectedTab, setSelectedTab] = useState<"all" | "unread" | "press" | "players" | "board">("all");
  
  // Filter messages based on selected tab
  const filteredMessages = messages.filter(message => {
    if (selectedTab === "all") return true;
    if (selectedTab === "unread") return !message.read;
    if (selectedTab === "press") return message.type === "press_conference";
    if (selectedTab === "players") return message.type === "player_conversation";
    if (selectedTab === "board") return message.type === "board_message";
    return true;
  });
  
  // Count unread messages
  const unreadCount = messages.filter(message => !message.read).length;
  
  // Handle selecting a message
  const handleSelectMessage = (message: InboxMessage) => {
    setSelectedMessage(message);
    
    // Mark the message as read if it's not already
    if (!message.read) {
      onViewMessage(message.id);
    }
  };
  
  // Handle action button click
  const handleAction = () => {
    if (selectedMessage && selectedMessage.actionId && selectedMessage.actionType) {
      onHandleAction(
        selectedMessage.id,
        selectedMessage.actionId,
        selectedMessage.actionType
      );
    }
  };
  
  // Format date for display
  const formatDateDisplay = (date: string) => {
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  };
  
  return (
    <Box>
      <Card style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Flex direction="column" height="600px">
          <Flex justify="between" align="center" mb="2">
            <Heading size="5">Inbox</Heading>
            <Button size="1" variant="outline" onClick={onClose}>
              Close
            </Button>
          </Flex>
          
          <Flex gap="2" mb="4">
            <Button 
              size="1" 
              variant={selectedTab === "all" ? "solid" : "outline"}
              onClick={() => setSelectedTab("all")}
            >
              All
            </Button>
            <Button 
              size="1" 
              variant={selectedTab === "unread" ? "solid" : "outline"}
              onClick={() => setSelectedTab("unread")}
            >
              Unread ({unreadCount})
            </Button>
            <Button 
              size="1" 
              variant={selectedTab === "press" ? "solid" : "outline"}
              onClick={() => setSelectedTab("press")}
            >
              Press
            </Button>
            <Button 
              size="1" 
              variant={selectedTab === "players" ? "solid" : "outline"}
              onClick={() => setSelectedTab("players")}
            >
              Players
            </Button>
            <Button 
              size="1" 
              variant={selectedTab === "board" ? "solid" : "outline"}
              onClick={() => setSelectedTab("board")}
            >
              Board
            </Button>
          </Flex>
          
          <Flex gap="4" style={{ flex: 1, overflow: 'hidden' }}>
            {/* Message List */}
            <Box style={{ width: '240px', overflow: 'hidden', borderRight: '1px solid #333' }}>
              <ScrollArea style={{ height: '500px' }} scrollbars="vertical">
                <Flex direction="column" gap="1">
                  {filteredMessages.length === 0 ? (
                    <Text size="2" color="gray" align="center" mt="4">
                      No messages
                    </Text>
                  ) : (
                    filteredMessages.map(message => (
                      <Card 
                        key={message.id}
                        style={{ 
                          padding: '8px 12px',
                          marginBottom: '4px',
                          cursor: 'pointer',
                          backgroundColor: selectedMessage?.id === message.id ? '#2a4c6d' : 
                                          message.read ? '#222' : '#1a2a3a',
                          borderLeft: `4px solid var(--${getColorForMessageType(message.type)}-9)`
                        }}
                        onClick={() => handleSelectMessage(message)}
                      >
                        <Flex direction="column" gap="1">
                          <Flex justify="between" align="start">
                            <Text 
                              size="2" 
                              weight={message.read ? "regular" : "bold"}
                              style={{ 
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxWidth: '150px'
                              }}
                            >
                              {message.subject}
                            </Text>
                            <Text size="1">
                              {getIconForMessageType(message.type)}
                            </Text>
                          </Flex>
                          <Flex justify="between" align="center">
                            <Text size="1" color="gray">
                              {message.from}
                            </Text>
                            <Text size="1" color="gray">
                              {formatDateDisplay(message.date)}
                            </Text>
                          </Flex>
                        </Flex>
                      </Card>
                    ))
                  )}
                </Flex>
              </ScrollArea>
            </Box>
            
            {/* Message Content */}
            <Box style={{ flex: 1, overflow: 'hidden' }}>
              {selectedMessage ? (
                <Flex direction="column" gap="3" height="100%">
                  <Box>
                    <Flex justify="between" align="start">
                      <Heading size="4">{selectedMessage.subject}</Heading>
                      <Badge color={getColorForMessageType(selectedMessage.type)}>
                        {selectedMessage.type.replace('_', ' ')}
                      </Badge>
                    </Flex>
                    <Flex gap="2" align="center" mt="1">
                      <Text size="2" color="gray">From: {selectedMessage.from}</Text>
                      <Text size="2" color="gray">Date: {formatDateDisplay(selectedMessage.date)}</Text>
                    </Flex>
                  </Box>
                  
                  <Separator size="4" />
                  
                  <Box style={{ flex: 1, overflow: 'auto' }}>
                    <Text style={{ whiteSpace: 'pre-line' }}>
                      {selectedMessage.content}
                    </Text>
                  </Box>
                  
                  {selectedMessage.actionId && selectedMessage.actionType && (
                    <Flex justify="end" mt="auto" pt="4">
                      <Button 
                        onClick={handleAction}
                        color={getColorForMessageType(selectedMessage.type)}
                      >
                        {selectedMessage.actionType === "press_conference" ? "Attend Press Conference" :
                         selectedMessage.actionType === "player_meeting" ? "Meet with Player" :
                         selectedMessage.actionType === "board_meeting" ? "Meet with Board" :
                         "Take Action"}
                      </Button>
                    </Flex>
                  )}
                </Flex>
              ) : (
                <Flex 
                  direction="column" 
                  align="center" 
                  justify="center" 
                  gap="3"
                  style={{ height: '100%' }}
                >
                  <Text size="5" color="gray">Select a message</Text>
                  <Text size="2" color="gray">Click on a message from the list to view it</Text>
                </Flex>
              )}
            </Box>
          </Flex>
        </Flex>
      </Card>
    </Box>
  );
}
