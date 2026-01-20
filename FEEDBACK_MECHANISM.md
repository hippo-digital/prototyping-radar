# GitHub Feedback Mechanism

## Overview
Each skill in the radar includes a "Suggest an improvement" link that allows users to submit feedback via GitHub Issues. The link is pre-filled with context about the skill and provides a template for structured feedback.

## Features

✅ **Pre-filled GitHub Issues** - Opens with skill name, ring, quadrant, and file link
✅ **Structured Template** - Checklist for common feedback types
✅ **Auto-labeling** - Issues are tagged with `skill-feedback` label
✅ **Direct File Link** - Links to the exact `.md` file in your repo
✅ **Configurable** - Easy to enable/disable and customize

## Configuration

Edit `feedback.config.js` to customize the feedback mechanism:

```javascript
module.exports = {
  enabled: true,                      // Set to false to disable feedback links
  repoOwner: 'hippo-digital',       // Your GitHub username
  repoName: 'prototyping-radar',   // Your repository name
  mdFilePath: 'data/items-md',        // Path to markdown files in repo
  issueLabel: 'skill-feedback'        // Label for feedback issues
}
```

## Setup Instructions

### 1. Update Configuration

1. Open `feedback.config.js`
2. Change `repoOwner` to your GitHub username
3. Change `repoName` to your repository name (if different)
4. Optionally customize the `issueLabel`

Example:
```javascript
module.exports = {
  enabled: true,
  repoOwner: 'mattfielding',
  repoName: 'prototyping-skills-radar',
  mdFilePath: 'data/items-md',
  issueLabel: 'skill-feedback'
}
```

### 2. Create GitHub Issue Label

In your GitHub repository:
1. Go to **Issues** → **Labels**
2. Click **New label**
3. Name: `skill-feedback`
4. Description: `Feedback on skill descriptions`
5. Color: Choose any color (e.g., #0075ca)
6. Click **Create label**

### 3. Make Repository Public (Optional)

For the best experience, make your repository public so:
- Users can view the markdown files
- File links work without authentication
- Issues can be submitted by anyone

If your repo must be private:
- Only collaborators can submit feedback
- File links require GitHub authentication

### 4. Rebuild and Deploy

```bash
# Rebuild JSON with filename field
npm run build:data:md

# Test locally
npm run dev

# Deploy to Heroku
git add .
git commit -m "Add GitHub feedback mechanism"
git push heroku main
```

## How It Works

### User Flow

1. User clicks on a skill blip to view details
2. At the bottom of the description, they see: **"🐙 Leave feedback about this skill"** (with GitHub icon)
3. Clicking the link opens a GitHub issue form with:
   - Pre-filled title: "Feedback: [Skill Name]"
   - Pre-filled body with skill details and feedback template
   - Auto-applied `skill-feedback` label

### Issue Template

The pre-filled issue includes:

```markdown
## Skill: [Skill Name]

**Ring:** [Ring Name]
**Quadrant:** [Quadrant Name]

**File:** [Link to .md file]

---

### What needs improving?

<!-- Please describe your suggested improvement -->

- [ ] Description needs updating
- [ ] "Why is it important?" section needs work
- [ ] "Where to learn more" links need updating
- [ ] Ring placement is incorrect
- [ ] Other (please specify below)

### Your suggestion:

```

## Managing Feedback

### Triaging Issues

1. Go to your repository's **Issues** tab
2. Filter by label: `skill-feedback`
3. Review the feedback and suggestions
4. Add additional labels (e.g., `enhancement`, `documentation`)
5. Assign to team members if needed

### Implementing Feedback

1. Open the linked markdown file
2. Make the suggested improvements
3. Commit the changes
4. Reference the issue in the commit message: `Fix #123`
5. Rebuild and deploy
6. Close the issue with a comment thanking the contributor

### Example Workflow

```bash
# Edit the markdown file
nano data/items-md/running-the-kit-locally.md

# Rebuild JSON
npm run build:data:md

# Commit with issue reference
git add data/items-md/running-the-kit-locally.md data/prototyping-data.json
git commit -m "Update 'Running the kit locally' description

Fixes #42 - Added more detail about port numbers and error handling"

# Deploy
git push heroku main
```

## Disabling Feedback

If you want to disable the feedback mechanism:

1. Edit `feedback.config.js`
2. Set `enabled: false`
3. Rebuild and deploy

```javascript
module.exports = {
  enabled: false,  // Feedback links will not appear
  // ...rest of config
}
```

## Customization

### Custom Issue Template

Edit `src/graphing/components/quadrantTables.js` to customize the issue body template:

```javascript
const issueBody = encodeURIComponent(
  `## Your custom template here\n\n` +
  // Add your custom content
)
```

### Custom Link Text

Change the link text:

```javascript
return `
  <p class="blip-feedback-link">
    <a href="${githubUrl}" target="_blank" rel="noopener noreferrer">
      ${githubIcon} Your custom feedback text here
    </a>
  </p>
`
```

Or remove the GitHub icon entirely:

```javascript
return `
  <p class="blip-feedback-link">
    <a href="${githubUrl}" target="_blank" rel="noopener noreferrer">
      💬 Give us your feedback
    </a>
  </p>
`
```

### Custom Styling

Edit `src/stylesheets/_quadrantTables.scss`:

```scss
.blip-feedback-link {
  // Your custom styles
}
```

## Benefits

### For Users
- **Easy to contribute** - No need to fork or understand repo structure
- **Structured feedback** - Template guides them to provide useful information
- **Visible impact** - Can track their suggestion through to implementation

### For Maintainers
- **Organized feedback** - All in one place with consistent format
- **Context included** - Know exactly which skill and file needs updating
- **Trackable** - GitHub issues provide full history and discussion

## Troubleshooting

### Links not appearing

1. Check `feedback.config.js` has `enabled: true`
2. Verify JSON was rebuilt: `npm run build:data:md`
3. Check browser console for errors
4. Verify filename field exists in JSON

### Wrong repository URL

- Update `repoOwner` and `repoName` in `feedback.config.js`
- Rebuild and redeploy

### GitHub authentication required

- Make repository public, OR
- Ensure users are authenticated to GitHub before clicking link

## Example Feedback Issue

When a user clicks the link, they'll see:

**Title:** `Feedback: Running the kit locally`

**Body:**
```markdown
## Skill: Running the kit locally

**Ring:** Working
**Quadrant:** Run and maintain

**File:** [data/items-md/running-the-kit-locally.md](https://github.com/your-username/build-your-own-radar/blob/main/data/items-md/running-the-kit-locally.md)

---

### What needs improving?

<!-- Please describe your suggested improvement -->

- [ ] Description needs updating
- [ ] "Why is it important?" section needs work
- [ ] "Where to learn more" links need updating
- [ ] Ring placement is incorrect
- [ ] Other (please specify below)

### Your suggestion:

```

**Labels:** `skill-feedback`

## Future Enhancements

Possible improvements:
- Multiple feedback types (typo, outdated link, etc.)
- Voting on existing feedback
- Anonymous feedback option
- Email notifications for feedback
- Feedback analytics dashboard
