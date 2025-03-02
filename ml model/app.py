from flask import Flask, request, jsonify
import pickle
import numpy as np
from flask_cors import CORS
import logging

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend integration

# Configure logging
logging.basicConfig(level=logging.INFO)

# Load the trained ML model
try:
    with open("budget_model.pkl", "rb") as model_file:
        model = pickle.load(model_file)
    logging.info("ML model loaded successfully.")
except Exception as e:
    logging.error(f"Error loading model: {e}")
    model = None

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json
        income = float(data.get("income", 0))
        expenses = list(map(float, data.get("expenses", [])))
        
        if not model:
            return jsonify({"error": "Model not loaded properly."}), 500
        
        # Prepare input for model
        input_features = np.array([income] + expenses).reshape(1, -1)
        
        # Predict recommended budget
        budget_recommendation = model.predict(input_features)[0]
        
        return jsonify({"recommended_budget": budget_recommendation})
    except ValueError:
        return jsonify({"error": "Invalid input values. Please check your data."}), 400
    except Exception as e:
        logging.error(f"Error during prediction: {e}")
        return jsonify({"error": "An unexpected error occurred."}), 500

@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "API is running"})

@app.route("/model_info", methods=["GET"])
def model_info():
    if model:
        return jsonify({"message": "Model is loaded and ready"})
    else:
        return jsonify({"error": "Model is not available"}), 500

if __name__ == "__main__":
    app.run(debug=True)
