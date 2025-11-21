from flask import Flask
from flask_cors import CORS 
from routes import test_bp, image_editor_project_bp, salary_predictor_project_bp, number_identifier_bp, rock_paper_scissor_project_bp, face_extractor_project_bp, chatbot_project_bp

app = Flask(__name__)
CORS(app) 
GROQ_API = os.getenv("GROQ_API")

app.register_blueprint(test_bp)
app.register_blueprint(image_editor_project_bp)
app.register_blueprint(face_extractor_project_bp)
app.register_blueprint(salary_predictor_project_bp)
app.register_blueprint(chatbot_project_bp)
app.register_blueprint(number_identifier_bp)
app.register_blueprint(rock_paper_scissor_project_bp)

if __name__ == '__main__':
    port = 5000
    app.run(host='0.0.0.0', port=port,debug=True)
