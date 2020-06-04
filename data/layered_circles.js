var styles = {
  background: {
    color: 'rgb(255, 255, 0)',
  },
  node: {
    radius: 5,
    color: 'rgb(255, 0, 0)',
    label: {
      color: 'rgb(120, 0, 0)',
    },
  },
  edge: {
    width: 1,
    color: 'rgb(204, 204, 204)',
  },
  wideEdge: {
    width: 5,
    color: 'rgb(102,102,102)',
    arrow: {
      size: 20,
    },
  },
};

var nodes = [{ label: 'Hello' }, { label: 'World' }, { label: '!' }];

var e = { source: nodes[0], target: nodes[1] };
var e2 = { source: nodes[1], target: nodes[0] };
var e3 = { source: nodes[1], target: nodes[2] };
var e4 = { source: nodes[0], target: nodes[0], style: 'wideEdge' };

var edges = [
  e,
  e2,
  e3,
  e4,
  { source: nodes[2], target: e2 },
  { source: nodes[0], target: e3 },
  { source: e2, target: nodes[2] },
  { source: nodes[2], target: e4 },
  { source: e2, target: e2 },
  { source: e3, target: e3 },
  { source: e4, target: e4 },
];
