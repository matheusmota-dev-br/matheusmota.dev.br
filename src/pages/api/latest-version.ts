export async function GET() {
    // This API route will not work in static builds
    // Consider fetching data directly in components or using a build-time data generation
    try {
        const response = await fetch('https://github.com/matheusmota-dev-br/professional-portifolio/releases/latest');

        const finalUrl = response.url;
        const paths = new URL(finalUrl).pathname.split('/');
        const latestVersion = paths[paths.length - 1];

        return new Response(JSON.stringify({ version: latestVersion }), { status: 200 });
    } catch (error) {
        // Return empty version during build if fetch fails
        return new Response(JSON.stringify({ version: '' }), { status: 200 });
    }
}
