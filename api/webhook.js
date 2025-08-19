export default async function handler(req, res) {
    // Restrict to POST requests
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        // Validate incoming payload
        const { payload } = req.body;
        if (!payload || !payload.responses) {
            return res.status(400).json({ error: "Invalid or missing payload.responses" });
        }

        // Extract storyteller info with safe defaults
        const bookerName = payload?.responses?.name?.value || "Unknown";
        const bookerEmail = payload?.responses?.email?.value || "No email";
        const story = payload?.responses?.story?.value || "No story provided";
        const pronouns = payload?.responses?.pronouns?.value || "Not provided";
        const links = payload?.responses?.links?.value || "No links";
        const notes = payload?.responses?.notes?.value || "No notes";
        const profilePicture = payload?.responses?.profile_picture?.value || "No picture";
        const consent = payload?.responses?.["I-consent-to-the-recording-of-this-session"]?.value
            ? " Consented"
            : " Not Consented";

        // Issue template (unchanged)
        const issueTemplate = `
# Roles:

- coordinator:
- facilitator:
- editor:
- publisher:

# Steps

## scheduling

- [ ] (coordinator) reach out to storyteller
- [ ] (coordinator) confirm scheduling and assigned facilitator
- [ ] (coordinator) create storyteller's folder in [shared drive](https://drive.google.com/drive/u/0/folders/129lq8IvGjqezYE0vlVOeNR-AaT9aioYG)

## recording

- [ ] (facilitator) host session with storyteller
- [ ] (facilitator) upload recording to the folder that has been shared with you

## processing

- [ ] (coordinator) trim/edit audio (if necessary)
- [ ] (coordinator) convert to 128kbps (if necessary)
- [ ] (coordinator) send to transcription service
- [ ] (coordinator) add transcription and files to shared folder

## editing

- [ ] (editor) edit transcript for readability
- [ ] (editor) break into paragraphs
- [ ] (editor) fine-tune title
- [ ] (editor) add logical headings
- [ ] (editor) add a summary
- [ ] (editor) suggest tags (optional; see [opensourcestories.org/tags](https://www.opensourcestories.org/tags/) for existing tags)
- [ ] (editor) write copy for social media

## publishing

- [ ] (publisher) upload recording to StoryCorps
- [ ] (publisher) upload recording to audio host
- [ ] (publisher) create PR
- [ ] (publisher) get review and merge

## promoting

- [ ] (coordinator or publisher) schedule posts on various channels
`;

        // Validate environment variables
        const githubRepo = process.env.ISSUE_API_URL;
        if (!githubRepo || !githubRepo.includes("api.github.com")) {
            return res.status(500).json({ error: "ISSUE_API_URL must be a valid GitHub API URL (e.g., https://api.github.com/repos/eskayML/storytelling-automation/issues)" });
        }

        const githubToken = process.env.GITHUB_TOKEN;
        if (!githubToken) {
            return res.status(500).json({ error: "GITHUB_TOKEN environment variable not set" });
        }

        // Construct GitHub API payload (explicitly exclude invalid fields like 'links')
        const issuePayload = {
            title: `[STORY] Publish ${bookerName}'s story`,
            body: `${issueTemplate}`,
            labels: ["story"],
        };

        // Debug: Log the payload being sent to GitHub
        console.log("GitHub API payload:", JSON.stringify(issuePayload, null, 2));

        // Call GitHub API to create issue
        const response = await fetch(githubRepo, {
            method: "POST",
            headers: {
                "Accept": "application/vnd.github.v3+json",
                "Authorization": `Bearer ${githubToken}`,
                "X-GitHub-Api-Version": "2022-11-28",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(issuePayload),
        });

        const data = await response.json();

        if (response.ok) {
            return res.status(200).json({
                message: "GitHub issue created successfully",
                issue: data.html_url,
                issue_number: data.number,
            });
        } else {
            console.error("GitHub API error:", data);
            return res.status(response.status).json({
                error: data.message || "GitHub API error",
                documentation_url: data.documentation_url,
                details: data,
            });
        }
    } catch (err) {
        console.error("Webhook error:", err);
        return res.status(500).json({
            error: "Internal Server Error",
            details: err.message,
        });
    }
}