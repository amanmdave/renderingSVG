import geomutils from '../../../geomutils';

var generateCircle = function() {
  this.set = function(drawEntities, svg, styles) {
    let edges = drawEntities.circles;
    edges.map((edge, index) => {
      //   const edgeShift = geomutils.getCurveShift(edge);
      //   const source = geomutils.edgeSource(edge);
      const target = geomutils.edgeTarget(edge);
      console.log(target);

      let currentStyle = this.updateStyles(drawEntities, edge, target, styles);

      this.draw(svg, target.x, target.y, edge, currentStyle);
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

    if (targetNode && targetNode.style !== undefined)
      targetNodeStyle = styles[targetNode.style];
    else targetNodeStyle = styles.node;

    // extract the target edge's individualstyle if present
    let targetNodeRadius = targetNodeStyle.radius;
    if (edge.style !== undefined) currentStyle = styles[edge.style];
    else currentStyle = styles.edge;

    // update the current edge stlye
    if (target.index === undefined) currentStyle.targetNodeRadius = 1;
    else currentStyle.targetNodeRadius = targetNodeRadius;

    // console.log(currentStyle);
    return currentStyle;
  };

  // FUNCTION: Draws individual edges
  this.draw = function(svg, x, y, edge, styles) {
    x = x * 500;
    y = y * 500;
    let crx = x - 75;
    let clx = x + 75;
    let cy;

    // Checks the midpoint of the canvas, and draws circle depending upon
    // whether it is in top half (=> add 100 to draw circle bottom-down)
    // or bottom half (=> subtracts 100 to draw circle bottom-up)
    if (y < 250) cy = y + 75;
    else cy = y - 75;

    let bP = this.getCurveBoundary(x, y, clx, cy, crx, cy, x, y);
    // console.log(bP);

    // EXTRA -> If circle cross the 500x500 canvas horizontally
    // ==> Checks if it crossing any horizontal boundries
    // if (x1 - 100 < 0) crx = 0;
    // else crx = x1 - 100;
    // if (x2 + 100 > 500) clx = 500;
    // else clx = x2 + 100;
    if (edge.weight !== undefined) {
      y = y + bP.height;
      if (y < 250) cy = y + 75;
      else cy = y - 75;
    }

    let curve =
      'M' +
      x +
      ',' +
      y +
      ' C' +
      crx +
      ',' +
      cy +
      ' ' +
      clx +
      ',' +
      cy +
      ' ' +
      x +
      ',' +
      y;

    let currentCircle = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'path'
    );
    currentCircle.setAttribute('d', curve);
    currentCircle.setAttribute('stroke', styles.color || 'rgb(204, 204, 204)');
    currentCircle.setAttribute('stroke-width', styles.width || 1);
    currentCircle.setAttribute('fill', 'none');

    let defs = this.addArrowHead(currentCircle, styles, edge.uniqid);

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
  this.getCurveBoundary = function(ax, ay, bx, by, cx, cy, dx, dy) {
    var tobx = bx - ax;
    var toby = by - ay;
    var tocx = cx - bx;
    var tocy = cy - by;
    var todx = dx - cx;
    var tody = dy - cy;
    var step = 1 / 40; // precission
    var d,
      px,
      py,
      qx,
      qy,
      rx,
      ry,
      tx,
      ty,
      sx,
      sy,
      x,
      y,
      i,
      minx,
      miny,
      maxx,
      maxy;
    function min(num1, num2) {
      if (num1 > num2) return num2;
      if (num1 < num2) return num1;
      return num1;
    }
    function max(num1, num2) {
      if (num1 > num2) return num1;
      if (num1 < num2) return num2;
      return num1;
    }
    for (var i = 0; i < 41; i++) {
      d = i * step;
      px = ax + d * tobx;
      py = ay + d * toby;
      qx = bx + d * tocx;
      qy = by + d * tocy;
      rx = cx + d * todx;
      ry = cy + d * tody;
      let toqx = qx - px;
      let toqy = qy - py;
      let torx = rx - qx;
      let tory = ry - qy;

      sx = px + d * toqx;
      sy = py + d * toqy;
      tx = qx + d * torx;
      ty = qy + d * tory;
      let totx = tx - sx;
      let toty = ty - sy;

      x = sx + d * totx;
      y = sy + d * toty;
      if (i == 0) {
        minx = x;
        miny = y;
        maxx = x;
        maxy = y;
      } else {
        minx = min(minx, x);
        miny = min(miny, y);
        maxx = max(maxx, x);
        maxy = max(maxy, y);
      }
    }
    return {
      x: Math.round(minx),
      y: Math.round(miny),
      width: Math.round(maxx - minx),
      height: Math.round(maxy - miny),
    };
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
