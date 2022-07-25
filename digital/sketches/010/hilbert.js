function hilbert(x, y, curveSize) {
  // map coordinates to Hilbert coordinate space
  x = floor(x * curveSize / width);
  y = floor(y * curveSize / height);

  var d = 0;
  for (var s = curveSize >> 1; s > 0; s >>= 1) {
    var rx = +((x & s) > 0);
    var ry = +((y & s) > 0);
    d += s * s * ((3 * rx) ^ ry);

    if (ry === 0) {
      if (rx === 1) {
        x = s - 1 - x;
        y = s - 1 - y;
      }
      var t = x;
      x = y;
      y = t;
    }
  }
  return d;
}