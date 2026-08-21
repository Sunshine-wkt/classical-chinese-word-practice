from pathlib import Path
from docx import Document

source_path = Path('source/reference/yuwoyusuo-notes.docx')
output_path = Path('source/reference/yuwoyusuo-notes.txt')

document = Document(source_path)
lines = []

for paragraph in document.paragraphs:
    text = paragraph.text.strip()
    if text:
        lines.append(text)

for table in document.tables:
    for row in table.rows:
        cells = [cell.text.strip().replace('\n', '／') for cell in row.cells]
        if any(cells):
            lines.append('｜'.join(cells))

output_path.write_text('\n'.join(lines) + '\n', encoding='utf-8')
print(f'已擷取 {len(lines)} 行至 {output_path}')
