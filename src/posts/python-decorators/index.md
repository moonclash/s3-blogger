---
title: 7 - Python decorators are awesome
date: "2021-04-02T22:12:03.284Z"
description: ""
---

Hey-ho, let's go, it's your favourite soviet computer scientist coming at you again with some wisdom. In this blog we'll be learning about decorators in Python and how cool they are. I got inspired to revisit and write about decorators in today's post, because lately I have been assessing what fundamental gaps I have in my Python knowledge, or what things in Python I haven't used for such a long time that they got a bit dusty. Today we'll be blowing off the dust from these old knowledge bombs and hopefully we'll come out with some re-solidified decorator skills.

### Ok what the hell is a decorator?

Before we start thinking and talking about decorators, let's very quickly jump into some good old Computer Science 101 and remember what a first-class object is.

A first-class object is an object, that is:

- created at runtime;
- assigned to a variable or element in a data structure;
- passed as an argument to a function;
- returned as the result of a function.

Nice and easy right? You know what's even nicer? Functions in Python are first-class objects, and all of these traits apply to them, meaning that we can do all of the above with a function. Let's quickly see a few simple examples:

```python
# created at runtime

def foo(something_awesome):
  return something_awesome

# assigned to a variable

funky_variable = foo

# both of these yield the same result:

foo('hey there')
funky_variable('hey there')


# passing a function to another function as a variable

def funky_function(awesome_parameter):
  print('andy is always watching you')
  return awesome_parameter()


# returning a function as a result of a function

def outer_function():
  def inner_function():
    return
  return inner_function

```

Nice. Knowing what a first-class object is, and knowing that Python functions are first-class objects, we can now approach decorators with a better understanding of how they work. 

A decorator, put in the simplest way possible is a function, that takes another function and modifies its behaviour.

Alright, thanks for stopping by in today's blog post, it was really that simple, until next time!

Even though when put in its simplest form, decorators sound easy, and for the most part, you won't be spending a lot of time, pouring sweat and tears to write one, but in order to really flex with your decorator skills and do some kick-ass patterns with them, it is necessary to dive deeper.

### How do decorators work?

As we already said, decorators are functions, that take other functions as arguments and modify their behaviour. We can choose if we want to actually modify the function, and we can choose if we want to return it, or replace it. Remember the first-class objects we revisited?

In other words, decorators look a little bit like this:

```python
@decorate
def my_func():
  print('running my_func')
  return
```

This code is the equivalent of this code:

```python
def my_func():
  print('running my_func')

my_func = decorate(my_func)
```

In both of these examples, the end result is the same. `my_func` does not neccessarily refer to the original `my_func` function, but to whatever function we have returned from `decorate`

In most cases, decorators usually replace the passed function with a different one:

```python
def decor(func):
  def inner_func():
    return func() + 10
  return inner_func

@decor
def return_five():
  return 5

result = return_five()
print(result)
print(return_five)

```

Now, before reading on, stop for a second and think - what would those 2 print statements print to the console?

```python
15
<function decor.<locals>.inner_func at 0x10f4d5040>
```

Ok, so we got 15 from the first statement, because as we know, our `decor` function has function inside it, called `inner_func`, which invokes the `func` function from the parameter and it adds whatever that function returns to 10. And since we are passing our incredibly mathematically complex function, called `return_five`, then it makes sense to get 15.

And our second print statement prooves to us that indeed, we are replacing the original `return_five` function with `inner_func`.

To summarize: the first crucial fact about decorators is that they have the power to
replace the decorated function with a different one. The second crucial fact is that they
are executed immediately when a module is loaded. I didn't know that second part. Let's learn about it together.

### When does Python execute decorators?

Python decorators are run right after the decorated function has been defined. This usually happens at _import_ time, or when a module is been loaded by Python. Let's make up a ficticious file, called `andy.py` and see how it works.

```python

andy_has_decorated = []

def andy_decorates(func):
  print(f'andy has decorated {func}')
  andy_has_decorated.append(func)
  return func

@andy_decorates
def func1():
  print('hey, i am function 1')

@andy_decorates
def func2():
  print('hey, i am function 2')

def func3():
  print('hey, i am function 3')


print(andy_has_decorated)
func1()
func2()
func3()

```

Ok, let's break this down a little bit.

`andy_has_decorated` will hold references to each function we have decorated.

`andy_decorates` prints the function it decorates, for our visibility's sake.

`func1` and `func2` are going to be decorated by `andy_decorates`, and `func3` will not be.

Each of our 3 functions prints a simple reference to itself. 

We call each decorated function, and in the end we print the list we defined.

Again, stop reading here for a second. Read through the code and try to guess what the output to the console would be after we run the file.

Ok, so the output to the console, if we do `python3 andy.py` will be:

