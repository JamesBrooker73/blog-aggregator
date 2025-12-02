# Gator – Minimal RSS Feed Aggregator

`gator` is a command-line RSS reader written in Go. It lets you subscribe to feeds, fetch new articles, and read them from your terminal.

---

## Requirements

- Go 1.21+ installed
- Git installed
- Internet connection (for fetching feeds)
- A terminal that can run CLI commands

Optional but recommended:

- A GitHub account (to clone the repo)
- `make` (if you use a Makefile for common tasks)

---

## Installation

Clone the repository:

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>

Build the binary:

go build -o gator ./cmd/gator

Now you can run ./gator from the project root (or move it somewhere on your PATH).

Configuration
gator uses a config file to know where to store its database and which user is “current”.

By default, it looks for a config file in:

Linux/macOS: ~/.gatorconfig.json
Windows: C:\Users\<you>\.gatorconfig.json (or similar home directory)
Create a file like this:

{
  "db_path": "/absolute/path/to/gator.db",
  "current_user_name": "alice"
}

db_path: where the SQLite database file should live.
current_user_name: the username that will be used for commands that require a user.
Make sure the directory in db_path exists.

Usage
All commands are run through the gator binary.

General form:

./gator <command> [subcommand] [flags...]

Common Commands
Set the current user
./gator user add alice
./gator user set alice

user add <name>: Create a new user.
user set <name>: Make that user the current user in the config.
Add an RSS feed
./gator feed add https://example.com/feed.xml "Example Feed"

First argument: the RSS feed URL
Second argument: a label/name for the feed
List feeds
./gator feed list

Shows all feeds and which users are subscribed to them.

Subscribe to a feed
./gator sub add https://example.com/feed.xml

Subscribes the current user to the given feed URL.

List subscriptions
./gator sub list

Shows the feeds the current user is subscribed to.

Fetch new posts
./gator agg

Fetches new posts for all feeds and stores them in the database.

Read posts
./gator browse

Opens a simple TUI/CLI reader for posts (or prints recent posts, depending on your implementation).

Examples
# Add a user and set them as current
./gator user add alice
./gator user set alice

# Add a feed and subscribe
./gator feed add https://blog.boot.dev/index.xml "Boot.dev Blog"
./gator sub add https://blog.boot.dev/index.xml

# Fetch and read
./gator agg
./gator browse


