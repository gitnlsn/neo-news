import { defineConfig, defineProject } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    
    // coverage: {
    //   provider: 'v8',
    //   reporter: ['text-summary', 'json', 'html'],
    //   reportsDirectory: './coverage',
    // },

    poolOptions: {
      threads: {
        singleThread: true,
        maxThreads: 1,
      }
    },
  },
});
