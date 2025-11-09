import os
import PyPDF2
import docx


def extract_text_from_file(file):
    filename = file.filename
    ext = os.path.splitext(filename)[1].lower()

    file.stream.seek(0)

    if ext == '.pdf':
        reader = PyPDF2.PdfReader(file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""

        return text
    
    elif ext in ['.doc','.docx']:
        doc = docx.Document(file)
        return "\n".join([para.text for para in doc.paragraphs])
    
    else:
        raise ValueError("Unsupported file type, Only PDF and DOCX files are allowed.")