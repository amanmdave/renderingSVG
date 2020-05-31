var svgRenderer = function(svg) {
  this.draw = function(svg, nodes, edges, styles) {
    generateLine = new generateCurve();
    generateLine.set(edges, svg, styles.edge);

    generateNode = new generateNode();
    generateNode.set(nodes, svg, styles.node);

    generateLabel = new generateLabel();
    generateLabel.set(nodes, svg, styles.node);
  };
};
