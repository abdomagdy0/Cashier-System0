const today = new Date();
function getNumericDate() {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0'); 
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); 
    return { day, month };
  }
  
  function clock() {
    const dateObject = getNumericDate(); // Call the function to get numeric date
  
    document.getElementById('day').textContent = dateObject.day;
    document.getElementById('year').textContent = today.getFullYear();
    document.getElementById('month').textContent = dateObject.month;
  }
  
  // Call the function when the page loads
  clock();
  
  // Update the date every 400 milliseconds (optional)
  var interval = setInterval(clock, 400);




