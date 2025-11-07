export const CONTRACT_TEMPLATE_PDF = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * {
      box-sizing: border-box;
    }
    body {
      font-family: 'Times New Roman', serif;
      font-size: 10pt;
      line-height: 1.4;
      margin: 0;
      padding: 20px;
      color: #000;
      background: #fff;
    }
    h1 {
      text-align: center;
      font-size: 14pt;
      font-weight: bold;
      margin: 20px 0;
      text-transform: uppercase;
      page-break-after: avoid;
      break-after: avoid;
      letter-spacing: 0.5px;
      border-bottom: 3px double #000;
      padding-bottom: 10px;
      color: #000;
    }
    h2 {
      font-size: 11pt;
      font-weight: bold;
      margin: 16px 0 10px 0;
      page-break-after: avoid;
      break-after: avoid;
      padding: 8px 12px;
      background: linear-gradient(to right, #f8f8f8 0%, #fff 100%);
      border-left: 4px solid #333;
      color: #000;
    }
    .contract-header {
      page-break-after: always;
      break-after: page;
    }
    .articles-section {
      page-break-after: avoid;
      break-after: avoid;
    }
    .article-8 {
      page-break-before: always;
      break-before: page;
      margin-top: 40px;
      padding-top: 20px;
    }
    p {
      text-align: justify;
      margin: 6px 0;
      word-wrap: break-word;
      overflow-wrap: break-word;
    }
    p strong {
      color: #222;
      font-weight: bold;
    }
    .header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;
      font-size: 10pt;
    }
    .signatures {
      display: flex;
      justify-content: space-between;
      margin-top: 30px;
      gap: 20px;
      page-break-inside: avoid;
      break-inside: avoid;
      padding: 20px;
      background: #fafafa;
      border: 1px solid #ddd;
      border-radius: 8px;
    }
    .mini-signatures {
      display: flex;
      justify-content: space-between;
      margin-top: 40px;
      gap: 30px;
      font-size: 9pt;
    }
    .mini-signature {
      text-align: center;
    }
    .mini-signature-line {
      border-bottom: 1px solid #000;
      width: 150px;
      min-height: 30px;
      margin: 5px auto;
      display: flex;
      align-items: flex-end;
      justify-content: center;
    }
    .mini-signature-image {
      max-width: 140px;
      max-height: 25px;
      object-fit: contain;
    }
    .signature-block {
      flex: 1;
      font-size: 9pt;
      min-width: 0;
      padding: 10px;
      background: #fff;
      border-radius: 4px;
    }
    .signature-block p {
      margin: 3px 0;
      text-align: left;
      word-wrap: break-word;
      overflow-wrap: break-word;
      font-size: 8pt;
    }
    .signature-line {
      border-bottom: 2px solid #000;
      margin: 15px 0 5px 0;
      min-height: 50px;
      display: flex;
      align-items: flex-end;
      justify-content: center;
    }
    .signature-image {
      max-width: 180px;
      max-height: 45px;
      object-fit: contain;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
      font-size: 9pt;
      table-layout: fixed;
      page-break-inside: auto;
    }
    table tr {
      page-break-inside: avoid;
      break-inside: avoid;
    }
    table td, table th {
      border: 1px solid #000;
      padding: 6px;
      text-align: left;
      word-wrap: break-word;
      overflow-wrap: break-word;
      hyphens: auto;
    }
    table th {
      font-weight: bold;
      background: #f5f5f5;
      color: #000;
    }
    .appendix {
      margin-top: 40px;
      padding-top: 30px;
      page-break-before: always;
      break-before: page;
    }
    .cover-image {
      max-width: 250px;
      max-height: 250px;
      margin: 15px auto;
      display: block;
      border: 1px solid #ddd;
      object-fit: contain;
    }
    i {
      color: #666;
      font-style: italic;
    }
  </style>
</head>
<body>
{{CONTENT}}
</body>
</html>
`;
