import { CommandsRegistry, registerCommand, runCommand } from "./commands/commands";
import { handlerGetAllUsers, handlerLogin, handlerRegister} from "./commands/users";
import { handlerAgg } from "./commands/aggregate";
import { handlerResetUsers } from "./commands/reset";
import { handlerAddFeed, handlerGetAllFeeds } from "./commands/feeds";
import { handlerFollowFeed, handlerUnfollowUserFeed, handlerUserFeeds } from "./commands/feed-follows";
import { middlewareLoggedIn } from "./middleware";
import { handlerBrowse } from "./commands/posts";


async function main() {

  const commandsRegistry: CommandsRegistry = {}

  registerCommand(commandsRegistry, "login", handlerLogin);
  registerCommand(commandsRegistry, "register", handlerRegister);
  registerCommand(commandsRegistry, "reset", handlerResetUsers);
  registerCommand(commandsRegistry, "users", handlerGetAllUsers);
  registerCommand(commandsRegistry, "agg", handlerAgg);
  registerCommand(commandsRegistry, "addfeed", middlewareLoggedIn(handlerAddFeed));
  registerCommand(commandsRegistry, "feeds", handlerGetAllFeeds);
  registerCommand(commandsRegistry, "follow", middlewareLoggedIn(handlerFollowFeed));
  registerCommand(commandsRegistry, "following", middlewareLoggedIn(handlerUserFeeds));
  registerCommand(commandsRegistry, "unfollow", middlewareLoggedIn(handlerUnfollowUserFeed));
  registerCommand(commandsRegistry, "browse", middlewareLoggedIn(handlerBrowse));
  

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

