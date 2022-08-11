import { readFileSync } from "fs";
import { marked } from "marked";
import { sanitizeHtml } from "./sanitizer";
import { ParsedRequest } from "./types";
const twemoji = require("twemoji");
const twOptions = { folder: "svg", ext: ".svg" };
const emojify = (text: string) => twemoji.parse(text, twOptions);

const rglr = readFileSync(
  `${__dirname}/../_fonts/Inter-Regular.woff2`
).toString("base64");
const bold = readFileSync(`${__dirname}/../_fonts/Inter-Bold.woff2`).toString(
  "base64"
);
const mono = readFileSync(`${__dirname}/../_fonts/Vera-Mono.woff2`).toString(
  "base64"
);

function getCss(theme: string, fontSize: string) {
  let background = "white";
  let foreground = "black";
  let radial = "lightgray";

  if (theme === "dark") {
    background = "black";
    foreground = "white";
    radial = "dimgray";
  }
  return `
    @font-face {
        font-family: 'Inter';
        font-style:  normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${rglr}) format('woff2');
    }

    @font-face {
        font-family: 'Inter';
        font-style:  normal;
        font-weight: bold;
        src: url(data:font/woff2;charset=utf-8;base64,${bold}) format('woff2');
    }

    @font-face {
        font-family: 'Vera';
        font-style: normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${mono})  format("woff2");
      }

      body {
        background: #fafafa;
        width: 100vw;
        height: 100vh;
        padding: 0;
        margin: 0;
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
      }
      
      .App {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin: 3rem;
      }
      
      .heading {
        font-family: "Inter", sans-serif;
        font-size: 72px;
        letter-spacing: -2.88px;
        font-style: normal;
        font-weight: bold;
        color: var(--foreground);
        line-height: 1.2;
        opacity: 0.8;
        display: -webkit-box;
        -webkit-line-clamp: 4;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      
      .detailsWrapper {
        display: flex;
        gap: 4px;
        opacity: 0.4;
      }
      
      .date {
        font-family: "Inter", sans-serif;
        font-size: 32px;
      }
      
      .readingTime {
        font-size: 32px;
        font-style: italic;
        font-family: Charter, Garamond, serif;
      }
      
      .footer {
        position: absolute;
        bottom: 3rem;
        left: 3rem;
        right: 3rem;
        font-family: "Inter", sans-serif;
        font-size: 32px;
        text-align: right;
        padding-top: 2rem;
        border-top: 1px solid rgba(0, 0, 0, 0.6);
        opacity: 0.4;
      }`;
}

export function getHtml(parsedReq: ParsedRequest) {
  const {
    text,
    theme,
    md,
    fontSize,
    images,
    widths,
    heights,
    tag,
    readingTime,
    date
  } = parsedReq;
  return `<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        ${getCss(theme, fontSize)}
    </style>
    <body>
        <div class="App">
            <div class="heading">${emojify(
              md ? marked(text) : sanitizeHtml(text)
            )}
            </div>
            <div class="detailsWrapper">
        <span class="date">${date}</span>
        <span class="readingTime">${readingTime}</span>
      </div>
      <div class="footer">tomfejer.com/${tag}</div>
        </div>
    </body>
</html>`;
}

function getImage(src: string, width = "auto", height = "225") {
  return `<img
        class="logo"
        alt="Generated Image"
        src="${sanitizeHtml(src)}"
        width="${sanitizeHtml(width)}"
        height="${sanitizeHtml(height)}"
    />`;
}

function getPlusSign(i: number) {
  return i === 0 ? "" : '<div class="plus">+</div>';
}
