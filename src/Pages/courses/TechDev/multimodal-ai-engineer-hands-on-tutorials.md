<!-- order: 22 -->
# Multimodal AI Engineer: Hands-On Project Tutorials

This course is a series of hands-on projects. You learn each idea at the moment you need it, while building the thing.

**By the end of this course, you'll be able to:**
- Compare vision-language, speech, and image-generation models by format, limits, and cost
- Send images and text together to the Claude API and reuse that call in later projects
- Extract basic image and audio features, including a histogram and a spectrogram
- Build an image captioning tool and a FastAPI app that answers typed or spoken questions about an image
- Build a search tool that finds text documents and images with one text query
- Evaluate a multimodal system for accuracy, hallucination, failure modes, and bias

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

**A few projects run on your computer.** Projects that build a web app, a job queue, or a scheduled task keep running in the background, and a notebook can't host that. Those projects say so at the top and use a code editor and your terminal instead: VS Code, plus Terminal on a Mac or PowerShell on Windows.

---

## Project 1 (Module 1): Survey and Compare Multimodal Models

**Time: about 1.5 hours**

**Goal:** Understand what tools exist before building anything, the landscape you'll be pulling from for every later project.

**Step 1: Create the project notebook.**
Create a new notebook for this project (**File → New notebook**) and name it `multimodal_survey_project`.

**Step 2: Understand the four modalities this course covers.**
**text** (words), **image** (still pictures), **audio** (speech/sound), **video** (moving images, often with audio), a **multimodal model** processes and/or generates more than one of these.

**Step 3: Identify model categories by capability.**
Add a **text cell** headed `model_survey` and write your notes in it.
**vision-language models (VLMs)** understand images and text together; **speech-to-text (STT)** and **text-to-speech (TTS)** models convert between audio and text; **image generation models** create images from text prompts.

**Step 4: Research 2–3 models per category.**
For vision-language, speech, and image generation, note at least two available model options and one key differentiator each (cost, quality, latency, or licensing).

**Step 5: Note input/output formats for each.**
For each model, write down what format it expects as input (e.g., base64-encoded image, raw audio file) and what it returns.

**Step 6: Note context window and size limits.**
Multimodal models often have limits on image resolution, audio length, or combined token count that differ from pure text models.

**Step 7: Write a comparison summary.**
Add a **text cell** headed `comparison_summary` and write your notes in it.
For each modality combination (text+image, speech+text, text+image-generation), note your top pick and why.

### Final Project Structure

*If you worked in a notebook, these are the sections of your notebook (text and code cells), not separate files. Save or export them as files when you put the project in your portfolio.*

```text
multimodal_survey_project/
│
├── model_survey.md
├── comparison_summary.md
```

### What You Learned
- ✅ The four core modalities and what "multimodal" precisely means
- ✅ Model categories: VLMs, STT, TTS, image generation
- ✅ Comparing models within each category
- ✅ Input/output format requirements per model
- ✅ Context window and size limits for multimodal models
- ✅ Producing a reference comparison for future projects

### Portfolio Project
**Multimodal Model Landscape Survey**: Researched and compared vision-language, speech, and image-generation models across cost, quality, format requirements, and size limits.
**Skills:** Technical Research, Model Evaluation, Multimodal AI, Technical Writing.

**Deliverable:** A model survey and comparison summary covering at least three multimodal model categories.

### Quiz

1. What makes a model multimodal?
2. What does a vision-language model do, and how is it different from a speech-to-text model?
3. Why should you write down each model's input and output formats before building anything?
4. Name two kinds of limits that multimodal models often have beyond plain text models.

