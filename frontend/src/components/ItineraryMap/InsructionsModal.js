import { useState } from "react";
import { Modal } from "../context/Modal";

export const instructions = (
    <div className="instructions-holder">
        <div className="instructions">
            <div>For a seamless experience, please follow these steps:</div>

            <p>1. Start by selecting your preferred activity type from the options listed below the map.</p>
            <p>2. Once you've chosen an activity type, select a place from the provided selection above.</p>
            <p>3. Your selected choices will be displayed in the top section, right above the selection area.</p>
            <p>4. When you're ready, enter a desired title for your venture and save it.</p>
            <p>5. To navigate and explore, utilize the interactive Google Map on the page, following your chosen options.</p>
            <p>6. Enjoy your fantastic experience!</p>
        </div>
    </div>
)

const InstructionsModal = () => {
    const [showModal, setShowModal] = useState(false);
    
    return  (
        <>
        <button id="nav-button-venture" className="nav-button"  onClick={() => setShowModal(true)}>
                <i className="fa-solid fa-file-circle-check"></i>
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

