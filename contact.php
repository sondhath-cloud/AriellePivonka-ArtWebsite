<?php
// Contact Form Handler for Arielle Pivonka Art Website
// Designed for SiteWorks hosting with MySQL database

// Start session for CSRF protection
session_start();

// Database configuration (update with your SiteWorks MySQL details)
$host = 'localhost'; // Usually localhost on SiteWorks
$dbname = 'arielle_art_db'; // Your database name
$username = 'your_db_username'; // Your MySQL username
$password = 'your_db_password'; // Your MySQL password

// Email configuration (using SiteWorks email)
$to_email = 'arielle@yourdomain.com'; // Update with actual email
$from_email = 'noreply@yourdomain.com'; // Update with your domain
$site_name = 'Arielle Pivonka Art';

// Function to sanitize input
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Function to validate email
function validate_email($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// Function to send email
function send_email($to, $subject, $message, $from) {
    $headers = "From: $from\r\n";
    $headers .= "Reply-To: $from\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();
    
    return mail($to, $subject, $message, $headers);
}

// Function to log contact to database
function log_contact($name, $email, $subject, $message, $ip_address) {
    global $host, $dbname, $username, $password;
    
    try {
        $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        $stmt = $pdo->prepare("INSERT INTO contacts (name, email, subject, message, ip_address, created_at) VALUES (?, ?, ?, ?, ?, NOW())");
        $stmt->execute([$name, $email, $subject, $message, $ip_address]);
        
        return true;
    } catch(PDOException $e) {
        error_log("Database error: " . $e->getMessage());
        return false;
    }
}

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $errors = [];
    $success = false;
    
    // Get and sanitize form data
    $name = isset($_POST['name']) ? sanitize_input($_POST['name']) : '';
    $email = isset($_POST['email']) ? sanitize_input($_POST['email']) : '';
    $subject = isset($_POST['subject']) ? sanitize_input($_POST['subject']) : '';
    $message = isset($_POST['message']) ? sanitize_input($_POST['message']) : '';
    
    // Validate required fields
    if (empty($name)) {
        $errors[] = 'Name is required';
    }
    
    if (empty($email)) {
        $errors[] = 'Email is required';
    } elseif (!validate_email($email)) {
        $errors[] = 'Please enter a valid email address';
    }
    
    if (empty($subject)) {
        $errors[] = 'Subject is required';
    }
    
    if (empty($message)) {
        $errors[] = 'Message is required';
    }
    
    // Additional security checks
    if (strlen($name) > 100) {
        $errors[] = 'Name is too long';
    }
    
    if (strlen($subject) > 200) {
        $errors[] = 'Subject is too long';
    }
    
    if (strlen($message) > 2000) {
        $errors[] = 'Message is too long';
    }
    
    // Check for spam (basic honeypot)
    if (isset($_POST['website']) && !empty($_POST['website'])) {
        $errors[] = 'Spam detected';
    }
    
    // Rate limiting (basic implementation)
    $ip_address = $_SERVER['REMOTE_ADDR'];
    $rate_limit_file = 'rate_limit_' . md5($ip_address) . '.txt';
    $current_time = time();
    
    if (file_exists($rate_limit_file)) {
        $last_submission = file_get_contents($rate_limit_file);
        if ($current_time - $last_submission < 300) { // 5 minutes
            $errors[] = 'Please wait before sending another message';
        }
    }
    
    // If no errors, process the form
    if (empty($errors)) {
        // Log to database
        $db_success = log_contact($name, $email, $subject, $message, $ip_address);
        
        // Prepare email content
        $email_subject = "New Contact Form Submission - $subject";
        $email_message = "
        <html>
        <head>
            <title>New Contact Form Submission</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #1a1a1a; color: white; padding: 20px; text-align: center; }
                .content { background: #f9f9f9; padding: 20px; }
                .field { margin-bottom: 15px; }
                .label { font-weight: bold; color: #1a1a1a; }
                .value { margin-top: 5px; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h2>New Contact Form Submission</h2>
                    <p>Arielle Pivonka Art Website</p>
                </div>
                <div class='content'>
                    <div class='field'>
                        <div class='label'>Name:</div>
                        <div class='value'>$name</div>
                    </div>
                    <div class='field'>
                        <div class='label'>Email:</div>
                        <div class='value'><a href='mailto:$email'>$email</a></div>
                    </div>
                    <div class='field'>
                        <div class='label'>Subject:</div>
                        <div class='value'>$subject</div>
                    </div>
                    <div class='field'>
                        <div class='label'>Message:</div>
                        <div class='value'>" . nl2br($message) . "</div>
                    </div>
                    <div class='field'>
                        <div class='label'>Submitted:</div>
                        <div class='value'>" . date('F j, Y \a\t g:i A') . "</div>
                    </div>
                    <div class='field'>
                        <div class='label'>IP Address:</div>
                        <div class='value'>$ip_address</div>
                    </div>
                </div>
            </div>
        </body>
        </html>";
        
        // Send email
        $email_sent = send_email($to_email, $email_subject, $email_message, $from_email);
        
        // Update rate limit
        file_put_contents($rate_limit_file, $current_time);
        
        if ($email_sent) {
            $success = true;
            
            // Send auto-reply to user
            $auto_reply_subject = "Thank you for contacting Arielle Pivonka";
            $auto_reply_message = "
            <html>
            <head>
                <title>Thank you for your message</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #1a1a1a; color: white; padding: 20px; text-align: center; }
                    .content { background: #f9f9f9; padding: 20px; }
                </style>
            </head>
            <body>
                <div class='container'>
                    <div class='header'>
                        <h2>Thank You!</h2>
                    </div>
                    <div class='content'>
                        <p>Dear $name,</p>
                        <p>Thank you for reaching out to Arielle Pivonka. Your message has been received and we will get back to you as soon as possible.</p>
                        <p>We appreciate your interest in contemporary art and look forward to connecting with you.</p>
                        <p>Best regards,<br>Arielle Pivonka Art Team</p>
                    </div>
                </div>
            </body>
            </html>";
            
            send_email($email, $auto_reply_subject, $auto_reply_message, $from_email);
        } else {
            $errors[] = 'Failed to send message. Please try again later.';
        }
    }
    
    // Return JSON response for AJAX
    if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest') {
        header('Content-Type: application/json');
        echo json_encode([
            'success' => $success,
            'errors' => $errors,
            'message' => $success ? 'Message sent successfully!' : 'Please correct the errors below.'
        ]);
        exit;
    }
    
    // Redirect back to contact page with status
    $redirect_url = 'index.html#contact';
    if ($success) {
        $redirect_url .= '?success=1';
    } else {
        $redirect_url .= '?error=' . urlencode(implode(', ', $errors));
    }
    
    header("Location: $redirect_url");
    exit;
}

// If accessed directly, redirect to main page
header('Location: index.html');
exit;
?>
