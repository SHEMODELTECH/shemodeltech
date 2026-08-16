# Robotics AI Engineer: Hands-On Project Tutorials

This document turns every project in the **Robotics AI Engineer Foundations Course** into a step-by-step, hands-on tutorial. You learn each idea at the moment you need it, while building the thing. Projects use simulation so you can complete this course without owning physical robot hardware.

Follow the projects in order. Each one hands off a skill or artifact to the next, ending in the Final Capstone.

---

## Project 1 (Module 1): Diagram the Components of a Robotic System

**Goal:** Before writing any code, learn to see a robot as a system of interacting parts, so every later project has a place to plug into.

**Step 1: Set up a project folder.**
```bash
mkdir robot_system_diagram_project
cd robot_system_diagram_project
```

**Step 2: Define your example robot's task.**
Write one sentence: what does your robot do? Example: "A small wheeled robot that navigates a room and avoids obstacles."

**Step 3: Understand the sense-think-act loop.**
Robots operate on a repeating cycle, **sense** (gather data from sensors), **think** (process that data and decide what to do), **act** (command the actuators to move).

**Step 4: List your robot's sensors.**
A **sensor** is a device that measures something about the environment, a **camera** captures images, a **LiDAR** measures distance using laser pulses, an **IMU (inertial measurement unit)** measures orientation and acceleration.

**Step 5: List your robot's actuators.**
An **actuator** is anything that lets the robot physically act, motors driving wheels, a robotic arm's joints, or a gripper.

**Step 6: Identify the "think" component.**
Note: where does processing happen, an onboard computer, or a connection to a more powerful remote system?

**Step 7: The sense-think-act loop.**
Your robot repeats this cycle continuously: sensors feed perception, perception drives the decision, the decision commands the actuators, and the changed environment is sensed again.

```mermaid
flowchart LR
    S["Sense: cameras, LiDAR, encoders"] --> T["Think: process data and decide"]
    T --> A["Act: motors, arm, gripper"]
    A -->|environment changes| S
```

**Step 8: Note one safety consideration.**
Write one sentence: what's the worst thing that could happen if this robot's "think" step made a bad decision, and what would prevent it?

### Final Project Structure
```text
robot_system_diagram_project/
│
├── robot_task.md
├── sense_think_act_diagram.png
```

### What You Learned
- ✅ The sense-think-act loop
- ✅ Common robotics sensors (camera, LiDAR, IMU) and what they measure
- ✅ Common actuators and their role
- ✅ Where processing/decision-making happens in a robotic system
- ✅ Diagramming a complete robotic system
- ✅ Baseline safety thinking for robotic systems

### Portfolio Project
**Robotic System Architecture Diagram**: Diagrammed a complete sense-think-act robotic system for a defined task, including sensor and actuator selection and a baseline safety consideration.
**Skills:** Systems Thinking, Robotics Fundamentals, Technical Documentation, Safety-Aware Design.

**Deliverable:** A sense-think-act diagram for your example robot, with sensors, actuators, and one documented safety consideration.

---

## Project 2 (Module 2): Build a Simple Sensor-Data Processing Script

**Goal:** Get real (or simulated) sensor data flowing through code, the first hands-on contact with the "sense" part of your Project 1 loop.

**Step 1: Set up a project folder.**
```bash
mkdir sensor_processing_project
cd sensor_processing_project
pip install --break-system-packages numpy matplotlib
```

**Step 2: Simulate a basic distance sensor.**
```bash
nano sensor_processing.py
```
```python
import numpy as np

def simulate_distance_sensor(num_readings=100):
    true_distance = 2.0  # meters
    noise = np.random.normal(0, 0.05, num_readings)
    return true_distance + noise
```
Real sensors always have **noise**: small random variation around the true value, even when the actual measured thing isn't changing.

**Step 3: Visualize the raw readings.**
```python
import matplotlib.pyplot as plt
readings = simulate_distance_sensor()
plt.plot(readings)
plt.savefig("raw_readings.png")
```

**Step 4: Apply a moving average filter.**
```python
def moving_average(data, window=5):
    return np.convolve(data, np.ones(window)/window, mode="valid")
```
A **moving average filter** smooths noisy data by averaging each point with its nearby neighbors.

