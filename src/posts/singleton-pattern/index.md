---
title: 12 - [Design patterns series] - The Singleton
date: "2021-12-23T22:12:03.284Z"
---
Hey there my loyal supporters. It's your boy back again coming at you with some more knowledge bombs.
I am currently in my grandma's apartment in my hometown. It's cold as hell outside, and coming back to my stuck in time small hometown always humbles me down and recharges me. Being here for a couple of days only armed with my laptop and away from my usual distractions at home, AKA my PlayStation, my TV and my gaming PC, I always find it a good time to focus.

I've decided to go back and retrain myself on design patterns. Design patterns is one of these topics that you kinda feel like you should know, but then kinda don't really pay too much attention to, until you come to a problem at work, or on a personal project where you get yourself thinking - "Hm maybe there's a pattern here I could apply to make my job a lil bit easier". Well let's try and revisit some popular patterns, think about what situations we might need them in and write some code. We'll start off with one of the simplest ones out there - The Singleton.

### The Singleton 

The Singleton is the easiest to understand and the most controversial pattern.

It's purpose is to create a single object with methods and state that is shared by other parts of our system. The easiest way to understand that is to think of a logger. When we log anything out from our application, we want all of the logs to go to the same place, and here we have a great use case to implement our logger using the Singleton pattern.

If you read my article on how I hacked together a clap button on my blog, you'll see that for my use case there I used the Singleton pattern for my Database manager, as I wanted only one connection for my database.

You start getting my drift here, right? When we have a use case of needing shared state and methods for multiple parts of our application, the Singleton is a great pattern to use.

Here's a lil diagram to visualise it:

![diagram](diagram.png)

Now, we did mention, that the Singleton can be a controversial pattern to use - why? Well, since we are introducing a global variable, we can encounter situations, where we have race conditions, AKA two services hit the singleton at the same time, and we might compromise our data integrity that way, so when we are implementing the pattern for our application, we need to be aware of that and try and protect ourselves against it.

### Implementing the Singleton with a simple logger

Ok, enough talk, let's write some code!

Let's pretend that we are writing a logger for our application and we want to send logs from specific parts of our application to a server. Time for the Singleton to shine. We want to be able to send logs from anywhere in our application and see the amount of logs we have stored.

Let's see how our code might look like: 

```typescript
class RichBrownieLogger {
	constructor() {
		if (RichBrownieLogger.instance === undefined) {
			this.logs = [];
			RichBrownieLogger.instance = this;
		}
		return RichBrownieLogger.instance;
	}
	getLogs(): number {
		return this.logs.length;
	}

	log(message: string): string {
		this.logs.push(message);
		return `Message logged: ${message}`
	}
}

const myLogger = new RichBrownieLogger();
Object.freeze(myLogger);
export default myLogger;
```

Ok, so let's break down what this code does:

- First, in the constructor of our class we do a check for the `instance` property of our logger. If it doesn't exist, we give our logger a `logs` property, which is simply an empty array, and we assign `this` to point to the instance method. Whatever we do in the constructor, we always want to return the `instance` property here, which will be the single instance of our class. 

- This guarantees us that we're only going to create a single instance of our class, and even if we try to do something like:

```typescript
const MyLogger = new RichBrownieLogger();
const MyOtherLogger = new RichBrownieLogger():
// and 10 more under
```

The other variables will not be creating new instances of our class, they will be simply just pointers to our existing instance. Of course, we can be more secure and prevent that from happening by throwing an error like:

```typescript
constructor() {
		if (RichBrownieLogger.instance === undefined) {
			this.logs = [];
			RichBrownieLogger.instance = this;
		}
		else {
			throw new Error('Instance already exists');
		}
		return RichBrownieLogger.instance;
	}
```

After we've defined our Singleton class, we create a single instance of it, make sure we lock it down with `Object.freeze` and then export that single instance. We can now import it in any part of our application and use it, making sure that we are sharing the same state, aka the `logs` property.

### Conclusion

This was the first post in my mini series about design patterns. I sure as hell am fiding value in going back to retrain myself on design patterns and I hope you can find some value here too. Most material on design patterns, including bible of design patterns by the gang of 4 always seemed pretty dry to me, so I am hoping I can use simplicity and practical examples to provide a better understanding of design patterns.

Until next time!