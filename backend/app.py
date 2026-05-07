from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from models import db, Entry
from nlp_service import analyze_emotion

load_dotenv()

app = Flask(__name__)
CORS(app)

# Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///emoteday.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize DB with App
db.init_app(app)

@app.route('/')
def health_check():
    return jsonify({"status": "healthy", "service": "EmoteDay Backend"}), 200

@app.route('/api/entries', methods=['POST'])
def create_entry():
    data = request.json
    content = data.get('content')
    
    if not content:
        return jsonify({'error': 'Content is required'}), 400
        
    # NLP Analysis
    emotion_score, primary_emotion = analyze_emotion(content)
    
    new_entry = Entry(
        content=content,
        emotion_score=emotion_score,
        primary_emotion=primary_emotion
    )
    
    db.session.add(new_entry)
    db.session.commit()
    
    return jsonify({
        'id': new_entry.id,
        'content': new_entry.content,
        'emotion_score': new_entry.emotion_score,
        'primary_emotion': new_entry.primary_emotion,
        'created_at': new_entry.created_at.isoformat()
    }), 201

@app.route('/api/entries', methods=['GET'])
def get_entries():
    entries = Entry.query.order_by(Entry.created_at.desc()).all()
    return jsonify([{
        'id': e.id,
        'content': e.content,
        'emotion_score': e.emotion_score,
        'primary_emotion': e.primary_emotion,
        'created_at': e.created_at.isoformat()
    } for e in entries])

@app.route('/api/entries/<int:entry_id>', methods=['DELETE'])
def delete_entry(entry_id):
    entry = Entry.query.get(entry_id)
    if not entry:
        return jsonify({'error': 'Entry not found'}), 404
    
    db.session.delete(entry)
    db.session.commit()
    return '', 204

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    port = int(os.getenv('PORT', 5001))
    app.run(host='0.0.0.0', port=port)
