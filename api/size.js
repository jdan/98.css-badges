const fetch = require("node-fetch");
const filesize = require("filesize");
const gzipSize = require("gzip-size");
const path = require("path");
const TextToSVG = require("text-to-svg");
const zlib = require("zlib");

module.exports = async (req, res) => {
  const css = await fetch("https://unpkg.com/98.css").then((res) => res.text());

  res.setHeader("Content-Type", "image/svg+xml");
  const textToSVG = TextToSVG.loadSync(
    path.join(__dirname, "../fonts/src/ms-sans-serif/MS Sans Serif.ttf")
  );
  const options = {
    fontSize: 11,
    anchor: "top",
    attributes: { fill: "black" },
  };

  const size = filesize(gzipSize.sync(css));

  const metrics = textToSVG.getMetrics(size, options);
  const width = metrics.width - 1;

  const x = 38;
  const y = 9;
  const sizeD = textToSVG.getD(size, { ...options, x, y });

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
    <path d="${sizeD}" fill="black"/>
    <path d="M4 4H31V25H4V4Z" fill="#C0C0C0"/>
    <rect x="4" y="4" width="1" height="20" fill="#808080"/>
    <rect x="5" y="4" width="25" height="1" fill="#808080"/>
    <rect x="4" y="24" width="27" height="1" fill="white"/>
    <rect x="30" y="4" width="1" height="20" fill="white"/>
    <path d="M8 20.998V19.999H11.9988V20.998H8ZM8 18.001V14.0022H8.99902V18.001H8ZM11.9988 19.999V19H8.99902V18.001H11.9988V14.0022H8.99902V13.0005H12.9978V19.999H11.9988ZM14.0049 19V17.002H15.0039V18.001H18.0037V19H14.0049ZM15.0039 17.002V16.0002H16.0029V17.002H15.0039ZM16.0029 16.0002V15.0012H17.0046V16.0002H16.0029ZM17.0046 15.0012V14.0022H14.0049V13.0005H18.0037V15.0012H17.0046ZM19 19V13.0005H19.999V19H19ZM19 11.0024V10.0007H19.999V11.0024H19ZM24.9968 18.001V14.0022H25.9958V18.001H24.9968ZM20.998 20.998V13.0005H24.9968V14.0022H21.9971V18.001H24.9968V19H21.9971V20.998H20.998Z" fill="black"/>
    </svg>
  `);
};
