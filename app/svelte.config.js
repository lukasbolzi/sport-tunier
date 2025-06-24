import adapter from '@sveltejs/adapter-static';

const dev = process.argv.includes('dev');
const base = dev ? '' : '/sport-tunier';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      fallback: 'index.html'  // necessary for SPA routing
    }),
    paths: {
      base
    },
    prerender: {
      handleMissingId: 'warn',
      entries: ['*']
    }
  }
};

export default config;
