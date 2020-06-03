import { generateCurve } from './plugins/edges/curve';
import { generateLine } from './plugins/edges/line';
import { generateNode } from './plugins/nodes/index';
import { generateLabel } from './plugins/labels/index';

var svgRenderer = function() {
  this.draw = function(drawEntities, svg, styles) {
    console.log(drawEntities);
    let generateLin = new generateLine();
    generateLin.set(drawEntities, svg, styles);

    let generateCur = new generateCurve();
    generateCur.set(drawEntities, svg, styles);

    let generateNod = new generateNode();
    generateNod.set(drawEntities, svg, styles);

    let generateLab = new generateLabel();
    generateLab.set(drawEntities, svg, styles);
  };
};

export { svgRenderer };
