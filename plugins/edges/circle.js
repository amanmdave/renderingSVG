import geomutils from '../../../geomutils';

var generateCircle = function() {
  this.set = function(drawEntities, svg, styles) {
    let edges = drawEntities.circles;
    edges.map((edge, index) => {
      const source = geomutils.edgeSource(edge);
      const target = geomutils.edgeTarget(edge);
      const edgeShift = geomutils.getCurveShift(edge);

      let currentStyle = this.updateStyles(drawEntities, edge, target, styles);

      this.draw(
        svg,
        source.x,
        source.y,
        source.uniqid,
        target.x,
        target.y,
        target.uniqid,
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

    // extract the target node's style
    let targetNodeStyle;
    if (targetNode.style !== undefined)
      targetNodeStyle = styles[targetNode.style];
    else targetNodeStyle = styles.node;

    // extract the target edge's individualstyle if present
    let targetNodeRadius = targetNodeStyle.radius;
    if (edge.style !== undefined) currentStyle = styles[edge.style];
    else currentStyle = styles.edge;

    // update the current edge stlye
    currentStyle.targetNodeRadius = targetNodeRadius;

    return currentStyle;
  };

  // FUNCTION: Draws individual edges
  this.draw = function(svg, x1, y1, si, x2, y2, ti, id, styles) {
    x1 = x1 * 500;
    y1 = y1 * 500;
    x2 = x2 * 500;
    y2 = y2 * 500;

    let crx = x1 - 75;
    let clx = x2 + 75;
    let cy;

    // Checks the midpoint of the canvas, and draws circle depending upon
    // whether it is in top half (=> add 100 to draw circle bottom-down)
    // or bottom half (=> subtracts 100 to draw circle bottom-up)
    if (y1 < 250) cy = y1 + 75;
    else cy = y1 - 75;

    // EXTRA -> If circle cross the 500x500 canvas horizontally
    // ==> Checks if it crossing any horizontal boundries
    // if (x1 - 100 < 0) crx = 0;
    // else crx = x1 - 100;
    // if (x2 + 100 > 500) clx = 500;
    // else clx = x2 + 100;

    let curve =
      'M' +
      x1 +
      ',' +
      y1 +
      ' C' +
      crx +
      ',' +
      cy +
      ' ' +
      clx +
      ',' +
      cy +
      ' ' +
      x2 +
      ',' +
      y2;

    let currentCircle = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'path'
    );
    currentCircle.setAttribute('d', curve);
    currentCircle.setAttribute('stroke', styles.color || 'rgb(204, 204, 204)');
    currentCircle.setAttribute('stroke-width', styles.width || 1);
    currentCircle.setAttribute('fill', 'none');

    let defs = this.addArrowHead(currentCircle, styles, id);

    svg.append(defs);
    svg.append(currentCircle);
  };

  // FUNCTION: Adds the arrow at the end of the line
  this.addArrowHead = function(currentCurve, styles, id) {
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

    let arrowId = 'curveArrow' + id;

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
    currentCurve.setAttribute('marker-end', url);

    return defs;
  };

  //   this.curvePoint = function(x1, x2, y1, y2, dis) {
  //     // TODO: Try if the curvature can be defined from here
  //     let originalSlope = (y2 - y1) / (x2 - x1);
  //     let m;
  //     if (originalSlope === 0) m = Number.MAX_SAFE_INTEGER;
  //     else m = -1 / originalSlope;

  //     let x = (x1 + x2) / 2;
  //     let y = (y1 + y2) / 2;

  //     let dx = x2 - x1;
  //     let dy = y2 - y1;

  //     let cx = -dy;
  //     let cy = dx;

  //     cx = x + cx;
  //     cy = y + cy;

  //     // if (m === 0) {
  //     //   cx = x + dis;
  //     //   cy = y;
  //     // } else if (m === Number.MAX_SAFE_INTEGER) {
  //     //   cx = x;
  //     //   cy = y + dis;
  //     // } else {
  //     //   let dx = dis / Math.sqrt(1 + m * m);
  //     //   let dy = m * dx;
  //     //   cx = x + dx;
  //     //   cy = y + dy;
  //     // }

  //     return { cx, cy };
  //   };
};

export { generateCircle };
