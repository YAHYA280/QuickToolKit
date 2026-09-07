import type { ToolDefinition } from "../types";

export const csvToJson: ToolDefinition = {
  slug: "csv-to-json",
  category: "developer",
  name: "CSV to JSON Converter",
  shortDescription: "CSV to JSON converter with delimiter detection, typed values and JSON to CSV.",
  keywords: [
    "csv to json",
    "csv to json converter",
    "convert csv to json",
    "json to csv",
    "json to csv converter",
    "csv to json online",
    "csv parser",
    "csv to json array",
    "semicolon csv to json",
    "excel csv to json",
    "tsv to json",
    "csv to json free",
  ],
  related: ["json-formatter", "text-diff", "base64"],
  icon: "csv",
  popular: true,
  content: {
    en: {
      title: "CSV to JSON Converter Online (and JSON to CSV)",
      description:
        "CSV to JSON converter that runs in your browser. Handles quoted fields, auto detects delimiters, types numbers, and converts JSON arrays back to CSV.",
      intro: [
        "This CSV to JSON converter turns a spreadsheet export into a JSON array in one paste, and turns a JSON array back into CSV that Excel, Google Sheets and pandas open cleanly. The parser follows RFC 4180, so quoted fields, doubled quotes and line breaks inside a cell are handled correctly instead of splitting a record in two. It auto detects comma, semicolon, tab and pipe delimiters, can convert numbers and booleans to real JSON types, and offers three output shapes: objects, arrays or keyed by the first column. It runs entirely in your browser, so your data never leaves your machine.",
        "Use it when an API expects JSON but the data lives in a spreadsheet, when you want to seed a database or a test fixture from a CSV report, or when you need to inspect an export from a European Excel that uses semicolons. The stats bar shows rows, columns and output size, and Download saves the result without a server round trip.",
        "Switch to JSON to CSV to go the other way. The converter collects the union of keys across every object so no column is lost, quotes fields that contain the delimiter, quotes or newlines, and writes nested objects as JSON strings.",
      ],
      howTo: [
        "Choose CSV to JSON or JSON to CSV at the top.",
        "Paste your data into the input box, or click Sample to load an example.",
        "Leave Delimiter on Auto detect, or pick one from the dropdown.",
        "Tick First row is header to use the first line as keys, and Convert numbers and booleans for typed output.",
        "Pick an Output shape: Array of objects, Array of arrays or Keyed by first column.",
        "Click Copy, or Download to save a .json or .csv file.",
      ],
      features: [
        "RFC 4180 parser: quoted fields, escaped quotes and multi line cells",
        "Auto detection of comma, semicolon, tab and pipe delimiters",
        "Optional conversion of numbers, booleans and empty cells",
        "Three output shapes: objects, arrays or keyed by first column",
        "JSON to CSV with header union and safe quoting",
        "Row, column and byte counts plus row numbered warnings",
        "Copy and Download buttons, no upload",
        "Handles CRLF and LF line endings and strips the UTF-8 BOM",
      ],
      faq: [
        {
          question: "How does the converter handle commas and quotes inside a field?",
          answer:
            "It follows RFC 4180. A field that contains the delimiter, a double quote or a line break must be wrapped in double quotes, and a literal double quote inside it is written as two double quotes. The parser reads a quoted field until the closing quote, so a comma inside the quotes stays part of the value and a newline stays inside the cell instead of starting a new record.",
        },
        {
          question: "Why does my CSV from Excel use semicolons instead of commas?",
          answer:
            "Excel writes CSV using the list separator of your Windows locale. In many European locales the decimal separator is a comma, so Excel switches the field separator to a semicolon to avoid ambiguity. Auto detect counts the candidate separators in the first line and picks the most common one; force semicolon from the Delimiter dropdown if it guesses wrong.",
        },
        {
          question: "What is the UTF-8 BOM and why does it appear in my first column name?",
          answer:
            "Some programs, Excel in particular, write three invisible bytes, EF BB BF, at the start of a UTF-8 file so other software knows the encoding. If a parser does not strip them, the first header becomes a garbled version of id. This converter removes the byte order mark automatically, and the CSV it downloads has no BOM, which suits most tools.",
        },
        {
          question: "Will numbers such as zip codes or phone numbers lose their leading zeros?",
          answer:
            "Only if you tick Convert numbers and booleans, and even then values with a leading zero, such as 00501, stay strings, because turning them into the number 501 would corrupt the data. Plain integers and decimals become JSON numbers, true and false become booleans, and empty cells become null. Untick the option to keep everything as strings.",
        },
        {
          question: "What happens when rows have different numbers of fields?",
          answer:
            "The converter still produces output. Short rows are padded with empty values, long rows get extra columns named column6, column7 and so on, and a warning under the input names the inconsistent row so you can fix the source. An unterminated quote is an error, because then the parser cannot know where the record ends.",
        },
        {
          question: "Which output shape should I choose?",
          answer:
            "Array of objects is the usual choice for APIs and JavaScript because each row becomes a self describing object. Array of arrays is smaller and keeps column order, which suits charting libraries and bulk inserts. Keyed by first column builds a lookup object, so if your first column is an id you can access a row directly by that id.",
        },
        {
          question: "How do I convert JSON back to CSV, including nested objects?",
          answer:
            "Switch to JSON to CSV and paste an array of objects. The header is the union of every key in the order they first appear, so objects with missing keys produce empty cells. Nested objects and arrays are written as JSON strings inside a quoted cell, which keeps the file valid CSV; if you need dotted column names, flatten the data first in your code.",
        },
      ],
    },
  },
};
