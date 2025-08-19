

# storytelling-automation

[![Powered by Cal.com](https://img.shields.io/badge/Powered%20by-Cal.com-111?logo=cal.com&logoColor=white&labelColor=111&color=3a86ff)](https://cal.com)
[![Uses GitHub Issues](https://img.shields.io/badge/Uses-GitHub%20Issues-181717?logo=github)](https://github.com/opensourcestories/storytelling-automation/issues)

Automates the creation of GitHub issues for storytelling workflows using a webhook from Cal.com.

## Usage

Send a webhook from Cal.com  to the GitHub API with storyteller details. Issues are created in the repo set by `GITHUB_ISSUE_PAGE` variable.

## Setup

1. Set `GITHUB_TOKEN` and `GITHUB_ISSUE_PAGE` in your `.env` file.


2. Deploy or run the API endpoint in your preferred environment.

---
Apache-2.0 License