<!-- order: 12 -->
<!-- level: Beginner -->
# Data Analytics for Builders

Learn to turn a vague question like "how are sales going?" into a clear answer you can defend. You will follow one small online shop's orders from start to finish: asking a measurable question, exploring the data in Google Sheets, querying it with SQL, analyzing and cleaning it with Python and pandas, describing it honestly with basic statistics, drawing charts that tell the truth, and writing a one-page findings report with a recommendation.

**By the end of this course, you'll be able to:**
- Turn a vague question into a measurable one with a clear metric, dimension, and time window tied to a decision
- Summarize data in Google Sheets with formulas, filters, and pivot tables
- Query data with SQL using WHERE, GROUP BY, JOIN, and HAVING
- Load, clean, and analyze data with pandas, keeping a log of every cleaning decision
- Describe data honestly with means, medians, and fair comparisons, and draw charts that don't mislead
- Write a one-page findings report that answers the question and makes a recommendation

## Course Overview

**Who this is for:** Beginners who want to make decisions with data, whether you are building a product, running a small business, organizing an event, or just curious. You do not need a math background. Some Python helps from Module 3 onward; if you have never written Python, take the Python Programming Fundamentals course first or alongside this one.

**What this course is (and isn't):** Data analytics is the work of answering questions with data. It is also the foundation of data science: framing a question, getting and cleaning data, describing it, and showing it clearly. This course teaches that foundation. It does not teach machine learning or predictive modeling; those are in the separate **Machine Learning Fundamentals** course, which builds on the skills you practice here.

**How the course works:** Eight modules. Every module follows the same pattern:
- **Concept** - what it is, in plain language
- **Where you'd actually use this** - a real scenario
- **Lab** - hands-on steps you can run right now
- **Checkpoint** - how to know you've got it
- **Quiz** - a short self-check with answers

**One dataset all the way through.** Every module uses the same invented data from a small online stationery shop called Ivy & Ink: 30 orders from January to March 2026, plus a list of 12 customers. Because the data stays the same, each module builds on the last, and you can check your numbers against the ones in this course.

**Tools needed (all free):**
- **Google Sheets** (any Google account) for Module 2
- **Google Colab** (colab.research.google.com) for Modules 3 to 8. Colab runs Python 3.12+ in your browser with nothing to install.
- **pandas** and **matplotlib**, which come preinstalled in Colab
- **SQLite**, used through Python's built-in `sqlite3` module (also nothing to install)

If you prefer to work locally, install Python 3.12+ and run `pip install pandas matplotlib` and `pip install notebook`, then use a Jupyter notebook.

**Tip:** Use one Colab notebook for the whole course. Colab forgets everything when the session restarts, so if you come back later and see `NameError`, scroll up and rerun the setup cells (Module 3's data cell, plus any module setup cell marked "run this first").

**Total time:** about 22.5 hours.

---

## Module 1: Asking a Good Question

**Time: about 1.5 hours**

### Concept

Most analysis goes wrong before anyone opens a spreadsheet. Someone asks "How's the shop doing?" and the analyst starts making charts without knowing what "doing well" means. A good analysis starts with a **measurable question**: one where you could say in advance what number would answer it.

Four words to know:

| Term | Meaning | Ivy & Ink example |
|---|---|---|
| **Metric** | A number you measure, usually summed, counted, or averaged | Revenue, number of orders, average order value |
| **Dimension** | A category you split a metric by | Sales channel, product category, month, city |
| **Unit of analysis** | What one row represents | One order |
| **Time window** | The period you look at | January 1 to March 31, 2026 |

A useful recipe for turning a vague request into a measurable question:

1. **Who is asking and what decision will they make?** A question with no decision attached is trivia.
2. **Which metric best reflects success for that decision?** Pick one main metric, and maybe one or two supporting ones.
3. **Split by which dimension?** This is usually the choice being made (which channel, which product).
4. **Over what time window and for whom?** Are some rows out of scope, like test orders or bulk business buyers?
5. **What data do you need, and do you have it?** List the columns. If something is missing, say so now, not at the end.

**Vague:** "Is Instagram working for us?"

**Measurable:** "From January to March 2026, how much revenue and how many orders came through Instagram, compared with the Website and Email, for individual (non-business) customers, and is Instagram revenue growing month over month?"

The second version tells you exactly what to calculate. It also reveals what it can't answer: we have no data on how much time or money was spent on Instagram, so we can't measure return on effort.

### Where you'd actually use this

A founder asks, "Should we keep posting on Instagram?" A teammate asks, "Which workshop format do people like more?" An event organizer asks, "Did the new sign-up page help?" In each case, the first useful thing you can do is write the measurable question back to them and confirm it's what they meant. It takes five minutes and can save days of work on the wrong analysis.

### Lab

**Part 1: Sort metrics from dimensions.**

```lab
{
 "type": "sort",
 "title": "Metric or dimension?",
 "prompt": "Decide whether each column from the Ivy & Ink data is a metric (something you add up, count, or average) or a dimension (something you group by).",
 "buckets": [
  "Metric",
  "Dimension"
 ],
 "items": [
  {
   "text": "revenue (quantity x unit price)",
   "bucket": "Metric",
   "why": "You sum or average revenue."
  },
  {
   "text": "channel (Website, Instagram, Email)",
   "bucket": "Dimension",
   "why": "You split revenue or orders by channel."
  },
  {
   "text": "quantity",
   "bucket": "Metric",
   "why": "You can total or average the number of items."
  },
  {
   "text": "product category",
   "bucket": "Dimension",
   "why": "Categories are labels you group by."
  },
  {
   "text": "month of the order",
   "bucket": "Dimension",
   "why": "Time periods are a very common dimension."
  },
  {
   "text": "number of orders",
   "bucket": "Metric",
   "why": "A count of rows is a metric."
  },
  {
   "text": "customer city",
   "bucket": "Dimension",
   "why": "City is a label you split by, not a number you add."
  }
 ]
}
```

**Part 2: Write a question brief.** Open a blank document (Google Docs or a notebook text cell) and copy this template.

Template: replace each bracketed part.

```text
Question brief
- Requested by: [who is asking]
- Decision it informs: [what they will do differently depending on the answer]
- Measurable question: [one sentence with metric, dimension, time window, scope]
- Main metric: [e.g. revenue]
- Supporting metrics: [e.g. number of orders, average order value]
- Dimension(s): [e.g. channel, month]
- Time window: [start date to end date]
- In scope / out of scope: [e.g. exclude test orders]
- Data needed: [list of columns or tables]
- Data we don't have: [what's missing and why it matters]
```

Here is a filled-in example for Ivy & Ink, which you will actually answer in Module 8:

```text
Question brief
- Requested by: Ivy & Ink's owner
- Decision it informs: where to focus April's limited marketing time
- Measurable question: From Jan 1 to Mar 31 2026, which sales channel brought
  the most revenue and orders from individual customers, and which is growing?
- Main metric: revenue (quantity x unit_price)
- Supporting metrics: number of orders, unique customers, average order value
- Dimension(s): channel, month
- Time window: 2026-01-01 to 2026-03-31
- In scope / out of scope: individual customers in scope; the one business
  customer (a school placing bulk orders) reported separately
- Data needed: orders table (order_id, order_date, customer_id, product,
  category, quantity, unit_price, channel); customers table (customer_type)
- Data we don't have: marketing time or ad spend per channel, website
  visitor counts, so we can't measure return on effort or conversion rate
```

Now write your own brief for a question from your life or project. Examples: "Which of my workshop sessions had the best attendance?", "Which days does my app get the most sign-ups?", "Where does my monthly budget actually go?"

### Checkpoint

You have a written brief where someone else could read the measurable question and know exactly which number to calculate, and you've listed at least one piece of data you don't have.

### Quiz

1. Why is "Is Instagram working?" a weak analysis question?
2. What is the difference between a metric and a dimension?
3. In the Ivy & Ink data, what does one row (the unit of analysis) represent?
4. Why should you list the data you don't have before starting?
5. Why tie a question to a decision?

*Answers: 1) It doesn't say what "working" means, so there's no specific number that would answer it. 2) A metric is a number you add up, count, or average; a dimension is a category you split that number by. 3) One order. 4) Missing data limits what you can conclude, and finding that out at the end wastes time and can lead to overclaiming. 5) The decision tells you which metric matters and keeps the analysis focused on something useful.*

---

## Module 2: Spreadsheets for Analysis

**Time: about 3 hours**

### Concept

A spreadsheet is often the fastest way to look at a small dataset. Four skills cover most beginner analysis:

- **Sorting** puts rows in order (biggest orders first, oldest dates first).
- **Filtering** hides rows that don't match a condition, without deleting them.
- **Conditional functions** calculate a metric only for rows that match conditions:
  - `COUNTIFS(range, condition, ...)` counts matching rows
  - `SUMIFS(sum_range, range, condition, ...)` adds up matching values
  - `AVERAGEIFS(average_range, range, condition, ...)` averages matching values
- **Pivot tables** summarize a metric by one or more dimensions in a few clicks, like "revenue by channel" or "revenue by category and channel."

One golden rule: **never overwrite the raw data.** Add new columns next to it and do your summaries on separate sheets, so you can always see where every number came from.

### Where you'd actually use this

Quick questions from a teammate ("how many orders came from Instagram last month?"), checking an export from a tool like a form, a store, or a ticketing system before doing deeper work, or sharing a simple summary with someone who doesn't code. Many real analyses start and end in a spreadsheet.

### Lab

**Step 1: Load the data.** Open a new Google Sheet (sheets.new). Copy all the text below (including the header line) and paste it into cell A1.