**Step 5: Compare raw vs. filtered data.**
```python
filtered = moving_average(readings)
plt.plot(readings, label="raw", alpha=0.5)
plt.plot(filtered, label="filtered")
plt.legend()
plt.savefig("filtered_comparison.png")
```

**Step 6: Simulate a sensor failure.**
```python
def simulate_sensor_with_dropout(num_readings=100, dropout_rate=0.1):
    readings = simulate_distance_sensor(num_readings)
    dropout_mask = np.random.random(num_readings) < dropout_rate
    readings[dropout_mask] = np.nan
    return readings
```
**sensor dropout** is when a sensor occasionally fails to produce a valid reading, represented here as `NaN` (not a number).

**Step 7: Handle missing readings.**
```python
def handle_dropout(data):
    valid_indices = ~np.isnan(data)
    return np.interp(np.arange(len(data)), np.arange(len(data))[valid_indices], data[valid_indices])
```
**interpolation** estimates a missing value based on the values around it.

**Step 8: Document filter parameter choices.**
```bash
nano filtering_notes.md
```
Note: what window size did you use for the moving average, and what tradeoff does a larger vs. smaller window involve?

### Final Project Structure
```text
sensor_processing_project/
│
├── sensor_processing.py
├── raw_readings.png
├── filtered_comparison.png
├── filtering_notes.md
```

### What You Learned
- ✅ Simulating realistic sensor noise
- ✅ Visualizing raw sensor data
- ✅ Applying a moving average filter
- ✅ Comparing raw vs. filtered signal quality
- ✅ Simulating and handling sensor dropout
- ✅ Interpolating missing sensor readings

### Portfolio Project
**Sensor Data Processing Pipeline**: Built a script simulating noisy and intermittent sensor data, applying moving-average filtering and interpolation to produce a clean, usable signal.
**Skills:** Signal Processing, NumPy, Python, Robotics Perception Fundamentals.

**Deliverable:** A sensor processing script with visualized raw vs. filtered data and documented dropout handling.

---

## Project 3 (Module 3): Implement a Coordinate Transformation Calculator

**Goal:** Build the math layer that perception and control both depend on, translating between different frames of reference.

**Step 1: Set up a project folder.**
```bash
mkdir coordinate_transform_project
cd coordinate_transform_project
pip install --break-system-packages numpy
```

**Step 2: Understand coordinate frames.**
A **coordinate frame** is a reference point and set of axes that positions are measured relative to, e.g., the "world frame" (fixed to the room) vs. the "robot frame" (fixed to and moving with the robot).

**Step 3: Represent a 2D position and rotation.**
```bash
nano transforms.py
```
```python
import numpy as np

def rotation_matrix(theta):
    return np.array([
        [np.cos(theta), -np.sin(theta)],
        [np.sin(theta),  np.cos(theta)]
    ])
```
A **rotation matrix** describes how to rotate a point by an angle `theta`, using basic trigonometry.

**Step 4: Transform a point from robot frame to world frame.**
```python
def robot_to_world(point_robot_frame, robot_position, robot_theta):
    R = rotation_matrix(robot_theta)
    return R @ point_robot_frame + robot_position
```
The `@` operator performs **matrix multiplication**; this combines rotation and translation (the `+ robot_position` shift) into one transformation.

**Step 5: Transform a point from world frame back to robot frame.**
```python
def world_to_robot(point_world_frame, robot_position, robot_theta):
    R = rotation_matrix(robot_theta)
    return R.T @ (point_world_frame - robot_position)
```
`R.T` (the **transpose**) reverses a rotation matrix's effect, a mathematical shortcut for "undoing" the rotation.

**Step 6: Test with a concrete example.**
```python
robot_position = np.array([5.0, 3.0])
robot_theta = np.pi / 2  # facing 90 degrees
point_in_robot_frame = np.array([2.0, 0.0])  # 2 meters "ahead"

world_point = robot_to_world(point_in_robot_frame, robot_position, robot_theta)
print("Point in world frame:", world_point)

back_to_robot = world_to_robot(world_point, robot_position, robot_theta)
print("Back to robot frame (should match original):", back_to_robot)
```

