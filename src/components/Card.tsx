import styled, { css } from "styled-components";
import { TProduct } from "../utils/types";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import { useState } from "react";
import { useProductsStore } from "../store";
type Props = {
  cardInfo: TProduct;
  index: number;
};

export const Card = ({ cardInfo, index }: Props) => {
  const [open, setOpen] = useState(false);
  const draggingItemId = useProductsStore((state) => state.draggingItemId);
  const setDraggingItemId = useProductsStore(
    (state) => state.setDraggingItemId
  );
  const setRanking = useProductsStore((state) => state.setRanking);

  const openModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    const { id } = event.currentTarget;
    setDraggingItemId(id);
  };

  const handleDragEnd = () => {
    if (!draggingItemId) return;
    setRanking(draggingItemId, index);
    setDraggingItemId(null);
  };

  const cardId = cardInfo.id.toString();

  return (
    <StyledCard
      draggable
      id={cardInfo.id.toString()}
      onDragStart={handleDragStart}
      onDrop={handleDragEnd}
      onDragOver={(e) => e.preventDefault()}
      disabled={draggingItemId === cardId}
    >
      <img alt={cardInfo.title} className="card-img" src={cardInfo.image} />
      <div className="card-body">
        <h4 className="card-title">{cardInfo.title}</h4>
        <Button onClick={openModal}>View more</Button>
      </div>

      <Modal open={open} onClose={onCloseModal} center>
        <ModalContent>
          <h2>{cardInfo.title}</h2>
          <img
            src={cardInfo.image}
            alt={cardInfo.title}
            className="modal-img"
          />
          <p>{cardInfo.description}</p>

          <div className="flex-between">
            <div>Rating: {cardInfo.rating.rate}</div>
            <div>Price: ${cardInfo.price}</div>
          </div>
        </ModalContent>
      </Modal>
    </StyledCard>
  );
};

const StyledCard = styled.div<{ disabled?: boolean }>`
  border-radius: 1rem;
  background: lightgrey;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 30px 50px -12px inset,
    rgba(0, 0, 0, 0.3) 0px 18px 26px -18px inset;
  border: 1px solid lightgrey;

  .card-img {
    height: 200px;
    object-fit: cover;
    width: 100%;
    border-top-right-radius: 1rem;
    border-top-left-radius: 1rem;
  }

  .card-body {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    justify-items: end;
  }

  .card-title {
    margin: 0;
    color: #1f2937;
    height: 3.5em;
  }

  ${({ disabled }) =>
    disabled &&
    css`
      cursor: not-allowed;
      opacity: 0.5;
      border: 1px dotted red;
    `}
`;

const ModalContent = styled.div`
  .flex-between {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #c7d2fe;
    padding: 1rem;
    border-radius: 5px;
  }

  .modal-img {
    width: 100%;
    height: 400px;
    object-fit: contain;
  }
`;

const Button = styled.button`
  border: none;
  margin-top: 1rem;
  width: 100%;
  padding: 0.75rem 1.5rem;
  background-color: #488aec;
  color: #ffffff;
  font-weight: 700;
  cursor: pointer;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px #488aec31, 0 2px 4px -1px #488aec17;
  transition: all 0.6s ease;

  &:hover {
    box-shadow: 0 10px 15px -3px #488aec4f, 0 4px 6px -2px #488aec17;
  }

  &:focus,
  &:active {
    opacity: 0.75;
    box-shadow: none;
  }
`;