```text
order_id,order_date,customer_id,product,category,quantity,unit_price,channel
1001,2026-01-03,C01,Notebook,Paper,2,8.00,Website
1002,2026-01-05,C02,Gel Pen Set,Writing,1,6.50,Instagram
1003,2026-01-08,C03,Planner,Paper,1,18.00,Website
1004,2026-01-10,C04,Sticky Notes,Paper,3,3.50,Instagram
1005,2026-01-14,C01,Fountain Pen,Writing,1,24.00,Email
1006,2026-01-17,C05,Washi Tape,Craft,4,4.00,Instagram
1007,2026-01-21,C06,Desk Organizer,Desk,1,15.00,Website
1008,2026-01-25,C02,Notebook,Paper,1,8.00,Instagram
1009,2026-01-29,C07,Notebook,Paper,20,8.00,Email
1010,2026-02-02,C08,Gel Pen Set,Writing,2,6.50,Instagram
1011,2026-02-04,C03,Washi Tape,Craft,2,4.00,Website
1012,2026-02-07,C09,Planner,Paper,1,18.00,Instagram
1013,2026-02-11,C04,Fountain Pen,Writing,1,24.00,Website
1014,2026-02-14,C10,Sticky Notes,Paper,5,3.50,Instagram
1015,2026-02-14,C05,Gel Pen Set,Writing,1,6.50,Instagram
1016,2026-02-18,C06,Planner,Paper,1,18.00,Email
1017,2026-02-22,C08,Washi Tape,Craft,3,4.00,Instagram
1018,2026-02-26,C01,Desk Organizer,Desk,1,15.00,Website
1019,2026-03-01,C11,Notebook,Paper,2,8.00,Instagram
1020,2026-03-03,C09,Gel Pen Set,Writing,2,6.50,Instagram
1021,2026-03-06,C12,Sticky Notes,Paper,2,3.50,Instagram
1022,2026-03-09,C02,Planner,Paper,1,18.00,Website
1023,2026-03-12,C10,Washi Tape,Craft,6,4.00,Instagram
1024,2026-03-15,C03,Fountain Pen,Writing,1,24.00,Email
1025,2026-03-18,C11,Desk Organizer,Desk,1,15.00,Instagram
1026,2026-03-21,C12,Notebook,Paper,3,8.00,Website
1027,2026-03-24,C05,Planner,Paper,1,18.00,Instagram
1028,2026-03-27,C07,Gel Pen Set,Writing,10,6.50,Email
1029,2026-03-29,C04,Washi Tape,Craft,2,4.00,Instagram
1030,2026-03-31,C08,Sticky Notes,Paper,4,3.50,Website
```

Everything lands in column A. With column A still selected, choose **Data > Split text to columns**. Sheets splits on commas automatically (if it doesn't, pick "Comma" in the separator box that appears). You should now have columns A (`order_id`) through H (`channel`) and rows 1 to 31.

Check that the dates were understood as dates: click B2 and choose **Format > Number > Date**. If it now shows `1/3/2026` aligned to the right, it's a date (switch back with **Format > Number > Custom date and time** if you prefer the `2026-01-03` look). If it still shows `2026-01-03` aligned left, it's text; set **File > Settings > Locale** to United States and redo the split.

Rename the tab (double-click "Sheet1") to `orders`.

**Step 2: Add a revenue column.** In I1 type `revenue`. In I2 type:

```text
=F2*G2
```

Press Enter, then click I2 and double-click the small square at its bottom-right corner to fill the formula down to row 31. I2 should show `16` and I10 (order 1009) should show `160`.

**Step 3: Sort.** Select A1:I31, then **Data > Sort range > Advanced range sorting options**. Tick "Data has header row," sort by `revenue`, Z to A. The top two rows are orders 1009 (160) and 1028 (65), both from customer C07. Undo (Ctrl+Z or Cmd+Z) or sort by `order_id` A to Z to restore the original order.

**Step 4: Filter.** Select A1:I31 and choose **Data > Create a filter**. Click the filter icon on the `channel` header, untick everything except `Instagram`, and click OK. You should see 16 rows. Select I2:I31 and look at the bottom-right of the screen: Sheets shows the **Sum** of the visible cells, `209`. Turn the filter off with **Data > Remove filter** before moving on (formulas below should see all rows).

**Step 5: Conditional formulas.** Click an empty cell, such as K1, and build a small summary. Type labels in column K and formulas in column L:

| Cell | Type this | Result |
|---|---|---|
| K1 / L1 | `Total revenue` / `=SUM(I2:I31)` | 652 |
| K2 / L2 | `Instagram orders` / `=COUNTIFS(H2:H31,"Instagram")` | 16 |
| K3 / L3 | `Instagram revenue` / `=SUMIFS(I2:I31,H2:H31,"Instagram")` | 209 |
| K4 / L4 | `Website avg order` / `=AVERAGEIFS(I2:I31,H2:H31,"Website")` | 16.89 (shown as 16.8888...) |
| K5 / L5 | `Instagram orders with 3+ items` / `=COUNTIFS(H2:H31,"Instagram",F2:F31,">=3")` | 5 |
| K6 / L6 | `Paper revenue via Instagram` / `=SUMIFS(I2:I31,E2:E31,"Paper",H2:H31,"Instagram")` | 95 |
| K7 / L7 | `March revenue` / `=SUMIFS(I2:I31,B2:B31,">="&DATE(2026,3,1),B2:B31,"<"&DATE(2026,4,1))` | 246 |
| K8 / L8 | `Average order` / `=AVERAGE(I2:I31)` | 21.73 |
| K9 / L9 | `Median order` / `=MEDIAN(I2:I31)` | 16 |

Notice the pattern: each extra condition is another *range, condition* pair. Comparisons like `">=3"` go in quotes, and when a comparison uses a value from a function, you join them with `&`, as in `">="&DATE(2026,3,1)`.

Also notice that the average order (21.73) is noticeably bigger than the median (16). Keep that in mind; Module 6 explains why.

**Step 6: Pivot table by channel.** Select A1:I31, then **Insert > Pivot table**, choose **New sheet**, and click **Create**. In the editor on the right:
- **Rows:** Add `channel`
- **Values:** Add `revenue` (Summarize by SUM)
- **Values:** Add `order_id`, then change "Summarize by" to **COUNTA** (count of entries)

You should see:

| channel | SUM of revenue | COUNTA of order_id |
|---|---|---|
| Email | 291 | 5 |
| Instagram | 209 | 16 |
| Website | 152 | 9 |
| Grand Total | 652 | 30 |

**Step 7: Two-dimensional pivot.** Make another pivot table from the same range with **Rows:** `category`, **Columns:** `channel`, **Values:** `revenue` (SUM). You should see that Paper is the biggest category (363 in total), and that Email's 178 of Paper revenue is almost entirely order 1009 (160). One big order can dominate a small dataset.

**Optional:** Try `=FILTER(A2:I31, H2:H31="Email")` in an empty sheet to pull every Email order into a live, auto-updating list.

### Checkpoint

Your summary cells match the table in Step 5, your channel pivot matches Step 6, and you can explain why Email has the most revenue but the fewest orders.

### Quiz

1. Why add a revenue column instead of typing revenue numbers by hand?
2. What's the difference between filtering and deleting rows?
3. Write a formula that counts Website orders.
4. What does a pivot table do that would take many SUMIFS formulas to do by hand?
5. Email has the most revenue but only 5 orders. What should you check before concluding Email is the best channel?

*Answers: 1) A formula recalculates automatically, avoids typing mistakes, and shows exactly how each number was made. 2) Filtering hides non-matching rows temporarily while the data stays intact; deleting removes them for good. 3) `=COUNTIFS(H2:H31,"Website")` (or the equivalent `=COUNTIF(H2:H31,"Website")`). 4) It summarizes a metric for every value of one or more dimensions at once, with totals, in a few clicks. 5) Whether a few unusually large orders drive it; here one school customer placed two bulk orders worth 225 of Email's 291.*

---

## Module 3: SQL Basics

**Time: about 3 hours**

### Concept

**SQL** (Structured Query Language) is how you ask questions of data stored in a database. Most companies keep their important data in databases, so SQL is one of the most widely used analysis tools. A query describes *what* you want, and the database works out how to get it.

The core pieces, in the order they're written:

```sql
SELECT columns or calculations     -- what to show
FROM table                         -- where the data lives
JOIN other_table ON matching_key   -- combine tables
WHERE condition                    -- filter rows before grouping
GROUP BY dimension                 -- one result row per group
HAVING condition                   -- filter groups after grouping
ORDER BY column DESC               -- sort the result
LIMIT n                            -- keep only the first n rows
```

**Aggregate functions** collapse many rows into one number: `COUNT(*)`, `SUM()`, `AVG()`, `MIN()`, `MAX()`. When you use them with `GROUP BY`, you get one number per group.

`WHERE` vs `HAVING` confuses everyone at first: `WHERE` filters individual rows *before* they're grouped; `HAVING` filters the groups *after* aggregation (for example, "customers with 3 or more orders").

We'll use **SQLite**, a small database engine that comes built into Python as the `sqlite3` module. The SQL you learn here works almost unchanged in larger databases like PostgreSQL and MySQL.

### Where you'd actually use this

Pulling "all orders from last month" out of your app's database, counting sign-ups by week, finding your most active users, or checking whether every order has a matching customer. If your product has a database, SQL lets you answer questions without waiting for someone to build a report.

### Lab

Open a new Colab notebook (colab.research.google.com > New notebook). Each gray box below goes in its own code cell; run it with Shift+Enter.

**Step 1: The data cell.** This is the same order data you used in Sheets, plus a customers table. You'll reuse this cell for the rest of the course, so keep it at the top of your notebook.

