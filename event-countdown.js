class EventCountdown extends HTMLElement {
	static register(tagName) {
		if ("customElements" in window) {
			customElements.define(tagName || "event-countdown", EventCountdown)
		}
	}

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

		if (!this.hasAttribute("start") && !this.hasAttribute("end")) {
			console.error(`Missing \`start\` or \`end\` attribute!`, this)
			return
		}

		if (this.hasAttribute("start") && this.hasAttribute("end")) {
			if (new Date(this.getAttribute("end")).getTime() < new Date(this.getAttribute("start"))) {
				console.error(`The \`end\` attribute must represent a date that comes chronologically after the \`start\` attribute!`, this)
				return
			}
		}

		if (!this.initialized) {
			this.init()
		}
	}

	init() {
		this.initialized = true

		this.name = this.getAttribute("name")
		this.start = this.hasAttribute("start") ? new Date(this.getAttribute("start")) : null
		this.end = this.hasAttribute("end") ? new Date(this.getAttribute("end")) : null
		this.annual = this.getAttribute("annual") === "true"
		this.division = this.getAttribute("division")
		this.maxDivision = this.getAttribute("max-division")
		this.update = this.hasAttribute("update") ? Number(this.getAttribute("update")) : 600 // 10 minutes
		this.lastUpdate = 0
		this.enableUpdates = this.getAttribute("update") !== "false"
		this.startFuture = this.getAttribute("start-future") || " starts "
		this.startPast = this.getAttribute("start-past") || " started "
		this.endFuture = this.getAttribute("end-future") || " ends "
		this.endPast = this.getAttribute("end-past") || " ended "
		this.conjunction = this.getAttribute("conjunction") || " and "
		this.updateLoop

		this.setString()

		if (this.enableUpdates) {
			this.beginUpdateLoop()
			window.addEventListener("blur", () => {
				this.windowBlurHandler()
			})
			window.addEventListener("focus", () => {
				this.windowFocusHandler()
			})
		}
	}

	getRelativeTime(datetime, division) {
		let difference = (datetime.getTime() - Date.now()) / 1000

		if (division) {
			return this.rtf.format(Math.round(difference), division)
		}

		for (const division of EventCountdown.divisions) {
			if (this.maxDivision && division.name === this.maxDivision) {
				return this.rtf.format(Math.round(difference), division.name)
			}
			if (Math.floor(Math.abs(difference)) < division.amount) {
				return this.rtf.format(Math.round(difference), division.name)
			}
			difference /= division.amount
		}
	}

	getString() {
		const nowEpoch = Date.now()

		// If this is an annual event, set the year to the current year
		if (this.annual) {
			if (this.start) {
				this.start.setFullYear(new Date().getFullYear())
			}
			if (this.end) {
				this.end.setFullYear(new Date().getFullYear())
			}
			// If the end/start have passed, increment the year
			if ((this.end || this.start).getTime() < nowEpoch) {
				if (this.start) {
					this.start.setFullYear(this.start.getFullYear() + 1)
				}
				if (this.end) {
					this.end.setFullYear(this.end.getFullYear() + 1)
				}
			}
		}

		if (this.start && this.end && this.start.getTime() < nowEpoch && nowEpoch < this.end.getTime()) {
			// Between start and end
			return `${this.name}${this.startPast}<time datetime="${this.start.toISOString()}" title="${this.start.toLocaleString()}">${this.getRelativeTime(this.start, this.division)}</time>${(this.conjunction + this.endFuture).replace(/ +/g, " ")}<time datetime="${this.end.toISOString()}" title="${this.end.toLocaleString()}">${this.getRelativeTime(this.end, this.division)}</time>.`
		} else if (this.start && nowEpoch < this.start.getTime()) {
			// Before start
			return `${this.name}${this.startFuture}<time datetime="${this.start.toISOString()}" title="${this.start.toLocaleString()}">${this.getRelativeTime(this.start, this.division)}</time>.`
		} else if (this.start && !this.end) {
			// After start
			return `${this.name}${this.startPast}<time datetime="${this.start.toISOString()}" title="${this.start.toLocaleString()}">${this.getRelativeTime(this.start, this.division)}</time>.`
		} else if (nowEpoch < this.end.getTime()) {
			// Before end
			return `${this.name}${this.endFuture}<time datetime="${this.end.toISOString()}" title="${this.end.toLocaleString()}">${this.getRelativeTime(this.end, this.division)}</time>.`
		}
		// After end
		return `${this.name}${this.endPast}<time datetime="${this.end.toISOString()}" title="${this.end.toLocaleString()}">${this.getRelativeTime(this.end, this.division)}</time>.`
	}

	setString() {
		this.innerHTML = this.getString()
	}

	beginUpdateLoop() {
		const updateLoop = (currentTime) => {
			this.updateLoop = requestAnimationFrame(updateLoop)
			if (currentTime - this.lastUpdate >= this.update * 1000) {
				this.setString()
				this.lastUpdate = currentTime
			}
		}
		this.updateLoop = requestAnimationFrame(updateLoop)
	}

	stopUpdateLoop() {
		this.lastUpdate = 0
		cancelAnimationFrame(this.updateLoop)
	}

	windowBlurHandler() {
		this.stopUpdateLoop()
	}

	windowFocusHandler() {
		this.setString()
		this.beginUpdateLoop()
	}

	get locale() {
		return this.getAttribute("lang") || this.closest("[lang]")?.getAttribute("lang") || (navigator.languages ? navigator.languages[0] : "en")
	}

	get rtf() {
		return new Intl.RelativeTimeFormat(this.locale, {
			localeMatcher: "best fit",
			numeric: "always",
			style: "long",
		})
	}
}

EventCountdown.register()
