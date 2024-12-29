# Database Diagram Generator

A web-based tool that generates Entity-Relationship Diagrams (ERD) and documentation from natural language descriptions using OpenAI's GPT-4 model and Mermaid.js.

## Features

- 🎨 Generate ERD diagrams from text descriptions
- 📝 Create detailed database documentation
- 💾 Download diagrams as PNG files
- 📋 Copy documentation as Markdown
- 🌙 Dark mode support
- 📱 Responsive design
- 🔒 Secure API key handling

## Getting Started

### Prerequisites

- OpenAI API key with GPT-4 access
- Modern web browser
- Internet connection

### Installation

1. Access the project directly via GitHub Pages:

   Open your web browser and go to [soivigol.github.io/bd-diagram](https://soivigol.github.io/bd-diagram).

2. Alternatively, clone the repository and run it locally:

   ```
   git clone https://github.com/soivigol/bd-diagram.git
   ```

   Open `index.html` in your web browser or serve it using a local server.

### Usage

1. **Set up API Key**
   - Click "Save API Key"
   - Enter your OpenAI API key
   - The key will be stored securely in your browser's local storage

2. **Generate a Diagram**
   - Enter a natural language description of your database in the text area
   - Click "Generate Diagram"
   - The tool will create both a visual ERD and detailed documentation

3. **Export Options**
   - Click "Download Diagram" to save the ERD as a PNG file
   - Click "Copy as Markdown" to copy the documentation in Markdown format

### Example Description

```
Users
Stores user account information

Attributes

- id: int
- email: string
- password: string
```

## Technical Details

### Technologies Used

- **Frontend**
  - HTML5
  - CSS3 (with CSS Variables)
  - JavaScript (ES6+)
  - [Mermaid.js](https://mermaid-js.github.io/) for diagram rendering

- **APIs**
  - OpenAI GPT-4 for natural language processing
  - HTML5 Canvas API for PNG export
  - Clipboard API for copying content

### File Structure

### Key Components

1. **Diagram Generation**
   - Uses OpenAI's GPT-4 to parse natural language
   - Generates Mermaid.js ERD syntax
   - Creates detailed HTML/Markdown documentation

2. **Export Features**
   - PNG export using Canvas API
   - Markdown conversion for documentation
   - Clipboard integration

3. **Responsive Design**
   - Mobile-first approach
   - Flexible grid layout
   - Adaptive UI elements

## Customization

### Styling

The application uses CSS variables for easy theming:

```css
:root {
    --primary-color: #2563eb;
    --primary-hover: #1d4ed8;
    --bg-color: #f8fafc;
    --text-color: #1e293b;
    --border-color: #e2e8f0;
}
```

### Mermaid Configuration

Diagram rendering can be customized through Mermaid initialization:

```javascript
mermaid.initialize({ 
    startOnLoad: true,
    er: {
        useMaxWidth: true,
        attributeBackground: '#fafafa',
        fontSize: 14,
        padding: 8,
        wrap: true
    }
});
```

## Security Considerations

- API keys are stored in localStorage
- No server-side storage of sensitive data
- Direct communication with OpenAI API
- CORS-compliant implementation

## Limitations

- Requires OpenAI API key with GPT-4 access
- Internet connection required for diagram generation
- Browser must support modern JavaScript features
- Limited to ERD diagram types

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI for the GPT-4 API
- Mermaid.js team for the diagram rendering engine
- Contributors and users of the project

---

For more information or support, please open an issue in the repository.
