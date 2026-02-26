# BeyondZenith Website (GitHub Pages)

Minimal static one-page site for BeyondZenith.

## Structure
- `docs/index.html` — one-page website
- `docs/assets/styles.css` — styles

No framework, no build step.

## Local Preview
From repo root:

```bash
python3 -m http.server 8000
```

Then open: `http://localhost:8000/docs/`

## Deploy to GitHub Pages
After this branch is reviewed and merged to `main`:

1. Open repository on GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, choose:
   - **Source:** Deploy from a branch
   - **Branch:** `main`
   - **Folder:** `/docs`
4. Save.
5. Wait for Pages build to complete.
6. Site URL will appear in the Pages settings panel.

## Rollback / Escape Hatch
Fast rollback options:

- Revert latest website commit:
  ```bash
  git revert <commit_sha>
  ```
- Disable published site quickly:
  - Settings → Pages → set Source to **None** (or switch to a non-site branch/folder)
