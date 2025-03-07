# `pdf-button` Web Component

`pdf-button` is a custom web component built with LitElement that allows users to upload PDF files. It provides a button that, when clicked, opens a file input dialog for selecting PDF files. The component can handle multiple file uploads and send the parsed content to a specified host URL.

## Attributes

- `label` (String): The text displayed on the button. Default is "Upload your CV".
- `multiple` (Boolean): If true, allows multiple file selection. Default is false.
- `hostUrl` (String): The URL to which the parsed PDF content will be sent via a POST request.

## Events

- `parse:pdf`: Fired when the PDF files are parsed. The event detail contains the parsed PDF content.
- `parse:ai`: Fired when the parsed PDF content is sent to the host URL and a response is received. The event detail contains the response JSON.

## Methods

- `CVTextToJSON(content: ParsedPDF[])`: Sends the parsed PDF content to the specified host URL and dispatches the `parse:ai` event with the response.

## Usage

To use this component, you need to register it and then include it in your HTML.

### Registering the Component

```javascript
import { register } from "./path/to/component";
register("pdf-button"); // 'pdf-button' is the custom element name
```

### Listening to Events

```html
<pdf-button
  id="pdfButton"
  label="Upload PDF"
  multiple
  hostUrl="https://example.com/upload"
></pdf-button>
<script>
  const pdfButton = document.getElementById("pdfButton");
  pdfButton.addEventListener("parse:pdf", (event) => {
    console.log("Parsed PDF content:", event.detail);
  });
  pdfButton.addEventListener("parse:ai", (event) => {
    console.log("AI parse result:", event.detail);
  });
</script>
```
