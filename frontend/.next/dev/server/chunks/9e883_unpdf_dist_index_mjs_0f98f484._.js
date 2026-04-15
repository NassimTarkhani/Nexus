module.exports = [
"[project]/frontend/node_modules/unpdf/dist/index.mjs [app-route] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/9e883_unpdf_dist_pdfjs_mjs_9d8366e4._.js",
  "server/chunks/9e883_unpdf_dist_index_mjs_16834d56._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/frontend/node_modules/unpdf/dist/index.mjs [app-route] (ecmascript)");
    });
});
}),
];