import { defineConfig, defineProject } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "~/": new URL("./src/", import.meta.url).pathname,
    },
  },

  test: {
    environment: "node",
    
    // coverage: {
    //   provider: 'v8',
    //   reporter: ['text-summary', 'json', 'html'],
    //   reportsDirectory: './coverage',
    // },


  },
});
