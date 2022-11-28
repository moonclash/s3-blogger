---
title: 5 - Web sessions explained
date: "2020-12-25T22:12:03.284Z"
description: "Cracking a cold sesh with the bois"
---

Hola Hola, it's your boi coming at you with another knowledge bomb. I was inspired to write about web sessions after shopping for christmas presents on this web site and the terrible user experience it had. Basically I spent a solid 2 hours browsing products on the site, page by page, trying to find the perfect gifts, adding them to my cart one by one. When I was ready to check out, the site asked me to log in or register, and after registering, to my unpleasant surprise I found out that my cart was completely empty. It was really annoying, and the first thought in my head was: "Have these guys ever heard about sessions?". I have some theory about sessions, and then we'll get our hands dirty and implement a very simple example in Flask.

### So what are sessions exactly?

To start off with some context to make things easier to understand, let's imagine, that we have a site, and we need to store data about the user between loading different pages. By default, HTTP is **stateless**, meaning that it does not preserve any data between different pages. Right. So we need to figure out a way to be able to pass that data.

We could store it in a database, but if we store all of the users' data in a database, it will get bloated and slow very quick, as the data we need let's say when a user is signing up, we might not need permamently.

Ok then, let's store it in local storage you say? Cool, but then you give too much control to the client, the user might clean their local storage, or have JavaScript disabled, not to mention that you might be storing sensititive data on a potentially publically accessible device.

Maybe URL params? This will be annoying to implement and write extra logic and make our requests more complicated to read. Also the URL bar will look like you've gone back to the early 2000s.

Enter web sessions on the back end.

We store that data on server side and we give the session an ID, which we can tie to the user. There we go, that's how sessions work in a nutshell. You won't be having to ever implement sessions functionality from scratch, as most web frameworks have them right off the bat. Sessions are simple to use and are basically a key / value storage, which you can easily read and write to.

Let's open and IDE and write a simple session example, using Python and Flask.

### Session implementation in Python + Flask

All of this code is available on my [GitHub](https://github.com/moonclash/blog-code-examples/tree/master/sessions-blog-post).

I have a basic Docker + docker-compose set up that creates a python image, installs Flask and Flask-Session and spins up a container:

**Dockerfile**

```Dockerfile
FROM python:latest

WORKDIR /session-app

COPY . .

RUN pip3 install -r requirements.txt
```

**docker-compose**

```yaml
version: '3'

services:

  session-tut:
    container_name: session_boi

    build: 
      context: .
      dockerfile: Dockerfile

    volumes:
      - .:/session-app

    ports:
      - '8000:8000'
      
    command: python3 src/main.py
```

All of our code is going to live inside one file, as we don't need much for this tutorial:

**main.py**

```python
from flask import Flask, session, jsonify
from flask_socketio import SocketIO

app = Flask(__name__)
app.secret_key = '1234xadas'
socketio = SocketIO(app)
```

Here we import Flask, session and jsonify so we can return json responses, we instantiate a Flask object to be our app and we give it a super secret key. We'll use `SocketIO` to run our little app, and we instantiate that with the app isntance.

So far so good, let's write our first route and interact with the session straight away:

```python
@app.route('/')
def index():
  session['start'] = True
  return 'hello'
```

Add this code to the end of the file and let's run the app via `docker-compose up`

```python
if __name__ == '__main__':
  socketio.run(app, host='0.0.0.0', port=8000, debug=True)
```

`docker-compose up`

If we go to our localhost pon port 8000, we'll see a tiny little hello greeting us from the browser.


`session['start'] = True`

This line of code literally stores the value `True` to the key `start` of the session. And since this is a simple key/value storage, we cann view all the keys and values easily. To make things more DRY, I wrote a little helper method that uses dictionary comprehension to construct an object from the items of the session like so:

```python
def comp_helper(_dict):
  return {k : v for (k, v) in _dict.items()}
```

Ok, let's write another route:

```python
@app.route('/cherries')
def cherries():
  session['fruit'] = 'cherries'
  return jsonify({'response': 'cherries', 'session': comp_helper(session)})
```

Here, we simply assing the `fruit` key to point to "cherries".

We'll return a simple JSON response, where we can see how the session currently looks like, and if we got to `/cherries` on our localhost, to no surprise we see:

```json
{
  "response": "cherries",
  "session": {
    "fruit": "cherries",
    "start": true
    }  
}
```

Remember, this is mutable data type, so we can overwrite anything in the session, whenever we please. 

Let's see that in action with another view:

```python
@app.route('/blueberries')
def blueberries():
  session['fruit'] = 'blueberries'
  return jsonify({'response': 'blueberries', 'session': comp_helper(session)})
```

On our `/blueberries` route, we overwrite `fruit` to be `blueberries`, and the response can confirm that:

```json
{
  "response": "blueberries",
    "session": {
      "fruit": "blueberries",
      "start": true
    }
}
```

Amazing right? 

What if we want to delete the session? Don't worry. It's easier than pie. Actually I don't know why this is even a saying, making a pie is harder than most things. It should be something like "It's easier than drinking water"

```python
@app.route('/destroy-session')
def destroy_session():
  session.clear()
  return jsonify({'response': 'session destroyed', 'session': comp_helper(session)})
```

And when we go to `/destroy-session`, we see that our tactical nuke has been successful:

```json
{
  "response": "session destroyed",
  "session": {}
}
```

So easy!

### Conclusion

Web sessions are a simple, but very powerful tool that can help you provide a better experience for your users, and you should be taking advantage of them as much as you can. Obviously don't use them as a full blown DB, but you get my point.

Until next time