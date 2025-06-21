import { useEffect, useState } from 'react';

export interface Publication {
  title: string;
  type: string;
  journal: string;
  year: string;
  doi: string;
  authors: string;
  publisher: string;
}

export interface PublicationData {
  publications: Publication[];
}

export const usePublicationData = (orcid: string) => {
  const [data, setData] = useState<PublicationData | null>(null);
  useEffect(() => {
    if (!orcid) return; // Optional: skip if ORCID is not passed yet
  
    fetch(`${import.meta.env.VITE_SERVER_URL}/api/publications/${orcid}`)
      .then((res) => res.json())
      .then((resData) => {
        const rawPublications = resData.data || []; // Adjust based on API shape
        const formattedPublications: Publication[] = rawPublications.map((b: any) => ({
          title: b.title || '',
          type: b.type || '',
          journal: b.journal || '',
          year: b.year || '',
          doi: b.doi || '',
          authors: b.authors || '',
          publisher: b.publisher || ''
        }));
        setData({ publications: formattedPublications });
      })
      .catch(console.error);
  }, [orcid]);

  return data;
};