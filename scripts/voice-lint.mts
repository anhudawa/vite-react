/**
 * VOICE GUARDRAIL CLI —  npm run voice:lint -- <file...>   (or pipe via stdin)
 *
 * Runs lib/voice/voiceLint on draft text and prints structured findings. Intended
 * to run on generated drafts BEFORE they reach the human verification queue.
 * Exits non-zero when there are error-severity findings (banned words, banned
 * openers, contrarian hooks). Pass --strict to also fail on warnings (structural
 * tells). It reports only — it never rewrites.
 *
 *   npm run voice:lint -- content/drafts/my-post.md
 *   cat draft.txt | npm run voice:lint
 *   npm run voice:lint -- --strict drafts/*.md
 */
import { readFileSync } from "node:fs";
import { lintVoice, hasErrors, type VoiceFinding } from "../lib/voice/voiceLint";

const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const GREEN = "\x1b[32m";
const DIM = "\x1b[2m";
const RESET = "\x1b[0m";

const argv = process.argv.slice(2);
const strict = argv.includes("--strict");
const files = argv.filter((a) => !a.startsWith("--"));

function readStdin(): Promise<string> {
  return new Promise((resolve) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (c) => (data += c));
    process.stdin.on("end", () => resolve(data));
  });
}

function report(label: string, findings: VoiceFinding[]): { errors: number; warnings: number } {
  let errors = 0;
  let warnings = 0;
  for (const f of findings) {
    if (f.severity === "error") errors++;
    else warnings++;
    const color = f.severity === "error" ? RED : YELLOW;
    console.log(
      `${YELLOW}${label}:${f.line}:${f.column}${RESET}  ${color}${f.rule}${RESET} ${f.message}\n` +
        `    ${DIM}“${f.excerpt}”${RESET}`,
    );
  }
  return { errors, warnings };
}

async function main() {
  const inputs: { label: string; text: string }[] = [];
  if (files.length > 0) {
    for (const file of files) inputs.push({ label: file, text: readFileSync(file, "utf8") });
  } else {
    inputs.push({ label: "stdin", text: await readStdin() });
  }

  let totalErrors = 0;
  let totalWarnings = 0;
  console.log(`\nVOICE GUARDRAIL — scanning ${inputs.length} input(s)\n`);

  for (const { label, text } of inputs) {
    const findings = lintVoice(text);
    const { errors, warnings } = report(label, findings);
    totalErrors += errors;
    totalWarnings += warnings;
  }

  const fail = totalErrors > 0 || (strict && totalWarnings > 0);
  console.log("");
  if (fail) {
    console.log(
      `${RED}FAIL${RESET}: ${totalErrors} error(s), ${totalWarnings} warning(s). ` +
        `${DIM}See content/voice/VOICE.md.${RESET}\n`,
    );
    process.exit(1);
  }
  console.log(
    `${GREEN}OK${RESET}: no voice errors` +
      (totalWarnings ? ` ${DIM}(${totalWarnings} warning(s) — advisory)${RESET}` : "") +
      ".\n",
  );
}

main();
