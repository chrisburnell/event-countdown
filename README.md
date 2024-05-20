# `event-countdown`

A Web Component to display an event countdown.

**[Demo](https://chrisburnell.github.io/event-countdown/demo.html)** | **[Further reading](https://chrisburnell.com/event-countdown/)**

## Usage

### General usage example

```html
<script type="module" src="event-countdown.js"></script>

<event-countdown name="My event">My event starts on <time start datetime="2024-04-09T00:00:00+14:00">9 April 2024 00:00:00 UTC+14</time>.</event-countdown>
```

### With end point

```html
<script type="module" src="event-countdown.js"></script>

<event-countdown name="My event">My event ends on <time end datetime="2024-04-09T23:59:59-12:00">9 April 2024 23:59:59 UTC-12</time>.</event-countdown>
```

### Both start and end points

```html
<script type="module" src="event-countdown.js"></script>

<event-countdown name="My event" start="2024-04-09T00:00:00+14:00" end="2024-04-09T23:59:59-12:00">My event starts on <time start datetime="2024-04-09T00:00:00+14:00">9 April 2024 00:00:00 UTC+14</time> and ends on <time end datetime="2024-04-09T23:59:59-12:00">9 April 2024 23:59:59 UTC-12</time>.</event-countdown>
```

### Annual events

```html
<script type="module" src="event-countdown.js"></script>

<!-- Roll over to next year if event has passed -->
<event-countdown annual="true" name="My event">My event starts on <time start datetime="2024-04-09T00:00:00+14:00">9 April 2024 00:00:00 UTC+14</time>.</event-countdown>
```

### Update frequency

```html
<script type="module" src="event-countdown.js"></script>

<!-- Updates every 1 second -->
<event-countdown update="1" name="My event">My event starts on <time start datetime="2024-04-09T00:00:00+14:00">9 April 2024 00:00:00 UTC+14</time>.</event-countdown>

<!-- Disable updates -->
<event-countdown update="false" name="My event">My event starts on <time start datetime="2024-04-09T00:00:00+14:00">9 April 2024 00:00:00 UTC+14</time>.</event-countdown>
```

### Specific division

```html
<script type="module" src="event-countdown.js"></script>

<!-- Always format using seconds -->
<event-countdown division="second" name="My event">My event starts on <time start datetime="2024-04-09T00:00:00+14:00">9 April 2024 00:00:00 UTC+14</time>.</event-countdown>
```

### Maximum division

```html
<script type="module" src="event-countdown.js"></script>

<!-- Format using seconds up to minutes -->
<event-countdown max-division="minute" name="My event">My event starts on <time start datetime="2024-04-09T00:00:00+14:00">9 April 2024 00:00:00 UTC+14</time>.</event-countdown>
```

### Numeric format

```html
<script type="module" src="event-countdown.js"></script>

<!-- Automatically choose when to use numbers vs. words in formatting -->
<event-countdown format-numeric="auto" name="My event">My event starts on <time start datetime="2024-04-09T00:00:00+14:00">9 April 2024 00:00:00 UTC+14</time>.</event-countdown>

<!-- Always use numbers in time formatting -->
<event-countdown format-numeric="always" name="My event">My event starts on <time start datetime="2024-04-09T00:00:00+14:00">9 April 2024 00:00:00 UTC+14</time>.</event-countdown>
```

### Style format

```html
<script type="module" src="event-countdown.js"></script>

<!-- Long formatting (e.g. 1 second) -->
<event-countdown format-style="long" name="My event">My event starts on <time start datetime="2024-04-09T00:00:00+14:00">9 April 2024 00:00:00 UTC+14</time>.</event-countdown>

<!-- Short formatting (e.g. 1 sec.) -->
<event-countdown format-style="short" name="My event">My event starts on <time start datetime="2024-04-09T00:00:00+14:00">9 April 2024 00:00:00 UTC+14</time>.</event-countdown>

<!-- Narrow formatting (e.g. 1s) -->
<event-countdown format-style="narrow" name="My event">My event starts on <time start datetime="2024-04-09T00:00:00+14:00">9 April 2024 00:00:00 UTC+14</time>.</event-countdown>
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
