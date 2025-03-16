# GitHub Activity CLI

## 📌 Overview
GitHub Activity CLI is a simple command-line tool that fetches and displays the recent activity of a specified GitHub user. This project helps developers practice API interaction, JSON data handling, and CLI application development.

## 🚀 Features
- Fetches a GitHub user's recent activity.
- Displays structured activity logs in the terminal.
- Supports filtering activity by event type.
- Handles errors gracefully (e.g., invalid usernames, API failures).
- No external libraries required!

## 🛠️ Installation
Clone the repository and navigate to the project directory:

```sh
git clone https://github.com/yourusername/github-activity-cli.git
cd github-activity-cli
```

## 📋 Usage
Run the CLI tool using Node.js:

```sh
node github-activity.js <username>
```

Example:
```sh
node github-activity.js octocat
```

You can also filter activity by event type:

```sh
node github-activity.js octocat PushEvent
```

## 🔥 Sample Output
```
------------------------------------------------------------
[1]
Action: Pushed Commits
Detail: 3 commits to octocat/hello-world
Date:   03/16/2025
------------------------------------------------------------
[2]
Action: Starred Repository
Detail: octocat/Spoon-Knife
Date:   03/15/2025
------------------------------------------------------------
```

## 📡 API Endpoint Used
The CLI fetches data from the GitHub API:
```
https://api.github.com/users/<username>/events
```
Example:
```
https://api.github.com/users/octocat/events
```

## 🔍 Supported GitHub Events
- PushEvent (Pushed commits)
- CreateEvent (Created repo, branch, or tag)
- IssuesEvent (Opened, closed, or commented on issues)
- PullRequestEvent (Created, merged, or closed pull requests)
- ForkEvent (Forked a repository)
- WatchEvent (Starred a repository)
- And many more...

## ❌ Error Handling
- Invalid GitHub username → Displays an error message.
- No recent activity → Notifies the user.
- Invalid event filter → Lists valid event types.

## 🏗️ Future Enhancements
- Caching results to reduce API requests.
- Displaying activity in a more structured format.
- Supporting pagination for more activity history.

## 🎯 Contributing
Contributions are welcome! Feel free to submit issues or pull requests.

## 📄 License
This project is licensed under the MIT License.

---

## 🙌 Author  

👤 **Muhammad Faizan Soomro**  
📧 [Email](mailto:mfaizansoomro00@gmail.com)  
🐙 [LinkedIn](https://www.linkedin.com/in/faizansoomro/)  

---