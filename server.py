import os
import time
import smtplib
import threading
from flask import Flask, request, jsonify
from flask_cors import CORS
from inotify.adapters import Inotify
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

app = Flask(__name__)
CORS(app)

# Email Configuration
SMTP_SERVER = 'smtp.gmail.com'
SMTP_PORT = 587
SENDER_EMAIL = 'harshsharma717171@gmail.com'
SENDER_PASSWORD = 'jsyprxwlcdszkcgp'
RECIPIENT_EMAILS = ['harshsharma6160@gmail.com']

# File Monitoring Configuration
FILES_TO_MONITOR = []
ACTIVE_WATCH = []
last_modification_times = {}
monitoring_thread = None

# Send email notification
def send_email(file_name, file_path, modification_time):
    subject = f"{file_name} has been modified"
    body = f"File {file_name} (Full path: {file_path}) was modified at {modification_time}."

    msg = MIMEMultipart()
    msg['From'] = SENDER_EMAIL
    msg['To'] = ', '.join(RECIPIENT_EMAILS)
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))

    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.sendmail(SENDER_EMAIL, RECIPIENT_EMAILS, msg.as_string())
        server.quit()
        print(f"Email sent successfully for {file_name}")
    except Exception as e:
        print(f"Failed to send email: {str(e)}")

# Monitor files for changes
def monitor_files():
    inotify = Inotify()
    for directory in FILES_TO_MONITOR:
        if os.path.exists(directory):
            inotify.add_watch(directory)
        else:
            print(f"Directory {directory} does not exist!")

    print("Monitoring started...")
    try:
        for event in inotify.event_gen(yield_nones=False):
            (_, type_names, path, filename) = event
            if filename in ACTIVE_WATCH and 'IN_CLOSE_WRITE' in type_names:
                file_path = os.path.join(path, filename)
                current_time = time.time()
                if filename not in last_modification_times or (current_time - last_modification_times[filename] > 5):
                    modification_time = time.ctime()
                    print(f"File {filename} was modified at {modification_time}.")
                    send_email(filename, file_path, modification_time)
                    last_modification_times[filename] = current_time
    except KeyboardInterrupt:
        print("Monitoring stopped.")

# Start monitoring endpoint
@app.route('/start-monitoring', methods=['POST'])
def start_monitoring():
    global FILES_TO_MONITOR, ACTIVE_WATCH, monitoring_thread

    data = request.json
    directories = data.get("directories", [])
    files = data.get("files", [])

    # Validate directories
    invalid_dirs = [d for d in directories if not os.path.exists(d)]
    if invalid_dirs:
        return jsonify({"message": f"Invalid directories: {', '.join(invalid_dirs)}"}), 400

    # Validate files
    invalid_files = [f for f in files if not any(os.path.isfile(os.path.join(d, f)) for d in directories)]
    if invalid_files:
        return jsonify({"message": f"Invalid files: {', '.join(invalid_files)}"}), 400

    FILES_TO_MONITOR = directories
    ACTIVE_WATCH = files

    if monitoring_thread and monitoring_thread.is_alive():
        return jsonify({"message": "Monitoring is already running!"}), 400

    monitoring_thread = threading.Thread(target=monitor_files, daemon=True)
    monitoring_thread.start()

    return jsonify({"message": "Monitoring started successfully!"}), 200

# Stop monitoring endpoint
@app.route('/stop-monitoring', methods=['POST'])
def stop_monitoring():
    global monitoring_thread

    if monitoring_thread and monitoring_thread.is_alive():
        monitoring_thread.join(0)
        return jsonify({"message": "Monitoring stopped successfully!"}), 200
    else:
        return jsonify({"message": "No monitoring is currently running!"}), 400

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

