# Version Control for Builders: A Practical Beginner's Course

## Course Overview

**Who this is for:** Beginners who write code (or documents, or config files) and want a reliable way to track changes, collaborate with others, and undo mistakes without panic.

**How the course works:** Five modules. Every topic follows the same pattern:
- **Concept** - what it is, in plain language
- **Where you'd actually use this** - a real product scenario
- **Lab** - hands-on, runnable examples
- **Checkpoint**
- **Quiz** - five questions with answers

**Tools needed:** A terminal, [Git](https://git-scm.com/downloads) installed, and a free [GitHub](https://github.com) account.

---

## Module 0: Why Version Control Is Its Own Skill

### Concept

**Version control** is a system that records changes to a set of files over time, so you can recall specific versions later, see who changed what, and combine changes from multiple people without overwriting each other's work. Without it, teams end up with folders named `project_final.zip`, `project_final_v2.zip`, and `project_final_v2_ACTUALLY_FINAL.zip`, and nobody is fully sure which one is correct.

**Git** is the tool that does this tracking on your machine. **GitHub** is a website that hosts Git repositories online, so people can share and collaborate on them. Git works without GitHub, but GitHub needs Git underneath it.

### Where you'd actually use this

Any project with more than one contributor, or any solo project you want a safety net for. Version control turns "I hope I didn't break anything" into "I can see exactly what changed, and undo it if needed."

### Lab

Write down, from memory, one time (in any project you've worked on or heard about) where a file got overwritten, lost, or where two people's changes conflicted and caused a mess. You don't need to solve it, this module is about recognizing the problem this course solves.

### Checkpoint
You can explain, in one sentence each, what Git does and what GitHub adds on top of it.

### Quiz
1. What problem does version control solve that a folder of zip files does not?
2. What is the difference between Git and GitHub?
3. Can Git be used without GitHub?
4. Can GitHub be used without Git?
5. Is version control only useful for teams, or also for solo projects?

*Answers: 1) It tracks every change over time with a clear history, instead of relying on manually renamed copies that are easy to lose track of. 2) Git is the tool that tracks changes locally; GitHub is a website that hosts those tracked projects online for sharing and collaboration. 3) Yes, Git works entirely on your own machine without any hosting service. 4) No, GitHub is built on top of Git and requires it. 5) Both, a solo project benefits from the ability to undo mistakes and see history, even with no collaborators.*

---

## Module 1: Git - Tracking Changes Locally

### Concept

A Git **repository** (or "repo") is a folder that Git is tracking. Inside it, a **commit** is a saved snapshot of your files at a point in time, with a message describing what changed. Commits build a history you can look back through, compare, or revert to. The typical flow is: edit files, **stage** the ones you want to save (tell Git "include this in the next snapshot"), then **commit** them.

### Where you'd actually use this

Any time you want a checkpoint you can trust, before trying something risky, before ending a work session, or simply to record progress so you can explain later exactly what changed and why.

### Lab

1. **Set up Git and create a project:**
```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"

mkdir recipe-notes
cd recipe-notes
git init
```

2. **Create a file and check its status:**
```bash
echo "# Recipe Notes" > README.md
git status
```
Git shows `README.md` as untracked, it exists, but Git isn't saving snapshots of it yet.

3. **Stage and commit it:**
```bash
git add README.md
git commit -m "Add project README"
```

4. **Make a change and commit again:**
```bash
echo "## Pasta Carbonara" >> README.md
git add README.md
git commit -m "Add carbonara recipe heading"
```

5. **Look at your history:**
```bash
git log --oneline
```
Two commits, each a snapshot you can always come back to.

### Checkpoint
You have a local Git repository with at least two commits, and you can explain what `git add` does differently from `git commit`.

### Quiz
1. What does `git init` do?
2. What is the difference between staging a file and committing it?
3. What does `git status` show you?
4. What does a commit message describe?
5. If you never run `git add`, can `git commit` still save your changes?

*Answers: 1) It turns the current folder into a Git repository, starting change tracking. 2) Staging marks which changes will be included in the next snapshot; committing actually saves that snapshot with a message. 3) Which files are changed, staged, or untracked, so you know what will happen on your next commit. 4) What changed and why, so the history is understandable later, by you or anyone else. 5) No, only staged changes get included in a commit, unstaged changes are left out.*

