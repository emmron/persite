import React from "react";
import { TwitterLogoIcon, LinkedInLogoIcon, InstagramLogoIcon, GitHubLogoIcon } from "@radix-ui/react-icons";
import type { PersiteSource } from "./persite_source_type";

/*
  README:
  - Fill persiteSource with your own content
  - Additionally, you need only to change:
     - public/avatar.jpg picture to your own
     - public/favicon.ico
  - There is no need to change anything else!
  - Give some love here: https://x.com/marcinzaremski
*/

const persiteSource: PersiteSource = {
  fullName: 'Jane Doe',
  slogan: 'Software Engineer & Creator',
  mainPageTitle: "Jane Doe | Software Engineer & Creator",
  mainPageDescription: "Full-stack developer, entrepreneur, and tech enthusiast.",
  useSimpleAnalytics: true,
  theme: {
    projectSectionFirst: false,
    shouldShowBlogSection: true,
    blogInsideMainCard: false,
    background: 'FlyingOrbes',
    radixConfig: {
      appearance: 'dark',
      accentColor: 'indigo',
      grayColor: 'slate',
      radius: 'full',
      scaling: '110%',
    }
  },
  seo: {
    author: 'Jane Doe',
    twitterUsername: 'janedoe',
    locale: 'en_US',
  },
  headerSection: {
    personalDescription: 'A full-stack developer with experience in both startup and enterprise environments. Passionate about building scalable solutions and creating innovative products.',
    personalSlogan: 'Building the future, one line of code at a time!',
    typeAnimationSequence: [
      "\ developer",
      "n innovator",
      "\ creator",
      "n entrepreneur",
      "\ builder",
      "\ coder",
    ]
  },
  accordionSection: {
    title: 'Work with me as',
    items: [
      {title: 'Freelancer', content: FreelancerAccordionContent},
      {title: 'Contractor', content: ContractorAccordionContent},
      {title: 'Full time hire', content: FullTimeHireAccordionContent},
      {title: 'Co-founder', content: IndieHackerAccordionContent},
    ]
  },
  projectsSection: {
    title: 'Projects',
    items: [
      {
        title: 'ProjectAlpha',
        status: 'in_progress',
        badge: 'Q2 2024',
        badgeColor: 'gray',
        link: 'https://mzaremski.com/persite',
      },
      {
        title: 'BetaApp',
        status: 'in_progress',
        badgeColor: 'gray',
        badge: 'Q1 2024',
        link: '/boilerplate',
      },
      {
        title: 'GammaTools',
        status: 'released',
        badgeColor: 'gray',
        badge: 'Q2 2024',
        link: '/boilerplate',
      },
      {
        title: 'DeltaService',
        status: 'released',
        badgeColor: 'green',
        badge: '500$/m',
        link: 'https://mzaremski.com/persite',
      },
      {
        title: 'EpsilonLib',
        status: 'released',
        badgeColor: 'indigo',
        badge: '2023 | Free',
        link: 'https://mzaremski.com/persite',
      },
    ]
  },
  socialSection: [
    {icon: () => <LinkedInLogoIcon />, ariaLabel: 'LinkedIn', link: 'https://www.linkedin.com/in/marcin-zaremski-8b3b4714b/'},
    {icon: () => <TwitterLogoIcon />, ariaLabel: 'Twitter/x.com', link: 'https://x.com/marcinzaremski'},
    {icon: () => <InstagramLogoIcon />, ariaLabel: 'Instagram', link: 'https://instagram.com/mrrrcin'},
    {icon: () => <GitHubLogoIcon />, ariaLabel: 'GitHub', link: 'https://github.com/mzaremski'},
  ]
}

export default persiteSource;

function FreelancerAccordionContent() {
  return (
    <div>
      Does your project need:
      <ul>
        <li>Technical expertise?</li>
        <li>Additional development support?</li>
        <li>Feature implementation?</li>
      </ul>

      In technologies such as:
      <ul>
        <li>Typescript/Javascript</li>
        <li>React/NextJS</li>
        <li>NodeJS</li>
        <li>SQL</li>
        <li>Cloud Services</li>
      </ul>

      Contact me: <a href="mailto:jane@example.com">jane@example.com</a><br/>
      Please include your project details and requirements. I will respond promptly.
    </div>
  )
}

function ContractorAccordionContent () {
  return (
    <div>
      <ul>
        <li>Need help with your startup idea?</li>
        <li>Looking to build an MVP?</li>
        <li>Want to create a custom solution?</li>
        <li>Have a technical challenge to solve?</li>
      </ul>
      Contact me: <a href="mailto:Jane@example.com">jane@example.com</a><br />
      Include your project overview and timeline expectations.
    </div>
  )
}

function IndieHackerAccordionContent () {
  return (
    <div>
      <div className="AccordionContentText">
        Interested in building something together? Let's collaborate on innovative projects!
        Contact me here: <a href="mailto:jane@example.com">jane@example.com</a>
      </div>
    </div>
  )
}

function FullTimeHireAccordionContent () {
  return (
    <div>
      <div className="AccordionContentText">
        View my professional experience: (Imagine there is a link to PDF)
      </div>
    </div>
  )
}
