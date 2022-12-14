---
title: 11 - Build your own reverse proxy
date: "2021-12-22T22:12:03.284Z"
---

What's going on, nerds?  I'm trying to be more active on here, and recently at work I've been given the golden opportunity you rarely get at well established software companies - creating a project from scratch. That's right - a shiny new repo, a world of opportunities at your fingertips, your mind races - it's an adrenaline indused euphoria that we as programmers seek. I won't got into detail on the specifics of the project - cause you know - I can't let any secrets slip, but it does involve one thing I haven't worked on in the past - building a reverse proxy.

To get myself up to speed with reverse proxies and to be able to be the most effective as I could, I spent my after work hours reading up on proxies, reverse proxies, and to further solidify that knowledge, I decided to build my own simple reverse proxy. And as this blog is basically just a big ole rubber duck, it is appropriate to document my learnings and share them with you. 

So without further adieu, let's get started!

### Proxies and reverse proxies - the theoretical part

Ok, so what the hell is a proxy, and what is a reverse proxy?

A proxy put simply is a server that hides the identity of the client. If I'm a client, and I want to connect to a website, typically my connections gets put through a proxy. That proxy could be provided by my ISP. So I don't connect directly to the website, I actually get connected to a proxy server, and that proxy will make a request to the server. The server has no idea who the client is, as it sends back the response to the proxy server, and then the proxy will send the response back to me.

The benefits of a proxy is obviously anonymity and you could use it for caching too. You could set a cache on the proxy for commonly requested resources - like stylesheets or static JavaScript files for examples. You don't want your server to serve these files everytime a user visits, so you could save yourself some bandwith and cache them on the proxy

Proxies are also used for blocking certain content or websites. Why do we use VPN's to watch american Netflix? There isn't a special american netflix that has special movies on it, it's just the proxy detecting that we are connecting to it from a country, where that certain content is not allowed, so when it send our request to Netflix, it will send back just the allowed content to the proxy, which will send it to us. When we use a VPN, our request gets forwarded to a server in America, and then that request gets sent to the proxy from that server, and now the proxy thinks - Oh cool, a fellow American, here's The Office.

So what is a reverse proxy? Well, it's the opposite - if a proxy is when the server doesn't know who the client is, then a reverse proxy is when the client doesn't know which server it is connecting to.

Why would you want to use a reverse proxy? Well, you can increase your security and reliability easily if you implemet a reverse proxy. Your reverse proxy server can distribute client requests to other servers on the system - enter load balancing. If our website receives millions and millions of requests,  single server won't be able to hope. The reverse proxy helps us distribute the load to instnaces that are running our website, and therefeore - balance the load, get it?

From a security standpoint, the reverse proxy never reveals the the IP of the original server. When we connect via the reverse proxy, we don't know which server we are connecting to, all we know is the reverse proxy's IP.

We can use the proxy server for caching too! Let's say we are in Bulgaria and we want to connect to a web site, who's origin server is in America. The reverse proxy might connect us to a server based near Bulgaria, then that server will connect to the American one, we might cache the data from that server to increase performance.

### Building a reverse proxy - the practical part.

Cool, so we have learned some theory about how reverse proxies work, now let's build our own! Before we dig in, let me give you a quick rundown of the plan and approach we'll be using.

First, we'll create two different services, and to demonstrate that reverse proxies really forward our request to different servers, we'll build one in Python and one in Node. Both services will be very simple, "Hello World" apps that only have one endpoint. We'll then use Nginx as our reverse proxy, and based on the path, we will be forwarding our request either to the Python or to the Node service.

We'll be doing all of this locally, using Docker, as we can easily define our services and run them on the same network, which Docker provides out of the box.

**What is Nginx?**

NGINX is open source software for web serving, reverse proxying, caching, load balancing, media streaming, and more. It can be used as an HTTP server, a proxy server and - you guessed it - a _reverse proxy_. Nginx is a really cool technology, that already has reverse proxy capabilities, so let's take advantage of that.

Ok, so let's talk about the setup. 

