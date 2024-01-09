import fitz  # PyMuPDF
from transformers import pipeline

def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    text = ""
    for page_num in range(doc.page_count):
        page = doc[page_num]
        text += page.get_text()
    return text

def find_answer(question, context):
    qa_pipeline = pipeline("question-answering")
    result = qa_pipeline(question=question, context=context)
    return result['answer']

def main():
    pdf_path = 'pdf.pdf'  # Replace with your PDF file path
    question = input("Enter your question: ")

    try:
        pdf_text = extract_text_from_pdf(pdf_path)
        answer = find_answer(question, pdf_text)
        print("Answer:", answer)
    except Exception as e:
        print("An error occurred:", str(e))

if __name__ == "__main__":
    main()
