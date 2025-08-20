

# storytelling-automation

[![Powered by Cal.com](https://img.shields.io/badge/Powered%20by-Cal.com-111?logo=cal.com&logoColor=white&labelColor=111&color=3a86ff)](https://cal.com)
[![Uses GitHub Issues](https://img.shields.io/badge/Uses-GitHub%20Issues-181717?logo=github)](https://github.com/opensourcestories/storytelling-automation/issues)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)



Automates the creation of GitHub issues for storytelling workflows using a webhook from Cal.com. This project streamlines the process of managing storytelling tasks by creating structured GitHub issues based on booking details received from Cal.com, such as storyteller information and consent status.
Usage
Send a webhook from Cal.com to your deployed webhook endpoint, which processes the storyteller details and creates a corresponding issue in the GitHub repository specified by the **ISSUE_API_URL** environment variable. The issue includes a predefined template with roles and steps for scheduling, recording, processing, editing, publishing, and promoting the story.


### SETUP
To set up the automation, configure the required environment variables and deploy the webhook handler.

Configure Environment Variables:Create a .env file in the root of the project or set environment variables in your deployment platform (e.g., Vercel). The following variables are required:

`GITHUB_TOKEN:`

Purpose: Authenticates requests to the GitHub API, allowing the webhook handler to create issues in the specified repository.
Format: A GitHub Personal Access Token (PAT) with the repo scope, which grants permissions to manage issues, repositories, and other resources.
How to Obtain:
Go to GitHub Settings > Developer settings > Personal access tokens > Tokens (classic).
Click Generate new token, select the repo scope, and copy the token.
Store the token securely in your .env file or deployment platform’s environment variables (e.g., Vercel Dashboard > Settings > Environment Variables).


Security: Never commit the token to your repository or share it publicly. Use a secrets manager or environment variables to keep it secure.
**Example:**`GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`




`ISSUE_API_URL:`

Purpose: Specifies the GitHub API endpoint where issues will be created for the storytelling workflow.
Format: A URL in the format `https://api.github.com/repos/{owner}/{repo}/issues`, where:
{owner} is the GitHub username or organization owning the repository (e.g., opensourcestories ).
{repo} is the name of the repository (e.g., storytelling-automation).
For example, to create issues in the opensourcestories/storytelling-automation repository, set ISSUE_API_URL=https://api.github.com/repos/opensourcestories/storytelling-automation/issues.


Details: This URL points to the GitHub REST API endpoint for creating issues. The webhook handler sends a POST request to this URL with the issue details (e.g., title, body, labels). Ensure the repository exists and the GITHUB_TOKEN has write access to it.
**Example:**`ISSUE_API_URL=https://api.github.com/repos/opensourcestories/storytelling-automation/issues`


### Deploy or Run the API Endpoint:

Deploy the webhook handler (e.g., webhook.js) to a platform like Vercel , or run it locally for testing.

Run the server: vercel dev (for Vercel) or node server.js (adjust for your setup).

### Run Locally

Use a tool like ngrok to expose your local server: 

```
ngrok http 3000
```

Configure the Cal.com webhook Subscriber URL to send requests to the ngrok URL (e.g., https://abc123.ngrok.io/api/webhook).

### LICENSE


[![License](https://img.shields.io/badge/License-Apache_2.0-D22128?style=for-the-badge&logo=apache&logoColor=white)](https://www.apache.org/licenses/LICENSE-2.0)
