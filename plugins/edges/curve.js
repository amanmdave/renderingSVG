var generateCurve = function() {
  this.set = function(edges, svg, styles) {
    edges.map((edge, index) => {
      this.draw(
        svg,
        edge.source.x,
        edge.source.y,
        edge.target.x,
        edge.target.y,
        edge.target.uniqid,
        styles
      );
    });
  };
  this.draw = function(svg, x1, y1, x2, y2, id, styles) {
    x1 = x1 * 500;
    y1 = y1 * 500;
    x2 = x2 * 500;
    y2 = y2 * 500;
    x = (x1 + x2) / 2;
    y = (y1 + y2) / 2 + 40;
    //   if (si < ti) y = (y1 + y2) / 2 - 40;
    //   else y = (y1 + y2) / 2 + 40;

    var currentCurve = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'path'
    );
    var curve = 'M' + x1 + ' ' + y1 + ' Q ' + x + ' ' + y + ' ' + x2 + ' ' + y2;
    currentCurve.setAttribute('d', curve);
    currentCurve.setAttribute('stroke', 'black');
    currentCurve.setAttribute('fill', 'transparent');
    svg.append(currentCurve);
  };
};
