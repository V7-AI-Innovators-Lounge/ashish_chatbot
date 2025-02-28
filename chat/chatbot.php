<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

require_once "config.php";

$API_KEY = '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'; 

// Hugging Face API URL
$API_URL = "https://api-inference.huggingface.co/models/google/flan-t5-large";

// Get the JSON input from frontend
$input = json_decode(file_get_contents("php://input"), true);
$userMessage = $input["message"] ?? "";

// Check if message is empty
if (empty($userMessage)) {
    echo json_encode(["response" => "Invalid input"]);
    exit;
}

// Prepare request to Hugging Face API
$options = [
    "http" => [
        "header" => "Authorization: Bearer " . $API_KEY . "\r\n" .
                    "Content-Type: application/json\r\n",
        "method" => "POST",
        "content" => json_encode(["inputs" => "Answer this question: " . $userMessage, "parameters" => ["max_length" => 500]])
    ]
];

// Make the API request
$context = stream_context_create($options);
$result = file_get_contents($API_URL, false, $context);

if ($result === FALSE) {
    echo json_encode(["response" => "API request failed"]);
} else {
    echo json_encode(["response" => json_decode($result, true)[0]["generated_text"] ?? "No response"]);
}
?>