```python
ORDERS_CSV = """order_id,order_date,customer_id,product,category,quantity,unit_price,channel
1001,2026-01-03,C01,Notebook,Paper,2,8.00,Website
1002,2026-01-05,C02,Gel Pen Set,Writing,1,6.50,Instagram
1003,2026-01-08,C03,Planner,Paper,1,18.00,Website
1004,2026-01-10,C04,Sticky Notes,Paper,3,3.50,Instagram
1005,2026-01-14,C01,Fountain Pen,Writing,1,24.00,Email
1006,2026-01-17,C05,Washi Tape,Craft,4,4.00,Instagram
1007,2026-01-21,C06,Desk Organizer,Desk,1,15.00,Website
1008,2026-01-25,C02,Notebook,Paper,1,8.00,Instagram
1009,2026-01-29,C07,Notebook,Paper,20,8.00,Email
1010,2026-02-02,C08,Gel Pen Set,Writing,2,6.50,Instagram
1011,2026-02-04,C03,Washi Tape,Craft,2,4.00,Website
1012,2026-02-07,C09,Planner,Paper,1,18.00,Instagram
1013,2026-02-11,C04,Fountain Pen,Writing,1,24.00,Website
1014,2026-02-14,C10,Sticky Notes,Paper,5,3.50,Instagram
1015,2026-02-14,C05,Gel Pen Set,Writing,1,6.50,Instagram
1016,2026-02-18,C06,Planner,Paper,1,18.00,Email
1017,2026-02-22,C08,Washi Tape,Craft,3,4.00,Instagram
1018,2026-02-26,C01,Desk Organizer,Desk,1,15.00,Website
1019,2026-03-01,C11,Notebook,Paper,2,8.00,Instagram
1020,2026-03-03,C09,Gel Pen Set,Writing,2,6.50,Instagram
1021,2026-03-06,C12,Sticky Notes,Paper,2,3.50,Instagram
1022,2026-03-09,C02,Planner,Paper,1,18.00,Website
1023,2026-03-12,C10,Washi Tape,Craft,6,4.00,Instagram
1024,2026-03-15,C03,Fountain Pen,Writing,1,24.00,Email
1025,2026-03-18,C11,Desk Organizer,Desk,1,15.00,Instagram
1026,2026-03-21,C12,Notebook,Paper,3,8.00,Website
1027,2026-03-24,C05,Planner,Paper,1,18.00,Instagram
1028,2026-03-27,C07,Gel Pen Set,Writing,10,6.50,Email
1029,2026-03-29,C04,Washi Tape,Craft,2,4.00,Instagram
1030,2026-03-31,C08,Sticky Notes,Paper,4,3.50,Website
"""

CUSTOMERS_CSV = """customer_id,customer_name,city,customer_type
C01,Amara,Baltimore,Individual
C02,Bola,Atlanta,Individual
C03,Chen,Baltimore,Individual
C04,Dami,Houston,Individual
C05,Esi,Baltimore,Individual
C06,Femi,Atlanta,Individual
C07,Greenfield School,Baltimore,Business
C08,Hana,Houston,Individual
C09,Ife,Atlanta,Individual
C10,Jo,Baltimore,Individual
C11,Kemi,Houston,Individual
C12,Lena,Atlanta,Individual
"""
```

**Step 2: Create the database.** This creates two tables in an in-memory SQLite database, loads the rows into them, and defines a small `show()` helper that prints query results.

```python
import csv
import io
import sqlite3

conn = sqlite3.connect(":memory:")  # a temporary database that lives in memory

conn.execute("""
CREATE TABLE orders (
    order_id INTEGER PRIMARY KEY,
    order_date TEXT,
    customer_id TEXT,
    product TEXT,
    category TEXT,
    quantity INTEGER,
    unit_price REAL,
    channel TEXT
)""")

conn.execute("""
CREATE TABLE customers (
    customer_id TEXT PRIMARY KEY,
    customer_name TEXT,
    city TEXT,
    customer_type TEXT
)""")

order_rows = list(csv.DictReader(io.StringIO(ORDERS_CSV)))
conn.executemany(
    "INSERT INTO orders VALUES (:order_id, :order_date, :customer_id, :product, "
    ":category, :quantity, :unit_price, :channel)",
    order_rows,
)
customer_rows = list(csv.DictReader(io.StringIO(CUSTOMERS_CSV)))
conn.executemany(
    "INSERT INTO customers VALUES (:customer_id, :customer_name, :city, :customer_type)",
    customer_rows,
)
conn.commit()

def show(sql):
    """Run a SQL query and print the result as a simple table."""
    cursor = conn.execute(sql)
    headers = [col[0] for col in cursor.description]
    print(" | ".join(headers))
    for row in cursor.fetchall():
        print(" | ".join(str(value) for value in row))

show("SELECT COUNT(*) AS order_count FROM orders")
show("SELECT COUNT(*) AS customer_count FROM customers")
```

Output:

```text
order_count
30
customer_count
12
```

If you see 30 and 12, the data loaded correctly. (Because the columns were declared `INTEGER` and `REAL`, SQLite stores quantities and prices as numbers even though the CSV reader produced text.)

**Step 3: SELECT and LIMIT.** Look at the first few rows. Always do this first with any new table.

```python
show("SELECT * FROM orders LIMIT 5")
```

Output:

```text
order_id | order_date | customer_id | product | category | quantity | unit_price | channel
1001 | 2026-01-03 | C01 | Notebook | Paper | 2 | 8.0 | Website
1002 | 2026-01-05 | C02 | Gel Pen Set | Writing | 1 | 6.5 | Instagram
1003 | 2026-01-08 | C03 | Planner | Paper | 1 | 18.0 | Website
1004 | 2026-01-10 | C04 | Sticky Notes | Paper | 3 | 3.5 | Instagram
1005 | 2026-01-14 | C01 | Fountain Pen | Writing | 1 | 24.0 | Email
```

**Step 4: WHERE.** Filter rows with conditions. Text values go in single quotes.

```python
show("""
SELECT order_id, product, quantity, channel
FROM orders
WHERE channel = 'Instagram' AND quantity >= 3
""")
```

Output:

```text
order_id | product | quantity | channel
1004 | Sticky Notes | 3 | Instagram
1006 | Washi Tape | 4 | Instagram
1014 | Sticky Notes | 5 | Instagram
1017 | Washi Tape | 3 | Instagram
1023 | Washi Tape | 6 | Instagram
```

That's 5 rows, the same answer as the `COUNTIFS` with two conditions in Module 2.

**Step 5: Calculated columns and ORDER BY.** You can calculate new values and name them with `AS`. Sorting by a second column (`order_id`) breaks ties so the result is always in the same order.

```python
show("""
SELECT order_id, product, quantity * unit_price AS revenue
FROM orders
ORDER BY revenue DESC, order_id
LIMIT 5
""")
```

Output:

```text
order_id | product | revenue
1009 | Notebook | 160.0
1028 | Gel Pen Set | 65.0
1005 | Fountain Pen | 24.0
1013 | Fountain Pen | 24.0
1023 | Washi Tape | 24.0
```

**Step 6: GROUP BY with aggregates.** This is the SQL version of the pivot table.

```python
show("""
SELECT channel,
       COUNT(*) AS orders,
       SUM(quantity * unit_price) AS revenue,
       ROUND(AVG(quantity * unit_price), 2) AS avg_order_value
FROM orders
GROUP BY channel
ORDER BY revenue DESC
""")
```

Output:

```text
channel | orders | revenue | avg_order_value
Email | 5 | 291.0 | 58.2
Instagram | 16 | 209.0 | 13.06
Website | 9 | 152.0 | 16.89
```

**Step 7: Group by month.** Dates are stored as text like `2026-01-03`, so the first 7 characters give the month.

```python
show("""
SELECT substr(order_date, 1, 7) AS month,
       COUNT(*) AS orders,
       SUM(quantity * unit_price) AS revenue
FROM orders
GROUP BY month
ORDER BY month
""")
```

Output:

```text
month | orders | revenue
2026-01 | 9 | 274.0
2026-02 | 9 | 132.0
2026-03 | 12 | 246.0
```

February looks weak, but hold that thought: January includes the school's big order.

**Step 8: JOIN.** The `orders` table only has `customer_id`. To group by customer type, join it to `customers` on the shared key. `o` and `c` are short aliases for the table names.

```python
show("""
SELECT c.customer_type,
       COUNT(*) AS orders,
       SUM(o.quantity * o.unit_price) AS revenue
FROM orders AS o
JOIN customers AS c ON o.customer_id = c.customer_id
GROUP BY c.customer_type
""")
```

Output:

```text
customer_type | orders | revenue
Business | 2 | 225.0
Individual | 28 | 427.0
```

Two orders from one business customer account for about a third of all revenue. That changes how you should read every channel and month total.

**Step 9: HAVING.** Find repeat customers: people with 3 or more orders. The condition is on the *group's* count, so it goes in `HAVING`, not `WHERE`.

```python
show("""
SELECT c.customer_name,
       COUNT(*) AS orders,
       SUM(o.quantity * o.unit_price) AS revenue
FROM orders AS o
JOIN customers AS c ON o.customer_id = c.customer_id
GROUP BY c.customer_name
HAVING COUNT(*) >= 3
ORDER BY revenue DESC
""")
```

Output:

```text
customer_name | orders | revenue
Amara | 3 | 55.0
Chen | 3 | 50.0
Dami | 3 | 42.5
Esi | 3 | 40.5
Hana | 3 | 39.0
Bola | 3 | 32.5
```

**Step 10: Your turn.** Write queries for these two questions before looking at the answers:
1. Revenue by city, individual customers only, highest first.
2. Units sold and revenue by product category.

