export async function GET() {
    // This API route will not work in static builds
    // Consider fetching data directly in components or using a build-time data generation
    try {
        const response = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vSyceMwoDVbcwIz8qp3n2wtjg8zdo5S7Egb7CzurL5ma8csOvON1kQzBA1gETVFNHB_FX6N67K0oX62/pub?output=tsv')
    
    const csvText = await response.text();

    const rows = csvText.split('\n');
    const headers = rows[0].split('\t');
    const data = rows.slice(1).map(row => {
        const values = row.split('\t');
        return headers.reduce((acc, header, index) => {
            const value = values[index].trim();

            if(!isNaN(Number(value))) {
                acc[header.trim()] = Number(value);
            } else {
                acc[header.trim()] = values[index].trim();
            }
            return acc;
        }, {});
    });

        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        // Return empty array during build if fetch fails
        return new Response(JSON.stringify([]), { status: 200 });
    }
}