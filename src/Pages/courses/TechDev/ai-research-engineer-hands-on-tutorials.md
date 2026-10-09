<!-- order: 23 -->
# AI Research Engineer: Hands-On Project Tutorials

This course is a series of hands-on projects. You learn each idea at the moment you need it, while building the thing.

**By the end of this course, you'll be able to:**
- Read a short paper for its core claim and write a minimal script that tries to reproduce it
- Explore a dataset for missing values, distributions, and class imbalance before modeling
- Implement gradient descent and a small neural network with backpropagation using only NumPy
- Train and compare baseline models using accuracy and macro F1 on a held-out test set
- Design and run an ablation study with stated hypotheses and repeated random seeds
- Write a short research report with a reproducible method, a results chart, and honest limitations

Follow the projects in order. Each one hands off a skill or artifact to the next.


## Before you start: set up your notebook

**Time: about 15 minutes**

This course runs in **Google Colab**, a free Jupyter notebook in your browser and the standard workspace for AI and data work. There's nothing to install.

1. Go to [colab.research.google.com](https://colab.research.google.com) and sign in with a Google account.
2. Give each project its own notebook: choose **File → New notebook**, then click the title at the top to rename it after the project.
3. Notebooks have two kinds of cells. **Code cells** run Python: type or paste code, then press **Shift + Enter**. **Text cells** hold your notes and written answers: choose **Insert → Text cell**.
4. Install libraries in a code cell with `%pip install ...`. The `%` form installs them into the notebook you're using.
5. Put each code block from a project in its own code cell, in order, and run them top to bottom. When a later step changes earlier code, edit that cell and run it again.
6. To use a file you downloaded, such as a CSV, drag it into the **Files** panel (the folder icon on the left). Files your code creates appear there too. Colab clears them when the session ends, so download anything you want to keep, or connect Google Drive from the same panel.

Prefer to work on your own computer? The same notebooks run in JupyterLab or in VS Code with the Jupyter extension.

---

## Project 1 (Module 1): Summarize and Reproduce Results from a Short Paper

**Time: about 2.5 hours**

**Goal:** Read a research paper the way a researcher does, for what to rebuild, not just what to remember.

**Step 1: Create the project notebook.**
Create a new notebook for this project (**File → New notebook**) and name it `paper_reproduction_project`.

**Step 2: Choose a short, well-known paper with a simple result.**
Look for a paper with a result you can reproduce with a small dataset and a few hours of compute (e.g., a simple classification benchmark), not a paper requiring a GPU cluster.

**Step 3: Read for structure, not detail, on the first pass.**
Most papers follow **Abstract → Introduction → Method → Results → Discussion**. Skim all five sections once before rereading anything closely.

**Step 4: Identify the one core claim you'll reproduce.**
Add a **text cell** headed `paper_summary` and write your notes in it.
Write one sentence: "This paper claims that [method] achieves [result] on [dataset/task]."

**Step 5: Extract the method in your own words.**
**Paraphrasing a method** means describing what the paper's approach does algorithmically, without quoting the paper's exact text.

**Step 6: Identify the dataset and evaluation metric.**
Note what data the paper used and how it measured success (accuracy, F1, etc.).

**Step 7: Write a minimal reproduction script.**
Implement the simplest possible version of the method against a small version of the dataset (or a substitute if the original isn't available). Every reproduction script has the same three parts: **data**, **method**, **evaluation**.

The example below shows that shape for a common kind of claim: "logistic regression reaches about 97% accuracy on the Wisconsin breast cancer dataset." Add a **code cell**, paste it in, and run it with **Shift + Enter**. Then adapt each of the three parts to your own paper.
```python
from sklearn.datasets import load_breast_cancer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

# 1. Data: the paper's dataset (or the closest small substitute)
X, y = load_breast_cancer(return_X_y=True)
print("Data shape:", X.shape)

# 2. Method: the simplest version of the paper's approach
model = make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000))

# 3. Evaluation: the paper's metric, measured with 5-fold cross-validation
scores = cross_val_score(model, X, y, cv=5, scoring="accuracy")
print("Accuracy per fold:", scores.round(3))
print(f"Mean accuracy: {scores.mean():.3f} (+/- {scores.std():.3f})")

PAPER_REPORTED = 0.97  # Template: replace with the number from your paper
print(f"Paper reported: {PAPER_REPORTED:.3f}, difference: {scores.mean() - PAPER_REPORTED:+.3f}")
```
You should see a mean accuracy of about 0.98. **Cross-validation** splits the data into 5 parts and tests on each part in turn, so your number doesn't depend on one lucky split.

**Step 8: Compare your result to the paper's claim.**
Run your script and record the metric. Note how close (or far) you are from the paper's reported number, and list possible reasons for any gap (different data split, missing preprocessing, settings the paper didn't report).

### Final Project Structure

*If you worked in a notebook, these are the sections of your notebook (text and code cells), not separate files. Save or export them as files when you put the project in your portfolio.*

```text
paper_reproduction_project/
│
├── paper_summary.md
├── reproduce.py
├── results.md
```

### What You Learned
- ✅ Reading a paper for structure before detail
- ✅ Identifying one reproducible core claim
- ✅ Paraphrasing a method in your own words
- ✅ Identifying datasets and evaluation metrics
- ✅ Writing a minimal reproduction script
- ✅ Comparing your results against a paper's claims

### Portfolio Project
**Research Paper Reproduction**: Selected a published result, extracted its core method and evaluation approach, and reproduced it with a minimal working implementation.
**Skills:** Research Literacy, Python, Experimental Reproduction, Technical Writing, AI Research.

**Deliverable:** A summary of the paper's core claim plus a working script that reproduces (or attempts to reproduce) its central result.

### Quiz

1. Why should you skim all five sections of a paper before reading any one of them closely?
2. What are the three parts every minimal reproduction script needs?
3. Why does the example script use 5-fold cross-validation instead of a single train/test split?
4. Your result is 2 points lower than the paper's number. What should you do next?

*Answers: 1) A first skim shows you the paper's overall structure and main claim, so you know which details matter when you reread. 2) Data (the paper's dataset or a substitute), method (the simplest version of the approach), and evaluation (the paper's metric). 3) It tests on five different parts of the data and averages them, so the score doesn't depend on one lucky or unlucky split. 4) Record the gap honestly and list likely causes, such as a different data split, missing preprocessing, or settings the paper didn't report.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "flask",
   "kicker": "Project 1 · Reproduce a paper",
   "title": "Read to rebuild",
   "beats": [
    {
     "say": "Welcome to the A I Research Engineer tutorials."
    },
    {
     "say": "In this first project, you read a research paper the way a researcher does: for what to rebuild, not just what to remember."
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Step 3",
   "title": "Skim all five, then read closely",
   "values": [
    "Abstract",
    "Introduction",
    "Method",
    "Results",
    "Discussion"
   ],
   "beats": [
    {
     "say": "Pick a short, well-known paper with a simple result. Most papers follow these same five sections."
    },
    {
     "say": "On the first pass, you skim. Start with the abstract.",
     "hl": 0,
     "ptr": {
      "skim": 0
     }
    },
    {
     "say": "Then the introduction.",
     "ok": [
      0
     ],
     "hl": 1,
     "ptr": {
      "skim": 1
     }
    },
    {
     "say": "The method.",
     "ok": [
      0,
      1
     ],
     "hl": 2,
     "ptr": {
      "skim": 2
     }
    },
    {
     "say": "The results, and the discussion. All five, once, before you read anything closely.",
     "ok": [
      0,
      1,
      2,
      3,
      4
     ],
     "ptr": {
      "skim": 4
     },
     "note": "First pass: structure, not detail"
    },
    {
     "say": "Now you know where the claim lives, so you can reread the method and results closely.",
     "hl": [
      2,
      3
     ],
     "ok": [
      0,
      1,
      4
     ],
     "note": "Second pass: the parts you will rebuild"
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Steps 4 to 6",
   "title": "Fill in one core claim",
   "columns": [
    "Slot",
    "Example paper"
   ],
   "rows": [
    [
     "method",
     "logistic regression"
    ],
    [
     "result",
     "about 97% accuracy"
    ],
    [
     "dataset / task",
     "Breast cancer (Wisc.)"
    ],
    [
     "metric",
     "accuracy"
    ]
   ],
   "beats": [
    {
     "say": "In a text cell called paper summary, write one sentence with three blanks.",
     "sql": "This paper claims that [method]\nachieves [result] on [dataset/task]."
    },
    {
     "say": "For our example, the method is logistic regression.",
     "hl": 0,
     "dim": true
    },
    {
     "say": "The result it claims is about ninety seven percent accuracy.",
     "hl": 1,
     "dim": true
    },
    {
     "say": "And the dataset is the Wisconsin breast cancer dataset.",
     "hl": 2,
     "dim": true
    },
    {
     "say": "Note the metric too, here accuracy, and paraphrase the method in your own words, without quoting the paper.",
     "hl": 3,
     "dim": true
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Step 7",
   "title": "Data, method, evaluation",
   "file": "reproduce.py",
   "code": "X, y = load_breast_cancer(return_X_y=True)\nprint(\"Data shape:\", X.shape)\nmodel = make_pipeline(StandardScaler(),\n    LogisticRegression(max_iter=1000))\nscores = cross_val_score(model, X, y, cv=5,\n                         scoring=\"accuracy\")\nprint(\"Accuracy per fold:\", scores.round(3))\nprint(f\"Mean accuracy: {scores.mean():.3f} \"\n      f\"(+/- {scores.std():.3f})\")\nPAPER_REPORTED = 0.97  # your paper's number\ngap = scores.mean() - PAPER_REPORTED\nprint(f\"Paper reported: {PAPER_REPORTED:.3f}, \"\n      f\"difference: {gap:+.3f}\")",
   "beats": [
    {
     "say": "Part one is data. Five hundred and sixty nine tumor samples, each with thirty features.",
     "line": [
      1,
      2
     ],
     "vars": {
      "X": "569 × 30",
      "y": "569 labels"
     },
     "out": "Data shape: (569, 30)"
    },
    {
     "say": "Part two is the method: the simplest version of the paper's approach. Scale the features, then logistic regression.",
     "line": [
      3,
      4
     ],
     "vars": {
      "model": "scaler + logistic"
     }
    },
    {
     "say": "Part three is evaluation, with the paper's metric, accuracy, measured five times.",
     "line": [
      5,
      6
     ],
     "vars": {
      "scores": "5 fold scores"
     }
    },
    {
     "say": "Each fold scores around zero point nine eight.",
     "line": 7,
     "out": "Accuracy per fold: [0.982 0.982 0.974 0.974 0.991]"
    },
    {
     "say": "The mean is zero point nine eight one, give or take zero point zero zero seven.",
     "line": [
      8,
      9
     ],
     "vars": {
      "mean": 0.981
     },
     "out": "Mean accuracy: 0.981 (+/- 0.007)"
    },
    {
     "say": "Finally, compare with the paper's ninety seven percent. You're about one point higher.",
     "line": [
      10,
      13
     ],
     "vars": {
      "PAPER_REPORTED": 0.97,
      "gap": "+0.011"
     },
     "out": "Paper reported: 0.970, difference: +0.011"
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Step 7 · Cross-validation",
   "title": "Five folds, five test rounds",
   "values": [
    0.982,
    0.982,
    0.974,
    0.974,
    0.991
   ],
   "beats": [
    {
     "say": "Cross-validation splits the data into five parts. These are the five scores you just saw."
    },
    {
     "say": "Round one: train on parts two to five, test on part one. Zero point nine eight two.",
     "hl": 0,
     "ptr": {
      "test": 0
     },
     "note": "Test on fold 1, train on the other 4"
    },
    {
     "say": "Round two tests on part two instead.",
     "hl": 1,
     "ok": [
      0
     ],
     "ptr": {
      "test": 1
     }
    },
    {
     "say": "And so on, until every part has been the test set exactly once.",
     "hl": 4,
     "ok": [
      0,
      1,
      2,
      3
     ],
     "ptr": {
      "test": 4
     }
    },
    {
     "say": "Averaging all five gives zero point nine eight one, so your number doesn't depend on one lucky split.",
     "ok": [
      0,
      1,
      2,
      3,
      4
     ],
     "note": "Mean 0.981"
    }
   ]
  },
  {
   "kind": "list",
   "art": "scales",
   "kicker": "Step 8",
   "title": "Compare, honestly",
   "items": [
    [
     "Different data split",
     ""
    ],
    [
     "Missing preprocessing",
     ""
    ],
    [
     "Unreported settings",
     ""
    ]
   ],
   "beats": [
    {
     "say": "Record your metric and compare it with the paper's number.",
     "show": 0
    },
    {
     "say": "If there's a gap, list the likely reasons.",
     "show": 0
    },
    {
     "say": "A different data split.",
     "show": 1
    },
    {
     "say": "Missing preprocessing.",
     "show": 2
    },
    {
     "say": "Or settings the paper didn't report.",
     "show": 3
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "What are the three parts every minimal reproduction script needs?",
   "options": [
    "Data, method, and evaluation",
    "Abstract, method, and results",
    "Training, tuning, and deployment"
   ],
   "answer": 0,
   "good": "That's right. Data is the paper's dataset or a substitute, method is the simplest version of the approach, and evaluation is the paper's metric.",
   "bad": "Not quite. Data is the paper's dataset or a substitute, method is the simplest version of the approach, and evaluation is the paper's metric.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "What are the three parts every minimal reproduction script needs?",
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
     "One core claim, written down",
     ""
    ],
    [
     "A working reproduction script",
     ""
    ]
   ],
   "beats": [
    {
     "say": "That's Project 1.",
     "show": 0
    },
    {
     "say": "You're done when:",
     "show": 0
    },
    {
     "say": "you've written down the paper's one core claim,",
     "show": 1
    },
    {
     "say": "and you have a working script that reproduces, or attempts to reproduce, its central result.",
     "show": 2
    },
    {
     "say": "Next, in Module 2, you'll explore a dataset before modeling it.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Project 2 (Module 2): Build a Data Exploration Notebook

**Time: about 2 hours**

**Goal:** Build the habit of understanding data before modeling it, the step most beginners skip and most experienced researchers insist on.

**Step 1: Create the project notebook and install libraries.**
Create a new notebook for this project (**File → New notebook**) and name it `data_exploration_project`. Colab already has these libraries; the install line matters if you work on your own computer.
```python
%pip install pandas numpy matplotlib scikit-learn
```

**Step 2: Load a dataset.**
This course uses the Wisconsin breast cancer dataset, which comes with scikit-learn. The code saves it as a CSV and then loads that CSV, the same way you'd load any data file.
```python
import pandas as pd
from sklearn.datasets import load_breast_cancer

load_breast_cancer(as_frame=True).frame.to_csv("breast_cancer.csv", index=False)

df = pd.read_csv("breast_cancer.csv")
df.head()
```
A **DataFrame** is pandas' table-like structure, rows and columns, similar to a spreadsheet. Each row is one tumor sample; the `target` column is the label (0 = malignant, 1 = benign).

To use your own data instead: drag your CSV into the **Files** panel, change `"breast_cancer.csv"` to its name, and use your label column's name wherever this project says `"target"`.

**Step 3: Check the shape and types.**
```python
print(df.shape)
print(df.dtypes)
```
`.shape` tells you rows × columns (here 569 × 31); `.dtypes` tells you whether each column is numeric, text, or something else.

**Step 4: Check for missing values.**
```python
df.isnull().sum()
```
**Missing values** are gaps in the data. A column with 30% missing values needs a decision (drop, fill, or investigate) before you model it. This dataset has none, which is rare for real-world data.

**Step 5: Visualize key distributions.**
```python
import matplotlib.pyplot as plt

df["mean radius"].hist(bins=30)
plt.xlabel("mean radius")
plt.ylabel("number of samples")
plt.show()
```
A **distribution** shows how values are spread: evenly, skewed, or clustered. Try two or three other columns too.

**Step 6: Check for class imbalance (if classification data).**
```python
print(df["target"].value_counts())
print(df["target"].value_counts(normalize=True))
```
**Class imbalance** is when one category vastly outnumbers another (e.g., 95% "no," 5% "yes"). Here about 63% of samples are benign and 37% malignant: mildly imbalanced.

**Step 7: Note observations in text cells.**
Write 3–5 sentences summarizing what you found: is the data clean, imbalanced, complete?

### Final Project Structure
```text
data_exploration_project/
│
├── exploration.ipynb
├── breast_cancer.csv
```

### What You Learned
- ✅ Loading and inspecting data with pandas
- ✅ Checking dataset shape and column types
- ✅ Identifying and handling missing values
- ✅ Visualizing distributions
- ✅ Detecting class imbalance
- ✅ Documenting exploratory findings

### Portfolio Project
**Exploratory Data Analysis Notebook**: Loaded, inspected, and visualized a dataset, identifying missing values, distribution shape, and class imbalance ahead of model development.
**Skills:** Python, Pandas, Data Visualization, Exploratory Data Analysis, AI Research.

**Deliverable:** A Jupyter notebook documenting the dataset's shape, missing values, distributions, and key observations.

### Quiz

1. Why explore a dataset before training any model on it?
2. What does `df.isnull().sum()` tell you?
3. What is class imbalance, and why does it matter?
4. What does a histogram of one column show you?

*Answers: 1) So you find problems like missing values, odd distributions, or imbalance early, before they quietly distort your results. 2) How many missing values each column has. 3) It is when one class far outnumbers another; it matters because a model can score high accuracy just by always guessing the common class. 4) The distribution of that column's values: whether they are spread evenly, skewed, or clustered.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "search",
   "kicker": "Project 2 · Data exploration",
   "title": "Understand the data first",
   "beats": [
    {
     "say": "Welcome to Module 2."
    },
    {
     "say": "Here you build the habit of understanding data before modeling it: the step most beginners skip, and most experienced researchers insist on."
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Step 2",
   "title": "One row, one tumor sample",
   "columns": [
    "row",
    "mean radius",
    "mean texture",
    "target"
   ],
   "rows": [
    [
     "0",
     "17.99",
     "10.38",
     "0"
    ],
    [
     "1",
     "20.57",
     "17.77",
     "0"
    ],
    [
     "2",
     "19.69",
     "21.25",
     "0"
    ],
    [
     "3",
     "11.42",
     "20.38",
     "0"
    ],
    [
     "4",
     "20.29",
     "14.34",
     "0"
    ]
   ],
   "beats": [
    {
     "say": "The code saves the Wisconsin breast cancer dataset as a C S V file, then loads it into a DataFrame.",
     "sql": "df = pd.read_csv(\"breast_cancer.csv\")\ndf.head()"
    },
    {
     "say": "A DataFrame is a table, like a spreadsheet. Head shows the first five rows.",
     "hl": [
      0,
      1,
      2,
      3,
      4
     ]
    },
    {
     "say": "Each row is one tumor sample.",
     "hl": 0,
     "dim": true
    },
    {
     "say": "Each column is one measurement. Here are two of the thirty.",
     "col": 1
    },
    {
     "say": "And the target column is the label. Zero means malignant, one means benign.",
     "col": 3
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Steps 3, 4 and 6",
   "title": "Ask the data four questions",
   "file": "data_exploration_project",
   "code": "print(df.shape)\nprint(df.dtypes)\ndf.isnull().sum()\nprint(df[\"target\"].value_counts())\nprint(df[\"target\"].value_counts(normalize=True))",
   "beats": [
    {
     "say": "First question: how big is it? Shape gives rows by columns.",
     "line": 1,
     "out": "(569, 31)"
    },
    {
     "say": "Five hundred and sixty nine samples, thirty features plus the target.",
     "line": 1,
     "vars": {
      "rows": 569,
      "columns": 31
     }
    },
    {
     "say": "Second: what types are the columns? Here, thirty decimal columns and one whole-number label.",
     "line": 2,
     "out": [
      "float64 × 30 columns",
      "target    int64"
     ]
    },
    {
     "say": "Third: is anything missing? Is null, dot sum, counts the gaps in each column. Every count is zero.",
     "line": 3,
     "out": "every column: 0",
     "vars": {
      "missing": 0
     }
    },
    {
     "say": "That's rare for real data. A column with thirty percent missing would need a decision before modeling.",
     "line": 3
    },
    {
     "say": "Fourth: how balanced are the classes? Three hundred and fifty seven benign, two hundred and twelve malignant.",
     "line": 4,
     "out": [
      "1    357",
      "0    212"
     ]
    },
    {
     "say": "As fractions, about sixty three percent and thirty seven percent.",
     "line": 5,
     "out": [
      "1    0.627",
      "0    0.373"
     ]
    }
   ]
  },
  {
   "kind": "chart",
   "kicker": "Step 5",
   "title": "What the histogram shows",
   "xlabel": "mean radius (bins)",
   "ylabel": "number of samples",
   "points": [
    [
     8.2,
     9.5
    ],
    [
     16.6,
     39.5
    ],
    [
     25.0,
     92.5
    ],
    [
     33.5,
     64.5
    ],
    [
     42.0,
     27.5
    ],
    [
     50.4,
     25.0
    ],
    [
     58.8,
     19.0
    ],
    [
     67.3,
     3.5
    ],
    [
     75.8,
     2.0
    ],
    [
     84.2,
     1.5
    ]
   ],
   "beats": [
    {
     "say": "This is the histogram of mean radius, with thirty bins squeezed into ten here. Each dot is the height of one bar."
    },
    {
     "say": "Most samples sit in the middle, around eleven to fifteen.",
     "groups": [
      0,
      0,
      1,
      1,
      0,
      0,
      0,
      0,
      0,
      0
     ]
    },
    {
     "say": "But the right side trails off slowly: a few tumors are much bigger.",
     "groups": [
      0,
      0,
      1,
      1,
      0,
      2,
      2,
      2,
      2,
      2
     ]
    },
    {
     "say": "That shape is called skewed. A distribution can also be even, or clustered. Try two or three other columns too.",
     "groups": [
      0,
      0,
      1,
      1,
      0,
      2,
      2,
      2,
      2,
      2
     ]
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Step 6",
   "title": "Check the class balance",
   "columns": [
    "target",
    "meaning",
    "count",
    "share"
   ],
   "rows": [
    [
     "1",
     "benign",
     "357",
     "63%"
    ],
    [
     "0",
     "malignant",
     "212",
     "37%"
    ]
   ],
   "beats": [
    {
     "say": "Class imbalance is when one category vastly outnumbers another, like ninety five percent no and five percent yes."
    },
    {
     "say": "Here, benign is the bigger class: about sixty three percent.",
     "hl": 0,
     "dim": true,
     "col": 3
    },
    {
     "say": "Malignant is about thirty seven percent. That's mildly imbalanced.",
     "hl": 1,
     "dim": true,
     "col": 3
    },
    {
     "say": "Remember it: a model that always says benign would already be right sixty three percent of the time.",
     "hl": 0,
     "sql": "always guess 1 → right 357 / 569 ≈ 63%"
    }
   ]
  },
  {
   "kind": "quote",
   "art": "doc",
   "kicker": "Step 7",
   "title": "Write it down",
   "quote": "Is the data clean, imbalanced, complete?",
   "beats": [
    {
     "say": "Finish with a text cell.",
     "show": 0
    },
    {
     "say": "In three to five sentences, say what you found.",
     "show": 1
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "What is class imbalance, and why does it matter?",
   "options": [
    "Columns on different scales; it slows training",
    "Missing values in one class; they crash the model",
    "One class far outnumbers another; a model can score high accuracy by always guessing the common class"
   ],
   "answer": 2,
   "good": "That's right. When one class far outnumbers another, a model can score high accuracy just by always guessing the common one.",
   "bad": "Not quite. When one class far outnumbers another, a model can score high accuracy just by always guessing the common one.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "What is class imbalance, and why does it matter?",
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
     "Shape and missing values documented",
     ""
    ],
    [
     "Distributions plotted",
     ""
    ],
    [
     "Key observations written",
     ""
    ]
   ],
   "beats": [
    {
     "say": "That's Project 2.",
     "show": 0
    },
    {
     "say": "You're done when:",
     "show": 0
    },
    {
     "say": "your notebook documents the dataset's shape and missing values,",
     "show": 1
    },
    {
     "say": "its distributions,",
     "show": 2
    },
    {
     "say": "and your key observations.",
     "show": 3
    },
    {
     "say": "Next, in Module 3, gradient descent from scratch.",
     "show": 3
    }
   ]
  }
 ]
}
```

---

## Project 3 (Module 3): Implement Gradient Descent from Scratch

**Time: about 2 hours**

**Goal:** Build the optimization algorithm underneath nearly every model you'll ever train, by hand, once, so it's never a mystery again.

**Step 1: Create the project notebook.**
Create a new notebook for this project (**File → New notebook**) and name it `gradient_descent_project`.

**Step 2: Understand the goal: minimizing a loss function.**
A **loss function** measures how wrong a model's predictions are; **minimizing** it means adjusting the model until predictions get as close to correct as possible.

**Step 3: Understand the gradient.**
A **gradient** is the direction of steepest increase of the loss function with respect to the model's parameters; moving in the *opposite* direction decreases loss.

**Step 4: Implement a simple loss function.**
Add a **code cell**, paste in the code below, and run it with **Shift + Enter**.
```python
def loss(w, x, y):
    prediction = w * x
    return (prediction - y) ** 2
```
This is the **squared error** for a single-parameter linear model on one data point (averaged over many points, it's called mean squared error). Squaring the error penalizes big mistakes more than small ones.

**Step 5: Implement the gradient manually.**
```python
def gradient(w, x, y):
    prediction = w * x
    return 2 * (prediction - y) * x
```
This is the **derivative** of the loss function with respect to `w`, the calculus that tells you which direction reduces error.

**Step 6: Write the descent loop.**
```python
w = 0.0
learning_rate = 0.01
x, y = 2.0, 8.0  # example: true relationship is w=4

for step in range(100):
    g = gradient(w, x, y)
    w = w - learning_rate * g
    if step % 10 == 0:
        print(f"Step {step}: w={w:.4f}, loss={loss(w, x, y):.4f}")
```
The **learning rate** controls how big each step is: too large and it overshoots, too small and it takes forever.

**Step 7: Experiment with the learning rate.**
Run the loop with `learning_rate = 0.5` and `learning_rate = 0.001`, and observe the difference. With 0.5, each step overshoots so far that `w` swings back and forth with growing size and the loss explodes. With 0.001, `w` is still well short of 4 after 100 steps.

**Step 8: Extend to two parameters.**
Modify the loss and gradient functions to fit `w * x + b` instead of just `w * x`. You need a second gradient for `b` (it is `2 * (prediction - y)`), and you update both `w` and `b` in each loop step. With two parameters, one data point isn't enough (many lines pass through a single point), so use several points and average the gradients over them. Try it yourself first, then compare with this version:
```python
xs = [1.0, 2.0, 3.0, 4.0]
ys = [4.0, 7.0, 10.0, 13.0]  # true relationship: y = 3x + 1

w, b = 0.0, 0.0
learning_rate = 0.01
for step in range(2000):
    grad_w, grad_b = 0.0, 0.0
    for x, y in zip(xs, ys):
        error = (w * x + b) - y
        grad_w += 2 * error * x
        grad_b += 2 * error
    w -= learning_rate * grad_w / len(xs)  # average gradient over all points
    b -= learning_rate * grad_b / len(xs)
    if step % 400 == 0:
        mse = sum(((w * x + b) - y) ** 2 for x, y in zip(xs, ys)) / len(xs)
        print(f"Step {step}: w={w:.3f}, b={b:.3f}, mean squared error={mse:.4f}")
print(f"Final: w={w:.3f}, b={b:.3f}")
```
`w` should end close to 3 and `b` close to 1.

### Final Project Structure

*If you worked in a notebook, these are the sections of your notebook (text and code cells), not separate files. Save or export them as files when you put the project in your portfolio.*

```text
gradient_descent_project/
│
├── gradient_descent.py
├── experiment_notes.md
```

### What You Learned
- ✅ Loss functions and what "minimizing" means
- ✅ Gradients and the direction of steepest descent
- ✅ Implementing squared error and its derivative by hand
- ✅ Writing a gradient descent training loop
- ✅ The effect of learning rate on convergence
- ✅ Extending a single-parameter model to two parameters

### Portfolio Project
**Gradient Descent from Scratch**: Implemented a loss function, its derivative, and a full gradient descent training loop from first principles, including a learning-rate sensitivity experiment.
**Skills:** Optimization, Calculus for ML, Python, Mathematical Foundations of Machine Learning.

**Deliverable:** A working from-scratch gradient descent implementation, with notes on learning-rate experiments.

### Quiz

1. What does a loss function measure?
2. Why does gradient descent subtract the gradient instead of adding it?
3. What happens if the learning rate is too large? Too small?
4. In the loop, what does the line `w = w - learning_rate * g` do?

*Answers: 1) How wrong the model's predictions are; lower loss means better predictions. 2) The gradient points toward steepest increase in loss, so moving the opposite way decreases loss. 3) Too large and the updates overshoot and may never settle; too small and training takes a very long time to get close. 4) It moves the parameter a small step in the direction that reduces the loss.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "trend",
   "kicker": "Project 3 · Gradient descent",
   "title": "The algorithm under every model",
   "beats": [
    {
     "say": "Welcome to Module 3."
    },
    {
     "say": "You'll build the optimization algorithm underneath nearly every model you'll ever train, by hand, once, so it's never a mystery again."
    }
   ]
  },
  {
   "kind": "chart",
   "kicker": "Steps 2 and 3",
   "title": "Loss, and which way is downhill",
   "xlabel": "w",
   "ylabel": "loss",
   "points": [
    [
     0,
     90
    ],
    [
     12.5,
     50.6
    ],
    [
     25,
     22.5
    ],
    [
     37.5,
     5.6
    ],
    [
     50,
     0
    ],
    [
     62.5,
     5.6
    ],
    [
     75,
     22.5
    ],
    [
     87.5,
     50.6
    ],
    [
     100,
     90
    ]
   ],
   "beats": [
    {
     "say": "Our example has one data point: x is two, and y is eight. This curve is the loss for every value of w."
    },
    {
     "say": "A loss function measures how wrong the predictions are. The bottom is at w equals four, where two times four is exactly eight.",
     "marks": [
      [
       50,
       0
      ]
     ]
    },
    {
     "say": "We start far away, at w equals zero, where the loss is sixty four.",
     "marks": [
      [
       0,
       90
      ]
     ]
    },
    {
     "say": "The gradient is the slope here: minus thirty two. It points toward steepest increase, which is to the left.",
     "marks": [
      [
       0,
       90
      ]
     ],
     "line": [
      -3.6,
      90
     ]
    },
    {
     "say": "So we step the opposite way, to the right, and the loss goes down.",
     "marks": [
      [
       0,
       90
      ],
      [
       4,
       76
      ]
     ],
     "line": [
      -3.6,
      90
     ]
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Steps 4 and 5",
   "title": "Squared error and its derivative",
   "file": "gradient_descent.py",
   "code": "def loss(w, x, y):\n    prediction = w * x\n    return (prediction - y) ** 2\n\ndef gradient(w, x, y):\n    prediction = w * x\n    return 2 * (prediction - y) * x\n\nprint(loss(0.0, 2.0, 8.0))\nprint(gradient(0.0, 2.0, 8.0))",
   "beats": [
    {
     "say": "Let's call both functions at the start point: w zero, x two, y eight.",
     "line": 9,
     "vars": {
      "w": 0.0,
      "x": 2.0,
      "y": 8.0
     }
    },
    {
     "say": "The prediction is w times x: zero.",
     "line": [
      1,
      2
     ],
     "vars": {
      "prediction": 0.0
     }
    },
    {
     "say": "The error is minus eight, and squaring it gives sixty four. Squaring punishes big mistakes more than small ones.",
     "line": 3,
     "out": "64.0"
    },
    {
     "say": "The gradient is the derivative with respect to w.",
     "line": [
      5,
      6
     ],
     "vars": {
      "prediction": 0.0
     }
    },
    {
     "say": "Two, times minus eight, times two: minus thirty two. Negative means increasing w lowers the loss.",
     "line": [
      7,
      10
     ],
     "out": "-32.0"
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Step 6",
   "title": "Watch the loop walk downhill",
   "file": "gradient_descent.py",
   "code": "w = 0.0\nlearning_rate = 0.01\nx, y = 2.0, 8.0  # example: true relationship is w=4\n\nfor step in range(100):\n    g = gradient(w, x, y)\n    w = w - learning_rate * g\n    if step % 10 == 0:\n        print(f\"Step {step}: w={w:.4f}, \"\n              f\"loss={loss(w, x, y):.4f}\")",
   "beats": [
    {
     "say": "Start w at zero, with a learning rate of zero point zero one.",
     "line": [
      1,
      3
     ],
     "vars": {
      "w": 0.0,
      "learning_rate": 0.01
     }
    },
    {
     "say": "Step zero: the gradient is minus thirty two.",
     "line": [
      5,
      6
     ],
     "vars": {
      "step": 0,
      "g": -32.0
     }
    },
    {
     "say": "Subtract the learning rate times the gradient, and w moves up to zero point three two.",
     "line": 7,
     "vars": {
      "w": 0.32
     }
    },
    {
     "say": "Step zero is a multiple of ten, so it prints. The loss has dropped from sixty four to about fifty four.",
     "line": [
      8,
      10
     ],
     "out": "Step 0: w=0.3200, loss=54.1696"
    },
    {
     "say": "Step one: the gradient is smaller now, minus twenty nine point four four, so the step is a little smaller.",
     "line": [
      6,
      7
     ],
     "vars": {
      "step": 1,
      "g": -29.44,
      "w": 0.6144
     }
    },
    {
     "say": "By step ten, w is about two point four.",
     "line": [
      8,
      10
     ],
     "vars": {
      "step": 10,
      "w": 2.4015
     },
     "out": "Step 10: w=2.4015, loss=10.2214"
    },
    {
     "say": "By step ninety, w is almost exactly four, and the loss rounds to zero.",
     "line": [
      8,
      10
     ],
     "vars": {
      "step": 90,
      "w": 3.998
     },
     "out": [
      "...",
      "Step 90: w=3.9980, loss=0.0000"
     ]
    }
   ]
  },
  {
   "kind": "chart",
   "kicker": "Step 7",
   "title": "Learning rate: step size",
   "xlabel": "step",
   "ylabel": "w",
   "points": [
    [
     0,
     6.4
    ],
    [
     20,
     66.1
    ],
    [
     40,
     77.4
    ],
    [
     60,
     79.5
    ],
    [
     80,
     79.9
    ],
    [
     99,
     80.0
    ],
    [
     0,
     0.6
    ],
    [
     20,
     12.4
    ],
    [
     40,
     22.4
    ],
    [
     60,
     31.0
    ],
    [
     80,
     38.3
    ],
    [
     99,
     44.2
    ]
   ],
   "beats": [
    {
     "say": "Here is w after each twenty steps. The line marks the target, w equals four.",
     "line": [
      0,
      80
     ]
    },
    {
     "say": "With a learning rate of zero point zero one, w climbs fast and settles on four.",
     "line": [
      0,
      80
     ],
     "groups": [
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      0,
      0,
      0
     ]
    },
    {
     "say": "With zero point zero zero one, every step is ten times smaller. After a hundred steps, w is only about two point two.",
     "line": [
      0,
      80
     ],
     "groups": [
      1,
      1,
      1,
      1,
      1,
      1,
      2,
      2,
      2,
      2,
      2,
      2
     ]
    },
    {
     "say": "Too small, and training takes forever.",
     "line": [
      0,
      80
     ],
     "groups": [
      1,
      1,
      1,
      1,
      1,
      1,
      2,
      2,
      2,
      2,
      2,
      2
     ],
     "marks": [
      [
       99,
       44.2
      ]
     ]
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Step 7",
   "title": "Learning rate 0.5: overshoot",
   "values": [
    0,
    16,
    -32,
    112,
    -320,
    976
   ],
   "beats": [
    {
     "say": "Now try zero point five. Here is w after each step, starting from zero.",
     "hl": 0,
     "ptr": {
      "w": 0
     }
    },
    {
     "say": "The first gradient is minus thirty two. Half of that is sixteen, so w jumps straight past four, to sixteen.",
     "hl": 1,
     "ok": [
      0
     ],
     "ptr": {
      "w": 1
     },
     "note": "Target is 4"
    },
    {
     "say": "Now the gradient points back, and it's huge. W swings to minus thirty two.",
     "hl": 2,
     "ok": [
      0,
      1
     ],
     "ptr": {
      "w": 2
     }
    },
    {
     "say": "Then one hundred and twelve, then minus three hundred and twenty.",
     "hl": [
      3,
      4
     ],
     "ok": [
      0,
      1,
      2
     ],
     "ptr": {
      "w": 4
     }
    },
    {
     "say": "Every swing is bigger than the last, so the loss explodes. Too large, and it never settles.",
     "gone": [
      1,
      2,
      3,
      4,
      5
     ],
     "ptr": {
      "w": 5
     },
     "note": "Loss explodes"
    }
   ]
  },
  {
   "kind": "chart",
   "kicker": "Step 8",
   "title": "Two parameters: fit w times x plus b",
   "xlabel": "x",
   "ylabel": "y",
   "points": [
    [
     20,
     24
    ],
    [
     40,
     42
    ],
    [
     60,
     60
    ],
    [
     80,
     78
    ]
   ],
   "beats": [
    {
     "say": "Now fit w times x, plus b, to four points that lie on y equals three x plus one."
    },
    {
     "say": "Both w and b start at zero. After the first step, the line is still nearly flat: w is zero point five.",
     "line": [
      0.15,
      1.02
     ]
    },
    {
     "say": "Each step averages the gradients over all four points, and updates w and b together.",
     "line": [
      0.15,
      1.02
     ]
    },
    {
     "say": "By step four hundred, w is about three and b is about one.",
     "line": [
      0.9,
      6.03
     ]
    },
    {
     "say": "At step two thousand: w is three, b is one. The line goes through every point.",
     "line": [
      0.9,
      6.0
     ],
     "groups": [
      1,
      1,
      1,
      1
     ]
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Why does gradient descent subtract the gradient instead of adding it?",
   "options": [
    "Subtracting is faster to compute",
    "The gradient points toward steepest increase in loss, so the opposite way decreases it",
    "Adding would make the learning rate negative"
   ],
   "answer": 1,
   "good": "That's right. The gradient points toward the steepest increase in loss, so moving the opposite way decreases it.",
   "bad": "Not quite. The gradient points toward the steepest increase in loss, so moving the opposite way decreases it.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Why does gradient descent subtract the gradient instead of adding it?",
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
     "From-scratch gradient descent works",
     ""
    ],
    [
     "Learning-rate notes written",
     ""
    ]
   ],
   "beats": [
    {
     "say": "That's Project 3.",
     "show": 0
    },
    {
     "say": "You're done when:",
     "show": 0
    },
    {
     "say": "you have a working gradient descent implementation from scratch,",
     "show": 1
    },
    {
     "say": "and notes on your learning rate experiments.",
     "show": 2
    },
    {
     "say": "Next, in Module 4, a baseline model to measure everything against.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Project 4 (Module 4): Train and Evaluate a Baseline Model

**Time: about 2.5 hours**

**Goal:** Establish a reference point, the number every future improvement (including Project 6's ablation study) gets measured against.

**Step 1: Create the project notebook.**
Create a new notebook for this project (**File → New notebook**) and name it `baseline_model_project`.
```python
%pip install scikit-learn pandas
```

**Step 2: Load your Project 2 dataset and separate features from labels.**
```python
import pandas as pd
from sklearn.datasets import load_breast_cancer

df = load_breast_cancer(as_frame=True).frame
X = df.drop(columns=["target"])  # features: everything except the label
y = df["target"]                 # label: what we want to predict
print(X.shape, y.shape)
```
`X` holds the **features** (the inputs the model learns from) and `y` holds the **labels** (the answers). If you used your own CSV in Project 2, load it with `pd.read_csv` and replace `"target"` with your label column.

**Step 3: Split into train and test sets.**
```python
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)
```
A **train/test split** holds back some data the model never sees during training, so you can check if it generalizes instead of just memorizing. `stratify=y` keeps the same class balance in both parts.

**Step 4: Train the simplest reasonable baseline.**
```python
from sklearn.dummy import DummyClassifier

baseline = DummyClassifier(strategy="most_frequent")
baseline.fit(X_train, y_train)
```
A **dummy classifier** always predicts the most common class. It's intentionally "dumb," and that's the point: any real model must beat it.

**Step 5: Train a slightly smarter baseline.**
```python
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

model = make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000))
model.fit(X_train, y_train)
```
**Logistic regression** predicts the probability of a yes/no outcome by taking a weighted combination of your input features and squashing the result into a 0-to-1 range. It's *simple* (fast to train), *interpretable* (each feature's weight tells you how much it pushed the prediction toward yes or no), and a strong baseline that's often surprisingly hard to beat, which is why you try it before anything fancier. `StandardScaler` puts every feature on a similar scale first, which helps logistic regression train properly.

**Step 6: Evaluate both models.**
```python
from sklearn.metrics import accuracy_score, f1_score

for name, clf in [("Dummy (most frequent)", baseline), ("Logistic regression", model)]:
    preds = clf.predict(X_test)
    acc = accuracy_score(y_test, preds)
    f1 = f1_score(y_test, preds, average="macro", zero_division=0)
    print(f"{name}: accuracy={acc:.3f}, macro F1={f1:.3f}")
```
Expected output (close to):
```text
Dummy (most frequent): accuracy=0.632, macro F1=0.387
Logistic regression: accuracy=0.982, macro F1=0.981
```
**Accuracy** is percent correct. **F1 score** balances precision and recall. `average="macro"` computes F1 for each class and averages them equally, so it works for two classes or more and isn't fooled by imbalance. Notice the dummy model gets 63% accuracy by always guessing "benign," but its macro F1 is low: that's why accuracy alone is misleading on imbalanced data.

**Step 7: Document the baseline numbers.**
Add a **text cell** headed `baseline_results` and write your notes in it.
Record both models' scores.

### Final Project Structure

*If you worked in a notebook, these are the sections of your notebook (text and code cells), not separate files. Save or export them as files when you put the project in your portfolio.*

```text
baseline_model_project/
│
├── baseline.py
├── baseline_results.md
```

### What You Learned
- ✅ Splitting data into train and test sets
- ✅ Training a trivial baseline (dummy classifier)
- ✅ Training a simple, real baseline (logistic regression)
- ✅ Choosing evaluation metrics based on data characteristics
- ✅ Understanding accuracy vs. F1 score
- ✅ Documenting baseline results for future comparison

### Portfolio Project
**Baseline Model Evaluation**: Trained and evaluated dummy and logistic regression baselines with a proper train/test split, selecting evaluation metrics appropriate to the dataset's class balance.
**Skills:** Scikit-learn, Model Evaluation, Python, Statistical Reasoning, AI Research.

**Deliverable:** Trained baseline models with documented accuracy and F1 scores on a held-out test set.

### Quiz

1. Why do you hold back a test set the model never sees during training?
2. What is the point of training a dummy classifier that always predicts the most common class?
3. The dummy model scores 63% accuracy. Why doesn't that mean it is a useful model?
4. What does `average="macro"` do in `f1_score`?

*Answers: 1) To check whether the model generalizes to new data instead of just memorizing the training data. 2) It sets the lowest bar; any real model must beat it to show it learned something. 3) It gets that score only because 63% of the test samples are the common class, and it never detects the other class, which its low macro F1 reveals. 4) It computes F1 for each class separately and averages them equally, so every class counts and it works with two or more classes.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "target",
   "kicker": "Project 4 · Baseline model",
   "title": "Set the bar",
   "beats": [
    {
     "say": "Welcome to Module 4."
    },
    {
     "say": "A baseline is a reference point: the number every future improvement gets measured against."
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Steps 2 and 3",
   "title": "Features, labels, and a split",
   "nodes": [
    {
     "id": "df",
     "label": "DataFrame",
     "x": 10,
     "y": 50,
     "sub": "569 rows × 31",
     "art": "table"
    },
    {
     "id": "X",
     "label": "X · features",
     "x": 36,
     "y": 22,
     "sub": "30 columns"
    },
    {
     "id": "y",
     "label": "y · labels",
     "x": 36,
     "y": 78,
     "sub": "target"
    },
    {
     "id": "split",
     "label": "train_test_split",
     "x": 62,
     "y": 50,
     "sub": "test_size=0.2",
     "art": "fork"
    },
    {
     "id": "train",
     "label": "Train set",
     "x": 90,
     "y": 22,
     "sub": "455 rows"
    },
    {
     "id": "test",
     "label": "Test set",
     "x": 90,
     "y": 78,
     "sub": "114 rows · held out",
     "art": "lock"
    }
   ],
   "edges": [
    {
     "from": "df",
     "to": "X"
    },
    {
     "from": "df",
     "to": "y"
    },
    {
     "from": "X",
     "to": "split"
    },
    {
     "from": "y",
     "to": "split"
    },
    {
     "from": "split",
     "to": "train"
    },
    {
     "from": "split",
     "to": "test"
    }
   ],
   "beats": [
    {
     "say": "Start from the Project 2 DataFrame.",
     "show": 1,
     "on": "df"
    },
    {
     "say": "Drop the target column, and what's left is X: the thirty features the model learns from.",
     "show": 2,
     "on": "X",
     "send": {
      "from": "df",
      "to": "X",
      "label": "drop target"
     }
    },
    {
     "say": "The target column itself is y: the answers.",
     "show": 3,
     "on": "y",
     "send": {
      "from": "df",
      "to": "y",
      "label": "target"
     }
    },
    {
     "say": "Train test split takes both.",
     "show": 4,
     "on": "split",
     "send": {
      "from": "X",
      "to": "split",
      "label": "X and y"
     }
    },
    {
     "say": "Eighty percent, four hundred and fifty five rows, go to training.",
     "show": 5,
     "on": "train",
     "send": {
      "from": "split",
      "to": "train",
      "label": "80%"
     }
    },
    {
     "say": "Twenty percent, one hundred and fourteen rows, are held back. The model never sees them during training.",
     "show": 6,
     "on": "test",
     "send": {
      "from": "split",
      "to": "test",
      "label": "20%"
     }
    },
    {
     "say": "Stratify keeps the same class balance in both: the test set has seventy two benign and forty two malignant, still sixty three percent.",
     "show": 6,
     "on": [
      "train",
      "test"
     ]
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Steps 4 to 6",
   "title": "Two baselines, one test set",
   "file": "baseline.py",
   "code": "baseline = DummyClassifier(strategy=\"most_frequent\")\nmodel = make_pipeline(StandardScaler(),\n    LogisticRegression(max_iter=1000))\n\nfor name, clf in [\n        (\"Dummy (most frequent)\", baseline),\n        (\"Logistic regression\", model)]:\n    preds = clf.predict(X_test)\n    acc = accuracy_score(y_test, preds)\n    f1 = f1_score(y_test, preds, average=\"macro\",\n                  zero_division=0)\n    print(f\"{name}: accuracy={acc:.3f}, \"\n          f\"macro F1={f1:.3f}\")",
   "beats": [
    {
     "say": "The dummy classifier always predicts the most common class. It's dumb on purpose: any real model must beat it.",
     "line": 1,
     "vars": {
      "baseline": "always 1 (benign)"
     }
    },
    {
     "say": "Logistic regression, with features scaled first: simple, interpretable, and often hard to beat.",
     "line": [
      2,
      3
     ],
     "vars": {
      "model": "scaler + logistic"
     }
    },
    {
     "say": "Both are fitted on the training set. Now the loop scores each one on the test set.",
     "line": [
      5,
      7
     ],
     "vars": {
      "name": "Dummy (most frequent)"
     }
    },
    {
     "say": "The dummy predicts benign for all one hundred and fourteen test samples.",
     "line": 8,
     "vars": {
      "preds": "114 × 1"
     }
    },
    {
     "say": "Seventy two of them really are benign, so accuracy is zero point six three two.",
     "line": 9,
     "vars": {
      "acc": 0.632
     }
    },
    {
     "say": "But macro F 1 is only zero point three eight seven.",
     "line": [
      10,
      13
     ],
     "vars": {
      "f1": 0.387
     },
     "out": "Dummy (most frequent): accuracy=0.632, macro F1=0.387"
    },
    {
     "say": "Next, logistic regression. It gets one hundred and twelve of the one hundred and fourteen right.",
     "line": [
      7,
      9
     ],
     "vars": {
      "name": "Logistic regression",
      "preds": "112 correct",
      "acc": 0.982
     }
    },
    {
     "say": "And its macro F 1 is just as high.",
     "line": [
      10,
      13
     ],
     "vars": {
      "f1": 0.981
     },
     "out": "Logistic regression: accuracy=0.982, macro F1=0.981"
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Step 6",
   "title": "Where each model is right",
   "columns": [
    "Model",
    "Benign right",
    "Malignant right",
    "Accuracy"
   ],
   "rows": [
    [
     "Dummy",
     "72 of 72",
     "0 of 42",
     "0.632"
    ],
    [
     "Logistic regression",
     "71 of 72",
     "41 of 42",
     "0.982"
    ]
   ],
   "beats": [
    {
     "say": "Split the test set by true class, and look at what each model got right."
    },
    {
     "say": "The dummy gets every benign sample right, because it always says benign.",
     "hl": 0,
     "dim": true,
     "col": 1
    },
    {
     "say": "And it never catches a single malignant tumor.",
     "hl": 0,
     "dim": true,
     "col": 2
    },
    {
     "say": "That's how it reaches sixty three percent accuracy without detecting anything.",
     "hl": 0,
     "dim": true,
     "col": 3,
     "sql": "accuracy = 72 / 114 = 0.632"
    },
    {
     "say": "Logistic regression misses just one sample of each class.",
     "hl": 1,
     "dim": true,
     "col": 2,
     "sql": "accuracy = 112 / 114 = 0.982"
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Step 6",
   "title": "Macro F 1 counts every class",
   "columns": [
    "Model",
    "F1 malignant",
    "F1 benign",
    "Macro F1"
   ],
   "rows": [
    [
     "Dummy",
     "0.000",
     "0.774",
     "0.387"
    ],
    [
     "Logistic regression",
     "0.976",
     "0.986",
     "0.981"
    ]
   ],
   "beats": [
    {
     "say": "F 1 balances precision and recall. Macro F 1 computes it for each class, then averages them equally.",
     "sql": "macro F1 = (F1 malignant + F1 benign) / 2"
    },
    {
     "say": "The dummy scores zero on malignant, since it never predicts it.",
     "hl": 0,
     "dim": true,
     "col": 1
    },
    {
     "say": "Averaged with its benign score, it falls to zero point three eight seven.",
     "hl": 0,
     "dim": true,
     "col": 3,
     "sql": "(0.000 + 0.774) / 2 = 0.387"
    },
    {
     "say": "Logistic regression is strong on both classes, so its macro F 1 stays high.",
     "hl": 1,
     "dim": true,
     "col": 3,
     "sql": "(0.976 + 0.986) / 2 = 0.981"
    },
    {
     "say": "That's why accuracy alone is misleading on imbalanced data.",
     "hl": [
      0,
      1
     ],
     "col": 3
    }
   ]
  },
  {
   "kind": "quote",
   "art": "table",
   "kicker": "Step 7",
   "title": "Write the numbers down",
   "quote": "Record both models' scores.",
   "beats": [
    {
     "say": "In a text cell called baseline results, record both models' scores.",
     "show": 0
    },
    {
     "say": "You'll compare future work against them.",
     "show": 1
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "The dummy model scores 63% accuracy. Why isn't it a useful model?",
   "options": [
    "It only scores that because 63% of test samples are the common class, and it never detects the other one",
    "Sixty three percent is below the passing threshold",
    "It was trained on the test set"
   ],
   "answer": 0,
   "good": "That's right. It never detects the other class. Its accuracy just mirrors the class balance, which its low macro F 1 reveals.",
   "bad": "Not quite. It never detects the other class. Its accuracy just mirrors the class balance, which its low macro F 1 reveals.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "The dummy model scores sixty three percent accuracy. Why isn't it a useful model?",
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
     "Baselines trained",
     ""
    ],
    [
     "Accuracy and F1 documented",
     ""
    ]
   ],
   "beats": [
    {
     "say": "That's Project 4.",
     "show": 0
    },
    {
     "say": "You're done when:",
     "show": 0
    },
    {
     "say": "you've trained baseline models,",
     "show": 1
    },
    {
     "say": "with accuracy and F 1 scores documented on a held-out test set.",
     "show": 2
    },
    {
     "say": "Next, in Module 5, a small neural network from scratch.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Project 5 (Module 5): Build a Small Neural Network from Scratch

**Time: about 3 hours**

**Goal:** Move from classical ML (Project 4) to deep learning fundamentals, by building the smallest possible neural network without a framework doing the work for you.

**Step 1: Create the project notebook.**
Create a new notebook for this project (**File → New notebook**) and name it `neural_network_project`.
```python
%pip install numpy
```

**Step 2: Understand a neuron.**
A **neuron** computes a weighted sum of its inputs, adds a bias, and passes the result through an **activation function** (a nonlinearity, like sigmoid).

**Step 3: Implement the sigmoid activation function.**
Add a **code cell**, paste in the code below, and run it with **Shift + Enter**.
```python
import numpy as np

def sigmoid(x):
    return 1 / (1 + np.exp(-x))

def sigmoid_derivative_from_output(s):
    # s must be a value that has ALREADY been through sigmoid
    return s * (1 - s)
```
**Sigmoid** squashes any input into a range between 0 and 1, useful for binary classification outputs. Its derivative has a handy shortcut: if `s = sigmoid(x)`, the derivative is `s * (1 - s)`. The network stores activated values, so we use this shortcut directly. (Applying `sigmoid` a second time to an already-activated value is a classic bug that stops the network from learning.)

**Step 4: Initialize a simple network.**
```python
np.random.seed(42)  # same random start every run, so results are repeatable

input_size, hidden_size, output_size = 2, 4, 1
W1 = np.random.randn(input_size, hidden_size)
b1 = np.zeros((1, hidden_size))
W2 = np.random.randn(hidden_size, output_size)
b2 = np.zeros((1, output_size))
```
**Weights** (`W1`, `W2`) are the learnable numbers connecting the layers; training nudges them up or down to reduce the network's error. They start as *random* values on purpose: if every weight began identical, every neuron in a layer would receive the same signal and learn the exact same thing, so the random spread lets neurons specialize (this is called "breaking symmetry"). **Biases** (`b1`, `b2`) are the per-neuron numbers added after the weighted sum; they can safely start at zero because the random weights already break symmetry.

**Step 5: Implement the forward pass.**
```python
def forward(X):
    hidden = sigmoid(X @ W1 + b1)
    output = sigmoid(hidden @ W2 + b2)
    return hidden, output
```
The **forward pass** is how input data flows through the network to produce a prediction: weighted sum, plus bias, through the activation, layer by layer.

**Step 6: Implement backpropagation using the chain rule.**
```python
def backward(X, y, hidden, output, learning_rate=0.5):
    global W1, b1, W2, b2
    # How much each output and hidden neuron contributed to the error
    output_error = (output - y) * sigmoid_derivative_from_output(output)
    hidden_error = (output_error @ W2.T) * sigmoid_derivative_from_output(hidden)

    # Nudge every weight and bias against its gradient
    W2 -= learning_rate * (hidden.T @ output_error)
    b2 -= learning_rate * output_error.sum(axis=0, keepdims=True)
    W1 -= learning_rate * (X.T @ hidden_error)
    b1 -= learning_rate * hidden_error.sum(axis=0, keepdims=True)
```
**Backpropagation** applies the chain rule from calculus to compute how much each weight contributed to the final error, layer by layer, working backward from the output. It's the same idea as Project 3's gradient descent, applied to many parameters at once.

**Step 7: Train on a small toy dataset.**
```python
X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]])
y = np.array([[0], [1], [1], [0]])  # XOR problem

for epoch in range(10000):
    hidden, output = forward(X)
    backward(X, y, hidden, output)
    if epoch % 2000 == 0:
        print(f"Epoch {epoch}: loss={np.mean((output - y) ** 2):.4f}")

predictions = forward(X)[1]
print(predictions.round(3))
print("Rounded:", predictions.round().astype(int).ravel())
```
Expected output (exact numbers can differ slightly by machine):
```text
Epoch 0: loss=0.2832
Epoch 2000: loss=0.0028
Epoch 4000: loss=0.0008
Epoch 6000: loss=0.0004
Epoch 8000: loss=0.0003
[[0.01 ]
 [0.987]
 [0.984]
 [0.017]]
Rounded: [0 1 1 0]
```
The loss falls toward zero and the outputs end up near 0, 1, 1, 0, matching the XOR labels. An **epoch** is one pass over the whole training set. **XOR** is a classic toy problem that a single-layer model *cannot* solve, but a network with a hidden layer can, proving your implementation actually works. If you re-run Step 7 without re-running Step 4, training continues from the already-trained weights; re-run Step 4 to start fresh.

**Step 8: Compare against a framework implementation.**
If time allows, implement the same tiny network in PyTorch or TensorFlow and confirm it also solves XOR.

### Final Project Structure

*If you worked in a notebook, these are the sections of your notebook (text and code cells), not separate files. Save or export them as files when you put the project in your portfolio.*

```text
neural_network_project/
│
├── neural_network.py
├── xor_results.md
```

### What You Learned
- ✅ Neurons, weights, biases, and activation functions
- ✅ Implementing sigmoid and its derivative
- ✅ The forward pass through a network
- ✅ Backpropagation via the chain rule
- ✅ Training a from-scratch network on a nonlinear problem (XOR)
- ✅ Comparing a from-scratch implementation against a framework

### Portfolio Project
**Neural Network from Scratch**: Implemented a two-layer neural network's forward pass and backpropagation using only NumPy, and trained it to solve the XOR problem without a deep learning framework.
**Skills:** Deep Learning Fundamentals, Backpropagation, NumPy, Mathematical Foundations of AI, AI Research.

**Deliverable:** A working from-scratch neural network that solves a nonlinear classification problem.

### Quiz

1. What three things does a single neuron do with its inputs?
2. Why are the weights initialized with random values instead of all the same value?
3. If `s` is already the output of `sigmoid`, what is the sigmoid derivative, and why must you not apply `sigmoid` to `s` again?
4. Why is XOR a good test for this network?
5. How do you know from the output that training worked?

*Answers: 1) It computes a weighted sum of the inputs, adds a bias, and passes the result through an activation function. 2) Identical weights would make every neuron in a layer learn the same thing; random values break symmetry so neurons can specialize. 3) The derivative is `s * (1 - s)`; applying sigmoid again computes the derivative at the wrong point, giving wrong gradients so the network fails to learn. 4) A single-layer model cannot solve XOR, so solving it shows the hidden layer and backpropagation are working. 5) The loss drops toward zero and the predictions round to 0, 1, 1, 0, matching the labels.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "neural",
   "kicker": "Project 5 · Neural network",
   "title": "A network with no framework",
   "beats": [
    {
     "say": "Welcome to Module 5."
    },
    {
     "say": "Now you move from classical machine learning to deep learning fundamentals, by building the smallest possible neural network, using only NumPy."
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Step 2",
   "title": "What one neuron does",
   "nodes": [
    {
     "id": "x1",
     "label": "Input x1 = 0",
     "x": 12,
     "y": 25,
     "sub": "weight 0.50"
    },
    {
     "id": "x2",
     "label": "Input x2 = 1",
     "x": 12,
     "y": 75,
     "sub": "weight -0.23"
    },
    {
     "id": "sum",
     "label": "Weighted sum",
     "x": 45,
     "y": 50,
     "sub": "+ bias 0",
     "art": "calc"
    },
    {
     "id": "act",
     "label": "Sigmoid",
     "x": 72,
     "y": 50,
     "sub": "squash to 0–1"
    },
    {
     "id": "out",
     "label": "Output",
     "x": 92,
     "y": 50,
     "sub": "0.442"
    }
   ],
   "edges": [
    {
     "from": "x1",
     "to": "sum"
    },
    {
     "from": "x2",
     "to": "sum"
    },
    {
     "from": "sum",
     "to": "act"
    },
    {
     "from": "act",
     "to": "out"
    }
   ],
   "beats": [
    {
     "say": "Here is one real hidden neuron from this project, fed the input zero, one.",
     "show": 2
    },
    {
     "say": "Each input is multiplied by its weight. Zero times zero point five is zero.",
     "show": 3,
     "on": "x1",
     "send": {
      "from": "x1",
      "to": "sum",
      "label": "0 × 0.50"
     }
    },
    {
     "say": "One times minus zero point two three is minus zero point two three.",
     "show": 3,
     "on": "x2",
     "send": {
      "from": "x2",
      "to": "sum",
      "label": "1 × -0.23"
     }
    },
    {
     "say": "Add them up, and add the bias, which starts at zero. The sum is minus zero point two three.",
     "show": 3,
     "on": "sum"
    },
    {
     "say": "Then the activation function, sigmoid, squashes it into the range zero to one.",
     "show": 4,
     "on": "act",
     "send": {
      "from": "sum",
      "to": "act",
      "label": "-0.23"
     }
    },
    {
     "say": "The neuron outputs zero point four four two.",
     "show": 5,
     "on": "out",
     "send": {
      "from": "act",
      "to": "out",
      "label": "0.442"
     }
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Step 3",
   "title": "Sigmoid, and its shortcut",
   "columns": [
    "x",
    "s = sigmoid(x)",
    "s * (1 - s)"
   ],
   "rows": [
    [
     "-2",
     "0.119",
     "0.105"
    ],
    [
     "-0.23",
     "0.442",
     "0.247"
    ],
    [
     "0",
     "0.5",
     "0.25"
    ],
    [
     "2",
     "0.881",
     "0.105"
    ]
   ],
   "beats": [
    {
     "say": "Sigmoid is one over one plus e to the minus x.",
     "sql": "sigmoid(x) = 1 / (1 + np.exp(-x))",
     "col": 1
    },
    {
     "say": "Big negative inputs land near zero, big positive ones near one, and zero lands exactly on one half.",
     "hl": [
      0,
      2,
      3
     ],
     "col": 1
    },
    {
     "say": "Its derivative has a shortcut: if s is already a sigmoid output, it's s times one minus s.",
     "sql": "derivative = s * (1 - s)",
     "col": 2
    },
    {
     "say": "For our neuron's output, zero point four four two, that's zero point two four seven.",
     "hl": 1,
     "dim": true,
     "col": 2
    },
    {
     "say": "The classic bug is applying sigmoid again to a value that's already activated. At zero, you'd get zero point two three five, not zero point two five.",
     "hl": 2,
     "dim": true,
     "col": 2,
     "sql": "wrong: sigmoid(0.5) = 0.622 → 0.235"
    },
    {
     "say": "Wrong gradients mean the network stops learning, so the code uses the shortcut directly.",
     "hl": 2,
     "dim": true,
     "col": 2,
     "sql": "right: s = 0.5 → 0.5 * (1 - 0.5) = 0.25"
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Steps 4 to 6",
   "title": "Forward, then backward",
   "nodes": [
    {
     "id": "inp",
     "label": "Input",
     "x": 12,
     "y": 40,
     "sub": "2 values",
     "art": "array"
    },
    {
     "id": "hid",
     "label": "Hidden layer",
     "x": 50,
     "y": 40,
     "sub": "4 neurons · sigmoid",
     "art": "neural"
    },
    {
     "id": "out",
     "label": "Output",
     "x": 88,
     "y": 40,
     "sub": "1 neuron · sigmoid"
    },
    {
     "id": "lab",
     "label": "Label y",
     "x": 88,
     "y": 85,
     "sub": "the right answer",
     "art": "target"
    }
   ],
   "edges": [
    {
     "from": "inp",
     "to": "hid"
    },
    {
     "from": "hid",
     "to": "out"
    },
    {
     "from": "out",
     "to": "lab"
    }
   ],
   "beats": [
    {
     "say": "The network: two inputs, a hidden layer of four neurons, and one output.",
     "show": 3
    },
    {
     "say": "Weights start random, so each neuron learns something different. That's breaking symmetry. Biases start at zero.",
     "show": 3,
     "on": [
      "hid",
      "out"
     ]
    },
    {
     "say": "The forward pass: input times W one, plus b one, through sigmoid, into the hidden layer.",
     "show": 3,
     "on": "hid",
     "send": {
      "from": "inp",
      "to": "hid",
      "label": "X @ W1 + b1"
     }
    },
    {
     "say": "Then hidden times W two, plus b two, through sigmoid, gives the prediction.",
     "show": 3,
     "on": "out",
     "send": {
      "from": "hid",
      "to": "out",
      "label": "hidden @ W2 + b2"
     }
    },
    {
     "say": "Compare it to the label. For input zero, one, it predicts zero point three three eight, but the answer is one.",
     "show": 4,
     "on": [
      "out",
      "lab"
     ],
     "send": {
      "from": "out",
      "to": "lab",
      "label": "0.338 vs 1"
     }
    },
    {
     "say": "Backpropagation works backward with the chain rule. First, the output error nudges W two and b two.",
     "show": 4,
     "on": "out",
     "send": {
      "from": "out",
      "to": "hid",
      "label": "output_error"
     }
    },
    {
     "say": "Then that error flows back to the hidden layer, to nudge W one and b one. Gradient descent, on many weights at once.",
     "show": 4,
     "on": "hid",
     "send": {
      "from": "hid",
      "to": "inp",
      "label": "hidden_error"
     }
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Step 7",
   "title": "Train on XOR",
   "file": "neural_network.py",
   "code": "X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]])\ny = np.array([[0], [1], [1], [0]])  # XOR problem\n\nfor epoch in range(10000):\n    hidden, output = forward(X)\n    backward(X, y, hidden, output)\n    if epoch % 2000 == 0:\n        print(f\"Epoch {epoch}: loss=\"\n              f\"{np.mean((output - y) ** 2):.4f}\")\n\npredictions = forward(X)[1]\nprint(\"Rounded:\",\n      predictions.round().astype(int).ravel())",
   "beats": [
    {
     "say": "X O R: the output is one only when the two inputs differ.",
     "line": [
      1,
      2
     ],
     "vars": {
      "y": "[0, 1, 1, 0]"
     }
    },
    {
     "say": "Each epoch is one pass over all four examples: forward, then backward.",
     "line": [
      4,
      6
     ],
     "vars": {
      "epoch": 0
     }
    },
    {
     "say": "At epoch zero, the loss is zero point two eight three two.",
     "line": [
      7,
      9
     ],
     "out": "Epoch 0: loss=0.2832"
    },
    {
     "say": "By epoch two thousand, it's already zero point zero zero two eight.",
     "line": [
      7,
      9
     ],
     "vars": {
      "epoch": 2000
     },
     "out": "Epoch 2000: loss=0.0028"
    },
    {
     "say": "And it keeps falling toward zero.",
     "line": [
      7,
      9
     ],
     "vars": {
      "epoch": 8000
     },
     "out": [
      "Epoch 4000: loss=0.0008",
      "Epoch 6000: loss=0.0004",
      "Epoch 8000: loss=0.0003"
     ]
    },
    {
     "say": "After ten thousand epochs, the rounded predictions are zero, one, one, zero.",
     "line": [
      11,
      13
     ],
     "vars": {
      "epoch": 9999
     },
     "out": "Rounded: [0 1 1 0]"
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Step 7",
   "title": "Predictions before and after training",
   "values": [
    0.395,
    0.338,
    0.326,
    0.292
   ],
   "beats": [
    {
     "say": "These are the network's four predictions before training, for inputs zero zero, zero one, one zero, and one one."
    },
    {
     "say": "They're all around zero point three. The network hasn't learned anything yet.",
     "hl": [
      0,
      1,
      2,
      3
     ],
     "note": "Labels: 0, 1, 1, 0"
    },
    {
     "say": "After training, the middle two have climbed close to one, and the outer two have dropped close to zero.",
     "vals": [
      0.01,
      0.987,
      0.984,
      0.017
     ],
     "hl": [
      1,
      2
     ],
     "note": "Labels: 0, 1, 1, 0"
    },
    {
     "say": "Rounded, that's zero, one, one, zero: every example matches its label.",
     "vals": [
      0,
      1,
      1,
      0
     ],
     "ok": [
      0,
      1,
      2,
      3
     ],
     "note": "All 4 correct"
    },
    {
     "say": "A single-layer model can't solve X O R. Solving it proves your hidden layer and backpropagation work.",
     "vals": [
      0,
      1,
      1,
      0
     ],
     "ok": [
      0,
      1,
      2,
      3
     ]
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Why is XOR a good test for this network?",
   "options": [
    "It's the fastest dataset to train on",
    "It has no class imbalance",
    "A single-layer model can't solve it, so solving it shows the hidden layer and backpropagation work"
   ],
   "answer": 2,
   "good": "That's right. A single-layer model cannot solve X O R, so solving it proves the hidden layer and backpropagation are working.",
   "bad": "Not quite. A single-layer model cannot solve X O R, so solving it proves the hidden layer and backpropagation are working.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Why is X O R a good test for this network?",
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
     "A from-scratch network works",
     ""
    ],
    [
     "It solves XOR",
     ""
    ]
   ],
   "beats": [
    {
     "say": "That's Project 5.",
     "show": 0
    },
    {
     "say": "You're done when:",
     "show": 0
    },
    {
     "say": "you have a working from-scratch neural network,",
     "show": 1
    },
    {
     "say": "that solves a nonlinear classification problem, X O R.",
     "show": 2
    },
    {
     "say": "Next, in Module 6, an ablation study.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Project 6 (Module 6): Run an Ablation Study

**Time: about 3.5 hours**

**Goal:** Isolate what actually matters in a model design, the core skill of empirical AI research.

**Step 1: Create the project notebook.**
Create a new notebook for this project (**File → New notebook**) and name it `ablation_study_project`.

**Step 2: Choose a model with multiple components.**
Use your Project 5 neural network (or a slightly extended version), something with at least 2–3 design choices you could remove or change.

**Step 3: Define your ablation variants.**
An **ablation** is a controlled removal or change of one component while holding everything else fixed (e.g., "same network, but no hidden layer" or "same network, but with a different activation function"). Here you'll test three variants: the full model, no hidden layer, and ReLU instead of sigmoid in the hidden layer. **ReLU** is an activation function that outputs `max(0, x)`.

**Step 4: Write down your hypothesis for each variant.**
Add a **text cell** headed `hypotheses` and write your notes in it.
Before running anything, predict: will removing this component help, hurt, or not matter?

**Step 5: Run the baseline (full model) and each variant.**
First, add a **code cell** with the data and one training function that can build every variant. It's the Project 5 network with switches added. Paste it in and run it with **Shift + Enter**.
```python
import numpy as np

X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]])
y = np.array([[0], [1], [1], [0]])  # XOR, same data as Project 5

