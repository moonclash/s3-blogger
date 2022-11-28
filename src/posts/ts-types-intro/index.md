---
title: 9 - Your gentle introduction to types in TypeScript
date: "2021-06-19T22:12:03.284Z"
description: ""
---

How do you do, my loyal fanbase of 3 people? I am a little bit ashamed that I have neglected my little blog for such a long time.The last time I wrote a post was in April! And there I was hoping I'd be shipping out a post a week. But I do have a good excuse, which could serve as the premise for this post. I have been very busy over the last few months - planning and executing the steps that I needed to move back to my glorious home country - Bulgaria. 

So life has been a bit busy with me travelling back and forth to look for places to live, open bank accounts, get a bulgarian phone number, send my valuables from the UK to Bulgaria, etc etc. 

One of these steps naturally was finding a new job. I did not want to go back to working in an office, so I looked for fully remote companies. I won't go too much into the details of how interviewing remotely went in this blog post, because I do plan to write a separate piece about that, but long story short -  I found a company, which I really, really liked and I was lucky to get to talk to them and eventually receive an offer.

So what does all of this have to do with types in TypeScript? Well, in the spirit of big changes, I decided that I want to switch to writing JavaScript professionally. Nothing personal, Python, but JS was the language I started programming with and while building up my career, I always felt this `void` in me, caused by the fact I never managed to write JS as my main language for a job. 

As you can imagine, most places with a big JS codebase use TypeScript. And if you like me wondered "Why?", I hope this gentle intro to TypeScript and its types can give you a better understanding. Now let's go!

### Ok, so what exactly is TypeScript?

TypeScript is actually a programming language. Yep, back in the day I kinda thought it's something like a pre-processor, but nope - TypeScript is an actual language, developed by Microsoft. TypeScript is built on top of JavaScript and it adds static type definitions to JavaScript. Now, here normally I would tell you what the benefits of TypeScript are, and why and when it should be used, but when I started diving into it (not too long ago), I didn't know that. And I can list a whole bunch of perks here, but let's take a different approach. I'm gonna show you the language's features, what they do and then as always in our little summary in the end we'll evaluate how useful they are.

So as you know JavaScript is a weird boi. It's dynamically typed language (just like Python), which pretty much means that you don't have to define the types for your variables, they don't get compiled, and they get defined during runtime. 

So in JS you can totally do something like this:

```javascript
let someCoolVariable;
someCoolVariable = 'hey I am a string';
someCoolVariable = false;
someCoolVariable = 5;
someCoolVariable = null;

// uncle JS is cool with everything 

```

I don't need to define the type of this variable when I declare it, and I can change it's value and it's type to whatever I want at any point (unless I used `const`, but that's a different topic). 

Alright, so we get what dynamic typing is, but what about static typing?

Static typing means that we are enforced to declare the type of our variables, and those types will be verified during _compile_ time, or during runtime too, then it's called _dynamic checking_.

Let's look at static type language like Java:

```java
class Main {  
  public static void main(String args[]) {
    String myCoolVariable; // we define the type of the variable along with the variable itself - a string in this case
    myCoolVariable = "I am super cool"; // we give it a value 
    myCoolVariable = 10; // boom - our code won't even compile at this point
    System.out.println(myCoolVariable); 
  } 
}
```

Alright, so clearly there is a difference here. And you might think, well hol' up. I like the JS way - it's less code and I can do whatever I want with my varibales. 

Ok, I hear you, but imagine you have the following scenario.

You have to write a function that let's say registers a user ID based on an input element from a form:


```javascript
function registerUserID(id) {
  // do some logic here
}
```

Less code, no need to worry about types. But what if your user isn't a little angel like you naively thought and enters a string of non-numeric characters? Also you surely are aware, that every input field will always give you a string? You'd have to make your code safer right?

```javascript
function registerUserID(id) {
  if (typeof(id) !== 'number') {
    throw new Error('please provide a number')
  }
  // do some logic here
}
```

And you'd kinda want to document that function right?



```javascript
function registerUserID(id) {
  // @param id: number
  if (typeof(id) !== 'number') {
    // we need to be sure we only accept numbers as inputs
    throw new Error('please provide a number')
  }
  // do some logic here
}
```

What if your function had multiple inputs, would you go crazy and do something like:

```javascript
function addNumbers(n1, n2, n3) {
  // @param n1: number, n2: nunber, n3: number, n4: number
  if (typeof(n1) !== 'number' || typeof(n2) !== 'number' || typeof(n3) !== 'number' ) {
    // we need to be sure we only accept numbers as inputs
    throw new Error('please provide a number')
  }
  // do some logic here
}
```

Yeah, yeah, I hear your counter-argument that you could do something like `[...arguments].every(n => typeof(n) === 'number')`

But do you see where the issue is? If we want our JS to do what we intend it to do, the dynamic types are now forcing us to write more code, to check the type of the variable before we do any operations with it, and to document our intentions so our colleagues can now how we intended the function to work.

If we could declare the types of our variables, our compiler would shout at us if we gave the wrong type of data, and if someone else was reading our code, they would go "Oh okay, so this takes a number", without us having to explicitly comment that in our code.

Enter TypeScript.

Like I said before, TypeScript is built on top of JavaScript, so if you can read and write JS, you won't have too much trouble reding TypeScript. Also, all JS is valid TS, but not the other way around, and we will shortly understand why. 

Let's take our previous function and re-write it in TS:

```typescript
function registerUserID(id: number) {
  // do some logic here
}
```

Doesn't look that different right? See, I told you it's not that different. The maint thing here we want to pay attention to is the `(id: number)` in our function. Since TS is a static type language, we can give our parameter a type. And the TS compiler will shout at us if we attempt to do something like:

```typescript
registerUserID('andy');
```

But do you see how much code we are now saving just by declaring that one type? Do you see how more readable our function is?

We know that it takes a number, and we don't have to write checks. TypeScript will do it for us during compile time!

And this is the beauty of TypeScript - it makes our code so much more readable, safer and predictable!

Let's learn about the core types in TS!

### The core types

TypeScript has all the types you're already familiar with from JavaScript and it also inroduces a few new ones that only exist in TS.

**number, string and boolean**

Nothing crazy here, you already know what these mean. Let's see how we can use them in a function:

```typescript
function scientificCalculator(num1: number, num2: number) {
  return num1 * num2;
}

function nameYeller(name: string) {
  return `AAAAAAAH ${name}!`
}

function inverseBool(thing: boolean) {
  return !boolean;
}
```

As you can see, to define the type of the parameter, we simply say `param: type` and TS will know what type we want and will enforce validation. But wait! We've seen this done on function parameters only so far, how can we do it on a variable?

Well I'm glad you asked, because I'm gonna tell you about

**Type inference**

Type inference is an amazing feature, that TypeScript implements, which allows TypeScript to _infere_ the type of a variable. Let's see an example:

```typescript

// let's declare a variable here 

const myAwesomeVar = 'oh damn this is awesome';

// we can also do

const myOtherAwesomeVar: string = 'is this more awesome?';
```

So which option should we use? It's TYPEscript right, so we should be using the latter one? Won't TS complain?

Nope!

Type inference put simply means that TS will (very accurately) get the type of the variable from it's value.

So when we said `const myAwesomeVar = 'oh damn this is awesome';`, then TS looks at the right side of our assignment and goes "Oh, so you put a string there, I am going to infere this variable to be of type `string`"

So when we say

```typescript
const foo = 1;
```

TS does

```typescript
const foo: number: 1;
```

And we can use a `let` to prove that:

```typescript
let foo = 1;
foo = 'i am now a string'; // TS will explode on us here, because it infered foo as type number above
```

How awesome is that? And you thought we'd have to write more code. Bah!

**Array and Object types**

To declare an Array as a type on a variable in TS, we can say:

```typescript
const myArray = [1, 2];
```

Ok, so we've defined a variable and we point it to an array, that contains 2 numbers. Now try and guess what will happen if we say `myArray.push('hello');`.

If you thought "TypeScript will yell at us", then colour me impressed - you got type inference right off the bat!
If you didn't, don't worry about it, I'll tell you why it will yell.

When we say

```typescript
const myArray = [1, 2];
```
TS will infere, that we are creating a variable `myArray` with the type `Array` that holds `number` types. So when we try to push a string to our array, type checking is enforced and the compiler yells at us. 

What happens under the hood with type inference is something like this

```typescript
const myArray: number[] = [1, 2];
```

This little `number[]` syntax means "This is a type `Array` that will hold values of type `number`;

Ok let's run another little test, suppose we have:

```typescript
const anotherArray = ['hello'];
```

What do you think the little type syntax would look like here? That's right, it will look like this:

