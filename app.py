import os
import logging
from datetime import datetime
from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase
import json

# Set up logging
logging.basicConfig(level=logging.DEBUG)

# Create the database base class
class Base(DeclarativeBase):
    pass

# Initialize SQLAlchemy with the base
db = SQLAlchemy(model_class=Base)

# Create Flask app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev-secret-key")

# Configure the SQLite database
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL", "sqlite:///convention_center.db")
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "pool_recycle": 300,
    "pool_pre_ping": True,
}
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Initialize the database with the app
db.init_app(app)

# Import models after initializing db to avoid circular imports
with app.app_context():
    from models import ContactRequest, Event
    db.create_all()

# Mock news data (in a real application, this would be fetched from an API)
def get_latest_news():
    return [
        {
            "title": "Centro de Convenciones inaugura sala de videoconferencias",
            "date": "28 de Julio de 2023",
            "summary": "Se inauguró una moderna sala equipada con tecnología de punta para videoconferencias y reuniones virtuales.",
            "image": "https://cdn.jsdelivr.net/gh/twbs/icons@main/icons/building-fill.svg"
        },
        {
            "title": "Exitoso congreso nacional de tecnología",
            "date": "15 de Julio de 2023",
            "summary": "Más de 500 profesionales participaron del congreso nacional de tecnología realizado en nuestras instalaciones.",
            "image": "https://cdn.jsdelivr.net/gh/twbs/icons@main/icons/calendar-event-fill.svg"
        },
        {
            "title": "Anuncian renovación del área de exposiciones",
            "date": "5 de Julio de 2023",
            "summary": "Se anunció la renovación completa del área de exposiciones que permitirá albergar eventos de mayor envergadura.",
            "image": "https://cdn.jsdelivr.net/gh/twbs/icons@main/icons/tools.svg"
        }
    ]

# Mock upcoming events (in a real application, this would come from the database)
def get_upcoming_events():
    return [
        {
            "id": 1,
            "title": "Expo Tecnología 2023",
            "date": "15-17 de Agosto, 2023",
            "description": "Exhibición de las últimas innovaciones tecnológicas con participación de empresas nacionales e internacionales.",
            "image": "https://cdn.jsdelivr.net/gh/twbs/icons@main/icons/laptop.svg"
        },
        {
            "id": 2,
            "title": "Congreso de Medicina",
            "date": "22-24 de Septiembre, 2023",
            "description": "Encuentro científico que reúne a profesionales de la salud para compartir avances médicos.",
            "image": "https://cdn.jsdelivr.net/gh/twbs/icons@main/icons/heart-pulse.svg"
        },
        {
            "id": 3,
            "title": "Feria del Libro",
            "date": "5-15 de Octubre, 2023",
            "description": "Evento cultural con presentaciones de libros, charlas de autores y stands de editoriales.",
            "image": "https://cdn.jsdelivr.net/gh/twbs/icons@main/icons/book.svg"
        },
        {
            "id": 4,
            "title": "Encuentro Empresarial",
            "date": "20 de Octubre, 2023",
            "description": "Jornada de networking para emprendedores y empresarios de la región.",
            "image": "https://cdn.jsdelivr.net/gh/twbs/icons@main/icons/briefcase.svg"
        }
    ]

# Mock past events
def get_past_events():
    return [
        {
            "id": 5,
            "title": "Conferencia de Educación",
            "date": "10-12 de Junio, 2023",
            "description": "Conferencia sobre innovación educativa y nuevos métodos de enseñanza.",
            "image": "https://cdn.jsdelivr.net/gh/twbs/icons@main/icons/mortarboard.svg"
        },
        {
            "id": 6,
            "title": "Festival Gastronómico",
            "date": "25-27 de Mayo, 2023",
            "description": "Muestra de platos típicos regionales con participación de reconocidos chefs.",
            "image": "https://cdn.jsdelivr.net/gh/twbs/icons@main/icons/cup-hot.svg"
        }
    ]

# Mock gallery images
def get_gallery_images():
    return [
        {
            "id": 1,
            "title": "Sala Principal",
            "description": "Sala principal con capacidad para 500 personas",
            "thumbnail": "https://cdn.jsdelivr.net/gh/twbs/icons@main/icons/building.svg"
        },
        {
            "id": 2,
            "title": "Auditorio",
            "description": "Auditorio moderno con sistemas audiovisuales de última generación",
            "thumbnail": "https://cdn.jsdelivr.net/gh/twbs/icons@main/icons/mic.svg"
        },
        {
            "id": 3,
            "title": "Sala de Conferencias",
            "description": "Sala para conferencias y reuniones empresariales",
            "thumbnail": "https://cdn.jsdelivr.net/gh/twbs/icons@main/icons/people.svg"
        },
        {
            "id": 4,
            "title": "Área de Exposiciones",
            "description": "Amplio espacio para montaje de stands y exposiciones",
            "thumbnail": "https://cdn.jsdelivr.net/gh/twbs/icons@main/icons/easel.svg"
        },
        {
            "id": 5,
            "title": "Jardines",
            "description": "Espacios verdes para eventos al aire libre",
            "thumbnail": "https://cdn.jsdelivr.net/gh/twbs/icons@main/icons/tree.svg"
        },
        {
            "id": 6,
            "title": "Salón VIP",
            "description": "Salón exclusivo para recepciones especiales",
            "thumbnail": "https://cdn.jsdelivr.net/gh/twbs/icons@main/icons/stars.svg"
        }
    ]

@app.route('/')
def index():
    news = get_latest_news()
    upcoming_events = get_upcoming_events()
    past_events = get_past_events()
    gallery_images = get_gallery_images()
    return render_template('index.html', 
                          news=news, 
                          upcoming_events=upcoming_events, 
                          past_events=past_events,
                          gallery_images=gallery_images)

@app.route('/contact', methods=['POST'])
def contact():
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        message = request.form.get('message')
        
        if not name or not email or not message:
            flash('Por favor complete todos los campos obligatorios', 'error')
            return redirect(url_for('index', _anchor='contacto'))
        
        # Create a new contact request
        new_contact = ContactRequest(
            name=name,
            email=email,
            message=message,
            created_at=datetime.now()
        )
        
        try:
            db.session.add(new_contact)
            db.session.commit()
            flash('Su mensaje ha sido enviado. Nos pondremos en contacto pronto.', 'success')
        except Exception as e:
            logging.error(f"Error saving contact request: {str(e)}")
            db.session.rollback()
            flash('Hubo un problema al enviar su mensaje. Por favor intente nuevamente.', 'error')
        
        return redirect(url_for('index', _anchor='contacto'))

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