---

## Module 2: GitHub - Sharing Your History Online

### Concept

A local Git repository lives only on your machine until you connect it to a **remote**, a copy of the repository hosted elsewhere, most commonly on GitHub. **Pushing** sends your local commits to the remote. **Pulling** brings down commits made by others (or by you, on a different machine) into your local copy.

### Where you'd actually use this

The moment your work needs to leave your laptop, to back it up, to share it with a teammate, or to let others contribute. GitHub is also where most open-source collaboration happens.

### Lab

1. **Create a repository on GitHub:**
- Go to [github.com](https://github.com), click "New repository"
- Name it `recipe-notes`, leave it empty (no README), and create it

2. **Connect your local repo to it:**
```bash
git remote add origin https://github.com/yourusername/recipe-notes.git
git branch -M main
git push -u origin main
```
Refresh the GitHub page, your commits and files are now there.

3. **Make a change and push it:**
```bash
echo "## Tomato Soup" >> README.md
git add README.md
git commit -m "Add tomato soup recipe heading"
git push
```

4. **Simulate a second machine.** Clone your own repository into a separate folder, as if you were a teammate:
```bash
cd ..
git clone https://github.com/yourusername/recipe-notes.git recipe-notes-copy
cd recipe-notes-copy
cat README.md
```
You now have an independent copy with the full history, downloaded from GitHub rather than typed by hand.

### Checkpoint
You have pushed commits from your machine to a real GitHub repository, and cloned that repository into a second folder successfully.

### Quiz
1. What is a "remote" in Git terms?
2. What does `git push` do?
3. What does `git clone` do, compared to `git init`?
4. If you commit locally but never push, does GitHub see the change?
5. Why is having your code on GitHub, not just your laptop, useful even for a solo project?

*Answers: 1) A copy of the repository hosted elsewhere, typically on a service like GitHub, that your local repository can send to or receive from. 2) It sends your local commits to the connected remote repository. 3) `git clone` downloads an existing repository, including its full history; `git init` starts a brand new, empty one. 4) No, GitHub only reflects what has actually been pushed to it. 5) It acts as a backup, and makes the work accessible from any machine, not just the one it was created on.*

---

## Module 3: Branches - Working Without Breaking Things

### Concept

A **branch** is an independent line of development. The default branch (usually `main`) typically holds working, trusted code. When you want to try something, a new feature, a fix, an experiment, you create a new branch, so `main` stays untouched while you work. Once the work is ready, it can be brought back into `main`.

### Where you'd actually use this

Any time more than one thing is happening at once: you're fixing a bug while a teammate adds a feature, or you want to try an idea without risking the version everyone else relies on.

### Lab

1. **Create and switch to a new branch:**
```bash
cd ../recipe-notes
git checkout -b add-dessert-section
```
`-b` creates the branch and switches to it in one step.

2. **Make changes on this branch only:**
```bash
echo "## Desserts" >> README.md
echo "### Tiramisu" >> README.md
git add README.md
git commit -m "Add desserts section with tiramisu"
```

3. **Compare branches:**
```bash
git checkout main
cat README.md
```
Notice the desserts section is missing here, it only exists on `add-dessert-section`. Switch back to confirm:
```bash
git checkout add-dessert-section
cat README.md
```

4. **Push the branch to GitHub:**
```bash
git push -u origin add-dessert-section
```
On GitHub, you can now see two branches: `main`, unchanged, and `add-dessert-section`, with your new work.

### Checkpoint
You created a branch, made commits only on it, and can show that `main` was unaffected until you decide otherwise.

### Quiz
1. What is a branch, in plain terms?
2. Why work on a branch instead of directly on `main`?
3. What does `git checkout -b <name>` do?
4. Do commits made on one branch automatically appear on another?
5. What happens to `main` while you work on a separate branch?

*Answers: 1) An independent line of development, letting you make changes without affecting other versions of the project. 2) It keeps the trusted, working version safe while you experiment or build something new. 3) It creates a new branch and switches to it in a single command. 4) No, each branch has its own independent history until changes are deliberately combined. 5) Nothing, it stays exactly as it was until the branch's work is merged into it.*

---

## Module 4: Pull Requests and Merge Conflicts - Combining Work

### Concept

