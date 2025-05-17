import { Container, Card, Heading, Tabs, Text, Box, Separator } from "@radix-ui/themes";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import Header from "~/components/Header";
import { generateMetaTags } from "~/utils/generateMetaTags";
import NewsSection from "~/components/AFLForum/NewsSection";
import ForumThreads from "~/components/AFLForum/ForumThreads";
import SocialMediaSection from "~/components/SocialMediaSection";

// This would typically come from a database, but for this example we'll use in-memory data
let newsArticles = [
  {
    id: "1",
    title: "Eagles Soar to Victory in Season Opener",
    content: "The West Coast Eagles dominated their season opener with a stunning 45-point victory over the Fremantle Dockers.",
    date: "May 15, 2025",
    imageUrl: "https://placehold.co/600x400/1e40af/ffffff?text=Eagles+Soar+to+Victory"
  },
  {
    id: "2",
    title: "Brownlow Medal Predictions: Who's Leading the Pack?",
    content: "As we approach the midway point of the season, several players are emerging as frontrunners for the prestigious Brownlow Medal.",
    date: "May 14, 2025",
    imageUrl: "https://placehold.co/600x400/b91c1c/ffffff?text=Brownlow+Medal+Predictions"
  },
  {
    id: "3",
    title: "Injury Update: Star Forward Out for Six Weeks",
    content: "In a blow to their premiership hopes, the Richmond Tigers will be without their star forward for at least six weeks due to a hamstring injury.",
    date: "May 12, 2025",
    imageUrl: "https://placehold.co/600x400/047857/ffffff?text=Injury+Update"
  }
];

let forumThreads = [
  {
    id: "1",
    title: "Who will make the top 4 this year?",
    author: "Anonymous",
    date: "May 16, 2025",
    content: "With the season well underway, who do you think will finish in the top 4?",
    comments: [
      {
        id: "1-1",
        author: "Anonymous",
        date: "May 16, 2025",
        content: "Definitely the Swans, they're looking unstoppable this year!"
      },
      {
        id: "1-2",
        author: "Anonymous",
        date: "May 16, 2025",
        content: "I think Geelong, Sydney, Brisbane and Melbourne will make it."
      }
    ]
  },
  {
    id: "2",
    title: "Best AFL stadium to watch a game?",
    author: "Anonymous",
    date: "May 15, 2025",
    content: "I'm planning to travel around Australia to watch some games. Which stadiums offer the best experience?",
    comments: [
      {
        id: "2-1",
        author: "Anonymous",
        date: "May 15, 2025",
        content: "MCG without a doubt. Nothing beats the atmosphere of 100,000 fans!"
      }
    ]
  },
  {
    id: "3",
    title: "Underrated players this season",
    author: "Anonymous",
    date: "May 14, 2025",
    content: "Who do you think are the most underrated players this season that deserve more recognition?",
    comments: []
  }
];

export const meta = generateMetaTags({
  title: "AFL Forum | Anonymous Discussion",
  description: "Discuss Australian Football League news, matches, and more - no login required!",
});

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // In a real app, you would fetch this data from a database
  return json({
    newsArticles,
    forumThreads
  });
};

export default function AFLForum() {
  const { newsArticles, forumThreads } = useLoaderData<typeof loader>();
  const [activeTab, setActiveTab] = useState("news");

  return (
    <Container size="2">
      <Card size={{ initial: '2', sm: '5' }}>
        <Header />
        
        <Box mt="4">
          <Heading size="8" align="center">AFL Forum</Heading>
          <Text size="2" color="gray" align="center" mb="4">
            Discuss Australian Football League - No login required!
          </Text>
        </Box>

        <Separator size="4" my="4" />

        <Tabs.Root defaultValue="news" onValueChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Trigger value="news">News</Tabs.Trigger>
            <Tabs.Trigger value="forum">Forum Discussions</Tabs.Trigger>
          </Tabs.List>
          
          <Box pt="4">
            <Tabs.Content value="news">
              <NewsSection articles={newsArticles} />
            </Tabs.Content>
            
            <Tabs.Content value="forum">
              <ForumThreads threads={forumThreads} />
            </Tabs.Content>
          </Box>
        </Tabs.Root>

        <Separator size="4" my="6" />
        <SocialMediaSection />
      </Card>
    </Container>
  );
}
