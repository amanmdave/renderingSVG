import geomutils from '../../../geomutils';

var generateLine = function() {
  this.set = function(drawEntities, svg, styles) {
    let edges = drawEntities.lines;

    edges.map((edge, index) => {
      const source = geomutils.edgeSource(edge);
      const target = geomutils.edgeTarget(edge);

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
        target.x,
        target.y,
        edge.uniqid,
        currentStyle
      );
    });
  };
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

    let defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    let marker = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'marker'
    );

    // console.log(styles);
    // <path d="M0,0 L0,{{arrow.sizeY}} L{{arrow.sizeX}},{{arrow.sizeY / 2}} z" fill="#000" />
    let arrowSize = 10;
    if (styles.arrow && styles.arrow.size) arrowSize = styles.arrow.size;
    let d =
      'M0,0 L0,' + arrowSize + 'L' + arrowSize + ',' + arrowSize / 2 + ' z';
    path.setAttribute('d', d);
    path.setAttribute('fill', styles.color || 'rgb(204, 204, 204)');

    let arrowId = 'lineArrow' + id;
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
    currentEdge.setAttribute('marker-end', url);

    svg.append(defs);
    svg.append(currentEdge);
  };
};

export { generateLine };
