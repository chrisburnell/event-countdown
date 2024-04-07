class EventCountdown extends HTMLElement {
	static register(tagName) {
		if ("customElements" in window) {
			customElements.define(tagName || "event-countdown", EventCountdown)
		}
	}

	static locale = document.querySelector("html").getAttribute("lang") || navigator.languages ? navigator.languages[0] : "en"

	static rtf = new Intl.RelativeTimeFormat(EventCountdown.locale, {
		localeMatcher: "best fit",
		numeric: "always",
		style: "long",
	})

	static divisions = [
		{
			amount: 60,
			name: "second",
		},
		{
			amount: 60,
			name: "minute",
		},
		{
			amount: 24,
			name: "hour",
		},
		{
			amount: 7,
			name: "day",
		},
		{
			amount: 4.34524,
			name: "week",
		},
		{
			amount: 12,
			name: "month",
		},
		{
			amount: Number.POSITIVE_INFINITY,
			name: "year",
		},
	]

	connectedCallback() {
		if (!this.getAttribute("name")) {
			console.error(`Missing \`name\` attribute!`, this)
			return
		}

		if (!this.getAttribute("start")) {
			console.error(`Missing \`start\` attribute!`, this)
			return
		}

		this.interval

		if (!this.initialized) {
			this.init()
		}
	}

	setString() {
		this.innerHTML = this.getString()
	}

	init() {
		this.initialized = true

		this.setString()

		this.startInterval()
		window.addEventListener("focus", () => {
			this.windowFocusHandler()
		})
		window.addEventListener("blur", () => {
			this.stopInterval()
		})
	}

	getRelativeTime(datetime) {
		let difference = (datetime.getTime() - Date.now()) / 1000

		for (const division of EventCountdown.divisions) {
			if (Math.floor(Math.abs(difference)) < division.amount) {
				return EventCountdown.rtf.format(Math.round(difference), division.name)
			}
			difference /= division.amount
		}
	}

	getString() {
		const nowEpoch = Date.now()

		const name = this.getAttribute("name")
		let start = new Date(this.getAttribute("start"))
		let end = this.hasAttribute("end") ? new Date(this.getAttribute("end")) : null

		// If this is an annual event and the start/end point has passed
		if (this.getAttribute("annual") === "true" && (end || start).getTime() < nowEpoch) {
			start.setFullYear(start.getFullYear() + 1)
			if (end) {
				end.setFullYear(end.getFullYear() + 1)
			}
		}

		if (nowEpoch < start.getTime()) {
			// Before start point
			return `${name} is starting <time datetime="${start.toISOString()}" title="${start.toLocaleString()}">${this.getRelativeTime(start)}</time>.`
		} else if (end) {
			// Has end point
			if (start.getTime() < nowEpoch && nowEpoch < end.getTime()) {
				// Between start and end points
				return `${name} started <time datetime="${start.toISOString()}" title="${start.toLocaleString()}">${this.getRelativeTime(start)}</time> and ends <time datetime="${end.toISOString()}" title="${end.toLocaleString()}">${this.getRelativeTime(end)}</time>.`
			} else if (end.getTime() < nowEpoch) {
				// Past end point
				return `${name} ended <time datetime="${end.toISOString()}" title="${end.toLocaleString()}">${this.getRelativeTime(end)}</time>.`
			}
		}
		// Past start point, no end point
		return `${name} started <time datetime="${start.toISOString()}" title="${start.toLocaleString()}">${this.getRelativeTime(start)}</time>.`
	}

	startInterval() {
		this.interval = setInterval(
			() => {
				this.setString()
				this.startInterval()
			},
			10 * 60 * 1000 // every 10 minutes
		)
	}

	stopInterval() {
		clearInterval(this.interval)
	}

	windowFocusHandler() {
		this.stopInterval()
		this.setString()
		this.startInterval()
	}
}

EventCountdown.register()
