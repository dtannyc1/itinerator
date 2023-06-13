import { useState } from "react";
import { Modal } from "../context/Modal";
import SignupForm from "./SignupForm";

const SignupFormModal = () => {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <button className='nav-button' onClick={() => setShowModal(true)}>
                <i class="fa-solid fa-user-plus"></i>
                &nbsp;Sign Up
            </button>
            {showModal && (
                <Modal onClose={() => setShowModal(false)}>
                    <SignupForm />
                </Modal>
            )}
        </>
    )

}

export default SignupFormModal;