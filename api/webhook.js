export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { payload } = req.body;

        // Extract storyteller info (kept for future use even if unused)
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

        // Issue template (as you provided)
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

        // Use environment variable for GitHub repo (format: owner/repo)
        const githubRepo = process.env.GITHUB_ISSUE_PAGE;
        if (!githubRepo) {
            return res.status(500).json({ error: "GITHUB_ISSUE_PAGE environment variable not set" });
        }
        // Call GitHub API to create issue
        const response = await fetch(
            `https://api.github.com/repos/${githubRepo}/issues`,
            {
                method: "POST",
                headers: {
                    Authorization: `token ${process.env.GITHUB_TOKEN}`,
                    Accept: "application/vnd.github+json",
                },
                body: JSON.stringify({
                    title: `[STORY] Publish ${bookerName}'s story`,
                    body: issueTemplate,
                    labels: ["story"],
                }),
            }
        );

        const data = await response.json();

        if (response.ok) {
            return res.status(200).json({
                message: "GitHub issue created",
                issue: data.html_url,
            });
        } else {
            return res.status(500).json({
                error: data.message || "GitHub API error",
            });
        }
    } catch (err) {
        console.error("Webhook error:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}


