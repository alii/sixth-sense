import { sense, Context } from "../src";

const add = sense(function (this: Context<number>, a: number, b: number) {
	this.onThrow(error => {
		console.log(error);
		this.return(-1);
	});

	this.after(result => {
		if (result === 30) {
			this.return(99);
		}
	});

	if (Math.random() > 0.5) {
		throw new Error("Math exists");
	}

	return a + b;
});

console.log(add(10, 20));
