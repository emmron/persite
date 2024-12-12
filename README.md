# 🧑‍🚀 Persite (one-click website & blog)

<img width="1052" alt="image" src="./public/persite-vercel-thumbnail.png">

🛠️ Built with modern tech stack:
- Server-side rendering
- SEO optimized
- Markdown blog
- Simple Analytics

🚀 Easy to deploy:
- Deploy with one click
- Fill one file with your content

🎨 Highly customizable:
- 4 animated backgrounds
- Dark/Light mode
- Colors
- Border radius
- Scaling

You are the owner of the code. Have fun makin whatever change you want!
Also, you are welcome to contribute to the project.

## One click deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/mzaremski/persite)<br/>
Live Example: https://persite.vercel.app/

## Tech stack
- Framework: [Remix](https://remix.run/docs)
- UI: [Radix Themes](https://www.radix-ui.com/themes)
- Deployment: [Vercel](https://vercel.com)
- Blog: [MDX](https://mdxjs.com/)
- REACT
- TypeScript
- Simpleanalytics [simpleanalytics](https://simpleanalytics.com/)

## Getting Started
1. Click "Deploy" at the top of the file.
2. Clone the repository that was created by Vercel.
3. Fill SITE_URL environmental variable with your domain url
4. Clone the repository on your local machine
5. Install: `pnpm install` or `yarn install` or `npm install`
6. Open `PERSITE_SOURCE.tsx` and change the values to your own.
   - Preview the file: [PERSITE_SOURCE.tsx](https://github.com/mzaremski/persite/blob/main/PERSITE_SOURCE.tsx)
   - To customize theme, you can check this: [Radix playground](https://www.radix-ui.com/themes/playground) then edit `persiteSource.theme.radixConfig`
7. Start the development server: `pnpm run dev` or `yarn run dev` or `npm run dev` and see the changes
8. Commit and push to the repository. Vercel will deploy the changes immediately.
9. Create an account on https://simpleanalytics.com/ and add your site URL. The script is already installed on the website.

## Usage
- To add a new blog post: Copy one of the mdx file in `app/routes`. Make sure the blog post file follow this convention:`posts.[url-slug].mdx`. Eg. `posts.my-new-blog-post.mdx`
- To add a new page: Create a new file in the `app/routes` directory. The name of the file will be the url slug. Eg. `my-new-page.tsx`
- Check Remix.run docs for more: [Remix.run docs](https://remix.run/docs/en/main)

## Pro
**✨Check the PRO plan of Persite Boilerplate✨**: [Get Persite PRO](https://mzaremski.com/persite)
   - 🚀 Bundle of checklists and tips: Converting Landingpage, pricing tips, launch platforms database and more
   - Email collecting form + database (on vercel)
   - Product Hunt (and more) badges to your projects
   - Dynamic OG images for blog posts
   - CTA buttons
   - Backlink to your website 
   - More styling options

## Useful links
1. Remix-MDX plugin integration: [Remix.run: Add MDX plugion](https://remix.run/docs/en/main/guides/vite#add-mdx-plugin)
2. Persite Landingpage: [Persite](https://mzaremski.com/persite)
4. Persite public repository: [Repo](https://github.com/mzaremski/persite)


## Author
by Marcin Zaremski<br/>
GitHub: https://github.com/mzaremski<br/>
Website: https://mzaremski.com/<br/>
X (formerly Twitter): https://x.com/marcinzaremski<br/>

<img width="1052" alt="image" src="./persite-intro.gif">
