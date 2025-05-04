;(() => {
  // Simple analytics tracking function
  function trackEvent(category, action, label, value) {
    // Check if dataLayer exists (for Google Tag Manager)
    if (window.dataLayer) {
      window.dataLayer.push({
        event: "navshiksha_event",
        eventCategory: category,
        eventAction: action,
        eventLabel: label,
        eventValue: value,
      })
    }

    // You can add additional analytics providers here
    console.log(`Analytics: ${category} - ${action} - ${label} - ${value}`)
  }

  // Track page views
  function trackPageView(path) {
    const title = document.title
    const url = path || window.location.pathname

    trackEvent("pageview", url, title)
  }

  // Initialize analytics
  function init() {
    // Track initial page view
    trackPageView()

    // Track performance metrics
    if (window.performance && window.performance.getEntriesByType) {
      const perfEntries = window.performance.getEntriesByType("navigation")
      if (perfEntries.length > 0) {
        const timing = perfEntries[0]
        trackEvent("performance", "page_load", "duration", Math.round(timing.duration))
        trackEvent("performance", "dom_interactive", "timing", Math.round(timing.domInteractive))
        trackEvent("performance", "dom_complete", "timing", Math.round(timing.domComplete))
      }
    }

    // Set up event listeners for user interactions
    document.addEventListener("click", (e) => {
      // Track button clicks
      if (e.target.tagName === "BUTTON" || (e.target.tagName === "A" && e.target.getAttribute("role") === "button")) {
        const buttonText = e.target.textContent.trim()
        const buttonId = e.target.id || "unknown"
        trackEvent("interaction", "button_click", buttonId, buttonText)
      }
    })
  }

  // Expose analytics API to global scope
  window.navshikshaAnalytics = {
    trackEvent: trackEvent,
    trackPageView: trackPageView,
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init)
  } else {
    init()
  }
})()
