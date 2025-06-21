import { useEffect, useState } from 'react';

export interface BioDetailsData {
  name: string;
  designations: string[];
  socialMedia: Record<string, string>;
  orcid: string;
}

export const useBioDetailsData = () => {
  const [data, setData] = useState<BioDetailsData | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_SERVER_URL}/api/bioDetails`)
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  return data;
};
