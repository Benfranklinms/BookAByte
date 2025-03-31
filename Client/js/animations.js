/**
 * BookABite - Animations
 *
 * This file handles all animations using GSAP and custom JavaScript
 */

import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

document.addEventListener("DOMContentLoaded", () => {
  // Initialize GSAP animations if GSAP is available
  if (typeof gsap !== "undefined") {
    initGSAPAnimations()
  } else {
    // Fallback to basic animations if GSAP is not available
    initBasicAnimations()
  }
})

/**
 * Initialize GSAP animations
 */
function initGSAPAnimations() {
  // Hero section animations
  const heroTimeline = gsap.timeline()

  heroTimeline
    .from(".hero h1", {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
    })
    .from(
      ".hero p",
      {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      },
      "-=0.5",
    )
    .from(
      ".hero .btn",
      {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      },
      "-=0.5",
    )

  // Section headers animation
  gsap.utils.toArray(".section-header").forEach((header) => {
    gsap.from(header, {
      scrollTrigger: {
        trigger: header,
        start: "top 80%",
        toggleActions: "play none none none",
      },
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
    })
  })

  // Steps animation
  gsap.utils.toArray(".step").forEach((step, index) => {
    gsap.from(step, {
      scrollTrigger: {
        trigger: step,
        start: "top 80%",
        toggleActions: "play none none none",
      },
      y: 30,
      opacity: 0,
      duration: 0.8,
      delay: index * 0.2,
      ease: "power3.out",
    })
  })

  // Restaurant cards animation
  gsap.utils.toArray(".restaurant-card").forEach((card, index) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: "top 90%",
        toggleActions: "play none none none",
      },
      y: 30,
      opacity: 0,
      duration: 0.8,
      delay: index * 0.1,
      ease: "power3.out",
    })
  })

  // Testimonial cards animation
  gsap.utils.toArray(".testimonial-card").forEach((card, index) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: "top 90%",
        toggleActions: "play none none none",
      },
      y: 30,
      opacity: 0,
      duration: 0.8,
      delay: index * 0.1,
      ease: "power3.out",
    })
  })

  // CTA section animation
  gsap.from(".cta-content", {
    scrollTrigger: {
      trigger: ".cta-section",
      start: "top 70%",
      toggleActions: "play none none none",
    },
    y: 30,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out",
  })

  // Animate the reservation button pulse effect
  gsap.to(".btn-lg.animate-pulse", {
    scale: 1.05,
    duration: 1,
    repeat: -1,
    yoyo: true,
    ease: "power1.inOut",
  })
}

/**
 * Initialize basic animations (fallback if GSAP is not available)
 */
function initBasicAnimations() {
  // Add animation classes to elements
  const animateElements = document.querySelectorAll(
    ".animate-fade-in, .animate-slide-up, .animate-slide-down, .animate-slide-left, .animate-slide-right",
  )

  // Create an Intersection Observer
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1"
          entry.target.style.transform = "translate(0, 0)"
          observer.unobserve(entry.target)
        }
      })
    },
    {
      threshold: 0.1,
    },
  )

  // Observe each element
  animateElements.forEach((element) => {
    // Set initial styles
    element.style.opacity = "0"
    element.style.transition = "opacity 0.8s ease, transform 0.8s ease"

    if (element.classList.contains("animate-slide-up")) {
      element.style.transform = "translateY(30px)"
    } else if (element.classList.contains("animate-slide-down")) {
      element.style.transform = "translateY(-30px)"
    } else if (element.classList.contains("animate-slide-left")) {
      element.style.transform = "translateX(-30px)"
    } else if (element.classList.contains("animate-slide-right")) {
      element.style.transform = "translateX(30px)"
    }

    // Add delay if specified
    const delay = element.getAttribute("data-delay")
    if (delay) {
      element.style.transitionDelay = `${delay}s`
    }

    observer.observe(element)
  })
}

/**
 * Animate element entrance
 * @param {HTMLElement} element - Element to animate
 * @param {string} animation - Animation class to apply
 */
function animateElement(element, animation) {
  if (!element) return

  element.classList.add(animation)

  // Remove animation class after animation completes
  element.addEventListener("animationend", () => {
    element.classList.remove(animation)
  })
}

/**
 * Animate element entrance with delay
 * @param {HTMLElement} element - Element to animate
 * @param {string} animation - Animation class to apply
 * @param {number} delay - Delay in milliseconds
 */
function animateElementWithDelay(element, animation, delay) {
  if (!element) return

  setTimeout(() => {
    animateElement(element, animation)
  }, delay)
}

// Export functions for use in other files
window.animateElement = animateElement
window.animateElementWithDelay = animateElementWithDelay

