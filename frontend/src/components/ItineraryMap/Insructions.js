import { useState } from "react";
import { Modal } from "../context/Modal";

const InstructionsModal = () => {
    const [showModal, setShowModal] = useState(false);
    
    const instructions = (
        <div className="instructions-holder">
            <div className="instructions">
                <div>Please follow these steps for a seamless experience:</div>

                <p>1. Select the activity type from the left screen.</p>
                <p>2. Choose from the selection provided above.</p>
                <p>3. Your choices will appear in the top section above the selection.</p>
                <p>4. When you are ready enter desired title and save your venture.</p>
                <p>5. Follow your chosen options using the interactive Google Map on the page.</p>
                <p>6. Enjoy your experience!</p>
            </div>
        </div>
    )
    
    return  (
        <>
        <button id="nav-button-venture" className="nav-button"  onClick={() => setShowModal(true)}>
                {/* <i className="fa-solid fa-id-badge"></i> */}
                &nbsp;Instructions
        </button>
        {showModal && (
            <Modal onClose={() => setShowModal(false)}>
                {instructions}
            </Modal>
        )}
        </>
    )

}

export default InstructionsModal;