def sigmoid(x):
    return 1 / (1 + np.exp(-x))

def relu(x):
    return np.maximum(0, x)

def train(X, y, use_hidden=True, activation="sigmoid", seed=0,
          hidden_size=4, epochs=10000, learning_rate=0.5):
    """Train one network variant on X, y. Return its accuracy and final loss."""
    rng = np.random.default_rng(seed)

    if use_hidden:
        W1 = rng.standard_normal((X.shape[1], hidden_size))
        b1 = np.zeros((1, hidden_size))
        W2 = rng.standard_normal((hidden_size, 1))
    else:
        W2 = rng.standard_normal((X.shape[1], 1))  # inputs connect straight to the output
    b2 = np.zeros((1, 1))

    def forward():
        if not use_hidden:
            return None, None, sigmoid(X @ W2 + b2)
        z1 = X @ W1 + b1
        hidden = sigmoid(z1) if activation == "sigmoid" else relu(z1)
        return z1, hidden, sigmoid(hidden @ W2 + b2)

    for _ in range(epochs):
        z1, hidden, output = forward()
        output_error = (output - y) * output * (1 - output)
        layer_input = hidden if use_hidden else X
        if use_hidden:
            if activation == "sigmoid":
                hidden_grad = hidden * (1 - hidden)
            else:
                hidden_grad = (z1 > 0).astype(float)  # ReLU's derivative
            hidden_error = (output_error @ W2.T) * hidden_grad
            W1 -= learning_rate * (X.T @ hidden_error)
            b1 -= learning_rate * hidden_error.sum(axis=0, keepdims=True)
        W2 -= learning_rate * (layer_input.T @ output_error)
        b2 -= learning_rate * output_error.sum(axis=0, keepdims=True)

    output = forward()[2]
    return {
        "accuracy": float(np.mean(output.round() == y)),
        "loss": float(np.mean((output - y) ** 2)),
    }