**Step 7: Visualize the transformation.**
```python
import matplotlib.pyplot as plt
plt.scatter(*robot_position, c="red", label="robot")
plt.scatter(*world_point, c="blue", label="detected point")
plt.legend()
plt.savefig("coordinate_transform.png")
```

**Step 8: Document the transform functions for reuse.**
```bash
nano README.md
```
Note function signatures and what each parameter means.

### Final Project Structure
```text
coordinate_transform_project/
│
├── transforms.py
├── coordinate_transform.png
├── README.md
```

### What You Learned
- ✅ Coordinate frames and why they matter in robotics
- ✅ Rotation matrices and basic trigonometry for robotics
- ✅ Transforming points from robot frame to world frame
- ✅ Transforming points back from world frame to robot frame
- ✅ Verifying transforms with round-trip testing
- ✅ Visualizing coordinate transformations

### Portfolio Project
**Coordinate Transformation Calculator**: Implemented and verified 2D coordinate frame transformations between robot and world reference frames using rotation matrices, with visualized results.
**Skills:** Linear Algebra, NumPy, Robotics Mathematics, Python.

**Deliverable:** A tested coordinate transformation module, with a visualized example and round-trip verification.

---

## Project 4 (Module 4): Build an Object Detection Pipeline for a Robot Camera Feed

**Goal:** Give the robot the ability to "see", the "sense" component of your Project 1 loop, now actually working.

**Step 1: Set up a project folder.**
```bash
mkdir object_detection_project
cd object_detection_project
pip install --break-system-packages opencv-python numpy
```

**Step 2: Load a test camera frame.**
```bash
nano object_detection.py
```
```python
import cv2
frame = cv2.imread("test_frame.jpg")
print("Frame shape:", frame.shape)
```
OpenCV represents images as **BGR** (blue-green-red, not RGB) numpy arrays by default.

**Step 3: Implement simple color-based object detection.**
```python
hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
lower_red = np.array([0, 120, 70])
upper_red = np.array([10, 255, 255])
mask = cv2.inRange(hsv, lower_red, upper_red)
```
**HSV (hue, saturation, value)** color space makes it easier to detect a specific color range than raw RGB, since hue isolates "color" from "brightness."

**Step 4: Find the object's location using contours.**
```python
contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
if contours:
    largest = max(contours, key=cv2.contourArea)
    x, y, w, h = cv2.boundingRect(largest)
    print(f"Object detected at ({x}, {y}), size {w}x{h}")
```
A **contour** is the outline of a connected region in the mask; a **bounding box** is the smallest rectangle containing it.

**Step 5: Estimate distance from apparent size.**
```python
def estimate_distance(pixel_width, known_object_width=0.1, focal_length=500):
    return (known_object_width * focal_length) / pixel_width
```
Objects appear smaller the farther away they are, given a known real-world size and the camera's focal length, you can estimate distance from apparent pixel size.

**Step 6: Draw the detection on the frame for verification.**
```python
cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)
cv2.imwrite("annotated_frame.jpg", frame)
```

**Step 7: Test across multiple frames with varying conditions.**
Run detection on 4–5 different frames: object close, far, partially occluded, and in different lighting.

**Step 8: Apply your Project 2 filtering to detection results over time.**
If simulating a video stream, apply your moving average filter (Project 2) to smooth the estimated distance across frames.

### Final Project Structure
```text
object_detection_project/
│
├── object_detection.py
├── test_frame.jpg
├── annotated_frame.jpg
```

### What You Learned
- ✅ Working with images in OpenCV (BGR color space)
- ✅ Color-based object detection using HSV
- ✅ Finding object locations via contours and bounding boxes
- ✅ Estimating distance from apparent object size
- ✅ Visually verifying detection results
- ✅ Testing detection robustness across varied conditions
- ✅ Smoothing noisy per-frame detections over time

### Portfolio Project
**Camera-Based Object Detection Pipeline**: Built a color-based object detection system using OpenCV, including bounding box localization, distance estimation, and temporal smoothing, tested across varied lighting and occlusion conditions.
**Skills:** Computer Vision, OpenCV, Python, Robotics Perception.

**Deliverable:** An object detection pipeline that locates and estimates distance to a target object, tested across multiple frames.