```python
show("""
SELECT c.city, SUM(o.quantity * o.unit_price) AS revenue
FROM orders AS o
JOIN customers AS c ON o.customer_id = c.customer_id
WHERE c.customer_type = 'Individual'
GROUP BY c.city
ORDER BY revenue DESC
""")
show("""
SELECT category, SUM(quantity) AS units, SUM(quantity * unit_price) AS revenue
FROM orders
GROUP BY category
ORDER BY revenue DESC
""")
```

Output:

```text
city | revenue
Baltimore | 187.0
Atlanta | 127.5
Houston | 112.5
category | units | revenue
Paper | 47 | 363.0
Writing | 19 | 176.0
Craft | 17 | 68.0
Desk | 3 | 45.0
```

Notice the first query uses both `WHERE` (filter rows to individuals) and `GROUP BY` (one row per city).

### Checkpoint

Your outputs match the ones above, and you can explain why the repeat-customer query needs `HAVING` rather than `WHERE`.

### Quiz

1. What does `GROUP BY channel` do to the result?
2. When do you use `HAVING` instead of `WHERE`?
3. Why did we need a `JOIN` to get revenue by customer type?
4. What would `SELECT * FROM orders WHERE channel = 'Email'` return?
5. Why add `order_id` as a second sort column in `ORDER BY revenue DESC, order_id`?

*Answers: 1) It produces one result row per channel, with aggregate functions like SUM or COUNT calculated within each channel. 2) When the condition is on an aggregated value of a group, like `COUNT(*) >= 3`; `WHERE` filters individual rows before grouping. 3) Customer type is stored in the customers table, not the orders table, so you match rows on the shared customer_id. 4) All columns for the 5 orders placed through Email. 5) Several orders share the same revenue, and the tie-breaker makes the order of the results predictable.*

---

## Module 4: pandas Essentials

**Time: about 3 hours**

### Concept

**pandas** is the most popular Python library for working with tables of data. Its main object is the **DataFrame**: a table with named columns and numbered rows, like a spreadsheet you control with code. A single column is a **Series**.

Everything you did in Sheets and SQL has a pandas equivalent:

| Task | Sheets | SQL | pandas |
|---|---|---|---|
| Load data | Paste and split | `INSERT` | `pd.read_csv(...)` |
| Pick columns | Hide columns | `SELECT a, b` | `df[["a", "b"]]` |
| Filter rows | Filter | `WHERE` | `df[df["a"] > 3]` |
| New column | `=F2*G2` | `quantity * unit_price AS revenue` | `df["revenue"] = df["quantity"] * df["unit_price"]` |
| Sort | Sort range | `ORDER BY` | `df.sort_values(...)` |
| Summarize by group | Pivot table | `GROUP BY` | `df.groupby(...)` |
| Combine tables | Lookup functions | `JOIN` | `df.merge(...)` |

Why learn a third tool? Code is **repeatable**: next quarter, you rerun the notebook on new data instead of redoing every click. It also scales to far bigger datasets than a spreadsheet handles comfortably, and it connects directly to charts, statistics, and (later) machine learning.

### Where you'd actually use this

Cleaning and analyzing an export from your app or a survey tool, building a weekly report you can rerun in seconds, combining data from two sources (like orders and customer details), or preparing data for a chart or a model.

### Lab

Use the same Colab notebook. Make sure the Module 3 data cell (`ORDERS_CSV` and `CUSTOMERS_CSV`) has been run in this session.

**Step 1: Load and look.** `io.StringIO` lets pandas read a text string as if it were a file. `parse_dates` tells pandas to treat `order_date` as real dates.

```python
import io
import pandas as pd

pd.set_option("display.max_columns", None)  # show every column when printing
pd.set_option("display.width", 120)

orders = pd.read_csv(io.StringIO(ORDERS_CSV), parse_dates=["order_date"])
customers = pd.read_csv(io.StringIO(CUSTOMERS_CSV))

print(orders.shape)
print(orders.head())
```

Output:

```text
(30, 8)
   order_id order_date customer_id       product category  quantity  unit_price    channel
0      1001 2026-01-03         C01      Notebook    Paper         2         8.0    Website
1      1002 2026-01-05         C02   Gel Pen Set  Writing         1         6.5  Instagram
2      1003 2026-01-08         C03       Planner    Paper         1        18.0    Website
3      1004 2026-01-10         C04  Sticky Notes    Paper         3         3.5  Instagram
4      1005 2026-01-14         C01  Fountain Pen  Writing         1        24.0      Email
```

`shape` is (rows, columns). The numbers on the far left (0, 1, 2...) are the **index**, pandas' row labels.

To read a real file instead, upload it with the folder icon in Colab's left sidebar and use `pd.read_csv("your_file.csv")`.

**Step 2: Inspect.** Three commands you'll run on every new dataset: column types, a numeric summary, and counts of a category.

```python
print(orders.dtypes)
print(orders[["quantity", "unit_price"]].describe())
print(orders["channel"].value_counts())
```

Output (pandas 2.x; see the note below):

```text
order_id                int64
order_date     datetime64[ns]
customer_id            object
product                object
category               object
quantity                int64
unit_price            float64
channel                object
dtype: object
        quantity  unit_price
count  30.000000   30.000000
mean    2.866667   10.450000
std     3.785028    6.965865
min     1.000000    3.500000
25%     1.000000    4.000000
50%     2.000000    8.000000
75%     3.000000   17.250000
max    20.000000   24.000000
channel
Instagram    16
Website       9
Email         5
Name: count, dtype: int64
```

**Version note:** if your Colab has pandas 3, text columns show as `str` instead of `object` and the date column as `datetime64[us]` instead of `datetime64[ns]`. Both mean the same thing for this course. Check your version with `print(pd.__version__)`.

What to look for: `quantity` has a mean of 2.87 but a max of 20. That gap is a hint of an unusually large order.

**Step 3: Select, calculate, filter, sort.**

```python
print(orders[["order_id", "product", "quantity"]].head(3))

orders["revenue"] = orders["quantity"] * orders["unit_price"]
print(orders[["order_id", "quantity", "unit_price", "revenue"]].head(3))

big_instagram = orders[(orders["channel"] == "Instagram") & (orders["revenue"] >= 15)]
print(big_instagram[["order_id", "product", "revenue"]])

march = orders[orders["order_date"] >= "2026-03-01"]
print(len(march), march["revenue"].sum())

top = orders.sort_values(["revenue", "order_id"], ascending=[False, True])
print(top[["order_id", "customer_id", "revenue"]].head(3))
```

Output:

```text
   order_id      product  quantity
0      1001     Notebook         2
1      1002  Gel Pen Set         1
2      1003      Planner         1
   order_id  quantity  unit_price  revenue
0      1001         2         8.0     16.0
1      1002         1         6.5      6.5
2      1003         1        18.0     18.0
    order_id         product  revenue
5       1006      Washi Tape     16.0
11      1012         Planner     18.0
13      1014    Sticky Notes     17.5
18      1019        Notebook     16.0
22      1023      Washi Tape     24.0
24      1025  Desk Organizer     15.0
26      1027         Planner     18.0
12 246.0
    order_id customer_id  revenue
8       1009         C07    160.0
27      1028         C07     65.0
4       1005         C01     24.0
```

Rules worth memorizing:
- One column gives a Series: `orders["revenue"]`. A list of columns gives a DataFrame: `orders[["a", "b"]]` (note the double brackets).
- Combine conditions with `&` (and) and `|` (or), and wrap each condition in parentheses.
- March revenue is 246, matching your `SUMIFS` from Module 2. Getting the same number from two tools is a great way to check your work.

**Step 4: groupby and merge.**

```python
by_channel = orders.groupby("channel")["revenue"].agg(["count", "sum", "mean"])
print(by_channel.round(2))

orders["month"] = orders["order_date"].dt.strftime("%Y-%m")
print(orders.groupby("month")["revenue"].sum())

full = orders.merge(customers, on="customer_id", how="left")
print(full[["order_id", "customer_name", "customer_type", "revenue"]].head(3))
print(full.groupby("customer_type")["revenue"].sum())
```

Output:

```text
           count    sum   mean
channel                       
Email          5  291.0  58.20
Instagram     16  209.0  13.06
Website        9  152.0  16.89
month
2026-01    274.0
2026-02    132.0
2026-03    246.0
Name: revenue, dtype: float64
   order_id customer_name customer_type  revenue
0      1001         Amara    Individual     16.0
1      1002          Bola    Individual      6.5
2      1003          Chen    Individual     18.0
customer_type
Business      225.0
Individual    427.0
Name: revenue, dtype: float64
```

`groupby("channel")["revenue"].agg([...])` reads as "split the rows by channel, take the revenue column, and calculate these summaries for each group." `merge(..., how="left")` keeps every order and attaches customer details where the IDs match, just like a SQL `LEFT JOIN`.

**Step 5: Your turn.** Find total revenue by city (all customers) and check that every order found a matching customer.

```python
print(full.groupby("city")["revenue"].sum().sort_values(ascending=False))
print(full["customer_name"].isna().sum())
```

Output:

```text
city
Baltimore    412.0
Atlanta      127.5
Houston      112.5
Name: revenue, dtype: float64
0
```

Baltimore shows 412 here but only 187 in the Module 3 query. Why? The Module 3 query excluded the business customer, and Greenfield School is in Baltimore. The `0` means no order is missing a customer after the merge; a non-zero number would mean some `customer_id` values didn't match.

### Checkpoint

You can load data from a string, add a calculated column, filter with two conditions, group and summarize, and merge two tables, and your numbers match the SQL and Sheets results.

