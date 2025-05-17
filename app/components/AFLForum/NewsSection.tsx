import { Card, Flex, Heading, Text, Box, AspectRatio } from "@radix-ui/themes";

interface NewsArticle {
  id: string;
  title: string;
  content: string;
  date: string;
  imageUrl: string;
}

interface NewsSectionProps {
  articles: NewsArticle[];
}

export default function NewsSection({ articles }: NewsSectionProps) {
  return (
    <Box>
      <Heading size="6" mb="4">Latest AFL News</Heading>
      
      <Flex direction="column" gap="4">
        {articles.map((article) => (
          <Card key={article.id} variant="surface">
            <Flex gap="4" direction={{ initial: 'column', sm: 'row' }}>
              <Box style={{ minWidth: '200px', maxWidth: '300px' }}>
                <AspectRatio ratio={16/9}>
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      // Replace with a colored div with the article title
                      const colors = ['#1e40af', '#b91c1c', '#047857', '#7c2d12', '#581c87'];
                      const randomColor = colors[Math.floor(Math.random() * colors.length)];
                      target.style.display = 'none';
                      target.parentElement!.innerHTML = `
                        <div style="
                          width: 100%; 
                          height: 100%; 
                          background-color: ${randomColor}; 
                          display: flex; 
                          align-items: center; 
                          justify-content: center;
                          color: white;
                          padding: 1rem;
                          text-align: center;
                          font-weight: bold;
                        ">
                          ${article.title}
                        </div>
                      `;
                    }}
                  />
                </AspectRatio>
              </Box>
              
              <Box>
                <Heading size="4">{article.title}</Heading>
                <Text size="2" color="gray" mb="2">{article.date}</Text>
                <Text>{article.content}</Text>
              </Box>
            </Flex>
          </Card>
        ))}
      </Flex>
    </Box>
  );
}
