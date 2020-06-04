import geomutils from '../../../geomutils';

var generateLine = function() {
  this.set = function(drawEntities, svg, styles) {
    let edges = drawEntities.lines;

    edges.map((edge, index) => {
      const source = geomutils.edgeSource(edge);
      const target = geomutils.edgeTarget(edge);

      let currentStyle = this.updateStyles(drawEntities, edge, target, styles);

      this.draw(
        svg,
        source.x,
        source.y,
        target.x,
        target.y,
        edge.uniqid,
        currentStyle
      );
    });
  };

  // FUNCTION: Updates the edge styles with target node radius, which will help in position of the arrow head
  this.updateStyles = function(drawEntities, edge, target, styles) {
    let currentStyle;

    // get the target node
    const targetNode = drawEntities.nodes.find(node => {
      return node.uniqid == target.uniqid;
    });

    // extract the target edge's individualstyle if present
    let targetNodeStyle;
    if (targetNode && targetNode.style !== undefined)
      targetNodeStyle = styles[targetNode.style];
    else targetNodeStyle = styles.node;

    // extract the node's radius
    let targetNodeRadius = targetNodeStyle.radius;
    if (edge.style !== undefined) currentStyle = styles[edge.style];
    else currentStyle = styles.edge;

    // update the current edge stlye
    currentStyle.targetNodeRadius = targetNodeRadius;

    return currentStyle;
  };

  // FUNCTION: Draws individual edges
  this.draw = function(svg, x1, y1, x2, y2, id, styles) {
    x1 = x1 * 500;
    y1 = y1 * 500;
    x2 = x2 * 500;
    y2 = y2 * 500;

    let currentEdge = document.createElementNS(
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

    let defs = this.addArrowHead(currentEdge, styles, id);

    svg.append(defs);
    svg.append(currentEdge);
  };

  // FUNCTION: Adds the arrow at the end of the line
  this.addArrowHead = function(currentEdge, styles, id) {
    // declare variables
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const marker = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'marker'
    );
    // setting arrowsize
    let arrowSize = 10;
    if (styles.arrow && styles.arrow.size) arrowSize = styles.arrow.size;
    let d =
      'M0,0 L0,' + arrowSize + 'L' + arrowSize + ',' + arrowSize / 2 + ' z';
    path.setAttribute('d', d);
    path.setAttribute('fill', styles.color || 'rgb(204, 204, 204)');

    const arrowId = 'lineArrow' + id;

    // adding marker-head attributes
    marker.setAttribute('markerWidth', arrowSize);
    marker.setAttribute('markerHeight', arrowSize);
    marker.setAttribute('id', arrowId);
    marker.setAttribute(
      'refX',
      arrowSize - arrowSize / 6 + styles.targetNodeRadius
    ); // TODO: this is trial and error and needs to be redefined
    marker.setAttribute('refY', arrowSize / 2);
    marker.setAttribute('orient', 'auto');
    marker.setAttribute('markerUnits', 'userSpaceOnUse');

    // adding elements to svg
    marker.appendChild(path);
    defs.appendChild(marker);
    const url = 'url(#' + arrowId + ')';
    currentEdge.setAttribute('marker-end', url);

    return defs;
  };
};

export { generateLine };
