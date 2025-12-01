import { resetUsers } from "src/lib/db/queries/users";

export async function handlerResetUsers() {
  await resetUsers();
  console.log("Users were deleted");
}