*Answers: 1) It processes and/or generates more than one modality, such as text, image, audio, or video. 2) A vision-language model understands images and text together; a speech-to-text model converts spoken audio into text. 3) Your code must send data in exactly the format the model expects (for example a base64 image or an audio file) and handle what it returns. 4) Limits on image resolution or file size, audio length, or total tokens across the combined input.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "search",
   "kicker": "Project 1 · Survey multimodal models",
   "title": "Know your tools first",
   "beats": [
    {
     "say": "Welcome to Multimodal A I Engineer."
    },
    {
     "say": "Before you build anything, you'll survey the models you'll be pulling from in every later project."
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Step 2 · Concept",
   "title": "Four modalities",
   "columns": [
    "Modality",
    "What it is",
    "In this course"
   ],
   "rows": [
    [
     "Text",
     "words",
     "questions, captions"
    ],
    [
     "Image",
     "still pictures",
     "test_image.jpg"
    ],
    [
     "Audio",
     "speech and sound",
     "test_audio.wav"
    ],
    [
     "Video",
     "moving images + audio",
     "survey only"
    ]
   ],
   "beats": [
    {
     "say": "This course works with four kinds of data, called modalities."
    },
    {
     "say": "Text: words, like a question or a caption.",
     "hl": 0
    },
    {
     "say": "Image: still pictures, like the test photo you'll use from Project 2.",
     "hl": 1
    },
    {
     "say": "Audio: speech and sound, like the voice clip in Project 3.",
     "hl": 2
    },
    {
     "say": "And video: moving images, often with audio as well.",
     "hl": 3
    },
    {
     "say": "A model is multimodal when it takes in or produces more than one of these.",
     "sql": "multimodal = processes and/or generates 2+ modalities",
     "hl": [
      0,
      1,
      2,
      3
     ]
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Step 3 · Concept",
   "title": "Model categories: what turns into what",
   "nodes": [
    {
     "id": "img",
     "label": "Image",
     "x": 15,
     "y": 25,
     "sub": "still picture",
     "art": "image"
    },
    {
     "id": "txt",
     "label": "Text",
     "x": 50,
     "y": 60,
     "sub": "words",
     "art": "chat"
    },
    {
     "id": "aud",
     "label": "Audio",
     "x": 85,
     "y": 25,
     "sub": "speech",
     "art": "wave"
    }
   ],
   "edges": [
    {
     "from": "img",
     "to": "txt"
    },
    {
     "from": "txt",
     "to": "aud"
    }
   ],
   "beats": [
    {
     "say": "Sort models by what they turn into what. Here are three modalities.",
     "show": 3
    },
    {
     "say": "A vision-language model, or V L M, reads an image and text together, and answers in text.",
     "show": 3,
     "on": [
      "img",
      "txt"
     ],
     "send": {
      "from": "img",
      "to": "txt",
      "label": "VLM: describe"
     }
    },
    {
     "say": "A speech-to-text model, S T T, turns spoken audio into text.",
     "show": 3,
     "on": "aud",
     "send": {
      "from": "aud",
      "to": "txt",
      "label": "STT: transcribe"
     }
    },
    {
     "say": "Text-to-speech, T T S, goes the other way: text becomes audio.",
     "show": 3,
     "on": "txt",
     "send": {
      "from": "txt",
      "to": "aud",
      "label": "TTS: speak"
     }
    },
    {
     "say": "And an image generation model creates a new image from a text prompt.",
     "show": 3,
     "on": "img",
     "send": {
      "from": "txt",
      "to": "img",
      "label": "generate"
     }
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Steps 4 and 5 · Survey",
   "title": "Write down what goes in and what comes out",
   "columns": [
    "Category",
    "Example",
    "Input",
    "Output"
   ],
   "rows": [
    [
     "Vision-language",
     "Claude",
     "base64 image + text",
     "text"
    ],
    [
     "Speech-to-text",
     "Whisper",
     "WAV, MP3 or M4A file",
     "text"
    ],
    [
     "Text-to-speech",
     "gTTS",
     "text",
     "MP3 file"
    ],
    [
     "Image generation",
     "your pick",
     "text prompt",
     "image"
    ]
   ],
   "beats": [
    {
     "say": "In a text cell called model survey, research two or three models per category. Here are ones this course uses later."
    },
    {
     "say": "Claude is a vision-language model. It takes a base sixty four image plus text, and returns text.",
     "hl": 0
    },
    {
     "say": "Whisper is speech-to-text. It reads an audio file, like a W A V or M P 3, and returns text.",
     "hl": 1
    },
    {
     "say": "g T T S is text-to-speech. It takes text and saves an M P 3.",
     "hl": 2
    },
    {
     "say": "For image generation, pick models yourself: the input is a text prompt, the output an image.",
     "hl": 3
    },
    {
     "say": "These formats matter, because your code must send exactly what each model expects.",
     "col": 2
    },
    {
     "say": "For each model, also note one differentiator: cost, quality, latency, or licensing.",
     "sql": "differentiator: cost · quality · latency · licensing",
     "col": 1
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Step 6 · Limits",
   "title": "Multimodal limits differ from plain text",
   "columns": [
    "Limit",
    "Why it matters",
    "Course example"
   ],
   "rows": [
    [
     "Image resolution",
     "big images cost more",
     "resize to 1024 px"
    ],
    [
     "Audio length",
     "long clips are slow",
     "a 5 to 30 s clip"
    ],
    [
     "Combined tokens",
     "image + text add up",
     "short questions"
    ]
   ],
   "beats": [
    {
     "say": "Step six: write down each model's size limits. They're different from plain text models."
    },
    {
     "say": "Image resolution. Large images cost more and can hit the size limit, so in Project 2 you'll shrink them to fit 1024 pixels.",
     "hl": 0
    },
    {
     "say": "Audio length. Project 3 uses a short clip, between five and thirty seconds.",
     "hl": 1
    },
    {
     "say": "And combined tokens. The image and your text both count toward one total.",
     "hl": 2
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Step 7 · Summary",
   "title": "From notes to a top pick per combination",
   "values": [
    "text + image",
    "speech + text",
    "text + image gen"
   ],
   "beats": [
    {
     "say": "Last, in a text cell called comparison summary, pick a winner for each combination."
    },
    {
     "say": "Text plus image: which vision-language model would you build with, and why?",
     "hl": 0,
     "ptr": {
      "now": 0
     }
    },
    {
     "say": "Speech plus text: which speech model fits your cost and quality needs?",
     "ok": [
      0
     ],
     "hl": 1,
     "ptr": {
      "now": 1
     }
    },
    {
     "say": "Text plus image generation: your top pick, with a reason.",
     "ok": [
      0,
      1
     ],
     "hl": 2,
     "ptr": {
      "now": 2
     }
    },
    {
     "say": "Three combinations, three reasoned picks. You'll come back to this in every later project.",
     "ok": [
      0,
      1,
      2
     ],
     "note": "your reference for Projects 2 to 7"
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Why write down each model's input and output formats before building?",
   "options": [
    "So you can pick the cheapest model",
    "Formats only matter for audio",
    "Your code must send data in exactly the format the model expects"
   ],
   "answer": 2,
   "good": "That's right. Your code must send data in exactly the format the model expects, like a base64 image or an audio file, and handle what it returns.",
   "bad": "Not quite. Your code must send data in exactly the format the model expects, like a base64 image or an audio file, and handle what it returns.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Why write down each model's input and output formats before building?",
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
     "A model survey",
     ""
    ],
    [
     "A comparison summary across three categories",
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
     "say": "you have a model survey,",
     "show": 1
    },
    {
     "say": "and a comparison summary covering at least three multimodal model categories.",
     "show": 2
    },
    {
     "say": "Next, in Module 2, sending an image and text together.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Project 2 (Module 2): Build a Script That Processes Image and Text Inputs

**Time: about 3 hours**

**Goal:** Handle two modalities at once for the first time, the foundational mechanic behind every later project.

**Step 1: Create the project notebook.**
Create a new notebook for this project (**File → New notebook**) and name it `image_text_project`.
```python
%pip install requests pillow
```

Run the API key cell from "Before you start" next, so `ANTHROPIC_API_KEY` is set.

**Step 2: Load and inspect an image.**
Drag a photo into the **Files** panel and name it `test_image.jpg`. Add a **code cell**, paste in the code below, and run it with **Shift + Enter**.
```python
from PIL import Image
img = Image.open("test_image.jpg")
print(img.size, img.format)
```
`.size` gives width and height in pixels; `.format` gives the file type (JPEG, PNG).

**Step 3: Encode the image for API use.**
```python
import base64

with open("test_image.jpg", "rb") as f:
    image_data = base64.b64encode(f.read()).decode("utf-8")
```
**base64 encoding** converts binary image data into a text string that can be safely included in a JSON API request.

**Step 4: Send an image + text request.**
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
        "max_tokens": 300,
        "messages": [{
            "role": "user",
            "content": [
                {"type": "image", "source": {"type": "base64", "media_type": "image/jpeg", "data": image_data}},
                {"type": "text", "text": "Describe what's in this image."}
            ]
        }]
    }
)
print(response.json())
```
The **content array** lets a single message mix multiple content types (image and text blocks) instead of just plain text. The model's reply is in `response.json()["content"]`, a list of blocks; the text is in the blocks whose `type` is `"text"`.

**Step 5: Test with different images and questions.**
Run the script against 3–4 different images, asking different questions each time (description, counting objects, reading text in the image).

**Step 6: Handle image size limits.**
```python
img.thumbnail((1024, 1024))
img.convert("RGB").save("resized_image.jpg")
```
**thumbnailing** resizes an image down while preserving aspect ratio. Large images cost more and can hit the API's size limit, so resizing first is a good habit. `.convert("RGB")` lets you save PNGs with transparency as JPEG.

**Step 7: Wrap the logic in a reusable function.**
This cell is the core of the whole course. Later projects reuse it, so keep it handy.
```python
import base64
import os
import requests

MEDIA_TYPES = {".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png",
               ".gif": "image/gif", ".webp": "image/webp"}

def ask_claude_about_image(image_bytes, media_type, question, max_tokens=300):
    """Send raw image bytes plus a question to Claude and return the answer text."""
    image_data = base64.b64encode(image_bytes).decode("utf-8")
    response = requests.post(
        "https://api.anthropic.com/v1/messages",
        headers={
            "x-api-key": os.environ["ANTHROPIC_API_KEY"],
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        },
        json={
            "model": "claude-sonnet-5-5",
            "max_tokens": max_tokens,
            "system": "You describe images accurately. If you can't tell something from the image, say so instead of guessing.",
            "messages": [{
                "role": "user",
                "content": [
                    {"type": "image", "source": {"type": "base64", "media_type": media_type, "data": image_data}},
                    {"type": "text", "text": question},
                ],
            }],
        },
        timeout=60,
    )
    response.raise_for_status()  # stop with a clear error if the request failed
    blocks = response.json()["content"]
    return "".join(block["text"] for block in blocks if block["type"] == "text")

def describe_image(image_path, question):
    """Open an image file and ask Claude a question about it."""
    extension = os.path.splitext(image_path)[1].lower()
    if extension not in MEDIA_TYPES:
        raise ValueError(f"Unsupported image type: {extension}")
    with open(image_path, "rb") as f:
        return ask_claude_about_image(f.read(), MEDIA_TYPES[extension], question)

print(describe_image("resized_image.jpg", "Describe what's in this image in two sentences."))
```
The `"system"` field is a top-level instruction that applies to the whole conversation; it is not one of the messages. The `media_type` must match the real file type, which is why the function looks at the file extension.

### Final Project Structure

*If you worked in a notebook, these are the sections of your notebook (text and code cells), not separate files. Save or export them as files when you put the project in your portfolio.*

```text
image_text_project/
│
├── process.py
├── test_image.jpg
```

### What You Learned
- ✅ Loading and inspecting images with Pillow
- ✅ Base64 encoding images for API requests
- ✅ Building multimodal content arrays (image + text)
- ✅ Testing across varied images and questions
- ✅ Resizing images to respect size limits
- ✅ Wrapping multimodal calls in a reusable function

### Portfolio Project
**Image + Text Processing Script**: Built a reusable Python function that sends images alongside text prompts to a vision-language model API, tested across varied images and questions.
**Skills:** Python, Multimodal APIs, Image Processing, Vision-Language Models.

**Deliverable:** A working script that processes image + text input and returns model responses, tested on multiple images.

### Quiz

1. Why do you base64-encode an image before sending it to the API?
2. How does one message send both an image and a question?
3. Where does the system prompt go in a Messages API request?
4. Why does `describe_image` check the file extension?

*Answers: 1) JSON requests carry text, and base64 turns the image's binary bytes into a text string that fits safely inside the JSON. 2) The message's `content` is a list holding an image block and a text block. 3) In a top-level `"system"` field, separate from the `messages` list. 4) The `media_type` in the image block must match the real file type (for example `image/jpeg` or `image/png`), and unsupported types should fail early with a clear error.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "api",
   "kicker": "Project 2 · Image and text inputs",
   "title": "Two modalities at once",
   "beats": [
    {
     "say": "Welcome to Module 2."
    },
    {
     "say": "For the first time, you'll send an image and a question together, the core mechanic behind every later project."
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Steps 2 and 3",
   "title": "Load and encode an image",
   "file": "image_text_project",
   "code": "from PIL import Image\nimg = Image.open(\"test_image.jpg\")\nprint(img.size, img.format)\n\nimport base64\nwith open(\"test_image.jpg\", \"rb\") as f:\n    image_data = base64.b64encode(\n        f.read()).decode(\"utf-8\")",
   "beats": [
    {
     "say": "Pillow opens the photo you dragged into the Files panel.",
     "line": [
      1,
      2
     ],
     "vars": {
      "img": "<JPEG image>"
     }
    },
    {
     "say": "Say it's a phone photo. Size gives width and height in pixels, and format gives the file type.",
     "line": 3,
     "out": "(4032, 3024) JPEG"
    },
    {
     "say": "Now open the same file in r b mode, which reads its raw bytes.",
     "line": [
      5,
      6
     ]
    },
    {
     "say": "Base sixty four turns those bytes into plain text characters. Every J P E G starts the same way.",
     "line": [
      7,
      8
     ],
     "vars": {
      "image_data": "\"/9j/4AAQSkZJRg…\""
     }
    },
    {
     "say": "That string can go safely inside a J S O N request.",
     "line": [
      7,
      8
     ]
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Concept · base64",
   "title": "Every 3 bytes become 4 text characters",
   "values": [
    "FF",
    "D8",
    "FF",
    "E0",
    "00",
    "10"
   ],
   "beats": [
    {
     "say": "Here are the first six bytes of a J P E G file, written in hex. Bytes like these can't go inside J S O N text."
    },
    {
     "say": "Base sixty four takes them three at a time: F F, D 8, F F. That's twenty four bits.",
     "hl": [
      0,
      1,
      2
     ],
     "note": "3 bytes = 24 bits"
    },
    {
     "say": "It cuts those bits into four groups of six, and each group becomes one safe character.",
     "vals": [
      "/",
      "9",
      "j",
      "/",
      "E0",
      "00",
      "10"
     ],
     "hl": [
      0,
      1,
      2,
      3
     ],
     "note": "24 bits = 4 × 6 bits → /9j/"
    },
    {
     "say": "The next three bytes become four more characters: four, A, A, Q.",
     "vals": [
      "/",
      "9",
      "j",
      "/",
      "4",
      "A",
      "A",
      "Q"
     ],
     "ok": [
      0,
      1,
      2,
      3
     ],
     "hl": [
      4,
      5,
      6,
      7
     ],
     "note": "E0 00 10 → 4AAQ"
    },
    {
     "say": "So six bytes became eight characters. The text is about a third bigger, but J S O N can carry it.",
     "vals": [
      "/",
      "9",
      "j",
      "/",
      "4",
      "A",
      "A",
      "Q"
     ],
     "ok": [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7
     ],
     "note": "6 bytes → 8 characters"
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Lab · Step 4",
   "title": "One message carries an image and a question",
   "nodes": [
    {
     "id": "nb",
     "label": "Your notebook",
     "x": 12,
     "y": 50,
     "sub": "requests.post",
     "art": "laptop"
    },
    {
     "id": "api",
     "label": "Messages API",
     "x": 50,
     "y": 50,
     "sub": "/v1/messages",
     "art": "api"
    },
    {
     "id": "model",
     "label": "Claude",
     "x": 88,
     "y": 50,
     "sub": "claude-sonnet-5-5",
     "art": "neural"
    }
   ],
   "edges": [
    {
     "from": "nb",
     "to": "api"
    },
    {
     "from": "api",
     "to": "model"
    }
   ],
   "beats": [
    {
     "say": "Step four posts to the Claude messages A P I.",
     "show": 3
    },
    {
     "say": "The headers carry your key from the environment, the A P I version, and the content type.",
     "show": 3,
     "on": "nb",
     "send": {
      "from": "nb",
      "to": "api",
      "label": "x-api-key + JSON"
     }
    },
    {
     "say": "The message content is a list, with an image block and a text block side by side.",
     "show": 3,
     "on": "api",
     "send": {
      "from": "api",
      "to": "model",
      "label": "image + text"
     }
    },
    {
     "say": "Claude looks at both, and writes a reply of up to three hundred tokens.",
     "show": 3,
     "on": "model",
     "send": {
      "from": "model",
      "to": "api",
      "label": "content blocks"
     }
    },
    {
     "say": "The reply comes back as a list of blocks too. The text is in the blocks whose type is text.",
     "show": 3,
     "on": "nb",
     "send": {
      "from": "api",
      "to": "nb",
      "label": "response.json()"
     }
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Lab · Step 6",
   "title": "Thumbnail shrinks, but keeps the shape",
   "columns": [
    "Your image",
    "Before",
    "After thumbnail"
   ],
   "rows": [
    [
     "Landscape photo",
     "4032 × 3024",
     "1024 × 768"
    ],
    [
     "Portrait photo",
     "3024 × 4032",
     "768 × 1024"
    ],
    [
     "Small screenshot",
     "800 × 600",
     "800 × 600"
    ]
   ],
   "beats": [
    {
     "say": "Large images cost more and can hit the size limit, so step six shrinks them first.",
     "sql": "img.thumbnail((1024, 1024))\nimg.convert(\"RGB\").save(\"resized_image.jpg\")"
    },
    {
     "say": "A landscape phone photo becomes ten twenty four by seven sixty eight. The longest side fits, and the shape stays.",
     "hl": 0,
     "col": 2
    },
    {
     "say": "A portrait photo flips: seven sixty eight wide, ten twenty four tall.",
     "hl": 1,
     "col": 2
    },
    {
     "say": "A small screenshot is already inside the box, so thumbnail leaves it alone. It never enlarges.",
     "hl": 2,
     "col": 2
    },
    {
     "say": "And convert R G B lets you save a P N G with transparency as a J P E G.",
     "hl": [
      0,
      1,
      2
     ]
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Step 7",
   "title": "One reusable function",
   "file": "image_text_project",
   "code": "def describe_image(image_path, question):\n    extension = os.path.splitext(\n        image_path)[1].lower()\n    if extension not in MEDIA_TYPES:\n        raise ValueError(\n            f\"Unsupported image type: {extension}\")\n    with open(image_path, \"rb\") as f:\n        return ask_claude_about_image(\n            f.read(), MEDIA_TYPES[extension],\n            question)\n\nprint(describe_image(\"resized_image.jpg\",\n\"Describe what's in this image in two sentences.\"))",
   "beats": [
    {
     "say": "Step seven wraps everything in two functions. Later projects reuse this cell, so keep it handy.",
     "line": 1
    },
    {
     "say": "Call it with the resized image.",
     "line": [
      12,
      13
     ],
     "vars": {
      "image_path": "\"resized_image.jpg\""
     }
    },
    {
     "say": "Split the extension off the file name, and lower-case it: dot j p g.",
     "line": [
      2,
      3
     ],
     "vars": {
      "extension": "\".jpg\""
     }
    },
    {
     "say": "Dot j p g is in the media types table, so it's allowed.",
     "line": 4
    },
    {
     "say": "Open the file's bytes, and pass them on with the matching media type, image slash jpeg.",
     "line": [
      7,
      8,
      9,
      10
     ],
     "vars": {
      "MEDIA_TYPES[extension]": "\"image/jpeg\""
     }
    },
    {
     "say": "Inside, ask Claude about image encodes, sends, adds a system prompt, and joins the text blocks of the reply.",
     "line": [
      8,
      9,
      10
     ],
     "out": "A brown dog lies on a sunny porch… (for example)"
    },
    {
     "say": "Now try a phone photo called photo dot H E I C. The extension becomes dot h e i c.",
     "line": [
      2,
      3
     ],
     "vars": {
      "image_path": "\"photo.HEIC\"",
      "extension": "\".heic\"",
      "MEDIA_TYPES[extension]": "(not in table)"
     }
    },
    {
     "say": "That's not in the table, so it fails early, with a clear error, before any A P I call.",
     "line": [
      4,
      5,
      6
     ],
     "out": "ValueError: Unsupported image type: .heic"
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Why do you base64-encode an image before sending it?",
   "options": [
    "J S O N carries text, and base64 turns binary bytes into a text string",
    "It makes the image smaller",
    "Claude only reads base64 text"
   ],
   "answer": 0,
   "good": "That's right. J S O N requests carry text, and base64 turns the image's binary bytes into a string that fits safely inside them.",
   "bad": "Not quite. J S O N requests carry text, and base64 turns the image's binary bytes into a string that fits safely inside them.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Why do you base64-encode an image before sending it?",
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
     "Image + text in, answer out",
     ""
    ],
    [
     "Tested on multiple images",
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
     "say": "your script processes image and text input and returns model responses,",
     "show": 1
    },
    {
     "say": "tested on multiple images.",
     "show": 2
    },
    {
     "say": "Next, in Module 3, what images and audio look like as numbers.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Project 3 (Module 3): Extract Features from an Image and an Audio Clip

**Time: about 2.5 hours**

**Goal:** Go one level deeper into each modality, understanding what's actually being represented under the hood before combining them.

**Step 1: Create the project notebook.**
Create a new notebook for this project (**File → New notebook**) and name it `feature_extraction_project`.
```python
%pip install pillow numpy librosa matplotlib
```
Upload two files to the **Files** panel: a photo named `test_image.jpg` and a short (5–30 second) audio clip named `test_audio.wav`, such as a voice memo or a music clip saved as WAV.

**Step 2: Extract basic image features.**
Add a **code cell**, paste in the code below, and run it with **Shift + Enter**.
```python
from PIL import Image
import numpy as np

img = Image.open("test_image.jpg").convert("RGB")
img_array = np.array(img)
print("Shape:", img_array.shape)
print("Mean color:", img_array.mean(axis=(0,1)))
```
An image is really just a **numpy array** of pixel values, `shape` gives (height, width, color channels); mean color gives the average red/green/blue intensity.

**Step 3: Extract a basic image histogram.**
```python
import matplotlib.pyplot as plt

plt.figure()
plt.hist(img_array.flatten(), bins=50)
plt.xlabel("Pixel value (0 = dark, 255 = bright)")
plt.ylabel("Number of pixels")
plt.savefig("brightness_histogram.png")
plt.show()
```
A **histogram** here shows the distribution of pixel brightness values across the image.

**Step 4: Load and inspect an audio clip.**
```python
import librosa
audio, sample_rate = librosa.load("test_audio.wav")
print("Duration:", len(audio) / sample_rate, "seconds")
print("Sample rate:", sample_rate)
```
**sample rate** is how many times per second the audio signal was measured; audio is fundamentally a sequence of numbers over time, just like an image is a grid of numbers over space.

**Step 5: Generate a spectrogram.**
```python
import librosa.display

spectrogram = librosa.feature.melspectrogram(y=audio, sr=sample_rate)
plt.figure()
librosa.display.specshow(librosa.power_to_db(spectrogram), sr=sample_rate, x_axis="time", y_axis="mel")
plt.colorbar(format="%+2.0f dB")
plt.savefig("spectrogram.png")
plt.show()
```
A **spectrogram** converts audio from a waveform (amplitude over time) into a visual representation of frequency content over time.

**Step 6: Extract a simple audio feature.**
```python
tempo, _ = librosa.beat.beat_track(y=audio, sr=sample_rate)
print("Estimated tempo (beats per minute):", tempo)
```
Tempo means most for music; on speech the number will be rough.

**Step 7: Document what you extracted and why it matters.**
Add a **text cell** headed `feature_notes` and write your notes in it.
Write 3–4 sentences connecting these hand-extracted features to what a real multimodal model does automatically and at much greater scale.

### Final Project Structure

*If you worked in a notebook, these are the sections of your notebook (text and code cells), not separate files. Save or export them as files when you put the project in your portfolio.*

```text
feature_extraction_project/
│
├── extract_features.py
├── test_image.jpg
├── test_audio.wav
├── brightness_histogram.png
├── spectrogram.png
├── feature_notes.md
```

### What You Learned
- ✅ Representing images as numpy arrays
- ✅ Extracting basic image features (color, brightness distribution)
- ✅ Representing audio as a numeric time series
- ✅ Generating and interpreting spectrograms
- ✅ Extracting basic audio features (tempo)
- ✅ Connecting hand-extracted features to model-internal processing

### Portfolio Project
**Image & Audio Feature Extraction**: Extracted and visualized basic features from both image (color, brightness) and audio (spectrogram, tempo) data using Python, connecting the exercise to how multimodal models process raw input.
**Skills:** Python, NumPy, Librosa, Signal Processing Fundamentals, Multimodal AI.

**Deliverable:** Feature extraction script with visualized outputs (histogram, spectrogram) and written notes on both modalities.

### Quiz

1. What does the shape of an RGB image array tell you?
2. What is an audio sample rate?
3. What does a spectrogram show that a waveform does not show directly?
4. How do these hand-made features relate to what a multimodal model does?

*Answers: 1) Its height, width, and number of color channels (3 for red, green, blue). 2) How many times per second the audio signal was measured. 3) Which frequencies are present and how strong they are over time. 4) A model learns its own features from the same raw numbers automatically and at much larger scale, instead of using a few hand-picked ones.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "graph",
   "kicker": "Project 3 · Image and audio features",
   "title": "Look under the hood",
   "beats": [
    {
     "say": "Welcome to Module 3."
    },
    {
     "say": "Before combining modalities, you'll see what an image and an audio clip really are: numbers."
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Lab · Step 2",
   "title": "An image is a grid of numbers",
   "columns": [
    "Pixel",
    "Red",
    "Green",
    "Blue"
   ],
   "rows": [
    [
     "1 · sky",
     "120",
     "180",
     "240"
    ],
    [
     "2 · grass",
     "60",
     "140",
     "50"
    ],
    [
     "3 · grass",
     "90",
     "160",
     "70"
    ],
    [
     "mean",
     "90",
     "160",
     "120"
    ]
   ],
   "beats": [
    {
     "say": "Picture a tiny image: one row of three pixels. Each pixel is three numbers, red, green and blue, from zero to two fifty five.",
     "hl": [
      0,
      1,
      2
     ],
     "dim": true
    },
    {
     "say": "NumPy turns it into an array. Its shape is one high, three wide, three colour channels.",
     "sql": "img_array = np.array(img)\nShape: (1, 3, 3)",
     "hl": [
      0,
      1,
      2
     ],
     "dim": true
    },
    {
     "say": "Mean over axes zero and one averages every pixel, one channel at a time.",
     "sql": "img_array.mean(axis=(0,1))",
     "hl": 3
    },
    {
     "say": "Red: one twenty, sixty and ninety average to ninety.",
     "hl": [
      0,
      1,
      2,
      3
     ],
     "col": 1
    },
    {
     "say": "Green averages to one sixty, and blue to one twenty. The mean colour is a greenish grey.",
     "sql": "Mean color: [ 90. 160. 120.]",
     "hl": 3,
     "col": 2
    },
    {
     "say": "Your real photo works the same way, just with millions of pixels.",
     "hl": 3
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Lab · Step 3",
   "title": "A histogram counts brightness values",
   "values": [
    120,
    180,
    240,
    60,
    140,
    50,
    90,
    160,
    70
   ],
   "beats": [
    {
     "say": "Flatten lays all nine numbers in one line, pixel by pixel."
    },
    {
     "say": "A histogram sorts them into bins and counts. Imagine just three bins. Dark, under one hundred: four values.",
     "hl": [
      3,
      5,
      6,
      8
     ],
     "note": "0–99: 4 values"
    },
    {
     "say": "Middle, one hundred to one ninety nine: four more.",
     "ok": [
      3,
      5,
      6,
      8
     ],
     "hl": [
      0,
      1,
      4,
      7
     ],
     "note": "100–199: 4 values"
    },
    {
     "say": "Bright, two hundred and up: just one, the sky's blue.",
     "ok": [
      0,
      1,
      3,
      4,
      5,
      6,
      7,
      8
     ],
     "hl": 2,
     "note": "200–255: 1 value"
    },
    {
     "say": "Your code uses fifty bins across a whole photo, and plots the counts as bars: brightness along the bottom, number of pixels up the side.",
     "ok": [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8
     ],
     "note": "plt.hist(img_array.flatten(), bins=50)"
    }
   ]
  },
  {
   "kind": "chart",
   "kicker": "Lab · Step 4",
   "title": "Audio is numbers over time",
   "xlabel": "time",
   "ylabel": "amplitude",
   "points": [
    [
     5,
     50.0
    ],
    [
     10,
     74.7
    ],
    [
     15,
     85.0
    ],
    [
     20,
     74.7
    ],
    [
     25,
     50.0
    ],
    [
     30,
     25.3
    ],
    [
     35,
     15.0
    ],
    [
     40,
     25.3
    ],
    [
     45,
     50.0
    ],
    [
     50,
     74.7
    ],
    [
     55,
     85.0
    ],
    [
     60,
     74.7
    ],
    [
     65,
     50.0
    ],
    [
     70,
     25.3
    ],
    [
     75,
     15.0
    ],
    [
     80,
     25.3
    ],
    [
     85,
     50.0
    ],
    [
     90,
     74.7
    ],
    [
     95,
     85.0
    ]
   ],
   "beats": [
    {
     "say": "Audio is a sequence of numbers over time, just as an image is a grid of numbers over space.",
     "groups": [
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1
     ]
    },
    {
     "say": "Each dot is one measurement of the sound wave, called a sample.",
     "groups": [
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1
     ],
     "marks": [
      [
       5,
       50.0
      ]
     ]
    },
    {
     "say": "The sample rate is how many of these measurements are taken every second.",
     "groups": [
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1
     ]
    },
    {
     "say": "Halve the sample rate and you'd keep only every other dot. The wave gets rougher.",
     "groups": [
      2,
      0,
      2,
      0,
      2,
      0,
      2,
      0,
      2,
      0,
      2,
      0,
      2,
      0,
      2,
      0,
      2,
      0,
      2
     ]
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Steps 4 and 6",
   "title": "Load the clip, then estimate its tempo",
   "file": "feature_extraction_project",
   "code": "import librosa\naudio, sample_rate = librosa.load(\"test_audio.wav\")\nprint(\"Duration:\", len(audio) / sample_rate,\n      \"seconds\")\nprint(\"Sample rate:\", sample_rate)\n\ntempo, _ = librosa.beat.beat_track(\n    y=audio, sr=sample_rate)\nprint(\"Estimated tempo (beats per minute):\", tempo)",
   "beats": [
    {
     "say": "librosa loads the clip as an array of samples. By default it resamples to twenty two thousand and fifty per second.",
     "line": [
      1,
      2
     ],
     "vars": {
      "sample_rate": 22050
     }
    },
    {
     "say": "Say the clip has two hundred twenty thousand five hundred samples.",
     "line": 2,
     "vars": {
      "len(audio)": 220500
     }
    },
    {
     "say": "Divide by the sample rate, and that's ten seconds of sound.",
     "line": [
      3,
      4
     ],
     "out": "Duration: 10.0 seconds"
    },
    {
     "say": "Then the sample rate itself.",
     "line": 5,
     "out": "Sample rate: 22050"
    },
    {
     "say": "Beat track looks for regular pulses in the sound.",
     "line": [
      7,
      8
     ]
    },
    {
     "say": "For a music clip, it might print about one hundred seventeen beats per minute. On speech, the number is rough.",
     "line": 9,
     "vars": {
      "tempo": "[117.45]"
     },
     "out": "Estimated tempo (beats per minute): [117.45383523]"
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Lab · Step 5",
   "title": "A spectrogram: which frequencies, when",
   "columns": [
    "Band",
    "0–1 s",
    "1–2 s",
    "2–3 s"
   ],
   "rows": [
    [
     "high",
     "quiet",
     "loud",
     "quiet"
    ],
    [
     "middle",
     "medium",
     "loud",
     "medium"
    ],
    [
     "low",
     "loud",
     "medium",
     "quiet"
    ]
   ],
   "beats": [
    {
     "say": "A waveform shows loudness over time, but not which pitches are in the sound. A spectrogram does.",
     "sql": "librosa.feature.melspectrogram(y=audio, sr=sample_rate)"
    },
    {
     "say": "Imagine a three second clip. Each column is a slice of time.",
     "col": 1
    },
    {
     "say": "Each row is a band of frequencies, from low pitches at the bottom to high at the top.",
     "hl": [
      0,
      1,
      2
     ],
     "dim": true,
     "col": 0
    },
    {
     "say": "In the first second, the low band is loud: maybe a drum.",
     "hl": 2,
     "dim": true,
     "col": 1
    },
    {
     "say": "In the next second, every band lights up: a voice, or a chord.",
     "hl": [
      0,
      1,
      2
     ],
     "col": 2
    },
    {
     "say": "Power to d b turns strength into decibels, and your plot shows it as colour.",
     "sql": "librosa.power_to_db(spectrogram)  →  colour, in dB"
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Lab · Step 7",
   "title": "Your features versus a model's features",
   "nodes": [
    {
     "id": "raw",
     "label": "Raw numbers",
     "x": 15,
     "y": 50,
     "sub": "pixels and samples",
     "art": "pixels"
    },
    {
     "id": "you",
     "label": "Your features",
     "x": 55,
     "y": 20,
     "sub": "mean, histogram, tempo",
     "art": "pencil"
    },
    {
     "id": "model",
     "label": "Model features",
     "x": 55,
     "y": 80,
     "sub": "learned, at scale",
     "art": "neural"
    },
    {
     "id": "task",
     "label": "Understanding",
     "x": 88,
     "y": 50,
     "sub": "caption, answer",
     "art": "bulb"
    }
   ],
   "edges": [
    {
     "from": "raw",
     "to": "you"
    },
    {
     "from": "raw",
     "to": "model"
    },
    {
     "from": "you",
     "to": "task"
    },
    {
     "from": "model",
     "to": "task"
    }
   ],
   "beats": [
    {
     "say": "In a text cell called feature notes, connect what you did to real models.",
     "show": 1,
     "on": "raw"
    },
    {
     "say": "You hand-picked a few features from the raw numbers: a mean colour, a histogram, a tempo.",
     "show": 2,
     "on": "you",
     "send": {
      "from": "raw",
      "to": "you",
      "label": "a few features"
     }
    },
    {
     "say": "A multimodal model starts from the same raw numbers.",
     "show": 3,
     "on": "model",
     "send": {
      "from": "raw",
      "to": "model",
      "label": "all the values"
     }
    },
    {
     "say": "But it learns its own features automatically, at much greater scale, and uses them to caption or answer.",
     "show": 4,
     "on": [
      "model",
      "task"
     ],
     "send": {
      "from": "model",
      "to": "task",
      "label": "learned features"
     }
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "What does a spectrogram show that a waveform doesn't show directly?",
   "options": [
    "The file's sample rate",
    "Which frequencies are present, and how strong, over time",
    "The audio's length in seconds"
   ],
   "answer": 1,
   "good": "That's right. A spectrogram shows which frequencies are present and how strong they are over time.",
   "bad": "Not quite. A spectrogram shows which frequencies are present and how strong they are over time.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "What does a spectrogram show that a waveform doesn't show directly?",
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
     "A histogram and a spectrogram",
     ""
    ],
    [
     "Notes on both modalities",
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
     "say": "you have a feature extraction script with a histogram and a spectrogram,",
     "show": 1
    },
    {
     "say": "and written notes on both modalities.",
     "show": 2
    },
    {
     "say": "Next, in Module 4, an image captioning demo.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Project 4 (Module 4): Build a Simple Image Captioning Demo

**Time: about 2 hours**

**Goal:** Combine vision and language in one model output, your first true multimodal *generation* task, not just multimodal *input*.

**Step 1: Create the project notebook.**
Create a new notebook for this project (**File → New notebook**) and name it `image_captioning_project`.
In the first cells, run `%pip install requests pillow`, then the API key cell from "Before you start", then paste and run the Step 7 cell from Project 2 (the one that defines `ask_claude_about_image` and `describe_image`). You can delete its last `print(...)` line.

**Step 2: Understand how vision-language models connect the two modalities.**
A **vision transformer** encodes an image into a numeric representation; **text-image embedding alignment** means the model has learned to relate that image representation to relevant words and concepts.

**Step 3: Write a basic captioning function.**
Add a **code cell**, paste in the code below, and run it with **Shift + Enter**.
```python
def generate_caption(image_path):
    # Reuses Project 2's describe_image with a captioning-specific prompt
    return describe_image(image_path, "Write a single, concise caption for this image.")
```

**Step 4: Test captioning across varied images.**
In the **Files** panel, create a folder named `images` (right-click → **New folder**) and upload 5 different images into it: a simple object, a complex scene, a photo with text in it, an abstract image, and one with people. Then caption one of them, for example `print(generate_caption("images/your_file.jpg"))`, using your real file name.

**Step 5: Add caption style control.**
```python
def generate_caption(image_path, style="concise"):
    prompts = {
        "concise": "Write a single, concise caption for this image.",
        "detailed": "Write a detailed, descriptive caption for this image.",
        "alt_text": "Write accessible alt-text for this image, suitable for a screen reader.",
    }
    return describe_image(image_path, prompts[style])

print(generate_caption("images/your_file.jpg", style="alt_text"))  # use a real file name
```
This new version replaces the one from Step 3, and `style="concise"` keeps the old behavior as the default. **alt-text** is a specific caption style written for accessibility, describing an image for someone who can't see it.

**Step 6: Evaluate caption quality manually.**
Add a **text cell** headed `caption_evaluation` and write your notes in it.
For each test image, rate the caption 1–5 on accuracy and usefulness, noting any errors (misidentified objects, hallucinated details).

**Step 7: Build a simple batch captioning script.**
```python
import os

for filename in sorted(os.listdir("images")):
    extension = os.path.splitext(filename)[1].lower()
    if extension not in MEDIA_TYPES:  # skip non-image files
        continue
    caption = generate_caption(os.path.join("images", filename))
    print(f"{filename}: {caption}")
```

### Final Project Structure

*If you worked in a notebook, these are the sections of your notebook (text and code cells), not separate files. Save or export them as files when you put the project in your portfolio.*

```text
image_captioning_project/
│
├── caption.py
├── images/
├── caption_evaluation.md
```

### What You Learned
- ✅ How vision transformers and text-image alignment enable captioning
- ✅ Writing focused prompts for consistent caption generation
- ✅ Testing across varied and challenging image types
- ✅ Supporting multiple caption styles (concise, detailed, alt-text)
- ✅ Manually evaluating caption accuracy and catching hallucinations
- ✅ Batch-processing captions across multiple images

### Portfolio Project
**Image Captioning Demo**: Built a multi-style image captioning tool (concise, detailed, alt-text) using a vision-language model, with manual quality evaluation across varied test images.
**Skills:** Vision-Language Models, Prompt Engineering, Python, Multimodal AI, Accessibility.

**Deliverable:** A batch image captioning script supporting multiple caption styles, with an evaluation of caption quality.

### Quiz

1. What is the difference between multimodal input and multimodal generation in this project?
2. How does the captioning function change the model's output style without changing any API code?
3. What makes alt-text different from a regular caption?
4. What is a hallucinated detail in a caption, and how do you catch one?

*Answers: 1) Input means sending more than one modality to the model; here the model also generates new language from an image, which is the caption. 2) It passes a different prompt to the same `describe_image` function, picked from a dictionary by style. 3) Alt-text is written for people using screen readers, so it describes what someone who can't see the image needs to know. 4) It is something the caption says is in the image but isn't; you catch it by comparing each caption to the actual image during manual review.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "doc",
   "kicker": "Project 4 · Image captioning",
   "title": "From picture to words",
   "beats": [
    {
     "say": "Welcome to Module 4."
    },
    {
     "say": "This is your first multimodal generation task: the model creates new language from an image."
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Step 2 · Concept",
   "title": "How a vision-language model sees",
   "nodes": [
    {
     "id": "img",
     "label": "Image",
     "x": 12,
     "y": 50,
     "sub": "pixels",
     "art": "image"
    },
    {
     "id": "vit",
     "label": "Vision encoder",
     "x": 42,
     "y": 22,
     "sub": "a vision transformer",
     "art": "neural"
    },
    {
     "id": "space",
     "label": "Shared space",
     "x": 42,
     "y": 78,
     "sub": "image meets words",
     "art": "merge"
    },
    {
     "id": "cap",
     "label": "Caption",
     "x": 85,
     "y": 50,
     "sub": "new text",
     "art": "doc"
    }
   ],
   "edges": [
    {
     "from": "img",
     "to": "vit"
    },
    {
     "from": "vit",
     "to": "space"
    },
    {
     "from": "space",
     "to": "cap"
    }
   ],
   "beats": [
    {
     "say": "How does one model connect pictures and words?",
     "show": 1,
     "on": "img"
    },
    {
     "say": "A vision transformer encodes the image into a numeric representation.",
     "show": 2,
     "on": "vit",
     "send": {
      "from": "img",
      "to": "vit",
      "label": "pixels"
     }
    },
    {
     "say": "During training, the model learned to relate that representation to words and concepts. That's text-image alignment.",
     "show": 3,
     "on": "space",
     "send": {
      "from": "vit",
      "to": "space",
      "label": "image numbers"
     }
    },
    {
     "say": "So it can generate new words about the image: a caption.",
     "show": 4,
     "on": "cap",
     "send": {
      "from": "space",
      "to": "cap",
      "label": "a red bicycle…"
     }
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Lab · Steps 3 and 5",
   "title": "One function, three caption styles",
   "columns": [
    "style",
    "the prompt asks for"
   ],
   "rows": [
    [
     "concise",
     "one concise caption"
    ],
    [
     "detailed",
     "a detailed caption"
    ],
    [
     "alt_text",
     "screen-reader alt-text"
    ]
   ],
   "beats": [
    {
     "say": "Generate caption reuses describe image from Project 2. Only the prompt changes.",
     "sql": "def generate_caption(image_path, style=\"concise\"):\n    return describe_image(image_path, prompts[style])"
    },
    {
     "say": "Call it with no style, and the default, concise, asks for a single short caption.",
     "hl": 0,
     "dim": true,
     "sql": "generate_caption(\"images/cat.jpg\")"
    },
    {
     "say": "Ask for detailed, and the prompt asks for a descriptive caption instead.",
     "hl": 1,
     "dim": true,
     "sql": "generate_caption(\"images/cat.jpg\", style=\"detailed\")"
    },
    {
     "say": "Alt text describes the image for someone using a screen reader, who can't see it.",
     "hl": 2,
     "dim": true,
     "sql": "generate_caption(\"images/cat.jpg\", style=\"alt_text\")"
    },
    {
     "say": "A dictionary picks the prompt. No A P I code changed at all.",
     "hl": [
      0,
      1,
      2
     ],
     "col": 0
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Lab · Steps 4 and 6",
   "title": "Test hard images, then rate them",
   "columns": [
    "Test image",
    "Watch for"
   ],
   "rows": [
    [
     "Simple object",
     "right object named?"
    ],
    [
     "Complex scene",
     "missed or extra items"
    ],
    [
     "Photo with text",
     "text read correctly?"
    ],
    [
     "Abstract image",
     "invented subject"
    ],
    [
     "People",
     "guesses and tone"
    ]
   ],
   "beats": [
    {
     "say": "Put five different images in a folder called images. Each one tests something.",
     "sql": "rate each caption 1–5: accuracy, usefulness"
    },
    {
     "say": "A simple object: does the caption name the right thing?",
     "hl": 0
    },
    {
     "say": "A complex scene: does it miss things, or add things?",
     "hl": 1
    },
    {
     "say": "A photo with text in it: is the text read correctly?",
     "hl": 2
    },
    {
     "say": "An abstract image: does it invent a subject that isn't there?",
     "hl": 3
    },
    {
     "say": "And a photo with people: watch for guesses about them, and the tone.",
     "hl": 4
    },
    {
     "say": "A hallucinated detail is anything the caption claims that isn't in the image. Compare every caption to the real picture.",
     "hl": [
      1,
      3
     ],
     "dim": true
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Step 7",
   "title": "Caption a whole folder",
   "file": "image_captioning_project",
   "code": "import os\n\nfor filename in sorted(os.listdir(\"images\")):\n    extension = os.path.splitext(\n        filename)[1].lower()\n    if extension not in MEDIA_TYPES:\n        continue\n    caption = generate_caption(\n        os.path.join(\"images\", filename))\n    print(f\"{filename}: {caption}\")",
   "beats": [
    {
     "say": "Say the images folder holds three pictures, and a stray notes file.",
     "line": 3,
     "vars": {
      "sorted(os.listdir(\"images\"))": "[\"abstract.png\", \"cat.jpg\", \"notes.txt\", \"street.jpg\"]"
     }
    },
    {
     "say": "Sorted gives a stable order. First, abstract dot p n g.",
     "line": [
      3,
      4,
      5
     ],
     "vars": {
      "filename": "\"abstract.png\"",
      "extension": "\".png\""
     }
    },
    {
     "say": "P N G is supported, so it's captioned and printed.",
     "line": [
      8,
      9,
      10
     ],
     "out": "abstract.png: Swirls of blue and orange paint… (for example)"
    },
    {
     "say": "Next, cat dot j p g. Captioned too.",
     "line": [
      3,
      8,
      9,
      10
     ],
     "vars": {
      "filename": "\"cat.jpg\"",
      "extension": "\".jpg\""
     },
     "out": "cat.jpg: A tabby cat asleep on a windowsill. (for example)"
    },
    {
     "say": "Then notes dot t x t. That's not an image type, so continue skips it.",
     "line": [
      3,
      4,
      5,
      6,
      7
     ],
     "vars": {
      "filename": "\"notes.txt\"",
      "extension": "\".txt\""
     }
    },
    {
     "say": "And street dot j p g. Three captions, and nothing crashed.",
     "line": [
      3,
      8,
      9,
      10
     ],
     "vars": {
      "filename": "\"street.jpg\"",
      "extension": "\".jpg\""
     },
     "out": "street.jpg: A busy street at dusk… (for example)"
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "How does the captioning function change its output style without changing any A P I code?",
   "options": [
    "It switches to a different model",
    "It resizes the image",
    "It passes a different prompt to the same describe image function"
   ],
   "answer": 2,
   "good": "That's right. It picks a different prompt from a dictionary by style, and passes it to the same describe image function.",
   "bad": "Not quite. It picks a different prompt from a dictionary by style, and passes it to the same describe image function.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "How does the captioning function change its output style without changing any A P I code?",
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
     "Batch captions in several styles",
     ""
    ],
    [
     "Captions rated for quality",
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
     "say": "you have a batch captioning script supporting multiple caption styles,",
     "show": 1
    },
    {
     "say": "and an evaluation of caption quality.",
     "show": 2
    },
    {
     "say": "Next, in Module 5, an app that answers questions about an image.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Project 5 (Module 5): Build an App That Takes an Image and Answers Questions About It

**Time: about 4 hours**

**Goal:** Build a full interactive app around a vision-language model, moving from a script to something a real user could actually use.

> **This project runs on your computer, not in a notebook.** It builds something that keeps running in the background (a web app, a job queue, or a scheduled task), which a notebook can't host. Make a project folder on your computer, open it in VS Code, and save each code block as the file named in its step. Run the commands in your terminal. Everything you built in the notebooks carries over.

**Step 1: Create the project folder.**
```bash
mkdir image_qa_app_project
cd image_qa_app_project
```
Create a **virtual environment** (a private set of Python packages for this project) and turn it on. On Mac or Linux:
```bash
python3 -m venv .venv
source .venv/bin/activate
```
On Windows PowerShell:
```powershell
py -m venv .venv
.venv\Scripts\Activate.ps1
```
Your prompt now starts with `(.venv)`. Turn it on again the same way in every new terminal you use for this project. Then install the packages:
```bash
pip install fastapi uvicorn python-multipart requests
```
Many newer Mac and Linux setups refuse `pip install` outside a virtual environment, which is why this step comes first.

Copy a photo into this folder and name it `test_image.jpg`.

Set your API key in the same terminal window you'll run the app from. It lives only in that terminal session, never in a file:
```bash
# Mac / Linux
export ANTHROPIC_API_KEY="paste-your-key-here"
```
```powershell
# Windows PowerShell
$env:ANTHROPIC_API_KEY="paste-your-key-here"
```
If you open a new terminal window, set it again (and turn the virtual environment back on).

**Step 2: Build an image upload endpoint.**
Create `app.py` in VS Code and paste in the code below. `ask_claude_about_image` is the function you wrote in Project 2, Step 7, with its system prompt adjusted for answering questions.
```python
import base64
import os

import requests
from fastapi import FastAPI, Form, HTTPException, UploadFile

app = FastAPI()

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png"}


def ask_claude_about_image(image_bytes, media_type, question, max_tokens=300):
    """Send raw image bytes plus a question to Claude and return the answer text."""
    image_data = base64.b64encode(image_bytes).decode("utf-8")
    response = requests.post(
        "https://api.anthropic.com/v1/messages",
        headers={
            "x-api-key": os.environ["ANTHROPIC_API_KEY"],
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        },
        json={
            "model": "claude-sonnet-5-5",
            "max_tokens": max_tokens,
            "system": "You answer questions about images accurately and briefly. If you can't tell from the image, say so.",
            "messages": [{
                "role": "user",
                "content": [
                    {"type": "image", "source": {"type": "base64", "media_type": media_type, "data": image_data}},
                    {"type": "text", "text": question},
                ],
            }],
        },
        timeout=60,
    )
    response.raise_for_status()
    blocks = response.json()["content"]
    return "".join(block["text"] for block in blocks if block["type"] == "text")


def read_checked_image(image: UploadFile):
    """Reject anything that isn't a JPEG or PNG, then return the image bytes."""
    if image.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(status_code=400, detail="Unsupported image format. Use JPEG or PNG.")
    image_bytes = image.file.read()
    if not image_bytes:
        raise HTTPException(status_code=400, detail="The image file is empty.")
    return image_bytes


@app.post("/ask")
def ask_about_image(image: UploadFile, question: str = Form()):
    image_bytes = read_checked_image(image)
    answer = ask_claude_about_image(image_bytes, image.content_type, question)
    return {"answer": answer}
```
`UploadFile` handles binary file uploads; `Form()` handles a text field sent in the same request. The endpoint uses a plain `def` (not `async def`) because the API call blocks while it waits; FastAPI runs plain `def` endpoints in a background thread so other requests aren't stuck.

**Step 3: Start the app.**
```bash
uvicorn app:app --reload
```
Leave this terminal running. `--reload` restarts the app each time you save `app.py`. Open [http://localhost:8000/docs](http://localhost:8000/docs) in your browser to see and try your endpoints.

**Step 4: Test with curl.**
Open a second terminal in the same folder and run:
```bash
curl -X POST http://localhost:8000/ask -F "image=@test_image.jpg" -F "question=What color is the car?"
```
Change the question to fit your photo. You should get back JSON like `{"answer": "..."}`.

**Step 5: Add speech-to-text for voice questions.**
Claude reads text and images, not audio, so you need a separate **speech-to-text (STT)** model to turn a spoken question into text. This project uses **faster-whisper**, a free, open-source version of OpenAI's Whisper model that runs on your own computer. Stop the app (**Ctrl + C**), install it, then start the app again:
```bash
pip install faster-whisper
uvicorn app:app --reload
```
Add these lines to `app.py`: the imports at the top of the file, the rest at the bottom.
```python
import io
from faster_whisper import WhisperModel

# Loads a small, free speech-to-text model once, when the app starts.
# The first run downloads it (about 150 MB).
stt_model = WhisperModel("base", device="cpu", compute_type="int8")


def transcribe_audio(audio_bytes):
    """Speech-to-text: turn recorded speech into a text question."""
    segments, _info = stt_model.transcribe(io.BytesIO(audio_bytes))
    return " ".join(segment.text.strip() for segment in segments)
```
**speech-to-text (STT)** converts spoken audio into text the rest of your pipeline can use. Whisper reads common formats such as WAV, MP3, and M4A.

**Step 6: Add text-to-speech for spoken answers.**
For the reverse direction, **text-to-speech (TTS)**, this project uses **gTTS**, a free library that sends text to Google Translate's speech service and saves an MP3 (it needs an internet connection). Install it with `pip install gTTS`, then add to `app.py`: the imports at the top, the rest at the bottom.
```python
from fastapi.responses import FileResponse
from gtts import gTTS


def speak_answer(answer_text, out_path="answer.mp3"):
    """Text-to-speech: save the answer as an MP3 file and return its path."""
    gTTS(text=answer_text, lang="en").save(out_path)
    return out_path


@app.post("/ask_voice")
def ask_with_voice(image: UploadFile, audio: UploadFile):
    image_bytes = read_checked_image(image)
    question = transcribe_audio(audio.file.read())
    if not question:
        raise HTTPException(status_code=400, detail="No speech found in the audio.")
    answer = ask_claude_about_image(image_bytes, image.content_type, question)
    print("Question:", question)
    print("Answer:", answer)
    return FileResponse(speak_answer(answer), media_type="audio/mpeg", filename="answer.mp3")
```
The voice endpoint chains three models: Whisper (audio to text), Claude (image + text to text), and gTTS (text to audio). It prints the question and answer in the app's terminal so you can check each step. If you'd rather run TTS fully offline, `pyttsx3` is a free alternative that uses your computer's built-in voices.

**Step 7: Test the error handling.**
`read_checked_image` already rejects bad uploads. Check it by sending a file that isn't an image:
```bash
echo "not an image" > notes.txt
curl -X POST http://localhost:8000/ask -F "image=@notes.txt" -F "question=What is this?"
```
You should get `{"detail": "Unsupported image format. Use JPEG or PNG."}` with status 400, and the app keeps running. An `HTTPException` sends a clear error to the caller instead of crashing.

**Step 8: Test the full multimodal flow end-to-end.**
Record yourself asking a question about your photo (a phone voice memo works), save it in the project folder as `test_audio.wav` (or `.m4a`), and run:
```bash
curl -X POST http://localhost:8000/ask_voice -F "image=@test_image.jpg" -F "audio=@test_audio.wav" --output answer.mp3
```
Check the app's terminal for the transcribed question and the answer, then play `answer.mp3` to hear the spoken answer.

### Final Project Structure
```text
image_qa_app_project/
│
├── app.py
├── test_image.jpg
├── test_audio.wav
```

### What You Learned
- ✅ Building a FastAPI endpoint that accepts image uploads
- ✅ Combining image and text question input in one request
- ✅ Adding speech-to-text for voice-based questions
- ✅ Adding text-to-speech for spoken answers
- ✅ Handling unsupported upload formats gracefully
- ✅ Testing a full, multi-modality flow end-to-end

### Portfolio Project
**Visual Q&A Application**: Built a FastAPI application that answers user questions about uploaded images, extended with speech-to-text and text-to-speech for a fully voice-driven interaction.
**Skills:** FastAPI, Vision-Language Models, Speech AI, Python, Multimodal Application Development.

**Deliverable:** A working image Q&A app supporting both text and voice input/output, tested end-to-end.

### Quiz

1. Why does the voice endpoint need Whisper and gTTS in addition to Claude?
2. What do `UploadFile` and `Form()` each handle in the `/ask` endpoint?
3. Where should your API key live when you run this app on your computer?
4. What happens when someone uploads a text file instead of an image, and why is that better than letting the code continue?

*Answers: 1) Claude takes text and images in and gives text out; it doesn't hear or speak audio, so Whisper turns speech into text and gTTS turns the answer text into speech. 2) `UploadFile` receives the uploaded file's bytes, and `Form()` receives a text field (the question) sent in the same request. 3) In an environment variable set in your terminal, which the code reads with `os.environ`; never in a file. 4) `read_checked_image` raises an `HTTPException` with status 400 and a clear message, so the caller learns what went wrong and the app keeps running instead of sending a bad request to the API.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "phone",
   "kicker": "Project 5 · Image Q and A app",
   "title": "Ask a picture a question",
   "beats": [
    {
     "say": "Welcome to Module 5."
    },
    {
     "say": "You'll move from a script to an app a real user could use. This one runs on your computer, not in a notebook."
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Lab · Steps 1 and 3",
   "title": "Set up, then start the app",
   "values": [
    "mkdir",
    "venv",
    "activate",
    "pip install",
    "export key",
    "uvicorn"
   ],
   "beats": [
    {
     "say": "This app keeps running, so it lives on your computer. Make a project folder first.",
     "hl": 0,
     "ptr": {
      "step": 0
     },
     "note": "mkdir image_qa_app_project"
    },
    {
     "say": "Create a virtual environment: a private set of Python packages for this project.",
     "ok": [
      0
     ],
     "hl": 1,
     "ptr": {
      "step": 1
     },
     "note": "python3 -m venv .venv"
    },
    {
     "say": "Turn it on. Your prompt now starts with dot venv.",
     "ok": [
      0,
      1
     ],
     "hl": 2,
     "ptr": {
      "step": 2
     },
     "note": "source .venv/bin/activate"
    },
    {
     "say": "Install Fast A P I, uvicorn, python multipart and requests.",
     "ok": [
      0,
      1,
      2
     ],
     "hl": 3,
     "ptr": {
      "step": 3
     },
     "note": "pip install fastapi uvicorn …"
    },
    {
     "say": "Set your A P I key in the terminal. It lives only in that session, never in a file.",
     "ok": [
      0,
      1,
      2,
      3
     ],
     "hl": 4,
     "ptr": {
      "step": 4
     },
     "note": "export ANTHROPIC_API_KEY=…"
    },
    {
     "say": "Then start the app. Reload restarts it every time you save app dot p y.",
     "ok": [
      0,
      1,
      2,
      3,
      4
     ],
     "hl": 5,
     "ptr": {
      "step": 5
     },
     "note": "uvicorn app:app --reload"
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Lab · Steps 2 and 4",
   "title": "One request through the ask endpoint",
   "nodes": [
    {
     "id": "curl",
     "label": "curl",
     "x": 12,
     "y": 50,
     "sub": "your second terminal",
     "art": "terminal"
    },
    {
     "id": "app",
     "label": "FastAPI app",
     "x": 50,
     "y": 50,
     "sub": "POST /ask",
     "art": "server"
    },
    {
     "id": "model",
     "label": "Claude",
     "x": 88,
     "y": 50,
     "sub": "image + text → text",
     "art": "neural"
    }
   ],
   "edges": [
    {
     "from": "curl",
     "to": "app"
    },
    {
     "from": "app",
     "to": "model"
    }
   ],
   "beats": [
    {
     "say": "Test the app from a second terminal with curl.",
     "show": 3,
     "on": "curl"
    },
    {
     "say": "One request carries two parts: the image file, and the question as a form field.",
     "show": 3,
     "on": "curl",
     "send": {
      "from": "curl",
      "to": "app",
      "label": "image + question"
     }
    },
    {
     "say": "Upload File receives the image bytes. Form receives the question text.",
     "show": 3,
     "on": "app"
    },
    {
     "say": "The app checks the image, then calls ask Claude about image, from Project 2.",
     "show": 3,
     "on": "app",
     "send": {
      "from": "app",
      "to": "model",
      "label": "base64 + text"
     }
    },
    {
     "say": "Claude answers in text.",
     "show": 3,
     "on": "model",
     "send": {
      "from": "model",
      "to": "app",
      "label": "answer text"
     }
    },
    {
     "say": "And the app sends J S O N back, with the answer inside.",
     "show": 3,
     "on": "curl",
     "send": {
      "from": "app",
      "to": "curl",
      "label": "{\"answer\": …}"
     }
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Lab · Steps 2 and 7",
   "title": "read_checked_image guards the door",
   "columns": [
    "Upload",
    "content_type",
    "Result"
   ],
   "rows": [
    [
     "test_image.jpg",
     "image/jpeg",
     "accepted"
    ],
    [
     "photo.png",
     "image/png",
     "accepted"
    ],
    [
     "notes.txt",
     "text/plain",
     "400 · unsupported"
    ],
    [
     "empty.jpg (0 bytes)",
     "image/jpeg",
     "400 · file is empty"
    ]
   ],
   "beats": [
    {
     "say": "Before any A P I call, read checked image checks every upload.",
     "sql": "ALLOWED_IMAGE_TYPES = {\"image/jpeg\", \"image/png\"}"
    },
    {
     "say": "A J P E G or a P N G passes the type check.",
     "hl": [
      0,
      1
     ],
     "dim": true,
     "col": 1
    },
    {
     "say": "Step seven sends a text file instead. Its type isn't allowed.",
     "hl": 2,
     "dim": true,
     "col": 1
    },
    {
     "say": "So the app raises an H T T P exception: status four hundred, use J P E G or P N G. And it keeps running.",
     "hl": 2,
     "dim": true,
     "col": 2,
     "sql": "{\"detail\": \"Unsupported image format. Use JPEG or PNG.\"}"
    },
    {
     "say": "A file with the right type but no bytes fails the second check: the image file is empty.",
     "hl": 3,
     "dim": true,
     "col": 2,
     "sql": "{\"detail\": \"The image file is empty.\"}"
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Lab · Step 5",
   "title": "Speech to text with Whisper",
   "file": "app.py",
   "code": "stt_model = WhisperModel(\"base\", device=\"cpu\",\n                         compute_type=\"int8\")\n\ndef transcribe_audio(audio_bytes):\n    segments, _info = stt_model.transcribe(\n        io.BytesIO(audio_bytes))\n    return \" \".join(segment.text.strip()\n                    for segment in segments)",
   "beats": [
    {
     "say": "Claude reads text and images, not audio. So a free speech-to-text model, Whisper, turns a spoken question into text.",
     "line": [
      1,
      2
     ]
    },
    {
     "say": "It loads once, when the app starts. The first run downloads about one hundred fifty megabytes.",
     "line": [
      1,
      2
     ],
     "vars": {
      "stt_model": "Whisper base (cpu, int8)"
     }
    },
    {
     "say": "Transcribe audio wraps the uploaded bytes so Whisper can read them like a file.",
     "line": [
      4,
      5,
      6
     ]
    },
    {
     "say": "Say you recorded two short sentences. Whisper returns two segments, each with a leading space.",
     "line": [
      5,
      6
     ],
     "vars": {
      "segments": "[\" What color is the car?\", \" Is it parked?\"]"
     }
    },
    {
     "say": "Strip trims each one, and join puts them together with single spaces.",
     "line": [
      7,
      8
     ],
     "vars": {
      "return": "\"What color is the car? Is it parked?\""
     }
    },
    {
     "say": "If the clip had no speech, there are no segments, so the result is an empty string.",
     "line": [
      7,
      8
     ],
     "vars": {
      "segments": "[]",
      "return": "\"\""
     }
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Lab · Steps 6 and 8",
   "title": "Three models in a chain",
   "nodes": [
    {
     "id": "you",
     "label": "Caller",
     "x": 12,
     "y": 50,
     "sub": "image + voice clip",
     "art": "mic"
    },
    {
     "id": "stt",
     "label": "Whisper",
     "x": 50,
     "y": 18,
     "sub": "speech to text",
     "art": "wave"
    },
    {
     "id": "vlm",
     "label": "Claude",
     "x": 88,
     "y": 50,
     "sub": "image + text → text",
     "art": "neural"
    },
    {
     "id": "tts",
     "label": "gTTS",
     "x": 50,
     "y": 82,
     "sub": "text to speech",
     "art": "megaphone"
    }
   ],
   "edges": [
    {
     "from": "you",
     "to": "stt"
    },
    {
     "from": "stt",
     "to": "vlm"
    },
    {
     "from": "vlm",
     "to": "tts"
    },
    {
     "from": "tts",
     "to": "you"
    }
   ],
   "beats": [
    {
     "say": "The ask voice endpoint chains three models. Follow one request.",
     "show": 4
    },
    {
     "say": "The caller sends the photo and a recorded question.",
     "show": 4,
     "on": "you",
     "send": {
      "from": "you",
      "to": "stt",
      "label": "test_audio.wav"
     }
    },
    {
     "say": "Whisper turns the speech into text. If it finds none, the endpoint stops with a four hundred error.",
     "show": 4,
     "on": "stt",
     "send": {
      "from": "stt",
      "to": "vlm",
      "label": "question text"
     }
    },
    {
     "say": "Claude looks at the checked image and answers in text. The terminal prints the question and the answer.",
     "show": 4,
     "on": "vlm",
     "send": {
      "from": "vlm",
      "to": "tts",
      "label": "answer text"
     }
    },
    {
     "say": "g T T S turns the answer into speech, saved as answer dot m p 3. It needs an internet connection.",
     "show": 4,
     "on": "tts",
     "send": {
      "from": "tts",
      "to": "you",
      "label": "answer.mp3"
     }
    },
    {
     "say": "Play the file, and you hear the answer. Text and voice, in and out.",
     "show": 4,
     "on": "you"
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Why does the voice endpoint need Whisper and g T T S as well as Claude?",
   "options": [
    "Claude takes text and images in and gives text out, it doesn't hear or speak audio",
    "They make Claude's answers more accurate",
    "Fast A P I requires them for uploads"
   ],
   "answer": 0,
   "good": "That's right. Claude doesn't hear or speak audio. Whisper turns speech into text, and g T T S turns the answer into speech.",
   "bad": "Not quite. Claude doesn't hear or speak audio. Whisper turns speech into text, and g T T S turns the answer into speech.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Why does the voice endpoint need Whisper and g T T S as well as Claude?",
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
     "Text and voice, in and out",
     ""
    ],
    [
     "Tested end to end",
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
     "say": "your image Q and A app supports text and voice input and output,",
     "show": 1
    },
    {
     "say": "tested end to end.",
     "show": 2
    },
    {
     "say": "Next, in Module 6, a search tool across text and images.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Project 6 (Module 6): Build a Multimodal Document Search Tool

**Time: about 3 hours**

**Goal:** Extend retrieval to work across modalities, finding relevant content by meaning, whether it's stored as text or images.

**Step 1: Create the project notebook.**
Create a new notebook for this project (**File → New notebook**) and name it `multimodal_search_project`.
```python
%pip install chromadb sentence-transformers pillow requests
```
Then run the API key cell from "Before you start", and paste and run the Project 2, Step 7 cell (`ask_claude_about_image` and `describe_image`) and the Project 4, Step 5 cell (`generate_caption` with styles). You can delete their `print(...)` lines.

**Step 2: Gather a mixed document set.**
Collect 10–15 items: some plain text documents, some images (diagrams, screenshots, photos with visible text). In the **Files** panel, make two folders: `documents` for the text, saved as `.txt` files, and `images` for the pictures (JPEG or PNG). Keep each text file short (a paragraph or two), because the embedding model in Step 4 only reads roughly the first 250 words of each item.

**Step 3: Understand multimodal embeddings.**
A **multimodal embedding model** maps both text and images into the *same* numeric embedding space, so a text query can be compared directly against image embeddings.

**Step 4: Generate embeddings for text documents.**
Add a **code cell**, paste in the code below, and run it with **Shift + Enter**.
```python
import os
from sentence_transformers import SentenceTransformer

text_model = SentenceTransformer("all-MiniLM-L6-v2")

text_documents = []   # the text of each document
text_sources = []     # the file each one came from
for filename in sorted(os.listdir("documents")):
    if filename.endswith(".txt"):
        with open(os.path.join("documents", filename), encoding="utf-8") as f:
            text_documents.append(f.read())
        text_sources.append(filename)

text_embeddings = text_model.encode(text_documents)
print(len(text_documents), "text documents, embedding shape:", text_embeddings.shape)
```
Each document becomes a list of 384 numbers. Documents with similar meaning get similar numbers.

**Step 5: Generate embeddings for images using a captioning bridge.**
```python
image_captions = []   # Claude's detailed caption for each image
image_sources = []    # the file each one came from
for filename in sorted(os.listdir("images")):
    extension = os.path.splitext(filename)[1].lower()
    if extension not in MEDIA_TYPES:
        continue
    caption = generate_caption(os.path.join("images", filename), style="detailed")
    image_captions.append(caption)
    image_sources.append(filename)
    print(filename, "->", caption[:80])

image_embeddings = text_model.encode(image_captions)
```
A simpler alternative to a true multimodal embedding model is **caption-then-embed**: describe the image in text (one Claude call per image, reusing Project 4's captioning), then embed that description using your existing text embedding model. The detailed style gives the search more words to match on.

**Step 6: Store both types in the same vector database.**
```python
import chromadb

client = chromadb.Client()
collection = client.get_or_create_collection("mixed_documents")

collection.add(
    documents=text_documents + image_captions,
    embeddings=text_embeddings.tolist() + image_embeddings.tolist(),
    ids=[f"item_{i}" for i in range(len(text_documents) + len(image_captions))],
    metadatas=[{"type": "text", "source": name} for name in text_sources]
              + [{"type": "image", "source": name} for name in image_sources],
)
print(collection.count(), "items stored")
```
**metadata** tags let you track which items are text vs. image, and which file each came from, so results can be handled differently (e.g., displaying the actual image, not just its caption). `get_or_create_collection` lets you rerun the cell without an "already exists" error. If you rerun it after changing your files, restart the runtime first so old items don't stay in the collection.

**Step 7: Query across both modalities.**
```python
from IPython.display import Image as ShowImage, display

def search(query, n_results=5):
    query_embedding = text_model.encode([query])
    results = collection.query(query_embeddings=query_embedding.tolist(), n_results=n_results)
    for document, metadata, distance in zip(results["documents"][0], results["metadatas"][0], results["distances"][0]):
        print(f"[{metadata['type']}] {metadata['source']}  (distance {distance:.3f})")
        if metadata["type"] == "image":
            display(ShowImage(filename=os.path.join("images", metadata["source"]), width=250))
        else:
            print("   ", document[:150])

search("diagram showing system architecture")
```
A smaller **distance** means a closer match. Image results show the actual picture, using the `source` you stored in the metadata.

**Step 8: Evaluate retrieval quality across both types.**
Try 5 queries designed to match text content and 5 designed to match image content, and manually judge relevance. Add a **text cell** headed `retrieval_evaluation` and note, for each query, whether the right item came first and any surprises.

### Final Project Structure

*If you worked in a notebook, these are the sections of your notebook (text and code cells), not separate files. Save or export them as files when you put the project in your portfolio.*

```text
multimodal_search_project/
│
├── documents/
├── images/
├── build_search.py
├── retrieval_evaluation.md
```

### What You Learned
- ✅ How multimodal embeddings enable cross-modality comparison
- ✅ The caption-then-embed bridging technique
- ✅ Storing mixed text/image content in one vector database
- ✅ Using metadata to track content type for downstream display
- ✅ Querying across both modalities with a single text query
- ✅ Evaluating retrieval quality separately per modality

### Portfolio Project
**Multimodal Document Search Tool**: Built a retrieval system combining text and image content in a single vector database using a caption-based embedding bridge, with retrieval quality evaluated across both modalities.
**Skills:** Vector Databases, Multimodal Embeddings, RAG, Python, Multimodal AI.

**Deliverable:** A working multimodal search tool, tested with queries targeting both text and image content.

### Quiz

1. What does caption-then-embed do, and why does it let one text query find images?
2. Why must the same embedding model be used for the documents, the image captions, and the query?
3. What is the metadata for in this search tool?
4. In the search results, does a smaller or larger distance mean a better match?

*Answers: 1) It has Claude describe each image in words, then embeds that description with the text model, so images and text end up as comparable numbers in one space. 2) Embeddings from different models live in different number spaces, so only vectors from the same model can be compared meaningfully. 3) It records whether each item is text or an image and which file it came from, so results can be shown correctly, such as displaying the actual image. 4) A smaller distance means the item is closer in meaning to the query.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "search",
   "kicker": "Project 6 · Multimodal document search",
   "title": "One query, text and images",
   "beats": [
    {
     "say": "Welcome to Module 6."
    },
    {
     "say": "You'll build a search tool that finds content by meaning, whether it's stored as text or images."
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Lab · Steps 3 to 6",
   "title": "Caption, then embed",
   "nodes": [
    {
     "id": "txt",
     "label": "Text files",
     "x": 12,
     "y": 25,
     "sub": "documents/*.txt",
     "art": "doc"
    },
    {
     "id": "img",
     "label": "Images",
     "x": 12,
     "y": 78,
     "sub": "images/",
     "art": "image"
    },
    {
     "id": "cap",
     "label": "Claude",
     "x": 45,
     "y": 78,
     "sub": "detailed caption",
     "art": "neural"
    },
    {
     "id": "emb",
     "label": "MiniLM",
     "x": 55,
     "y": 25,
     "sub": "384 numbers each",
     "art": "layers"
    },
    {
     "id": "db",
     "label": "Chroma",
     "x": 88,
     "y": 50,
     "sub": "mixed_documents",
     "art": "database"
    }
   ],
   "edges": [
    {
     "from": "txt",
     "to": "emb"
    },
    {
     "from": "img",
     "to": "cap"
    },
    {
     "from": "cap",
     "to": "emb"
    },
    {
     "from": "emb",
     "to": "db"
    }
   ],
   "beats": [
    {
     "say": "A true multimodal embedding model puts text and images into the same number space. There's a simpler bridge.",
     "show": 5
    },
    {
     "say": "Text files go straight to the text embedding model, all Mini L M.",
     "show": 5,
     "on": "txt",
     "send": {
      "from": "txt",
      "to": "emb",
      "label": "document text"
     }
    },
    {
     "say": "Images can't go there directly. So Claude first writes a detailed caption for each one, reusing Project 4.",
     "show": 5,
     "on": "cap",
     "send": {
      "from": "img",
      "to": "cap",
      "label": "one call each"
     }
    },
    {
     "say": "Then that caption is embedded by the same text model.",
     "show": 5,
     "on": "emb",
     "send": {
      "from": "cap",
      "to": "emb",
      "label": "caption text"
     }
    },
    {
     "say": "Every item is now three hundred eighty four numbers, and they all go into one Chroma collection.",
     "show": 5,
     "on": "db",
     "send": {
      "from": "emb",
      "to": "db",
      "label": "vectors + tags"
     }
    }
   ]
  },
  {
   "kind": "chart",
   "kicker": "Concept · Embeddings",
   "title": "Similar meaning, nearby numbers",
   "xlabel": "meaning (squashed)",
   "ylabel": "meaning (squashed)",
   "points": [
    [
     26,
     82
    ],
    [
     16,
     68
    ],
    [
     76,
     24
    ],
    [
     36,
     70
    ],
    [
     72,
     80
    ]
   ],
   "beats": [
    {
     "say": "Imagine squashing those three hundred eighty four numbers down to two, so we can plot them. Each dot is one item.",
     "groups": [
      0,
      0,
      0,
      0,
      0
     ]
    },
    {
     "say": "These three dots are the text documents.",
     "groups": [
      1,
      1,
      1,
      0,
      0
     ]
    },
    {
     "say": "These two are images, stored as their captions. They sit in the same space.",
     "groups": [
      1,
      1,
      1,
      2,
      2
     ]
    },
    {
     "say": "Items about similar things land close together, whatever their type: the A P I notes sit near the architecture diagram.",
     "groups": [
      1,
      1,
      1,
      2,
      2
     ]
    },
    {
     "say": "A query is embedded with the same model, so it lands in the same space too.",
     "groups": [
      1,
      1,
      1,
      2,
      2
     ],
     "marks": [
      [
       32,
       76
      ]
     ]
    },
    {
     "say": "The nearest dots are the best matches: first the architecture diagram, then the A P I notes. Smaller distance, closer meaning.",
     "groups": [
      1,
      3,
      1,
      3,
      2
     ],
     "marks": [
      [
       32,
       76
      ]
     ]
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Lab · Step 6",
   "title": "One collection, two types",
   "columns": [
    "id",
    "type",
    "source"
   ],
   "rows": [
    [
     "item_0",
     "text",
     "api_notes.txt"
    ],
    [
     "item_1",
     "text",
     "onboarding.txt"
    ],
    [
     "item_2",
     "text",
     "pricing.txt"
    ],
    [
     "item_3",
     "image",
     "architecture.png"
    ],
    [
     "item_4",
     "image",
     "team_photo.jpg"
    ]
   ],
   "beats": [
    {
     "say": "Say you have three text files and two images. Collection add stores them all together.",
     "sql": "documents = text_documents + image_captions"
    },
    {
     "say": "Texts come first, then captions, so the I Ds simply count up: item zero to item four.",
     "col": 0,
     "sql": "ids=[f\"item_{i}\" for i in range(3 + 2)]"
    },
    {
     "say": "The metadata records each item's type.",
     "col": 1
    },
    {
     "say": "And the file it came from.",
     "col": 2
    },
    {
     "say": "So when an image matches, you can show the real picture, not just its caption.",
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
   "kind": "table",
   "kicker": "Lab · Step 7",
   "title": "One text query, both kinds of result",
   "columns": [
    "Rank",
    "type",
    "source",
    "distance"
   ],
   "rows": [
    [
     "1",
     "image",
     "architecture.png",
     "0.712"
    ],
    [
     "2",
     "text",
     "api_notes.txt",
     "1.104"
    ],
    [
     "3",
     "text",
     "onboarding.txt",
     "1.390"
    ],
    [
     "4",
     "image",
     "team_photo.jpg",
     "1.655"
    ],
    [
     "5",
     "text",
     "pricing.txt",
     "1.701"
    ]
   ],
   "beats": [
    {
     "say": "Now search with plain text. The query is embedded with the same Mini L M model.",
     "sql": "search(\"diagram showing system architecture\")"
    },
    {
     "say": "Chroma returns the five nearest items, with their distances. These numbers are just an example.",
     "col": 3
    },
    {
     "say": "Smaller distance means a closer match. The architecture diagram comes first, even though it's an image.",
     "hl": 0,
     "col": 3
    },
    {
     "say": "Because its type is image, the search shows the actual picture, from the source in the metadata.",
     "hl": 0,
     "col": 1
    },
    {
     "say": "Text results print their first one hundred fifty characters instead.",
     "hl": [
      1,
      2,
      4
     ],
     "dim": true,
     "col": 1
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Lab · Step 8",
   "title": "Judge ten queries by hand",
   "values": [
    "T1",
    "T2",
    "T3",
    "T4",
    "T5",
    "I1",
    "I2",
    "I3",
    "I4",
    "I5"
   ],
   "beats": [
    {
     "say": "Now evaluate. Write five queries aimed at text, and five aimed at images."
    },
    {
     "say": "For each text query, did the right item come first? Say four of five did.",
     "ok": [
      0,
      1,
      3,
      4
     ],
     "gone": [
      2
     ],
     "note": "text: 4 of 5 right first"
    },
    {
     "say": "Then the image queries. Say three of five.",
     "ok": [
      0,
      1,
      3,
      4,
      5,
      7,
      9
     ],
     "gone": [
      2,
      6,
      8
     ],
     "note": "images: 3 of 5 right first"
    },
    {
     "say": "Judge each type separately. Here, image search is weaker, maybe because a caption missed a detail. Note surprises like that in retrieval evaluation.",
     "ok": [
      0,
      1,
      3,
      4,
      5,
      7,
      9
     ],
     "gone": [
      2,
      6,
      8
     ],
     "hl": [
      6,
      8
     ],
     "note": "check those captions"
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Why must one embedding model embed the documents, the captions and the query?",
   "options": [
    "It's cheaper to load one model",
    "Embeddings from different models live in different number spaces",
    "Chroma only accepts one model"
   ],
   "answer": 1,
   "good": "That's right. Embeddings from different models live in different number spaces, so only vectors from the same model compare meaningfully.",
   "bad": "Not quite. Embeddings from different models live in different number spaces, so only vectors from the same model compare meaningfully.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Why must one embedding model embed the documents, the captions and the query?",
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
     "A working multimodal search",
     ""
    ],
    [
     "Tested on text and image queries",
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
     "say": "your multimodal search tool works,",
     "show": 1
    },
    {
     "say": "tested with queries targeting both text and image content.",
     "show": 2
    },
    {
     "say": "Next, in Module 7, evaluating a multimodal system.",
     "show": 2
    }
   ]
  }
 ]
}
```

---

## Project 7 (Module 7): Evaluate a Multimodal System on a Test Set

**Time: about 2 hours**

**Goal:** Test what you've built for quality and bias, the discipline that separates a demo from something you'd trust in production.

**Step 1: Create the project notebook.**
Create a new notebook for this project (**File → New notebook**) and name it `multimodal_evaluation_project`.

**Step 2: Choose which system to evaluate.**
Pick your Project 4 captioning tool, Project 5 Q&A app, or Project 6 search tool.

**Step 3: Build a test set.**
Add a **text cell** headed `test_set` and write your notes in it.
Collect 15–20 diverse test cases: varied image types (simple, complex, text-containing, low-quality), varied questions or queries.

**Step 4: Define evaluation metrics.**
For generative multimodal output, common metrics include **accuracy** (is the answer factually correct), **relevance** (does it address the actual question), and **hallucination rate** (does it describe things that aren't actually present).

**Step 5: Score each test case.**
Add a **text cell** headed `evaluation_results` and write your notes in it.
Run each test case through the system and score it 1–5 on each metric from Step 4.

**Step 6: Check for failure modes by category.**
Common multimodal failure modes include struggling with **low-quality or low-resolution images**, **dense text within images** (OCR-like tasks), and **unusual or out-of-distribution content**.

**Step 7: Check for bias across image content.**
Test with images depicting a range of people, settings, and contexts, and note any systematic differences in caption quality, tone, or accuracy.

**Step 8: Write the evaluation report.**
Add a **text cell** headed `evaluation_report` and write your notes in it.
Structure: Test set description → Metrics → Scores → Failure mode analysis → Bias check findings → Recommendations for improvement.

### Final Project Structure

*If you worked in a notebook, these are the sections of your notebook (text and code cells), not separate files. Save or export them as files when you put the project in your portfolio.*

```text
multimodal_evaluation_project/
│
├── test_set.md
├── evaluation_results.md
├── evaluation_report.md
```

### What You Learned
- ✅ Building a diverse, realistic test set
- ✅ Defining accuracy, relevance, and hallucination-rate metrics
- ✅ Systematically scoring a multimodal system
- ✅ Identifying categorized failure modes
- ✅ Checking for bias across varied image content
- ✅ Writing an actionable evaluation report

### Portfolio Project
**Multimodal System Evaluation**: Built a diverse test set and evaluation rubric for a multimodal system, measuring accuracy, relevance, and hallucination rate, with a dedicated bias check across varied content.
**Skills:** AI Evaluation, Bias Testing, Quality Assurance, Multimodal AI, Responsible AI.

**Deliverable:** A structured evaluation report with scores, failure mode analysis, and bias findings for a multimodal system.

### Quiz

1. Why should a test set include low-quality, text-heavy, and unusual images, not just clear photos?
2. What is a hallucination rate for an image system?
3. What is the difference between accuracy and relevance as metrics?
4. How do you check a multimodal system for bias?

*Answers: 1) Those are the cases where multimodal systems commonly fail, and a test set of easy images would hide those weaknesses. 2) How often the output describes things that are not actually in the image. 3) Accuracy asks whether the answer is factually correct; relevance asks whether it addresses the question that was actually asked. 4) Test it on images showing a range of people, settings, and contexts, and look for systematic differences in quality, tone, or accuracy between groups.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "test",
   "kicker": "Project 7 · Evaluate a multimodal system",
   "title": "Demo or trustworthy?",
   "beats": [
    {
     "say": "Welcome to the last module."
    },
    {
     "say": "Testing for quality and bias is what separates a demo from something you'd trust in production."
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Lab · Steps 2 and 3",
   "title": "A test set full of hard cases",
   "columns": [
    "Case",
    "Image type",
    "Question"
   ],
   "rows": [
    [
     "1",
     "simple: a mug",
     "What is this?"
    ],
    [
     "2",
     "complex: a market",
     "How many stalls?"
    ],
    [
     "3",
     "text: a menu",
     "Price of tea?"
    ],
    [
     "4",
     "low-res: a sign",
     "What does it say?"
    ],
    [
     "5",
     "unusual: abstract art",
     "Describe it."
    ],
    [
     "6",
     "low-light: a room",
     "Is anyone there?"
    ]
   ],
   "beats": [
    {
     "say": "Pick one system to test: say, your Project 5 Q and A app."
    },
    {
     "say": "Collect fifteen to twenty cases. Here are six of them. A clear photo is the easy one.",
     "hl": 0,
     "col": 1
    },
    {
     "say": "The rest are harder: a busy scene, dense text, a blurry image,",
     "hl": [
      1,
      2,
      3
     ],
     "col": 1
    },
    {
     "say": "unusual content, and a dark photo.",
     "hl": [
      4,
      5
     ],
     "col": 1
    },
    {
     "say": "A test set of easy images would hide exactly the cases where these systems fail.",
     "hl": [
      1,
      2,
      3,
      4,
      5
     ],
     "dim": true
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Lab · Step 4",
   "title": "Three metrics on one answer",
   "columns": [
    "Metric",
    "Asks",
    "This answer"
   ],
   "rows": [
    [
     "Accuracy",
     "factually correct?",
     "yes, it is red"
    ],
    [
     "Relevance",
     "answers the question?",
     "yes"
    ],
    [
     "Hallucination",
     "invents things?",
     "yes: no bicycle"
    ]
   ],
   "beats": [
    {
     "say": "Say you ask: what color is the car? The answer: the red car is parked next to a bicycle. But there's no bicycle.",
     "sql": "Q: What color is the car?\nA: The red car is parked next to a bicycle."
    },
    {
     "say": "Accuracy asks whether the answer is factually correct. The car really is red.",
     "hl": 0
    },
    {
     "say": "Relevance asks whether it addresses the question that was asked. It does.",
     "hl": 1
    },
    {
     "say": "Hallucination asks whether it describes things that aren't there. The bicycle is invented.",
     "hl": 2
    },
    {
     "say": "One answer can pass two metrics and still fail the third. That's why you score them separately.",
     "hl": [
      0,
      1,
      2
     ],
     "col": 2
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Lab · Steps 5 and 6",
   "title": "Score every case, then look for patterns",
   "columns": [
    "Case",
    "Accuracy",
    "Relevance",
    "Hallucinated?"
   ],
   "rows": [
    [
     "1 · simple",
     "5",
     "5",
     "no"
    ],
    [
     "2 · complex",
     "3",
     "5",
     "no"
    ],
    [
     "3 · menu text",
     "2",
     "4",
     "yes"
    ],
    [
     "4 · low-res",
     "1",
     "4",
     "yes"
    ],
    [
     "5 · abstract",
     "4",
     "4",
     "no"
    ],
    [
     "6 · low-light",
     "3",
     "5",
     "no"
    ]
   ],
   "beats": [
    {
     "say": "Run each case and score it from one to five. These scores are an example."
    },
    {
     "say": "Accuracy averages three: eighteen points over six cases.",
     "col": 1,
     "sql": "accuracy: 18 / 6 = 3.0"
    },
    {
     "say": "Relevance averages four and a half: the app nearly always answers the question.",
     "col": 2,
     "sql": "accuracy: 18 / 6 = 3.0 · relevance: 27 / 6 = 4.5"
    },
    {
     "say": "Two of six answers invented something. That's a hallucination rate of one in three.",
     "col": 3,
     "hl": [
      2,
      3
     ],
     "sql": "accuracy 3.0 · relevance 4.5 · hallucination 2 / 6 = 33%"
    },
    {
     "say": "Now group by category. The failures cluster in dense text and low resolution, two classic failure modes.",
     "hl": [
      2,
      3
     ],
     "dim": true,
     "col": 0
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Lab · Step 7",
   "title": "Check for bias across content",
   "columns": [
    "Image set",
    "Cases",
    "Avg accuracy",
    "Note"
   ],
   "rows": [
    [
     "People, city",
     "4",
     "4.5",
     "detailed"
    ],
    [
     "People, rural",
     "4",
     "3.0",
     "vaguer, generic"
    ],
    [
     "Older adults",
     "3",
     "4.3",
     "detailed"
    ],
    [
     "Younger adults",
     "3",
     "4.3",
     "detailed"
    ]
   ],
   "beats": [
    {
     "say": "Step seven: test images showing a range of people, settings and contexts. These numbers are an example.",
     "sql": "look for systematic differences: quality · tone · accuracy"
    },
    {
     "say": "Compare each set's accuracy, and read the captions for detail and tone.",
     "col": 2
    },
    {
     "say": "Here, rural scenes score lower, and their captions are vaguer.",
     "hl": 1,
     "dim": true,
     "col": 2
    },
    {
     "say": "A gap that repeats across a whole group is a finding. Write it down, with the examples.",
     "hl": 1,
     "dim": true,
     "col": 3
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Lab · Step 8",
   "title": "The evaluation report, in order",
   "values": [
    "Test set",
    "Metrics",
    "Scores",
    "Failure modes",
    "Bias check",
    "Fixes"
   ],
   "beats": [
    {
     "say": "Last, write the evaluation report, in six parts."
    },
    {
     "say": "Describe the test set, and the metrics you used.",
     "hl": [
      0,
      1
     ],
     "ptr": {
      "now": 1
     }
    },
    {
     "say": "Then the scores: three point oh accuracy, four point five relevance, thirty three percent hallucination.",
     "ok": [
      0,
      1
     ],
     "hl": 2,
     "ptr": {
      "now": 2
     }
    },
    {
     "say": "Then the failure modes: dense text and low resolution.",
     "ok": [
      0,
      1,
      2
     ],
     "hl": 3,
     "ptr": {
      "now": 3
     }
    },
    {
     "say": "Then the bias findings, like the weaker rural captions.",
     "ok": [
      0,
      1,
      2,
      3
     ],
     "hl": 4,
     "ptr": {
      "now": 4
     }
    },
    {
     "say": "And end with recommendations, so the report leads to real fixes.",
     "ok": [
      0,
      1,
      2,
      3,
      4
     ],
     "hl": 5,
     "ptr": {
      "now": 5
     },
     "note": "e.g. warn on blurry uploads"
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "What's the difference between accuracy and relevance?",
   "options": [
    "They mean the same thing",
    "Relevance measures hallucinations",
    "Accuracy asks if it's correct, relevance asks if it answers the actual question"
   ],
   "answer": 2,
   "good": "That's right. Accuracy asks whether the answer is factually correct. Relevance asks whether it addresses the question that was actually asked.",
   "bad": "Not quite. Accuracy asks whether the answer is factually correct. Relevance asks whether it addresses the question that was actually asked.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "What's the difference between accuracy and relevance?",
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
     "A report with scores",
     ""
    ],
    [
     "Failure mode analysis",
     ""
    ],
    [
     "Bias findings",
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
     "say": "you have a structured evaluation report with scores,",
     "show": 1
    },
    {
     "say": "failure mode analysis,",
     "show": 2
    },
    {
     "say": "and bias findings for a multimodal system.",
     "show": 3
    },
    {
     "say": "You've finished Multimodal A I Engineer. Well done.",
     "show": 3
    }
   ]
  }
 ]
}
```
