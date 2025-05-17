import { useState, FormEvent, ChangeEvent } from "react";
import { Card, Flex, Heading, Text, Box, Button, TextArea, Separator } from "@radix-ui/themes";

interface Comment {
  id: string;
  author: string;
  date: string;
  content: string;
}

interface Thread {
  id: string;
  title: string;
  author: string;
  date: string;
  content: string;
  comments: Comment[];
}

interface ForumThreadsProps {
  threads: Thread[];
}

export default function ForumThreads({ threads }: ForumThreadsProps) {
  const [expandedThread, setExpandedThread] = useState<string | null>(null);
  const [newThreadTitle, setNewThreadTitle] = useState("");
  const [newThreadContent, setNewThreadContent] = useState("");
  const [newComments, setNewComments] = useState<Record<string, string>>({});

  const toggleThread = (threadId: string) => {
    if (expandedThread === threadId) {
      setExpandedThread(null);
    } else {
      setExpandedThread(threadId);
    }
  };

  const handleNewComment = (threadId: string, comment: string) => {
    // In a real app, this would send the comment to a server
    // For this demo, we'll just clear the input
    setNewComments({
      ...newComments,
      [threadId]: ""
    });
    
    // Show a message that the comment was "submitted"
    alert("Comment submitted anonymously!");
  };

  const handleNewThread = () => {
    // In a real app, this would send the new thread to a server
    // For this demo, we'll just clear the inputs
    setNewThreadTitle("");
    setNewThreadContent("");
    
    // Show a message that the thread was "created"
    alert("Thread created anonymously!");
  };

  return (
    <Box>
      <Heading size="6" mb="4">Forum Discussions</Heading>
      
      {/* New Thread Form */}
      <Card variant="surface" mb="4">
        <Heading size="4" mb="2">Start a New Discussion</Heading>
        <form onSubmit={(e: FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          handleNewThread();
        }}>
          <Flex direction="column" gap="2">
            <TextArea 
              placeholder="Thread title" 
              value={newThreadTitle}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNewThreadTitle(e.target.value)}
              required
            />
            <TextArea 
              placeholder="What's on your mind about AFL?" 
              value={newThreadContent}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNewThreadContent(e.target.value)}
              required
            />
            <Button type="submit" mt="2">Post Anonymously</Button>
          </Flex>
        </form>
      </Card>
      
      {/* Thread List */}
      <Flex direction="column" gap="4">
        {threads.map((thread) => (
          <Card key={thread.id} variant="surface">
            <Box onClick={() => toggleThread(thread.id)} style={{ cursor: 'pointer' }}>
              <Heading size="4">{thread.title}</Heading>
              <Flex justify="between" align="center">
                <Text size="2" color="gray">Posted by {thread.author} on {thread.date}</Text>
                <Text size="2" color="gray">{thread.comments.length} comments</Text>
              </Flex>
              <Text mt="2">{thread.content}</Text>
            </Box>
            
            {expandedThread === thread.id && (
              <Box mt="4">
                <Separator size="4" my="3" />
                
                {/* Comments */}
                <Heading size="3" mb="2">Comments</Heading>
                {thread.comments.length > 0 ? (
                  <Flex direction="column" gap="3">
                    {thread.comments.map((comment) => (
                      <Card key={comment.id} variant="surface" size="1">
                        <Text size="2" color="gray" mb="1">
                          {comment.author} • {comment.date}
                        </Text>
                        <Text>{comment.content}</Text>
                      </Card>
                    ))}
                  </Flex>
                ) : (
                  <Text color="gray" size="2" mb="3">No comments yet. Be the first to comment!</Text>
                )}
                
                {/* New Comment Form */}
                <Box mt="3">
                  <form onSubmit={(e: FormEvent<HTMLFormElement>) => {
                    e.preventDefault();
                    handleNewComment(thread.id, newComments[thread.id] || "");
                  }}>
                    <Flex direction="column" gap="2">
                      <TextArea 
                        placeholder="Add your comment..." 
                        value={newComments[thread.id] || ""}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNewComments({
                          ...newComments,
                          [thread.id]: e.target.value
                        })}
                        required
                      />
                      <Button type="submit" size="2">Comment Anonymously</Button>
                    </Flex>
                  </form>
                </Box>
              </Box>
            )}
          </Card>
        ))}
      </Flex>
    </Box>
  );
}