```python
andy has decorated <function func1 at 0x7f97c0c458b0>
andy has decorated <function func2 at 0x7f97c0c45940>
[<function func1 at 0x7f97c0c458b0>, <function func2 at 0x7f97c0c45940>]
hey, i am function 1
hey, i am function 2
hey, i am function 3
```

Woah, wait! Why are we seeing those 2 prints at the top? And how come the list already has the functions appended to it?

This is to demonstrate how Python executes decorators.

Decorators are executed at import time, or at run time. When we wrap a function with a decorator, the decorator function itself is immediately invoked. This is why we see those two prints, and we also have the appending logic inside that function too, so we can easily prove, that the decorators get invoked before the other functions.

If we had this file imported inside another file as a module, the same thing would happen.

Function decorators are invoked during run time or import time, if we are using them in another file like

```python
import andy
```

And the decorated functions themselves are executed when we explicitly invoke them like `func1()`.

Our `andy_decorates` function does not modify the function that it decorates, and even though most of the times when you write your own decorators you will be modifying the function, this doesn't mean that simply returning the function unmodified is a wrong pattern. In fact, many web frameworks use this pattern as registry for functions that map URL's. 

Let's quickly see how we can use this pattern in a practical scenario. Imagine you are an egineer at Spotify and you're trying to generate the best playlist for a user. We'll write a decorator function that holds a registry of decorated functions, each taking a user, but each processing different data about the user. The function that returns the highest score wins, and will generate the playlist for the user.


```python

playlist_scores = []

def playlist_score(playlist_func):
  playlist_scores.append(playlist_func)
  return playlist_func

@playlist_score
def calculate_recently_played_arists(user):
  return

@playlist_score
def calculate_recently_played_songs(user):
  return

@playlist_score
def calculate_recently_played_albums(user):
  return

@playlist_score
def calculate_most_played_radio(user):
  return

def calculate_perfect_playlist(user):
  return max([_playlist_score(user) for _playlist_score in playlist_scores]) 

```

Like in our previous example, we define a list that will serve as a registry of functions.
Our decorator simply registers each function it decorates and returns it.

We don't have to do any for loops, we don't need to append anything to the list, remember, when we run this file, or when we import it, the decorator will get invoked, and each function will get appended to the registry.

Our `calculate_perfect_playlist` remains unchanged

If we want to remove a function from the registry, we simply can either remove or comment out the decorator.

Like we said before, most decorator functions use an inner function to modify the function passed and we would return the inner function, replacing the function we have passed. Any code that uses inner functions almost always depends on closures to function properly. Let's step back a little bit to better understand how closures work, by looking at how variables scope works in Python.

### Variable scope rules

Consider this code:

```python
def foo(a):
  print(a)
  print(b)

foo(a)
```

As expected, this will fail:

```python
5
Traceback (most recent call last):
  File "main.py", line 6, in <module>
    foo(5)
  File "main.py", line 3, in foo
    print(b)
NameError: name 'b' is not defined
```

The variable `b` is not defined, and if we define it before or after the function call, the error is gone:


```python
def foo(a):
  print(a)
  print(b)

b = 6
foo(5)
```

```python
5
6
```

Now let's look at another example, that may seem a little surprising:

```python
b = 6
def foo(a):
  print(a)
  print(b)
  b = 10
foo(5)

```

What do you think will happen here? We have our `b` variable assigned, so we should be all good, right?


```python
5
Traceback (most recent call last):
  File "main.py", line 6, in <module>
    foo(5)
  File "main.py", line 4, in foo
    print(b)
UnboundLocalError: local variable 'b' referenced before assignment
```

Oh no! Why did our function throw? We have the variable assigned globally, it should be working, right?

When I first saw this, I was surprised, but this is not a bug, this is a design choice. 

Python does not require us to declare variables, but when we declare a variable inside a function, python treats it as a local variable. Meaning that, when we say `print(b)` inside the function, because we have a declaration for `b` inside the body of the function itself, this is where Python will be looking for that variable.

If you have written any JavaScript, you know that you're not required the declare variables there too, but the same code in JavaScript will run fine, because the language does not have that protective mechanism, making it easy for a function to use a global variable unintended, leading to possible bugs or unwated variable reassignments.

Enter the `global` keyword in Python. If we want to tell a function to explicitly use a global variable, we use `global` like so:

```python
b = 6
def foo(a):
  global b
  print(a)
  print(b)
  b = 10
foo(5)
```

This will work, and now the line that previously declared `b` as a variable will now reassign the global variable `b` to point to the value of 10.

Now that we have an understanding of how variable scope works, we can tackle the next section - closures

### Closures

Since the meat and potatoes of decorators is defining a function inside another function, understanding closures will help us better understand and write decorator functions.

So what is a closure?

