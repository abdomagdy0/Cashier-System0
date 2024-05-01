<?php

// Database connection details (replace with your actual credentials)
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

// Define the SQL query
$query = "SELECT item_name, item_price FROM items WHERE category = 'FOOD' ";

// Execute the query
$result = $conn->query($query);

// Check for query execution error
if (!$result) {
  die("Error: " . $conn->error);
}


class Product
{
  public $item_name;
  public $item_price;

  public function __construct($name, $price)
  {
    $this->item_name = $name;
    $this->item_price = $price;
  }
}

// Prepare the response array
$products = array();

// Loop through food items and build the response
if ($result->num_rows > 0) {
  while ($row = $result->fetch_assoc()) {
    $product = new Product($row['item_name'], $row['item_price']);
    $products[] = $product;
  }
}

// Check if HTTP method is GET
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  // Encode data to JSON format
  $json = json_encode($products, JSON_UNESCAPED_UNICODE);

  // Set content type header to JSON
  header('Content-Type: application/json');

  // Print JSON data
  echo $json;
  exit();
} else {
  // Return error message for non-GET requests
  header('HTTP/1.1 405 Method Not Allowed');
  echo "This endpoint only accepts GET requests.";
  exit();
}
