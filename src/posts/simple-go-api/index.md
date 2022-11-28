---
title: 6 - Building a tiny API in Golang
date: "2021-02-07T22:12:03.284Z"
description: "Or struggling to do simple things in Go"
---

### A semi-long introduction to The Mladenoff Method

Hello from ya favourite soviet computer scientist! It has been a while since I wrote a blog post, mostly because I have been working so hard at work, that I have spent most of my free time avoiding code. Kinda when I was a chef working long hours at the kitchen and didn't even want to butter my toast after a heavy work. Whatever, I am back now and this time I'll teach you some Go. Well I'll learn some Go and you'll learn what I have learned along.

This blog post and the mini project that comes with it is inspired by myself. That's right - you can be inspired by yourself and it's pretty great, but let's focus on the inspiration itself. Traditionally when it comes to learning new technology, over the years I have pretty much followed a very consistent format - since I am a visual learner, I prefer watching other people explain something, and in the process, I pause the video, take notes, or try to implement what they just taught me in an IDE. This approach has always proved effective for me, and I am a big fan of the "If it works - don't fix it" principle.

But even as this approach proves to be effective for me, I thought that I could do some experimentation and try a different way of learning, and this is how I came up with this method. We will call it "The Mladenoff Method" or TMM for short. TMM is a very simple - if you want to learn something new, like a new language, or a framework, or a design pattern - build something simple with is as you learn.

The idea behind TMM is that you will get a more engaging learning experience, and it's slightly combined with the idea of "Flow" by Mihaly Csikszentmihalyi (you bet your sweet ass I had to google his name). The concept of Flow you probably already know about, as his book has been referenced in just about every single self improvement article / book you have come across, but I'll give you a quick tldr; on one of the fundamental Flow theories - a person is at their happies when they are working on something and obtaining a self of achievment from their work. So I figured - Effective Learning = Happiness = Working on somethng. I figured that if I inject my brain with a few shots of endorphines I will retain more information and develop a better understanding of the subject.

So this post is the first one of the TMM documented series, and here is what we'll be going through today:

- Objective - Learn a little bit of GoLang
- Method - build a super simple GET/POST API

### The Mladenoff Method in action

Ok, so I'll start with a confession on why Golang - quite literally because I really like the goofy gopher mascot they have. That's it. Ok, also, because it's a compiled systems language that has a very versatile range of uses, and because I have glimpsed at its syntax a few times and I found it pleasing to the eye. I opened up my trusty IDE (which is now VS Code, sorry Sublime, we had a good run for so many years, but VSCode is so much better), and started coding.

I wanted to build something that would be simple enough for me to build as a concept, in a foreign language, so I decided to build a very tiny API, that serves as a little dictionary. 

My technical requirements are:

Have an API with 2 endpoints:

1. `GET` - retrieves an entry from the dictionary
2. `POST` - creates an entry in the dictionary

This is it! No deletes, no update, just a simple READ/WRITE API that would save entries in a database and retrieve them upon demand.
Right, now that we have our requirements, let's get GOing! (haha I am hilarious)

If you ever talked to me about coding for more than 2 minutes, you know how much I love isolated environments and that I take pride that I don't have a single programming language installed on any of my systems. So as always, let's start with setting up our `Dockerfile` and `docker-compose.yaml`, so we can have that sweet, sweet isolated environment to work in.

Dockerfile:

```Dockerfile
FROM golang:latest

WORKDIR /gopi

RUN apt update -y && apt install -y sqlite3

COPY . .
```

Nothing crazy here, we just create an image from a golang-ready image from docker-hub, create directory called `gopi`, install `sqlite3` and copy all of our current host directory in the container directory.

And our docker-compose:

```yaml
version: '3'

services:
  gopi:
    build:
      context: .
      dockerfile: Dockerfile
    volumes: 
      - .:/gopi
    ports: 
      - '8080:8080'
    environment:
      - GO111MODULE=on
    command: go run api.go
```

We create our service, called `gopi` here, tell it to use the `Dockerfile` as base for its image, bind our host directory to the container directory, so we have data persistence between our directories and connect port `8080` from our host machine to the container machine. Easy.

Let's start writing some Golang!

I needed 2 main things to get this project going - a simple library to spin up a server and a way to interact with a database. After some research, I chose `gin` as my web framework and `go-sqlite3` as my DB driver. They both are community favourites with frequent updates and community support.

In Python and in JS, which are my main languages it is pretty easy to specify which libraries you need in your project. You put them in a file and install them. In Go it is a little bit different, as you have a couple of choices. I made a main file for my web app, which I called `api.go` and imported `gin` like so:

```go
package main

import (
  "encoding/json"
  "github.com/gin-gonic/gin"
  "github.com/moonclash/blog-code-examples/gopi/database"
)
```

Here we see 3 imports. 

`encoding/json` is a builtin package in Go.

`github.com/gin-gonic/gin` points to the GH repo of where `gin` lives 

