import { migrate } from "../src/lib/db";

migrate()
  .then(() => {
    console.log("Migrations applied.");
  })
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