---

## Project 5 (Module 5): Simulate a Path-Planning Algorithm

**Goal:** Give the robot the ability to decide where to go, the "think" component of your Project 1 loop.

**Step 1: Set up a project folder.**
```bash
mkdir path_planning_project
cd path_planning_project
pip install --break-system-packages numpy matplotlib
```

**Step 2: Represent the environment as a grid.**
```bash
nano path_planning.py
```
```python
import numpy as np

grid = np.zeros((10, 10))
grid[3:7, 4] = 1  # obstacle wall
start = (0, 0)
goal = (9, 9)
```
A **grid map** represents the environment as cells, where `0` is free space and `1` is an obstacle.

**Step 3: Understand the A* search algorithm concept.**
**A\*** finds the shortest path by exploring the most promising nodes first, using a **heuristic** (an estimate of remaining distance to the goal) to guide the search efficiently.

**Step 4: Implement the heuristic function.**
```python
def heuristic(a, b):
    return abs(a[0] - b[0]) + abs(a[1] - b[1])
```
This is **Manhattan distance**: the sum of horizontal and vertical distance, appropriate for grid movement without diagonals.

**Step 5: Implement A* search.**
```python
import heapq

def astar(grid, start, goal):
    open_set = [(0, start)]
    came_from = {}
    g_score = {start: 0}

    while open_set:
        _, current = heapq.heappop(open_set)
        if current == goal:
            path = [current]
            while current in came_from:
                current = came_from[current]
                path.append(current)
            return path[::-1]

        for dx, dy in [(-1,0),(1,0),(0,-1),(0,1)]:
            neighbor = (current[0]+dx, current[1]+dy)
            if 0 <= neighbor[0] < grid.shape[0] and 0 <= neighbor[1] < grid.shape[1] and grid[neighbor] == 0:
                tentative_g = g_score[current] + 1
                if neighbor not in g_score or tentative_g < g_score[neighbor]:
                    g_score[neighbor] = tentative_g
                    f_score = tentative_g + heuristic(neighbor, goal)
                    heapq.heappush(open_set, (f_score, neighbor))
                    came_from[neighbor] = current
    return None
```
A **priority queue** (via `heapq`) always processes the most promising node next, based on combined actual-distance-so-far plus estimated-remaining-distance.

**Step 6: Run and visualize the path.**
```python
path = astar(grid, start, goal)
import matplotlib.pyplot as plt
plt.imshow(grid, cmap="Greys")
if path:
    xs, ys = zip(*path)
    plt.plot(ys, xs, c="red")
plt.savefig("planned_path.png")
```

**Step 7: Test with a more complex obstacle layout.**
Add a second, more complex obstacle configuration (e.g., a maze-like layout) and confirm A* still finds a valid path.

**Step 8: Test the "no valid path" case.**
Create a grid where the goal is completely enclosed by obstacles, and confirm your function returns `None` gracefully instead of crashing or hanging.

### Final Project Structure
```text
path_planning_project/
│
├── path_planning.py
├── planned_path.png
```

### What You Learned
- ✅ Representing an environment as a grid map
- ✅ The A* search algorithm and heuristic-guided search
- ✅ Implementing A* with a priority queue
- ✅ Visualizing a planned path around obstacles
- ✅ Testing path planning against complex layouts
- ✅ Handling the unreachable-goal case gracefully

### Portfolio Project
**Grid-Based Path Planning with A\***: Implemented the A* search algorithm from scratch to plan obstacle-avoiding paths on a grid map, tested against simple and complex layouts including unreachable goals.
**Skills:** Algorithms, Python, Robotics Planning, Search Algorithms.

**Deliverable:** A working A* path planner, visualized on at least two different obstacle layouts, including an unreachable-goal test.

---

## Project 6 (Module 6): Train a Simple RL Agent in a Simulated Environment

**Goal:** Let the robot learn behavior instead of following fixed rules, an alternative to Project 5's hand-coded planning.

**Step 1: Set up a project folder.**
```bash
mkdir rl_agent_project
cd rl_agent_project
pip install --break-system-packages numpy gymnasium
```