Ok, but what is this third import that points to my own GitHub? And it points to the same repository where the code that I am writing is located? Huh?

Well, welcome to the confusion that importing your own code in Go is.

So if you are coming from another programming language, you are used to something like this:

If you have some code in file A, and you want to import code from file B in file A, you would do something like:

```
import NiceFeature from B
NiceFeature.doSomethingNice()
```
Well, Go doesn't work that way. Like I said earlier, I could have done everything in one file due to the size of the project, but I did want to have a little bit of separation and have my database related code in one file, which I could then import in my api file and just use exported functions.

As far as I understood it, in Go, you can either have your own code packaged up and then added to the go path environmental variable and then reference it, which after several attemps I concluded was way too overcomplicated for local development - or you could do what the community swears by - use Go modules.

The principle of Go modules is that you create your code as module, and then refer to it the same way we refer to the `gin` framework. 

So I ssh'd inside of my container and ran `go mod init`, which made a file called `go.mod` in my directory:

`go.mod`

```go
module github.com/moonclash/blog-code-examples/gopi

go 1.13

require (
	github.com/gin-gonic/gin v1.6.3
	github.com/mattn/go-sqlite3 v1.10.0
	github.com/moonclash/blog-code-examples v1.0.0
)

```

Note - you need to go to your github repository you are referring to in your module and give it a version, as the go module syntax requires every module to be versioned. I think this is a neat little feature, as it promotes a best practice to version your code, by forcing you to version your own modules.

I versioned my repository, pushed up my code and was now able to import my database code in my api code. The only downside is that every change I made and wanted to see in action, I had to `git push`, but compared to the alternatives or to doing that same module development but for local changes, then pushing code every few changes did not seem that bad at all. Plus more green squares on my GH, so why not.

Ok, so now that we have managed to learn how to import code, let's start writing out our API and the supporting database code.

Let's start with the database module, which we'll call `db_manager.go`

db_manager.go

```go
package database

import (
  "os"
  "database/sql"
  "fmt"
  _ "github.com/mattn/go-sqlite3"
)

```

Here we create our package called `database`, which we'll later use to refer to the code inside and import a few modules

Our first function will create our database like so:

```go
func CreateDB() {
  os.Create("./data.db")
  db, err := sql.Open("sqlite3", "./data.db")
  checkErr(err)
  _, err = db.Exec("CREATE TABLE IF NOT EXISTS `definitions` (`definition_id` INTEGER PRIMARY KEY AUTOINCREMENT, `short_name` VARCHAR(255), `long_name` VARCHAR(255))")
  checkErr(err)
}
```

We use the `os` module to create a file, and then use that file to open a `sqlite3` connection. We then create a very simple table with 3 columns, and do an error check each time with a simple `checkErr` function:

```go
func checkErr(err error) {
  if err != nil {
    fmt.Println(err)
    os.Exit(1)
  }
}
```

You may have noticed that one of our functions is capitalized, and the other one starts with a lower case letter - this is one more of those neat things about Go that I really liked - if you want any function or structure to be exported, you **must** name it with a capital letter - this promotes good naming conventions, that can be applied to other languages too.

I wanted to have my database related code that queries and creates entries in my table coupled together, so I did some research about classes and structures in Go. Go doesn't have traditional OOP classes, but instead you can use structures, to which you can attach properties and methods, and then export for usage.

Let's create a structure for our DB code:

```go
type DBManager struct {
  db *sql.DB
}
```

This creates a structure, with one property, which is a db instance.

```go
func New(db *sql.DB) DBManager {
  _db := DBManager {db}
  return _db
}
```
And now we attach a method, called `New` to our `DBManager`, which sets the instance.

```go
func (_db DBManager) InsertDefinition(key string, definition string) {
  db, err := sql.Open("sqlite3", "./data.db")
  checkErr(err)
  _db.db = db
  insertQuery := "INSERT INTO definitions (short_name, long_name) VALUES (?, ?)"
  statement, err := _db.db.Prepare(insertQuery)
  checkErr(err)
  statement.Exec(key, definition)
  checkErr(err)
}
```
Here we create a simple `InsertDefinition` method, which takes a key and a definiton and inserts it in our database.

```go
func (_db DBManager) RetrieveDefinition(key string) (string, string) {
  db, err := sql.Open("sqlite3", "./data.db")
  checkErr(err)
  _db.db = db
  string_query := fmt.Sprintf("select short_name, long_name from definitions where short_name = '%s'", key)
  rows, err := _db.db.Query(string_query)
  checkErr(err)
  var short_name string
  var long_name string
  for rows.Next() {
    err = rows.Scan(&short_name, &long_name)
    checkErr(err)
  }
  rows.Close()
  return short_name, long_name
}
```

And respectively, a simple method that will retrieve a definition from our database.

I really like it here, how Go forces us to define the types of arguments we are supplying to our function and the type and number of outputs it has. 
Here we establish a connection to the database and simply use a query, which we format with Go's `fmt.Sprintf` method. The weird `&` operator is Go's way to point a vavlue to a variable's address, so when we say `rows.Scan(&short_name, &long_name)`, we point the return values of `rows.Scan` to the `short_name` and `long_name` variables, which we have defined as strings. We then simply return them from the function.

