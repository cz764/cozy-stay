import { config as loadEnv } from "dotenv";
import type { CodegenConfig } from "@graphql-codegen/cli";

// Codegen runs outside Next.js, which is what normally loads .env.local.
loadEnv({ path: ".env.local" });

const config: CodegenConfig = {
  // Introspects the live Supabase endpoint — requires the schema comment
  // directive from supabase/migrations/20260818145713_graphql_config.sql.
  schema: [
    {
      [`${process.env.SUPABASE_URL}/graphql/v1`]: {
        headers: { apikey: process.env.SUPABASE_PUBLISHABLE_KEY ?? "" },
      },
    },
  ],
  documents: ["src/app/api/**/*.ts"],
  ignoreNoDocuments: true,
  generates: {
    "src/gql/": {
      preset: "client",
      // Masking's useFragment() indirection buys nothing here: fragments are
      // consumed server-side in one module, not spread across components.
      presetConfig: { fragmentMasking: false },
      // TypedDocumentString instead of AST documents — executable with plain
      // fetch, no GraphQL client library in the bundle.
      config: { documentMode: "string" },
    },
  },
};

export default config;
