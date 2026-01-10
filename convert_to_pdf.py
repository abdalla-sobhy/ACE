#!/usr/bin/env python3
import markdown2
from weasyprint import HTML, CSS

# Read the markdown file
with open('docs/EXTERNAL_SERVICES_GUIDE.md', 'r', encoding='utf-8') as f:
    md_content = f.read()

# Convert markdown to HTML
html_content = markdown2.markdown(md_content, extras=[
    'fenced-code-blocks',
    'tables',
    'header-ids',
    'toc'
])

# Create a styled HTML document
html_template = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>ACE Platform - External Services Integration Guide</title>
    <style>
        @page {{
            size: A4;
            margin: 2cm;
            @top-center {{
                content: "ACE Platform - External Services Guide";
                font-size: 10pt;
                color: #666;
            }}
            @bottom-center {{
                content: counter(page);
                font-size: 10pt;
            }}
        }}
        body {{
            font-family: 'Helvetica', 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            font-size: 11pt;
        }}
        h1 {{
            color: #2c3e50;
            font-size: 24pt;
            border-bottom: 3px solid #3498db;
            padding-bottom: 10px;
            margin-top: 30px;
            page-break-before: always;
        }}
        h1:first-of-type {{
            page-break-before: avoid;
        }}
        h2 {{
            color: #34495e;
            font-size: 18pt;
            border-bottom: 2px solid #95a5a6;
            padding-bottom: 8px;
            margin-top: 25px;
        }}
        h3 {{
            color: #7f8c8d;
            font-size: 14pt;
            margin-top: 20px;
        }}
        h4 {{
            color: #95a5a6;
            font-size: 12pt;
            margin-top: 15px;
        }}
        code {{
            background-color: #f4f4f4;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
            font-size: 10pt;
            color: #e74c3c;
        }}
        pre {{
            background-color: #2c3e50;
            color: #ecf0f1;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
            font-size: 9pt;
            line-height: 1.4;
        }}
        pre code {{
            background-color: transparent;
            color: #ecf0f1;
            padding: 0;
        }}
        table {{
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            font-size: 10pt;
        }}
        th {{
            background-color: #3498db;
            color: white;
            padding: 10px;
            text-align: left;
            font-weight: bold;
        }}
        td {{
            padding: 8px;
            border: 1px solid #ddd;
        }}
        tr:nth-child(even) {{
            background-color: #f9f9f9;
        }}
        blockquote {{
            border-left: 4px solid #3498db;
            padding-left: 15px;
            margin-left: 0;
            color: #555;
            font-style: italic;
        }}
        ul, ol {{
            margin-left: 20px;
        }}
        li {{
            margin-bottom: 5px;
        }}
        a {{
            color: #3498db;
            text-decoration: none;
        }}
        .page-break {{
            page-break-after: always;
        }}
        strong {{
            color: #2c3e50;
        }}
    </style>
</head>
<body>
{html_content}
</body>
</html>
"""

# Generate PDF
HTML(string=html_template).write_pdf('docs/EXTERNAL_SERVICES_GUIDE.pdf')
print("PDF generated successfully!")
