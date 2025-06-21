import { FC } from 'react';
import GlassCard from '../Components/GlassCard';

interface ContactMeProps {
  bioDataGmail: string;
  bioDataLinkedin: string;
}

const ContactMe: FC<ContactMeProps> = ({ bioDataGmail, bioDataLinkedin }) => {
  const messageChunks = [
    { type: 'text' as const, content: '🦉 Owl Post — Get in Touch\n\n', size: 'large' as const },
    {
      type: 'text' as const,
      content: 'Whether you’re a fellow wizard, curious Muggle, or a seeker of magical collaborations, feel free to send an owl my way.\n\n',
      size: 'small' as const
    },
    { type: 'text' as const, content: '📧 Owl Mail: ', size: 'medium' as const },
    {
      type: 'link' as const,
      content: 'Gmail',
      href: `mailto:${bioDataGmail}?subject=Reaching%20Out%20from%20Your%20Portfolio&body=Hi%20Ritam%2C%0A%0AI%20just%20visited%20your%20portfolio%20and%20wanted%20to%20connect...`,
      size: 'small' as const
    },
    { type: 'text' as const, content: '\n', size: 'small' as const },
    { type: 'text' as const, content: '🧙‍♂️ Floo Network: ', size: 'medium' as const },
    {
      type: 'link' as const,
      content: 'LinkedIn',
      href: bioDataLinkedin,
      size: 'small' as const
    },
    { type: 'text' as const, content: '\n\n', size: 'small' as const },
    {
      type: 'text' as const,
      content: 'The fireplace is always open for meaningful connections, spellbinding ideas, or just a friendly ',
      size: 'small' as const
    },
    { type: 'text' as const, content: 'Accio hello!', size: 'medium' as const }
  ];

  return (
    <GlassCard
      isMulti={false}
      messageChunks={messageChunks}
    />
  );
};

export default ContactMe;
