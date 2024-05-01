<?php

// Check if HTTP method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the request body
    $request_body = file_get_contents("php://input");

    // Decode the JSON data into an array of associative arrays
    $data = json_decode($request_body, true);

    // Check if JSON data was successfully decoded
    if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
        // Return error message for invalid JSON
        header('HTTP/1.1 400 Bad Request');
        echo "Invalid JSON data.";
        exit();
    }

    // Database connection parameters
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "cashiersystem";

    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Prepare SQL statement to insert data into orders table
    $stmt = $conn->prepare("INSERT INTO orders (item_name, price, quantity, total_price) VALUES (?, ?, ?, ?)");

    // Iterate through each object in the array and insert into the database
    foreach ($data as $item) {
        // Check if required fields are provided
        if (isset($item['item_name']) && isset($item['price']) && isset($item['quantity'])) {
            // Calculate total price
            $total_price = $item['price'] * $item['quantity'];

            // Bind parameters and execute SQL statement for each order
            $stmt->bind_param("sddd", $item['item_name'], $item['price'], $item['quantity'], $total_price);
            $stmt->execute();
        } else {
            // Return error message for missing fields
            header('HTTP/1.1 400 Bad Request');
            echo "Missing required fields.";
            exit();
        }
    }

    // Close statement and connection
    $stmt->close();
    $conn->close();

    // Return success message
    header('Content-Type: application/json');
    echo json_encode(array("message" => "Orders created successfully"));
    exit();
} else {
    // Return error message for non-POST requests
    header('HTTP/1.1 405 Method Not Allowed');
    echo "This endpoint only accepts POST requests.";
    exit();
}
