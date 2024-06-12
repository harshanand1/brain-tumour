import os
import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing import image
from PIL import Image
import cv2
from keras.models import load_model
from flask import Flask, request, redirect, url_for, session, flash, render_template
from werkzeug.utils import secure_filename
import psycopg2
import bcrypt
from authlib.integrations.flask_client import OAuth
import secrets 
from flask import send_from_directory


app = Flask(__name__, static_folder='static', template_folder='templates')
app.secret_key = '67243'

DB_HOST = 'localhost'
DB_NAME = 'login'
DB_USER = 'postgres'
DB_PASSWORD = '1234'

conn = psycopg2.connect(
    host=DB_HOST,
    database=DB_NAME,
    user=DB_USER,
    password=DB_PASSWORD
)

cur = conn.cursor()

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        # Get form data
        username = request.form['name']
        email = request.form['email']
        password = request.form['password']
        confirm_password = request.form.get('confirm-password')
        dateofbirth = request.form['dob']
        phone_number = request.form['phone']
        gender = request.form['gender']

        # Check if passwords match
        if password != confirm_password:
            flash('Passwords do not match. Please try again.', 'danger')
            return redirect(url_for('index'))

        try:
            # Execute SQL query using cursor
            cur.execute("INSERT INTO clients (name, email, password, dob, phone, gender) VALUES (%s, %s, %s, %s, %s, %s)",
                        (username, email, password, dateofbirth, phone_number, gender))
            conn.commit()
            flash('Registration successful! Please login.', 'success')
            return redirect(url_for('index'))
        except psycopg2.Error as e:
            conn.rollback()
            flash('Error registering user: {}'.format(e), 'danger')
            return redirect(url_for('index'))

    return render_template('signup.html')

@app.route('/user_login', methods=['GET', 'POST'])
def user_login():
    if request.method == 'POST':
        # Get form data
        email = request.form['email']
        password = request.form['password']

        # Check if user exists in database
        try:
            with psycopg2.connect(host=DB_HOST, database=DB_NAME, user=DB_USER, password=DB_PASSWORD) as conn:
                with conn.cursor() as cur:
                    cur.execute("SELECT * FROM clients WHERE email = %s", (email,))
                    user = cur.fetchone()

            if user:
                # Check password
                stored_password = user[3]
                if password == stored_password:
                    # Password is correct, log the user in
                    session['username'] = user[1]
                    flash('Login successful!', 'success')
                    return redirect(url_for('index'))
                else:
                    flash('Invalid email or password', 'danger')
            else:
                flash('User not found', 'danger')
        except Exception as e:
            print(f"Error: {e}")
            flash('Login failed! Please try again.', 'danger')

        return redirect(url_for('index'))

    return render_template('login.html')


app.config['GOOGLE_CLIENT_ID'] = '245134481160-u6q3g60ui3ukhk5gtr8ggki6ksi0um33.apps.googleusercontent.com'
app.config['GOOGLE_CLIENT_SECRET'] = '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'
app.config['GOOGLE_DISCOVERY_URL'] = "https://accounts.google.com/.well-known/openid-configuration"

oauth = OAuth(app)
google = oauth.register(
    name='google',
    client_id=app.config['GOOGLE_CLIENT_ID'],
    client_secret=app.config['GOOGLE_CLIENT_SECRET'],
    server_metadata_url=app.config['GOOGLE_DISCOVERY_URL'],
    client_kwargs={
        'scope': 'openid email profile'
    }
)

@app.route('/')
def index():
    user = session.get('user')
    user_initial = user['email'][0].upper() if user else None
    return render_template('index.html', user_initial=user_initial)

@app.route('/google_login')
def google_login():
    nonce = secrets.token_urlsafe(16)  # Generate a 128-bit random string
    session['nonce'] = nonce
    redirect_uri = url_for('authorize', _external=True)
    return google.authorize_redirect(redirect_uri, nonce=nonce)

@app.route('/google_authorized')
def authorized():
    # Get the user's information from the session
    user = google.current_user()
    if user is None:
        # If the user is not logged in, redirect them to the login page
        return redirect(url_for('login'))

    # Set the user session variable
    session['user'] = {'email': user['email'], 'name': user['name']}

    # Update the user-initial span element with the user's email initial
    user_initial = user['email'][0].upper()
    return redirect(url_for('index')) + f'#user-initial/{user_initial}'


@app.route('/logout')
def logout():
    session.pop('user', None)
    return redirect(url_for('index'))

@app.route('/callback')
def authorize():
    token = google.authorize_access_token()
    nonce = session.pop('nonce', None)
    user_info = google.parse_id_token(token, nonce=nonce)
    session['user'] = user_info
    return redirect(url_for('index'))

@app.route('/profile')
def profile():
    user = session.get('user')
    if user is None:
        return redirect(url_for('google_login'))
    return 'Logged in as: ' + user['email']

@app.route('/aboutus')
def aboutus():
    return render_template('aboutus.html')

@app.route('/privacy')
def privacy():
    return render_template('privacy.html')

@app.route('/terms')
def terms():
    return render_template('terms.html')

@app.route('/disclaimer')
def disclaimer():
    return render_template('disclaimer.html')

@app.route('/forgot')
def forgot():
    return render_template('forgot.html')

model = load_model('BrainTumour10Epochs.keras')
print('Model loaded. Check http://127.0.0.1:5000/')

def get_className(classNo):
    if classNo == 0:
        return "No, Tumour Detected"
        
    elif classNo == 1:
        return "Yes, Tumour Detected"
            
def getResult(img):
    image = cv2.imread(img)
    image = Image.fromarray(image, 'RGB')
    image = image.resize((64, 64))
    image = np.array(image)
    input_img = np.expand_dims(image, axis=0)
    result = model.predict(input_img)
    return result

@app.route('/predict', methods=['GET', 'POST'])
def upload():
    if request.method == 'POST':
        uploaded_file = request.files['image_file']
        basepath = os.path.dirname(__file__)
        upload_folder = os.path.join(basepath, 'uploads')
        if not os.path.exists(upload_folder):
            os.makedirs(upload_folder)
        file_path = os.path.join(upload_folder, uploaded_file.filename)
        uploaded_file.save(file_path)
        return render_template('result.html', image_name=uploaded_file.filename)
    return render_template('upload.html')

@app.route('/uploads/<filename>')
def send_image(filename):
    return send_from_directory('uploads', filename)

if __name__ == '__main__':
    app.run(debug=True)
