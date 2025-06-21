import { FaGithub, FaLinkedin, FaTwitter, FaInstagram, FaFacebook, FaGoogle } from 'react-icons/fa';
import { SiGooglescholar } from 'react-icons/si';
import './Components.css';

const SocialMediaButtons = ({
  bioDataGithub, bioDataLinkedin, bioDataTwitter, bioDataInstagram, bioDataFacebook, bioDataGmail, bioDataScholar}: {
    bioDataGithub: string, 
    bioDataLinkedin: string, 
    bioDataTwitter: string, 
    bioDataInstagram: string, 
    bioDataFacebook: string, 
    bioDataGmail: string, 
    bioDataScholar: string
  }) => {
  const socialLinks = [
    {
      name: 'GitHub',
      icon: <FaGithub className="w-6 h-6 uniform-icon" />,
      url: bioDataGithub,
    },
    {
      name: 'LinkedIn',
      icon: <FaLinkedin className="w-6 h-6 uniform-icon" />,
      url: bioDataLinkedin,
    },
    {
      name: 'Twitter',
      icon: <FaTwitter className="w-6 h-6 uniform-icon" />,
      url: bioDataTwitter,
    },
    {
      name: 'Instagram',
      icon: <FaInstagram className="w-6 h-6 uniform-icon" />,
      url: bioDataInstagram,
    },
    {
      name: 'Facebook',
      icon: <FaFacebook className="w-6 h-6 uniform-icon" />,
      url: bioDataFacebook,
    },
    {
      name: 'Gmail',
      icon: <FaGoogle className="w-6 h-6 uniform-icon" />,
      url: `mailto:${bioDataGmail}`,
    },
    {
      name: 'Google Scholar',
      icon: <SiGooglescholar className="w-6 h-6 uniform-icon" />,
      url: bioDataScholar,
    },
  ];

  return (
    // <div className="w-full flex justify-center">
    //   <div className="glass-socials flex gap-4 justify-center items-center">
    //     {socialLinks.map((social) => (
    //       <a
    //         key={social.name}
    //         href={social.url}
    //         target={social.name === 'Gmail' ? undefined : "_blank"}
    //         rel={social.name === 'Gmail' ? undefined : "noopener noreferrer"}
    //         className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-300"
    //         aria-label={`Visit ${social.name} profile`}
    //       >
    //         {social.icon}
    //       </a>
    //     ))}
    //   </div>
    // </div>
    <div className="w-full flex justify-center">
      <div className="glass-socials flex gap-4 justify-center items-end">
        {socialLinks.map((social) => (
          <div key={social.name} className="icon-wrapper">
            <a
              href={social.url}
              target={social.name === 'Gmail' ? undefined : "_blank"}
              rel={social.name === 'Gmail' ? undefined : "noopener noreferrer"}
              className="icon-link"
              aria-label={`Visit ${social.name} profile`}
            >
              {social.icon}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocialMediaButtons; 