const ROUTES = [
    {
        url: "/api/client",
        images: true,
        proxyOptions: {
            target: "http://naspor-users:3001",
            changeOrigin: true,
        },
    },
    {
        url: "/api/admin",
        images: true,
        proxyOptions: {
            target: "http://naspor-users:3001",
            changeOrigin: true,
        },
    },
    {
        url: "/api/chat",
        proxyOptions: {
            target: "http://naspor-chats:3002",
            changeOrigin: true,
        },
    },
    {
        url: "/api/argument",
        images: true,
        proxyOptions: {
            target: "http://naspor-arguments:3003",
            changeOrigin: true,
        },
    },
    {
        url: "/api/category",
        images: true,
        proxyOptions: {
            target: "http://naspor-arguments:3003",
            changeOrigin: true,
        },
    },
    {
        url: "/api/team",
        images: true,
        proxyOptions: {
            target: "http://naspor-arguments:3003",
            changeOrigin: true,
        },
    },
    {
        url: "/api/ws",
        proxyOptions: {
            target: "ws://naspor-chats:6002",
            changeOrigin: true,
            ws: true,
        },
    },
]

module.exports = ROUTES
