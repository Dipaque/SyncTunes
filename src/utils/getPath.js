// Helper to inject the roomCode into the URL for <Link> tags
export const getPath = (routePattern, roomId = '') => {
    return routePattern.replace(':id', roomId);
}