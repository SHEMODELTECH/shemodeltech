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
   "kind": "array",
   "kicker": "The problem",
   "title": "Which one is correct?",
   "values": [
    "project_final.zip",
    "project_final_v2.zip",
    "project_final_v2_ACTUALLY_FINAL.zip"
   ],
   "beats": [
    {
     "say": "Without version control, a project folder ends up looking like this."
    },
    {
     "say": "Project final dot zip.",
     "hl": 0
    },
    {
     "say": "Then project final v2, because something changed.",
     "hl": 1
    },
    {
     "say": "Then project final v2, actually final.",
     "hl": 2
    },
    {
     "say": "Which one is correct? What changed between them, and who changed it? Nobody is fully sure.",
     "hl": [
      0,
      1,
      2
     ],
     "note": "no history, no messages, no author"
    },
    {
     "say": "With version control, the same work becomes one folder with a clear list of changes, each with a message.",
     "vals": [
      "Add project README",
      "Add carbonara recipe heading",
      "Add tomato soup recipe heading"
     ],
     "ok": [
      0,
      1,
      2
     ],
     "note": "one folder, every change recorded"
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Concept",
   "title": "Zip copies versus version control",
   "columns": [
    "Question",
    "Folder of zips",
    "Version control"
   ],
   "rows": [
    [
     "Which version is latest?",
     "Guess from the name",
     "The newest commit"
    ],
    [
     "What changed?",
     "Open both and compare",
     "Shown line by line"
    ],
    [
     "Who changed it, and why?",
     "Unknown",
     "Name and message saved"
    ],
    [
     "Undo one mistake?",
     "Pick an old zip, lose newer work",
     "Reverse just that change"
    ],
    [
     "Two people editing?",
     "Someone overwrites someone",
     "Changes are combined"
    ]
   ],
   "beats": [
    {
     "say": "Version control records every change to your files over time. Here's what that buys you.",
     "col": 0
    },
    {
     "say": "Which version is the latest? With zips, you guess from the file name. With version control, it's simply the newest snapshot.",
     "hl": 0
    },
    {
     "say": "What changed? Version control shows you, line by line.",
     "hl": 1
    },
    {
     "say": "Who changed it, and why? Every change is saved with a name and a message.",
     "hl": 2
    },
    {
     "say": "Undo one mistake? You can reverse just that change, and keep all the newer work.",
     "hl": 3
    },
    {
     "say": "And when two people edit, their changes are combined, instead of one overwriting the other.",
     "hl": 4,
     "col": 2
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Concept",
   "title": "Git and GitHub are different",
   "nodes": [
    {
     "id": "me",
     "label": "Your computer",
     "x": 14,
     "y": 50,
     "sub": "Git tracks changes here",
     "art": "laptop"
    },
    {
     "id": "gh",
     "label": "GitHub",
     "x": 50,
     "y": 22,
     "sub": "hosts the project online",
     "art": "cloud"
    },
    {
     "id": "mate",
     "label": "Teammate's computer",
     "x": 86,
     "y": 50,
     "sub": "Git here too",
     "art": "laptop"
    }
   ],
   "edges": [
    {
     "from": "me",
     "to": "gh"
    },
    {
     "from": "gh",
     "to": "mate"
    }
   ],
   "beats": [
    {
     "say": "Git is the tool that tracks changes, right on your own computer.",
     "show": 1,
     "on": "me"
    },
    {
     "say": "It works completely on its own. No website, no internet needed.",
     "show": 1,
     "on": "me"
    },
    {
     "say": "GitHub is a website that hosts Git projects online.",
     "show": 2,
     "on": "gh",
     "send": {
      "from": "me",
      "to": "gh",
      "label": "your history"
     }
    },
    {
     "say": "So a teammate can get the same project, with its full history, on their computer.",
     "show": 3,
     "on": "mate",
     "send": {
      "from": "gh",
      "to": "mate",
      "label": "same history"
     }
    },
    {
     "say": "Notice Git is at both ends. GitHub is built on top of Git, and needs it underneath.",
     "show": 3,
     "on": [
      "me",
      "mate"
     ]
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
   "kind": "diagram",
   "kicker": "Concept",
   "title": "Edit, stage, commit",
   "nodes": [
    {
     "id": "work",
     "label": "Your folder",
     "x": 14,
     "y": 50,
     "sub": "files you edit",
     "art": "file"
    },
    {
     "id": "stage",
     "label": "Staging area",
     "x": 50,
     "y": 50,
     "sub": "the next snapshot",
     "art": "boxes"
    },
    {
     "id": "hist",
     "label": "History",
     "x": 86,
     "y": 50,
     "sub": "saved commits",
     "art": "layers"
    }
   ],
   "edges": [
    {
     "from": "work",
     "to": "stage"
    },
    {
     "from": "stage",
     "to": "hist"
    }
   ],
   "beats": [
    {
     "say": "A repository is a folder Git is tracking. Changes move through three places.",
     "show": 3
    },
    {
     "say": "First, you edit files in your folder, like the README.",
     "on": "work"
    },
    {
     "say": "Git add stages a change. That means: include this in the next snapshot.",
     "on": "stage",
     "send": {
      "from": "work",
      "to": "stage",
      "label": "git add README.md"
     }
    },
    {
     "say": "Git commit saves everything staged as a snapshot, with a message. That's a commit.",
     "on": "hist",
     "send": {
      "from": "stage",
      "to": "hist",
      "label": "git commit -m \"Add project README\""
     }
    },
    {
     "say": "Anything you never staged stays behind in your folder, and isn't in the commit.",
     "on": "work"
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Steps 1 to 3",
   "title": "Your first repository",
   "file": "Terminal",
   "code": "git config --global user.name \"Your Name\"\ngit config --global user.email \"you@example.com\"\nmkdir recipe-notes\ncd recipe-notes\ngit init\necho \"# Recipe Notes\" > README.md\ngit status\ngit add README.md\ngit commit -m \"Add project README\"",
   "beats": [
    {
     "say": "Tell Git your name and email once. They're stamped on every commit you make.",
     "line": [
      1,
      2
     ]
    },
    {
     "say": "Make a folder called recipe notes, and step inside it.",
     "line": [
      3,
      4
     ]
    },
    {
     "say": "Git init turns this folder into a repository. Tracking starts now.",
     "line": 5,
     "out": "Initialized empty Git repository in .../recipe-notes/.git/",
     "vars": {
      "commits": 0
     }
    },
    {
     "say": "Echo writes a heading into a new file called README.",
     "line": 6,
     "vars": {
      "README.md": "untracked",
      "commits": 0
     }
    },
    {
     "say": "Git status reports it as untracked. The file exists, but Git isn't saving it yet.",
     "line": 7,
     "out": [
      "Untracked files:",
      "        README.md"
     ]
    },
    {
     "say": "Git add stages it, ready for the next snapshot.",
     "line": 8,
     "vars": {
      "README.md": "staged"
     }
    },
    {
     "say": "Git commit saves the snapshot with your message. One commit in the history.",
     "line": 9,
     "vars": {
      "README.md": "committed",
      "commits": 1
     },
     "out": " 1 file changed, 1 insertion(+)"
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Lab · Steps 3 and 4",
   "title": "Reading git status",
   "columns": [
    "After you...",
    "git status says",
    "Meaning"
   ],
   "rows": [
    [
     "create README.md",
     "Untracked files: README.md",
     "Git sees it, isn't saving it"
    ],
    [
     "git add README.md",
     "Changes to be committed: new file: README.md",
     "Staged for the next commit"
    ],
    [
     "git commit",
     "nothing to commit, working tree clean",
     "Saved. Nothing new"
    ],
    [
     "append Pasta Carbonara",
     "Changes not staged for commit: modified: README.md",
     "Changed, not staged yet"
    ],
    [
     "git add, then git commit",
     "nothing to commit, working tree clean",
     "Two commits now"
    ]
   ],
   "beats": [
    {
     "say": "Git status is the command you'll run most. It tells you where every file stands.",
     "col": 1
    },
    {
     "say": "A brand new file is untracked.",
     "hl": 0
    },
    {
     "say": "After git add, it's listed under changes to be committed.",
     "hl": 1
    },
    {
     "say": "After the commit, there's nothing left to commit. The working tree is clean.",
     "hl": 2
    },
    {
     "say": "Now step four: append a carbonara heading. Git spots the change, but it isn't staged.",
     "hl": 3
    },
    {
     "say": "Add and commit again, and you're clean once more, with two commits in the history.",
     "hl": 4,
     "dim": true,
     "col": 2
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Step 6",
   "title": "Undo a change you haven't committed",
   "file": "Terminal",
   "code": "echo \"oops, this line is a mistake\" >> README.md\ngit diff\ngit restore README.md\ngit diff",
   "beats": [
    {
     "say": "Your README has two committed lines. Now add a line you didn't mean to.",
     "line": 1,
     "vars": {
      "README.md": "3 lines, 1 uncommitted"
     }
    },
    {
     "say": "Git diff shows what changed since your last commit. The added line starts with a plus.",
     "line": 2,
     "out": [
      " # Recipe Notes",
      " ## Pasta Carbonara",
      "+oops, this line is a mistake"
     ]
    },
    {
     "say": "Git restore throws the uncommitted change away. The file goes back to the last commit.",
     "line": 3,
     "vars": {
      "README.md": "2 lines, matches last commit"
     }
    },
    {
     "say": "So the second git diff shows nothing at all.",
     "line": 4,
     "out": "(no output)"
    },
    {
     "say": "Be careful: restored changes are gone for good. Git never saved them.",
     "line": 3
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Step 7",
   "title": "Undo a commit safely",
   "file": "Terminal",
   "code": "echo \"## Burnt Toast\" >> README.md\ngit add README.md\ngit commit -m \"Add a recipe I regret\"\ngit revert --no-edit HEAD\ngit log --oneline\ncat README.md",
   "beats": [
    {
     "say": "What if you already committed the mistake? Add a burnt toast heading, stage it, and commit.",
     "line": [
      1,
      3
     ],
     "vars": {
      "commits": 3,
      "README.md": "3 lines"
     }
    },
    {
     "say": "Git revert HEAD undoes the latest commit. HEAD just means the latest commit.",
     "line": 4,
     "out": "[...] Revert \"Add a recipe I regret\"",
     "vars": {
      "commits": 4,
      "README.md": "2 lines"
     }
    },
    {
     "say": "Git log, dash dash oneline, lists the history, newest first.",
     "line": 5,
     "out": [
      "a9e5aa0 Revert \"Add a recipe I regret\"",
      "4009602 Add a recipe I regret",
      "13014be Add carbonara recipe heading",
      "cb7d486 Add project README"
     ]
    },
    {
     "say": "Four commits. The regretted one is still there, with a new commit on top that reverses it.",
     "line": 5
    },
    {
     "say": "And the file itself is back to two lines. No burnt toast.",
     "line": 6,
     "out": [
      "# Recipe Notes",
      "## Pasta Carbonara"
     ]
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Concept",
   "title": "revert adds, it never deletes",
   "nodes": [
    {
     "id": "c1",
     "label": "cb7d486",
     "x": 12,
     "y": 50,
     "sub": "Add project README",
     "art": "doc"
    },
    {
     "id": "c2",
     "label": "13014be",
     "x": 37,
     "y": 50,
     "sub": "Add carbonara heading",
     "art": "doc"
    },
    {
     "id": "c3",
     "label": "4009602",
     "x": 62,
     "y": 50,
     "sub": "Add a recipe I regret",
     "art": "bug"
    },
    {
     "id": "c4",
     "label": "a9e5aa0",
     "x": 87,
     "y": 50,
     "sub": "Revert the regret · HEAD",
     "art": "loop"
    }
   ],
   "edges": [
    {
     "from": "c1",
     "to": "c2"
    },
    {
     "from": "c2",
     "to": "c3"
    },
    {
     "from": "c3",
     "to": "c4"
    }
   ],
   "beats": [
    {
     "say": "Here's that history as a chain. Each commit builds on the one before.",
     "show": 2,
     "on": [
      "c1",
      "c2"
     ]
    },
    {
     "say": "Then the commit you regret joins the chain.",
     "show": 3,
     "on": "c3",
     "send": {
      "from": "c2",
      "to": "c3",
      "label": "+ ## Burnt Toast"
     }
    },
    {
     "say": "Revert doesn't cut it out. It adds a new commit that removes that line again.",
     "show": 4,
     "on": "c4",
     "send": {
      "from": "c3",
      "to": "c4",
      "label": "- ## Burnt Toast"
     }
    },
    {
     "say": "The history stays honest, so revert is safe even after you've shared your work.",
     "show": 4,
     "on": [
      "c3",
      "c4"
     ]
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
   "kind": "diagram",
   "kicker": "Concept",
   "title": "Remote, push, pull",
   "nodes": [
    {
     "id": "me",
     "label": "recipe-notes",
     "x": 14,
     "y": 70,
     "sub": "your computer",
     "art": "laptop"
    },
    {
     "id": "gh",
     "label": "origin",
     "x": 50,
     "y": 22,
     "sub": "GitHub: the remote",
     "art": "cloud"
    },
    {
     "id": "copy",
     "label": "recipe-notes-copy",
     "x": 86,
     "y": 70,
     "sub": "another computer",
     "art": "laptop"
    }
   ],
   "edges": [
    {
     "from": "me",
     "to": "gh"
    },
    {
     "from": "gh",
     "to": "copy"
    }
   ],
   "beats": [
    {
     "say": "A remote is a copy of your repository hosted somewhere else, usually GitHub. By habit, it's called origin.",
     "show": 2,
     "on": "gh"
    },
    {
     "say": "Push sends your local commits up to the remote.",
     "show": 2,
     "on": "gh",
     "send": {
      "from": "me",
      "to": "gh",
      "label": "git push"
     }
    },
    {
     "say": "On another computer, clone downloads the whole repository, history and all.",
     "show": 3,
     "on": "copy",
     "send": {
      "from": "gh",
      "to": "copy",
      "label": "git clone"
     }
    },
    {
     "say": "And pull brings down new commits that someone else pushed.",
     "show": 3,
     "on": "me",
     "send": {
      "from": "gh",
      "to": "me",
      "label": "git pull"
     }
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Steps 1 and 2",
   "title": "Connect and push",
   "file": "Terminal",
   "code": "git remote add origin https://github.com/yourusername/recipe-notes.git\ngit branch -M main\ngit push -u origin main",
   "beats": [
    {
     "say": "On github dot com, create an empty repository called recipe notes. No README.",
     "line": 1
    },
    {
     "say": "Git remote add saves its address under the name origin.",
     "line": 1,
     "vars": {
      "origin": "github.com/yourusername/recipe-notes"
     }
    },
    {
     "say": "Git branch, dash capital M, main, names your branch main.",
     "line": 2,
     "vars": {
      "branch": "main"
     }
    },
    {
     "say": "Git push, dash u, origin main, sends your four commits up, and links your main to GitHub's.",
     "line": 3,
     "out": [
      "To https://github.com/yourusername/recipe-notes.git",
      " * [new branch]      main -> main",
      "branch 'main' set up to track 'origin/main'."
     ],
     "vars": {
      "on laptop": "4 commits",
      "on GitHub": "4 commits"
     }
    },
    {
     "say": "GitHub won't take your account password here. Sign in through the browser window, the GitHub C L I, or a personal access token.",
     "line": 3
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Step 3",
   "title": "The everyday loop: edit, add, commit, push",
   "file": "Terminal",
   "code": "echo \"## Tomato Soup\" >> README.md\ngit add README.md\ngit commit -m \"Add tomato soup recipe heading\"\ngit status\ngit push\ngit status",
   "beats": [
    {
     "say": "From now on, every change follows one loop. Edit the README.",
     "line": 1,
     "vars": {
      "on laptop": "4 commits",
      "on GitHub": "4 commits"
     }
    },
    {
     "say": "Add it, and commit it. Your computer now has five commits.",
     "line": [
      2,
      3
     ],
     "vars": {
      "on laptop": "5 commits"
     }
    },
    {
     "say": "Git status notices that GitHub is behind.",
     "line": 4,
     "out": "Your branch is ahead of 'origin/main' by 1 commit."
    },
    {
     "say": "Git push sends the new commit up.",
     "line": 5,
     "out": "   a9e5aa0..bec8c9e  main -> main",
     "vars": {
      "on GitHub": "5 commits"
     }
    },
    {
     "say": "Now status says you're up to date. Both sides match.",
     "line": 6,
     "out": "Your branch is up to date with 'origin/main'."
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Concept",
   "title": "GitHub only sees what you push",
   "columns": [
    "Moment",
    "Your computer",
    "GitHub",
    "git status says"
   ],
   "rows": [
    [
     "After first push",
     "4 commits",
     "4 commits",
     "up to date"
    ],
    [
     "Commit tomato soup",
     "5 commits",
     "4 commits",
     "ahead by 1 commit"
    ],
    [
     "git push",
     "5 commits",
     "5 commits",
     "up to date"
    ]
   ],
   "beats": [
    {
     "say": "Here are those moments side by side."
    },
    {
     "say": "After the first push, both sides have the same four commits.",
     "hl": 0
    },
    {
     "say": "Commit the tomato soup, and only your computer has it. GitHub doesn't know yet.",
     "hl": 1,
     "col": 2
    },
    {
     "say": "Push, and GitHub catches up.",
     "hl": 2,
     "col": 2
    },
    {
     "say": "Commit without pushing, and GitHub never sees the change.",
     "hl": 1,
     "dim": true,
     "col": 3
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Step 4",
   "title": "Pretend to be a teammate",
   "file": "Terminal",
   "code": "cd ..\ngit clone https://github.com/yourusername/recipe-notes.git recipe-notes-copy\ncd recipe-notes-copy\ncat README.md\ngit log --oneline",
   "beats": [
    {
     "say": "Now pretend you're a teammate on another computer. Step out of your project folder.",
     "line": 1
    },
    {
     "say": "Git clone downloads the whole repository from GitHub into a new folder, recipe notes copy.",
     "line": 2,
     "out": [
      "Cloning into 'recipe-notes-copy'...",
      "done."
     ]
    },
    {
     "say": "Step inside and read the README. All three lines arrived.",
     "line": [
      3,
      4
     ],
     "out": [
      "# Recipe Notes",
      "## Pasta Carbonara",
      "## Tomato Soup"
     ]
    },
    {
     "say": "And the log shows all five commits. Not just the files, the full history.",
     "line": 5,
     "out": [
      "bec8c9e Add tomato soup recipe heading",
      "a9e5aa0 Revert \"Add a recipe I regret\"",
      "4009602 Add a recipe I regret",
      "13014be Add carbonara recipe heading",
      "cb7d486 Add project README"
     ]
    },
    {
     "say": "That's different from git init, which starts a brand new, empty repository.",
     "line": 2
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
   "kind": "diagram",
   "kicker": "Concept",
   "title": "A branch splits off from main",
   "nodes": [
    {
     "id": "c4",
     "label": "a9e5aa0",
     "x": 12,
     "y": 60,
     "sub": "Revert the regret",
     "art": "doc"
    },
    {
     "id": "c5",
     "label": "bec8c9e",
     "x": 42,
     "y": 60,
     "sub": "Tomato soup · main",
     "art": "flag"
    },
    {
     "id": "d1",
     "label": "6f0476d",
     "x": 76,
     "y": 22,
     "sub": "Desserts · add-dessert-section",
     "art": "fork"
    }
   ],
   "edges": [
    {
     "from": "c4",
     "to": "c5"
    },
    {
     "from": "c5",
     "to": "d1"
    }
   ],
   "beats": [
    {
     "say": "Here's the end of main's history. Its latest commit is the tomato soup.",
     "show": 2,
     "on": "c5"
    },
    {
     "say": "Git checkout dash b, add dessert section, starts a new branch right here, and switches to it.",
     "show": 2,
     "on": "c5"
    },
    {
     "say": "Commit the desserts, and the new commit lands on the branch only.",
     "show": 3,
     "on": "d1",
     "send": {
      "from": "c5",
      "to": "d1",
      "label": "git commit -m \"Add desserts…\""
     }
    },
    {
     "say": "Main still ends at tomato soup. Nothing you did on the branch touched it.",
     "show": 3,
     "on": "c5"
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Where you'd use this",
   "title": "Two jobs at once, main stays safe",
   "nodes": [
    {
     "id": "main",
     "label": "main",
     "x": 14,
     "y": 50,
     "sub": "the version everyone relies on",
     "art": "shield"
    },
    {
     "id": "fix",
     "label": "fix-bug",
     "x": 80,
     "y": 22,
     "sub": "you, fixing a bug",
     "art": "bug"
    },
    {
     "id": "feat",
     "label": "new-feature",
     "x": 80,
     "y": 78,
     "sub": "a teammate, building a feature",
     "art": "people"
    }
   ],
   "edges": [
    {
     "from": "main",
     "to": "fix"
    },
    {
     "from": "main",
     "to": "feat"
    }
   ],
   "beats": [
    {
     "say": "Branches matter whenever more than one thing is happening at once.",
     "show": 1,
     "on": "main"
    },
    {
     "say": "You branch off to fix a bug.",
     "show": 2,
     "on": "fix",
     "send": {
      "from": "main",
      "to": "fix",
      "label": "git checkout -b fix-bug"
     }
    },
    {
     "say": "At the same time, a teammate branches off to build a feature.",
     "show": 3,
     "on": "feat",
     "send": {
      "from": "main",
      "to": "feat",
      "label": "git checkout -b new-feature"
     }
    },
    {
     "say": "Neither of you can break main, or each other's work. Each change comes back only when it's ready.",
     "show": 3,
     "on": "main"
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Steps 1 to 3",
   "title": "Commit on a branch, then compare",
   "file": "Terminal",
   "code": "git checkout -b add-dessert-section\necho \"## Desserts\" >> README.md\necho \"### Tiramisu\" >> README.md\ngit add README.md\ngit commit -m \"Add desserts section with tiramisu\"\ngit checkout main\ncat README.md\ngit checkout add-dessert-section\ncat README.md",
   "beats": [
    {
     "say": "Back in your recipe notes folder, create the branch and switch to it in one step.",
     "line": 1,
     "out": "Switched to a new branch 'add-dessert-section'",
     "vars": {
      "on branch": "add-dessert-section"
     }
    },
    {
     "say": "Add a desserts heading and a tiramisu heading, then stage and commit them.",
     "line": [
      2,
      5
     ],
     "out": "[add-dessert-section 6f0476d] Add desserts section with tiramisu",
     "vars": {
      "README.md": "5 lines"
     }
    },
    {
     "say": "Now switch to main. Git swaps the file to main's version.",
     "line": 6,
     "out": "Switched to branch 'main'",
     "vars": {
      "on branch": "main",
      "README.md": "3 lines"
     }
    },
    {
     "say": "Cat shows three lines. No desserts here.",
     "line": 7,
     "out": [
      "# Recipe Notes",
      "## Pasta Carbonara",
      "## Tomato Soup"
     ]
    },
    {
     "say": "Switch back to the branch, and the desserts are there again.",
     "line": [
      8,
      9
     ],
     "vars": {
      "on branch": "add-dessert-section",
      "README.md": "5 lines"
     },
     "out": [
      "Switched to branch 'add-dessert-section'",
      "# Recipe Notes",
      "## Pasta Carbonara",
      "## Tomato Soup",
      "## Desserts",
      "### Tiramisu"
     ]
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Lab · Step 3",
   "title": "Same file, two branches",
   "columns": [
    "Line",
    "main",
    "add-dessert-section"
   ],
   "rows": [
    [
     "1",
     "# Recipe Notes",
     "# Recipe Notes"
    ],
    [
     "2",
     "## Pasta Carbonara",
     "## Pasta Carbonara"
    ],
    [
     "3",
     "## Tomato Soup",
     "## Tomato Soup"
    ],
    [
     "4",
     "",
     "## Desserts"
    ],
    [
     "5",
     "",
     "### Tiramisu"
    ]
   ],
   "beats": [
    {
     "say": "Here's the README on each branch, line by line."
    },
    {
     "say": "The first three lines are shared. Both branches grew from the same commits.",
     "hl": [
      0,
      1,
      2
     ]
    },
    {
     "say": "Lines four and five exist only on add dessert section.",
     "hl": [
      3,
      4
     ],
     "col": 2
    },
    {
     "say": "Main has nothing there. Each branch keeps its own history until you deliberately combine them.",
     "hl": [
      3,
      4
     ],
     "dim": true,
     "col": 1
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Lab · Step 4",
   "title": "Push the branch to GitHub",
   "nodes": [
    {
     "id": "me",
     "label": "Your computer",
     "x": 14,
     "y": 50,
     "sub": "on add-dessert-section",
     "art": "laptop"
    },
    {
     "id": "ghm",
     "label": "main",
     "x": 82,
     "y": 22,
     "sub": "on GitHub · unchanged",
     "art": "flag"
    },
    {
     "id": "ghb",
     "label": "add-dessert-section",
     "x": 82,
     "y": 78,
     "sub": "on GitHub · new",
     "art": "fork"
    }
   ],
   "edges": [
    {
     "from": "me",
     "to": "ghm"
    },
    {
     "from": "me",
     "to": "ghb"
    }
   ],
   "beats": [
    {
     "say": "Finally, push the branch.",
     "show": 1,
     "on": "me"
    },
    {
     "say": "Git push, dash u, origin, add dessert section, creates the branch on GitHub too.",
     "show": 3,
     "on": "ghb",
     "send": {
      "from": "me",
      "to": "ghb",
      "label": "git push -u origin add-dessert-section"
     }
    },
    {
     "say": "GitHub now shows two branches: main, unchanged, and your branch with the dessert work.",
     "show": 3,
     "on": [
      "ghm",
      "ghb"
     ]
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
   "kind": "diagram",
   "kicker": "Lab · Steps 1 to 3",
   "title": "A pull request carries a branch into main",
   "nodes": [
    {
     "id": "br",
     "label": "add-dessert-section",
     "x": 12,
     "y": 25,
     "sub": "your branch on GitHub",
     "art": "fork"
    },
    {
     "id": "pr",
     "label": "Pull request",
     "x": 50,
     "y": 25,
     "sub": "describe, review, discuss",
     "art": "chat"
    },
    {
     "id": "gh",
     "label": "main on GitHub",
     "x": 88,
     "y": 25,
     "sub": "now has desserts",
     "art": "cloud"
    },
    {
     "id": "me",
     "label": "main on your computer",
     "x": 88,
     "y": 78,
     "sub": "after git pull",
     "art": "laptop"
    }
   ],
   "edges": [
    {
     "from": "br",
     "to": "pr"
    },
    {
     "from": "pr",
     "to": "gh"
    },
    {
     "from": "gh",
     "to": "me"
    }
   ],
   "beats": [
    {
     "say": "A pull request asks to merge one branch into another, usually main.",
     "show": 2,
     "on": "pr"
    },
    {
     "say": "On GitHub, open one for your dessert branch, with a short description.",
     "show": 2,
     "on": "pr",
     "send": {
      "from": "br",
      "to": "pr",
      "label": "Add desserts section"
     }
    },
    {
     "say": "Teammates can review and comment here, before anything enters main.",
     "show": 2,
     "on": "pr"
    },
    {
     "say": "Click merge pull request. The desserts are now part of main on GitHub.",
     "show": 3,
     "on": "gh",
     "send": {
      "from": "pr",
      "to": "gh",
      "label": "Merge pull request"
     }
    },
    {
     "say": "Your computer's main hasn't changed yet. Git pull brings the merge down.",
     "show": 4,
     "on": "me",
     "send": {
      "from": "gh",
      "to": "me",
      "label": "git pull"
     }
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Step 3",
   "title": "Sync your local main",
   "file": "Terminal",
   "code": "git checkout main\ngit pull\ncat README.md",
   "beats": [
    {
     "say": "Switch to main.",
     "line": 1,
     "out": "Switched to branch 'main'",
     "vars": {
      "README.md": "3 lines"
     }
    },
    {
     "say": "Git pull fetches the merged work from GitHub and moves your main forward.",
     "line": 2,
     "out": [
      "Fast-forward",
      " README.md | 2 ++",
      " 1 file changed, 2 insertions(+)"
     ],
     "vars": {
      "README.md": "5 lines"
     }
    },
    {
     "say": "Cat shows the desserts section, here on main.",
     "line": 3,
     "out": [
      "# Recipe Notes",
      "## Pasta Carbonara",
      "## Tomato Soup",
      "## Desserts",
      "### Tiramisu"
     ]
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Lab · Steps 4 and 5",
   "title": "Two branches change the same line",
   "nodes": [
    {
     "id": "base",
     "label": "main",
     "x": 10,
     "y": 50,
     "sub": "# Recipe Notes",
     "art": "flag"
    },
    {
     "id": "a",
     "label": "edit-title-a",
     "x": 38,
     "y": 18,
     "sub": "# My Favorite Recipes",
     "art": "fork"
    },
    {
     "id": "b",
     "label": "edit-title-b",
     "x": 38,
     "y": 82,
     "sub": "# Kitchen Notebook",
     "art": "fork"
    },
    {
     "id": "m",
     "label": "main",
     "x": 64,
     "y": 18,
     "sub": "after pull request merge",
     "art": "merge"
    },
    {
     "id": "x",
     "label": "Conflict",
     "x": 90,
     "y": 50,
     "sub": "line 1 changed two ways",
     "art": "warning"
    }
   ],
   "edges": [
    {
     "from": "base",
     "to": "a"
    },
    {
     "from": "base",
     "to": "b"
    },
    {
     "from": "a",
     "to": "m"
    },
    {
     "from": "m",
     "to": "x"
    },
    {
     "from": "b",
     "to": "x"
    }
   ],
   "beats": [
    {
     "say": "Now make a conflict on purpose. Start from main, where line one is Recipe Notes.",
     "show": 1,
     "on": "base"
    },
    {
     "say": "On branch edit title a, change line one to My Favorite Recipes. Commit and push.",
     "show": 2,
     "on": "a",
     "send": {
      "from": "base",
      "to": "a",
      "label": "line 1 → My Favorite Recipes"
     }
    },
    {
     "say": "Go back to main, and on branch edit title b, change the same line to Kitchen Notebook.",
     "show": 3,
     "on": "b",
     "send": {
      "from": "base",
      "to": "b",
      "label": "line 1 → Kitchen Notebook"
     }
    },
    {
     "say": "Merge branch a through GitHub, just like before. Main's title is now My Favorite Recipes.",
     "show": 4,
     "on": "m",
     "send": {
      "from": "a",
      "to": "m",
      "label": "Merge pull request"
     }
    },
    {
     "say": "Now pull, and merge branch b into main on your computer.",
     "show": 5,
     "on": "x",
     "send": {
      "from": "b",
      "to": "x",
      "label": "git merge edit-title-b"
     }
    },
    {
     "say": "Both sides changed line one, in different ways. Git can't choose, so it stops and asks you.",
     "show": 5,
     "on": [
      "m",
      "b",
      "x"
     ]
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Step 5",
   "title": "Git reports the conflict",
   "file": "Terminal",
   "code": "git checkout main\ngit pull\ngit merge edit-title-b\ngit status",
   "beats": [
    {
     "say": "Switch to main and pull, so you have the merged My Favorite Recipes title.",
     "line": [
      1,
      2
     ],
     "out": [
      "Fast-forward",
      " README.md | 2 +-"
     ]
    },
    {
     "say": "Now merge edit title b.",
     "line": 3,
     "out": [
      "Auto-merging README.md",
      "CONFLICT (content): Merge conflict in README.md",
      "Automatic merge failed; fix conflicts and then commit the result."
     ]
    },
    {
     "say": "Git status names the file that needs you: both modified, README.",
     "line": 4,
     "out": [
      "You have unmerged paths.",
      "        both modified:   README.md"
     ]
    },
    {
     "say": "Nothing is broken. Git paused the merge, and is waiting for your decision.",
     "line": 3
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Reading the markers",
   "title": "What a conflict looks like",
   "file": "README.md",
   "code": "<<<<<<< HEAD\n# My Favorite Recipes\n=======\n# Kitchen Notebook\n>>>>>>> edit-title-b\n## Pasta Carbonara\n## Tomato Soup\n## Desserts\n### Tiramisu",
   "beats": [
    {
     "say": "Open the README, and Git has written both versions into it, with markers.",
     "line": [
      1,
      5
     ]
    },
    {
     "say": "From the arrows pointing left to the equals signs is your current branch, main. HEAD.",
     "line": [
      1,
      2
     ]
    },
    {
     "say": "From the equals signs to the arrows pointing right is the incoming branch, edit title b.",
     "line": [
      3,
      5
     ]
    },
    {
     "say": "The rest of the file had no clash, so Git merged it on its own.",
     "line": [
      6,
      9
     ]
    },
    {
     "say": "Keep one title, or write a new one, and delete all three marker lines.",
     "line": 2,
     "vars": {
      "line 1 after editing": "# My Favorite Recipes"
     }
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Step 6",
   "title": "Finish the merge",
   "file": "Terminal",
   "code": "# after editing README.md to keep one title line\ngit add README.md\ngit status\ngit commit -m \"Resolve title conflict, keep My Favorite Recipes\"\ngit push",
   "beats": [
    {
     "say": "Once the file looks right, git add marks the conflict as resolved.",
     "line": [
      1,
      2
     ]
    },
    {
     "say": "Status confirms it, and reminds you the merge isn't finished yet.",
     "line": 3,
     "out": [
      "All conflicts fixed but you are still merging.",
      "  (use \"git commit\" to conclude merge)"
     ]
    },
    {
     "say": "Git commit concludes the merge, with a message saying what you kept.",
     "line": 4,
     "out": "[main b3fb7d2] Resolve title conflict, keep My Favorite Recipes"
    },
    {
     "say": "And git push shares the resolved main on GitHub.",
     "line": 5,
     "out": "   139e5d4..b3fb7d2  main -> main"
    },
    {
     "say": "That's it. You've resolved your first merge conflict.",
     "line": 4
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
