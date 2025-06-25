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

export const usePublicationData = () => {
  const [data, setData] = useState<PublicationData | null>(null);
  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/publications/${import.meta.env.VITE_ORCID}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        const resData = await res.json();
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
      } catch (err) {
        console.error('Error fetching publications:', err);
      }
    }
    fetchPublications();
  }, []);

  return data;
};