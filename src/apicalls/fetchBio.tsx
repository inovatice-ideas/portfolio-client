import { useEffect, useState } from 'react';

export interface BioData {
  bio: string;
}

export const useBioData = () => {
  const [data, setData] = useState<BioData | null>(null);

  useEffect(() => {
    const fetchBio = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/bio`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        const rawBio = await res.json();
        setData({ bio: rawBio.bio });
      } catch (err) {
        console.error('Error fetching bio:', err);
      }
    }
    fetchBio();
  }, []);

  return data;
};

export const updateBioData = async (updatedBioData: BioData) => {
  console.log(updatedBioData);
  fetch(`${import.meta.env.VITE_SERVER_URL}/api/bio`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedBioData)
  })
}