A **pull request** (PR) is a request to merge one branch into another, typically into `main`, along with a space to discuss, review, and comment on the proposed changes before they're combined. It's the standard way collaborators (and reviewers) approve work before it becomes part of the shared codebase.

A **merge conflict** happens when Git cannot automatically combine two branches because they changed the same lines in different ways. Git pauses and asks a human to decide which version, or what combination, should be kept. Conflicts are a normal part of collaboration, not a sign something went wrong.

### Where you'd actually use this

Pull requests are how nearly all real-world software collaboration works, whether on an open-source project or a company codebase. Merge conflicts show up the moment two people edit the same part of the same file, which is common on any active project.

### Lab

1. **Open a pull request for the branch from Module 3.** On GitHub, go to your repository, you'll see a prompt to open a pull request for `add-dessert-section`. Click it, add a short description, and open the PR.

2. **Merge it:**
Click "Merge pull request" on GitHub, then confirm. Your desserts section is now part of `main`.

3. **Sync your local `main`:**
```bash
git checkout main
git pull
cat README.md
```
The desserts section now appears here too, `main` has caught up with the merged work.

4. **Create a real merge conflict on purpose.** Make two branches that edit the exact same line differently:
```bash
git checkout -b edit-title-a
sed -i '1s/.*/# My Favorite Recipes/' README.md
git add README.md
git commit -m "Rename title to My Favorite Recipes"
git push -u origin edit-title-a
git checkout main
```
```bash
git checkout -b edit-title-b
sed -i '1s/.*/# Kitchen Notebook/' README.md
git add README.md
git commit -m "Rename title to Kitchen Notebook"
git push -u origin edit-title-b
```

5. **Merge the first branch through GitHub as in step 2, then try merging the second locally:**
```bash
git checkout main
git pull
git merge edit-title-b
```
Git reports a conflict on the first line of `README.md`. Open the file, you'll see markers like this:
```
<<<<<<< HEAD
# My Favorite Recipes
=======
# Kitchen Notebook
>>>>>>> edit-title-b
```

6. **Resolve it.** Pick one version, or write a new one, then remove the conflict markers entirely:
```bash
# after editing README.md by hand to keep only one title line
git add README.md
git commit -m "Resolve title conflict, keep My Favorite Recipes"
git push
```

### Checkpoint
You opened and merged a real pull request on GitHub, then deliberately caused, and resolved, a merge conflict.

### Quiz
1. What is a pull request, and what problem does it solve?
2. What causes a merge conflict?
3. What do the `<<<<<<<`, `=======`, and `>>>>>>>` markers mean in a conflicted file?
4. After resolving a conflict by editing the file, what two Git commands finish the process?
5. Is a merge conflict a sign that something went wrong?

*Answers: 1) A request to merge one branch into another, with room for discussion and review before the changes are combined, it solves the problem of changes entering the shared codebase without anyone else seeing them first. 2) Two branches changing the same lines of the same file in different ways, leaving Git unable to decide automatically which version to keep. 3) They mark the start of your current branch's version, the divider between versions, and the end of the incoming branch's version, showing both conflicting pieces so a person can choose. 4) `git add` on the resolved file, then `git commit` to finish the merge. 5) No, it's a normal, expected part of collaborating on the same files, not an error.*

---

## Capstone: A Full Collaboration Workflow

Combine every module into one working process:

1. Your project is tracked locally with Git, one meaningful commit at a time (Module 1)
2. It's backed up and shared through a GitHub repository (Module 2)
3. New work happens on branches, never directly on `main` (Module 3)
4. Changes are proposed through pull requests, reviewed, and merged, with any conflicts resolved by hand (Module 4)
5. Make one real change end to end: create a branch, commit to it, push it, open a pull request, merge it, and pull the result back into your local `main`.

### Course completion checklist
- [ ] Initialized a Git repository and made multiple commits
- [ ] Explained the difference between staging and committing
- [ ] Connected a local repository to GitHub and pushed commits
- [ ] Cloned a repository from GitHub
- [ ] Created a branch and worked on it without affecting `main`
- [ ] Opened and merged a real pull request on GitHub
- [ ] Deliberately caused and resolved a merge conflict
- [ ] Completed one full change end to end: branch to commit to push to pull request to merge

Every piece of this course exists to answer one question, repeatedly and reliably: **can I track, share, and combine changes to this project with confidence, even when several people are touching it at once?**
