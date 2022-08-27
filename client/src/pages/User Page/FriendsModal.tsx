import React, { useState } from 'react';
import { Modal } from '../../components/Modal';

interface FriendsModalProps {
  numOfFriends?: number;
}

export const FriendsModal: React.FC<FriendsModalProps> = ({ numOfFriends = 0 }) => {
  const [show, setShow] = useState(false);

  return (
    <Modal show={show} heading="Prijatelji" onHide={() => setShow(false)}>
      <button
        className="btn btn--outline"
        style={{ padding: 0 }}
        onClick={() => setShow(true)}
      >
        Prijatelji: <span className="bold">{numOfFriends}</span>
      </button>
    </Modal>
  );
};
