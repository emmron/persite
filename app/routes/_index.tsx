import type { MetaFunction } from "@vercel/remix";
import persiteSource from 'PERSITE_SOURCE';
import { Container, Section, Card} from "@radix-ui/themes";
import AccordionSection from "~/components/Sections/Accordion";
import Header from "~/components/Header";
import { generateMetaTags } from "~/utils/generateMetaTags";
import ProjectsSection from "~/components/Sections/ProjectsSection";
import BlogSection from "~/components/Sections/BlogSection";
import SocialMediaSection from "~/components/SocialMediaSection";

export const meta: MetaFunction = () => generateMetaTags({
  title: persiteSource.mainPageTitle,
  description: persiteSource.mainPageDescription,
});

export default function Index() {
  return (
    <>
      <Container size="2">
        <Card size={{initial: '2', sm:'5'}}>
            <Section size="1">
              <Header/>
              <p style={{ paddingTop: '1em' }}>
                {persiteSource.headerSection.personalDescription}
              </p>
              <p>
                {persiteSource.headerSection.personalSlogan}
              </p>
            </Section>

            {
              persiteSource.theme.projectSectionFirst
              ? (
                <>
                  <ProjectsSection/>
                  <AccordionSection/>
                </>
              )
              : (
                <>
                  <AccordionSection/>
                  <ProjectsSection/>
                </>
              )
            }

            {
              persiteSource.theme.shouldShowBlogSection && persiteSource.theme.blogInsideMainCard && (
                <BlogSection/>
              )
            }

            <SocialMediaSection />
          </Card>
      </Container>

      {
        persiteSource.theme.shouldShowBlogSection && !persiteSource.theme.blogInsideMainCard && (
          <Container size="2">
            <BlogSection/>
          </Container>
        )
      }
    </>
  );
}
