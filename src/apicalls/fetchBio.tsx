import { useEffect, useState } from 'react';

export interface BioData {
  bio: string;
}

export const useBioData = () => {
  const [data, setData] = useState<BioData | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_SERVER_URL}/api/bio`)
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
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
