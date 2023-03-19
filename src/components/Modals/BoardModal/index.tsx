import Heading from "../../Heading";

type PropsBoardModal = {
  type: "add" | "edit";
};

//TODO: criar um componente que permite ter um template para edição de um board e um para add um novo board
//TODO: tudo no mesmo modal componente

export default function BoardModal({ type }: PropsBoardModal) {
  const viewAdd = (
    <div
      className="dialog dialog__add-board"
      role="dialog"
      id="dialog-add-board"
      aria-labelledby="dialog-label"
      aria-modal="true"
    >
      <Heading level={2} className="dialog__label" id="dialog-label">
        Add New Board
      </Heading>
    </div>
  );

  const viewEdit = <></>;
  
  return type === "add" ? viewAdd : viewEdit;
}