All of the code for this blog is available on my [GitHub](https://github.com/moonclash/blog-code-examples/tree/master/reverse-proxy-post)


Ok, so let's set everything up in our `docker-compose.yaml` file. We're basically going to be running 3 services - one, which is going to be the nginx service, and our main service and then one for our Python and one for our Node services.

```yml
version: '3'

services:
  python-boi:
    build: 
      context: .
      dockerfile: Dockerfile_python
    volumes:
      - ./python-app:/python-app
    working_dir: /python-app
    ports: 
      - 3000:3000
    networks:
      - proxy-net
    command: python3 server.py

  node-boi:
    build: 
      context: .
      dockerfile: Dockerfile_node
    volumes:
      - ./node-app:/node-app
      - /node-app/node_modules
    working_dir: /node-app
    ports: 
      - 8000:8000
    networks: 
      - proxy-net
    command: node server.js
    
  nginx:
    build:
      context: .
      dockerfile: Dockerfile_nginx 
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    ports: 
      - 80:80
      - 443:443
    networks:
      - proxy-net
networks:
  proxy-net:
```

Ok, so it kinda looks like there's a lot going on here, but let's break it down a little bit.

We define a service in our docker file, like we said above - one for nginx, the python and the node servers. Let's look at the python one:

```yml
python-boi:
    build: 
      context: .
      dockerfile: Dockerfile_python
    volumes:
      - ./python-app:/python-app
    working_dir: /python-app
    ports: 
      - 3000:3000
    networks:
      - proxy-net
    command: python3 server.py
```

In the `build` directive, we simply tell docker where to look for the dockerfile. We want it to look at the same directory the docker-compose file lives, and the dockerfile is named `Dockerfile_python`. With docker, you can specify which dockerfiles your sevices use. Let's look at the one we wrote about our python service.

```Dockerfile
FROM python:latest

WORKDIR /python-app

COPY ./python-app/requirements.txt /python-app/

RUN pip3 install -r requirements.txt
```

Nothing crazy here, we simply just specify we want a python ready image, create a `/python-app` directory and we copy the requirements and then we install them.

Here's how our server code looks like in the `server.py` file:

```python
from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello():
  return 'hello from the Python service!'

app.run(host='0.0.0.0', port=3000)
```

We start a very simple Hello World app with Flask and run it locally on port 3000.

Now let's look at our Node service:

```yml
node-boi:
    build: 
      context: .
      dockerfile: Dockerfile_node
    volumes:
      - ./node-app:/node-app
      - /node-app/node_modules
    working_dir: /node-app
    ports: 
      - 8000:8000
    networks: 
      - proxy-net
    command: node server.js
```
We are doing the same thing as we did for the python service, and the Dockerfile is quite similar too:

```Dockerfile
FROM node:latest

WORKDIR /node-app

COPY ./node-app/package.json .

RUN npm install
```

Same approach like before - we take a node ready image, copy some directories and install some dependencies. Let's take a look at the server code:

```javascript
const express = require('express')
const app = express()
const port = 8000

app.get('/', (req, res) => {
  res.send('Hello from the Node service!')
})

app.listen(port);
```

Like we said before - noting fancy, just a simple Hello World application.

Ok, so let's get on to the nginx part. The meat and potatoes of today's post. If you start nginx on its own and go to port 80, you'll be greeted by a default index page, provided by nginx. But we don't want that. We want to configure which port nginx runs on, what page we get by default for which path and so on. Nginx does this with a configuration file, that lives in `/etc/nginx/nginx.conf`. The NGINX configuration file is how we configure NGINX and tell it on which port to run, how to handle specific requests, etc.

Since we are using Docker, we can completely replace the default configuration file for NGINX with our own configuration, ny simply mounting it from our host machine to the container, using Docker volumes. Let's look at our NGINX service in the `docker-compose` file:

```yaml
nginx:
    build:
      context: .
      dockerfile: Dockerfile_nginx 
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    ports: 
      - 80:80
      - 443:443
    networks:
      - proxy-net
```
We define a service, called `nginx`, expose a couple of ports and then we mount the `nginx.conf` file from the root directory to the `/etc/nginx/` directory in the container, effectively replacing the config with our own.

### The Nginx config file

This is where the magic of our reverse proxy happens.

The Nginx config file, well it configures how Nginx works. By default it's located in the `/etc/nginx/` directory, and as we saw in our docker-compose file, we are replacing it with our own configuration so we can configure it to work as a reverse proxy.

The config file can be as complicated an as simple as we need it to be for our purpose, and it's composed of a varying part of configurations, known as "directives". Let's take a little gander at our configuration and see how it works:

```
events {}

 http {
   server {
     listen 80;
     
     location ~ ^/(node) {
       proxy_pass http://node-boi:8000;
     }

     location / {
       proxy_pass http://python-boi:3000;
     }
     
  }
}
```

We start off with the `http` block, which is a directive for web traffic, and it is considered universal.
Inside we have our `server` configuration, where we configure how our nginx server behaves.

We tell it to listen to port `80`, which means that when we spin up docker-compose, our site will be accessible on port `80`. 

Inside our server block we have two `location` directives - think of those as what do we want our server to do when a specific path has been hit.

When we hit `/`, our index, we use the `proxy_pass` keyword, which will redirect our traffic to our python service, and because our entire server is running in Docker, we can refer to our services by their names defined in the compose file, and Docker will ficgure out the routing for us. 

IF we hit `/node`, then the traffic will be directed to our node service!

That is it! That's how simple it is to build a local reverse proxy with Nginx!

### Summary

This article is a high level example of what reverse proxies are, their usage and getting our feet wet by building a simple local reverse proxy. I had a lot of fun learning about and building a reverse proxy, and as always - the code for this article can be found on my [Github](https://github.com/moonclash/blog-code-examples/tree/master/reverse-proxy-post)

Thanks for reading Andy, say hi to Jack and Madz :) 

Until next time.
