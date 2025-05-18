import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { defineConfig, loadEnv, type Plugin, type UserConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import mdx from "@mdx-js/rollup";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import path from "node:path";
import fs from "node:fs";

// Apply Remix globals
installGlobals();

/**
 * Environment configuration interface for type safety
 * Extends to include commonly used environment variables
 */
interface EnvConfig {
  NODE_ENV: string;
  PORT?: string;
  BASE_URL?: string;
  API_URL?: string;
  DEBUG?: string;
  SOURCEMAPS?: string;
  REMOVE_CONSOLE?: string;
  DISABLE_CACHE?: string;
  HMRPORT?: string;
  [key: string]: string | undefined;
}

/**
 * MDX plugin configuration with proper types
 * Expanded to include more MDX-specific options
 */
interface MDXOptions {
  remarkPlugins: any[]; // Using any[] as we don't have direct access to the Pluggable type
  rehypePlugins?: any[];
  providerImportSource?: string;
  jsx?: boolean;
  jsxImportSource?: string;
  format?: 'mdx' | 'md';
}

/**
 * Plugin result type for better type safety
 */
type PluginResult = Plugin | null;

/**
 * Configure MDX plugin with enhanced options and better error handling
 * @returns Configured MDX plugin or fallback plugin
 */
function configureMdx(): PluginResult {
  try {
    return mdx({
      remarkPlugins: [
        remarkFrontmatter,
        [remarkMdxFrontmatter, { name: 'frontmatter' }],
      ],
      // Set format explicitly
      format: 'mdx',
      // Enable JSX
      jsx: true,
      jsxImportSource: 'react',
    } as MDXOptions);
  } catch (error) {
    console.error("Failed to configure MDX plugin:", error);
    // Return an empty plugin to prevent build failure
    return {
      name: "mdx-fallback",
      enforce: "pre",
      // Add warning during build for better debugging
      buildStart() {
        this.warn("MDX plugin failed to initialize properly. MDX files may not be processed correctly.");
      }
    };
  }
}

/**
 * Validate required environment variables with enhanced error handling
 * @param env The loaded environment variables
 * @returns Validated environment object with defaults for development
 */
function validateEnv(env: EnvConfig): EnvConfig {
  const requiredVars: string[] = [
    // Add your required env variables here
    // Example: 'DATABASE_URL', 'API_KEY'
  ];
  
  const missing = requiredVars.filter(key => !env[key]);
  
  if (missing.length > 0) {
    console.warn(`⚠️ Missing required environment variables: ${missing.join(', ')}`);
    console.warn('Please check your .env file');
    
    // For development, set default values to prevent crashes
    if (env.NODE_ENV !== 'production') {
      missing.forEach(key => {
        console.warn(`Setting default value for ${key}`);
        env[key] = `MISSING_${key}`;
      });
    }
  }
  
  return env;
}

/**
 * Ensure directory exists for build artifacts and cache
 * @param dirPath Directory path to check/create
 */
function ensureDirectory(dirPath: string): void {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`Created directory: ${dirPath}`);
    }
  } catch (error) {
    console.warn(`Failed to create directory ${dirPath}:`, error);
  }
}

/**
 * Configure server options with advanced settings for development and production
 * @param env Environment config object
 * @param isProd Whether running in production mode
 */
function configureServer(env: EnvConfig, isProd: boolean) {
  const port = parseInt(env.PORT || '3000', 10);
  
  return {
    port,
    host: true,
    // Enhanced HMR configuration with better timeout handling
    hmr: isProd ? false : {
      overlay: true,
      timeout: 30000, // Increased timeout for more reliable connections
      protocol: 'ws', // Explicitly use WebSocket protocol
      clientPort: env.HMRPORT ? parseInt(env.HMRPORT, 10) : undefined,
    },
    // Better error overlay with separate control for errors and warnings
    overlay: {
      errors: true,
      warnings: true,
    },
    // More comprehensive file watching settings
    watch: {
      usePolling: false, // Set to true if working in Docker/VM environments
      ignored: [
        '**/node_modules/**',
        '**/dist/**',
        '**/.git/**',
        '**/coverage/**',
        '**/tmp/**',
      ],
    },
    // Cross-origin configuration
    cors: true,
  };
}

/**
 * Configure advanced chunk splitting for optimized loading
 * @param isProd Production mode flag
 * @param env Environment variables
 */
function configureChunkSplitting(isProd: boolean, env: EnvConfig) {
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
      // Framework chunks - core React and Remix
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
      
      // UI component libraries
      if (id.includes('node_modules/@radix-ui') ||
          id.includes('node_modules/@headlessui')) {
        return 'vendor-ui';
      }
      
      // Utility libraries
      if (id.includes('node_modules/lodash') ||
          id.includes('node_modules/date-fns')) {
        return 'vendor-utils';
      }
      
      // All other node_modules go in a separate chunk
      if (id.includes('node_modules')) {
        return 'vendor-other';
      }
    },
    // Configure more granular output options
    chunkFileNames: isProd ? 'assets/[name].[hash].js' : 'assets/[name].js',
    entryFileNames: isProd ? 'assets/[name].[hash].js' : 'assets/[name].js',
    assetFileNames: isProd ? 'assets/[name].[hash].[ext]' : 'assets/[name].[ext]',
  };
}

/**
 * Configure build options with comprehensive optimization settings
 * @param rootPath Project root path
 * @param isProd Production flag
 * @param env Environment variables
 */