### Quiz

1. What does `io.StringIO(ORDERS_CSV)` let `pd.read_csv` do?
2. What's the difference between `orders["revenue"]` and `orders[["revenue"]]`?
3. Why does `orders[(orders["channel"] == "Instagram") & (orders["revenue"] >= 15)]` need parentheses around each condition?
4. What does `how="left"` in `merge` guarantee?
5. Why is it useful that March revenue came out as 246 in Sheets, SQL, and pandas?

*Answers: 1) Read a text string as if it were a CSV file. 2) Single brackets return one column as a Series; double brackets return a DataFrame with that column. 3) Python's `&` binds more tightly than `==` and `>=`, so without parentheses the comparisons are evaluated in the wrong order and raise an error. 4) Every row from the left table (orders) is kept, even if no matching customer is found. 5) Matching results from independent methods is strong evidence that your calculation is right.*

---

## Module 5: Cleaning Data

**Time: about 3 hours**

### Concept

So far you've used a clean dataset. Real data almost never arrives that way. The order data you've been using was actually produced by cleaning a raw export from the shop's system, and in this module you'll do that cleaning yourself.

Common problems and typical fixes:

| Problem | Example | Typical fix |
|---|---|---|
| **Duplicates** | The same order exported twice | `drop_duplicates()`, after confirming they are true copies |
| **Junk rows** | Test orders | Filter them out with a clear rule |
| **Inconsistent text** | `IG`, `instagram`, `Instagram ` | `.str.strip()`, `.str.lower()`, then map to one label |
| **Wrong types** | Prices like `$6.50` stored as text | Remove symbols, then `pd.to_numeric()` |
| **Mixed formats** | `2026/02/02` vs `2026-02-02` | Standardize, then `pd.to_datetime()` |
| **Missing values** | A blank price | Fill from a trustworthy source, drop the row, or leave it missing and say so |
| **Outliers** | Quantity 200 | Investigate: is it an error or a real but unusual value? |

Two principles matter more than any function:

1. **Outliers are not automatically errors.** A school ordering 20 notebooks is unusual but real. Deleting real data because it's inconvenient makes your analysis wrong.
2. **Document every decision.** Write down what you changed, how many rows it affected, and why. Anyone reading your results (including you, in three months) should be able to understand and challenge each choice.

### Where you'd actually use this

Every export from a form, store, CRM, survey tool, or app database. Survey answers typed in different ways ("NYC", "New York", "new york"), sign-up dates in different formats, duplicate rows from a sync that ran twice. Analysts commonly report that cleaning takes more time than the analysis itself, and skipping it quietly produces wrong numbers.

### Lab

Make sure the Module 3 data cell has run (we'll compare against `ORDERS_CSV` at the end).

**Step 1: The raw export.** Add this cell. Look closely: it contains several problems.

```python
RAW_ORDERS_CSV = """order_id,order_date,customer_id,product,category,quantity,unit_price,channel
1001,2026-01-03,C01,Notebook,Paper,2,8.00,Website
1002,2026-01-05,C02,Gel Pen Set,Writing,1,$6.50,instagram
1003,2026-01-08,C03,Planner,Paper,1,18.00,Website
1004,2026-01-10,C04,Sticky Notes,Paper,3,3.50,IG
1005,2026-01-14,C01,Fountain Pen,Writing,1,$24.00,Email
1006,2026-01-17,C05,Washi Tape,Craft,4,4.00,Instagram
1007,2026-01-21,C06,Desk Organizer,Desk,1,15.00,website
1008,2026-01-25,C02,Notebook,Paper,1,8.00,Instagram 
1009,2026-01-29,C07,Notebook,Paper,20,8.00,Email
1010,2026/02/02,C08,Gel Pen Set,Writing,2,6.50,Instagram
1011,2026-02-04,C03,Washi Tape,Craft,2,4.00,Website
1012,2026-02-07,C09,Planner,Paper,1,,Instagram
1013,2026-02-11,C04,Fountain Pen,Writing,1,24.00,Website
1014,2026-02-14,C10,Sticky Notes,Paper,5,3.50,Instagram
1015,2026-02-14,C05,Gel Pen Set,Writing,1,6.50,Instagram
1015,2026-02-14,C05,Gel Pen Set,Writing,1,6.50,Instagram
1016,2026-02-18,C06,Planner,Paper,1,18.00,E-mail
1017,2026-02-22,C08,Washi Tape,Craft,3,4.00,Instagram
1018,2026-02-26,C01,Desk Organizer,Desk,1,15.00,Website
9999,2026-02-28,TEST,Notebook,Paper,1,0.00,Website
1019,2026-03-01,C11, Notebook,Paper,2,8.00,Instagram
1020,2026-03-03,C09,Gel Pen Set,Writing,2,6.50,IG
1021,2026-03-06,C12,Sticky Notes,Paper,2,3.50,Instagram
1022,2026/03/09,C02,Planner,Paper,1,18.00,Website
1023,2026-03-12,C10,Washi Tape,Craft,6,4.00,Instagram
1024,2026-03-15,C03,Fountain Pen,Writing,1,24.00,email
1025,2026-03-18,C11,Desk Organizer,Desk,1,15.00,Instagram
1026,2026-03-21,C12,Notebook,Paper,3,8.00,Website
1027,2026-03-24,C05,Planner,Paper,1,18.00,Instagram
1028,2026-03-27,C07,Gel Pen Set,Writing,10,6.50,Email
1029,2026-03-29,C04,Washi Tape,Craft,200,4.00,Instagram
1030,2026-03-31,C08,Sticky Notes,Paper,4,3.50,Website
"""
```

(Row 1008 has a space after `Instagram`, and row 1019 has a space before `Notebook`. They're easy to miss, which is exactly why you check with code.)

**Step 2: Diagnose before you fix.** Never start changing data until you've looked at what's wrong.

```python
import io
import pandas as pd

pd.set_option("display.max_columns", None)
pd.set_option("display.width", 120)

raw = pd.read_csv(io.StringIO(RAW_ORDERS_CSV))
print(raw.shape)
print(raw.isna().sum())
print(list(raw["channel"].unique()))
print("Exact duplicate rows:", raw.duplicated().sum())
```

Output:

```text
(32, 8)
order_id       0
order_date     0
customer_id    0
product        0
category       0
quantity       0
unit_price     1
channel        0
dtype: int64
['Website', 'instagram', 'IG', 'Email', 'Instagram', 'website', 'Instagram ', 'E-mail', 'email']
Exact duplicate rows: 1
```

32 rows instead of 30, one missing price, nine spellings of three channels, and one duplicate. Also check `raw.dtypes` yourself: `unit_price` is text, not a number, because of the `$` signs.

**Step 3: Fix duplicates, junk rows, text, and types.** We work on a copy so the raw data stays untouched, and we record each decision in `cleaning_log` as we go.

```python
clean = raw.copy()
cleaning_log = []

def log(step, rows_affected, decision):
    cleaning_log.append({"step": step, "rows": rows_affected, "decision": decision})

# 1. Remove exact duplicate rows
dupes = clean.duplicated().sum()
clean = clean.drop_duplicates()
log("Duplicates", dupes, "Dropped exact duplicate (export glitch)")

# 2. Remove test orders
is_test = clean["customer_id"] == "TEST"
log("Test orders", is_test.sum(), "Dropped rows with customer_id TEST")
clean = clean[~is_test].copy()

# 3. Tidy text: strip stray spaces, then map spelling variants to one label
for col in ["product", "category", "channel"]:
    clean[col] = clean[col].str.strip()

channel_map = {
    "instagram": "Instagram", "ig": "Instagram",
    "website": "Website",
    "email": "Email", "e-mail": "Email",
}
before = clean["channel"].copy()
clean["channel"] = clean["channel"].str.lower().map(channel_map)
log("Channel labels", (before != clean["channel"]).sum(), "Merged spelling variants into 3 labels")
print("Unmapped channels:", clean["channel"].isna().sum())

# 4. Fix types: dates and prices
clean["order_date"] = pd.to_datetime(clean["order_date"].str.replace("/", "-"))
clean["unit_price"] = pd.to_numeric(clean["unit_price"].str.replace("$", "", regex=False))
log("Types", len(clean), "Parsed dates; removed $ from prices")

print(clean.dtypes)
```

Output (pandas 2.x; pandas 3 shows `str` and `datetime64[us]`):

```text
Unmapped channels: 0
order_id                int64
order_date     datetime64[ns]
customer_id            object
product                object
category               object
quantity                int64
unit_price            float64
channel                object
dtype: object
```

Two things to notice:
- `~is_test` means "not a test row." The `~` flips True and False.
- The "Unmapped channels" check matters. `.map()` turns any spelling not in the dictionary into a missing value, so a count of 0 confirms every variant was handled. If a new spelling like `Insta` appeared next quarter, this check would catch it.

**Step 4: The missing price.** Look at the row first, then decide.

```python
# 5. Missing price: every product has one fixed price, so look it up
print(clean[clean["unit_price"].isna()])
price_list = clean.groupby("product")["unit_price"].median()
print(price_list)
missing = clean["unit_price"].isna()
clean.loc[missing, "unit_price"] = clean.loc[missing, "product"].map(price_list)
log("Missing price", missing.sum(), "Filled from product price (prices fixed in Q1)")
```

Output:

```text
    order_id order_date customer_id  product category  quantity  unit_price    channel
11      1012 2026-02-07         C09  Planner    Paper         1         NaN  Instagram
product
Desk Organizer    15.0
Fountain Pen      24.0
Gel Pen Set        6.5
Notebook           8.0
Planner           18.0
Sticky Notes       3.5
Washi Tape         4.0
Name: unit_price, dtype: float64
```

Filling the Planner's price with 18.00 is safe here because the owner confirmed prices didn't change during the quarter. If prices had changed, or if the missing value were something like a customer's age, guessing would be risky; you'd leave it missing or drop the row and report how many rows were affected.

**Step 5: Outliers.** A common rule of thumb flags values more than 1.5 times the **interquartile range** (IQR, the spread of the middle half of the data) above the third quartile.

```python
# 6. Outliers: flag unusual quantities with the IQR rule
q1 = clean["quantity"].quantile(0.25)
q3 = clean["quantity"].quantile(0.75)
iqr = q3 - q1
upper = q3 + 1.5 * iqr
print("Upper fence:", upper)
print(clean[clean["quantity"] > upper][["order_id", "customer_id", "product", "quantity"]])
```

Output:

```text
Upper fence: 6.0
    order_id customer_id      product  quantity
8       1009         C07     Notebook        20
29      1028         C07  Gel Pen Set        10
30      1029         C04   Washi Tape       200
```

The rule only *flags* rows; a person decides. Here's what the owner said when asked: orders 1009 and 1028 are real bulk orders from Greenfield School. Order 1029 was 2 rolls of washi tape; 200 was a typing mistake. So we fix one and keep two.

```python
# Order 1029: the owner confirmed 2 rolls were shipped, so 200 is a typo
clean.loc[clean["order_id"] == 1029, "quantity"] = 2
log("Outliers", 1, "1029: 200 -> 2 (owner confirmed typo); kept 1009, 1028 (real school orders)")

clean = clean.reset_index(drop=True)
print(clean.shape)
print(pd.DataFrame(cleaning_log).to_string(index=False))
```

Output:

```text
(30, 8)
          step  rows                                                                    decision
    Duplicates     1                                     Dropped exact duplicate (export glitch)
   Test orders     1                                          Dropped rows with customer_id TEST
Channel labels     6                                      Merged spelling variants into 3 labels
         Types    30                                         Parsed dates; removed $ from prices
 Missing price     1                              Filled from product price (prices fixed in Q1)
      Outliers     1 1029: 200 -> 2 (owner confirmed typo); kept 1009, 1028 (real school orders)
```

That table is your **cleaning log**. Paste it into any report you write from this data.

**Step 6: Verify.** Compare your cleaned table to the clean dataset you've been using since Module 2.

```python
reference = pd.read_csv(io.StringIO(ORDERS_CSV), parse_dates=["order_date"])
print(clean.equals(reference))
```

Output:

```text
True
```

`True` means every value, type, and row matches. You've reproduced the clean data from the messy export.

### Checkpoint

Your `clean.equals(reference)` prints `True`, and you can explain each line of your cleaning log to someone who hasn't seen the data.

### Quiz

1. Why diagnose the data (counts, unique values, missing values) before changing anything?
2. Why were orders 1009 and 1028 kept even though the IQR rule flagged them?
3. Why print the count of unmapped channels after using `.map()`?
4. When is filling a missing value reasonable, and when is it risky?
5. What is a cleaning log for?

*Answers: 1) So you know what's actually wrong and how many rows each problem affects, instead of guessing and possibly damaging good data. 2) They're real bulk orders from a school; removing real data would make the analysis wrong. 3) `.map()` turns any value not in the dictionary into a missing value, so the count proves every spelling was handled. 4) It's reasonable when you have a trustworthy source for the true value, like a fixed price list; it's risky when you'd be guessing. 5) It records every change, how many rows it affected, and why, so others can understand, reproduce, and challenge your results.*

