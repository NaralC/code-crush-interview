const someJSCodeExample = `
  console.log('This is JS');
`;

const someCSSCodeExample = `
  * {
    margin: 0;
  }
`;

const someHTMLCodeExample = `
  <!DOCTYPE html>
  <html lang="en">
  </html>
`;

type CodeState = {
  [fileName: string]: {
    name: string;
    language: string;
    value: string;
  };
};

const files: CodeState = {
  "script.js": {
    name: "script.js",
    language: "javascript",
    value: someJSCodeExample
  },
  "style.css": {
    name: "style.css",
    language: "css",
    value: someCSSCodeExample
  },
  "index.html": {
    name: "index.html",
    language: "html",
    value: someHTMLCodeExample
  }
};

export default files;
