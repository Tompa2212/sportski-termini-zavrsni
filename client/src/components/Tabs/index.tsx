import { ReactElement } from 'react';

export interface TabsProps {
  className?: string;
  children?: ReactElement<TabProps> | Array<ReactElement<TabProps>>;
  activeKey: string;
  onSelect: (key: string) => void;
}

export interface TabProps {
  className?: string;
  children: React.ReactNode;
  eventKey: string;
  title: string;
}