---

## Module 6: Descriptive Statistics and Honest Comparisons

**Time: about 2.5 hours**

### Concept

**Descriptive statistics** summarize data with a few numbers. You don't need advanced math, but you do need to know what each number hides.

**Center: mean vs median.**
- The **mean** (average) adds everything up and divides by the count. One huge value pulls it a lot.
- The **median** is the middle value when sorted. Extreme values barely move it.
- When they differ a lot, the data is **skewed**, and the median usually better describes a "typical" case. Report both when it matters.

**Spread.** The **standard deviation** (std) is roughly how far values typically sit from the mean. **Min, max, and quartiles** (25%, 50%, 75%) show the range and where the middle half sits.

**Percentages and shares.** "Instagram brought $209" means more when you add "that's 32% of revenue." Always say what the percentage is *of*.

**Honest comparison habits:**
- **Compare like with like.** If one group contains a very different kind of customer (like a school buying in bulk), show results with and without them.
- **Watch the sample size.** An average of 3 orders can change completely with one more order. Report counts next to averages.
- **Correlation is not causation.** Two things moving together doesn't mean one causes the other. There may be a third factor, or it may be chance.
- **Simpson's paradox.** A trend that appears in every subgroup can reverse when the groups are combined, because the groups have different sizes. You'll see an example in the lab.

### Where you'd actually use this

Reporting a "typical" order value or session length, comparing two versions of a sign-up page, judging whether a new feature "increased engagement," or reading someone else's dashboard critically. Most misleading claims you'll meet aren't lies; they're a mean where a median belonged, a missing sample size, or a comparison of unlike groups.

### Lab

**Run this first.** This setup cell rebuilds the analysis table used in Modules 6 to 8 (it needs the Module 3 data cell).

```python
import io
import pandas as pd

pd.set_option("display.max_columns", None)
pd.set_option("display.width", 120)

orders = pd.read_csv(io.StringIO(ORDERS_CSV), parse_dates=["order_date"])
customers = pd.read_csv(io.StringIO(CUSTOMERS_CSV))
orders["revenue"] = orders["quantity"] * orders["unit_price"]
orders["month"] = orders["order_date"].dt.strftime("%Y-%m")
full = orders.merge(customers, on="customer_id", how="left")
print(full.shape)
```

Output:

```text
(30, 13)
```

**Step 1: Mean vs median.**

```python
rev = full["revenue"]
print("Mean:  ", round(rev.mean(), 2))
print("Median:", rev.median())
print(rev.describe().round(2))
```

Output:

```text
Mean:   21.73
Median: 16.0
count     30.00
mean      21.73
std       28.17
min        6.50
25%       12.25
50%       16.00
75%       18.00
max      160.00
Name: revenue, dtype: float64
```

Three quarters of orders are $18 or less, yet the mean is $21.73. The $160 and $65 school orders pull the mean up. "Our typical order is about $16" (median) is the honest sentence here; "our average order is $21.73" is true but misleading on its own. The large std (28.17, bigger than the mean) is another sign of a few extreme values.

**Step 2: Compare channels, with and without the business customer.**

```python
summary = full.groupby("channel")["revenue"].agg(["count", "sum", "mean", "median"])
summary["share_%"] = summary["sum"] / summary["sum"].sum() * 100
print(summary.round(1))

individuals = full[full["customer_type"] == "Individual"]
summary_ind = individuals.groupby("channel")["revenue"].agg(["count", "sum", "mean", "median"])
summary_ind["share_%"] = summary_ind["sum"] / summary_ind["sum"].sum() * 100
print(summary_ind.round(1))
```

Output:

```text
           count    sum  mean  median  share_%
channel                                       
Email          5  291.0  58.2    24.0     44.6
Instagram     16  209.0  13.1    13.0     32.1
Website        9  152.0  16.9    16.0     23.3
           count    sum  mean  median  share_%
channel                                       
Email          3   66.0  22.0    24.0     15.5
Instagram     16  209.0  13.1    13.0     48.9
Website        9  152.0  16.9    16.0     35.6
```

With everyone included, Email looks like the top channel (45% of revenue). For individual shoppers, Email is the smallest channel (16%) and Instagram brings almost half the revenue. Both tables are "correct"; the honest move is to show which one answers the question being asked, and to mention the other.

Also notice Email for individuals has just **3 orders**. An average of $22 from 3 orders isn't enough to conclude much.

**Step 3: Correlation (and its limits).**

```python
print(full.groupby("channel")["customer_id"].nunique())
print(round(full["quantity"].corr(full["unit_price"]), 2))
print(round(individuals["quantity"].corr(individuals["unit_price"]), 2))
```

Output:

```text
channel
Email        4
Instagram    8
Website      7
Name: customer_id, dtype: int64
-0.32
-0.65
```

The first result counts unique customers per channel: Instagram reached the most people (8). The **correlation coefficient** runs from -1 to 1; negative means one goes up as the other goes down. For individuals it's -0.65: cheaper items tend to be bought in larger quantities. Including the school weakens it to -0.32, because its 20 notebooks at $8 don't fit the pattern. That shows how much one or two points can change a correlation in a small dataset.

Does a low price *cause* bigger orders? Maybe partly, but other explanations fit too: sticky notes and washi tape are things people naturally buy several of, while nobody needs three planners. Correlation tells you *where to look*, not *why*.

**Step 4: Simpson's paradox.** Imagine Ivy & Ink tested two versions of a product page. This is a separate, invented example.

```python
tests = pd.DataFrame({
    "version":  ["A", "A", "B", "B"],
    "device":   ["Mobile", "Desktop", "Mobile", "Desktop"],
    "visitors": [800, 200, 200, 800],
    "buyers":   [60, 50, 12, 180],
})
tests["rate_%"] = tests["buyers"] / tests["visitors"] * 100
print(tests)

overall = tests.groupby("version")[["visitors", "buyers"]].sum()
overall["rate_%"] = overall["buyers"] / overall["visitors"] * 100
print(overall)
```

Output:

```text
  version   device  visitors  buyers  rate_%
0       A   Mobile       800      60     7.5
1       A  Desktop       200      50    25.0
2       B   Mobile       200      12     6.0
3       B  Desktop       800     180    22.5
         visitors  buyers  rate_%
version                          
A            1000     110    11.0
B            1000     192    19.2
```

