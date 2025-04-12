module.exports = {
    proxy: "http://localhost:3000", // your Express app
    files: ["public/*.css", "views/**/*.ejs"], // files to watch
    port: 4000, // port for BrowserSync
    open: true,
    notify: false
  };