from transformers import pipeline

print("Loading AI Emotional Analysis Model... (this may take 30-60 seconds on first run)")
try:
    classifier = pipeline("sentiment-analysis", model="nlptown/bert-base-multilingual-uncased-sentiment")
    print("AI Model loaded successfully. Ready!")
except Exception as e:
    print(f"Error loading NLP model: {e}")
    classifier = None

def analyze_emotion(text):
    if not classifier:
        return 0.5, "Neutral"
    
    results = classifier(text)
    if not results:
        return 0.5, "Neutral"
    
    # BERT multilingual returns stars from 1 to 5
    # Label is often like "1 star", "2 stars", etc.
    label = results[0]['label']
    score = results[0]['score']
    
    # Map label to a friendly emotion
    stars = int(label.split()[0])
    
    emotion_map = {
        1: "Very Sad/Angry",
        2: "Sad",
        3: "Neutral",
        4: "Happy",
        5: "Very Happy"
    }
    
    primary_emotion = emotion_map.get(stars, "Neutral")
    # Normalize score to 0-1 based on stars
    normalized_score = (stars - 1) / 4.0
    
    return normalized_score, primary_emotion
