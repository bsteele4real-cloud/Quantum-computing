const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { closestCarbonColor } = require('./carbon-color');

test('maps carbon intensity to the closest scale color', () => {
  assert.equal(closestCarbonColor(0), '#2AA364');
  assert.equal(closestCarbonColor(100), '#F5EB4D');
  assert.equal(closestCarbonColor(400), '#9E4229');
  assert.equal(closestCarbonColor(800), '#381D02');
  assert.equal(closestCarbonColor(5000), '#381D02');
});

test('ties resolve toward the cleaner mark', () => {
  // 75 is equally far from 0 and 150. Keep the earlier, cleaner color.
  assert.equal(closestCarbonColor(75), '#2AA364');
});

test('the popup script declares calculateColor and uses the helper', () => {
  const source = fs.readFileSync(path.join(__dirname, 'index.js'), 'utf8');
  assert.match(source, /import \{ closestCarbonColor \} from '\.\/carbon-color\.js'/);
  assert.match(source, /const calculateColor/);
  assert.doesNotMatch(source, /^calculateColor\s*=/m);
});
