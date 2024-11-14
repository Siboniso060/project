document.getElementById('/login').addEventListener('submit',async function(event) {
    event.preventDefault();
    const loginData = {
        email: document.getElementById('loginEmail').value,
        password: document.getElementById('loginPassword').value,
        user_type: document.getElementById('loginUserType').value,
    };

    // Send request to Flask backend
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
        });
        
        if (response.ok) {
            // Redirect based on user type
            const result = await response.json();
            if (result.user_type === 'admin') {
                window.location.href = 'admin_dashboard.html';  
            } else {
                window.location.href = 'student_dashboard.html';  
            }
        } else {
            const errorText = await response.text();
            document.getElementById('loginError').innerText = `Error: ${errorText}`;
        }
    } catch (error) {
        document.getElementById('loginError').innerText = `Error: ${error.message}`;
    }
});

document.getElementById('/signup').addEventListener('submit',async function(event) {
    console.log('element clicked');
    //event.preventDefault();9/11
    const formData = new FormData();
    formData.append('name', document.getElementById('name').value);
    formData.append('surname', document.getElementById('surname').value);
    formData.append('student_number', document.getElementById('student_number').value);
    formData.append('course', document.getElementById('course').value);
    formData.append('year_of_study', document.getElementById('year_of_study').value);
    formData.append('email', document.getElementById('email').value);
    formData.append('password', document.getElementById('password').value);
    formData.append('user_type', document.getElementById('user_type').value);

    // For file upload (face image)
    const faceImage = document.getElementById('face_image').files[0];
    if (faceImage) {
        formData.append('face_image', faceImage);
    }

    // Send request to Flask backend
    try {
        const response = await fetch('/signup', {
            method: 'POST',
            body: formData,
        });
        if (response.ok) {
            window.location.href = 'index.html';  // Redirect to login page on success
        } else {
            const errorText = await response.text();
            document.getElementById('signupError').innerText = `Error: ${errorText}`;
        }
    } catch (error) {
        document.getElementById('signupError').innerText = `Error: ${error.message}`;
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('videoElement');
    
    // Check if the browser supports getUserMedia API
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Request access to the user's webcam
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                // Set the video source to the webcam stream
                video.srcObject = stream;
                video.play();
            })
            .catch(err => {
                console.log("An error occurred: " + err);
                alert("Webcam access is needed to capture your face.");
            });
    } else {
        alert("getUserMedia not supported by your browser.");
    }
});

document.getElementById('/forgot_password').addEventListener('submit', async function(event) {
    event.preventDefault();
    const email = document.getElementById('forgotEmail').value;

    // Send request to Flask backend
    try {
        const response = await fetch('/forgot_password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email }),
        });

        if (response.ok) {
            alert('Password reset link has been sent to your email');
        } else {
            const errorText = await response.text();
            document.getElementById('forgotError').innerText = `Error: ${errorText}`;
        }
    } catch (error) {
        document.getElementById('forgotError').innerText = `Error: ${error.message}`;
    }
});
//admin
document.addEventListener('DOMContentLoaded', function() {
    // Fetch the number of registered and attended students
    fetch('/admin_dashboard_data')
        .then(response => response.json()) 
        .then(data => {
            document.getElementById('registered-students').innerText = data.registered_students;
            document.getElementById('attended-students').innerText = data.attended_students;
        });

    // Handle the send file form submission
    document.getElementById('send-file-form').addEventListener('submit', function(event) {
        event.preventDefault();

        let formData = new FormData();
        formData.append('file', document.getElementById('file').files[0]);

        fetch('/admin_send_file', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            alert(data);
        });
    });

    // Handle the message form submission
    document.getElementById('message-form').addEventListener('submit', function(event) {
        event.preventDefault();

        let email = document.getElementById('student-email').value;
        let message = document.getElementById('message').value;

        fetch('/admin_send_message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email, message: message })
        })
        .then(response => response.text())
        .then(data => {
            alert(data);
        });
    });
});
