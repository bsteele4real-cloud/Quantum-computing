const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('child_process');
const path = require('path');

test('yyyy-mm-dd stays on that calendar day west of UTC', () => {
  const script = `
    const { parseCalendarDate } = require(${JSON.stringify(path.join(__dirname, 'dates.js'))});
    const parsed = parseCalendarDate('2020-10-01');
    const utcMidnight = new Date('2020-10-01T00:00:00Z');
    if (parsed.getFullYear() !== 2020 || parsed.getMonth() !== 9 || parsed.getDate() !== 1 || parsed.getHours() !== 0) {
      console.error(parsed.toString());
      process.exit(1);
    }
    if (parsed.getTime() === utcMidnight.getTime()) {
      console.error('parsed as UTC midnight');
      process.exit(2);
    }
  `;
  const result = spawnSync(process.execPath, ['-e', script], {
    env: { ...process.env, TZ: 'America/New_York' },
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
});
