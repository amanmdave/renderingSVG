import geomutils from '../../../geomutils';

var generateCurve = function() {
  this.set = function(drawEntities, svg, styles) {
    console.log(drawEntities);
    let edges = drawEntities.curves;
    edges.map((edge, index) => {
      const source = geomutils.edgeSource(edge);
      const target = geomutils.edgeTarget(edge);
      const edgeShift = geomutils.getCurveShift(edge);
      const arrowShift = drawEntities.nodes.find(node => {
        return node.uniqid == target.uniqid;
      });

      let nodeStyle;
      if (arrowShift.style !== undefined) nodeStyle = styles[arrowShift.style];
      else nodeStyle = styles.node;
      let nodeRadius = nodeStyle.radius;

      let currentStyle;
      if (edge.style !== undefined) currentStyle = styles[edge.style];
      else currentStyle = styles.edge;
      currentStyle.nodeRadius = nodeRadius;
      //   console.log(currentStyle);

      this.draw(
        svg,
        source.x,
        source.y,
        source.uniqid,
        target.x,
        target.y,
        target.uniqid,
        edgeShift.x,
        edgeShift.y,
        edge.uniqid,
        currentStyle
      );
    });
  };
  this.draw = function(svg, x1, y1, si, x2, y2, ti, ex, ey, id, styles) {
    // console.log(styles);
    x1 = x1 * 500;
    y1 = y1 * 500;
    x2 = x2 * 500;
    y2 = y2 * 500;
    ex = ex * 500;
    ey = ey * 500;
    let x = (x1 + x2) / 2;
    let y;
    if (si < ti) y = (y1 + y2) / 2 - 40;
    else y = (y1 + y2) / 2 + 40;

    let dis;
    if (si < ti) dis = -40;
    else dis = 40;

    // let roundness = this.curvePoint(x1, x2, y1, y1, dis);
    // console.log(this.curvePoint(x1, x2, y1, y2, dis));
    // console.log(x, y);
    let currentCurve = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'path'
    );
    let curve = 'M' + x1 + ' ' + y1 + ' Q ' + x + ' ' + y + ' ' + x2 + ' ' + y2;
    // var curve =
    //   'M' + x1 + ' ' + y1 + ' Q ' + ex + ' ' + ey + ' ' + x2 + ' ' + y2;
    currentCurve.setAttribute('d', curve);
    currentCurve.setAttribute('stroke', styles.color || 'rgb(204, 204, 204)');
    currentCurve.setAttribute('stroke-width', styles.width || 1);
    currentCurve.setAttribute('fill', 'none');

    let defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    let marker = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'marker'
    );
    let arrowSize = 10;
    if (styles.arrow && styles.arrow.size) arrowSize = styles.arrow.size;
    let d =
      'M0,0 L0,' + arrowSize + 'L' + arrowSize + ',' + arrowSize / 2 + ' z';
    path.setAttribute('d', d);
    path.setAttribute('fill', styles.color || 'rgb(204, 204, 204)');

    let arrowId = 'curveArrow' + id;
    marker.setAttribute('markerWidth', arrowSize);
    marker.setAttribute('markerHeight', arrowSize);
    marker.setAttribute('id', arrowId);
    marker.setAttribute('refX', arrowSize - arrowSize / 6 + styles.nodeRadius);
    marker.setAttribute('refY', arrowSize / 2);
    marker.setAttribute('orient', 'auto');
    marker.setAttribute('markerUnits', 'userSpaceOnUse');

    marker.appendChild(path);
    defs.appendChild(marker);
    let url = 'url(#' + arrowId + ')';
    currentCurve.setAttribute('marker-end', url);

    svg.append(defs);
    svg.append(currentCurve);
  };

  this.curvePoint = function(x1, x2, y1, y2, dis) {
    let originalSlope = (y2 - y1) / (x2 - x1);
    let m;
    if (originalSlope === 0) m = Number.MAX_SAFE_INTEGER;
    else m = -1 / originalSlope;

    let x = (x1 + x2) / 2;
    let y = (y1 + y2) / 2;

    let cx;
    let cy;

    if (m === 0) {
      cx = x + dis;
      cy = y;
    } else if (m === Number.MAX_SAFE_INTEGER) {
      cx = x;
      cy = y + dis;
    } else {
      let dx = dis / Math.sqrt(1 + m * m);
      let dy = m * dx;
      cx = x + dx;
      cy = y + dy;
    }

    return { cx, cy };
  };
};

export { generateCurve };