A closure is a function, that encompasses non-global variables, which are used inside the body of that function, but not defined in the function itself.

If this seems like a tongue-twister, then let's do the right thing and look at another example:

Let's imagine we have a function that calculates the average of a list of values. The list of values is not fixed, and we want to be able to consistently add new values to the list and get the average.

```python
avg(5) # 5.0
avg(10) # 7.5
avg(13) # 9.33 
avg(6) # 8.5 
```

Ok, but how does our `avg` function know keep storing these values? How does it calculate then? We haven't added any global variables or anything.

First, let's look at a class based approach on how we can achieve this functionality:


```python
class Averager(object):

  def __init__(self):
    self.values = []

  def avg(self, value):
    self.values.append(value)
    average = sum(self.values) / len(self.values)
    print(average)
    return average

_averager = Averager()
avg = _averager.avg

avg(5)
avg(10)
avg(15)
```

This is pretty self-explanatory - when we insantiate our class, we create an empty list inside the instance, and we append values to it with each call of the `avg` function. 

But let's look at a functional approach to the same problem:

```python
def averager():
  values = []
  def make_average(value):
    values.append(value)
    total = sum(values)
    average = total / len(values)
    print(average)
    return average
  return make_average


avg = averager()
```

So what is the main difference between these approaches?

Obviously, in the class based approach, we store the values inside `self.values`.

So how are the values stored in our functional approach?

Note that `values` is a local variable of `averager`, because we declare and assign it in the body of that function. But when we call `avg(5)`, that local scope is gone.

Within `make_average`, `value` becomes a _free variable_. The technical term for a free variable is a a variable, that is not bound to a local scope.

So to summarize this in an easy to understand way, let's try to define what a closure is:

A closure is a function, that will retain the bindings to free variables that exist, when the function is defined, so we can keep refering to them later, when the function is invoked and the defining scope is no longer available.

In simpler words:

- We define our outer function `averager` , which locally defines a variable, named `values`
- Our inner function `make_average` (closure) has a reference to that variable `values`
- averager is called only once, meaning that `values` will only be invoked during it's first call.
- make_average retains a binding to that free variable, called `values` and, considering that we've lost the defining scope from `averager`, it still has a reference to the `values` variable, which allows us to append values to it, modify it, each time we call `avg`.


### The _nonlocal_ declaration

Our `averager` function is not really that effective. I mean, it does compute the average for a set of values, but if we make a lot of calls ot it, the list will grow, the function will become slower, and the Big O will grow each time we use it. It would be much more effective to simply store the amount of times we have added a new value, we added it to the previous value and divide the total value by the amount of total values added. Consider this example:

```python
def make_averager():
 count = 0
 total = 0
 def averager(new_value):
  count += 1
  total += new_value
  print(total / count)
  return total / count
 return averager
avg = make_averager()
avg(5)
```

This is broken. I took me a little while figuring out why, mostly because I was thinking about free variables too much and didn't spot the error right away. 

Calling `avg(5)` throws:


```python
Traceback (most recent call last):
  File "main.py", line 14, in <module>
    avg(5)
  File "main.py", line 5, in averager
    count += 1
UnboundLocalError: local variable 'count' referenced before assignment
```

Wooooah, we are back at problems with variable scopes? How come?

Well, when we say `count += 1`, this is the equivalent of `count = count + 1`. We are declaring a new variable inside our closure function, rather than using the free variable approach. 

OK Emil, hold on, how come we did not have this problem when we kept a list of values, and used that as a free variable?

Well, because lists are mutable, and if you recall, we never made any assignments to the list, we simply appended to it.
Immutable data types, such as strings, integers, etc. need to be re-assigned.

So how do we deal with that?

Say hello to your new best friend - the `nonlocal` statement.

`nonlocal` allows us to flag variables as free variables, even when they are assigned with new value from within the function itself.

Let's use it to fix our broken function:

```python
def make_averager():
 count = 0
 total = 0
 def averager(new_value):
  nonlocal count, total
  count += 1
  total += new_value
  print(total / count)
  return total / count
 return averager


avg = make_averager()

avg(5) # 5.0
avg(10) # 7.5
avg(50) # 21.66
```

### Conclusion

#### What we learned:

- What decorators are
- How Python executes them when they are defined
- Variable scopes to allow us to better understand nested functions
- How closures work, and what free variables are
- The magic `nonlocal` statement that allows us to declare variables as free variables, when we have to deal with non mutable data types  

Python decorators are a powerful tool, and they can be used for many different patterns. One of my favourite patterns I have seen using decorators is by [Ines Ivanova](https://codewithfinesse.com) and her [Decorator pattern with Python, GraphQL and Flask (the smart ifs)](https://github.com/InesIvanova/Dev.BG-seminar). You should go check it out, it's really simple to read through, and really powerful to use.


Until next time