def run_full_model(X, y, seed=0):
    return train(X, y, use_hidden=True, activation="sigmoid", seed=seed)

def run_without_hidden_layer(X, y, seed=0):
    return train(X, y, use_hidden=False, seed=seed)

def run_with_relu_instead(X, y, seed=0):
    return train(X, y, use_hidden=True, activation="relu", seed=seed)
```
Then add a second code cell that runs every variant once:
```python
variants = {
    "full_model": run_full_model,
    "no_hidden_layer": run_without_hidden_layer,
    "different_activation": run_with_relu_instead,
}

results = {}
for name, run_fn in variants.items():
    results[name] = run_fn(X, y, seed=0)
    print(name, results[name])
```
Keep the dataset, training steps, and random seed identical across all variants except the one change being tested. Here every variant gets the same `X`, `y`, `epochs`, `learning_rate`, and `seed`.

**Step 6: Repeat each variant multiple times.**
One run can be lucky or unlucky. Run each configuration with 5 different random seeds and record the spread of results, not just one number.
```python
seeds = [0, 1, 2, 3, 4]
for name, run_fn in variants.items():
    accuracies = [run_fn(X, y, seed=s)["accuracy"] for s in seeds]
    results[name]["accuracy"] = float(np.mean(accuracies))
    print(f"{name}: accuracies={accuracies}, "
          f"mean={np.mean(accuracies):.2f}, std={np.std(accuracies):.2f}")
