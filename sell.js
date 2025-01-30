document.addEventListener('DOMContentLoaded', () => {
    const sellCarForm = document.getElementById('sellCarForm');
    const sellMessageDiv = document.getElementById('sellMessage');

    sellCarForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent form from default submission

        const formData = new FormData(sellCarForm);

        try {
            const response = await fetch('/api/sell', {
                method: 'POST',
                body: formData,
                // headers: {
                //  'Content-Type': 'multipart/form-data' // Removing this header
                // }
            });

            const data = await response.json(); // Parse JSON response
             if (response.ok) {
                sellMessageDiv.textContent = data.message || 'Car listed successfully!';
                sellMessageDiv.style.color = 'green';
            } else {
                sellMessageDiv.textContent = `Error: ${data.message || 'Failed to list car.'}`;
                sellMessageDiv.style.color = 'red';
            }
        } catch (error) {
            sellMessageDiv.textContent = 'An unexpected error occurred.';
            sellMessageDiv.style.color = 'red';
            console.error("Error during submission", error);
        }
    });
});