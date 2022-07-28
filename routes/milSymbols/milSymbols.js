const express = require('express');

const router = express.Router();
const milsymbol = require('milsymbol');
const svgEdit = require('./svgColorEditsLib');
require('./voaSymbols.colors');

function CreateSeparateIcons(symbol, fillColor, strokeColor) {
  let backgroundSvg;

  let backgroundSymbol;
  if (fillColor) {
    backgroundSymbol = new milsymbol.Symbol(symbol, {
      colorMode: 'Voa',
      fillOpacity: 1,
    });
  } else {
    backgroundSymbol = new milsymbol.Symbol(symbol, {
      fillOpacity: 1,
    });
  }

  backgroundSvg = backgroundSymbol.asSVG();

  if (fillColor) {
    backgroundSvg = svgEdit.overwriteFill(backgroundSvg, fillColor);
  }

  backgroundSvg = svgEdit.overwriteStroke(backgroundSvg, 'rgba(0,0,0,0)');

  const iconSymbol = new milsymbol.Symbol(symbol, {
    monoColor: strokeColor == null ? 'white' : strokeColor,
  });
  const iconSvg = iconSymbol.asSVG();

  return { iconSvg, backgroundSvg };
}

function CreateSingleIcon(symbol, fillColor, fillOpacity, strokeColor) {
  let resultSvg;

  if (fillColor) {
    const resultSymbol = new milsymbol.Symbol(symbol, {
      colorMode: 'Voa',
      fillOpacity: fillOpacity == null ? 1 : fillOpacity,
    });
    resultSvg = resultSymbol.asSVG();
    resultSvg = svgEdit.overwriteFill(resultSvg, fillColor);
  } else {
    const resultSymbol = new milsymbol.Symbol(symbol, {
      fillOpacity: fillOpacity == null ? 1 : fillOpacity,
    });
    resultSvg = resultSymbol.asSVG();
  }

  if (strokeColor) {
    resultSvg = svgEdit.overwriteStroke(resultSvg, strokeColor);
  }

  return resultSvg;
}

router.get('/:symbol', (req, res) => {
  const { symbol } = req.params;
  const { fillColor, fillOpacity, strokeColor } = req.query;

  let { separateFill } = req.query;

  let data;

  separateFill = separateFill === 'true';
  if (separateFill) {
    data = CreateSeparateIcons(symbol, fillColor, strokeColor);
  } else {
    data = CreateSingleIcon(symbol, fillColor, fillOpacity, strokeColor);
  }

  const response = {
    status: 200,
    statusText: 'OK',
    message: 'Symbol retrieved.',
    data,
  };
  res.status(200).json(response);
});

module.exports = router;
