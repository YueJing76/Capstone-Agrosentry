from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from model_predictor import CorrectInsectPredictor
from disease_info import DiseaseInfo

app = Flask(__name__)
CORS(app)

# Initialize services
model_predictor = CorrectInsectPredictor()
disease_info = DiseaseInfo()

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'message': 'Correct Insect Classification Service is running',
        'model_loaded': model_predictor.is_model_loaded()
    })

@app.route('/predict', methods=['POST'])
def predict_pest():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400
        
        file = request.files['image']
        if file.filename == '':
            return jsonify({'error': 'No image selected'}), 400
        
        prediction_result = model_predictor.predict(file)
        
        if prediction_result['success']:
            pest_name = prediction_result['predicted_class']
            confidence = prediction_result['confidence']
            
            pest_details = disease_info.get_disease_info(pest_name)
            
            return jsonify({
                'success': True,
                'prediction': {
                    'pest_name': pest_name,
                    'confidence': float(confidence),
                    'severity_level': model_predictor.get_severity_level(confidence),
                    'all_predictions': prediction_result['all_predictions']
                },
                'pest_info': pest_details,
                'recommendations': disease_info.get_treatment_recommendations(pest_name)
            })
        else:
            return jsonify({
                'success': False,
                'error': prediction_result['error']
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Prediction failed: {str(e)}'
        }), 500

if __name__ == '__main__':
    print("🤖 Loading correct insect classification model...")
    if model_predictor.load_model():
        print("✅ Model loaded successfully!")
        app.run(host='0.0.0.0', port=5001, debug=False)
    else:
        print("❌ Failed to load model!")
