import fs from "fs";
import os from "os";
import path from "path";

export type Config = {
  dbUrl: string,
  currentUserName: string | null
};

export function setUser(currentUser: string) {
  const currentConfig = readConfig();
  currentConfig.currentUserName = currentUser;
  writeConfig(currentConfig);
}

export function readConfig(): Config {
  const obj = JSON.parse(fs.readFileSync(getFilePath(), "utf-8"));
  try {
    return validateConfig(obj);
  } catch (Error) {
    console.log(Error);
    throw Error;
  }
}

function writeConfig(config: Config): void {
  const jsonObj = {
    db_url: config.dbUrl,
    current_user_name: config.currentUserName
  };
  const stringifyObj = JSON.stringify(jsonObj);
  fs.writeFileSync(getFilePath(), stringifyObj);
}

function getFilePath(): string {
  const filePath = path.join(os.homedir(),"/.gatorconfig.json");
  return filePath;
}

function validateConfig(rawConfig: any): Config {
  if (!("db_url" in rawConfig) || typeof rawConfig.db_url !== "string") {
    throw new Error("dbURL is missing from the JSON file or is not a string");
  }
  if (
    !rawConfig.current_user_name ||
    typeof rawConfig.current_user_name !== "string"
  ) {
    throw new Error("current_user_name is required in config file");
  }
  const config = {
    dbUrl: rawConfig.db_url,
    currentUserName: rawConfig.current_user_name ?? null
  }
  return config;
} 