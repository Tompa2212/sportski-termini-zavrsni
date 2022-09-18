import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { ReactComponent as CloseIcon } from '../assets/icons/close.svg';
import { useOnClickOutside } from '../hooks/useOnClickOutside';

export const Modal: React.FC<{
  children: React.ReactNode;
  heading?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  show: boolean;
  onHide: () => void;
}> = ({ children, heading, show, onHide, style, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [show]);

  useOnClickOutside(containerRef, onHide);

  return (
    <>
      {show && (
        <Wrapper>
          <div ref={containerRef} className="modal">
            <div className="header">
              <h4>{heading}</h4>
              <CloseIcon onClick={onHide} cursor="pointer" />
            </div>
            <div className={`content ${className}`} style={style}>
              {children}
            </div>
          </div>
        </Wrapper>
      )}
    </>
  );
};

const Wrapper = styled.div`
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgb(0 0 0 / 0.4);

  display: grid;
  place-items: center;

  .modal {
    background-color: var(--bg-color);
    min-width: 30rem;
    padding: 0.6rem 1.5rem;
    border-radius: 1rem;
  }

  .content {
    overflow-y: auto;
    max-height: 80vh;
  }

  .header {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    align-items: center;
    justify-items: end;
    border-bottom: 1px solid var(--gray-light);
    margin-bottom: 1rem;

    h4 {
      font-weight: 400;
      font-size: 1.2rem;
      transform: translateX(50%);
    }

    svg {
      transform: scale(1.2);
    }
  }
`;