Version A wins on mobile (7.5% vs 6.0%) *and* on desktop (25.0% vs 22.5%), yet B wins overall (19.2% vs 11.0%). Why? B's visitors were mostly on desktop, where everyone buys more often. The overall number mixes up "which version" with "which device." The fix is to compare within groups, or make sure both versions get a similar mix of visitors.

**Step 5: Your turn.** For individual customers, compare cities by order count, mean, and median revenue.

```python
print(individuals.groupby("city")["revenue"].agg(["count", "mean", "median"]).round(2))
```

Output:

```text
           count   mean  median
city                           
Atlanta        9  14.17    15.0
Baltimore     11  17.00    17.5
Houston        8  14.06    13.5
```

Write one honest sentence about this table. A good one: "Among individual customers, Baltimore orders were slightly larger (median $17.50 vs $15.00 and $13.50), but with only 8 to 11 orders per city this difference could easily be chance."

### Checkpoint

You can explain why the median is a better "typical order" here than the mean, why Email looks different with and without the school, and how version A can win every group but lose overall.

### Quiz

1. When is the median a better summary than the mean?
2. Why should you report the number of orders next to an average?
3. Quantity and unit price have a correlation of -0.65 for individuals. Does that prove low prices cause bigger orders?
4. In the page test, why did B win overall even though A won on both devices?
5. Why show channel results both with and without the school?

*Answers: 1) When the data is skewed by a few extreme values, like the school's bulk orders, since the median barely moves while the mean gets pulled. 2) An average from a few orders can change a lot with one more order, so the count tells readers how much to trust it. 3) No; it shows the two move together, but other factors, like the kind of product, could explain it. 4) Most of B's visitors were on desktop, where purchase rates are higher for both versions, so the combined number reflected the device mix rather than the page. 5) One very different customer changes the picture completely, and readers need to see which result answers their question.*

---

## Module 7: Charts That Tell the Truth

**Time: about 2.5 hours**

### Concept

A chart's job is to make one point obvious. Start by asking what the point is, then pick the form that fits:

| You want to show | Use | Avoid |
|---|---|---|
| Comparing amounts across categories | **Bar chart** | Pie charts with many slices |
| Change over time | **Line chart** | Bars for long time series |
| How values are distributed | **Histogram** | Just reporting the mean |
| Relationship between two numbers | **Scatter plot** | Two separate charts side by side |

Rules for honest charts:
- **Bar charts start at zero.** A bar's length *is* the value. Cutting the axis makes small differences look huge.
- **Label everything:** a title that states what's shown, axis labels with units, and a legend when there's more than one series.
- **One y-axis.** Charts with two different y-scales let you make any two lines look related.
- **Don't cherry-pick the time window** to manufacture a trend.
- **Remove clutter** (extra borders, 3D effects, heavy grids) so the data stands out.
- **Don't rely on color alone.** Use labels or a legend too, since some readers can't distinguish certain colors.

We'll use **matplotlib**, Python's standard charting library. In Colab, `plt.show()` displays the chart right below the cell.

### Where you'd actually use this

A slide for a team update, a chart in a project README, a dashboard for an event's registrations, or a figure in a report. Charts are often the only part of an analysis people remember, so they need to be both clear and fair.

### Lab

Make sure the Module 3 data cell and the Module 6 setup cell have run in this session.

**Step 1: Bar chart (comparing categories).**

```python
import matplotlib.pyplot as plt

by_channel = full.groupby("channel")["revenue"].sum().sort_values(ascending=False)
print(by_channel)

fig, ax = plt.subplots(figsize=(6, 4))
ax.bar(by_channel.index, by_channel.values, color="#3b6ea5")
ax.set_title("Q1 2026 revenue by channel")
ax.set_ylabel("Revenue ($)")
ax.set_ylim(bottom=0)
for i, value in enumerate(by_channel.values):
    ax.text(i, value + 4, f"${value:.0f}", ha="center")
ax.spines[["top", "right"]].set_visible(False)
plt.tight_layout()
plt.show()
```

Output:

```text
channel
Email        291.0
Instagram    209.0
Website      152.0
Name: revenue, dtype: float64
```

You'll see three blue bars from tallest (Email, $291) to shortest (Website, $152), each with its value printed on top. Sorting the bars from largest to smallest makes the ranking instant to read. `ax.spines[...]` removes the top and right borders, which add nothing.

**Step 2: Line chart (change over time).** This chart shows both all customers and individuals only, because the school's orders hide the real trend.

```python
monthly = full.groupby("month")["revenue"].sum()
monthly_ind = full[full["customer_type"] == "Individual"].groupby("month")["revenue"].sum()
print(monthly_ind)

fig, ax = plt.subplots(figsize=(6, 4))
ax.plot(monthly.index, monthly.values, marker="o", linewidth=2, label="All customers")
ax.plot(monthly_ind.index, monthly_ind.values, marker="o", linewidth=2, label="Individuals only")
ax.set_title("Monthly revenue, Q1 2026")
ax.set_ylabel("Revenue ($)")
ax.set_ylim(bottom=0)
ax.legend()
ax.spines[["top", "right"]].set_visible(False)
plt.tight_layout()
plt.show()
```

Output:

```text
month
2026-01    114.0
2026-02    132.0
2026-03    181.0
Name: revenue, dtype: float64
```

The "All customers" line dips sharply in February (274, 132, 246) and looks like a problem. The "Individuals only" line rises steadily: 114, 132, 181. The February "dip" is just a month without a school order. This one chart corrects a misleading story.

**Step 3: Histogram and scatter plot.**

```python
fig, (left, right) = plt.subplots(1, 2, figsize=(10, 4))

left.hist(full["revenue"], bins=range(0, 170, 10), color="#3b6ea5", edgecolor="white")
left.set_title("How big is a typical order?")
left.set_xlabel("Order revenue ($)")
left.set_ylabel("Number of orders")

right.scatter(full["unit_price"], full["quantity"], color="#3b6ea5", alpha=0.6)
right.set_title("Cheaper items sell in bigger quantities")
right.set_xlabel("Unit price ($)")
right.set_ylabel("Quantity in order")

for ax in (left, right):
    ax.spines[["top", "right"]].set_visible(False)
plt.tight_layout()
plt.show()
```

The histogram groups orders into $10-wide bins: almost all orders fall between $0 and $30, with two lonely bars far to the right (the $65 and $160 school orders). This picture explains the mean-vs-median gap from Module 6 better than any number. In the scatter plot, the expensive items (fountain pens, planners, organizers) all sit at quantity 1 while cheaper items spread higher, plus one point at 20 (the school's notebooks). `alpha=0.6` makes the dots slightly see-through so overlapping points show up darker.

**Step 4: The same data, honest vs misleading.**

```python
avg_value = full.groupby("channel")["revenue"].mean().drop("Email")
print(avg_value.round(2))

fig, (bad, good) = plt.subplots(1, 2, figsize=(10, 4))

bad.bar(avg_value.index, avg_value.values, color="#b0b0b0")
bad.set_ylim(12, 17.5)   # cut-off axis: exaggerates the gap
bad.set_title("Misleading: axis starts at 12")

good.bar(avg_value.index, avg_value.values, color="#3b6ea5")
good.set_ylim(0, 20)     # honest: bars start at zero
good.set_title("Honest: axis starts at 0")

for ax in (bad, good):
    ax.set_ylabel("Average order value ($)")
    ax.spines[["top", "right"]].set_visible(False)
plt.tight_layout()
plt.show()
```

Output:

```text
channel
Instagram    13.06
Website      16.89
Name: revenue, dtype: float64
```

On the left, the Website bar looks more than four times taller than Instagram's. On the right, you see the truth: Website orders are about 30% larger ($16.89 vs $13.06). Same numbers, very different impression.

**Step 5: Pick the chart.**

```lab
{
 "type": "sort",
 "title": "Which chart fits?",
 "prompt": "Pick the best chart type for each question about Ivy & Ink.",
 "buckets": [
  "Bar chart",
  "Line chart",
  "Histogram",
  "Scatter plot"
 ],
 "items": [
  {
   "text": "Which product category earned the most revenue?",
   "bucket": "Bar chart",
   "why": "Comparing amounts across categories."
  },
  {
   "text": "Is weekly revenue from individuals going up?",
   "bucket": "Line chart",
   "why": "Change over time is a line chart's job."
  },
  {
   "text": "Are most orders small, or are sizes spread evenly?",
   "bucket": "Histogram",
   "why": "A histogram shows how values are distributed."
  },
  {
   "text": "Do customers who order more often also spend more per order?",
   "bucket": "Scatter plot",
   "why": "A relationship between two numbers per customer."
  },
  {
   "text": "How many orders did each city place?",
   "bucket": "Bar chart",
   "why": "Counts compared across categories."
  }
 ]
}
```

**Step 6: Your turn.** Make a horizontal bar chart of revenue by product, sorted so the biggest is at the top. Hint: `full.groupby("product")["revenue"].sum().sort_values()` and `ax.barh(...)`. Notebooks should come out on top at $224, and Desk Organizers at the bottom at $45. Give it a title and an x-axis label.

### Checkpoint

You've made a bar, line, histogram, and scatter chart, each with a title and labeled axes, and you can explain exactly why the left chart in Step 4 is misleading.

### Quiz

1. Why must bar charts start at zero?
2. Which chart type would you use to show how monthly sign-ups changed over a year?
3. What did the histogram reveal that the mean alone did not?
4. Why did the line chart include an "Individuals only" line?
5. Why is a chart with two different y-axes risky?

*Answers: 1) Readers judge a bar by its length, so cutting the axis exaggerates differences. 2) A line chart. 3) That almost all orders are small, with two extreme orders far to the right that pull the mean up. 4) The school's bulk orders created a fake February dip in the total; individuals alone show steady growth. 5) You can rescale either axis to make any two lines look related or unrelated, so the visual impression can be manipulated.*

