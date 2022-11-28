---
title: 4 - Tasty celery tasks
date: "2020-12-21T22:12:03.284Z"
description: "Googling celery related stuff yields funny results"
---

Ever wonder how you can automate something? Are you tired of doing manual work? Do you like technology named after a weird tasting vegetable? Or at least the idea of it? Then this post is for you! In this one we'll be learning about celery and how we can automate tasks with it. We'll aso be building a state-of-the-art twitter bot that will completely revolutionize the way we use twitter and technology in general. Let's now waste any more time filling this intro paragraph with random shit and dive straight into it.

### What are periodic tasks?

Very simply put periodic tasks are tasks that get executed at regular intervals. A periodic task is a task, that repeats itself after a fixed interval of time.

When would you need to use periodic tasks?

There are many use cases for implementing periodic tasks in a system, and use cases vary, depending on the requirements, but here's a few examples that can make them easier to understand.

- Run a task to check prices on a specific item on Amazon every couple of hours, in stead of you doing it.

- Run a task that performs database sanitation every few hours

- Maybe you have an ecommerse platform and you need to run a task that generates orders, or bills customers, etc.

### What is Celery?

Celery at its core is asynchronous task queue/job queue based on distributed message passing. It is focused on real-time operation, but supports scheduling as well.

Celery is built to read a task from a message broker, and peform it.

Celery uses a message broker such as a RabbitMQ, where it deques tasks and process them.

To put it in an easy to understand abstraction, let's imagine a kitchen scenario.

We have a waiter, who's going to be taking orders from tables. The tables are the outside world.

We have a till, where the waiter will punch in the orders, and that till sends a ticke to the kitchen, where the chef will take the order and start working on it.

So the process will look like this:

**The waiter punches in an order on the till**

(External script queues a task on the message broker)

**The chef takes the printed ticket from his side of the till**

(Celery deques the message)


**The chef cooks the food**

(Celery taks gets executed)

**The chef shouts out to the waiter that the food's ready or that the food's burned**

(Celery sends back a message with the status of the task)

In our use case, we are interested in the scheduling functionality of Celery, which allows us to do periodic tasking.

### What is Celery beat?

Celery beat is a scheduler. It is what will allow us to kick off task at regular intervals, which will be executed by available celery workers. Let's get our hands dirty and build a dumb twitter bot to demonstrate and better understand how to use celery and schedule a task.


### The code

