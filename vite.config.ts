import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { defineConfig, loadEnv, type Plugin, type UserConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import mdx from "@mdx-js/rollup";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import path from "node:path";

// Apply Remix globals
installGlobals();

/**
 * Environment configuration interface for type safety
 */
interface EnvConfig {
  NODE_ENV: string;
  PORT?: string;
  [key: string]: string | undefined;
}

/**
 * MDX plugin configuration with proper types
 * This helps ensure type safety when configuring the MDX plugin
 */
interface MDXOptions {
  remarkPlugins: any[]; // Using any[] as we don't have direct access to the Pluggable type
  rehypePlugins?: any[];
  providerImportSource?: string;
}

/**
 * Configure MDX plugin with proper error handling
 * This function isolates MDX configuration and provides fallback in case of errors
 */
function configureMdx(): Plugin {
  try {
    return mdx({
      remarkPlugins: [
        remarkFrontmatter,
        remarkMdxFrontmatter,
      ],
      // You can add rehype plugins here if needed
      // rehypePlugins: [],
    } as MDXOptions);
  } catch (error) {
    console.error("Failed to configure MDX plugin:", error);
    // Return an empty plugin to prevent build failure
    return {
      name: "mdx-fallback",
      enforce: "pre"
    };
  }
}

/**
 * Validate required environment variables
 * @param env The loaded environment variables
 */
function validateEnv(env: EnvConfig): void {
  const requiredVars: string[] = [
    // Add your required env variables here
    // Example: 'DATABASE_URL', 'API_KEY'
  ];
  
  const missing = requiredVars.filter(key => !env[key]);
  
  if (missing.length > 0) {
    console.warn(`⚠️ Missing required environment variables: ${missing.join(', ')}`);
    console.warn('Please check your .env file');
  }
}

/**
 * Configure server options based on environment
 */
function configureServer(env: EnvConfig, isProd: boolean) {
  const port = parseInt(env.PORT || '3000', 10);
  
  return {
    port,
    // Properly type host configuration
    host: true,
    // Configure HMR with explicit options
    hmr: isProd ? false : {
      overlay: true,
    },
    // Add proper error overlay
    overlay: true,
    // Optimize watch settings to ignore unnecessary directories
    watch: {
      usePolling: false,
      ignored: ['**/node_modules/**', '**/dist/**'],
    },
  };
}

/**
 * Configure advanced chunk splitting for better performance
 */
function configureChunkSplitting(isProd: boolean) {
  if (!isProd) {
    // In development, use simpler chunking for faster builds
    return {
      manualChunks: {
        vendor: ['react', 'react-dom', '@remix-run/react'],
      },
    };
  }
  
  // In production, use more sophisticated chunking strategy
  return {
    manualChunks: (id: string) => {
      // React and Remix packages
      if (id.includes('node_modules/react') || 
          id.includes('node_modules/react-dom') || 
          id.includes('node_modules/@remix-run/react')) {
        return 'vendor-react';
      }
      
      // MDX related packages
      if (id.includes('node_modules/@mdx-js') ||
          id.includes('node_modules/remark') ||
          id.includes('node_modules/unified')) {
        return 'vendor-mdx';
      }
      
      // All other node_modules go in a separate chunk
      if (id.includes('node_modules')) {
        return 'vendor-other';
      }
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }): UserConfig => {
  // Load env variables based on mode with proper typing
  const env = loadEnv(mode, process.cwd(), '') as EnvConfig;
  const isProd = mode === 'production';
  
  // Validate environment variables
  validateEnv(env);
  
  // Root path for project references
  const rootPath = process.cwd();
  
  return {
    // Project root configuration
    root: rootPath,
    
    // Define global constants - useful for conditional code
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
      // Add other environment variables that should be accessible in client
      // Example: 'process.env.API_URL': JSON.stringify(env.API_URL),
    },
    
    // Configure plugins with logical order and error handling
    plugins: [
      // MDX configuration with error handling
      configureMdx(),
      
      // Handle Remix integration
      remix({
        // Ignore test files and hidden files in routes
        ignoredRouteFiles: ["**/.*", "**/*.test.{js,jsx,ts,tsx}"],
      }),
      
      // Enable TypeScript path aliases
      tsconfigPaths(),
    ],
    
    // Performance optimizations
    build: {
      // Output directory (explicit for clarity)
      outDir: path.resolve(rootPath, 'dist'),
      // Clean output directory before build
      emptyOutDir: true,
      // Target modern browsers in dev, slightly older browsers in production
      target: isProd ? 'es2019' : 'esnext',
      // Optimize chunk size for better loading performance
      chunkSizeWarningLimit: 1000,
      // Report accurate compressed size in production
      reportCompressedSize: isProd,
      // Configure Rollup output options
      rollupOptions: {
        output: configureChunkSplitting(isProd),
        // Enable tree-shaking in production
        treeshake: isProd,
      },
      // Minify the output for production builds
      minify: isProd ? 'esbuild' : false,
      // Generate sourcemaps for development only
      sourcemap: !isProd,
      // Enable CSS code splitting for better caching
      cssCodeSplit: true,
    },
    
    // Server configuration with improved options
    server: configureServer(env, isProd),
    
    // Preview server configuration for testing production builds
    preview: {
      port: parseInt(env.PORT || '3000', 10),
      host: true,
    },
    
    // Optimize dependency pre-bundling
    optimizeDeps: {
      // Include problematic or frequently used dependencies
      include: [
        '@remix-run/react',
        'react', 
        'react-dom',
      ],
      // Exclude any problematic dependency if needed
      // exclude: [],
      // Consistent build target with main build
      esbuildOptions: {
        target: 'es2019',
      },
    },
    
    // Enable persistent caching for faster builds
    cacheDir: path.resolve(rootPath, 'node_modules/.vite'),
  };
});
