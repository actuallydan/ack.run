module.exports = {
    async redirects() {
        return [
            {
                source: '/this',
                destination: '/api/this',
                permanent: true,
            },
        ]
    },
}