So far, so good. We have all of our database related code ready, and we can use it in our API to create and retrieve dictionary definitions, based on a request method.


Let's look at our `api.go` file:

```go
package main

import (
  "encoding/json"
  "github.com/gin-gonic/gin"
  "github.com/moonclash/blog-code-examples/gopi/database"
)

func main() {
  database.CreateDB()
  DatabaseManager := database.New(nil)
  router := gin.Default()
  router.GET("/ping", func(c *gin.Context) {
    c.JSON(200, gin.H{
      "message": "pong",
    })
  })

  router.GET("/fetch/:short", func(c *gin.Context) {
    short_def := c.Param("short")
    short_name, long_name := DatabaseManager.RetrieveDefinition(short_def)
    c.JSON(200, gin.H{
      "short_name": short_name,
      "long_name": long_name,
    })
  })

  router.POST("/create", func(c *gin.Context) {
    decoder := json.NewDecoder(c.Request.Body)
    var definitionStruct struct {
      Short string
      Long string
    }
    decoder.Decode(&definitionStruct)
    DatabaseManager.InsertDefinition(definitionStruct.Short, definitionStruct.Long)
  })
  router.Run()
}
```

Here, when we run our file, we first create our database and our `definitions` table if it doesn't exist already. We then create a router from `gin`

Here's a simple `GET` request that returns `pong` if we hit `/ping`:

```go
   router.GET("/ping", func(c *gin.Context) {
    c.JSON(200, gin.H{
      "message": "pong",
    })
  })
  ```

  Following this pattern, we can implement a `GET` that will call our database manager's `RetrieveDefinition` method and give us a response with the query results as JSON:


```go
 router.GET("/fetch/:short", func(c *gin.Context) {
    short_def := c.Param("short")
    short_name, long_name := DatabaseManager.RetrieveDefinition(short_def)
    c.JSON(200, gin.H{
      "short_name": short_name,
      "long_name": long_name,
    })
  })
  ```

  Here, in the path this colon syntax `/:short` means that we are referring to a variable in the path.

  We can then get that varible with `gin`'s `.Param` method like so:

  ```go
  short_def := c.Param("short")
  ```

  And we only need to provide one argument to our function to get the definition of the entry:

  ```go
  short_name, long_name := DatabaseManager.RetrieveDefinition(short_def)
  ```

  We then simply return it like so:

  ```go
  c.JSON(200, gin.H{
      "short_name": short_name,
      "long_name": long_name,
    })
  ```

  Okay, so let's implement a POST method to create new defintions with values from the request's body:

  ```go
  router.POST("/create", func(c *gin.Context) {
    decoder := json.NewDecoder(c.Request.Body)
    var definitionStruct struct {
      Short string
      Long string
    }
    decoder.Decode(&definitionStruct)
    DatabaseManager.InsertDefinition(definitionStruct.Short, definitionStruct.Long)
  })
  ```

  Now, the biggest trouble I had here was figuring out how to read the request's body and get the values from it. Go doesn't really let you do that easy, same as importing and using your own code.

  We need to use a JSON decoder to decode the request's body, as we receive it as a buffer.

  Then we have to define a structure like so

  ```go
  var definitionStruct struct {
      Short string
      Long string
    }
  ```

  We then call the `.Decode` method and poing the return values to the address of our structure, and boom! We are ready to use it!

  As always all of this code is available on my [GitHub](https://github.com/moonclash/blog-code-examples/tree/master/gopi), and if you want to run it and send some POST's and GET's all you need is to cd in to the `gopi` directory and run `docker-compose up`!

### Reflections on The Mladenoff Method and Go

I really enjoyed this method of learning by building. I ran into so many problems that video tutorials normally don't provide, had to dig in to StackOverflow, GitHub issues, read different libraries documentation and engage with the community. The entire learning process kept me very engaged, and every time I made something work it was a tiny victory, a little explosion of dopamine that made me want to keep going. Even for a tiny project, I got some solid learnings and insights, and if you want to give it a go - I strongly recommend picking up something you have no experience with and start building!

My reflections on Go are:

It really forces you to write good code, your code won't compile if you have unused variables, you have to version your own code if you want to use it as module, you have to adhere to specific naming conventions when you want to export methods, and I really enjoyed working with structures and the concepts of pointing return values to variable's addresses. It has a nice syntax and it's a bit more difficult than Python and JS, as you have to do some extra work, that you normally take for granted. If I had to change one thing though it definitely would be the way code is imported for local development. It should be simpler that the way it is now, and perhaps if there was an environmental variable that dictated if you had to package up your code or use modules, or just simply import it locally, then I would REALLY love Go. 


Well that was it for this time, I hope you made it so far down the line, this was a big boi post (Hi Andy!)

Until next time!


