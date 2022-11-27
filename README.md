# s3-site-bootstraper
A template repository with a complete setup for building static s3 websites

## Introduction

Amazon's S3 (Simple Storage Service) is AWS's basic storage service, where users can store any objects in "buckets". However, S3 has a cool functionality that can convert a bucket into a static website.

This template is useful for developers that want to spin up a quick static website for documentation purposes, personal websites, blogs, galleries, or anything that doesn't need a backend server.

The project includes a SASS and JavaScript transpilation, which will transform your sassy and es6 code into vanilla code and most importantly it includes a CircleCI setup, which will automatically transpile all of your code and upload it to your S3 bucket whenever you merge changes in your repository's `main` branch.


## Requirements

### Local development

For local dev, you need node and yarn installed on your system. 

This template uses SASS as a css preprocessor and the CSS is transpiled and minified to vanilla css with the `transpile:sass` command.

Consequently to transpile your modern JS, use the `transpile:js` command and to do both, use the `build` command.


### Shipping your static site to production

To enable the pipeline and start shipping your code, you first need to create a bucket in S3 and enable it as a static website, and then create a project in CircleCI pointing to the repository you've created from this template.

In CircleCI's project page set your environment variables from AWS:

`$AWS_ACCESS_KEY_ID`

`$AWS_DEFAULT_REGION`

`$AWS_SECRET_ACCESS_KEY`

`$DOCKERHUB_PASSWORD`

`$DOCKERHUB_USERNAME`

`$S3_BUCKET`

Once those variables are set, all you need to worry about is writing your SASS, JS and HTML and merging to your main branch. The pipeline will take care of transpiling and uploading your production code to your S3 Bucket.

### Useful links:

[Hosting a static site on a S3 bucket](https://docs.aws.amazon.com/AmazonS3/latest/userguide/HostingWebsiteOnS3Setup.html)

[Setting up a project on CircleCI](https://circleci.com/docs/2.0/getting-started/)

[Top 35 practices when using this template](https://www.youtube.com/watch?v=dQw4w9WgXcQ)




