# AI Research Engineer: Hands-On Project Tutorials

This document turns every project in the **AI Research Engineer Foundations Course** into a step-by-step, hands-on tutorial. You learn each idea at the moment you need it, while building the thing.

Follow the projects in order. Each one hands off a skill or artifact to the next, ending in the Final Capstone.

---

## Project 1 (Module 1): Summarize and Reproduce Results from a Short Paper

**Goal:** Read a research paper the way a researcher does, for what to rebuild, not just what to remember.

**Step 1: Set up a project folder.**
```bash
mkdir paper_reproduction_project
cd paper_reproduction_project
```

**Step 2: Choose a short, well-known paper with a simple result.**
Look for a paper with a result you can reproduce with a small dataset and a few hours of compute (e.g., a simple classification benchmark), not a paper requiring a GPU cluster.

**Step 3: Read for structure, not detail, on the first pass.**
Most papers follow **Abstract → Introduction → Method → Results → Discussion**. Skim all five sections once before rereading anything closely.

**Step 4: Identify the one core claim you'll reproduce.**
```bash
nano paper_summary.md
```
Write one sentence: "This paper claims that [method] achieves [result] on [dataset/task]."

**Step 5: Extract the method in your own words.**
**paraphrasing a method** means describing what the paper's approach does algorithmically, without quoting the paper's exact text.

**Step 6: Identify the dataset and evaluation metric.**
Note what data the paper used and how it measured success (accuracy, F1, etc.).