```
Expected output (close to):
```text
full_model: accuracies=[1.0, 1.0, 1.0, 1.0, 1.0], mean=1.00, std=0.00
no_hidden_layer: accuracies=[0.5, 0.5, 0.5, 0.75, 0.5], mean=0.55, std=0.10
different_activation: accuracies=[1.0, 1.0, 1.0, 0.75, 1.0], mean=0.95, std=0.10
```
This updates each variant's `accuracy` in `results` to its 5-seed average, which you'll chart in Project 7. The **std** (standard deviation) measures how much the result varies between seeds.

**Step 7: Compare results against your hypotheses.**
Add a **text cell** headed `ablation_results` and write your notes in it.
For each variant: what you predicted, what happened, and by how much.

**Step 8: Write the conclusion.**
State which components matter most, based on the evidence, and note any surprises. For example: removing the hidden layer breaks the model completely, while ReLU usually works but failed on one seed out of five.

### Final Project Structure

*If you worked in a notebook, these are the sections of your notebook (text and code cells), not separate files. Save or export them as files when you put the project in your portfolio.*

```text
ablation_study_project/
│
├── ablation.py
├── hypotheses.md
├── ablation_results.md
```

### What You Learned
- ✅ Designing controlled ablation variants
- ✅ Writing pre-registered hypotheses before running experiments
- ✅ Holding all variables fixed except the one being tested
- ✅ Repeating runs to distinguish signal from noise
- ✅ Comparing results against predictions
- ✅ Drawing evidence-based conclusions about model components

### Portfolio Project
**Model Ablation Study**: Designed and ran a controlled ablation study on a neural network's components, testing hypotheses about hidden layers and activation functions with repeated trials.
**Skills:** Experimental Design, Statistical Reasoning, Python, Empirical AI Research.

**Deliverable:** An ablation study report comparing a full model against several variants, with pre-stated hypotheses and evidence-based conclusions.

### Quiz

1. What is an ablation?
2. Why must everything except the one tested component stay the same across variants?
3. Why write your hypotheses before running the experiments?
4. Why run each variant with several random seeds instead of once?
5. The no-hidden-layer variant averages about 55% accuracy on XOR. What does that tell you?

*Answers: 1) A controlled experiment that removes or changes one component of a model while keeping everything else fixed. 2) So any difference in results can be blamed on that one change and not on something else. 3) It stops you from rewriting your expectations after seeing the results, which keeps your conclusions honest. 4) A single run can be lucky or unlucky; several seeds show the typical result and how much it varies. 5) The hidden layer is essential for XOR; without it the model does about as well as guessing.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "flask",
   "kicker": "Project 6 · Ablation study",
   "title": "Find what actually matters",
   "beats": [
    {
     "say": "Welcome to Module 6."
    },
    {
     "say": "An ablation isolates what actually matters in a model design. It's the core skill of empirical A I research."
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Step 3",
   "title": "Change one thing at a time",
   "columns": [
    "Variant",
    "use_hidden",
    "activation",
    "What changed"
   ],
   "rows": [
    [
     "full_model",
     "True",
     "sigmoid",
     "nothing"
    ],
    [
     "no_hidden_layer",
     "False",
     "(none)",
     "hidden layer removed"
    ],
    [
     "different_activation",
     "True",
     "relu",
     "sigmoid → ReLU"
    ]
   ],
   "beats": [
    {
     "say": "An ablation removes or changes one component, while everything else stays fixed.",
     "sql": "same X, y · epochs=10000 · learning_rate=0.5 · seed"
    },
    {
     "say": "The full model is your Project 5 network. It's the reference.",
     "hl": 0,
     "dim": true
    },
    {
     "say": "Variant two switches off the hidden layer, so the inputs connect straight to the output.",
     "hl": 1,
     "dim": true,
     "col": 1
    },
    {
     "say": "Variant three keeps the hidden layer, but swaps sigmoid for relu, which outputs the maximum of zero and x.",
     "hl": 2,
     "dim": true,
     "col": 2
    },
    {
     "say": "One train function with two switches builds all three, so nothing else can differ.",
     "hl": [
      0,
      1,
      2
     ],
     "col": 3
    }
   ]
  },
  {
   "kind": "quote",
   "art": "pencil",
   "kicker": "Step 4",
   "title": "Predict before you run",
   "quote": "Will removing this component help, hurt, or not matter?",
   "beats": [
    {
     "say": "Before running anything, write your hypotheses in a text cell.",
     "show": 0
    },
    {
     "say": "For each variant: will removing this component help, hurt, or not matter?",
     "show": 1
    },
    {
     "say": "Writing it first stops you rewriting your expectations after you see the results.",
     "show": 1
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Step 6",
   "title": "Five seeds per variant",
   "file": "ablation.py",
   "code": "seeds = [0, 1, 2, 3, 4]\nfor name, run_fn in variants.items():\n    accuracies = [run_fn(X, y, seed=s)[\"accuracy\"]\n                  for s in seeds]\n    results[name][\"accuracy\"] = float(\n        np.mean(accuracies))\n    print(f\"{name}: accuracies={accuracies}, \"\n          f\"mean={np.mean(accuracies):.2f}, \"\n          f\"std={np.std(accuracies):.2f}\")",
   "beats": [
    {
     "say": "One run can be lucky or unlucky, so each variant is trained with five different seeds.",
     "line": 1,
     "vars": {
      "seeds": "[0, 1, 2, 3, 4]"
     }
    },
    {
     "say": "First, the full model. All five seeds solve X O R perfectly.",
     "line": [
      2,
      4
     ],
     "vars": {
      "name": "full_model",
      "accuracies": "[1.0, 1.0, 1.0, 1.0, 1.0]"
     }
    },
    {
     "say": "The mean goes into results, and it prints: mean one, spread zero.",
     "line": [
      5,
      9
     ],
     "out": "full_model: mean=1.00, std=0.00"
    },
    {
     "say": "Next, no hidden layer. Four seeds score zero point five, one scores zero point seven five.",
     "line": [
      2,
      4
     ],
     "vars": {
      "name": "no_hidden_layer",
      "accuracies": "[0.5, 0.5, 0.5, 0.75, 0.5]"
     }
    },
    {
     "say": "Mean zero point five five.",
     "line": [
      5,
      9
     ],
     "out": "no_hidden_layer: mean=0.55, std=0.10"
    },
    {
     "say": "Last, relu. Four perfect runs, and one at zero point seven five.",
     "line": [
      2,
      4
     ],
     "vars": {
      "name": "different_activation",
      "accuracies": "[1.0, 1.0, 1.0, 0.75, 1.0]"
     }
    },
    {
     "say": "Mean zero point nine five. The std, standard deviation, shows how much results vary between seeds.",
     "line": [
      5,
      9
     ],
     "out": "different_activation: mean=0.95, std=0.10"
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Step 6",
   "title": "Why one seed isn't enough",
   "values": [
    0.5,
    0.5,
    0.5,
    0.75,
    0.5
   ],
   "beats": [
    {
     "say": "Here are the five no hidden layer runs, one per seed."
    },
    {
     "say": "Seeds zero, one and two all score zero point five: as good as guessing.",
     "hl": [
      0,
      1,
      2
     ],
     "ptr": {
      "seed": 0
     }
    },
    {
     "say": "But seed three scores zero point seven five. If that were your only run, you'd think it half works.",
     "hl": 3,
     "ptr": {
      "seed": 3
     },
     "note": "A lucky run"
    },
    {
     "say": "Now relu. Seed three is the unlucky one here: zero point seven five, while the rest are perfect.",
     "vals": [
      1.0,
      1.0,
      1.0,
      0.75,
      1.0
     ],
     "hl": 3,
     "ptr": {
      "seed": 3
     },
     "note": "An unlucky run"
    },
    {
     "say": "Five seeds show the typical result, and the spread.",
     "vals": [
      1.0,
      1.0,
      1.0,
      0.75,
      1.0
     ],
     "ok": [
      0,
      1,
      2,
      4
     ],
     "note": "Mean 0.95 · std 0.10"
    }
   ]
  },
  {
   "kind": "chart",
   "kicker": "Steps 7 and 8",
   "title": "What the evidence says",
   "xlabel": "full · no hidden · ReLU",
   "ylabel": "accuracy",
   "points": [
    [
     12,
     90
    ],
    [
     16,
     90
    ],
    [
     20,
     90
    ],
    [
     24,
     90
    ],
    [
     28,
     90
    ],
    [
     42,
     45
    ],
    [
     46,
     45
    ],
    [
     50,
     45
    ],
    [
     54,
     67.5
    ],
    [
     58,
     45
    ],
    [
     72,
     90
    ],
    [
     76,
     90
    ],
    [
     80,
     90
    ],
    [
     84,
     67.5
    ],
    [
     88,
     90
    ]
   ],
   "beats": [
    {
     "say": "Every run, all fifteen, on one chart. Each dot is one seed."
    },
    {
     "say": "The full model: five dots at the top. One hundred percent.",
     "groups": [
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
     ]
    },
    {
     "say": "No hidden layer: low, averaging fifty five percent. The hidden layer is essential.",
     "groups": [
      1,
      1,
      1,
      1,
      1,
      2,
      2,
      2,
      2,
      2,
      0,
      0,
      0,
      0,
      0
     ],
     "marks": [
      [
       50,
       49.5
      ]
     ]
    },
    {
     "say": "Relu: averaging ninety five percent. It usually works, but failed on one seed out of five.",
     "groups": [
      1,
      1,
      1,
      1,
      1,
      2,
      2,
      2,
      2,
      2,
      3,
      3,
      3,
      3,
      3
     ],
     "marks": [
      [
       50,
       49.5
      ],
      [
       80,
       85.5
      ]
     ]
    },
    {
     "say": "Now compare that against your hypotheses. What did you predict, what happened, and by how much?",
     "groups": [
      1,
      1,
      1,
      1,
      1,
      2,
      2,
      2,
      2,
      2,
      3,
      3,
      3,
      3,
      3
     ],
     "marks": [
      [
       20,
       90
      ],
      [
       50,
       49.5
      ],
      [
       80,
       85.5
      ]
     ]
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Why must everything except the tested component stay the same across variants?",
   "options": [
    "So training runs faster",
    "So any difference in results can be blamed on that one change",
    "So every variant gets the same accuracy"
   ],
   "answer": 1,
   "good": "That's right. Holding everything else fixed means any difference in results comes from that one change, and not something else.",
   "bad": "Not quite. Holding everything else fixed means any difference in results comes from that one change, and not something else.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Why must everything except the tested component stay the same across variants?",
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
     "Full model versus variants",
     ""
    ],
    [
     "Hypotheses stated first",
     ""
    ],
    [
     "Evidence-based conclusions",
     ""
    ]
   ],
   "beats": [
    {
     "say": "That's Project 6.",
     "show": 0
    },
    {
     "say": "You're done when:",
     "show": 0
    },
    {
     "say": "your ablation study compares the full model against its variants,",
     "show": 1
    },
    {
     "say": "with hypotheses stated up front,",
     "show": 2
    },
    {
     "say": "and conclusions based on the evidence.",
     "show": 3
    },
    {
     "say": "Next, in Module 7, a short research report.",
     "show": 3
    }
   ]
  }
 ]
}
```

