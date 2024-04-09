# `event-countdown`

A Web Component to display an event countdown.

**[Demo](https://chrisburnell.github.io/event-countdown/demo.html)** | **[Further reading](https://chrisburnell.com/event-countdown/)**

## Usage

### General usage example

```html
<script type="module" src="event-countdown.js"></script>

<event-countdown name="My event" start="2024-04-09T00:00:00+14:00"></event-countdown>
```

### With end point

```html
<script type="module" src="event-countdown.js"></script>

<event-countdown name="My event" end="2024-04-09T23:59:59-12:00"></event-countdown>
```

### Both start and end points

```html
<script type="module" src="event-countdown.js"></script>

<event-countdown name="My event" start="2024-04-09T00:00:00+14:00" end="2024-04-09T23:59:59-12:00"></event-countdown>
```

### Annual events

```html
<script type="module" src="event-countdown.js"></script>

<event-countdown name="My event" start="2024-04-09T00:00:00+14:00"annual="true"></event-countdown>
```

### Update frequency

```html
<script type="module" src="event-countdown.js"></script>

<!-- Updates every 1 second -->
<event-countdown name="My event" start="2024-04-09T00:00:00+14:00" update="1"></event-countdown>

<!-- Disable updates -->
<event-countdown name="My event" start="2024-04-09T00:00:00+14:00" update="false"></event-countdown>
```

### Specific division

```html
<script type="module" src="event-countdown.js"></script>

<event-countdown name="My event" start="2024-04-09T00:00:00+14:00" division="second"></event-countdown>
```

### Maximum division

```html
<script type="module" src="event-countdown.js"></script>

<event-countdown name="My event" start="2024-04-09T00:00:00+14:00" max-division="minute"></event-countdown>
```

## Installation

You have a few options (choose one of these):

1. Install via [npm](https://www.npmjs.com/package/@chrisburnell/event-countdown): `npm install @chrisburnell/event-countdown`
1. [Download the source manually from GitHub](https://github.com/chrisburnell/event-countdown/releases) into your project.
1. Skip this step and use the script directly via a 3rd party CDN (not recommended for production use)

## Usage

Make sure you include the `<script>` in your project (choose one of these):

```html
<!-- Host yourself -->
<script type="module" src="event-countdown.js"></script>
```

```html
<!-- 3rd party CDN, not recommended for production use -->
<script
  type="module"
  src="https://www.unpkg.com/@chrisburnell/event-countdown/event-countdown.js"
></script>
```

```html
<!-- 3rd party CDN, not recommended for production use -->
<script
  type="module"
  src="https://esm.sh/@chrisburnell/event-countdown"
></script>
```

## Credit

With thanks to the following people:

- [David Darnes](https://darn.es) for creating this [Web Component repo template](https://github.com/daviddarnes/component-template)
