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
   "kind": "list",
   "art": "layers",
   "kicker": "Concept",
   "title": "Four modalities",
   "items": [
    [
     "Text",
     "Words"
    ],
    [
     "Image",
     "Still pictures"
    ],
    [
     "Audio",
     "Speech and sound"
    ],
    [
     "Video",
     "Moving images, often with audio"
    ]
   ],
   "beats": [
    {
     "say": "This course covers four modalities.",
     "show": 0
    },
    {
     "say": "Text: words.",
     "show": 1
    },
    {
     "say": "Image: still pictures.",
     "show": 2
    },
    {
     "say": "Audio: speech and sound.",
     "show": 3
    },
    {
     "say": "And video: moving images, often with audio.",
     "show": 4
    },
    {
     "say": "A multimodal model processes or generates more than one of these.",
     "show": 4
    }
   ]
  },
  {
   "kind": "list",
   "art": "neural",
   "kicker": "Concept",
   "title": "Model categories",
   "items": [
    [
     "Vision-language (VLM)",
     "Images + text together"
    ],
    [
     "STT and TTS",
     "Audio ↔ text"
    ],
    [
     "Image generation",
     "Images from text prompts"
    ]
   ],
   "beats": [
    {
     "say": "Models fall into categories by what they can do.",
     "show": 0
    },
    {
     "say": "Vision-language models, or V L Ms, understand images and text together.",
     "show": 1
    },
    {
     "say": "Speech-to-text and text-to-speech models convert between audio and text.",
     "show": 2
    },
    {
     "say": "And image generation models create images from text prompts.",
     "show": 3
    }
   ]
  },
  {
   "kind": "flow",
   "art": "table",
   "kicker": "Lab · Steps 4 to 7",
   "title": "Build your survey",
   "steps": [
    "2 to 3 models per category",
    "One differentiator each",
    "Input and output formats",
    "Size limits",
    "Comparison summary"
   ],
   "beats": [
    {
     "say": "In a text cell called model survey, research two or three models per category.",
     "show": 1
    },
    {
     "say": "For each, note one key differentiator: cost, quality, latency, or licensing.",
     "show": 2
    },
    {
     "say": "Write down the input format it expects, like a base64 image or a raw audio file, and what it returns.",
     "show": 3
    },
    {
     "say": "Note size limits, like image resolution, audio length, or combined token count.",
     "show": 4
    },
    {
     "say": "Then, in a comparison summary, pick your top model for each combination, and say why.",
     "show": 5
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
   "art": "image",
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
   "kind": "code",
   "art": "code",
   "kicker": "Lab · Steps 2 and 3",
   "title": "Load and encode an image",
   "file": "process.py",
   "code": "from PIL import Image\nimg = Image.open(\"test_image.jpg\")\nprint(img.size, img.format)\n\nimport base64\nwith open(\"test_image.jpg\", \"rb\") as f:\n    image_data = base64.b64encode(f.read()).decode(\"utf-8\")",
   "beats": [
    {
     "say": "Open your photo with Pillow and print its size and format.",
     "show": 0
    },
    {
     "say": "Then base64 encode it.",
     "show": 1
    },
    {
     "say": "Base64 turns the image's binary data into a text string that fits safely inside a J S O N request.",
     "show": 1
    }
   ]
  },
  {
   "kind": "code",
   "art": "api",
   "kicker": "Lab · Step 4",
   "title": "The content array",
   "file": "process.py",
   "code": "\"messages\": [{\n    \"role\": \"user\",\n    \"content\": [\n        {\"type\": \"image\", \"source\": {\"type\": \"base64\",\n            \"media_type\": \"image/jpeg\", \"data\": image_data}},\n        {\"type\": \"text\", \"text\": \"Describe what's in this image.\"}\n    ]\n}]",
   "beats": [
    {
     "say": "Now post to the Claude messages A P I.",
     "show": 0
    },
    {
     "say": "The message content is a list. It holds an image block and a text block, side by side.",
     "show": 1
    },
    {
     "say": "The reply comes back as a list of blocks too. The text is in the blocks whose type is text.",
     "show": 1
    }
   ]
  },
  {
   "kind": "list",
   "art": "test",
   "kicker": "Lab · Steps 5 and 6",
   "title": "Test it, then resize",
   "items": [
    [
     "Varied questions",
     "Describe · count · read text"
    ],
    [
     "img.thumbnail((1024, 1024))",
     "Smaller, same aspect ratio"
    ]
   ],
   "beats": [
    {
     "say": "Run it on three or four images, asking different things: describe it, count objects, read the text in it.",
     "show": 1
    },
    {
     "say": "Then shrink large images with thumbnail, to at most ten twenty four pixels. It keeps the aspect ratio.",
     "show": 2
    },
    {
     "say": "Large images cost more and can hit the size limit, so resizing first is a good habit.",
     "show": 2
    }
   ]
  },
  {
   "kind": "list",
   "art": "package",
   "kicker": "Lab · Step 7",
   "title": "One reusable function",
   "items": [
    [
     "ask_claude_about_image",
     "Bytes + media type + question → text"
    ],
    [
     "\"system\" field",
     "Top level, not a message"
    ],
    [
     "describe_image",
     "Media type from the extension"
    ]
   ],
   "beats": [
    {
     "say": "Finally, wrap it all in a function. Later projects reuse it, so keep it handy.",
     "show": 0
    },
    {
     "say": "Ask Claude about image takes raw bytes, a media type and a question, and returns the answer text.",
     "show": 1
    },
    {
     "say": "A top-level system field tells Claude to say so when it can't tell, instead of guessing.",
     "show": 2
    },
    {
     "say": "And describe image looks up the media type from the file extension, failing early on unsupported types.",
     "show": 3
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
   "art": "pixels",
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
   "kind": "code",
   "art": "array",
   "kicker": "Lab · Step 2",
   "title": "An image is an array",
   "file": "extract_features.py",
   "code": "img = Image.open(\"test_image.jpg\").convert(\"RGB\")\nimg_array = np.array(img)\nprint(\"Shape:\", img_array.shape)\nprint(\"Mean color:\", img_array.mean(axis=(0,1)))",
   "beats": [
    {
     "say": "Turn the image into a numpy array.",
     "show": 0
    },
    {
     "say": "Its shape gives height, width, and color channels.",
     "show": 1
    },
    {
     "say": "And the mean color gives the average red, green and blue intensity.",
     "show": 1
    },
    {
     "say": "Next, a histogram of those values shows how brightness is spread across the image.",
     "show": 1
    }
   ]
  },
  {
   "kind": "code",
   "art": "wave",
   "kicker": "Lab · Step 4",
   "title": "Audio is numbers over time",
   "file": "extract_features.py",
   "code": "import librosa\naudio, sample_rate = librosa.load(\"test_audio.wav\")\nprint(\"Duration:\", len(audio) / sample_rate, \"seconds\")\nprint(\"Sample rate:\", sample_rate)",
   "beats": [
    {
     "say": "Load the audio clip with librosa.",
     "show": 0
    },
    {
     "say": "The sample rate is how many times per second the signal was measured.",
     "show": 1
    },
    {
     "say": "Audio is a sequence of numbers over time, just as an image is a grid of numbers over space.",
     "show": 1
    }
   ]
  },
  {
   "kind": "list",
   "art": "bars",
   "kicker": "Lab · Steps 5 and 6",
   "title": "Spectrogram and tempo",
   "items": [
    [
     "Spectrogram",
     "Frequencies over time"
    ],
    [
     "Tempo",
     "Beats per minute · rough on speech"
    ]
   ],
   "beats": [
    {
     "say": "A spectrogram turns the waveform into a picture of frequency content over time.",
     "show": 1
    },
    {
     "say": "You make a mel spectrogram, and save it as spectrogram dot P N G.",
     "show": 1
    },
    {
     "say": "Then estimate the tempo in beats per minute. It means most for music. On speech, it's rough.",
     "show": 2
    }
   ]
  },
  {
   "kind": "quote",
   "art": "neural",
   "kicker": "Lab · Step 7",
   "title": "Connect it to real models",
   "quote": "Models learn their own features from the same raw numbers.",
   "beats": [
    {
     "say": "Finish with a few sentences of notes.",
     "show": 0
    },
    {
     "say": "A real multimodal model learns its own features from the same raw numbers, automatically, and at much greater scale.",
     "show": 1
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
   "art": "sparkle",
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
   "kind": "flow",
   "art": "architecture",
   "kicker": "Concept",
   "title": "How vision meets language",
   "steps": [
    "Image",
    "Vision transformer → numbers",
    "Aligned with words",
    "Caption"
   ],
   "beats": [
    {
     "say": "How does a model connect the two?",
     "show": 0
    },
    {
     "say": "A vision transformer encodes the image into a numeric representation.",
     "show": 1
    },
    {
     "say": "Text-image embedding alignment means the model has learned to relate that representation to relevant words and concepts.",
     "show": 2
    },
    {
     "say": "That's what lets it write a caption.",
     "show": 3
    }
   ]
  },
  {
   "kind": "code",
   "art": "pencil",
   "kicker": "Lab · Step 5",
   "title": "Caption styles",
   "file": "caption.py",
   "code": "def generate_caption(image_path, style=\"concise\"):\n    prompts = {\n        \"concise\": \"Write a single, concise caption for this image.\",\n        \"detailed\": \"Write a detailed, descriptive caption for this image.\",\n        \"alt_text\": \"Write accessible alt-text for this image, suitable for a screen reader.\",\n    }\n    return describe_image(image_path, prompts[style])",
   "beats": [
    {
     "say": "Generate caption reuses describe image from Project 2.",
     "show": 0
    },
    {
     "say": "A dictionary picks the prompt by style: concise, detailed, or alt text.",
     "show": 1
    },
    {
     "say": "Alt text is written for screen reader users, describing an image for someone who can't see it.",
     "show": 1
    },
    {
     "say": "No A P I code changes. Only the prompt does.",
     "show": 1
    }
   ]
  },
  {
   "kind": "list",
   "art": "star",
   "kicker": "Lab · Steps 4 and 6",
   "title": "Test hard images, then rate them",
   "items": [
    [
     "5 varied images",
     "Simple · complex · text · abstract · people"
    ],
    [
     "Rate 1 to 5",
     "Accuracy and usefulness"
    ],
    [
     "Note errors",
     "Misidentified or hallucinated"
    ]
   ],
   "beats": [
    {
     "say": "Upload five varied images into an images folder.",
     "show": 0
    },
    {
     "say": "A simple object, a complex scene, a photo with text, an abstract image, and one with people.",
     "show": 1
    },
    {
     "say": "Rate each caption from one to five on accuracy and usefulness.",
     "show": 2
    },
    {
     "say": "And note errors, like misidentified objects or hallucinated details: things the caption says that aren't really there.",
     "show": 3
    }
   ]
  },
  {
   "kind": "big",
   "art": "loop",
   "kicker": "Lab · Step 7",
   "title": "Caption a whole folder",
   "big": "filename: caption",
   "sub": "one line per image in the folder",
   "beats": [
    {
     "say": "Finally, loop over the images folder, skipping non-image files.",
     "show": 0
    },
    {
     "say": "And print a caption for every image.",
     "show": 1
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
   "art": "chat",
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
   "kind": "flow",
   "art": "terminal",
   "kicker": "Lab · Step 1",
   "title": "Set up the project",
   "steps": [
    "mkdir image_qa_app_project",
    "Create and activate .venv",
    "pip install fastapi …",
    "export ANTHROPIC_API_KEY"
   ],
   "beats": [
    {
     "say": "Make a project folder.",
     "show": 1
    },
    {
     "say": "Create a virtual environment, a private set of packages for this project, and turn it on.",
     "show": 2
    },
    {
     "say": "Install Fast A P I, uvicorn, python multipart, and requests.",
     "show": 3
    },
    {
     "say": "Set your A P I key as an environment variable in the terminal, never in a file.",
     "show": 4
    }
   ]
  },
  {
   "kind": "code",
   "art": "api",
   "kicker": "Lab · Step 2",
   "title": "The ask endpoint",
   "file": "app.py",
   "code": "@app.post(\"/ask\")\ndef ask_about_image(image: UploadFile, question: str = Form()):\n    image_bytes = read_checked_image(image)\n    answer = ask_claude_about_image(image_bytes, image.content_type, question)\n    return {\"answer\": answer}",
   "beats": [
    {
     "say": "In app dot py, the ask endpoint takes an uploaded image and a question.",
     "show": 0
    },
    {
     "say": "Upload file receives the file's bytes. Form receives the question, sent in the same request.",
     "show": 1
    },
    {
     "say": "Read checked image rejects anything that isn't a J P E G or P N G, with a four hundred error.",
     "show": 1
    },
    {
     "say": "It's a plain def, because the A P I call blocks while it waits.",
     "show": 1
    }
   ]
  },
  {
   "kind": "flow",
   "art": "pipeline",
   "kicker": "Lab · Steps 5 and 6",
   "title": "Three models in a chain",
   "steps": [
    "Whisper: audio → text",
    "Claude: image + text → text",
    "gTTS: text → audio"
   ],
   "beats": [
    {
     "say": "Claude reads text and images, not audio. So the voice endpoint chains three models.",
     "show": 0
    },
    {
     "say": "Faster whisper, a free speech-to-text model, turns the spoken question into text.",
     "show": 1
    },
    {
     "say": "Claude answers it about the image.",
     "show": 2
    },
    {
     "say": "And g T T S, text-to-speech, saves the answer as an M P 3.",
     "show": 3
    }
   ]
  },
  {
   "kind": "list",
   "art": "test",
   "kicker": "Lab · Steps 7 and 8",
   "title": "Test errors, then the full flow",
   "items": [
    [
     "notes.txt as image",
     "400 · app keeps running ✓"
    ],
    [
     "/ask_voice",
     "Hear the spoken answer"
    ]
   ],
   "beats": [
    {
     "say": "Send a text file instead of an image.",
     "show": 0
    },
    {
     "say": "You get a clear four hundred error, and the app keeps running.",
     "show": 1
    },
    {
     "say": "Then record a voice question about your photo, send it to ask voice, and play answer dot M P 3.",
     "show": 2
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
   "kind": "flow",
   "art": "merge",
   "kicker": "Concept",
   "title": "Caption, then embed",
   "steps": [
    "Image",
    "Claude: detailed caption",
    "Embed the caption",
    "Same space as text"
   ],
   "beats": [
    {
     "say": "A multimodal embedding model maps text and images into the same number space.",
     "show": 0
    },
    {
     "say": "This project uses a simpler bridge, caption then embed.",
     "show": 0
    },
    {
     "say": "Claude writes a detailed caption for each image.",
     "show": 1
    },
    {
     "say": "The same text embedding model embeds that caption.",
     "show": 2
    },
    {
     "say": "Now images and text are comparable numbers, so one text query can find both.",
     "show": 3
    }
   ]
  },
  {
   "kind": "code",
   "art": "database",
   "kicker": "Lab · Step 6",
   "title": "One collection, two types",
   "file": "build_search.py",
   "code": "collection.add(\n    documents=text_documents + image_captions,\n    embeddings=text_embeddings.tolist() + image_embeddings.tolist(),\n    ids=[f\"item_{i}\" for i in range(len(text_documents) + len(image_captions))],\n    metadatas=[{\"type\": \"text\", \"source\": name} for name in text_sources]\n              + [{\"type\": \"image\", \"source\": name} for name in image_sources],\n)",
   "beats": [
    {
     "say": "Store everything in one Chroma collection.",
     "show": 0
    },
    {
     "say": "Documents and captions together, with their embeddings.",
     "show": 1
    },
    {
     "say": "Metadata records whether each item is text or an image, and which file it came from.",
     "show": 1
    }
   ]
  },
  {
   "kind": "list",
   "art": "scatter",
   "kicker": "Lab · Step 7",
   "title": "Search both at once",
   "items": [
    [
     "Same model for the query",
     "Comparable numbers"
    ],
    [
     "Smaller distance",
     "Closer match ✓"
    ],
    [
     "Image result",
     "Show the real picture"
    ]
   ],
   "beats": [
    {
     "say": "To search, embed the query with the same model, and query the collection.",
     "show": 1
    },
    {
     "say": "A smaller distance means a closer match.",
     "show": 2
    },
    {
     "say": "Image results show the actual picture, using the source stored in the metadata.",
     "show": 3
    }
   ]
  },
  {
   "kind": "big",
   "art": "checklist",
   "kicker": "Lab · Step 8",
   "title": "Judge the results",
   "big": "5 + 5 queries",
   "sub": "did the right item come first?",
   "beats": [
    {
     "say": "Try five queries aimed at text, and five aimed at images.",
     "show": 0
    },
    {
     "say": "For each, note whether the right item came first, and any surprises.",
     "show": 1
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
   "kind": "list",
   "art": "checklist",
   "kicker": "Lab · Steps 2 and 3",
   "title": "Pick a system, build a test set",
   "items": [
    [
     "One system",
     "Project 4, 5 or 6"
    ],
    [
     "15 to 20 test cases",
     "Simple · complex · text · low quality"
    ]
   ],
   "beats": [
    {
     "say": "Pick your captioning tool, your Q and A app, or your search tool.",
     "show": 1
    },
    {
     "say": "Then collect fifteen to twenty diverse test cases.",
     "show": 2
    },
    {
     "say": "Varied images: simple, complex, text-containing, and low quality. And varied questions.",
     "show": 2
    }
   ]
  },
  {
   "kind": "list",
   "art": "star",
   "kicker": "Lab · Steps 4 and 5",
   "title": "Three metrics",
   "items": [
    [
     "Accuracy",
     "Factually correct?"
    ],
    [
     "Relevance",
     "Answers the actual question?"
    ],
    [
     "Hallucination rate",
     "Describes what isn't there?"
    ]
   ],
   "beats": [
    {
     "say": "Score each case from one to five on three metrics.",
     "show": 0
    },
    {
     "say": "Accuracy: is the answer factually correct?",
     "show": 1
    },
    {
     "say": "Relevance: does it address the actual question?",
     "show": 2
    },
    {
     "say": "Hallucination rate: does it describe things that aren't actually there?",
     "show": 3
    }
   ]
  },
  {
   "kind": "list",
   "art": "warning",
   "kicker": "Lab · Steps 6 and 7",
   "title": "Failure modes and bias",
   "items": [
    [
     "Low quality",
     "Low resolution"
    ],
    [
     "Dense text",
     "OCR-like tasks"
    ],
    [
     "Unusual content",
     "Out of distribution"
    ],
    [
     "Bias check",
     "Range of people and settings"
    ]
   ],
   "beats": [
    {
     "say": "Check the common failure modes.",
     "show": 0
    },
    {
     "say": "Low-quality or low-resolution images.",
     "show": 1
    },
    {
     "say": "Dense text within images.",
     "show": 2
    },
    {
     "say": "Unusual, out-of-distribution content.",
     "show": 3
    },
    {
     "say": "Then test images showing a range of people, settings and contexts, and note systematic differences in quality, tone, or accuracy.",
     "show": 4
    }
   ]
  },
  {
   "kind": "flow",
   "art": "doc",
   "kicker": "Lab · Step 8",
   "title": "The evaluation report",
   "steps": [
    "Test set",
    "Metrics",
    "Scores",
    "Failures and bias",
    "Recommendations"
   ],
   "beats": [
    {
     "say": "Write it up in a set order.",
     "show": 0
    },
    {
     "say": "The test set, the metrics, and the scores.",
     "show": 3
    },
    {
     "say": "Failure modes, bias findings, and recommendations for improvement.",
     "show": 5
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
