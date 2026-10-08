<!-- order: 3 -->
# Version Control for Builders: A Practical Beginner's Course

## Course Overview

**By the end of this course, you'll be able to:**
- Explain what Git does and what GitHub adds on top of it
- Create a repository, stage and commit changes, read the history, and undo mistakes with `git restore` and `git revert`
- Push a local repository to GitHub and clone it onto another machine
- Use branches to work on a change without touching `main`
- Open and merge a pull request, and resolve a merge conflict by hand

**Who this is for:** Beginners who write code (or documents, or config files) and want a reliable way to track changes, collaborate with others, and undo mistakes without panic.

**How the course works:** Five modules. Every topic follows the same pattern:
- **Concept** - what it is, in plain language
- **Where you'd actually use this** - a real product scenario
- **Lab** - hands-on, runnable examples
- **Checkpoint**
- **Quiz** - five questions with answers

**Tools needed:** A terminal, [Git](https://git-scm.com/downloads) installed, and a free [GitHub](https://github.com) account. On Windows, run the commands in **Git Bash** (installed with Git), since some commands here (like `echo ... > README.md` and `cat`) behave differently in PowerShell.

---

## Module 0: Why Version Control Is Its Own Skill

**Time: about 1 hour**

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

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "git",
   "kicker": "Module 0 · Why version control",
   "title": "Never lose work again",
   "beats": [
    {
     "say": "Welcome to Version Control for Builders."
    },
    {
     "say": "Before any commands, let's look at the problem this course solves."
    }
   ]
  },
  {
   "kind": "list",
   "art": "mess",
   "kicker": "The problem",
   "title": "Sound familiar?",
   "items": [
    [
     "project_final.zip",
     ""
    ],
    [
     "project_final_v2.zip",
     ""
    ],
    [
     "project_final_v2_ACTUALLY_FINAL.zip",
     ""
    ]
   ],
   "crossed": true,
   "beats": [
    {
     "say": "Without version control, teams end up with folders like these.",
     "show": 0
    },
    {
     "say": "Project final dot zip.",
     "show": 1
    },
    {
     "say": "Project final v2 dot zip.",
     "show": 2
    },
    {
     "say": "Project final v2, actually final.",
     "show": 3
    },
    {
     "say": "And nobody is fully sure which one is correct.",
     "show": 3
    }
   ]
  },
  {
   "kind": "quote",
   "art": "git",
   "kicker": "Concept",
   "title": "What version control does",
   "quote": "Every change recorded. Any version recoverable. Nobody overwrites anybody.",
   "beats": [
    {
     "say": "Version control records every change to your files over time.",
     "show": 0
    },
    {
     "say": "So you can go back to any version, see who changed what, and combine work from several people without overwriting each other.",
     "show": 1
    }
   ]
  },
  {
   "kind": "list",
   "art": "cloud",
   "kicker": "Concept",
   "title": "Git and GitHub are different",
   "items": [
    [
     "Git",
     "Tracks changes on your computer"
    ],
    [
     "GitHub",
     "Hosts Git projects online to share"
    ]
   ],
   "beats": [
    {
     "say": "Two names you'll hear constantly.",
     "show": 0
    },
    {
     "say": "Git is the tool that tracks changes, on your own computer.",
     "show": 1
    },
    {
     "say": "GitHub is a website that hosts Git projects online, so people can share and work on them together.",
     "show": 2
    },
    {
     "say": "Git works without GitHub. But GitHub needs Git underneath it.",
     "show": 2
    }
   ]
  },
  {
   "kind": "quote",
   "art": "pencil",
   "kicker": "Lab",
   "title": "Remember when it went wrong",
   "quote": "When did a file get lost, overwritten, or tangled with someone else's changes?",
   "beats": [
    {
     "say": "Your lab is a reflection.",
     "show": 0
    },
    {
     "say": "Write down one time a file got overwritten or lost, or two people's changes clashed.",
     "show": 1
    },
    {
     "say": "You don't need to solve it. Just recognise the problem this course solves.",
     "show": 1
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Can GitHub be used without Git?",
   "options": [
    "Yes, GitHub works on its own",
    "No, GitHub is built on top of Git and needs it",
    "Only for private projects"
   ],
   "answer": 1,
   "good": "That's right. GitHub is built on top of Git, so it needs Git underneath.",
   "bad": "Not quite. GitHub is built on top of Git, so it needs Git underneath.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Can GitHub be used without Git?",
     "show": 0
    },
    {
     "say": "Tap your answer.",
     "show": 1
    }
   ]
  },
  {
   "kind": "list",
   "art": "proof",
   "kicker": "Checkpoint",
   "title": "You're done when",
   "items": [
    [
     "You can explain Git in one sentence",
     ""
    ],
    [
     "You can explain what GitHub adds",
     ""
    ]
   ],
   "beats": [
    {
     "say": "That's Module 0.",
     "show": 0
    },
    {
     "say": "You're done when:",
     "show": 0
    },
    {
     "say": "you can explain what Git does, in one sentence,",
     "show": 1
    },
    {
     "say": "and what GitHub adds on top of it.",
     "show": 2
    },
    {
     "say": "Next, in Module 1, you start tracking changes with Git.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Module 1: Git - Tracking Changes Locally

**Time: about 2 hours**

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

6. **Undo a change you haven't committed yet:**

```bash
echo "oops, this line is a mistake" >> README.md
git diff
git restore README.md
git diff
```

`git diff` shows what changed since your last commit (added lines start with `+`). `git restore` throws away the uncommitted changes to that file, so the second `git diff` shows nothing. Be careful: restored changes are gone for good.

7. **Undo a commit safely:**

```bash
echo "## Burnt Toast" >> README.md
git add README.md
git commit -m "Add a recipe I regret"
git revert --no-edit HEAD
git log --oneline
cat README.md
```

`HEAD` means "the latest commit". `git revert` doesn't delete that commit; it adds a *new* commit that reverses it. The history stays honest, and it's safe to do even after you've shared your work.

### Checkpoint
You have a local Git repository with several commits (including one revert), and you can explain what `git add` does differently from `git commit`.

### Quiz
1. What does `git init` do?
2. What is the difference between staging a file and committing it?
3. You committed a change and later realize it was wrong. Which command undoes it, and does it erase the old commit?
4. What does a commit message describe?
5. If you never run `git add`, can `git commit` still save your changes?

*Answers: 1) It turns the current folder into a Git repository, starting change tracking. 2) Staging marks which changes will be included in the next snapshot; committing actually saves that snapshot with a message. 3) `git revert`, which adds a new commit that reverses the old one; the old commit stays in the history. 4) What changed and why, so the history is understandable later, by you or anyone else. 5) No, only staged changes get included in a commit, unstaged changes are left out.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "git",
   "kicker": "Module 1 · Git",
   "title": "Tracking changes on your computer",
   "beats": [
    {
     "say": "Welcome to Module 1."
    },
    {
     "say": "Today you create a repository, save snapshots, and learn to undo mistakes."
    }
   ]
  },
  {
   "kind": "flow",
   "art": "git",
   "kicker": "Concept",
   "title": "Edit, stage, commit",
   "steps": [
    "Edit files",
    "git add (stage)",
    "git commit (save snapshot)"
   ],
   "beats": [
    {
     "say": "A repository is a folder Git is tracking. A commit is a saved snapshot of your files, with a message.",
     "show": 0
    },
    {
     "say": "The everyday rhythm has three steps.",
     "show": 0
    },
    {
     "say": "Edit your files.",
     "show": 1
    },
    {
     "say": "Stage the ones you want to save, with git add. That means: include this in the next snapshot.",
     "show": 2
    },
    {
     "say": "Then commit, which saves the snapshot with a message describing what changed.",
     "show": 3
    }
   ]
  },
  {
   "kind": "code",
   "art": "terminal",
   "kicker": "Lab · Steps 1 to 3",
   "title": "Your first repository",
   "file": "Terminal",
   "code": "mkdir recipe-notes\ncd recipe-notes\ngit init\n\necho \"# Recipe Notes\" > README.md\ngit status\ngit add README.md\ngit commit -m \"Add project README\"",
   "beats": [
    {
     "say": "Set your name and email once, make a folder called recipe notes, and run git init to start tracking it.",
     "show": 0
    },
    {
     "say": "Create a README, and git status shows it as untracked. It exists, but Git isn't saving it yet.",
     "show": 1
    },
    {
     "say": "Git add stages it, and git commit saves your first snapshot.",
     "show": 1
    }
   ]
  },
  {
   "kind": "big",
   "art": "git",
   "kicker": "Lab · Steps 4 and 5",
   "title": "Read your history",
   "big": "2 commits",
   "sub": "git log --oneline",
   "beats": [
    {
     "say": "Add a carbonara heading and commit again.",
     "show": 0
    },
    {
     "say": "Now git log, dash dash oneline, shows your history.",
     "show": 1
    },
    {
     "say": "Two commits, two snapshots you can always come back to.",
     "show": 2
    }
   ]
  },
  {
   "kind": "code",
   "art": "warning",
   "kicker": "Lab · Step 6",
   "title": "Undo a change you haven't committed",
   "file": "Terminal",
   "code": "echo \"oops, this line is a mistake\" >> README.md\ngit diff\ngit restore README.md\ngit diff        # shows nothing now",
   "beats": [
    {
     "say": "Now, mistakes. Add a line you didn't mean to.",
     "show": 0
    },
    {
     "say": "Git diff shows what changed since your last commit. Added lines start with a plus.",
     "show": 1
    },
    {
     "say": "Git restore throws that change away. Be careful: restored changes are gone for good.",
     "show": 1
    }
   ]
  },
  {
   "kind": "code",
   "art": "loop",
   "kicker": "Lab · Step 7",
   "title": "Undo a commit safely",
   "file": "Terminal",
   "code": "git commit -m \"Add a recipe I regret\"\ngit revert --no-edit HEAD\ngit log --oneline",
   "beats": [
    {
     "say": "What if you already committed the mistake?",
     "show": 0
    },
    {
     "say": "Git revert HEAD undoes the latest commit. HEAD means the latest commit.",
     "show": 1
    },
    {
     "say": "It doesn't delete anything. It adds a new commit that reverses the old one.",
     "show": 1
    },
    {
     "say": "So your history stays honest, and it's safe even after you've shared your work.",
     "show": 1
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "What's the difference between staging and committing?",
   "options": [
    "They're the same thing",
    "Staging picks what goes in the next snapshot; committing saves it with a message",
    "Committing picks files; staging uploads them"
   ],
   "answer": 1,
   "good": "That's right. Staging marks what goes into the next snapshot, and committing actually saves it with a message.",
   "bad": "Not quite. Staging marks what goes into the next snapshot, and committing actually saves it with a message.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "What's the difference between staging and committing?",
     "show": 0
    },
    {
     "say": "Tap your answer.",
     "show": 1
    }
   ]
  },
  {
   "kind": "list",
   "art": "proof",
   "kicker": "Checkpoint",
   "title": "You're done when",
   "items": [
    [
     "Several commits, including one revert",
     ""
    ],
    [
     "You can explain git add vs git commit",
     ""
    ]
   ],
   "beats": [
    {
     "say": "That's Module 1.",
     "show": 0
    },
    {
     "say": "You're done when:",
     "show": 0
    },
    {
     "say": "you have a repository with several commits, including one revert,",
     "show": 1
    },
    {
     "say": "and you can explain what git add does differently from git commit.",
     "show": 2
    },
    {
     "say": "Next, in Module 2, you share your work on GitHub.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Module 2: GitHub - Sharing Your History Online

**Time: about 1 hour**

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

GitHub does not accept your account password when you push over HTTPS. The first time you push, either sign in through the browser window that opens (Git Credential Manager, included with Git for Windows and GitHub Desktop), or install the [GitHub CLI](https://cli.github.com) and run `gh auth login` once before pushing, or create a personal access token on GitHub (Settings > Developer settings) and paste it when Git asks for a password.

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

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "cloud",
   "kicker": "Module 2 · GitHub",
   "title": "Share your history online",
   "beats": [
    {
     "say": "Welcome to Module 2."
    },
    {
     "say": "Right now your repository only lives on your computer. Let's change that."
    }
   ]
  },
  {
   "kind": "list",
   "art": "cloud",
   "kicker": "Concept",
   "title": "Remote, push, pull",
   "items": [
    [
     "Remote",
     "A copy hosted elsewhere, like GitHub"
    ],
    [
     "Push",
     "Send your commits up"
    ],
    [
     "Pull",
     "Bring others' commits down"
    ]
   ],
   "beats": [
    {
     "say": "Three words.",
     "show": 0
    },
    {
     "say": "A remote is a copy of your repository hosted somewhere else, usually GitHub.",
     "show": 1
    },
    {
     "say": "Push sends your commits up to the remote.",
     "show": 2
    },
    {
     "say": "Pull brings down commits made by others, or by you on another computer.",
     "show": 3
    }
   ]
  },
  {
   "kind": "code",
   "art": "cloud",
   "kicker": "Lab · Steps 1 and 2",
   "title": "Connect and push",
   "file": "Terminal",
   "code": "git remote add origin https://github.com/yourusername/recipe-notes.git\ngit branch -M main\ngit push -u origin main",
   "beats": [
    {
     "say": "On github dot com, create an empty repository called recipe notes.",
     "show": 0
    },
    {
     "say": "Then connect your folder to it with git remote add origin, and push your main branch.",
     "show": 1
    },
    {
     "say": "GitHub won't take your account password here. Sign in through the browser window, the GitHub CLI, or a personal access token.",
     "show": 1
    },
    {
     "say": "Refresh the page, and your commits are there.",
     "show": 1
    }
   ]
  },
  {
   "kind": "flow",
   "art": "cloud",
   "kicker": "Lab · Step 3",
   "title": "The everyday loop",
   "steps": [
    "Edit",
    "git add",
    "git commit",
    "git push"
   ],
   "beats": [
    {
     "say": "From now on, every change follows the same loop.",
     "show": 0
    },
    {
     "say": "Edit.",
     "show": 1
    },
    {
     "say": "Add.",
     "show": 2
    },
    {
     "say": "Commit.",
     "show": 3
    },
    {
     "say": "Push.",
     "show": 4
    }
   ]
  },
  {
   "kind": "code",
   "art": "laptop",
   "kicker": "Lab · Step 4",
   "title": "Pretend to be a teammate",
   "file": "Terminal",
   "code": "cd ..\ngit clone https://github.com/yourusername/recipe-notes.git recipe-notes-copy\ncd recipe-notes-copy\ncat README.md",
   "beats": [
    {
     "say": "Now pretend you're a teammate on another computer.",
     "show": 0
    },
    {
     "say": "Git clone downloads the whole repository from GitHub, with its full history, into a new folder.",
     "show": 1
    },
    {
     "say": "That's different from git init, which starts a brand new, empty one.",
     "show": 1
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "If you commit but never push, does GitHub see the change?",
   "options": [
    "Yes, GitHub syncs automatically",
    "No, GitHub only shows what you've pushed",
    "Only after an hour"
   ],
   "answer": 1,
   "good": "That's right. GitHub only reflects what has actually been pushed to it.",
   "bad": "Not quite. GitHub only reflects what has actually been pushed to it.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "If you commit but never push, does GitHub see the change?",
     "show": 0
    },
    {
     "say": "Tap your answer.",
     "show": 1
    }
   ]
  },
  {
   "kind": "list",
   "art": "proof",
   "kicker": "Checkpoint",
   "title": "You're done when",
   "items": [
    [
     "You pushed commits to GitHub",
     ""
    ],
    [
     "You cloned it into a second folder",
     ""
    ]
   ],
   "beats": [
    {
     "say": "That's Module 2.",
     "show": 0
    },
    {
     "say": "You're done when:",
     "show": 0
    },
    {
     "say": "you've pushed commits to a real GitHub repository,",
     "show": 1
    },
    {
     "say": "and cloned it into a second folder.",
     "show": 2
    },
    {
     "say": "Next, in Module 3, you work safely on branches.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Module 3: Branches - Working Without Breaking Things

**Time: about 1 hour**

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

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "git",
   "kicker": "Module 3 · Branches",
   "title": "Work without breaking things",
   "beats": [
    {
     "say": "Welcome to Module 3."
    },
    {
     "say": "A branch is an independent line of work."
    },
    {
     "say": "Main holds the trusted version. You try new things on a branch, so main stays safe."
    }
   ]
  },
  {
   "kind": "list",
   "art": "people",
   "kicker": "Where you'd use this",
   "title": "When more than one thing is happening",
   "items": [
    [
     "Fix a bug while someone else builds a feature",
     ""
    ],
    [
     "Try an idea without risking main",
     ""
    ]
   ],
   "beats": [
    {
     "say": "Branches matter whenever more than one thing is happening at once.",
     "show": 0
    },
    {
     "say": "You're fixing a bug while a teammate adds a feature,",
     "show": 1
    },
    {
     "say": "or you want to try an idea without risking the version everyone relies on.",
     "show": 2
    }
   ]
  },
  {
   "kind": "code",
   "art": "git",
   "kicker": "Lab · Steps 1 and 2",
   "title": "Make a branch and commit on it",
   "file": "Terminal",
   "code": "git checkout -b add-dessert-section\n\necho \"## Desserts\" >> README.md\necho \"### Tiramisu\" >> README.md\ngit add README.md\ngit commit -m \"Add desserts section with tiramisu\"",
   "beats": [
    {
     "say": "Git checkout dash b creates a branch called add dessert section, and switches to it.",
     "show": 0
    },
    {
     "say": "Add a desserts section with tiramisu, and commit it.",
     "show": 1
    },
    {
     "say": "That commit exists only on this branch.",
     "show": 1
    }
   ]
  },
  {
   "kind": "flow",
   "art": "git",
   "kicker": "Lab · Step 3",
   "title": "Prove main is untouched",
   "steps": [
    "main: no desserts",
    "add-dessert-section: desserts"
   ],
   "beats": [
    {
     "say": "Now check.",
     "show": 0
    },
    {
     "say": "Switch to main and look at the README. No desserts.",
     "show": 1
    },
    {
     "say": "Switch back to your branch. Desserts are there.",
     "show": 2
    },
    {
     "say": "Each branch keeps its own history until you deliberately combine them.",
     "show": 2
    }
   ]
  },
  {
   "kind": "code",
   "art": "cloud",
   "kicker": "Lab · Step 4",
   "title": "Push the branch",
   "file": "Terminal",
   "code": "git push -u origin add-dessert-section",
   "beats": [
    {
     "say": "Finally, push the branch to GitHub.",
     "show": 0
    },
    {
     "say": "On GitHub you'll now see two branches: main, unchanged, and your new branch with the dessert work.",
     "show": 1
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Do commits on one branch automatically appear on another?",
   "options": [
    "Yes, all branches share commits",
    "No, each branch has its own history until you combine them",
    "Only on GitHub"
   ],
   "answer": 1,
   "good": "That's right. Each branch keeps its own history until the changes are deliberately combined.",
   "bad": "Not quite. Each branch keeps its own history until the changes are deliberately combined.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Do commits on one branch automatically appear on another?",
     "show": 0
    },
    {
     "say": "Tap your answer.",
     "show": 1
    }
   ]
  },
  {
   "kind": "list",
   "art": "proof",
   "kicker": "Checkpoint",
   "title": "You're done when",
   "items": [
    [
     "You committed on a branch",
     ""
    ],
    [
     "You can show main wasn't affected",
     ""
    ]
   ],
   "beats": [
    {
     "say": "That's Module 3.",
     "show": 0
    },
    {
     "say": "You're done when:",
     "show": 0
    },
    {
     "say": "you've made a branch and committed only on it,",
     "show": 1
    },
    {
     "say": "and you can show that main wasn't affected.",
     "show": 2
    },
    {
     "say": "Next, in the last module, you combine work with pull requests.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Module 4: Pull Requests and Merge Conflicts - Combining Work

**Time: about 2 hours**

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

4. **Create a real merge conflict on purpose.** Make two branches that edit the exact same line differently. First create the branch:

```bash
git checkout -b edit-title-a
```

Open `README.md` in your editor, replace line 1 with `# My Favorite Recipes`, and save. Then commit and push:

```bash
git add README.md
git commit -m "Rename title to My Favorite Recipes"
git push -u origin edit-title-a
git checkout main
```

Now make the second branch from `main`:

```bash
git checkout -b edit-title-b
```

Open `README.md` again, replace line 1 with `# Kitchen Notebook`, and save. Then:

```bash
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

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "merge",
   "kicker": "Module 4 · Pull requests and merge conflicts",
   "title": "Combine work safely",
   "beats": [
    {
     "say": "Welcome to the last module."
    },
    {
     "say": "Today you bring branches back together, the way real teams do."
    }
   ]
  },
  {
   "kind": "list",
   "art": "merge",
   "kicker": "Concept",
   "title": "Two ideas",
   "items": [
    [
     "Pull request",
     "Propose, discuss, then merge"
    ],
    [
     "Merge conflict",
     "Same lines changed two ways. You decide."
    ]
   ],
   "beats": [
    {
     "say": "A pull request is a request to merge one branch into another, usually main,",
     "show": 1
    },
    {
     "say": "with space to discuss and review the change before it's combined.",
     "show": 1
    },
    {
     "say": "A merge conflict happens when two branches change the same lines in different ways.",
     "show": 2
    },
    {
     "say": "Git can't decide which to keep, so it asks you. That's normal, not a sign something went wrong.",
     "show": 2
    }
   ]
  },
  {
   "kind": "flow",
   "art": "cloud",
   "kicker": "Lab · Steps 1 to 3",
   "title": "Your first pull request",
   "steps": [
    "Open the pull request",
    "Merge on GitHub",
    "git checkout main, git pull",
    "Desserts in main"
   ],
   "beats": [
    {
     "say": "On GitHub, open a pull request for your dessert branch, with a short description.",
     "show": 1
    },
    {
     "say": "Click merge pull request.",
     "show": 2
    },
    {
     "say": "Then on your computer, switch to main and git pull.",
     "show": 3
    },
    {
     "say": "The desserts section is now in main.",
     "show": 4
    }
   ]
  },
  {
   "kind": "flow",
   "art": "warning",
   "kicker": "Lab · Steps 4 and 5",
   "title": "Cause a conflict on purpose",
   "steps": [
    "Branch A: My Favorite Recipes",
    "Branch B: Kitchen Notebook",
    "Merge both",
    "Conflict!"
   ],
   "beats": [
    {
     "say": "Now, make a conflict on purpose.",
     "show": 0
    },
    {
     "say": "On one branch, change the title to My Favorite Recipes.",
     "show": 1
    },
    {
     "say": "On a second branch, change the same line to Kitchen Notebook.",
     "show": 2
    },
    {
     "say": "Merge the first through GitHub, then merge the second on your computer.",
     "show": 3
    },
    {
     "say": "Git reports a conflict on line one.",
     "show": 4
    }
   ]
  },
  {
   "kind": "code",
   "art": "merge",
   "kicker": "Lab · Reading the markers",
   "title": "What a conflict looks like",
   "file": "README.md",
   "code": "<<<<<<< HEAD\n# My Favorite Recipes\n=======\n# Kitchen Notebook\n>>>>>>> edit-title-b",
   "beats": [
    {
     "say": "Open the file, and you'll see markers.",
     "show": 0
    },
    {
     "say": "Everything between the arrows pointing left and the equals signs is your current version.",
     "show": 1
    },
    {
     "say": "Between the equals signs and the arrows pointing right is the incoming one.",
     "show": 1
    },
    {
     "say": "Keep one version, or write a new one, and delete all the markers.",
     "show": 1
    }
   ]
  },
  {
   "kind": "code",
   "art": "proof",
   "kicker": "Lab · Step 6",
   "title": "Finish the merge",
   "file": "Terminal",
   "code": "git add README.md\ngit commit -m \"Resolve title conflict, keep My Favorite Recipes\"\ngit push",
   "beats": [
    {
     "say": "Once the file looks right, finish with two commands.",
     "show": 0
    },
    {
     "say": "Git add the resolved file, then git commit. Then push.",
     "show": 1
    },
    {
     "say": "That's it. You've resolved your first merge conflict.",
     "show": 1
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Is a merge conflict a sign that something went wrong?",
   "options": [
    "Yes, someone made a mistake",
    "No, it's a normal part of working on the same files",
    "Only if it happens on main"
   ],
   "answer": 1,
   "good": "That's right. Merge conflicts are a normal, expected part of collaborating on the same files.",
   "bad": "Not quite. Merge conflicts are a normal, expected part of collaborating on the same files.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Is a merge conflict a sign that something went wrong?",
     "show": 0
    },
    {
     "say": "Tap your answer.",
     "show": 1
    }
   ]
  },
  {
   "kind": "list",
   "art": "proof",
   "kicker": "Checkpoint",
   "title": "You're done when",
   "items": [
    [
     "You merged a real pull request",
     ""
    ],
    [
     "You caused and resolved a merge conflict",
     ""
    ]
   ],
   "beats": [
    {
     "say": "That's the final module.",
     "show": 0
    },
    {
     "say": "You're done when:",
     "show": 0
    },
    {
     "say": "you've opened and merged a real pull request,",
     "show": 1
    },
    {
     "say": "and caused, and resolved, a merge conflict.",
     "show": 2
    },
    {
     "say": "You've finished Version Control for Builders. Well done.",
     "show": 2
    }
   ]
  }
 ]
}
```