---

## Module 8: Telling a Story with Data (Mini Project)

**Time: about 4 hours**

### Concept

An analysis isn't finished until someone can act on it. A good findings write-up is short and built around the decision:

1. **The question** (from your brief in Module 1)
2. **The answer first**, in one or two sentences
3. **Key findings**, three or so, each with a number and its context
4. **One chart** that supports the main point
5. **Recommendation:** what to do, and what would change your mind
6. **Limitations:** what the data can't tell you
7. **Method notes:** where the data came from and what cleaning you did (your cleaning log)

Writing tips:
- Lead with the answer, not with your process. Busy readers may only read the first lines.
- Every number needs context: "209" means little; "$209, 49% of revenue from individual customers" means something.
- Use plain words. Write "typical order" rather than "median" if your reader isn't technical, or use both.
- Be direct about uncertainty without burying the conclusion. "Instagram is growing, though three months is a short window" is better than either overconfidence or endless hedging.

### Where you'd actually use this

A one-page summary for a founder or team lead, a post-event report for sponsors, a project update in a team channel, or the "results" section of a portfolio project. This end-to-end flow (question, clean, analyze, chart, write) is the core loop of analytics work, whatever the tools.

### Lab

You'll answer the question brief from Module 1: **Which sales channel should Ivy & Ink focus its April marketing on to grow revenue from individual customers?**

Make sure the Module 3 data cell and the Module 6 setup cell have run.

**Step 1: The question.** Add a text cell at the top of a new section in your notebook and paste the question brief from Module 1. Everything below should answer it.

**Step 2: Check and analyze.** The data is already cleaned (Module 5). Still, add quick automated checks so the notebook warns you if a future export breaks something, then build the summary.

```python
# Step 2: sanity checks on the cleaned data
assert full["order_id"].is_unique
assert full["customer_name"].notna().all()
assert (full["quantity"] > 0).all()
print("Checks passed:", len(full), "orders")

# Step 3: analyze individual customers by channel
ind = full[full["customer_type"] == "Individual"]
by_channel = ind.groupby("channel").agg(
    orders=("order_id", "count"),
    customers=("customer_id", "nunique"),
    revenue=("revenue", "sum"),
    avg_order=("revenue", "mean"),
)
by_channel["revenue_share_%"] = by_channel["revenue"] / by_channel["revenue"].sum() * 100
print(by_channel.round(1))

by_month = ind.pivot_table(index="month", columns="channel", values="revenue", aggfunc="sum", fill_value=0)
print(by_month)
```

Output:

```text
Checks passed: 30 orders
           orders  customers  revenue  avg_order  revenue_share_%
channel                                                          
Email           3          3     66.0       22.0             15.5
Instagram      16          8    209.0       13.1             48.9
Website         9          7    152.0       16.9             35.6
channel  Email  Instagram  Website
month                             
2026-01   24.0       41.0     49.0
2026-02   18.0       67.0     47.0
2026-03   24.0      101.0     56.0
```

`assert` stops the notebook with an error if a condition is false. `agg(orders=("order_id", "count"), ...)` is **named aggregation**: each new column gets a name, a source column, and a summary function. `pivot_table` is pandas' version of the two-dimensional pivot table you built in Sheets.

**Step 3: One chart that answers the question.**

```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots(figsize=(7, 4))
for channel in ["Instagram", "Website", "Email"]:
    ax.plot(by_month.index, by_month[channel], marker="o", linewidth=2, label=channel)
ax.set_title("Revenue from individual customers by channel, Q1 2026")
ax.set_ylabel("Revenue ($)")
ax.set_ylim(bottom=0)
ax.legend()
ax.spines[["top", "right"]].set_visible(False)
plt.tight_layout()
plt.show()
```

You'll see three lines. Instagram climbs steeply (41, 67, 101), the Website stays roughly flat (49, 47, 56), and Email stays low and flat (24, 18, 24). In January the Website was ahead; by March, Instagram brought in nearly twice as much.

**Step 4: Pull the numbers for the write-up from code, not by retyping.** This avoids copy mistakes and means the text updates if the data changes.

```python
ig = by_channel.loc["Instagram"]
web = by_channel.loc["Website"]
print(f"Instagram: {ig['orders']:.0f} orders, {ig['customers']:.0f} customers, "
      f"${ig['revenue']:.0f} ({ig['revenue_share_%']:.0f}% of individual revenue), "
      f"avg order ${ig['avg_order']:.2f}")
print(f"Website: {web['orders']:.0f} orders, {web['customers']:.0f} customers, "
      f"${web['revenue']:.0f} ({web['revenue_share_%']:.0f}%), avg order ${web['avg_order']:.2f}")
school = full[full["customer_type"] == "Business"]["revenue"].sum()
print(f"School orders: ${school:.0f} of ${full['revenue'].sum():.0f} total "
      f"({school / full['revenue'].sum() * 100:.0f}%)")
```

Output:

```text
Instagram: 16 orders, 8 customers, $209 (49% of individual revenue), avg order $13.06
Website: 9 orders, 7 customers, $152 (36%), avg order $16.89
School orders: $225 of $652 total (35%)
```

**Step 5: Write the one-page findings.** Add a text cell (or a Google Doc) and write your findings using the structure below. Here is a completed example; write your own version in your own words before comparing.

```text
Ivy & Ink: Where to focus April marketing
Prepared from Q1 2026 order data (Jan 1 - Mar 31, 30 orders)

QUESTION
Which sales channel should we focus April's marketing time on to grow revenue
from individual customers?

ANSWER
Focus on Instagram. It brings the most orders and revenue from individual
customers and is the only channel that grew every month. Use some effort to
raise Instagram's order size, which is the smallest of the three channels.

KEY FINDINGS
1. Instagram is the largest channel for individuals: 16 of 28 individual
   orders and $209 of $427 in revenue (49%), from 8 different customers.
2. Instagram is growing: $41 in January, $67 in February, $101 in March.
   Website revenue stayed roughly flat ($49, $47, $56).
3. Instagram orders are smaller: a typical (median) Instagram order is $13,
   versus $16 on the Website (averages $13.06 and $16.89).
4. One business customer (Greenfield School) placed 2 bulk orders worth $225,
   35% of all Q1 revenue. Including them makes Email look like the top channel
   and creates a false February "dip". We report them separately.

RECOMMENDATION
- Keep Instagram as the main focus in April, since it reaches the most
  individual customers and is growing.
- Test one way to raise Instagram order size, such as a bundle (for example,
  washi tape plus sticky notes) and compare average order value in April with
  Q1's $13.06.
- Separately, follow up with Greenfield School by email about their next term's
  order, and consider whether other schools could be reached. Relying on one
  customer for a third of revenue is a risk.
- What would change this advice: if April Instagram revenue falls back below
  the Website's, or if the time spent on Instagram turns out to be far higher
  than on the other channels.

LIMITATIONS
- Only 3 months and 30 orders. The Instagram growth could partly be seasonal
  or chance; one more quarter of data would make this much clearer.
- We have no data on time or money spent per channel, so we can't say which
  channel gives the best return on effort.
- "Channel" is where the order was placed, not where the customer first heard
  about the shop. Someone may discover us on Instagram and later buy on the
  Website.
- No website visitor data, so we can't compare conversion rates.

METHOD NOTES
Source: the shop's order export for Q1 2026 plus the customer list. Cleaning
(full log in the notebook): removed 1 duplicate and 1 test order, merged 9
channel spellings into 3, parsed dates and prices, filled 1 missing price from
the product price list, corrected 1 confirmed quantity typo (200 to 2). Bulk
school orders were kept but reported separately. Analysis in Python (pandas);
numbers cross-checked in Google Sheets and SQL.
```

**Step 6: Review your own write-up.** Before you share anything, check:
- Could someone read only the ANSWER section and know what to do?
- Does every number have context (a share, a comparison, or a time period)?
- Does the chart start at zero, have a title, and label its axes?
- Did you state at least two limitations honestly?
- Could someone reproduce your numbers from your notebook and cleaning log?

**Step 7 (optional, recommended): Repeat on your own data.** Take the question brief you wrote in Module 1, gather the data (a form export, your own budget, event registrations, app sign-ups), and go through the same steps: clean with a log, analyze, one chart, one page. If your data includes other people's personal information, remove names and contact details before analyzing or sharing.

### Checkpoint

You have a notebook that runs top to bottom without errors and a one-page findings write-up that leads with an answer, supports it with numbers and one honest chart, makes a recommendation, and states its limitations.

### Quiz

1. Why should a findings write-up lead with the answer?
2. Why did the analysis focus on individual customers and report the school separately?
3. Why pull numbers for the write-up from code instead of retyping them?
4. Give one limitation of the Ivy & Ink analysis and why it matters.
5. What makes a recommendation more useful than just a summary of findings?

*Answers: 1) Busy readers may only read the start, and the decision is what they need most. 2) The question was about individual customers, and two bulk orders from one school would distort channel totals and the monthly trend. 3) It prevents copy mistakes and keeps the text correct if the data changes. 4) Any one of: only 3 months and 30 orders, so growth could be chance or seasonal; no spend or time data, so return on effort is unknown; channel shows where the order was placed, not how the customer found the shop. 5) It tells the reader what to do next, and saying what would change your mind makes it testable.*
