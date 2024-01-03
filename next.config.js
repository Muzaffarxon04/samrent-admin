module.exports = {
  reactStrictMode: false,
  images: {
    domains: ["api.samavtorent.uz", "164.92.117.144"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "164.92.117.144",
        port: "2021",
        pathname: "/v1/file/",
      },
    ],
  },
};
