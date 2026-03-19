# Code Audit

A lightweight CLI tool to analyze code quality and generate an interactive dashboard.

## ✨ Features

* 🔍 Code quality analysis (lint, types, unused code, duplication, security…)
* 📊 Interactive dashboard (no server required)
* 📈 Trends & history across runs
* 🔥 Visual insights (charts, heatmap, issues)
* ⚡ Works out-of-the-box after installation

---

## 🚀 Installation

### From Git

```bash
yarn add -D code-audit@git+ssh://git@github.com:antony-vitre/code-audit.git
```

---

## 🧪 Usage

### Run analysis

```bash
yarn code-audit
```

This will:

* Run all configured analysis tools
* Generate JSON reports
* Generate the dashboard assets

Output:

```bash
/reports/code-audit
  /runs
  index.html
  reports.json
```

---

### Open dashboard

```bash
yarn code-audit dashboard
```

This will open the dashboard in your browser.

---

## 📊 Dashboard

The dashboard is fully static and includes:

* Overview KPIs
* Health score
* Tool breakdown
* Issues list with filters
* Trends over time
* Heatmap of recent runs

No backend required.

---

## 🧠 How it works

1. The CLI runs multiple analysis tools:

   * ESLint
   * TypeScript
   * npm audit
   * knip
   * madge
   * jscpd

2. Each tool generates structured JSON output

3. A global report is created

4. A React dashboard (prebuilt) reads the JSON and renders insights

---

## 📁 Output structure

```bash
reports/code-audit/
  runs/
    run-xxx/
      report.json
  reports.json
  index.html
  assets/
```

---

## ⚙️ Configuration

Currently, configuration is minimal and mainly based on your project setup:

* ESLint config
* TypeScript config
* Installed dependencies

### Default code-audit config :

```json
{
  "tools": {
    "eslint": {"patterns": ["."]},
    "knip": {"workspaces": {".": {}}},
    "madge": {"path": ".", "extensions": ["ts", "tsx", "js", "jsx"]},
    "typecheck": {"tsconfigs": ["tsconfig.json"]},
    "audit": {"level": "high", "all": true},
    "jscpd": {
      "threshold": 5,
      "minTokens": 50,
      "paths": ["."],
      "pattern": "**/**.{js,jsx,ts,tsx}",
      "ignore": [
        "**/node_modules/**",
        "**/android/**",
        "**/ios/**",
        "**/reports/code-audit",
      ],
    },
  },
};
```

### Customize code-audit config :

```json
// code-audit.config.json
{
  "tools": {
    "eslint": {
      "patterns": ["."] // Patterns to check
    },
    "knip": { // See [text](https://knip.dev/overview/getting-started)
      "workspaces": {
        ".": {}
      }
    }, 
    "madge": {
      "path": ".", // Where to check
      "extensions": ["ts", "tsx", "js", "jsx"] // File extensions to check
    },
    "typecheck": {
      "tsconfigs": ["tsconfig.json"] // TS Config to check
    },
    "audit": {
      "level": "high", // Considerate as error level
      "all": true} // Check all workspaces
    },
    "jscpd": {
      "threshold": 5, // The threshold for duplication level
      "minTokens": 50, // Minimal block size of code in tokens
      "paths": ["."], // Where to check code duplication
      "pattern": "**/**.{js,jsx,ts,tsx}", // Patterns to check 
      "ignore": [ // Patterns to ignore
        "**/node_modules/**",
        "**/android/**",
        "**/ios/**",
        "**/reports/code-audit",
      ],
    },
  },
};
```

---

## 🛠 Development

### Install dependencies

```bash
yarn
```

### Run CLI in dev

```bash
yarn dev # add --verbose or --debug for more info
yarn dev dashboard # open dashboard
```

### Run dashboard locally

```bash
cd dashboard
yarn
# Be sure to generate at least one report with CLI in dev (see above)
cp -r ../reports/code-audit/runs public/runs
cp -r ../reports/code-audit/reports.json public/
yarn dev
```

---

## 📦 Build

```bash
yarn build
```

---

## 💡 Notes

* The dashboard is built automatically on install
* No need to commit build artifacts
* Works with Git-based installation
