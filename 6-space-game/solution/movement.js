// Turn keyboard input into a velocity of length `accel`, and face that way.
// A stopped ship keeps its current angle. Cardinal directions must update the
// angle too; comparing the raw vector length to 1 skipped every straight move.

function stepPlayerMotion(vxInput, vyInput, accel, angle) {
  const mag = Math.hypot(vxInput, vyInput);
  if (mag === 0) {
    return { vx: 0, vy: 0, angle };
  }
  return {
    vx: (vxInput / mag) * accel,
    vy: (vyInput / mag) * accel,
    angle: Math.atan2(vyInput, vxInput),
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { stepPlayerMotion };
}
