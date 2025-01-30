document.addEventListener('DOMContentLoaded', () => {
    // Constants for DOM Elements
    const BID_BUTTON_ID = 'bidButton';
    const BID_AMOUNT_INPUT_ID = 'bidAmount';
    const BIDDER_NAME_INPUT_ID = 'bidderName';
    const CURRENT_BID_ELEMENT_ID = 'currentBid';
    const BID_HISTORY_LIST_ID = 'bidHistory';
    const BID_MESSAGE_ID = 'bidMessage';

    const bidButton = document.getElementById(BID_BUTTON_ID);
    const bidAmountInput = document.getElementById(BID_AMOUNT_INPUT_ID);
    const bidderNameInput = document.getElementById(BIDDER_NAME_INPUT_ID);
    const currentBidElement = document.getElementById(CURRENT_BID_ELEMENT_ID);
    const bidHistoryList = document.getElementById(BID_HISTORY_LIST_ID);
    const bidMessageElement = document.getElementById(BID_MESSAGE_ID);
    const carListingsContainer = document.getElementById('carListings');
    const carTemplate = document.getElementById('carTemplate');


    let currentBid = 0.0;
    let bidHistory = JSON.parse(localStorage.getItem('bidHistory')) || [];

    // Function to fetch the car details
    const updateCarDetails = () => {
          fetch('/api/cars') // Fetch from the new endpoint
              .then(response => response.json())
              .then(data => {
                 carListingsContainer.innerHTML = ''; // Clear any previous content
                 if(data && data.length > 0) {
                    data.forEach(car => {
                       const carListing = carTemplate.content.cloneNode(true);
                       const carImage = carListing.querySelector('.car-image');
                       const carTitle = carListing.querySelector('.car-title');
                       const carYear = carListing.querySelector('.car-year');
                       const carMileage = carListing.querySelector('.car-mileage');
                       const carCondition = carListing.querySelector('.car-condition');
                       const carDescription = carListing.querySelector('.car-description');

                         carTitle.textContent = `${car.make} ${car.model}`;
                         carYear.textContent = car.year;
                         carMileage.textContent = car.mileage;
                         carCondition.textContent = car.condition;
                         carDescription.textContent = car.description;
                          if(car.imageUrls && car.imageUrls.length > 0) {
                           carImage.src = car.imageUrls[0];
                         }
                         carListingsContainer.appendChild(carListing);
                    })
                }

            })
                .catch(error => console.error('Error fetching car details:', error));

      };

      updateCarDetails();
      const clearBidMessage = () => {
        bidMessageElement.textContent = '';
        bidMessageElement.style.display = 'none';
      };

      const showBidMessage = (message, isError = true) => {
        bidMessageElement.textContent = message;
        bidMessageElement.style.display = 'block';
        bidMessageElement.style.color = isError ? '#d9534f' : 'green';

        // Hide the message after a few seconds
        setTimeout(clearBidMessage, 3000); // Reduced to 3 seconds
      };

      bidButton.addEventListener('click', () => {
        const bidAmount = parseFloat(bidAmountInput.value);
        const bidderName = bidderNameInput.value.trim();

        if (isNaN(bidAmount) || bidAmount <= currentBid || bidAmount < 0) {
          showBidMessage('Please enter a valid bid amount which is higher than the current bid.');
          return;
        }
        if (!bidderName) {
          showBidMessage('Please enter your name.');
          return;
        }

        // Store the current user (for future implementation of user login/session)
        const currentUser = bidderName;

        currentBid = bidAmount;
        currentBidElement.textContent = currentBid.toFixed(2);

        bidHistory.push({
          bidder: currentUser,
          amount: bidAmount,
        });
        updateBidHistory();
        showBidMessage('Bid Placed Successfully!', false);
        bidAmountInput.value = '';
        bidderNameInput.value = '';
      });

      const updateBidHistory = () => {
        bidHistoryList.innerHTML = ''; // Clear existing list
        const items = bidHistory.length > 0
          ? bidHistory.map(bid => `Bidder: ${bid.bidder} | Amount: $${bid.amount.toFixed(2)}`)
          : ['No bids yet'];
        items.forEach(text => {
          const li = document.createElement('li');
          li.textContent = text;
          bidHistoryList.appendChild(li);
        });
        localStorage.setItem('bidHistory', JSON.stringify(bidHistory)); // Save to localStorage
      };

      // Initial update
      updateBidHistory();
    });