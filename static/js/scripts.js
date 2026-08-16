document.getElementById('loginForm').addEventListener('submit',async function(event) {
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

document.getElementById('signupForm').addEventListener('signup',async function(event) {
    //console.log('element clicked');
    event.preventDefault();
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

document.addEventListener('DOMContentLoaded', function() {
    const userTypeSelect = document.getElementById('user-type');
    const webcamContainer = document.getElementById('webcam-container');
    const webcam = document.getElementById('webcam');
    const canvas = document.getElementById('canvas');
    const captureBtn = document.getElementById('capture-btn');
    const capturedImageInput = document.getElementById('captured_image');
    const form = document.querySelector('form');

    // Show or hide the webcam capture based on user type selection
    userTypeSelect.addEventListener('change', function() {
        if (this.value === 'student') {
            webcamContainer.style.display = 'block';
            startWebcam();
        } else {
            webcamContainer.style.display = 'none';
            stopWebcam();
        }
    });

    // Start webcam stream for facial recognition capture
    function startWebcam() {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                webcam.srcObject = stream;
            })
            .catch(err => {
                console.error("Error accessing webcam: " + err);
            });
    }

    // Stop webcam when no longer needed
    function stopWebcam() {
        const stream = webcam.srcObject;
        if (stream) {
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
        }
        webcam.srcObject = null;
    }

    // Capture the image from the webcam and store it in the hidden input field
    captureBtn.addEventListener('CapturePhoto', function() {
        canvas.width = webcam.videoWidth;
        canvas.height = webcam.videoHeight;
        canvas.getContext('2d').drawImage(webcam, 0, 0);
        const imageData = canvas.toDataURL('image/png');
        capturedImageInput.value = imageData;
        alert('Face captured successfully!');
    });

    // Basic form validation
    form.addEventListener('submit', function(event) {
        const name = document.querySelector('input[name="name"]').value;
        const email = document.querySelector('input[name="email"]').value;
        const password = document.querySelector('input[name="password"]').value;

        if (!name || !email || !password) {
            event.preventDefault();
            alert('Please fill in all the required fields.');
        }
    });
});


document.getElementById('forgotPasswordForm').addEventListener('submit', async function(event) {
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

    document.getElementById('email-form').addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const emailData = {
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };
    
        try {
            const response = await fetch('/send_email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(emailData)
            });
            
            if (response.ok) {
                document.getElementById('email-status').innerText = 'Email sent successfully!';
            } else {
                document.getElementById('email-status').innerText = 'Failed to send email.';
            }
        } catch (error) {
            document.getElementById('email-status').innerText = 'Error: ' + error.message;
        }
    });
    
});
// index1
function switchForm(className, e) {
	e.preventDefault();
	const allForm = document.querySelectorAll('form');
	const form = document.querySelector(`form.${className}`);

	allForm.forEach(item=> {
		item.classList.remove('active');
	})
	form.classList.add('active');
}


const registerPassword = document.querySelector('form.register #password');
const registerConfirmPassword = document.querySelector('form.register #confirm-pass');

registerPassword.addEventListener('input', function () {
	registerConfirmPassword.pattern = `${this.value}`;
})

//AdminNew
const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');

allSideMenu.forEach(item=> {
	const li = item.parentElement;

	item.addEventListener('click', function () {
		allSideMenu.forEach(i=> {
			i.parentElement.classList.remove('active');
		})
		li.classList.add('active');
	})
});




// TOGGLE SIDEBAR
const menuBar = document.querySelector('#content nav .bx.bx-menu');
const sidebar = document.getElementById('sidebar');

menuBar.addEventListener('click', function () {
	sidebar.classList.toggle('hide');
})







const searchButton = document.querySelector('#content nav form .form-input button');
const searchButtonIcon = document.querySelector('#content nav form .form-input button .bx');
const searchForm = document.querySelector('#content nav form');

searchButton.addEventListener('click', function (e) {
	if(window.innerWidth < 576) {
		e.preventDefault();
		searchForm.classList.toggle('show');
		if(searchForm.classList.contains('show')) {
			searchButtonIcon.classList.replace('bx-search', 'bx-x');
		} else {
			searchButtonIcon.classList.replace('bx-x', 'bx-search');
		}
	}
})





if(window.innerWidth < 768) {
	sidebar.classList.add('hide');
} else if(window.innerWidth > 576) {
	searchButtonIcon.classList.replace('bx-x', 'bx-search');
	searchForm.classList.remove('show');
}


window.addEventListener('resize', function () {
	if(this.innerWidth > 576) {
		searchButtonIcon.classList.replace('bx-x', 'bx-search');
		searchForm.classList.remove('show');
	}
})



const switchMode = document.getElementById('switch-mode');

switchMode.addEventListener('change', function () {
	if(this.checked) {
		document.body.classList.add('dark');
	} else {
		document.body.classList.remove('dark');
	}
})