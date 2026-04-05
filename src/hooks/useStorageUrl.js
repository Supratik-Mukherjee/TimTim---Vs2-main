import { useState, useEffect } from 'react';
import { storage, ref, getDownloadURL } from '../firebase';

/**
 * Custom hook to resolve Firebase Storage (gs://) URLs to browser-friendly HTTPS URLs.
 * @param {string} url - The URL to resolve (can be gs:// or https://).
 * @returns {string|null} - The resolved HTTPS URL, or null while loading.
 */
export default function useStorageUrl(url) {
  const [resolvedUrl, setResolvedUrl] = useState(null);

  useEffect(() => {
    if (!url) {
      setResolvedUrl(null);
      return;
    }

    // If it's already an HTTPS link, just use it
    if (url.startsWith('http://') || url.startsWith('https://')) {
      setResolvedUrl(url);
      return;
    }

    // If it's a gs:// protocol, resolve it
    if (url.startsWith('gs://')) {
      const storageRef = ref(storage, url);
      getDownloadURL(storageRef)
        .then((downloadUrl) => {
          setResolvedUrl(downloadUrl);
        })
        .catch((err) => {
          console.error("Error resolving storage URL:", url, err);
          setResolvedUrl(null); // Fallback to null/placeholder
        });
    } else {
      // Treat as relative path in storage if it doesn't have a protocol
      const storageRef = ref(storage, url);
      getDownloadURL(storageRef)
        .then((downloadUrl) => {
          setResolvedUrl(downloadUrl);
        })
        .catch(() => {
          setResolvedUrl(url); // Final fallback to original string
        });
    }
  }, [url]);

  return resolvedUrl;
}
