# s3-blogger
A template repository with a complete setup for hosting a static blog on Amazon S3

## Introduction

Amazon's S3 (Simple Storage Service) is AWS's basic storage service, where users can store any objects in "buckets". However, S3 has a cool functionality that can convert a bucket into a static website.

This template can be used by anyone that wants a simple blog and an even simpler writing experience. All you gotta do is go to the `/src/posts` directory, create a folder, create an `index.md` file inside and let your creative juices flow!

I've chosen to go with Markdown as the format for writing as it's widely known and extremely simple to learn and use.

There's some basic styling to make the blog posts look nice, like so:

<img width="822" alt="Screenshot 2022-11-28 at 16 44 35" src="https://user-images.githubusercontent.com/12881226/204320443-05c66ddf-1170-4964-bcb8-1127a1ed2464.png">


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

Once you have these in place, all you need to do is write your blog posts and pusht to `main` - the pipeline will take care of converting your markdown into html and will build a simple routing table at the index.html file.

### Useful links and answers:

Amazon S3 bucket policy to allow your static website to be accessed by the public:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": [
                "s3:GetObject"
            ],
            "Resource": [
                "arn:aws:s3:::Bucket-Name/*"
            ]
        }
    ]
}
```

[The s3-bootsrapper template this is based on](https://github.com/moonclash/s3-site-bootstraper)

[Hosting a static site on a S3 bucket](https://docs.aws.amazon.com/AmazonS3/latest/userguide/HostingWebsiteOnS3Setup.html)

[Setting up a project on CircleCI](https://circleci.com/docs/2.0/getting-started/)

[Top 35 practices when using this template](https://www.youtube.com/watch?v=dQw4w9WgXcQ)




