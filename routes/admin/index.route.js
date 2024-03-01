const dashboardRoutes = require("./dashboard.route");
const musicRoutes = require("./music.route");
const artistRoutes = require("./artist.route");
const systemConfig = require("../../config/system");
module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin;
    app.use(PATH_ADMIN + "/dashboard" ,dashboardRoutes);
    app.use(PATH_ADMIN + "/music", musicRoutes);
    app.use(PATH_ADMIN + "/artist", artistRoutes);
}