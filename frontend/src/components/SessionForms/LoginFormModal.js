import { useState } from "react";
import LoginForm from "./LoginForm";
import { Modal } from "../context/Modal";

const LoginFormModal = () => {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <button className='nav-button' onClick={() => setShowModal(true)}>
                <i class="fa-solid fa-id-badge"></i>
                &nbsp;Log In
            </button>
            {showModal && (
                <Modal onClose={() => setShowModal(false)}>
                    <LoginForm />
                </Modal>
            )}
        </>
    )

}

export default LoginFormModal;