const fs = require('fs');

fs.readdir('dist/posts/', (error, data) => {
    if (error) {
        return;
    }
    convertedPosts = data.map(post => `<a href="posts/${post}">${post}</a>`);
    fs.readFile('index-skeleton.html', 'utf-8', (error, data) => {
        if (error) {
            throw new Error();
        }
        fs.writeFile('dist/index.html', data.replace(/<!-- articles go here -->/gi, convertedPosts.join('\n')), 'utf-8',
         (err, data) => {

        })
    })
});