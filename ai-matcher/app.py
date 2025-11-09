from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer, util
import torch
from utils.text_extractor import extract_text_from_file


app = Flask(__name__)

model = SentenceTransformer('all-MiniLM-L6-v2')

@app.route('/api/ai/match', methods=['POST'])
def match_resume_job():
    try:
        job_description = request.form['jobDescription']
        file = request.files['resume']

        resume_text = extract_text_from_file(file)

        embeddings = model.encode([resume_text, job_description], convert_to_tensor=True)
        similarity = util.pytorch_cos_sim(embeddings[0], embeddings[1]).item()
    
        score = round(similarity * 100, 2)

        return jsonify({
            "matchScore": score,
            "message": "Resume matched successfully"
        })     
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/', methods=['GET'])
def home():
    return jsonify({"message": "AI Resume matcher is running"})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
                                          