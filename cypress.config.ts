import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },

  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },

  env: {
    default_room_id: "d7a1af15-4fea-4207-98e6-b3a97e42f19a",
    non_existing_room: "this-room-does-not-exist"
  },
});
