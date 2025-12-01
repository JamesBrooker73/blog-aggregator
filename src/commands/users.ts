import { readConfig, setUser } from "src/config";
import { createUser, getAllUsers, getUserByName, resetUsers } from "src/lib/db/queries/users";


export async function handlerLogin(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error("A username is required");
  }
  const username = args[0];

  let user = await getUserByName(username);

  if (!user) {
    throw new Error("There are no users with this username. Please register.");
  }

  setUser(username);
  console.log(`Username ${username} has logged in`);
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
    if (args.length !== 1) {
    throw new Error("A username is required to register");
  }
  const username = args[0];
  let user = await getUserByName(username);

  if (user) {
    throw new Error("A username with these details already exists.");
  }

  user = await createUser(username);
  setUser(username);
  console.log(`Username ${user.name} has logged in`);
  console.log(user);

}

export async function handlerGetAllUsers(cmdName: string, ...args: string[]) {
  const users = await getAllUsers();
  const currentUser = readConfig().currentUserName;

  if (!users || users.length === 0) {
    console.log("There are currently no users!");
    return;
  }
  for (let user of users) {
    const suffix = user.name === currentUser ? "(current)" : "";
    console.log(`* ${user.name} ${suffix}`);
  }
}

