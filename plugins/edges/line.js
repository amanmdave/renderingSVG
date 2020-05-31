var generateLine = function() {
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

    var currentEdge = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'line'
    );

    currentEdge.setAttribute('id', id);
    currentEdge.setAttribute('x1', x1);
    currentEdge.setAttribute('y1', y1);
    currentEdge.setAttribute('x2', x2);
    currentEdge.setAttribute('y2', y2);
    currentEdge.setAttribute('stroke', styles.color || 'rgb(204, 204, 204)');
    currentEdge.setAttribute('stroke-width', styles.width || 1);

    svg.append(currentEdge);
  };
};
