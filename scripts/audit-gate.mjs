// Fails CI on anything npm audit reports that we have not already reviewed.
//
// A plain `npm audit --audit-level=high` cannot work here: one unavoidable high
// sits inside next's bundled postcss, so the run would be red every day and the
// signal would be ignored within a week. Gating only on `critical` has the
// opposite problem, which is how two criticals once sat on main unnoticed.
//
// So the gate compares against scripts/audit-baseline.json instead. Anything
// critical fails regardless, and so does any module not already listed, at any
// severity. Known issues stay green until their severity rises.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const RANK = { info: 0, low: 1, moderate: 2, high: 3, critical: 4 };

function audit() {
  try {
    // npm audit exits non-zero whenever findings exist, so treat output as the
    // result and only a missing/!JSON payload as a real failure.
    return JSON.parse(execFileSync('npm', ['audit', '--json'], { encoding: 'utf8' }));
  } catch (err) {
    if (err.stdout) return JSON.parse(err.stdout);
    throw err;
  }
}

const baseline = JSON.parse(readFileSync(new URL('./audit-baseline.json', import.meta.url), 'utf8'));
const accepted = new Map(baseline.accepted.map(a => [a.module, a]));
const found = Object.entries(audit().vulnerabilities ?? {});

const failures = [];
const tolerated = [];

for (const [name, v] of found) {
  const entry = accepted.get(name);
  if (v.severity === 'critical') {
    failures.push(`${name}: CRITICAL (${v.range}) - criticals are never baselined`);
  } else if (!entry) {
    failures.push(`${name}: ${v.severity} (${v.range}) - not in the baseline`);
  } else if (RANK[v.severity] > RANK[entry.maxSeverity]) {
    failures.push(`${name}: ${v.severity} exceeds the accepted ${entry.maxSeverity} (${v.range})`);
  } else {
    tolerated.push(`${name}: ${v.severity} - ${entry.clearedBy}`);
  }
}

if (tolerated.length) {
  console.log('Accepted, already reviewed:');
  for (const t of tolerated) console.log('  ' + t);
}

const stale = [...accepted.keys()].filter(m => !found.some(([n]) => n === m));
if (stale.length) {
  console.log('\nBaseline entries no longer reported, safe to delete:');
  for (const s of stale) console.log('  ' + s);
}

if (failures.length) {
  console.error('\nAudit gate failed:');
  for (const f of failures) console.error('  ' + f);
  console.error('\nFix it, or add a reviewed entry to scripts/audit-baseline.json.');
  process.exit(1);
}

console.log(`\nAudit gate passed. ${found.length} finding(s), all reviewed.`);
