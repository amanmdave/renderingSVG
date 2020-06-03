var generateLabel = function() {
  this.set = function(drawEntities, svg, styles) {
    let nodes = drawEntities.nodes;
    nodes.map((node, index) => {
      let currentStyle;
      if (node.style !== undefined) currentStyle = styles[node.style];
      else currentStyle = styles.node;
      this.draw(svg, node.x, node.y, node.uniqid, currentStyle);
    });
  };

  this.draw = function(svg, x, y, label, styles) {
    x = x * 500;
    y = y * 500;
    var currentLabel = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'text'
    );
    currentLabel.setAttributeNS(null, 'x', x + 5);
    currentLabel.setAttributeNS(null, 'y', y - 2);
    currentLabel.setAttributeNS(null, 'fill', styles.color || 'black');
    var txt = document.createTextNode(label);
    currentLabel.appendChild(txt);
    svg.appendChild(currentLabel);
  };
};

export { generateLabel };
