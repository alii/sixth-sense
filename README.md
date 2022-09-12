# sixth-sense

This library gives functions a sixth sense. It allows them to know when they're called, when they throw, and can even modify return values (_EVEN_ after the function has executed).

## Installation

```bash
npm install sixth-sense
```

## Usage

```javascript
import { sense } from "sixth-sense";

const add = sense(function (a, b) {
	// Listen for if the function throws
	this.onThrow(error => {
		this.return(-1);
	});

	// You can add as many .onThrow listeners as you want
	this.onThrow(error => {
		console.log(error);
	});

	// Listen for when the function has executed
	// Again, you can add as many .after listeners as you want
	this.after(result => {
		if (result === 30) {
			this.return(99);
		}
	});

	// Business logic below

	if (Math.random() > 0.5) {
		throw new Error("Math exists");
	}

	return a + b;
});
```
