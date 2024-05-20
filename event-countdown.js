class EventCountdown extends HTMLElement {
	static register(tagName) {
		if ("customElements" in window) {
			customElements.define(tagName || "event-countdown", EventCountdown)
		}
	}

	connectedCallback() {
		if (!this.hasAttribute("name")) {
			console.error(`Missing \`name\` attribute!`, this)
			return
		}

		if (!this.getTimeElement("start") && !this.getTimeElement("end")) {
			console.error(`Missing \`start\` or \`end\` attribute!`, this)
			return
		}

		if (this.getTimeElement("start") && this.getTimeElement("end")) {
			if (new Date(this.getTimeElement("end").getAttribute("datetime")).getTime() < new Date(this.getTimeElement("start").getAttribute("datetime"))) {
				console.error(`The \`end\` attribute must represent a date that comes chronologically after the \`start\` attribute!`, this)
				return
			}
		}

		if (this.getTimeElement("start")) {
			this.setAttribute("start", this.getTimeElement("start").getAttribute("datetime"))
		}

		if (this.getTimeElement("end")) {
			this.setAttribute("end", this.getTimeElement("end").getAttribute("datetime"))
		}

		this.lastUpdate = 0
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
			return `${this.name}${this.startPast}<time start datetime="${this.start.toISOString()}" title="${this.start.toLocaleString()}">${this.getRelativeTime(this.start, this.division)}</time>${(this.conjunction + this.endFuture).replace(/ +/g, " ")}<time datetime="${this.end.toISOString()}" title="${this.end.toLocaleString()}">${this.getRelativeTime(this.end, this.division)}</time>${this.punctuation}`
		} else if (this.start && nowEpoch < this.start.getTime()) {
			// Before start
			return `${this.name}${this.startFuture}<time datetime="${this.start.toISOString()}" title="${this.start.toLocaleString()}">${this.getRelativeTime(this.start, this.division)}</time>${this.punctuation}`
		} else if (this.start && !this.end) {
			// After start
			return `${this.name}${this.startPast}<time datetime="${this.start.toISOString()}" title="${this.start.toLocaleString()}">${this.getRelativeTime(this.start, this.division)}</time>${this.punctuation}`
		} else if (nowEpoch < this.end.getTime()) {
			// Before end
			return `${this.name}${this.endFuture}<time datetime="${this.end.toISOString()}" title="${this.end.toLocaleString()}">${this.getRelativeTime(this.end, this.division)}</time>${this.punctuation}`
		}
		// After end
		return `${this.name}${this.endPast}<time datetime="${this.end.toISOString()}" title="${this.end.toLocaleString()}">${this.getRelativeTime(this.end, this.division)}</time>${this.punctuation}`
	}

	setString() {
		// Removes extra default punctuation at the end
		this.innerHTML = this.getString().replace(".</time>.", ".</time>")
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

	getTimeElement(type) {
		return this.querySelector(`time[datetime][${type}]`)
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

	static numericFormats = [
		"always",
		"auto",
	]

	static styleFormats = [
		"long",
		"short",
		"narrow",
	]

	get locale() {
		return this.getAttribute("lang") || this.closest("[lang]")?.getAttribute("lang") || (navigator.languages ? navigator.languages[0] : "en")
	}

	get rtf() {
		return new Intl.RelativeTimeFormat(this.locale, {
			localeMatcher: "best fit",
			numeric: this.formatNumeric,
			style: this.formatStyle,
		})
	}

	get name() {
		return this.getAttribute("name")
	}

	get start() {
		return this.hasAttribute("start") ? new Date(this.getAttribute("start")) : null
	}

	get end() {
		return this.hasAttribute("end") ? new Date(this.getAttribute("end")) : null
	}

	get annual() {
		return this.hasAttribute("annual") && this.getAttribute("annual") !== "false"
	}

	get division() {
		return this.getAttribute("division")
	}

	get maxDivision() {
		return this.getAttribute("max-division")
	}

	get formatNumeric() {
		// default = "auto"
		const numericFormat = this.getAttribute("format-numeric")
		if (this.doubleUp) {
			return "always"
		} else if (numericFormat && EventCountdown.numericFormats.includes(numericFormat)) {
			return numericFormat
		} else if (this.division || this.maxDivision) {
			return "always"
		}
		return "auto"
	}

	get formatStyle() {
		// default = "long"
		const styleFormat = this.getAttribute("format-style")
		if (styleFormat && EventCountdown.styleFormats.includes(styleFormat)) {
			return styleFormat
		}
		return "long"
	}

	get update() {
		// default = 600 seconds = 10 minutes
		return this.hasAttribute("update") ? Number(this.getAttribute("update")) : 600
	}

	get enableUpdates() {
		return this.getAttribute("update") !== "false"
	}

	get startFuture() {
		return this.getAttribute("start-future") ?? " starts "
	}

	get startPast() {
		return this.getAttribute("start-past") ?? " started "
	}

	get endFuture() {
		return this.getAttribute("end-future") ?? " ends "
	}

	get endPast() {
		return this.getAttribute("end-past") ?? " ended "
	}

	get conjunction() {
		return this.getAttribute("conjunction") ?? " and "
	}

	get punctuation() {
		return this.getAttribute("punctuation") ?? "."
	}
}

EventCountdown.register()
