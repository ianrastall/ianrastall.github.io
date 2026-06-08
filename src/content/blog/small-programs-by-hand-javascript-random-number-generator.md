---
title: "Small Programs by Hand: A JavaScript Random Number Generator GUI"
description: "A JavaScript version of the small random number generator, moving from a Node console script to a one-file browser GUI."
published: "2026-06-07T21:25:00-05:00"
slug: "small-programs-by-hand-javascript-random-number-generator"
category: "Programming"
tags:
  - JavaScript
  - HTML
  - VS Code
  - Small programs
draft: false
featured: false
aiAssisted: true
aiDisclosure: "This post was drafted with AI assistance and reviewed before publication."
---

JavaScript is unusual in this series because it has two obvious homes.

It can run as a console program through Node.js, and it can run graphically inside a web browser. The language is the same, but the surrounding environment changes almost everything about input and output.

The shared program is still simple: ask for a minimum, ask for a maximum, then produce a random whole number in that range.

## The Core Technologies

The console version uses Node.js:

- `readline/promises`, for terminal prompts
- `process.stdin` and `process.stdout`, for input and output streams
- `Number(...)`, for conversion
- `Math.random()` and `Math.floor()`, for random integers

The browser version uses ordinary web platform pieces:

- HTML form controls
- `<input type="number">`, for numeric entry
- `<button>`, for the action
- `<output>`, for the result
- `document.querySelector(...)`, for finding elements
- `addEventListener(...)`, for reacting to submission

JavaScript does not need a separate GUI library here because the browser already is a graphical application platform.

## The Console Version

Create a folder:

```text
small-javascript-random-console
```

Inside it, create one file:

```text
random_console.mjs
```

Here is the complete program:

```javascript
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const terminal = readline.createInterface({ input, output });

async function readWholeNumber(prompt) {
  while (true) {
    const text = await terminal.question(prompt);
    const trimmed = text.trim();
    const value = Number(trimmed);

    if (trimmed !== "" && Number.isInteger(value)) {
      return value;
    }

    console.log("Please enter a whole number.");
  }
}

const minimum = await readWholeNumber("Minimum: ");
const maximum = await readWholeNumber("Maximum: ");

if (minimum > maximum) {
  console.log("Minimum must be less than or equal to maximum.");
} else {
  const number = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
  console.log(`Random number: ${number}`);
}

terminal.close();
```

Run it with Node:

```powershell
node random_console.mjs
```

The `.mjs` extension tells Node to treat the file as an ES module, which lets us use `import` and top-level `await`.

The helper function is asynchronous:

```javascript
async function readWholeNumber(prompt) {
```

That matters because reading from the terminal takes time. This line waits for the user's answer:

```javascript
const text = await terminal.question(prompt);
```

Conversion happens with `Number(...)`:

```javascript
const value = Number(trimmed);
```

The program rejects empty input and accepts only integers:

```javascript
if (trimmed !== "" && Number.isInteger(value)) {
```

The random-number formula is the classic JavaScript version:

```javascript
const number = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
```

`Math.random()` gives a decimal from `0` up to, but not including, `1`. Multiplying stretches it, `Math.floor(...)` turns it into a whole number, and adding `minimum` shifts it into the requested range.

## The GUI Version

Now make the same idea a one-file web page.

Create a new folder:

```text
small-javascript-random-gui
```

Inside it, create one file:

```text
index.html
```

Here is the complete file:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Random Number Generator</title>
  <style>
    body {
      max-width: 32rem;
      margin: 3rem auto;
      padding: 0 1rem;
      font-family: system-ui, sans-serif;
    }

    label,
    button,
    output {
      display: block;
      margin-top: 1rem;
    }

    input,
    button {
      font: inherit;
      padding: 0.4rem;
    }
  </style>
</head>
<body>
  <h1>Random Number Generator</h1>

  <form id="generator">
    <label>
      Minimum
      <input id="minimum" type="number" step="1" value="1" required>
    </label>

    <label>
      Maximum
      <input id="maximum" type="number" step="1" value="100" required>
    </label>

    <button type="submit">Generate</button>
  </form>

  <output id="result" for="minimum maximum">Random number: -</output>

  <script>
    const form = document.querySelector("#generator");
    const minimumInput = document.querySelector("#minimum");
    const maximumInput = document.querySelector("#maximum");
    const result = document.querySelector("#result");

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const minimum = minimumInput.valueAsNumber;
      const maximum = maximumInput.valueAsNumber;

      if (!Number.isInteger(minimum) || !Number.isInteger(maximum)) {
        result.value = "Please enter whole numbers.";
        return;
      }

      if (minimum > maximum) {
        result.value = "Minimum must be less than or equal to maximum.";
        return;
      }

      const number = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
      result.value = `Random number: ${number}`;
    });
  </script>
</body>
</html>
```

Open `index.html` in a browser. This tiny version does not need a server.

The HTML creates the interface:

```html
<input id="minimum" type="number" step="1" value="1" required>
```

The `id` lets JavaScript find the element. The `type="number"` gives the browser a numeric input control. The `step="1"` asks for whole-number steps.

The result uses an `output` element:

```html
<output id="result" for="minimum maximum">Random number: -</output>
```

That element exists specifically for showing the result of a calculation or user action.

The JavaScript finds the page elements:

```javascript
const minimumInput = document.querySelector("#minimum");
```

Then it listens for the form submission:

```javascript
form.addEventListener("submit", (event) => {
```

The browser's default form behavior would reload or navigate the page. This line keeps the interaction on the current page:

```javascript
event.preventDefault();
```

After that, the logic is the same as the console version: read values, validate them, generate the number, show the result.

## The Shape Of The Lesson

JavaScript changes personality depending on where it runs.

In Node, the program is asynchronous terminal code. In the browser, it becomes DOM code. The random-number formula is the same in both places, but the surrounding world is different.

That is one of the first things worth learning about JavaScript: the language is only half the story. The host environment matters just as much.
