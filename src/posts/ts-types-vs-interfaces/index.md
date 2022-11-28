---
title: 10 - Types vs Interfaces in TypeScript
date: "2021-08-08T22:12:03.284Z"
---

Oh hey there, it's ya soviet boi coming at you with another knowledge bomb. So a lot of things have changed in my life recently, I moved out of the UK back to my glorious homecountry Bulgaria. Along with these changes is another one - I left my Full Stack Python days behind and recently became a back end node engineer. It feels good. I've wanted to write production-grade JavaScript for such a long time, but I never managed to do it on a job so far. We use TypeScript, and you can check out my previous blog if you're into a lil gentle intro to TS.

So as you can imagine my days browsing Stack Overflow are now geared towards reading more about TypeScript and it's features. Recenty I was working on a feature and I had to export a new type. But the example in the code before that had `interface`. And then it struck me: "Hold on!. Am I supposed to use a type or an interface here? What's the difference? 

I don't know, let's figure it out together.

### Type aliases

Ok, so we know that TS has some types in it already, right? We have `number`, `string`, `boolean`, and so on and so on. But we also know that we can make our own types by simply using the `type` keyword right? Just like so:

```typescript
type IceCream = {
  flavour: string,
  calories: number
}
```

And here's the gotcha.

We might be thinking that we are making a brand new type, called IceCream right? Yeah, no. We don't create any new types at all. We are just giving types a new name. We didn't just inject a new type in the system, we just gave it a name.

So this is what type alias is, and when people are discussing types and interfaces, and when I refer them down in this post, I'll also be using the word type, but I really mean type alias.

### What are interfaces?

Intefaces are pretty much a way to describe data shapes, like an object:

```typescript
interface Flavour {
  name: string;
}
```

Here's a cool feature that interfaces have, but types don't: Declaration merging.

**Declaration merging means that when you declare something and then declare it again, but with a different property, the second declaration in stead of overwriting the first declaration will merge the new properties into the data defined by the initial declaration.**

Let's see how that would work:

```typescript
interface Flavour {
  name: string;
}

interface Flavour {
  colour: string;
}

const chocolateFlavour: Flavour = {
  name: 'chocolate',
  colour: 'brown';
}
```

Types don't have that. I mean you don't have to trust me, but you can open up your IDE and try this:

```typescript
type Flavour = {
  name: string;
}

type Flavour = {
  colour: string; // bang bang, this will throw
}
```

Another thing that you can do with interfaces and not with types is using `extends` and `implements`.

**Extends**

Ok, so what does `extends` actually do? Let's dive back into some OOP 101.

Extends is simply a way to do inheritance in OOP.

Imagine we are running an ice cream shop and we have being tasked with writing the software that allows people to order ice cream, and we need a base class for an ice cream, something like:

```typescript
interface IceCream {
  flavour: string;
  vessel: 'cone' | 'tub',
}
```

Now this works for the first couple of months of our ice cream shop, but the shop keeper wants to start selling luxury ice cream. They think the new ice cream should have a bunch of toppings on it. Now, we need to keep our base `IceCream` interface, because we don't want to lose our regular consumers. We can simply copy paste everything we have so far in another class, but that would not be very DRY. This is were `extends` comes in.

```typescript
interface LuxuryIceCream extends IceCream {
  toppings: string[];
}
```

Now our new interface has all of the properties of our base interface, but we can also add toppings to it. So a customer's order can look like this:

```typescript
const andysLuxuryIceCream: LuxuryIceCream = {
  flavour: 'brownie',
  vessel: 'cone',
  toppings: ['oreo crumbles', 'peanuts', 'coconut flakes']
}
```

Now that we have refreshed our memories on `extends`, let's quickly get `implements` out of the way too.

Ok, so we have been running our ice cream shop for a while now, and it has been doing good. The owner is really happy with our software, but being the business shark they are, they want to hop on the delivery bandwagon and now we have to create an online ordering system. This is a good opportunity for us to refactor our in-house system and make it usable in an online web app too. 

Now, remember that `interface` is a way to describe data shapes. Another way of looking at interfaces is as them being an abstract class. We can have an interface that is used to order ice cream like so:

```typescript
interface ProductOrderer {
    orderProduct(product: Product): ProductOrder
}
```

Now this serves as a nice abstract class. We know that our `ProductOrderer` has a method called `orderProduct`, taht takes a product as an argument.

We can now use that interface to create a class that orders produts locally for the store, and one that is used by the web app:

```typescript
class LocalProductOder implements ProductOrderer {
    orderProduct(product: Product): ProductOrder {
        return {name: 'chocolate'}
    }
}

class OnlineProductOrder implements ProductOrderer {
    orderProduct(product: Product): ProductOrderOnline {
        return {name: 'vanilla', destination: 'some street 5'}
    }
}
```

And this is the magic of how `implements` works. Our classes that `implement` our base `ProductOrderer` class must implement the `orderProduct` method, but as you can see, our online version returns a different type. 

With all of this being said, I would like to demonstrate that you can not use either `implements` or `extends` with type aliases in TypeScript.

Let's test it ourselves:

```typescript
type IceCream = {
    flavour: string,
    vessel: 'cone' | 'cup'
}
type LuxuryIceCream extends IceCream = {
  // this will throw
}
```

But that doesn't mean that we can not achieve similiar funcionality with types. We can in fact have a type called `LuxuryIceCream` that has all the properties of our regular ice cream by using something called `type intersection`. We can use the `&` operator to combine two types like so:

```typescript
type IceCream = {
  flavour: string,
  vessel: 'cone' | 'cup'
}

type LuxuryIceCream = IceCream & {
  toppings: string[]
}
```

### Conclusion

So when should you use types and when should you use interfaces? Well, the answer is - it depends!
If you need to define a new object with methods, then interfaces are the better option. You can easily extend them or implement then and have them be more reusable.
Types are better when you are working with methods and functions and you want to define the arguments or the return type of your methods, but you can also have an interface as a return type from a function, let's say if you're working on a factory function like so:

```typescript

interface PoructOrderer {
  orderProduct(product: Product) {}
}

class LocalProductOder implements ProductOrderer {
    orderProduct(product: Product): ProductOrder {
        return {name: 'chocolate'}
    }
}

class OnlineProductOrder implements ProductOrderer {
    orderProduct(product: Product): ProductOrderOnline {
        return {name: 'vanilla', destination: 'some street 5'}
    }
}
function iceCreamCreatorFactory(isOnlineOrder: boolean): LocalProductOrder  | OnlineProductOrder {
  return isOnlineOrder ? new OnlineProductOrder : new LocalProductOrder;
} 
```
I hope you enjoyed this one and happy building!

