import { FC, useState } from 'react';
import GlassCard, { MessageChunk } from '../Components/GlassCard';
import { Publication } from '../apicalls/fetchPublications';
import './Pages.css';

interface PublicationsProps {
  bioDataPublications: Publication[];
}

export const convertPublicationsToChunks = (bioDataPublications: any): MessageChunk[][] => {
  return bioDataPublications.map((publication: any) => [
    { type: 'text', content: '📄 ', size: 'medium' },
    { type: 'text', content: `${publication.title}\n\n`, size: 'large' },

    { type: 'text', content: '👥 Authors: ', size: 'medium' },
    { type: 'text', content: `${publication.authors}\n`, size: 'small' },

    { type: 'text', content: '📅 Year: ', size: 'medium' },
    { type: 'text', content: `${publication.year}\n`, size: 'small' },

    { type: 'text', content: '📚 Journal: ', size: 'medium' },
    { type: 'text', content: `${(publication.journal !== '') ? publication.journal : 'N/A'}\n`, size: 'small' },

    { type: 'text', content: '📚 Type: ', size: 'medium' },
    { type: 'text', content: `${publication.type}\n`, size: 'small' },

    { type: 'text', content: '🏢 Publisher: ', size: 'medium' },
    { type: 'text', content: `${publication.publisher}\n`, size: 'small' },

    { type: 'text', content: '🔗 DOI: ', size: 'medium' },
    { type: 'link', content: publication.doi, href: publication.doi, size: 'small' },
  ]);
};

export const convertPublicationsToCarousalChunks = (bioDataPublications: any): MessageChunk[][] => {
  return bioDataPublications.map((publication: any) => [
    { type: 'text', content: '📄 ', size: 'medium' },
    { type: 'text', content: `${publication.title}\n\n`, size: 'large' },

    { type: 'text', content: '👥 Authors: ', size: 'medium' },
    { type: 'text', content: `${publication.authors}\n`, size: 'small' },

    { type: 'text', content: '📅 Year: ', size: 'medium' },
    { type: 'text', content: `${publication.year}\n`, size: 'small' }
  ]);
};


const Publications: FC<PublicationsProps> = ({ bioDataPublications }) => {
  const [isCarouselView, setIsCarouselView] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const carousalChunks = convertPublicationsToCarousalChunks(bioDataPublications || []);
  const detailedChunks = convertPublicationsToChunks(bioDataPublications || []);

  const handleCardClick = (index: number) => {
    setSelectedIndex(index);
    setIsCarouselView(false);
  };

  const handleBack = () => {
    setSelectedIndex(null);
    setIsCarouselView(true);
  };

  return (
    <>
      {isCarouselView ? (
        <div className='carousal-container-wrapper'>
          <div className='carousal-container'>
            {carousalChunks.map((chunks, index) => (
              <div key={index} onClick={() => handleCardClick(index)} style={{ cursor: 'pointer' }}>
                <GlassCard isMulti={true} messageChunks={chunks} animationDelay={index * 650} />
              </div>
            ))}
            {carousalChunks.length === 0 && (
              <GlassCard isMulti={true} message={"Loading publications..."} />
            )}
          </div>
        </div>
      ) : (
        <GlassCard isMulti={false} messageChunks={detailedChunks[selectedIndex!]} showBackButton={true} onBack={handleBack} />
      )}
    </>
  );
};

export default Publications;
