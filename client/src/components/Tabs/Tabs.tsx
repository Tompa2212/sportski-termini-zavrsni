import React from 'react';
import styled from 'styled-components';
import { TabsProps } from '.';

export const Tabs: React.FC<TabsProps> = ({ children, activeKey, onSelect }) => {
  return (
    <Wrapper>
      <ul>
        {React.Children.map(children, (tab) => {
          return (
            <li key={tab?.props.title}>
              <button
                className={`${tab?.props.eventKey === activeKey ? 'active' : ''}`}
                onClick={() => onSelect(tab?.props.eventKey || '')}
              >
                {tab?.props.title}
              </button>
            </li>
          );
        })}
      </ul>
      <div className="content">
        {React.Children.map(children, (tab) => {
          if (tab?.props.eventKey !== activeKey) {
            return <div role="tabpanel">{tab?.props.children}</div>;
          }

          return (
            <div role="tabpanel" className="show">
              {tab.props.children}
            </div>
          );
        })}
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  ul {
    display: flex;
    align-items: center;
    list-style: none;
    margin: 0;
    padding: 0;
    margin-bottom: 2rem;
    border-bottom: 1px solid var(--gray-light);

    button {
      cursor: pointer;
      border: 1px solid transparent;
      border-top-left-radius: 0.3rem;
      border-top-right-radius: 0.3rem;

      margin-bottom: -1px;
      padding: 0.7rem;
      transition: border-color 200ms ease;
      background: 0 0;

      &:hover {
        border-color: var(--gray-light);
      }

      &.active {
        color: var(--primary);
        background-color: var(--white);
        border-color: var(--gray-light);
        border-bottom: 1px solid transparent;
      }
    }
  }

  .content {
    & > div {
      display: none;
    }

    & > div.show {
      display: block;
    }
  }
`;
