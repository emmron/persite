import { Box } from "@radix-ui/themes";
import persiteSource from 'PERSITE_SOURCE'; 
import { Link } from "@remix-run/react";

export default function SocialMediaSection() {
  return (
    <Box width="100%" height="60px" style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${persiteSource.socialSection.length}, 1fr)`,
      gap: '0px',
      position: 'absolute',
      bottom: '0',
      left: '0',
      borderTop: '1px solid var(--gray-a6)',
    }}>
      {
        persiteSource.socialSection.map((item, index) => (
          <Box style={{ textAlign: 'center', borderRight: persiteSource.socialSection.length - 1 === index ? 'none' : '1px solid var(--gray-a6)' }} key={item.link}>
            <Link
              to={item.link}
              className="social-link"
              target="_blank"
              aria-label={item.ariaLabel}
              rel="noreferrer"
            >
              {item.icon()}
            </Link>
          </Box>
        ))
      }
    </Box>
  )
}
