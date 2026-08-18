-- pg_graphql 1.6.0+ disables GraphQL introspection by default; codegen needs it
-- to read the schema. This comment REPLACES the one from 0001, so it must carry
-- inflect_names forward too. max_rows lifts pg_graphql's default 30-row page
-- cap to match MAX_LIMIT in src/lib/pagination.ts.
comment on schema public is e'@graphql({"inflect_names": true, "introspection": true, "max_rows": 60})';
