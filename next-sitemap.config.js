/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.cinegame-critic.com", // Set your site URL
  generateRobotsTxt: true, // Generate a robots.txt file
  exclude: [
    "/Movies/TVShows/*", // Exclude dynamic subpages under /TVShows, if not necessary for SEO
    "/Signin", // Exclude login, signup, and other utility pages
    "/Signup",
    "/Verified",
  ],
  changefreq: "daily", // Set default change frequency
  priority: 0.7, // Set default priority for pages
  sitemapSize: 5000, // Max number of URLs per sitemap file
  additionalPaths: async (config) => [
    { loc: "/Movies/Movies-trending", changefreq: "daily", priority: 0.9 },
  ],
};