**Step 2: Understand the RL problem framing.**
An **agent** takes **actions** in an **environment**, receiving a **reward** signal after each action; the goal is to learn a **policy** (a strategy for choosing actions) that maximizes total reward over time.

**Step 3: Load a simple simulated environment.**
```bash
nano rl_agent.py
```
```python
import gymnasium as gym
env = gym.make("FrozenLake-v1", is_slippery=False)
print("Actions:", env.action_space.n)
print("States:", env.observation_space.n)
```
**FrozenLake** is a simple grid environment where an agent must reach a goal while avoiding holes, a manageable environment for learning RL fundamentals.

**Step 4: Implement Q-learning.**
```python
import numpy as np

q_table = np.zeros((env.observation_space.n, env.action_space.n))
learning_rate = 0.8
discount_factor = 0.95
episodes = 2000

for episode in range(episodes):
    state, _ = env.reset()
    done = False
    while not done:
        action = np.argmax(q_table[state]) if np.random.random() > 0.1 else env.action_space.sample()
        next_state, reward, terminated, truncated, _ = env.step(action)
        done = terminated or truncated
        q_table[state, action] += learning_rate * (
            reward + discount_factor * np.max(q_table[next_state]) - q_table[state, action]
        )
        state = next_state
```
**Q-learning** maintains a table of expected future reward for each state-action pair, updating it after every action based on the reward received.

**Step 5: Understand exploration vs. exploitation.**
The `np.random.random() > 0.1` check implements an **epsilon-greedy policy**: mostly choosing the best-known action (**exploitation**), but occasionally trying a random action (**exploration**) to discover potentially better strategies.

**Step 6: Evaluate the trained agent.**
```python
successes = 0
for _ in range(100):
    state, _ = env.reset()
    done = False
    while not done:
        action = np.argmax(q_table[state])
        state, reward, terminated, truncated, _ = env.step(action)
        done = terminated or truncated
    if reward == 1:
        successes += 1
print(f"Success rate: {successes}%")
```

**Step 7: Plot the learning curve.**
```python
import matplotlib.pyplot as plt
# track episode rewards during training and plot them
plt.plot(episode_rewards)
plt.savefig("learning_curve.png")
```

**Step 8: Compare RL to your Project 5 A* planner.**
```bash
nano rl_vs_astar_notes.md
```
Write 3–4 sentences: when would you choose RL over A* planning, and vice versa?

### Final Project Structure
```text
rl_agent_project/
│
├── rl_agent.py
├── learning_curve.png
├── rl_vs_astar_notes.md
```

### What You Learned
- ✅ The agent/environment/reward/policy framing of RL
- ✅ Implementing Q-learning from scratch
- ✅ Epsilon-greedy exploration vs. exploitation
- ✅ Evaluating a trained policy separately from training
- ✅ Visualizing a learning curve
- ✅ Comparing RL and classical planning approaches

### Portfolio Project
**Reinforcement Learning Agent (Q-Learning)**: Implemented Q-learning from scratch to train an agent in a simulated grid environment, evaluated success rate post-training, and compared the approach against classical path planning.
**Skills:** Reinforcement Learning, Python, Gymnasium, Robotics AI.

**Deliverable:** A trained Q-learning agent with a plotted learning curve and evaluated success rate.

---

## Project 7 (Module 7): Test a Robot Behavior in Simulation

**Goal:** Validate a robot behavior for safety and reliability, the discipline that separates "it worked once" from "it's ready to test on real hardware."

**Step 1: Set up a project folder.**
```bash
mkdir behavior_testing_project
cd behavior_testing_project
```

**Step 2: Choose a behavior to test.**
Use your Project 5 A* planner or Project 6 RL agent, combined with Project 4's detection logic if relevant.

**Step 3: Define success criteria.**
```bash
nano test_plan.md
```
Write specific, measurable pass/fail conditions (e.g., "reaches goal within 200 steps," "never enters an obstacle cell").

**Step 4: Run repeated trials.**
```bash
nano run_tests.py
```
```python
results = []
for trial in range(20):
    # reset environment with slightly randomized start/obstacle positions
    # run the behavior, record whether it succeeded and how many steps it took
    results.append({"trial": trial, "success": success, "steps": steps})
```