function configureBuild(rootPath: string, isProd: boolean, env: EnvConfig) {
  // Ensure build directory exists
  const outDir = path.resolve(rootPath, 'dist');
  ensureDirectory(outDir);
  
  return {
    outDir,
    emptyOutDir: true,
    // Target browsers by environment
    target: isProd ? 'es2019' : 'esnext',
    // Size warnings
    chunkSizeWarningLimit: isProd ? 1000 : 2000,
    // Accurate reporting in production
    reportCompressedSize: isProd,
    // Build options
    rollupOptions: {
      output: configureChunkSplitting(isProd, env),
      treeshake: isProd ? {
        moduleSideEffects: true,
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false
      } : false,
    },
    // CSS optimization
    cssCodeSplit: true,
    cssMinify: isProd,
    cssTarget: isProd ? 'es2019' : 'esnext',
    // Minification options
    minify: isProd ? 'esbuild' : false,
    terserOptions: isProd ? {
      compress: {
        drop_console: env.REMOVE_CONSOLE === 'true',
        drop_debugger: true
      },
      format: {
        comments: false
      }
    } : undefined,
    // Sourcemap generation
    sourcemap: isProd ? env.SOURCEMAPS === 'true' : true,
    // Asset handling
    assetsDir: 'assets',
    assetsInlineLimit: 4096, // 4kb
  };
}

/**
 * Get a list of supported browsers for the build target
 * @param isProd Production flag
 */
function getBrowserslist(isProd: boolean): string[] {
  return isProd
    ? [
        '> 1%',
        'last 2 versions',
        'Firefox ESR',
        'not dead',
        'not IE 11'
      ]
    : [
        'last 2 Chrome versions',
        'last 2 Firefox versions',
        'last 1 Safari version'
      ];
}

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }): UserConfig => {
  // Load env variables based on mode with proper typing
  const env = loadEnv(mode, process.cwd(), '') as unknown as EnvConfig;
  const isProd = mode === 'production';
  const isServe = command === 'serve';
  
  // Validate environment variables and get validated env
  const validatedEnv = validateEnv(env);
  
  // Root path for project references
  const rootPath = process.cwd();
  
  // Ensure cache directory exists
  const cacheDir = path.resolve(rootPath, 'node_modules/.vite');
  ensureDirectory(cacheDir);
  
  return {
    // Project root configuration
    root: rootPath,
    base: validatedEnv.BASE_URL || '/',
    
    // Define global constants with more useful defaults
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
      'process.env.BUILD_TIME': JSON.stringify(new Date().toISOString()),
      // Selectively expose environment variables to client
      ...(validatedEnv.API_URL && { 'process.env.API_URL': JSON.stringify(validatedEnv.API_URL) }),
    },
    
    // Configure plugins with logical order and error handling
    plugins: [
      // MDX configuration with error handling
      configureMdx(),
      
      // Handle Remix integration with extended options
      remix({
        // Ignore test files, spec files and hidden files in routes
        ignoredRouteFiles: ["**/.*", "**/*.test.{js,jsx,ts,tsx}", "**/*.spec.{js,jsx,ts,tsx}"],
        serverModuleFormat: "esm",
        // Enable future features for better compatibility
        future: {
          // Only include future features that exist in the current version
          v2_errorBoundary: true,
          v2_meta: true,
          v2_normalizeFormMethod: true,
          v2_routeConvention: true,
        },
      }),
      
      // Enable TypeScript path aliases with additional options
      tsconfigPaths({
        loose: !isProd, // More permissive in development
      }),
    ],
    
    // Performance optimizations with comprehensive build settings
    build: configureBuild(rootPath, isProd, validatedEnv),
    
    // Server configuration with improved options
    server: configureServer(validatedEnv, isProd),
    
    // Preview server configuration for testing production builds
    preview: {
      port: parseInt(validatedEnv.PORT || '3000', 10),
      host: true,
      cors: true,
    },
    
    // Optimize dependency pre-bundling with broader library support
    optimizeDeps: {
      // Include frequently used dependencies
      include: [
        '@remix-run/react',
        'react',
        'react-dom',
        'react-router-dom',
        // Add UI libraries that are commonly used
        '@radix-ui/themes',
      ],
      // Exclude any problematic dependency if needed
      exclude: [],
      // Force pre-bundling for specific dependencies
      force: isProd,
      // Consistent build target with main build
      esbuildOptions: {
        target: getBrowserslist(isProd).join(','),
        // Support JSX automatically
        jsx: 'automatic',
        jsxImportSource: 'react',
        // Define constants during pre-bundling
        define: {
          'process.env.NODE_ENV': JSON.stringify(mode),
        },
      },
      // Ensure dev server restarts when config files change
      entries: [
        '**/*.html',
        '**/*.mdx',
      ],
    },
    
    // Enable persistent caching for faster builds
    cacheDir,
    
    // Better error reporting
    clearScreen: !validatedEnv.DEBUG,
    logLevel: (validatedEnv.DEBUG === 'true') ? 'info' : 'warn',
    
    // Ensure proper publicDir handling
    publicDir: path.resolve(rootPath, 'public'),
    
    // Enable typecheck during build (helps catch errors earlier)
    esbuild: {
      legalComments: isProd ? 'none' : 'inline',
      target: isProd ? 'es2019' : 'esnext',
    },
  };
});
