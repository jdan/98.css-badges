const path = require("path");
const TextToSVG = require("text-to-svg");

module.exports = async (req, res) => {
  const { version } = require("../node_modules/98.css/package.json");

  res.setHeader("Content-Type", "image/svg+xml");
  const textToSVG = TextToSVG.loadSync(
    path.join(__dirname, "../fonts/src/ms-sans-serif/MS Sans Serif.ttf")
  );
  const options = {
    fontSize: 11,
    anchor: "top",
    attributes: { fill: "black" },
  };

  const text = `v${version}`;

  const metrics = textToSVG.getMetrics(text, options);
  const width = metrics.width - 1;

  const x = 38;
  const y = 9;
  const versionD = textToSVG.getD(text, { ...options, x, y });

  /**
   * The following is hacked together based on a small SVG exported from
   * figma. I put a single "l" in place of the size, then replaced it with
   * the result of textSVG and adding `width` to various borders.
   *
   * We should hand-draw this with `rect`s from scratch.
   */
  res.send(`
    <svg width="${48 + width}" height="29" viewBox="0 0 ${
    48 + width
  } 29" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 0H${48 + width}V29H0V0Z" fill="#C0C0C0"/>
    <rect width="1" height="28" fill="#DFDFDF"/>
    <rect x="1" width="${46 + width}" height="1" fill="#DFDFDF"/>
    <rect y="28" width="${48 + width}" height="1" fill="black"/>
    <rect x="${47 + width}" width="1" height="28" fill="black"/>
    <rect x="1" y="1" width="${45 + width}" height="1" fill="white"/>
    <rect x="1" y="2" width="1" height="25" fill="white"/>
    <rect x="${46 + width}" y="1" width="1" height="27" fill="#808080"/>
    <rect x="1" y="27" width="${45 + width}" height="1" fill="#808080"/>
    <path d="M33 4H44V25H33V4Z" fill="#C0C0C0"/>
    <rect x="33" y="4" width="1" height="20" fill="#808080"/>
    <rect x="34" y="4" width="${9 + width}" height="1" fill="#808080"/>
    <rect x="33" y="24" width="${11 + width}" height="1" fill="white"/>
    <rect x="${43 + width}" y="4" width="1" height="20" fill="white"/>
    <path d="${versionD}" fill="black"/>
    <path d="M4 4H31V25H4V4Z" fill="#C0C0C0"/>
    <rect x="4" y="4" width="1" height="20" fill="#808080"/>
    <rect x="5" y="4" width="25" height="1" fill="#808080"/>
    <rect x="4" y="24" width="27" height="1" fill="white"/>
    <rect x="30" y="4" width="1" height="20" fill="white"/>
    <path d="M11.9988 19V14.0022H12.9978V19H11.9988ZM8 19V13.0005H8.99902V14.0022H9.99805V15.0012H8.99902V19H8ZM9.99805 14.0022V13.0005H11.9988V14.0022H9.99805ZM18.0037 18.001V14.0022H19.0027V18.001H18.0037ZM14.0049 20.998V13.0005H18.0037V14.0022H15.0039V18.001H18.0037V19H15.0039V20.998H14.0049ZM23.0095 19V14.0022H24.0085V19H23.0095ZM26.0093 19V14.0022H27.0083V19H26.0093ZM20.0098 19V13.0005H23.0095V14.0022H21.0088V19H20.0098ZM24.0085 14.0022V13.0005H26.0093V14.0022H24.0085Z" fill="black"/>
    </svg>
  `);
};
