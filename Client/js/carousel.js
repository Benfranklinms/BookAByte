document.addEventListener("DOMContentLoaded", () => {
  // Restaurant Carousel
  initCarousel(".restaurant-carousel", createRestaurantCards);

  // Testimonial Carousel
  initCarousel(".testimonial-carousel", createTestimonialCards);

  function initCarousel(carouselSelector, createCardsFunction) {
    const carousel = document.querySelector(carouselSelector);
    if (!carousel) return;

    const track = carousel.querySelector(".carousel-track");
    const prevBtn = carousel.querySelector(".prev-btn");
    const nextBtn = carousel.querySelector(".next-btn");
    const indicatorsContainer = carousel.nextElementSibling;

    // Create cards and add to track
    createCardsFunction(track);

    // Get all cards
    const cards = track.querySelectorAll(".restaurant-card, .testimonial-card");
    if (cards.length === 0) return;

    // Calculate how many cards to show based on screen width
    let cardsToShow = 3;
    if (window.innerWidth < 768) {
      cardsToShow = 1;
    } else if (window.innerWidth < 1024) {
      cardsToShow = 2;
    }

    // Set track width
    const cardWidth = 100 / cardsToShow;
    cards.forEach((card) => {
      card.style.flex = `0 0 ${cardWidth}%`;
    });

    // Create indicators
    const totalSlides = Math.ceil(cards.length / cardsToShow);
    for (let i = 0; i < totalSlides; i++) {
      const indicator = document.createElement("div");
      indicator.classList.add("indicator");
      if (i === 0) indicator.classList.add("active");
      indicatorsContainer.appendChild(indicator);

      // Add click event to indicator
      indicator.addEventListener("click", () => {
        currentIndex = i;
        updateCarousel();
      });
    }

    // Initialize variables
    let currentIndex = 0;
    const indicators = indicatorsContainer.querySelectorAll(".indicator");

    // Add event listeners to buttons
    prevBtn.addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      }
    });

    nextBtn.addEventListener("click", () => {
      if (currentIndex < totalSlides - 1) {
        currentIndex++;
        updateCarousel();
      }
    });

    // Update carousel position and indicators
    function updateCarousel() {
      const translateX = -currentIndex * 100; // Move by 100% for each slide
      track.style.transform = `translateX(${translateX}%)`;

      // Update indicators
      indicators.forEach((indicator, index) => {
        if (index === currentIndex) {
          indicator.classList.add("active");
        } else {
          indicator.classList.remove("active");
        }
      });

      // Update button states
      prevBtn.style.opacity = currentIndex === 0 ? "0.5" : "1";
      nextBtn.style.opacity = currentIndex === totalSlides - 1 ? "0.5" : "1";
    }

    // Initial update
    updateCarousel();

    // Handle window resize
    window.addEventListener("resize", () => {
      // Recalculate cardsToShow
      let newCardsToShow = 3;
      if (window.innerWidth < 768) {
        newCardsToShow = 1;
      } else if (window.innerWidth < 1024) {
        newCardsToShow = 2;
      }

      // Only update if cardsToShow has changed
      if (newCardsToShow !== cardsToShow) {
        cardsToShow = newCardsToShow;

        // Update card widths
        const newCardWidth = 100 / cardsToShow;
        cards.forEach((card) => {
          card.style.flex = `0 0 ${newCardWidth}%`;
        });

        // Recalculate total slides
        const newTotalSlides = Math.ceil(cards.length / cardsToShow);

        // Adjust currentIndex if needed
        if (currentIndex >= newTotalSlides) {
          currentIndex = newTotalSlides - 1;
        }

        // Update carousel
        updateCarousel();
      }
    });

    // Auto-scroll functionality
    setInterval(() => {
      currentIndex = (currentIndex + 1) % totalSlides;
      updateCarousel();
    }, 5000); // Change slides every 5 seconds (slower)
  }

  // Create restaurant cards
  function createRestaurantCards(container) {
    const restaurants = [
      {
        name: "The Italian Place",
        image:
          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
        cuisine: "Italian",
        rating: 4.8,
        description: "Authentic Italian cuisine in a cozy atmosphere.",
      },
      {
        name: "Sushi Master",
        image:
          "https://images.unsplash.com/photo-1579027989536-b7b1f875659b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c3VzaGl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
        cuisine: "Japanese",
        rating: 4.7,
        description: "Premium sushi and Japanese dishes made with fresh ingredients.",
      },
      {
        name: "Burger Joint",
        image:
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnVyZ2VyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
        cuisine: "American",
        rating: 4.5,
        description: "Juicy burgers and crispy fries in a casual setting.",
      },
      {
        name: "Taco Fiesta",
        image:
          "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGFjb3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
        cuisine: "Mexican",
        rating: 4.6,
        description: "Authentic Mexican tacos and refreshing margaritas.",
      },
      {
        name: "The Steakhouse",
        image:
          "https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3RlYWt8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
        cuisine: "Steakhouse",
        rating: 4.9,
        description: "Premium steaks cooked to perfection.",
      },
      {
        name: "Seafood Harbor",
        image:
          "https://images.unsplash.com/photo-1579631542720-3a87824fff86?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2VhZm9vZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
        cuisine: "Seafood",
        rating: 4.7,
        description: "Fresh seafood with a beautiful waterfront view.",
      },
    ];

    restaurants.forEach((restaurant) => {
      const card = document.createElement("div");
      card.className = "restaurant-card";

      card.innerHTML = `
                <div class="restaurant-image">
                    <img src="${restaurant.image}" alt="${restaurant.name}">
                </div>
                <div class="restaurant-info">
                    <h3>${restaurant.name}</h3>
                    <div class="restaurant-meta">
                        <div class="restaurant-rating">
                            <i class="fas fa-star"></i>
                            <span>${restaurant.rating}</span>
                        </div>
                        <div class="restaurant-cuisine">
                            <i class="fas fa-utensils"></i>
                            <span>${restaurant.cuisine}</span>
                        </div>
                    </div>
                    <p class="restaurant-description">${restaurant.description}</p>
                    <a href="reservation.html" class="btn btn-primary">Book a Table</a>
                </div>
            `;

      container.appendChild(card);
    });
  }

  // Create testimonial cards
  function createTestimonialCards(container) {
    const testimonials = [
      {
        name: "John Smith",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        rating: 5,
        text: "BookABite made finding and reserving a table so easy! The interface is intuitive, and I received instant confirmation. Will definitely use again!",
      },
      {
        name: "Emily Johnson",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        rating: 5,
        text: "I love how easy it is to discover new restaurants through BookABite. The reservation process is seamless, and I appreciate the reminder notifications.",
      },
      {
        name: "Michael Brown",
        avatar: "https://randomuser.me/api/portraits/men/22.jpg",
        rating: 4,
        text: "Great platform for finding available tables at popular restaurants. The only reason I'm not giving 5 stars is because I wish there were more filter options.",
      },
      {
        name: "Sarah Wilson",
        avatar: "https://randomuser.me/api/portraits/women/63.jpg",
        rating: 5,
        text: "BookABite has transformed how I dine out. No more waiting on hold to make a reservation! The customer service is also excellent when I needed to modify my booking.",
      },
    ];

    testimonials.forEach((testimonial) => {
      const card = document.createElement("div");
      card.className = "testimonial-card";

      let stars = "";
      for (let i = 1; i <= 5; i++) {
        if (i <= testimonial.rating) {
          stars += '<i class="fas fa-star"></i>';
        } else {
          stars += '<i class="far fa-star"></i>';
        }
      }

      card.innerHTML = `
                <div class="testimonial-header">
                    <div class="testimonial-avatar">
                        <img src="${testimonial.avatar}" alt="${testimonial.name}">
                    </div>
                    <div class="testimonial-author">
                        <h4>${testimonial.name}</h4>
                        <div class="testimonial-rating">
                            ${stars}
                        </div>
                    </div>
                </div>
                <p class="testimonial-text">"${testimonial.text}"</p>
            `;

      container.appendChild(card);
    });
  }
});
