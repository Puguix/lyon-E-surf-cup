const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
    transpileDependencies: ["vuetify"],
    devServer: {
        proxy: "http://localhost:3000",
    },
    pages: {
        index: {
            entry: "./src/main.js",
            template: "public/index.html",
            filename: "index.html",
            title: "Site Name",
            chunks: ["chunk-vendors", "chunk-common", "index"],
        },
        admin: "./src/admin.js",
    },
});