All of this code is available on my [GitHub](https://github.com/moonclash/celery-blog-post).

First, right off the bat, let's use Docker to make sure we run all the services we need and make our development process much easier. I use docker for literally everything I work on, just because I love having an isolated environment that I can reproduce (almost perfectly) on any operating system. Every time I work on a project, my first job is to create both `Dockerfile` and `docker-compose.yaml` files in the base directory.

Our DockerFile looks like this:

```Dockerfile
FROM python:3.8

WORKDIR /celery-app/celery-tut

COPY . .

RUN pip3 install -r requirements.txt
```

Let's break it down:

```Dockerfile
FROM python:3.8
```
use the python3.8 image to build our service

```Dockerfile
WORKDIR /celery-app/celery-tut
```
this creates a directory called `/celery-app/celery-tut` inside of our container and `cd`'s inside of it.

```Dockerfile
COPY . .
```

Copy everything from the host machine's current directory inside of the current working directory in our container.

```Dockerfile
RUN pip3 install -r requirements.txt
```

Run this command - this will install everything inside of our `requirements.txt` folder - we put celery and any python libraries we need for local development, along with their versions inside this file to make sure we have everything we need for development. We'll get to what's inside the `requirements.txt` file later.

Before we look at the `docker-compose`, let's review what else do we need.

`requirements.txt`

```
celery==5.0.4
tweepy==3.9.0
gevent==20.9.0
```

We're installing celery, tweepy is a twitter library for Python and gevent is Python networking library. What we care about most here is celery. The other modules are completely optional and situational - not everyone will be using celery to automate tweets.

Let's create our project structure now:

```
/app
  - tasks.py
  - twitter_service.py
  - worker.py
```

I won't be detailing what's inside `twitter_service`, I just used the tweepy library to make a very simple twitter service that can tweet on my behalf.

`tasks.py` looks like this:

```python
from celery import Celery
from .twitter_service import TwitterService

app = Celery(
  broker='amqp://guest:guest@rabbit_mq:5672/%2F'
)

@app.task(bind=True, name='tweet')
def tweet(self, time):
  twitter_service = TwitterService()
  twitter_service.random_tweet(time)

```

We import celery and our `TwitterService` and then we make a celery instance, that we'll call `app`. We give the instance a single argument, called `broker`, which will point to the message broker we'll be using, which is RabbitMQ. 

A message broker is software that allows applications, systems and services to communicate with each other and exchange information. 

We use a decorator to define our task and the arguments we pass are `bind` and `name`.

`bind` means that this function will be a bound method, and allows us to access attributes and methods on the task type instance.

`name` is simply the name of the task we give.

Sweet. let's lok at what's inside `worker.py`:

```python
from celery import Celery
from datetime import datetime

app = Celery(
  broker='amqp://guest:guest@rabbit_mq:5672/%2F',
)

app.conf.beat_schedule = {
  'tweet': {
    'task': 'tweet',
    'schedule': 30.0,
    'args': ([
      datetime.now(),
    ]),
  },
}
```

Again, we import celery and instantiate it, and in this file all we are doing is defining the schedule for when and how we want to run our tasks.

`beat_schedule` is an object, where we configure which tasks we want to run, how often (I have set mine to every 30 seconds) and what arguments we want to pass to our task.

Easy!

So what's the difference between the `tasks.py` and `worker.py` files? Well  hope you figured that one out already - we define the task, the functions in our tasks file, and our worker is what will be executing the tasks. In celery, you need a worker to be able to execute task, (remember the kitchen abstraction from earlier), so we need to have an active worker (or several) ready to execute our tasks.

Now, let's configure everything in our docker-compose file:

```yaml
version: '3.7'

services:

  rabbit_mq:

    container_name: rabbit_boi
    image:
      rabbitmq:latest
    ports:
      - '5672:5672'

  
  beat:

    container_name: beat_boi
    build: .
    command: celery -A app.worker beat
    env_file:
      - secrets.env
    depends_on: 
      - rabbit_mq
    volumes:
      - .:/celery-app/celery-tut


  celery_tut:

    container_name: celery_boi

    build:
      context: .
      dockerfile: Dockerfile

    depends_on:
      - rabbit_mq

    volumes:
      - .:/celery-app/celery-tut
    
    env_file:
      - secrets.env

    command: celery -A app.tasks worker
```

We define 3 services:

First, we define our `RabbitMQ` container, which will spin up RabbitMQ locally. This will pull the latest rabbitmq image hosted on DockerHub and spin up a running RabbitMQ container with it.

Then we define our `beat` service, which will get built from the image our Dockerfile defines.

We're adding some additional configs there, such as our `env_file`, which will take a file with environmental variables from our host machine and inject those variables into the container we spin up. I am using this to store my Twitter API tokens and secret keys.

The `depends_on` config tells docker-compose that this service should only run if our rabbitmq service is up and running. And the `volumes` config mounts our host directory to the directory we created when the image got defined on creation.

We also define the command we want to run when when the container starts, which is `celery -A app.worker beat` - this will spawn our worker running on the schedule we defined in `worker.py`

Lastly, our `celery_tut` service is very similar to our `beat` service, but we run a different command - `celery -A app.tasks worker`. We spin up another worker here to execute the task that is defined in the schedule.

Save all of that up and run `docker-compose up` in the terminal and we should see Docker downloading all of the images it needs, installing requirements, starting up rabbitmq and we can observe our task running every 30 seconds. 

Heading off to Twitter aaaand:

![tweets](tweets.png)

It worked! My little app is now tweeting random tweets every 30 seconds!

I hope this crash course has been useful, it certainly was for me to undersand how celery works and how to set up periodic tasks. 

Like I say in my posts every time - the limit for this is only your imagination - have you been thinking about something you've beend doing manually a lot and want to automate? Grab a tasty celery taks and make it happen!

Until next time.


 
