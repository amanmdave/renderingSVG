var generateLabel = function() {
  this.set = function(nodes, svg, styles) {
    nodes.map((node, index) => {
      this.draw(svg, node.x, node.y, node.uniqid, styles);
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
