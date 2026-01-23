import { useState } from "react";
import { actions } from "@/lib";
import { Loading } from "@/components/Loading";

export function ShortenUrl() {
  const [url, setUrl] = useState<string>('');
  const [shortenedUrl, setShortenedUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  function handleCopy() {
    navigator.clipboard.writeText(shortenedUrl);
  }

  async function handleGenerateShortUrl() {
    if (!url.length) return;

    setLoading(true);
    const data = await actions.shortenUrl(url);
    setShortenedUrl(data.shortURL);
    setLoading(false);
  }

  return (
    <div className="flex flex-col gap-4">
      <input
        className="rounded-md bg-offset px-4 py-4 outline-none w-full text-center"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://example.com/a/b?c=d#e"
        required
      />

      <button
        type="button"
        className="w-full px-10 py-4 text-base text-center font-semibold transition-all duration-200 rounded bg-primary hover:bg-secondary focus:bg-secondary text-white disable:cursor-not-allowed disabled:opacity-50"
        onClick={handleGenerateShortUrl}
      >
        Generate Short URL
      </button>

      {loading && (
        <div className="relative flex justify-center">
          <Loading />
        </div>
      )}

      <pre className="relative mt-8">
        <input
          placeholder="Shortened URL"
          value={shortenedUrl}
          readOnly
          className="bg-default border-2 border-default rounded-md p-4 w-full shadow-md outline-none text-center"
        />
        <div className="group absolute top-1/2 -translate-y-1/3 right-10">
          <button
            onClick={handleCopy}
            className="hover:text-primary active:text-secondary"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M15 1.25h-4.056c-1.838 0-3.294 0-4.433.153c-1.172.158-2.121.49-2.87 1.238c-.748.749-1.08 1.698-1.238 2.87c-.153 1.14-.153 2.595-.153 4.433V16a3.75 3.75 0 0 0 3.166 3.705c.137.764.402 1.416.932 1.947c.602.602 1.36.86 2.26.982c.867.116 1.97.116 3.337.116h3.11c1.367 0 2.47 0 3.337-.116c.9-.122 1.658-.38 2.26-.982s.86-1.36.982-2.26c.116-.867.116-1.97.116-3.337v-5.11c0-1.367 0-2.47-.116-3.337c-.122-.9-.38-1.658-.982-2.26c-.531-.53-1.183-.795-1.947-.932A3.75 3.75 0 0 0 15 1.25m2.13 3.021A2.25 2.25 0 0 0 15 2.75h-4c-1.907 0-3.261.002-4.29.14c-1.005.135-1.585.389-2.008.812S4.025 4.705 3.89 5.71c-.138 1.029-.14 2.383-.14 4.29v6a2.25 2.25 0 0 0 1.521 2.13c-.021-.61-.021-1.3-.021-2.075v-5.11c0-1.367 0-2.47.117-3.337c.12-.9.38-1.658.981-2.26c.602-.602 1.36-.86 2.26-.981c.867-.117 1.97-.117 3.337-.117h3.11c.775 0 1.464 0 2.074.021M7.408 6.41c.277-.277.665-.457 1.4-.556c.754-.101 1.756-.103 3.191-.103h3c1.435 0 2.436.002 3.192.103c.734.099 1.122.28 1.399.556c.277.277.457.665.556 1.4c.101.754.103 1.756.103 3.191v5c0 1.435-.002 2.436-.103 3.192c-.099.734-.28 1.122-.556 1.399c-.277.277-.665.457-1.4.556c-.755.101-1.756.103-3.191.103h-3c-1.435 0-2.437-.002-3.192-.103c-.734-.099-1.122-.28-1.399-.556c-.277-.277-.457-.665-.556-1.4c-.101-.755-.103-1.756-.103-3.191v-5c0-1.435.002-2.437.103-3.192c.099-.734.28-1.122.556-1.399" clip-rule="evenodd" /></svg>
          </button>
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-sm rounded-lg px-3 py-1 shadow-lg">
            Copy
          </div>
        </div>
      </pre>
    </div>
  )
}