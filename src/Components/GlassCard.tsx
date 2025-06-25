import React, { useEffect, useState } from 'react';
import './Components.css';
import hedwig from '../assets/hedwig.png';

export type MessageChunk =
  | { type: 'text'; content: string; size?: 'small' | 'medium' | 'large' }
  | { type: 'link'; content: string; href: string;};

type GlassCardProps = {
  isMulti?: boolean;
  messageChunks?: MessageChunk[];
  message?: string;
  animationDelay?: number;
  showBackButton?: boolean;
  onBack?: () => void;
  onEdit?: () => void;      // For Transfigure
  onDelete?: () => void;    // For Obliviate
};

const GlassCard: React.FC<GlassCardProps> = ({
  isMulti = false,
  messageChunks,
  message = '',
  animationDelay = 0,
  showBackButton = false,
  onBack = () => {},
  onEdit,
  onDelete
}) => { 
  const [showDiv, setShowDiv] = useState(false);
  const [visibleChars, setVisibleChars] = useState(0);
  const [textAnimationStarted, setTextAnimationStarted] = useState(false);
  const [showSparks, setShowSparks] = useState(false);
  const animationDuration = 1000;
  const sparkAnimDuration = 5;
  const sparksCount = 2;
  const [isHoveringEdit, setIsHoveringEdit] = useState(false);
  const [isHoveringDelete, setIsHoveringDelete] = useState(false);
  const [isHoveringBack, setIsHoveringBack] = useState(false);
  const fullText = messageChunks
    ? messageChunks.map((chunk) => chunk.content).join('')
    : message;
  const totalLength = fullText.length;

  useEffect(() => setShowDiv(true), []);

  useEffect(() => {
    if (showDiv) {
      const timeout = setTimeout(() => setTextAnimationStarted(true), animationDuration + animationDelay);
      return () => clearTimeout(timeout);
    }
  }, [showDiv, animationDelay]);

  useEffect(() => {
    if (!textAnimationStarted || visibleChars >= totalLength) return;

    setShowSparks(true);
    const timeout = setTimeout(() => {
      setVisibleChars((prev) => prev + 1);
      setShowSparks(false);
    }, sparkAnimDuration);

    return () => clearTimeout(timeout);
  }, [textAnimationStarted, visibleChars, totalLength]);

  const getSizeClass = (size?: string) => {
    switch (size) {
      case 'large': return 'title-text';
      case 'medium': return 'date-text';
      case 'small': return 'description-text';
      default: return 'text-base';
    }
  };

  const renderAnimatedContent = () => {
    if (messageChunks) {
      let count = 0;
      const elements: React.ReactNode[] = [];

      for (const [i, chunk] of messageChunks.entries()) {
        if (count >= visibleChars) break;

        const remaining = visibleChars - count;
        const chunkContent = chunk.content.slice(0, remaining);

        if (chunk.type === 'text') {
          elements.push(<span key={i} className={getSizeClass(chunk.size)}>{chunkContent}</span>);
        } else if (chunk.type === 'link') {
          if (chunkContent.length > 0) {
            elements.push(
              <a
                key={i}
                href={chunk.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline description-text"
              >
                {chunkContent}
              </a>
            );
          }
        }

        count += chunk.content.length;
      }

      return elements;
    } else {
      return <span>{message.slice(0, visibleChars)}</span>;
    }
  };

  return (
    <>
      <div className={`glass-container-glasscard ${isMulti ? 'multi-glass' : 'page-glass'}${showDiv ? ' page-animate-in' : ''}`}>
        <div className='flex justify-center'><img src={hedwig} alt="hedwig" className='hedwig-icon' /></div>
        {!isMulti && showBackButton && (
          <div onClick={onBack} className="back-button" onMouseEnter={() => setIsHoveringBack(true)} onMouseLeave={() => setIsHoveringBack(false)}>
            ⏱ {isHoveringBack ? 'Back' : 'Time Turner'}
          </div>
        )}
        <p className="text-xl lg:text-2xl text-black text-left page-glow-text whitespace-pre-wrap">
          {renderAnimatedContent()}
          {visibleChars < totalLength && showSparks && (
            <span className="shooting-sparks-container">
              {[...Array(sparksCount)].map((_, i) => (
                <span key={i} className={`shooting-spark spark-${i}`}></span>
              ))}
            </span>
          )}
        </p>
        <div className='form-button-container'>
          {
            !isMulti && onEdit && 
            <button 
              onClick={onEdit} 
              className='form-button' 
              onMouseEnter={() => setIsHoveringEdit(true)} 
              onMouseLeave={() => setIsHoveringEdit(false)}
              style={{ fontFamily: 'HarryPotterFont', fontSize: '1.5rem', width: '200px' }}
            >
              {isHoveringEdit ? 'Edit' : 'Transfigure'}
            </button>
          }
          {
            !isMulti && onDelete && 
            <button 
              onClick={() => {
                if (window.confirm('⚠️ Are you sure you want to cast Obliviate and delete this entry?')) {onDelete?.();}
              }}  
              className='form-button' 
              onMouseEnter={() => setIsHoveringDelete(true)} 
              onMouseLeave={() => setIsHoveringDelete(false)}
              style={{ fontFamily: 'HarryPotterFont', fontSize: '1.5rem', width: '200px' }}
            >
                {isHoveringDelete ? 'Delete' : 'Obliviate'}
            </button>
          }
        </div>
      </div>
    </>
  );
};

export default GlassCard;