---

## Project 7 (Module 7): Write a Short Research Report

**Time: about 2 hours**

**Goal:** Practice communicating results clearly, the skill that turns good research into research anyone else can use.

**Step 1: Create the project notebook.**
Create a new notebook for this project (**File → New notebook**) and name it `research_report_project`.

**Step 2: Choose which project's results to report on.**
Use your Project 6 ablation study, or combine it with Project 4's baseline.

**Step 3: Write the abstract last, but plan it first.**
An **abstract** is a 3–5 sentence summary of the entire report (question, method, result, takeaway), written so someone can decide whether to read further.

**Step 4: Write the introduction.**
Add a **text cell** headed `report` and write your notes in it.
State the question you investigated and why it matters, in your own words.

**Step 5: Write the method section.**
Describe what you built and how you tested it, in enough detail that someone else could repeat it: the data, each variant, the number of epochs, the learning rate, and the seeds.

**Step 6: Present results with a visualization.**
This is a new notebook, so the `results` from Project 6 aren't here. Type your Project 6 mean accuracies into the cell below.
```python
import matplotlib.pyplot as plt

# Template: replace these numbers with your own Project 6 mean accuracies
results = {
    "full_model": {"accuracy": 1.00},
    "no_hidden_layer": {"accuracy": 0.55},
    "different_activation": {"accuracy": 0.95},
}

plt.bar(results.keys(), [r["accuracy"] for r in results.values()])
plt.ylabel("Mean accuracy (5 seeds)")
plt.ylim(0, 1.05)
plt.title("Ablation study on XOR")
plt.savefig("results_chart.png", bbox_inches="tight")
plt.show()
```
A well-labeled chart communicates a comparison faster than a table of numbers. Always label the axis and say what the numbers are (here, the average over 5 seeds).

