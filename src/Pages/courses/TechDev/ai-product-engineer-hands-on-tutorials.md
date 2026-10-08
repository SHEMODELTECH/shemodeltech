<!-- order: 17 -->
# AI Product Engineer: Hands-On Project Tutorials

This course is a series of hands-on projects. You learn each idea at the moment you need it, while building the thing.

**By the end of this course, you'll be able to:**
- Write a one-page AI product brief with a clear problem statement, target user, and success metric
- Build a working feature prototype and a multi-turn chatbot that call the Claude API
- Run lightweight user discovery and use the evidence to revise a feature's direction
- Design the full feature flow, including loading, error, and "AI might be wrong" states
- Write an evaluation plan with a test set, scoring rubric, and baseline score
- Plan a staged launch with clear launch criteria, monitoring, and rollback triggers

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

**Your Claude API key.** Projects that call Claude need an API key from [console.anthropic.com](https://console.anthropic.com). API use is paid and billed by how much text you send and receive. The requests in this course are small, but set a low monthly spending limit in the console before you begin. Keep the key out of your code: in Colab, click the **key icon** in the left sidebar, add a secret named `ANTHROPIC_API_KEY`, and turn on notebook access. Then run this cell at the top of every notebook that calls Claude:

```python
import os
from google.colab import userdata
os.environ["ANTHROPIC_API_KEY"] = userdata.get("ANTHROPIC_API_KEY")
```

---

## Project 1 (Module 1): Write an AI Product Brief

**Time: about 1.5 hours**

**Goal:** Frame a real problem in product terms before touching any code, the habit that separates a useful AI feature from a novelty.

**Step 1: Create the project notebook.**
Create a new notebook for this project (**File → New notebook**) and name it `ai_product_brief_project`.

**Step 2: Identify a real problem worth solving.**
An **AI-suited problem** is one with a pattern to learn from data, ambiguity that rules-based code can't handle, and enough volume to be worth automating (e.g., "summarize long support tickets," not "add two numbers").

**Step 3: Define the user.**
Add a **text cell** headed `brief` and write your notes in it.
Write one sentence: who experiences this problem, and how often?

**Step 4: State the problem in one sentence.**
A good problem statement follows the pattern "[user] struggles to [task] because [reason], which causes [consequence]."

**Step 5: Propose the AI-powered solution.**
Write 2-3 sentences describing what the feature would do, in plain language (no implementation details yet).

**Step 6: Define what success looks like.**
A **success metric** is a measurable signal that the feature is working (e.g., "support ticket resolution time drops by 20%"), different from a **vanity metric** (e.g., "users saw the feature").

**Step 7: Note constraints and risks.**
List: cost limits, data availability, privacy concerns, and what happens if the AI gets it wrong.

**Step 8: Assemble the final brief.**
Combine Steps 3–7 into one page: Problem → User → Solution → Success Metric → Constraints/Risks.

### Final Project Structure

*If you worked in a notebook, these are the sections of your notebook (text and code cells), not separate files. Save or export them as files when you put the project in your portfolio.*

```text
ai_product_brief_project/
│
├── brief.md
```

### What You Learned
- ✅ Identifying AI-suited problems
- ✅ Defining a specific target user
- ✅ Writing a clear problem statement
- ✅ Separating success metrics from vanity metrics
- ✅ Naming constraints and risks upfront
- ✅ Assembling a one-page product brief

### Portfolio Project
**AI Feature Product Brief**: Identified a real user problem, defined a target user and success metric, and wrote a one-page product brief proposing an AI-powered solution.
**Skills:** Product Thinking, Problem Framing, Technical Writing, AI Product Strategy.

**Deliverable:** A one-page AI product brief covering problem, user, proposed solution, success metric, and risks.

### Quiz

1. What makes a problem well suited to AI?
2. Complete the problem statement pattern: "[user] struggles to [task] because..."
3. What is the difference between a success metric and a vanity metric?
4. Why list what happens if the AI gets it wrong in the brief?

*Answers: 1) It has a pattern to learn, ambiguity that fixed rules can't handle, and enough volume to be worth automating. 2) "...[reason], which causes [consequence]." 3) A success metric shows the feature is actually working, such as faster ticket resolution; a vanity metric looks good without proving value, such as "users saw the feature." 4) Planning for mistakes early shapes the design and shows whether the risk is acceptable before you build.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "doc",
   "kicker": "Project 1 · Product brief",
   "title": "Frame the problem first",
   "beats": [
    {
     "say": "Welcome to AI Product Engineer: Hands-On Project Tutorials."
    },
    {
     "say": "Before touching any code, you'll frame a real problem in product terms. That habit separates a useful AI feature from a novelty."
    }
   ]
  },
  {
   "kind": "list",
   "art": "fork",
   "kicker": "Concept",
   "title": "Is it an AI-suited problem?",
   "items": [
    [
     "A pattern",
     "Something to learn from data"
    ],
    [
     "Ambiguity",
     "Fixed rules can't handle it"
    ],
    [
     "Volume",
     "Worth automating"
    ]
   ],
   "beats": [
    {
     "say": "Not every problem needs A I.",
     "show": 0
    },
    {
     "say": "An A I suited problem has a pattern to learn from data.",
     "show": 1
    },
    {
     "say": "Ambiguity that rules-based code can't handle.",
     "show": 2
    },
    {
     "say": "And enough volume to be worth automating.",
     "show": 3
    },
    {
     "say": "Summarizing long support tickets fits. Adding two numbers does not.",
     "show": 3
    }
   ]
  },
  {
   "kind": "quote",
   "art": "pencil",
   "kicker": "Steps 3 and 4",
   "title": "One-sentence problem statement",
   "quote": "[user] struggles to [task] because [reason], which causes [consequence].",
   "beats": [
    {
     "say": "In a text cell headed brief, first write one sentence: who has this problem, and how often?",
     "show": 0
    },
    {
     "say": "Then state the problem with this pattern.",
     "show": 1
    },
    {
     "say": "User struggles to do a task, because of a reason, which causes a consequence.",
     "show": 1
    }
   ]
  },
  {
   "kind": "list",
   "art": "target",
   "kicker": "Step 6",
   "title": "Success metric or vanity metric?",
   "items": [
    [
     "✓ Success metric",
     "Resolution time drops by 20%"
    ],
    [
     "✗ Vanity metric",
     "\"Users saw the feature\""
    ]
   ],
   "beats": [
    {
     "say": "Next, define what success looks like.",
     "show": 0
    },
    {
     "say": "A success metric is a measurable signal the feature is working, like support ticket resolution time dropping by twenty percent.",
     "show": 1
    },
    {
     "say": "A vanity metric looks good without proving value, like users saw the feature.",
     "show": 2
    }
   ]
  },
  {
   "kind": "flow",
   "art": "checklist",
   "kicker": "Steps 7 and 8",
   "title": "Assemble the one-page brief",
   "steps": [
    "Problem",
    "User",
    "Solution",
    "Success metric",
    "Constraints / risks"
   ],
   "beats": [
    {
     "say": "List your constraints and risks: cost limits, data availability, privacy, and what happens if the A I gets it wrong.",
     "show": 0
    },
    {
     "say": "Then combine everything into one page.",
     "show": 1
    },
    {
     "say": "Problem, user, solution, success metric, and constraints and risks.",
     "show": 5
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Why list what happens if the AI gets it wrong in the brief?",
   "options": [
    "It's a legal requirement for every brief",
    "Planning for mistakes early shapes the design and shows whether the risk is acceptable",
    "So you can blame the model later"
   ],
   "answer": 1,
   "good": "That's right. Planning for mistakes early shapes the design, and shows whether the risk is acceptable before you build.",
   "bad": "Not quite. Planning for mistakes early shapes the design, and shows whether the risk is acceptable before you build.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Why list what happens if the AI gets it wrong in the brief?",
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
     "A one-page AI product brief",
     ""
    ],
    [
     "Problem, user, solution, metric, risks",
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
     "say": "you have a one-page A I product brief,",
     "show": 1
    },
    {
     "say": "covering problem, user, proposed solution, success metric and risks.",
     "show": 2
    },
    {
     "say": "Next, in Module 2, you'll turn your brief into a working prototype.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Project 2 (Module 2): Build an AI-Powered Feature Prototype

**Time: about 2.5 hours**

**Goal:** Turn your Project 1 brief into a working piece of software for the first time.

**Step 1: Create the project notebook.**
Create a new notebook for this project (**File → New notebook**) and name it `ai_feature_prototype_project`.
Keep your Project 1 brief open in another tab for reference.

**Step 2: Get access to an LLM API.**
An **API key** is a secret credential that authenticates your requests to a service; treat it like a password. If you haven't yet, follow **Your Claude API key** in "Before you start", then run the API key cell at the top of this notebook.

**Step 3: Make your first API call.**
Add a **code cell**, paste in the code below, and run it with **Shift + Enter**.
```python
import os
import requests

response = requests.post(
    "https://api.anthropic.com/v1/messages",
    headers={
        "x-api-key": os.environ["ANTHROPIC_API_KEY"],
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
    },
    json={
        "model": "claude-sonnet-5-5",
        "max_tokens": 200,
        "messages": [{"role": "user", "content": (
            "Summarize this in one sentence: My order arrived two days late "
            "and the box was damaged, but the product itself works fine."
        )}]
    }
)
print(response.json())
```
**JSON** is the text format most APIs use to send and receive structured data, it's how your Python code and the AI service "speak" to each other.

**Step 4: Wire the API call to your Project 1 problem.**
Replace the placeholder prompt with real input related to your brief's problem (e.g., an actual support ticket if your feature summarizes tickets).

**Step 5: Add basic input handling.**
```python
def run_feature(user_input):
    prompt = f"Summarize this support ticket in one sentence:\n\n{user_input}"
    response = requests.post(
        "https://api.anthropic.com/v1/messages",
        headers={
            "x-api-key": os.environ["ANTHROPIC_API_KEY"],
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        },
        json={
            "model": "claude-sonnet-5-5",
            "max_tokens": 200,
            "messages": [{"role": "user", "content": prompt}],
        },
    )
    response.raise_for_status()
    # The reply text is in the first content block.
    return response.json()["content"][0]["text"]

print(run_feature("I was charged twice for my subscription this month. Please refund one payment."))
```
Change the instruction in `prompt` to match your own brief.
Wrapping your API call in a function makes it reusable instead of a one-off script.

**Step 6: Test with 3–5 realistic examples.**
Run your function against several different real-world inputs, not just one.

**Step 7: Note what worked and what didn't.**
Add a **text cell** headed `prototype_notes` and write your notes in it.
Write down cases where the output was wrong, confusing, or unhelpful.

### Final Project Structure

*If you worked in a notebook, these are the sections of your notebook (text and code cells), not separate files. Save or export them as files when you put the project in your portfolio.*

```text
ai_feature_prototype_project/
│
├── brief.md
├── prototype.py
├── prototype_notes.md
```

### What You Learned
- ✅ Authenticating with an API key
- ✅ Making a real LLM API call
- ✅ Working with JSON requests and responses
- ✅ Wrapping API calls in reusable functions
- ✅ Testing across multiple realistic inputs
- ✅ Documenting early failure patterns

### Portfolio Project
**AI Feature Prototype**: Built a working prototype calling a production LLM API, tested against realistic inputs from a real user problem, and documented initial failure patterns.
**Skills:** API Integration, Python, LLM APIs, Prototyping, AI Product Development.

**Deliverable:** A working AI-powered feature prototype, tested against 3–5 realistic inputs.

### Quiz

1. Why should you never paste your API key into your code?
2. Where is the model's reply text in the API response?
3. Why wrap the API call in a run_feature function?
4. Why test with 3 to 5 different realistic inputs?

*Answers: 1) The key works like a password; anyone who sees the code could use it and run up charges. Store it as a secret or environment variable instead. 2) In the first content block: response.json()["content"][0]["text"]. 3) It makes the call reusable for any input instead of a one-off script. 4) One input can hide problems; several varied inputs reveal where the feature fails.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "api",
   "kicker": "Project 2 · Feature prototype",
   "title": "Your first working AI feature",
   "beats": [
    {
     "say": "Welcome to Module 2."
    },
    {
     "say": "Now you turn your Project 1 brief into working software for the first time, by calling the Claude A P I."
    }
   ]
  },
  {
   "kind": "list",
   "art": "key",
   "kicker": "Step 2",
   "title": "Keep your API key secret",
   "items": [
    [
     "✗ In your code",
     "Anyone who sees it can use it"
    ],
    [
     "✓ Colab secret",
     "ANTHROPIC_API_KEY → environment variable"
    ]
   ],
   "beats": [
    {
     "say": "An A P I key is a secret credential that authenticates your requests. Treat it like a password.",
     "show": 0
    },
    {
     "say": "Never paste it into your code. Anyone who sees the code could use it and run up charges.",
     "show": 1
    },
    {
     "say": "Instead, store it as a Colab secret named anthropic A P I key, and load it into an environment variable.",
     "show": 2
    }
   ]
  },
  {
   "kind": "code",
   "art": "code",
   "kicker": "Step 5",
   "title": "Wrap the call in a function",
   "file": "run_feature",
   "code": "def run_feature(user_input):\n    prompt = f\"Summarize this support ticket in one sentence:\\n\\n{user_input}\"\n    response = requests.post(\n        \"https://api.anthropic.com/v1/messages\",\n        headers={...},  # API key, version, content-type\n        json={\n            \"model\": \"claude-sonnet-5-5\",\n            \"max_tokens\": 200,\n            \"messages\": [{\"role\": \"user\", \"content\": prompt}],\n        },\n    )\n    response.raise_for_status()\n    return response.json()[\"content\"][0][\"text\"]",
   "beats": [
    {
     "say": "Your first call posts J S O N to the messages endpoint. J S O N is how your Python code and the A I service speak to each other.",
     "show": 0
    },
    {
     "say": "Then wrap the call in a function called run feature, so it works for any input, not just one.",
     "show": 1
    },
    {
     "say": "The reply text sits in the first content block of the response.",
     "show": 1
    }
   ]
  },
  {
   "kind": "flow",
   "art": "test",
   "kicker": "Steps 4 to 7",
   "title": "Make it real, then test it",
   "steps": [
    "Match the prompt to your brief",
    "Test 3 to 5 real inputs",
    "Note the failures"
   ],
   "beats": [
    {
     "say": "Change the instruction in the prompt to match your own brief, with real input, like an actual support ticket.",
     "show": 1
    },
    {
     "say": "Run it against three to five different realistic inputs, not just one.",
     "show": 2
    },
    {
     "say": "Then, in a text cell headed prototype notes, write down where the output was wrong, confusing or unhelpful.",
     "show": 3
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Why test with 3 to 5 different realistic inputs?",
   "options": [
    "One input can hide problems; several varied inputs reveal where the feature fails",
    "The API needs at least three calls to warm up",
    "It lowers the cost per request"
   ],
   "answer": 0,
   "good": "That's right. One input can hide problems. Several varied inputs reveal where the feature fails.",
   "bad": "Not quite. One input can hide problems. Several varied inputs reveal where the feature fails.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Why test with 3 to 5 different realistic inputs?",
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
     "A working AI feature prototype",
     ""
    ],
    [
     "Tested on 3 to 5 inputs, failures noted",
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
     "say": "you have a working A I feature prototype,",
     "show": 1
    },
    {
     "say": "tested against three to five realistic inputs, with the failures written down.",
     "show": 2
    },
    {
     "say": "Next, in Module 3, you'll extend it into a multi-turn chatbot.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Project 3 (Module 3): Prototype a Chatbot Feature Using an LLM API

**Time: about 2.5 hours**

**Goal:** Extend your prototype into a conversational feature, the most common AI product pattern.

**Step 1: Create the project notebook.**
Create a new notebook for this project (**File → New notebook**) and name it `chatbot_prototype_project`. Run the API key cell from "Before you start" at the top.

**Step 2: Understand conversation history.**
LLM APIs are **stateless**: each call has no memory of previous ones. To simulate a "conversation," you resend the full **message history** with every request.

**Step 3: Build a message history list.**
Add a **code cell**, paste in the code below, and run it with **Shift + Enter**.
```python
import os
import requests

# Template: replace this system prompt with one for your own use case (Step 4).
SYSTEM_PROMPT = "You are a helpful assistant that answers customer questions about online orders."

history = []  # only "user" and "assistant" messages go here

def chat(user_message):
    history.append({"role": "user", "content": user_message})
    response = requests.post(
        "https://api.anthropic.com/v1/messages",
        headers={
            "x-api-key": os.environ["ANTHROPIC_API_KEY"],
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        },
        json={
            "model": "claude-sonnet-5-5",
            "max_tokens": 300,
            "system": SYSTEM_PROMPT,   # the system prompt is a top-level field
            "messages": history,       # the full conversation so far
        },
    )
    response.raise_for_status()
    reply = response.json()["content"][0]["text"]
    history.append({"role": "assistant", "content": reply})
    return reply

print(chat("Hi! Where can I see my order status?"))
print(chat("And how long do refunds usually take?"))
```
A **system prompt** sets the AI's role and behavior before the conversation starts. In the Messages API it goes in the top-level `"system"` field, not inside the message history. To start a fresh conversation, run `history.clear()`.

**Step 4: Write a first version of your system prompt.**
Base it on your Project 1 brief: what should this assistant do, and what should it avoid?

**Step 5: Test a multi-turn conversation.**
Run 3–4 exchanges in a row, checking that the assistant's later replies make sense given earlier turns.

**Step 6: Add basic guardrails.**
A **guardrail** is a rule that keeps the AI within intended bounds (e.g., "refuse to answer off-topic questions").

**Step 7: Test edge cases.**
Try: an off-topic question, an ambiguous question, and an empty message. The API rejects an empty message with an error, so add a check at the top of `chat()` (for example, `if not user_message.strip(): return "Please type a message."`) instead of letting it crash.

### Final Project Structure

*If you worked in a notebook, these are the sections of your notebook (text and code cells), not separate files. Save or export them as files when you put the project in your portfolio.*

```text
chatbot_prototype_project/
│
├── chatbot.py
├── system_prompt.md
├── test_conversations.md
```

### What You Learned
- ✅ Why LLM APIs are stateless
- ✅ Building and maintaining message history
- ✅ Writing an effective system prompt
- ✅ Testing multi-turn conversations
- ✅ Adding basic guardrails
- ✅ Testing edge cases (off-topic, ambiguous, empty input)

### Portfolio Project
**AI Chatbot Feature Prototype**: Built a multi-turn conversational prototype using an LLM API, with a tailored system prompt, guardrails, and tested edge-case handling.
**Skills:** Conversational AI, Prompt Engineering, Python, LLM APIs, AI Product Development.

**Deliverable:** A working chatbot prototype tested across multi-turn conversations and edge cases.

### Quiz

1. What does it mean that LLM APIs are stateless?
2. Where does the system prompt go in a Messages API request?
3. After getting a reply, what must chat() do so the next turn makes sense?
4. What is a guardrail?

*Answers: 1) Each call has no memory of earlier calls, so you must resend the full conversation history every time. 2) In the top-level "system" field, not as a message inside the history list. 3) Append the reply to history as an "assistant" message. 4) A rule that keeps the AI within intended bounds, such as refusing off-topic questions.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "chat",
   "kicker": "Project 3 · Chatbot prototype",
   "title": "Make it conversational",
   "beats": [
    {
     "say": "Welcome to Module 3."
    },
    {
     "say": "You'll extend your prototype into a conversational feature, the most common A I product pattern."
    }
   ]
  },
  {
   "kind": "big",
   "art": "chain",
   "kicker": "Step 2",
   "title": "LLM APIs are stateless",
   "big": "Stateless",
   "sub": "resend the full message history every time",
   "beats": [
    {
     "say": "Here's the key idea. L L M A P Is are stateless.",
     "show": 0
    },
    {
     "say": "Each call has no memory of earlier ones. To simulate a conversation, you resend the full message history with every request.",
     "show": 1
    }
   ]
  },
  {
   "kind": "code",
   "art": "code",
   "kicker": "Step 3",
   "title": "Keep a message history",
   "file": "chat()",
   "code": "def chat(user_message):\n    history.append({\"role\": \"user\", \"content\": user_message})\n    response = requests.post(\n        \"https://api.anthropic.com/v1/messages\",\n        headers={...},\n        json={\n            \"model\": \"claude-sonnet-5-5\",\n            \"max_tokens\": 300,\n            \"system\": SYSTEM_PROMPT,   # top-level field\n            \"messages\": history,       # the full conversation so far\n        },\n    )\n    reply = response.json()[\"content\"][0][\"text\"]\n    history.append({\"role\": \"assistant\", \"content\": reply})\n    return reply",
   "beats": [
    {
     "say": "The chat function adds the user's message to a history list, then sends the whole history.",
     "show": 0
    },
    {
     "say": "The system prompt sets the assistant's role. It goes in the top-level system field, not inside the history.",
     "show": 1
    },
    {
     "say": "After the reply comes back, append it to history as an assistant message, so the next turn makes sense.",
     "show": 1
    },
    {
     "say": "To start a fresh conversation, run history dot clear.",
     "show": 1
    }
   ]
  },
  {
   "kind": "list",
   "art": "shield",
   "kicker": "Steps 4 to 6",
   "title": "System prompt and guardrails",
   "items": [
    [
     "System prompt",
     "What to do, what to avoid"
    ],
    [
     "Multi-turn test",
     "3 to 4 exchanges in a row"
    ],
    [
     "Guardrails",
     "e.g. refuse off-topic questions"
    ]
   ],
   "beats": [
    {
     "say": "Write a first system prompt from your Project 1 brief: what should this assistant do, and what should it avoid?",
     "show": 1
    },
    {
     "say": "Run three or four exchanges in a row, and check later replies make sense given earlier turns.",
     "show": 2
    },
    {
     "say": "Then add guardrails. A guardrail is a rule that keeps the A I within intended bounds, like refusing off-topic questions.",
     "show": 3
    }
   ]
  },
  {
   "kind": "list",
   "art": "test",
   "kicker": "Step 7",
   "title": "Test the edge cases",
   "items": [
    [
     "Off-topic",
     "Does the guardrail hold?"
    ],
    [
     "Ambiguous",
     "Does it ask or guess?"
    ],
    [
     "Empty",
     "Return \"Please type a message.\""
    ]
   ],
   "beats": [
    {
     "say": "Finally, try the edge cases.",
     "show": 0
    },
    {
     "say": "An off-topic question.",
     "show": 1
    },
    {
     "say": "An ambiguous question.",
     "show": 2
    },
    {
     "say": "And an empty message. The A P I rejects it with an error, so check for it at the top of chat, and ask the user to type a message instead of crashing.",
     "show": 3
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Where does the system prompt go in a Messages API request?",
   "options": [
    "As the first user message",
    "As an assistant message at the end of the history",
    "In the top-level system field"
   ],
   "answer": 2,
   "good": "That's right. It goes in the top-level system field, not as a message inside the history list.",
   "bad": "Not quite. It goes in the top-level system field, not as a message inside the history list.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Where does the system prompt go in a Messages API request?",
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
     "A working chatbot prototype",
     ""
    ],
    [
     "Tested on multi-turn chats and edge cases",
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
     "say": "you have a working chatbot prototype,",
     "show": 1
    },
    {
     "say": "tested across multi-turn conversations and edge cases.",
     "show": 2
    },
    {
     "say": "Next, in Module 4, you'll step back and check the feature against real user needs.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Project 4 (Module 4): Create a Feature Discovery Doc

**Time: about 1.5 hours**

**Goal:** Step back from building and validate the feature against real user needs before going further.

**Step 1: Create the project notebook.**
Create a new notebook for this project (**File → New notebook**) and name it `discovery_doc_project`.

**Step 2: Write 5 user interview questions.**
Good discovery questions ask about *past behavior* ("tell me about the last time you..."), not hypotheticals ("would you use a feature that...").

**Step 3: Conduct (or simulate) 3–5 short interviews.**
Add a **text cell** headed `interview_notes` and write your notes in it.
If you don't have real users available, simulate this by asking peers who fit your Project 1 target user, or by researching how people currently solve this problem.

**Step 4: Show your Project 3 prototype and get reactions.**
Ask: does this solve the problem? What's missing? What's confusing?

**Step 5: Identify patterns across interviews.**
A **discovery insight** is a pattern repeated across multiple people, not a single person's opinion.

**Step 6: Revisit your Project 1 problem statement.**
Update it if discovery revealed the real problem is different from what you assumed.

**Step 7: Write the discovery summary.**
Add a **text cell** headed `discovery_doc` and write your notes in it.
Structure: Who you talked to → What you asked → Key insights → What changes for the feature.

### Final Project Structure

*If you worked in a notebook, these are the sections of your notebook (text and code cells), not separate files. Save or export them as files when you put the project in your portfolio.*

```text
discovery_doc_project/
│
├── interview_notes.md
├── discovery_doc.md
```

### What You Learned
- ✅ Writing behavior-based interview questions
- ✅ Conducting lightweight user discovery
- ✅ Getting reactions to a working prototype
- ✅ Identifying patterns across multiple data points
- ✅ Revising a problem statement based on evidence
- ✅ Writing a discovery summary doc

### Portfolio Project
**AI Feature Discovery Research**: Conducted user interviews and prototype testing sessions, synthesized findings into key insights, and used them to validate or redirect an AI feature's direction.
**Skills:** User Research, Product Discovery, Qualitative Analysis, Technical Writing.

**Deliverable:** A discovery doc summarizing interview insights and any resulting changes to the feature direction.

### Quiz

1. Why ask "Tell me about the last time you..." instead of "Would you use a feature that..."?
2. What counts as a discovery insight?
3. What should you do if discovery shows the real problem differs from your brief?

*Answers: 1) Questions about past behavior reveal what people actually do; hypothetical questions invite guesses and polite yeses. 2) A pattern repeated across multiple people, not one person's opinion. 3) Update your problem statement to match the evidence.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "persona",
   "kicker": "Project 4 · Discovery doc",
   "title": "Validate with real users",
   "beats": [
    {
     "say": "Welcome to Module 4."
    },
    {
     "say": "Before going further, step back from building, and validate the feature against real user needs."
    }
   ]
  },
  {
   "kind": "list",
   "art": "pencil",
   "kicker": "Step 2",
   "title": "Ask about the past, not the hypothetical",
   "items": [
    [
     "✓ Past behaviour",
     "\"Tell me about the last time you...\""
    ],
    [
     "✗ Hypothetical",
     "\"Would you use a feature that...\""
    ]
   ],
   "beats": [
    {
     "say": "Write five interview questions.",
     "show": 0
    },
    {
     "say": "Good discovery questions ask about past behaviour: tell me about the last time you did this.",
     "show": 1
    },
    {
     "say": "Not hypotheticals, like would you use a feature that does this. Those invite guesses and polite yeses.",
     "show": 2
    }
   ]
  },
  {
   "kind": "flow",
   "art": "mic",
   "kicker": "Steps 3 and 4",
   "title": "Interview and show the prototype",
   "steps": [
    "3 to 5 short interviews",
    "Show the prototype",
    "Collect reactions"
   ],
   "beats": [
    {
     "say": "Run three to five short interviews, and keep notes in a text cell headed interview notes.",
     "show": 1
    },
    {
     "say": "No real users? Ask peers who fit your target user, or research how people solve this today.",
     "show": 1
    },
    {
     "say": "Then show your Project 3 prototype. Does it solve the problem? What's missing? What's confusing?",
     "show": 2
    }
   ]
  },
  {
   "kind": "quote",
   "art": "sticky",
   "kicker": "Step 5",
   "title": "What counts as an insight",
   "quote": "An insight is a pattern across several people, not one person's opinion.",
   "beats": [
    {
     "say": "Now look for patterns.",
     "show": 0
    },
    {
     "say": "A discovery insight is a pattern repeated across multiple people, not a single person's opinion.",
     "show": 1
    }
   ]
  },
  {
   "kind": "flow",
   "art": "doc",
   "kicker": "Steps 6 and 7",
   "title": "Revise and write it up",
   "steps": [
    "Who you talked to",
    "What you asked",
    "Key insights",
    "What changes"
   ],
   "beats": [
    {
     "say": "If discovery showed the real problem is different, update your Project 1 problem statement to match the evidence.",
     "show": 0
    },
    {
     "say": "Then write the discovery doc: who you talked to, what you asked, key insights, and what changes for the feature.",
     "show": 4
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "What counts as a discovery insight?",
   "options": [
    "The strongest opinion from your best interview",
    "Anything a user says they would pay for",
    "A pattern repeated across multiple people"
   ],
   "answer": 2,
   "good": "That's right. An insight is a pattern repeated across multiple people, not one person's opinion.",
   "bad": "Not quite. An insight is a pattern repeated across multiple people, not one person's opinion.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "What counts as a discovery insight?",
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
     "A discovery doc with interview insights",
     ""
    ],
    [
     "Changes to the feature direction noted",
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
     "say": "you have a discovery doc summarizing your interview insights,",
     "show": 1
    },
    {
     "say": "and any resulting changes to the feature direction.",
     "show": 2
    },
    {
     "say": "Next, in Module 5, you'll design the full feature flow.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Project 5 (Module 5): Design and Prototype an AI Feature Flow

**Time: about 1.5 hours**

**Goal:** Design the full user-facing interaction, not just the AI logic, but what the person actually sees and does.

**Step 1: Create the project notebook.**
Create a new notebook for this project (**File → New notebook**) and name it `feature_flow_project`.

**Step 2: Map the happy path.**
The **happy path** is the ideal sequence of steps when everything goes right, user opens the feature, provides input, gets a good result.

**Step 3: Design the input step.**
Sketch (on paper or in a simple tool) how the user provides input to your Project 3 chatbot or Project 2 feature.

**Step 4: Design the loading/waiting state.**
**latency masking** is showing the user something (a message, an animation) while the AI processes, instead of a frozen screen.

**Step 5: Design the error state.**
Sketch what the user sees when the API fails, times out, or returns something unusable.

**Step 6: Design the "AI might be wrong" state.**
**uncertainty UX** communicates confidence level or invites correction (e.g., "Was this helpful? [Yes/No]") instead of presenting AI output as unquestionable fact.

**Step 7: Build a clickable or written walkthrough of the full flow.**
Combine Steps 2–6 into one sequence, either as simple mockup screens or a written step-by-step description.

### Final Project Structure

*If you worked in a notebook, these are the sections of your notebook (text and code cells), not separate files. Save or export them as files when you put the project in your portfolio.*

```text
feature_flow_project/
│
├── flow_diagram.png (or flow_diagram.md)
├── screens/ (if using mockups)
```

### What You Learned
- ✅ Mapping a feature's happy path
- ✅ Designing input collection for AI features
- ✅ Masking latency during AI processing
- ✅ Designing error states for AI failures
- ✅ Designing for AI uncertainty (not presenting output as infallible)
- ✅ Assembling a full end-to-end interaction flow

### Portfolio Project
**AI Feature UX Flow**: Designed a complete user interaction flow for an AI-powered feature, including input design, latency handling, error states, and uncertainty communication.
**Skills:** UX Design, AI Product Design, Prototyping, User-Centered Design.

**Deliverable:** A designed and prototyped end-to-end flow for the AI feature, covering the happy path, loading, error, and uncertainty states.

### Quiz

1. What is the happy path?
2. What is latency masking?
3. Why design a separate error state?
4. What does uncertainty UX do?

*Answers: 1) The ideal sequence of steps when everything goes right. 2) Showing the user something, such as a message or animation, while the AI works instead of a frozen screen. 3) API calls can fail, time out, or return unusable output, and users need a clear message and next step when that happens. 4) It signals that AI output may be wrong and invites correction, rather than presenting it as unquestionable fact.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "cursor",
   "kicker": "Project 5 · Feature flow",
   "title": "Design what people see",
   "beats": [
    {
     "say": "Welcome to Module 5."
    },
    {
     "say": "Now you design the full user-facing interaction. Not just the A I logic, but what the person actually sees and does."
    }
   ]
  },
  {
   "kind": "flow",
   "art": "path",
   "kicker": "Steps 2 and 3",
   "title": "Map the happy path",
   "steps": [
    "Open the feature",
    "Provide input",
    "Get a good result"
   ],
   "beats": [
    {
     "say": "Start with the happy path: the ideal sequence when everything goes right.",
     "show": 0
    },
    {
     "say": "The user opens the feature.",
     "show": 1
    },
    {
     "say": "Provides input.",
     "show": 2
    },
    {
     "say": "And gets a good result.",
     "show": 3
    },
    {
     "say": "Sketch the input step, on paper or in a simple tool.",
     "show": 3
    }
   ]
  },
  {
   "kind": "list",
   "art": "stopwatch",
   "kicker": "Steps 4 and 5",
   "title": "Loading and error states",
   "items": [
    [
     "Loading",
     "Latency masking, not a frozen screen"
    ],
    [
     "Error",
     "Fails, times out, or unusable output"
    ]
   ],
   "beats": [
    {
     "say": "But things don't always go right.",
     "show": 0
    },
    {
     "say": "Latency masking means showing something, a message or an animation, while the A I works, instead of a frozen screen.",
     "show": 1
    },
    {
     "say": "And design an error state for when the A P I fails, times out, or returns something unusable.",
     "show": 2
    }
   ]
  },
  {
   "kind": "quote",
   "art": "warning",
   "kicker": "Step 6",
   "title": "The \"AI might be wrong\" state",
   "quote": "Was this helpful? [Yes / No]",
   "beats": [
    {
     "say": "Then design for uncertainty.",
     "show": 0
    },
    {
     "say": "Uncertainty U X communicates confidence, or invites correction, like asking was this helpful, yes or no.",
     "show": 1
    },
    {
     "say": "It never presents A I output as unquestionable fact.",
     "show": 1
    }
   ]
  },
  {
   "kind": "big",
   "art": "layout",
   "kicker": "Step 7",
   "title": "One complete walkthrough",
   "big": "Full flow",
   "sub": "happy path · loading · error · uncertainty",
   "beats": [
    {
     "say": "Finally, combine everything into one sequence, as simple mockup screens or a written walkthrough.",
     "show": 0
    },
    {
     "say": "Happy path, loading, error, and uncertainty, all in one flow.",
     "show": 1
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "What is latency masking?",
   "options": [
    "Hiding errors from the user",
    "Making the AI respond faster",
    "Showing the user something while the AI works, instead of a frozen screen"
   ],
   "answer": 2,
   "good": "That's right. Latency masking shows a message or animation while the A I works, instead of a frozen screen.",
   "bad": "Not quite. Latency masking shows a message or animation while the A I works, instead of a frozen screen.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "What is latency masking?",
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
     "A designed end-to-end flow",
     ""
    ],
    [
     "Happy path, loading, error, uncertainty",
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
     "say": "you have a designed end-to-end flow for the A I feature,",
     "show": 1
    },
    {
     "say": "covering the happy path, loading, error and uncertainty states.",
     "show": 2
    },
    {
     "say": "Next, in Module 6, you'll plan how to evaluate the feature.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Project 6 (Module 6): Define an Evaluation Plan for the AI Feature

**Time: about 1.5 hours**

**Goal:** Decide, in advance, how you'll know if the feature is actually good, before it ships, not after complaints arrive.

**Step 1: Create the project notebook.**
Create a new notebook for this project (**File → New notebook**) and name it `evaluation_plan_project`.

**Step 2: Build a test set from your Project 2 notes.**
Add a **text cell** headed `test_cases` and write your notes in it.
Turn your documented failures and successes into a list of 10–15 concrete input/expected-output pairs.

**Step 3: Define a quality rubric.**
A **rubric** is a scoring guide (e.g., 1–5) for judging subjective AI output on specific dimensions like accuracy, tone, and helpfulness.

**Step 4: Score your Project 2/3 prototype against the test set.**
Run each test case through your prototype and score it using your rubric. First run the API key cell from "Before you start", then paste in and run your `run_feature` cell from Project 2 (Step 5). This cell runs every test case and prints the output next to what you expected:
```python
# Template: replace these examples with the 10-15 test cases from your test_cases cell.
test_cases = [
    {"input": "I was charged twice for my subscription this month. Please refund one payment.",
     "expected": "Mentions the double charge and the refund request."},
    {"input": "The app logs me out every time I switch to another tab.",
     "expected": "Mentions being logged out when switching tabs."},
]

outputs = []
for i, case in enumerate(test_cases, start=1):
    output = run_feature(case["input"])
    outputs.append(output)
    print(f"--- Test {i}\nInput: {case['input']}\nExpected: {case['expected']}\nGot: {output}\n")
```
Then type your rubric scores into a list, one per test case, and average them. That average is your **baseline score**:
```python
scores = [4, 5]  # Template: replace with your 1-5 rubric score for each test case, in order
print(f"Baseline score: {sum(scores) / len(scores):.1f} out of 5 across {len(scores)} test cases")
```

**Step 5: Distinguish quality metrics from business metrics.**
**quality metrics** measure whether the AI's output is good (accuracy, relevance); **business metrics** measure whether the feature achieves your Project 1 goal (ticket resolution time, user retention).

**Step 6: Design a feedback loop.**
A **feedback loop** is a mechanism (like a thumbs up/down button from Project 5) that captures real user signal after launch.

**Step 7: Write the evaluation plan.**
Add a **text cell** headed `evaluation_plan` and write your notes in it.
Structure: Test set → Rubric → Baseline scores → Quality vs. business metrics → Feedback loop plan.

### Final Project Structure

*If you worked in a notebook, these are the sections of your notebook (text and code cells), not separate files. Save or export them as files when you put the project in your portfolio.*

```text
evaluation_plan_project/
│
├── test_cases.md
├── rubric.md
├── baseline_scores.md
├── evaluation_plan.md
```

### What You Learned
- ✅ Building a test set from real observed failures
- ✅ Writing a scoring rubric for subjective AI output
- ✅ Establishing a baseline quality score
- ✅ Distinguishing quality metrics from business metrics
- ✅ Designing a post-launch feedback loop
- ✅ Assembling a full evaluation plan

### Portfolio Project
**AI Feature Evaluation Plan**: Built a test set and scoring rubric from observed prototype failures, established a baseline quality score, and designed a post-launch feedback loop.
**Skills:** AI Evaluation, Quality Assurance, Metrics Design, Analytical Thinking, AI Product Development.

**Deliverable:** A written evaluation plan with a test set, rubric, baseline scores, and feedback loop design.

### Quiz

1. Where should your test set come from?
2. What is a rubric used for?
3. What is the difference between quality metrics and business metrics?
4. Why measure a baseline score before launch?

*Answers: 1) From real observed successes and failures, such as your Project 2 notes, turned into concrete input and expected-output pairs. 2) Scoring subjective AI output consistently on dimensions such as accuracy, tone, and helpfulness. 3) Quality metrics judge whether the output is good; business metrics judge whether the feature reaches the product goal. 4) It gives you a reference point to compare later changes against and to set launch criteria.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "test",
   "kicker": "Project 6 · Evaluation plan",
   "title": "Decide what good looks like",
   "beats": [
    {
     "say": "Welcome to Module 6."
    },
    {
     "say": "Decide in advance how you'll know the feature is actually good. Before it ships, not after complaints arrive."
    }
   ]
  },
  {
   "kind": "list",
   "art": "table",
   "kicker": "Steps 2 and 3",
   "title": "Test set and rubric",
   "items": [
    [
     "Test set",
     "10 to 15 input / expected-output pairs"
    ],
    [
     "Rubric",
     "1 to 5 on accuracy, tone, helpfulness"
    ]
   ],
   "beats": [
    {
     "say": "In a text cell headed test cases, turn your Project 2 notes into ten to fifteen concrete input and expected-output pairs.",
     "show": 1
    },
    {
     "say": "Use real observed successes and failures.",
     "show": 1
    },
    {
     "say": "Then define a rubric: a scoring guide, say one to five, for judging output on dimensions like accuracy, tone and helpfulness.",
     "show": 2
    }
   ]
  },
  {
   "kind": "code",
   "art": "calc",
   "kicker": "Step 4",
   "title": "Run it and get a baseline",
   "file": "evaluation",
   "code": "outputs = []\nfor i, case in enumerate(test_cases, start=1):\n    output = run_feature(case[\"input\"])\n    outputs.append(output)\n    print(f\"--- Test {i}\\nInput: {case['input']}\\nExpected: {case['expected']}\\nGot: {output}\\n\")\n\nscores = [4, 5]  # your 1-5 rubric score per test case\nprint(f\"Baseline score: {sum(scores) / len(scores):.1f} out of 5\")",
   "beats": [
    {
     "say": "Run every test case through your run feature function, and print the output next to what you expected.",
     "show": 0
    },
    {
     "say": "Score each one with your rubric, type the scores into a list, and average them.",
     "show": 1
    },
    {
     "say": "That average is your baseline score.",
     "show": 1
    }
   ]
  },
  {
   "kind": "list",
   "art": "bars",
   "kicker": "Steps 5 and 6",
   "title": "Two kinds of metric, plus feedback",
   "items": [
    [
     "Quality metrics",
     "Is the output good?"
    ],
    [
     "Business metrics",
     "Does it reach the product goal?"
    ],
    [
     "Feedback loop",
     "Real user signal after launch"
    ]
   ],
   "beats": [
    {
     "say": "Quality metrics measure whether the A I's output is good, like accuracy and relevance.",
     "show": 1
    },
    {
     "say": "Business metrics measure whether the feature reaches your Project 1 goal, like ticket resolution time or retention.",
     "show": 2
    },
    {
     "say": "And a feedback loop, like the thumbs up or down from Project 5, captures real user signal after launch.",
     "show": 3
    }
   ]
  },
  {
   "kind": "flow",
   "art": "doc",
   "kicker": "Step 7",
   "title": "Write the evaluation plan",
   "steps": [
    "Test set",
    "Rubric",
    "Baseline scores",
    "Quality vs. business",
    "Feedback loop"
   ],
   "beats": [
    {
     "say": "Write it up in a text cell headed evaluation plan.",
     "show": 0
    },
    {
     "say": "Test set, rubric, baseline scores, quality versus business metrics, and the feedback loop plan.",
     "show": 5
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Why measure a baseline score before launch?",
   "options": [
    "It gives you a reference point to compare later changes and set launch criteria",
    "The API requires it",
    "It replaces the need for user feedback"
   ],
   "answer": 0,
   "good": "That's right. It gives you a reference point to compare later changes against, and to set launch criteria.",
   "bad": "Not quite. It gives you a reference point to compare later changes against, and to set launch criteria.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Why measure a baseline score before launch?",
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
     "A written evaluation plan",
     ""
    ],
    [
     "Test set, rubric, baseline, feedback loop",
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
     "say": "you have a written evaluation plan,",
     "show": 1
    },
    {
     "say": "with a test set, rubric, baseline scores and feedback loop design.",
     "show": 2
    },
    {
     "say": "Next, in Module 7, you'll plan the launch.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Project 7 (Module 7): Build a Launch Plan for the AI Feature

**Time: about 1.5 hours**

**Goal:** Package everything you've built into a plan for actually shipping the feature.

**Step 1: Create the project notebook.**
Create a new notebook for this project (**File → New notebook**) and name it `launch_plan_project`.

**Step 2: Define the launch scope.**
A **limited launch** (or beta) releases a feature to a small subset of users first, instead of everyone at once.

**Step 3: Set launch criteria.**
Using your Project 6 baseline scores, define the minimum quality bar the feature must hit before it launches even to a limited audience.

**Step 4: Plan the rollout stages.**
Roll the feature out in three stages, each gated by criteria before moving on:

```mermaid
flowchart LR
    IT["Internal testing"] -->|meets quality bar| LB["Limited beta"]
    LB -->|feedback positive| FL["Full launch"]
```

**Step 5: Identify who needs to be involved.**
List roles: engineering (to build it), your Project 6 evaluation reviewer, and anyone who needs to sign off before wider release.

**Step 6: Plan post-launch monitoring.**
Reference your Project 6 feedback loop: what will you watch in the first week, and what would trigger a rollback?

**Step 7: Write the launch plan.**
Add a **text cell** headed `launch_plan` and write your notes in it.
Structure: Launch scope → Criteria to launch → Rollout stages → Stakeholders → Post-launch monitoring plan.

### Final Project Structure

*If you worked in a notebook, these are the sections of your notebook (text and code cells), not separate files. Save or export them as files when you put the project in your portfolio.*

```text
launch_plan_project/
│
├── launch_plan.md
```

### What You Learned
- ✅ Scoping a limited (beta) launch
- ✅ Setting measurable launch criteria
- ✅ Planning staged rollout
- ✅ Identifying required stakeholders
- ✅ Planning post-launch monitoring and rollback triggers
- ✅ Assembling a complete launch plan

### Portfolio Project
**AI Feature Launch Plan**: Defined launch criteria based on evaluation benchmarks, planned a staged rollout with stakeholder sign-offs, and designed post-launch monitoring with rollback triggers.
**Skills:** Product Launch Planning, Risk Management, Cross-Functional Coordination, AI Product Development.

**Deliverable:** A launch plan covering scope, criteria, rollout stages, stakeholders, and post-launch monitoring.

### Quiz

1. Why launch to a limited group first?
2. What gates moving from one rollout stage to the next?
3. What should a post-launch monitoring plan include?

*Answers: 1) Problems show up with fewer people affected, so you can fix them before a full launch. 2) Defined criteria, such as meeting the quality bar from your evaluation plan or getting positive beta feedback. 3) What you will watch in the first week and what would trigger a rollback.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "rocket",
   "kicker": "Project 7 · Launch plan",
   "title": "Plan how it ships",
   "beats": [
    {
     "say": "Welcome to the last module."
    },
    {
     "say": "You'll package everything you've built into a plan for actually shipping the feature."
    }
   ]
  },
  {
   "kind": "big",
   "art": "people",
   "kicker": "Steps 2 and 3",
   "title": "Start small, with a quality bar",
   "big": "Limited launch",
   "sub": "small group first, gated by your quality bar",
   "beats": [
    {
     "say": "A limited launch, or beta, releases a feature to a small subset of users first, instead of everyone at once.",
     "show": 0
    },
    {
     "say": "Problems show up with fewer people affected. And using your Project 6 baseline, set the minimum quality bar it must hit before even a limited launch.",
     "show": 1
    }
   ]
  },
  {
   "kind": "flow",
   "art": "roadmap",
   "kicker": "Step 4",
   "title": "Roll out in stages",
   "steps": [
    "Internal testing",
    "Limited beta",
    "Full launch"
   ],
   "beats": [
    {
     "say": "Roll out in three stages, each gated by criteria.",
     "show": 0
    },
    {
     "say": "First, internal testing.",
     "show": 1
    },
    {
     "say": "Once it meets the quality bar, a limited beta.",
     "show": 2
    },
    {
     "say": "And when beta feedback is positive, the full launch.",
     "show": 3
    }
   ]
  },
  {
   "kind": "list",
   "art": "network",
   "kicker": "Steps 5 and 6",
   "title": "People and monitoring",
   "items": [
    [
     "Stakeholders",
     "Engineering, reviewer, sign-offs"
    ],
    [
     "Monitoring",
     "First week + rollback triggers"
    ]
   ],
   "beats": [
    {
     "say": "List who needs to be involved: engineering, your evaluation reviewer, and anyone who signs off before wider release.",
     "show": 1
    },
    {
     "say": "Then plan monitoring, building on your feedback loop.",
     "show": 2
    },
    {
     "say": "What will you watch in the first week, and what would trigger a rollback?",
     "show": 2
    }
   ]
  },
  {
   "kind": "flow",
   "art": "doc",
   "kicker": "Step 7",
   "title": "Write the launch plan",
   "steps": [
    "Scope",
    "Launch criteria",
    "Rollout stages",
    "Stakeholders",
    "Monitoring"
   ],
   "beats": [
    {
     "say": "Write it up in a text cell headed launch plan.",
     "show": 0
    },
    {
     "say": "Launch scope, criteria to launch, rollout stages, stakeholders, and the post-launch monitoring plan.",
     "show": 5
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "What gates moving from one rollout stage to the next?",
   "options": [
    "A fixed number of days passing",
    "Defined criteria, like meeting the quality bar or positive beta feedback",
    "Whenever engineering is ready"
   ],
   "answer": 1,
   "good": "That's right. Defined criteria gate each stage, such as meeting the quality bar from your evaluation plan, or positive beta feedback.",
   "bad": "Not quite. Defined criteria gate each stage, such as meeting the quality bar from your evaluation plan, or positive beta feedback.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "What gates moving from one rollout stage to the next?",
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
     "Scope, criteria and rollout stages",
     ""
    ],
    [
     "Stakeholders and monitoring",
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
     "say": "you have a launch plan covering scope, criteria and rollout stages,",
     "show": 1
    },
    {
     "say": "plus stakeholders and post-launch monitoring with rollback triggers.",
     "show": 2
    },
    {
     "say": "You've finished AI Product Engineer. Well done.",
     "show": 2
    }
   ]
  }
 ]
}
```
