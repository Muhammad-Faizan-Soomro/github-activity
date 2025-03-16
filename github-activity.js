/**
 * CLI tool to fetch and display a GitHub user's recent activity
 * Usage: node github-activity.js <username> [filter]
 */

async function main() {
  // Validate command-line arguments
  if (process.argv.length < 3 || process.argv.length > 4) {
    console.info("Usage: node github-activity.js <username> [filter]\n");
    console.info("Example:");
    console.info("  node github-activity.js octocat");
    console.info("  node github-activity.js octocat PushEvent");
    process.exit(1);
  }

  const username = process.argv[2];
  const filter = process.argv[3];

  // Supported GitHub event types with human-readable messages
  const VALID_EVENTS = [
    "PushEvent",
    "CreateEvent",
    "PublicEvent",
    "CommitCommentEvent",
    "DeleteEvent",
    "MemberEvent",
    "ForkEvent",
    "GollumEvent",
    "IssueCommentEvent",
    "IssuesEvent",
    "PullRequestReviewEvent",
    "PullRequestEvent",
    "PullRequestReviewCommentEvent",
    "PullRequestReviewThreadEvent",
    "ReleaseEvent",
    "SponsorshipEvent",
    "WatchEvent",
  ];

  /**
   * Generates human-readable message for a GitHub event with structured formatting
   * @param {Object} event - GitHub event object
   * @returns {string} Formatted activity message with consistent structure
   */
  const formatActivityMessage = (event) => {
    const { type, payload, repo, created_at } = event;
    const date = new Date(created_at).toLocaleDateString();
    const repoName = repo.name;

    const activity = {
      action: "",
      detail: "",
      date: date,
    };

    switch (type) {
      case "PushEvent":
        activity.action = "Pushed Commits";
        activity.detail = `${payload.size} ${
          payload.size === 1 ? "commit" : "commits"
        } to ${repoName}`;
        break;

      case "CreateEvent":
        if (payload.ref_type === "branch") {
          activity.action = "Created Branch";
          activity.detail = `'${payload.ref}' in ${repoName}`;
        } else if (payload.ref_type === "tag") {
          activity.action = "Created Tag";
          activity.detail = `'${payload.ref}' in ${repoName}`;
        } else {
          activity.action = "Created Repository";
          activity.detail = repoName;
        }
        break;

      case "IssueCommentEvent": {
        const commentPreview =
          payload.comment.body.length > 50
            ? `${payload.comment.body.substring(0, 47)}...`
            : payload.comment.body;
        activity.action = "Issue Comment";
        activity.detail = `#${payload.issue.number}: "${commentPreview}"`;
        break;
      }

      case "PullRequestEvent": {
        const prAction =
          payload.action === "closed"
            ? payload.pull_request.merged
              ? "Merged"
              : "Closed"
            : payload.action.charAt(0).toUpperCase() + payload.action.slice(1);
        activity.action = `${prAction} Pull Request`;
        activity.detail = `#${payload.number}: "${payload.pull_request.title}"`;
        break;
      }

      case "PublicEvent":
        activity.action = "Made Public";
        activity.detail = repoName;
        break;

      case "CommitCommentEvent": {
        const commentPreview =
          payload.comment.body.length > 50
            ? `${payload.comment.body.substring(0, 47)}...`
            : payload.comment.body;
        activity.action = "Commit Comment";
        activity.detail = `by ${payload.comment.user.login}: "${commentPreview}"`;
        break;
      }

      case "DeleteEvent":
        activity.action = "Deleted";
        activity.detail = `${payload.ref_type} '${payload.ref}' from ${repoName}`;
        break;

      case "MemberEvent":
        activity.action =
          payload.action === "edited"
            ? "Updated Permissions"
            : `${
                payload.action.charAt(0).toUpperCase() + payload.action.slice(1)
              } Collaborator`;
        activity.detail = `${payload.member.login} in ${repoName}`;
        break;

      case "ForkEvent":
        activity.action = "Forked Repository";
        activity.detail = `to ${payload.forkee.full_name}`;
        break;

      case "GollumEvent":
        activity.action = "Wiki Updates";
        activity.detail = payload.pages
          .map((page) => `${page.action} ${page.title}`)
          .join(", ");
        break;

      case "IssuesEvent": {
        const action = payload.action.replace(/ed$/, "");
        activity.action = `${
          action.charAt(0).toUpperCase() + action.slice(1)
        } Issue`;
        activity.detail = `#${payload.issue.number}: "${payload.issue.title}"`;
        break;
      }

      case "PullRequestReviewEvent": {
        const reviewState = payload.review.state.replace(/_/g, " ");
        activity.action = "PR Review";
        activity.detail = `#${payload.pull_request.number} (${reviewState})`;
        break;
      }

      case "PullRequestReviewCommentEvent":
        activity.action = "PR Comment";
        activity.detail = `#${payload.pull_request.number}`;
        break;

      case "PullRequestReviewThreadEvent": {
        const threadAction =
          payload.action === "resolved" ? "Resolved" : "Unresolved";
        activity.action = `${threadAction} Thread`;
        activity.detail = `PR #${payload.thread.comments[0].pull_request_url
          .split("/")
          .pop()}`;
        break;
      }

      case "ReleaseEvent":
        activity.action = `${
          payload.action.charAt(0).toUpperCase() + payload.action.slice(1)
        } Release`;
        activity.detail = payload.release.name || payload.release.tag_name;
        break;

      case "SponsorshipEvent":
        activity.action = "Sponsorship";
        activity.detail = payload.action.replace(/_/g, " ");
        break;

      case "WatchEvent":
        activity.action = "Starred Repository";
        activity.detail = repoName;
        break;

      default:
        activity.action = "Unknown Activity";
        activity.detail = type;
    }

    return activity;
  };

  try {
    // Fetch user activity from GitHub API
    const response = await fetch(
      `https://api.github.com/users/${username}/events`
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(
          `User '${username}' not found. Please check the username and try again.`
        );
      }
      throw new Error(`GitHub API request failed (Status: ${response.status})`);
    }

    const activities = await response.json();
    const separator = "-".repeat(60);

    // Process and filter activities
    const filteredActivities = filter
      ? activities.filter((event) => event.type === filter)
      : activities;

    // Display results
    if (filteredActivities.length === 0) {
      const noResultsMessage = filter
        ? `No matching activities found for ${username} (filter: ${filter})`
        : `No recent activities found for ${username}`;
      console.log(noResultsMessage);
      return;
    }

    filteredActivities.forEach((event, index) => {
      const { action, detail, date } = formatActivityMessage(event);
      console.log(
        `${separator}\n[${index + 1}] \n` +
          `Action: ${action}\n` +
          `Detail: ${detail}\n` +
          `Date:   ${date}\n` +
          `${separator}\n`
      );
    });
  } catch (error) {
    console.error(`\nError: ${error.message}`);
    if (filter && !VALID_EVENTS.includes(filter)) {
      console.log(`\nValid event types:\n${VALID_EVENTS.join(", ")}`);
    }
    process.exit(1);
  }
}

main();
