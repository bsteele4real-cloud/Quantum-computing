// CO2 intensity marks (grams per kWh) and the icon color for each mark.
// Green is cleaner electricity, dark brown is higher carbon.
const CO2_SCALE = [0, 150, 600, 750, 800];
const CO2_COLORS = ['#2AA364', '#F5EB4D', '#9E4229', '#381D02', '#381D02'];

/**
 * Pick the color whose scale mark is closest to `value`.
 * Ties keep the earlier (cleaner) mark. The scale array is not reordered,
 * so the color index stays aligned with its mark.
 */
function closestCarbonColor(value) {
  const numeric = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(numeric)) return CO2_COLORS[0];

  let closestIndex = 0;
  let closestDistance = Infinity;
  for (let index = 0; index < CO2_SCALE.length; index += 1) {
    const distance = Math.abs(CO2_SCALE[index] - numeric);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  }
  return CO2_COLORS[closestIndex];
}

module.exports = { closestCarbonColor, CO2_SCALE, CO2_COLORS };
