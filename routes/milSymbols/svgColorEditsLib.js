function overwriteFill(svg, newColor) {
  return svg.replace(/{{{ FILL_TOKEN }}}/g, newColor);
}

function overwriteStroke(svg, newColor) {
  let result = svg.replace(/stroke="black"/g, `stroke="${newColor}"`);
  // modifier elements (like dots above to indicate a platoon) have both a stroke and fill
  // which should stay the same color
  result = result.replace(/fill="black"/g, `fill="${newColor}"`);
  return result;
}

module.exports = { overwriteFill, overwriteStroke };
