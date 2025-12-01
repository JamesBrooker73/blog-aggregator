import { CommandsRegistry, registerCommand, runCommand } from "./commands/commands";
import { handlerGetAllUsers, handlerLogin, handlerRegister} from "./commands/users";
import { handlerAgg } from "./commands/aggregate";
import { handlerResetUsers } from "./commands/reset";
import { handlerAddFeed } from "./commands/addFeed";
import { handlerGetAllFeeds } from "./commands/getAllFeeds";


async function main() {
  const commandsRegistry: CommandsRegistry = {}
  registerCommand(commandsRegistry, "login", handlerLogin);
  registerCommand(commandsRegistry, "register", handlerRegister);
  registerCommand(commandsRegistry, "reset", handlerResetUsers);
  registerCommand(commandsRegistry, "users", handlerGetAllUsers);
  registerCommand(commandsRegistry, "agg", handlerAgg);
  registerCommand(commandsRegistry, "addfeed", handlerAddFeed);
  registerCommand(commandsRegistry, "feeds", handlerGetAllFeeds);

  const args = process.argv.slice(2);
  const [cmdName, ...cmdArgs] = args;

  if (!cmdName) {
    console.log("You need to provide at least one input after the command");
    process.exit(1);
  }

  try {
    await runCommand(commandsRegistry, cmdName, ...cmdArgs);
  } catch (err) {
    console.error((err as Error).message);
    process.exit(1);
  }

  process.exit(0);

}

main();

