var generateNode = function() {
  this.set = function(nodes, svg, styles) {
    nodes.map((node, index) => {
      this.draw(svg, node.x, node.y, node.uniqid, styles);
    });
  };

  this.draw = function(svg, x, y, id, styles) {
    x = x * 500;
    y = y * 500;
    var svgNS = 'http://www.w3.org/2000/svg';
    var currentNode = document.createElementNS(svgNS, 'circle');
    currentNode.setAttributeNS(null, 'id', id);
    currentNode.setAttributeNS(null, 'cx', x);
    currentNode.setAttributeNS(null, 'cy', y);
    currentNode.setAttributeNS(null, 'r', styles.radius || 5);
    currentNode.setAttributeNS(null, 'fill', styles.color || 'black');
    currentNode.setAttributeNS(null, 'stroke', 'none');
    svg.appendChild(currentNode);
  };
};
