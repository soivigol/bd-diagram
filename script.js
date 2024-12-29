/**
 * Initialize the application when the DOM is fully loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Mermaid library
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

    // DOM Elements
    const elements = {
        apiKeyInput: document.getElementById('apiKey'),
        apiKeyContainer: document.getElementById('apiKeyContainer'),
        apiKeyStatus: document.getElementById('apiKeyStatus'),
        changeApiKeyBtn: document.getElementById('changeApiKeyBtn'),
        generateBtn: document.getElementById('generateDiagramBtn'),
        diagramActions: document.getElementById('diagramActions'),
        structureText: document.getElementById('structureText'),
        downloadBtn: document.getElementById('downloadBtn'),
        copyHtmlBtn: document.getElementById('copyHtmlBtn'),
    };

    /**
     * Updates the visibility of API key related elements based on stored API key
     * @returns {void}
     */
    const updateApiKeyVisibility = () => {
        const savedApiKey = localStorage.getItem('openaiApiKey');
        if (savedApiKey) {
            elements.apiKeyContainer.style.display = 'none';
            elements.apiKeyStatus.style.display = 'flex';
            elements.apiKeyInput.value = savedApiKey;
        } else {
            elements.apiKeyContainer.style.display = 'block';
            elements.apiKeyStatus.style.display = 'none';
            elements.apiKeyInput.value = '';
        }
    };

    /**
     * Handles the API key change request
     * @returns {void}
     */
    const handleApiKeyChange = () => {
        localStorage.removeItem('openaiApiKey');
        updateApiKeyVisibility();
    };

    /**
     * Saves the API key to localStorage
     * @returns {void}
     */
    const handleApiKeySave = () => {
        const apiKey = elements.apiKeyInput.value;
        if (apiKey) {
            localStorage.setItem('openaiApiKey', apiKey);
            updateApiKeyVisibility();
        } else {
            alert('Please enter a valid API key.');
        }
    };

    /**
     * Renders the Mermaid diagram
     * @param {string} code - The Mermaid diagram code
     * @returns {void}
     */
    const renderMermaid = (code) => {
        // Remove markdown code fence markers but keep comments
        const cleanCode = code.replace(/```mermaid\n/, '').replace(/```$/, '');
        const diagramDiv = document.getElementById('diagram');
        diagramDiv.innerHTML = `<div class="mermaid">${cleanCode}</div>`;
        mermaid.init(undefined, '.mermaid');
    };

    /**
     * Generates the OpenAI API request body
     * @param {string} description - The database description
     * @returns {Object} The request body
     */
    const generateRequestBody = (description) => ({
        model: "gpt-4o",
        response_format: { type: "json_object" },
        max_tokens: 4096,
        messages: [
            {
                role: "system",
                content: `You are a helpful assistant that generates database diagrams and descriptions. 
                Return a JSON response containing both a Mermaid diagram and a mobile-responsive HTML description. 
                For the Mermaid diagram:
                1. Start with 'erDiagram'
                2. Use proper relationship notation (||--o{, ||--|{, etc.)
                3. Include descriptions as part of the entity definition
                4. List all attributes with their types and descriptions
                
                Example Mermaid format:
                erDiagram
                    User {
                        int id "Primary key"
                        string email "User's email address"
                        string password "Hashed password"
                        string role "User's role in the system"
                    }
                    
                    Post {
                        int id "Primary key"
                        string title "Post title"
                        string content "Post content"
                        datetime created_at "Creation timestamp"
                    }
                    
                    User ||--o{ Post : creates

                Note: Each attribute should follow the format: "type name \"description\""

                For the HTML response, use this mobile-friendly structure:
                <div class="db-structure">
                    <div class="entity-card" data-entity="[EntityName]">
                        <h3 class="entity-title">[EntityName]</h3>
                        <div class="entity-description">[Description]</div>
                        <div class="attributes">
                            <h4>Attributes</h4>
                            <ul class="attribute-list">
                                <li>
                                    <span class="attr-name">[name]</span> - 
                                    <span class="attr-type">[type]</span>
                                    <div class="attr-description">[description]</div>
                                </li>
                            </ul>
                        </div>
                        <div class="relationships">
                            <h4>Relationships</h4>
                            <ul class="relationship-list">
                                <li>[relationship description]</li>
                            </ul>
                        </div>
                    </div>
                </div>`
            },
            {
                role: "user",
                content: `Analyze the following database description and return a JSON response with two properties:
                1. 'mermaid': A Mermaid ERD diagram code that includes:
                   - Entity definitions with attributes
                   - Each attribute should include type, name, and description in quotes
                   - Proper relationship notation
                2. 'html': An HTML that describes each entity, its attributes, relationships, and purpose
                
                Description: ${description}`
            }
        ]
    });

    /**
     * Updates the generate button state
     * @param {boolean} isLoading - Whether the button should show loading state
     * @returns {void}
     */
    const updateGenerateButtonState = (isLoading) => {
        elements.generateBtn.disabled = isLoading;
        elements.generateBtn.innerHTML = isLoading ? 'Generating...' : 'Generate Diagram';
        elements.generateBtn.classList[isLoading ? 'add' : 'remove']('loading');
    };

    /**
     * Handles the diagram generation process
     * @returns {Promise<void>}
     */
    const handleGenerateDiagram = async () => {
        const apiKey = localStorage.getItem('openaiApiKey');
        if (!apiKey) {
            alert('Please save your OpenAI API key first.');
            return;
        }

        const description = document.getElementById('dbDescription').value;
        if (!description) {
            alert('Please enter a database description.');
            return;
        }

        try {
            updateGenerateButtonState(true);
            
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify(generateRequestBody(description))
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API Error: ${errorData.error?.message || 'Unknown error'}`);
            }

            const data = await response.json();
            
            if (!data.choices || !data.choices[0] || !data.choices[0].message) {
                throw new Error('Invalid response format from API');
            }

            const jsonResponse = JSON.parse(data.choices[0].message.content);
            console.log(jsonResponse);
            
            // Render the Mermaid diagram
            renderMermaid(jsonResponse.mermaid);
            elements.structureText.innerHTML = jsonResponse.html;
            elements.structureText.classList.add('db-structure-container');
            elements.diagramActions.style.display = 'block';
            
        } catch (error) {
            console.error('Error fetching from OpenAI:', error);
            alert(`Failed to generate diagram: ${error.message}`);
        } finally {
            updateGenerateButtonState(false);
        }
    };

    /**
     * Downloads the generated diagram as a PNG file
     * @returns {void}
     */
    const handleDownloadDiagram = () => {
        const svg = document.querySelector('.mermaid svg');
        if (!svg) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Convert SVG to data URL
        const svgData = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
        const URL = window.URL || window.webkitURL || window;
        const svgUrl = URL.createObjectURL(svgBlob);
        
        // Create and download image
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            
            const link = document.createElement('a');
            link.download = 'database-diagram.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
            
            URL.revokeObjectURL(svgUrl);
        };
        img.src = svgUrl;
    };

    /**
     * Converts HTML to Markdown format
     * @param {string} html - The HTML content to convert
     * @returns {string} The markdown formatted text
     */
    const convertHtmlToMarkdown = (html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        let markdown = '';

        doc.querySelectorAll('.entity-card').forEach(entity => {
            // Entity Title
            markdown += `## ${entity.querySelector('.entity-title').textContent}\n\n`;
            
            // Entity Description
            const description = entity.querySelector('.entity-description');
            if (description) {
                markdown += `${description.textContent}\n\n`;
            }

            // Attributes
            markdown += '### Attributes\n\n';
            markdown += '| Name | Type | Description |\n';
            markdown += '|------|------|-------------|\n';
            
            entity.querySelectorAll('.attribute-list li').forEach(attr => {
                const name = attr.querySelector('.attr-name').textContent;
                const type = attr.querySelector('.attr-type').textContent;
                const desc = attr.querySelector('.attr-description')?.textContent || '';
                markdown += `| ${name} | ${type} | ${desc} |\n`;
            });
            markdown += '\n';

            // Relationships
            const relationships = entity.querySelector('.relationship-list');
            if (relationships && relationships.children.length > 0) {
                markdown += '### Relationships\n\n';
                relationships.querySelectorAll('li').forEach(rel => {
                    markdown += `- ${rel.textContent}\n`;
                });
                markdown += '\n';
            }

            markdown += '---\n\n';
        });

        return markdown;
    };

    /**
     * Copies the generated description as Markdown to clipboard
     * @returns {Promise<void>}
     */
    const handleCopyHtml = async () => {
        const htmlContent = elements.structureText.innerHTML;
        try {
            const markdownContent = convertHtmlToMarkdown(htmlContent);
            await navigator.clipboard.writeText(markdownContent);
            const originalText = elements.copyHtmlBtn.innerHTML;
            elements.copyHtmlBtn.innerHTML = 'Copied!';
            setTimeout(() => {
                elements.copyHtmlBtn.innerHTML = originalText;
            }, 2000);
        } catch (err) {
            console.error('Failed to copy Markdown:', err);
            alert('Failed to copy Markdown to clipboard');
        }
    };

    // Initialize event listeners
    elements.changeApiKeyBtn.addEventListener('click', handleApiKeyChange);
    document.getElementById('saveApiKeyBtn').addEventListener('click', handleApiKeySave);
    elements.generateBtn.addEventListener('click', handleGenerateDiagram);
    elements.downloadBtn.addEventListener('click', handleDownloadDiagram);
    elements.copyHtmlBtn.addEventListener('click', handleCopyHtml);

    // Initialize API key visibility on load
    updateApiKeyVisibility();
}); 