**Step 7: Write a minimal reproduction script.**
```bash
nano reproduce.py
```
Implement the simplest possible version of the method against a small version of the dataset (or a substitute if the original isn't available).

**Step 8: Compare your result to the paper's claim.**
Run your script and record the metric. Note how close (or far) you are from the paper's reported number.

### Final Project Structure
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

---

## Project 2 (Module 2): Build a Data Exploration Notebook

**Goal:** Build the habit of understanding data before modeling it, the step most beginners skip and most experienced researchers insist on.

**Step 1: Set up a project folder and environment.**
```bash
mkdir data_exploration_project
cd data_exploration_project
pip install --break-system-packages jupyter pandas numpy matplotlib
```

**Step 2: Load a dataset.**
```python
import pandas as pd
df = pd.read_csv("your_dataset.csv")
df.head()
```
A **DataFrame** is pandas' table-like structure, rows and columns, similar to a spreadsheet.

**Step 3: Check the shape and types.**
```python
df.shape
df.dtypes
```
`.shape` tells you rows × columns; `.dtypes` tells you whether each column is numeric, text, or something else.

**Step 4: Check for missing values.**
```python
df.isnull().sum()
```
**missing values** are gaps in the data, a column with 30% missing values needs a decision (drop, fill, or investigate) before you model it.

**Step 5: Visualize key distributions.**
```python
import matplotlib.pyplot as plt
df["target_column"].hist()
plt.show()
```
A **distribution** shows how values are spread, evenly, skewed, or clustered.

**Step 6: Check for class imbalance (if classification data).**
```python
df["target_column"].value_counts()
```
**class imbalance** is when one category vastly outnumbers another (e.g., 95% "no," 5% "yes").

**Step 7: Note observations in markdown cells.**
Write 3–5 sentences summarizing what you found: is the data clean, imbalanced, complete?

### Final Project Structure
```text
data_exploration_project/
│
├── exploration.ipynb
├── your_dataset.csv
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

---

## Project 3 (Module 3): Implement Gradient Descent from Scratch

**Goal:** Build the optimization algorithm underneath nearly every model you'll ever train, by hand, once, so it's never a mystery again.

**Step 1: Set up a project folder.**
```bash
mkdir gradient_descent_project
cd gradient_descent_project
```

**Step 2: Understand the goal: minimizing a loss function.**
A **loss function** measures how wrong a model's predictions are; **minimizing** it means adjusting the model until predictions get as close to correct as possible.

**Step 3: Understand the gradient.**
A **gradient** is the direction of steepest increase of the loss function with respect to the model's parameters; moving in the *opposite* direction decreases loss.

**Step 4: Implement a simple loss function.**
```bash
nano gradient_descent.py
```
```python
def loss(w, x, y):
    prediction = w * x
    return (prediction - y) ** 2
```
This is **mean squared error** for a single-parameter linear model, squaring the error penalizes big mistakes more than small ones.

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
The **learning rate** controls how big each step is, too large and it overshoots, too small and it takes forever.

**Step 7: Experiment with the learning rate.**
Run the loop with `learning_rate = 0.5` and `learning_rate = 0.001`, and observe the difference.

**Step 8: Extend to two parameters.**
Modify the loss and gradient functions to fit `w * x + b` instead of just `w * x`.

### Final Project Structure
```text
gradient_descent_project/
│
├── gradient_descent.py
├── experiment_notes.md
```

### What You Learned
- ✅ Loss functions and what "minimizing" means
- ✅ Gradients and the direction of steepest descent
- ✅ Implementing mean squared error and its derivative by hand
- ✅ Writing a gradient descent training loop
- ✅ The effect of learning rate on convergence
- ✅ Extending a single-parameter model to two parameters

### Portfolio Project
**Gradient Descent from Scratch**: Implemented a loss function, its derivative, and a full gradient descent training loop from first principles, including a learning-rate sensitivity experiment.
**Skills:** Optimization, Calculus for ML, Python, Mathematical Foundations of Machine Learning.

**Deliverable:** A working from-scratch gradient descent implementation, with notes on learning-rate experiments.

---

## Project 4 (Module 4): Train and Evaluate a Baseline Model

**Goal:** Establish a reference point, the number every future improvement (including Project 6's ablation study) gets measured against.

**Step 1: Set up a project folder.**
```bash
mkdir baseline_model_project
cd baseline_model_project
pip install --break-system-packages scikit-learn
```

**Step 2: Load your Project 2 dataset.**
```python
import pandas as pd
df = pd.read_csv("your_dataset.csv")
```

**Step 3: Split into train and test sets.**
```python
from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
```
**train/test split** holds back some data the model never sees during training, so you can check if it generalizes instead of just memorizing.

**Step 4: Train the simplest reasonable baseline.**
```python
from sklearn.dummy import DummyClassifier
baseline = DummyClassifier(strategy="most_frequent")
baseline.fit(X_train, y_train)
```
A **dummy classifier** always predicts the most common class, it's intentionally "dumb," and that's the point.

**Step 5: Train a slightly smarter baseline.**
```python
from sklearn.linear_model import LogisticRegression
model = LogisticRegression()
model.fit(X_train, y_train)
```
**logistic regression** predicts the probability of a yes/no outcome by taking a weighted combination of your input features and squashing the result into a 0-to-1 range. It's *simple* (fast to train), *interpretable* (each feature's weight tells you how much it pushed the prediction toward yes or no), and a strong baseline that's often surprisingly hard to beat, which is why you try it before anything fancier.

**Step 6: Evaluate both models.**
```python
from sklearn.metrics import accuracy_score, f1_score
preds = model.predict(X_test)
print("Accuracy:", accuracy_score(y_test, preds))
print("F1:", f1_score(y_test, preds))
```
**accuracy** is percent correct; **F1 score** balances precision and recall, critical if Project 2 revealed class imbalance, where accuracy alone is misleading.

**Step 7: Document the baseline numbers.**
```bash
nano baseline_results.md
```
Record both models' scores.

### Final Project Structure
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

---

## Project 5 (Module 5): Build a Small Neural Network from Scratch

**Goal:** Move from classical ML (Project 4) to deep learning fundamentals, by building the smallest possible neural network without a framework doing the work for you.

**Step 1: Set up a project folder.**
```bash
mkdir neural_network_project
cd neural_network_project
pip install --break-system-packages numpy
```

**Step 2: Understand a neuron.**
A **neuron** computes a weighted sum of its inputs, adds a bias, and passes the result through an **activation function** (a nonlinearity, like sigmoid).

**Step 3: Implement the sigmoid activation function.**
```bash
nano neural_network.py
```
```python
import numpy as np

def sigmoid(x):
    return 1 / (1 + np.exp(-x))

def sigmoid_derivative(x):
    return sigmoid(x) * (1 - sigmoid(x))
```
**sigmoid** squashes any input into a range between 0 and 1, useful for binary classification outputs.

**Step 4: Initialize a simple network.**
```python
input_size, hidden_size, output_size = 2, 4, 1
W1 = np.random.randn(input_size, hidden_size) * 0.1
W2 = np.random.randn(hidden_size, output_size) * 0.1
```
**weights** are the learnable numbers connecting the layers; training nudges them up or down to reduce the network's error. They start as *small random* values on purpose: if every weight began identical, every neuron in a layer would receive the same signal and learn the exact same thing, so the random spread lets neurons specialize (this is called "breaking symmetry").

**Step 5: Implement the forward pass.**
```python
def forward(X):
    hidden = sigmoid(X @ W1)
    output = sigmoid(hidden @ W2)
    return hidden, output
```
The **forward pass** is how input data flows through the network to produce a prediction.

**Step 6: Implement backpropagation using the chain rule.**
```python
def backward(X, y, hidden, output, learning_rate=0.1):
    global W1, W2
    output_error = (output - y) * sigmoid_derivative(output)
    hidden_error = (output_error @ W2.T) * sigmoid_derivative(hidden)

    W2 -= learning_rate * (hidden.T @ output_error)
    W1 -= learning_rate * (X.T @ hidden_error)
```
**backpropagation** applies the chain rule from calculus to compute how much each weight contributed to the final error, layer by layer, working backward from the output.

**Step 7: Train on a small toy dataset.**
```python
X = np.array([[0,0],[0,1],[1,0],[1,1]])
y = np.array([[0],[1],[1],[0]])  # XOR problem

for epoch in range(5000):
    hidden, output = forward(X)
    backward(X, y, hidden, output)

print(forward(X)[1])
```
**XOR** is a classic toy problem that a single-layer model *cannot* solve, but a network with a hidden layer can, proving your implementation actually works.

**Step 8: Compare against a framework implementation.**
If time allows, implement the same tiny network in PyTorch or TensorFlow and confirm it also solves XOR.

### Final Project Structure
```text
neural_network_project/
│
├── neural_network.py
├── xor_results.md
```

### What You Learned
- ✅ Neurons, weights, and activation functions
- ✅ Implementing sigmoid and its derivative
- ✅ The forward pass through a network
- ✅ Backpropagation via the chain rule
- ✅ Training a from-scratch network on a nonlinear problem (XOR)
- ✅ Comparing a from-scratch implementation against a framework

### Portfolio Project
**Neural Network from Scratch**: Implemented a two-layer neural network's forward pass and backpropagation using only NumPy, and trained it to solve the XOR problem without a deep learning framework.
**Skills:** Deep Learning Fundamentals, Backpropagation, NumPy, Mathematical Foundations of AI, AI Research.

**Deliverable:** A working from-scratch neural network that solves a nonlinear classification problem.

---

## Project 6 (Module 6): Run an Ablation Study

**Goal:** Isolate what actually matters in a model design, the core skill of empirical AI research.

**Step 1: Set up a project folder.**
```bash
mkdir ablation_study_project
cd ablation_study_project
```

**Step 2: Choose a model with multiple components.**
Use your Project 5 neural network (or a slightly extended version), something with at least 2–3 design choices you could remove or change.

**Step 3: Define your ablation variants.**
An **ablation** is a controlled removal or change of one component while holding everything else fixed (e.g., "same network, but no hidden layer" or "same network, but with a different activation function").

**Step 4: Write down your hypothesis for each variant.**
```bash
nano hypotheses.md
```
Before running anything, predict: will removing this component help, hurt, or not matter?

**Step 5: Run the baseline (full model) and each variant.**
```bash
nano ablation.py
```
```python
variants = {
    "full_model": run_full_model,
    "no_hidden_layer": run_without_hidden_layer,
    "different_activation": run_with_relu_instead,
}

results = {}
for name, run_fn in variants.items():
    results[name] = run_fn(X, y)
```
Keep the dataset, training steps, and random seed identical across all variants except the one change being tested.

**Step 6: Repeat each variant multiple times.**
Run each configuration 3–5 times with different random seeds and record the spread of results, not just one number.

**Step 7: Compare results against your hypotheses.**
```bash
nano ablation_results.md
```
For each variant: what you predicted, what happened, and by how much.

**Step 8: Write the conclusion.**
State which components matter most, based on the evidence, and note any surprises.

### Final Project Structure
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

---

## Project 7 (Module 7): Write a Short Research Report

**Goal:** Practice communicating results clearly, the skill that turns good research into research anyone else can use.

**Step 1: Set up a project folder.**
```bash
mkdir research_report_project
cd research_report_project
```

**Step 2: Choose which project's results to report on.**
Use your Project 6 ablation study, or combine it with Project 4's baseline.

**Step 3: Write the abstract last, but plan it first.**
An **abstract** is a 3–5 sentence summary of the entire report, question, method, result, takeaway, written so someone can decide whether to read further.

**Step 4: Write the introduction.**
```bash
nano report.md
```
State the question you investigated and why it matters, in your own words.

**Step 5: Write the method section.**
Describe what you built and how you tested it, in enough detail that someone else could repeat it.

**Step 6: Present results with a visualization.**
```python
import matplotlib.pyplot as plt
plt.bar(results.keys(), [r["accuracy"] for r in results.values()])
plt.savefig("results_chart.png")
```
A well-labeled chart communicates a comparison faster than a table of numbers.

**Step 7: Write the discussion.**
Explain what the results mean, note limitations (small dataset, few repetitions, etc.), and suggest what you'd test next.

**Step 8: Write the final abstract.**
Now that the rest is written, distill it into your 3–5 sentence summary.

### Final Project Structure
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

---

## Final Capstone: Reproduce a Published Paper's Core Result and Write Up Findings

**Goal:** Combine every project above into one complete research effort, this is an integration exercise, not a new build.

**Step 1: Set up your capstone project folder.**
```bash
mkdir capstone_project
cd capstone_project
```

**Step 2: Choose a paper, applying Project 1's approach.**
Pick a paper with a result ambitious enough to be meaningful, but still reproducible with the compute and time you have.

**Step 3: Explore and understand the dataset (Project 2 skills).**
Load, inspect, and visualize the data the paper uses (or a substitute if unavailable).

**Step 4: Implement the core method.**
Use Project 3 and 5's skills as needed, you may be implementing an optimization approach, a small model, or both, depending on the paper.

**Step 5: Establish a baseline (Project 4 skills).**
Before matching the paper's full method, confirm a simple baseline behaves sensibly on your data.

**Step 6: Reproduce the core result and run a small ablation (Project 6 skills).**
Try to match the paper's reported number, and test at least one component the paper claims matters.

**Step 7: Write the full research report (Project 7 skills).**
```bash
nano capstone_report.md
```
Abstract, introduction, method, results (with your number vs. the paper's number), ablation findings, discussion, and limitations.

**Step 8: Reflect on what matched and what didn't.**
Write a short, honest section: where your results matched the paper, where they diverged, and your best explanation why.

### Final Project Structure
```text
capstone_project/
│
├── paper_summary.md
├── data_exploration.ipynb
├── method_implementation.py
├── baseline_results.md
├── ablation_results.md
├── capstone_report.md
```

### What You Learned
- ✅ Selecting and scoping a real published result to reproduce
- ✅ Applying data exploration, baseline modeling, and from-scratch implementation together
- ✅ Running a small-scale ablation on a real reproduction
- ✅ Writing a full, honest research report on the effort
- ✅ Reflecting critically on gaps between your results and the original

### Portfolio Project
**Published Paper Reproduction (Capstone)**: Reproduced the core result of a published research paper from scratch, including data exploration, method implementation, baseline comparison, a small ablation study, and a full research report with an honest discussion of reproduction gaps.
**Skills:** Research Reproduction, Python, Deep Learning Fundamentals, Experimental Design, Technical Writing, AI Research.

**Deliverable:** A complete capstone folder with your paper summary, implementation, results, and a full research report comparing your findings to the original paper.