**Step 7: Write the discussion.**
Explain what the results mean, note limitations (small dataset, few repetitions, etc.), and suggest what you'd test next.

**Step 8: Write the final abstract.**
Now that the rest is written, distill it into your 3–5 sentence summary.

### Final Project Structure

*If you worked in a notebook, these are the sections of your notebook (text and code cells), not separate files. Save or export them as files when you put the project in your portfolio.*

```text
research_report_project/
│
├── report.md
├── results_chart.png
```

### What You Learned
- ✅ Structuring a research report (abstract, intro, method, results, discussion)
- ✅ Writing a method section detailed enough to reproduce
- ✅ Visualizing results for clarity
- ✅ Discussing limitations honestly
- ✅ Writing an accurate abstract after the fact, not before

### Portfolio Project
**AI Research Report**: Wrote a structured research report on an ablation study, including a reproducible method section, a results visualization, and an honest discussion of limitations.
**Skills:** Technical Writing, Data Visualization, Research Communication, AI Research.

**Deliverable:** A short, structured research report with abstract, method, visualized results, and discussion.

### Quiz

1. Why is the abstract written last?
2. How much detail should the method section have?
3. What makes a results chart easy to read?
4. Why include limitations in the discussion?

*Answers: 1) It summarizes the whole report, so you can only write it accurately once the results and discussion are done. 2) Enough that someone else could repeat the experiment: data, variants, settings, and seeds. 3) Clear axis labels, a title, and a note on what the numbers mean, such as an average over 5 seeds. 4) It shows readers how far they can trust and generalize the results, and points to what should be tested next.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "doc",
   "kicker": "Project 7 · Research report",
   "title": "Make it usable by others",
   "beats": [
    {
     "say": "Welcome to the last project."
    },
    {
     "say": "Clear communication is the skill that turns good research into research anyone else can use."
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Steps 3 to 8",
   "title": "Read in one order, write in another",
   "values": [
    "Abstract",
    "Introduction",
    "Method",
    "Results",
    "Discussion"
   ],
   "beats": [
    {
     "say": "You'll report on your Project 6 ablation study. A reader meets the sections in this order."
    },
    {
     "say": "But you write the abstract last. Plan it now, and skip it.",
     "gone": 0,
     "note": "Abstract: planned, not written"
    },
    {
     "say": "Write the introduction first: the question, and why it matters.",
     "gone": 0,
     "hl": 1,
     "ptr": {
      "write": 1
     }
    },
    {
     "say": "Then the method.",
     "gone": 0,
     "ok": [
      1
     ],
     "hl": 2,
     "ptr": {
      "write": 2
     }
    },
    {
     "say": "The results, with a chart.",
     "gone": 0,
     "ok": [
      1,
      2
     ],
     "hl": 3,
     "ptr": {
      "write": 3
     }
    },
    {
     "say": "The discussion: what it means, its limitations, and what you'd test next.",
     "gone": 0,
     "ok": [
      1,
      2,
      3
     ],
     "hl": 4,
     "ptr": {
      "write": 4
     }
    },
    {
     "say": "Only now, write the abstract: three to five sentences on question, method, result, and takeaway.",
     "ok": [
      1,
      2,
      3,
      4
     ],
     "hl": 0,
     "ptr": {
      "write": 0
     },
     "note": "Abstract: written last"
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Step 5",
   "title": "A method someone could repeat",
   "columns": [
    "Detail",
    "Your Project 6 value"
   ],
   "rows": [
    [
     "Data",
     "XOR, 4 examples"
    ],
    [
     "Variants",
     "full, no hidden, ReLU"
    ],
    [
     "Epochs",
     "10,000"
    ],
    [
     "Learning rate",
     "0.5"
    ],
    [
     "Seeds",
     "0, 1, 2, 3, 4"
    ]
   ],
   "beats": [
    {
     "say": "The test of a method section: could someone else repeat your experiment from it alone?"
    },
    {
     "say": "Say what data you used.",
     "hl": 0,
     "dim": true
    },
    {
     "say": "Each variant you tested.",
     "hl": 1,
     "dim": true
    },
    {
     "say": "The number of epochs, and the learning rate.",
     "hl": [
      2,
      3
     ],
     "dim": true
    },
    {
     "say": "And the seeds. Leave any one out, and nobody can get your numbers.",
     "hl": 4,
     "dim": true
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Step 6",
   "title": "Build a well-labeled chart",
   "file": "research_report_project",
   "code": "results = {\n    \"full_model\": {\"accuracy\": 1.00},\n    \"no_hidden_layer\": {\"accuracy\": 0.55},\n    \"different_activation\": {\"accuracy\": 0.95},\n}\n\nplt.bar(results.keys(),\n        [r[\"accuracy\"] for r in results.values()])\nplt.ylabel(\"Mean accuracy (5 seeds)\")\nplt.ylim(0, 1.05)\nplt.title(\"Ablation study on XOR\")\nplt.savefig(\"results_chart.png\",\n            bbox_inches=\"tight\")",
   "beats": [
    {
     "say": "This is a new notebook, so Project 6's results aren't here. Type in your own mean accuracies.",
     "line": [
      1,
      5
     ],
     "vars": {
      "results": "3 variants"
     }
    },
    {
     "say": "One bar per variant, with its accuracy as the height.",
     "line": [
      7,
      8
     ],
     "vars": {
      "bars": "[1.00, 0.55, 0.95]"
     }
    },
    {
     "say": "Label the axis, and say what the numbers are: the average over five seeds.",
     "line": 9
    },
    {
     "say": "Set the range from zero to just above one, so a perfect score isn't cut off.",
     "line": 10
    },
    {
     "say": "Give it a title, and save it as results chart dot P N G.",
     "line": [
      11,
      13
     ],
     "out": "saved results_chart.png"
    }
   ]
  },
  {
   "kind": "chart",
   "kicker": "Step 6",
   "title": "What the chart tells a reader",
   "xlabel": "variant",
   "ylabel": "mean accuracy (5 seeds)",
   "points": [
    [
     20,
     95.2
    ],
    [
     50,
     52.4
    ],
    [
     80,
     90.5
    ]
   ],
   "beats": [
    {
     "say": "Here are the tops of the three bars."
    },
    {
     "say": "Full model and relu stand tall, near the top.",
     "groups": [
      1,
      0,
      1
     ]
    },
    {
     "say": "No hidden layer stands out at once: barely above half.",
     "groups": [
      1,
      2,
      1
     ]
    },
    {
     "say": "A labeled chart makes that comparison faster than a table of numbers.",
     "groups": [
      1,
      2,
      1
     ]
    }
   ]
  },
  {
   "kind": "list",
   "art": "warning",
   "kicker": "Step 7",
   "title": "Be honest about limitations",
   "items": [
    [
     "Small dataset",
     ""
    ],
    [
     "Few repetitions",
     ""
    ]
   ],
   "beats": [
    {
     "say": "In the discussion, note the limitations.",
     "show": 0
    },
    {
     "say": "A small dataset.",
     "show": 1
    },
    {
     "say": "Few repetitions.",
     "show": 2
    },
    {
     "say": "They tell readers how far to trust the results, and what to test next.",
     "show": 2
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Why is the abstract written last?",
   "options": [
    "It summarizes the whole report, so you can only write it accurately once the rest is done",
    "Reviewers read it last",
    "It's the least important section"
   ],
   "answer": 0,
   "good": "That's right. It summarizes the whole report, so you can only write it accurately once the results and discussion are done.",
   "bad": "Not quite. It summarizes the whole report, so you can only write it accurately once the results and discussion are done.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Why is the abstract written last?",
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
     "Abstract and method written",
     ""
    ],
    [
     "Results charted",
     ""
    ],
    [
     "Discussion with limitations",
     ""
    ]
   ],
   "beats": [
    {
     "say": "That's the final project.",
     "show": 0
    },
    {
     "say": "You're done when:",
     "show": 0
    },
    {
     "say": "you have a short, structured report with an abstract and a method,",
     "show": 1
    },
    {
     "say": "visualized results,",
     "show": 2
    },
    {
     "say": "and a discussion.",
     "show": 3
    },
    {
     "say": "You've finished the A I Research Engineer tutorials. Well done.",
     "show": 3
    }
   ]
  }
 ]
}
```
