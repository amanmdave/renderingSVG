var generateNode = function() {
  this.set = function(drawEntities, svg, styles) {
    let nodes = drawEntities.nodes;
    nodes.map((node, index) => {
      let currentStyle = this.updateStyles(node, styles);

      this.draw(svg, node.x, node.y, node.uniqid, currentStyle);
    });
  };

  // FUNCTION: checks if the node has individual styles
  this.updateStyles = function(node, styles) {
    let currentStyle;
    if (node.style !== undefined) currentStyle = styles[node.style];
    else currentStyle = styles.node;

    return currentStyle;
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

export { generateNode };
