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
		if (!this.hasAttribute("name")) {
			console.error(`Missing \`name\` attribute!`, this)
			return
		}

		if (!this.hasAttribute("start")) {
			console.error(`Missing \`start\` attribute!`, this)
			return
		}

		if (this.hasAttribute("end")) {
			if (new Date(this.getAttribute("end")).getTime() < new Date(this.getAttribute("start"))) {
				console.error(`The \`start\` attribute must represent a date that comes chronologically before the \`end\` attribute!`, this)
				return
			}
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

		this.name = this.getAttribute("name")
		this.start = new Date(this.getAttribute("start"))
		this.end = this.hasAttribute("end") ? new Date(this.getAttribute("end")) : null
		this.annual = this.getAttribute("annual") === "true"
		this.update = this.hasAttribute("update") ? Number(this.getAttribute("update")) : 600
		this.enableUpdates = this.getAttribute("update") !== "false"
		this.division = this.getAttribute("division")
		this.maxDivision = this.getAttribute("max-division")

		this.setString()

		if (this.enableUpdates) {
			this.startInterval()
			window.addEventListener("focus", () => {
				this.windowFocusHandler()
			})
			window.addEventListener("blur", () => {
				this.stopInterval()
			})
		}
	}

	getRelativeTime(datetime, division) {
		let difference = (datetime.getTime() - Date.now()) / 1000

		if (division) {
			return EventCountdown.rtf.format(Math.round(difference), division)
		}

		for (const division of EventCountdown.divisions) {
			if (this.maxDivision && division.name === this.maxDivision) {
				return EventCountdown.rtf.format(Math.round(difference), division.name)
			}
			if (Math.floor(Math.abs(difference)) < division.amount) {
				return EventCountdown.rtf.format(Math.round(difference), division.name)
			}
			difference /= division.amount
		}
	}

	getString() {
		const nowEpoch = Date.now()

		// If this is an annual event and the start/end point has passed
		if (this.annual && (this.end || this.start).getTime() < nowEpoch) {
			this.start.setFullYear(this.start.getFullYear() + 1)
			if (this.end) {
				this.end.setFullYear(this.end.getFullYear() + 1)
			}
		}

		if (nowEpoch < this.start.getTime()) {
			// Before start point
			return `${this.name} is starting <time datetime="${this.start.toISOString()}" title="${this.start.toLocaleString()}">${this.getRelativeTime(this.start, this.division)}</time>.`
		} else if (this.end) {
			// Has end point
			if (this.start.getTime() < nowEpoch && nowEpoch < this.end.getTime()) {
				// Between start and end points
				return `${this.name} started <time datetime="${this.start.toISOString()}" title="${this.start.toLocaleString()}">${this.getRelativeTime(this.start, this.division)}</time> and ends <time datetime="${this.end.toISOString()}" title="${this.end.toLocaleString()}">${this.getRelativeTime(this.end, this.division)}</time>.`
			} else if (this.end.getTime() < nowEpoch) {
				// Past end point
				return `${this.name} ended <time datetime="${this.end.toISOString()}" title="${this.end.toLocaleString()}">${this.getRelativeTime(this.end, this.division)}</time>.`
			}
		}
		// Past start point, no end point
		return `${this.name} started <time datetime="${this.start.toISOString()}" title="${this.start.toLocaleString()}">${this.getRelativeTime(this.start, this.division)}</time>.`
	}

	startInterval() {
		this.interval = setInterval(
			() => {
				this.setString()
				this.startInterval()
			},
			this.update * 1000
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
