"use client";

import { useState } from "react";
import styles from "./ConfirmDelete.module.css";

type ConfirmDeleteProps = {
    onConfirm: () => void;
    onCancel: () => void;
};

export default function ConfirmDelete({ onConfirm, onCancel }: ConfirmDeleteProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = () => {
        setIsOpen(true);
    };

    return (
        <div className={styles.container}>
            <div className={`${styles.btn} ${isOpen ? styles.isOpen : ""}`}>
                <div className={styles.btnBack}>
                    <p>Are you sure you want to do that?</p>
                    <button className={styles.yes} onClick={onConfirm}>Yes</button>
                    <button className={styles.no} onClick={() => { setIsOpen(false); onCancel(); }}>No</button>
                </div>
                <div className={styles.btnFront} onClick={handleClick}>Delete</div>
            </div>
        </div>
    );
}