**Step 5: Randomize test conditions.**
Vary starting position, obstacle layout, or sensor noise level slightly across trials.

**Step 6: Calculate success metrics.**
```python
success_rate = sum(r["success"] for r in results) / len(results)
avg_steps = sum(r["steps"] for r in results if r["success"]) / sum(r["success"] for r in results)
print(f"Success rate: {success_rate*100}%, avg steps: {avg_steps}")
```

**Step 7: Investigate every failure.**
```bash
nano failure_analysis.md
```
For each failed trial, note what specifically went wrong (got stuck, collided, timed out).

**Step 8: Add a safety check based on Project 1's consideration.**
Implement a simple safeguard (e.g., "stop if no valid path is found" instead of taking an undefined action) and re-run your test suite to confirm it engages correctly.

### Final Project Structure
```text
behavior_testing_project/
│
├── test_plan.md
├── run_tests.py
├── failure_analysis.md
```

### What You Learned
- ✅ Defining measurable success criteria for a robot behavior
- ✅ Running repeated trials instead of single demo runs
- ✅ Randomizing test conditions to reveal hidden failures
- ✅ Calculating aggregate success metrics
- ✅ Categorizing and investigating failure types
- ✅ Implementing and testing a safety safeguard

### Portfolio Project
**Robot Behavior Test Suite**: Built a repeated-trial testing framework for a robot navigation behavior, with randomized conditions, aggregate success metrics, categorized failure analysis, and a tested safety safeguard.
**Skills:** Test Engineering, Robotics Safety, Python, Statistical Evaluation.

**Deliverable:** A test suite with success-rate metrics across randomized trials, failure analysis, and a verified safety safeguard.

---

## Final Capstone: Build a Simulated Robot That Navigates to a Goal

**Goal:** Combine every project above into one complete, working simulated robot, this is an integration exercise, not a new build.

**Step 1: Set up your capstone project folder.**
```bash
mkdir capstone_project
cd capstone_project
```
Copy in the final versions of your code from Projects 2–7.

**Step 2: Start from your Project 1 sense-think-act diagram.**
Confirm each part (Sense, Think, Act) has a concrete implementation from the projects you've already built.

**Step 3: Wire in perception (Projects 2 & 4).**
Connect sensor filtering and object detection as the "Sense" stage, feeding processed environment data into the next stage.

**Step 4: Wire in coordinate transforms (Project 3).**
Use your transform functions to convert detected object positions into the same coordinate frame your planner expects.

**Step 5: Wire in planning or learned behavior (Projects 5 & 6).**
Use your A* planner (or trained RL agent) as the "Think" stage, producing a path or next action based on the current perceived state.

**Step 6: Simulate the "Act" stage.**
Implement a simple simulated robot that updates its position based on the planner's output, one step per sense-think-act cycle.

**Step 7: Run your Project 7 test suite against the full, integrated system.**
Reuse your success criteria and randomized trials, but now test the complete sense-think-act loop rather than isolated pieces.

**Step 8: Write the final capstone report.**
```bash
nano capstone_report.md
```
Combine your Project 1 diagram, test results, and known limitations into one write-up: what you built, how reliable it is, and what you'd improve next.

### Final Project Structure
```text
capstone_project/
│
├── sense_think_act_diagram.png
├── sensor_processing.py
├── transforms.py
├── object_detection.py
├── path_planning.py
├── rl_agent.py
├── run_tests.py
├── capstone_report.md
```

### What You Learned
- ✅ Integrating perception, coordinate transforms, and planning into one loop
- ✅ Simulating a robot that senses, thinks, and acts repeatedly
- ✅ Re-running a rigorous test suite against a fully integrated system
- ✅ Identifying integration-specific failure modes
- ✅ Documenting a complete robotic system for a real audience

### Portfolio Project
**Simulated Navigating Robot (Capstone)**: Built a complete simulated robot combining sensor processing, object detection, coordinate transforms, and path planning into a working sense-think-act loop, validated through a rigorous randomized test suite.
**Skills:** Robotics AI, Computer Vision, Path Planning, Reinforcement Learning, Python, Test Engineering.

**Deliverable:** A complete, tested, simulated robot capable of navigating to a goal while avoiding obstacles, plus a written capstone report.
