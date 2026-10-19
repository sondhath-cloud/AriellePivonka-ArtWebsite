<?php
// Shared email sender for contact.php and commission.php.
// Sends through the Brevo API using the key in the Holy Smocks site's cms-config.local.php
// (this site is deployed at holysmocksartclub.com/ariellepivonka/, inside that site's folder).
// Falls back to PHP mail() if the key is missing or Brevo rejects the request.

// Function to read the Brevo API key from the parent site's config
function brevo_api_key() {
    $config_file = __DIR__ . '/../cms-config.local.php';
    if (!is_readable($config_file)) {
        return '';
    }
    $config = include $config_file;
    return is_array($config) ? trim((string) ($config['brevo_api_key'] ?? '')) : '';
}

// Function to send email (optional $reply_to for notifications so Arielle can reply to submitter)
function send_email($to, $subject, $message, $from, $reply_to = null) {
    global $site_name;
    $reply_to = $reply_to ?: $from;

    $api_key = brevo_api_key();
    if ($api_key !== '' && function_exists('curl_init')) {
        $payload = json_encode([
            'sender' => ['email' => $from, 'name' => $site_name],
            'to' => [['email' => $to]],
            'replyTo' => ['email' => $reply_to],
            'subject' => $subject,
            'htmlContent' => $message,
        ]);

        $ch = curl_init('https://api.brevo.com/v3/smtp/email');
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $payload,
            CURLOPT_HTTPHEADER => [
                'Accept: application/json',
                'Content-Type: application/json',
                'api-key: ' . $api_key,
            ],
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 15,
            CURLOPT_CONNECTTIMEOUT => 8,
        ]);
        $response = curl_exec($ch);
        $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curl_error = curl_error($ch);
        curl_close($ch);

        if ($response !== false && $status >= 200 && $status < 300) {
            return true;
        }
        error_log("Arielle mail: Brevo failed, falling back to mail() - HTTP $status $curl_error " . substr((string) $response, 0, 300));
    }

    $headers = "From: $site_name <$from>\r\n";
    $headers .= "Reply-To: $reply_to\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    return mail($to, $subject, $message, $headers, "-f$from");
}
