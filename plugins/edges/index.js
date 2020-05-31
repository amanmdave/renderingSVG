import generateCurve from './curve';
import generateLine from './line';

var generateEdge = function(svg, x1, y1, x2, y2, id, styles) {
  generateLine(svg, x1, y1, x2, y2, id, styles);
};