```typescript
const anotherArray: string[] = ['hello'];
```

Alright, you say, but I thought JS was such a cool dude, because it lets us store anyhing inside an array.

Don't worry, TS has you covered:

```typescript
const mixedArray: any[] = ['hello', 420, '1', false, (a) => a * a];
mixedArray.push({'hello': 'world'});
```

Welcome to TypeScript's `any` type!

`any` is a type that can be anything. AKA old school vanilla JS style typing - we can literally give it anything and it'll be cool with it.

Now you won't probably have to store different types of values in an array in your day-to-day work, but if you do, that's how you do it.

Let's see how objects work. We'll use my trusty dog Loki as our subject

```typescript
const dog = {
  name: 'Loki',
  age: 1
};
```

So how would type inference work here?

Well pretty interesting actually, TS will not only infere that this variable is of the type `Object`, but also the types of the properties we give it.

So if we attempt to do something like:

`dog.name = 5` or `dog.breed = 'whippet'`, the compiler will, you guessed it - shout at us again. 

This is how this gets infered under the hood:

```typescript
const dog: {
  name: string;
  age: number;
} = {
  name: 'Loki',
  age: 1
}
```

And if we want to use it in a function:

```typescript
function updateDog(dog: {name: string; age: number;}, name: string, age: number) {
    dog.name = name;
    dog.age = age;
    return dog;
  }
```

**Return types**

Ok, so we've learned how to give types to parameters in our functions, but what about if we want to also tell what the return type of a function would be?

Let's see how that works:

```typescript
function square(num1: number): number {
  return num1 * num1;
}
```

Note that like variable type inference, you don't need to explicitly define your return type. TypeScript is smart enough to look at the return statement and infere the return type.

**Union types**

Union types allow us to combine a few different types into one.

Let's look back at our user id function from before. As you know, an ID might be a number like `5231`, but it also can be `HQZ2015`. Let's modify our function's parameter type with a union:

```typescript
function registerUserID(id: number | string) {
  // do some logic here
}
```
`id: number | string` means that TypeScript will allow us to perform any operations we could perform on both of these types. Which means that we would be able to do something like:

```typescript
function registerUserID(id: number | string) {
  return 'The ID is: ' +  id;
  // do some logic here
}
```

But if we try to do:

```typescript
function registerUserID(id: number | string) {
  id.toUpperCase();
  // do some logic here
}
```

We will get an error, because the `number` type doesn't have a `toUpperCase` method. We can only use operations we can do on all the types.

We can have as many types as we'd like in a union.

```typescript
function itCanBeAnything(thing: number | string | boolean | Array) {

}
```

But as you can already tell, the more types we add, the less the operations we can perform are.

**Enums**

Enums allow us to define a set of named constants. Think of it as a way to give a number to a label.

We can define an enum like so:

```typescript
enum Role {
  Admin,
  User,
  SuperUser
}
```

Our Admin value will start at 0, and each sequential value in the enum will get autouincremented by 1.

and we can use them in a function like so:

```typescript
function validateUser(user: string, role: Role) {

}

validateUser('emil', Role.Admin);
```

**Literal types**

We can use literal types to refer to _specific_ things. The easiest way to understand how literals work is to think about the good old `let` and `const` in vanilla JS.

So if we have 

```typescript
let dog = 'Loki'; // this is infered as a string type
dog = 'Lassie'; // because we have defined it with let, we can update its value

const cat = 'Lady'; // because we are using const, this can't be changed, so it's infered as a literal
```

Of course, we can manually set a literal type like so:

```typescript
let dog: 'loki' = 'loki';
dog = 'lassie'; // this will throw, as we explicitly set a literal on the above line
```

Now, a literal on its own doesn't serve much value, but we can get creative by creating a union out of literal:

```typescript
function feedLoki(food: 'kibbles' | 'wet-food' | 'cooked meat') {
  // logic
}
feedLoki('kibbles');
feedLoki('chocolate'); // this will throw (and won't kill my dog)
```
### Conclusion

This is the first post of my TypeScript series, I will be writing about what I have learned as I go. My own conclusion is that I am really hyped about it and I think it can really make your code more readable and predictable, and after a few hours of learning and using types, my old stigma that including types in JS will just bloat the code and force us to write more is gone. It actually forces us to write cleaner, more predictable code and the most important part - more readable. I have been going crazy on code readbility recently and TypeScript provides that out of the box.

Until next time.

