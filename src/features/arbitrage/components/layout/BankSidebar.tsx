import React from "react";
import { MdClose } from "react-icons/md";

interface BankSidebarProps {
    bank: number;
    onBankChange: React.Dispatch<React.SetStateAction<number>>;
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
}

const BankSidebar: React.FC<BankSidebarProps> = ({
    bank,
    onBankChange,
    isSidebarOpen,
    setIsSidebarOpen,
}) => {
    const handleAdjust = (delta: number) => {
        onBankChange((current) => Math.max(0, current + delta));
    };

    return (
        <aside
            id="bank-sidebar"
            className={`bank-sidebar ${isSidebarOpen ? "open" : ""}`}
            aria-label="Gestión de capital"
        >
            <div className="bank-sidebar__header">
                <span className="bank-sidebar__icon" aria-hidden="true">
                    💰
                </span>
                <h3>Capital (Bank)</h3>
                <button
                    type="button"
                    className="bank-sidebar__close"
                    onClick={() => setIsSidebarOpen(false)}
                >
                    <MdClose aria-hidden="true" />
                    <span className="sr-only">Cerrar panel de bank</span>
                </button>
            </div>

            <div className="bank-sidebar__group">
                <label htmlFor="bank-input">Capital disponible</label>
                <div className="bank-sidebar__control">
                    <input
                        id="bank-input"
                        type="number"
                        inputMode="decimal"
                        min={0}
                        step={10}
                        value={Number.isFinite(bank) ? bank : 0}
                        onChange={(event) =>
                            onBankChange(
                                Math.max(0, Number.parseFloat(event.target.value) || 0)
                            )
                        }
                    />
                    <span aria-hidden="true">€</span>
                </div>
            </div>

            <div
                className="bank-sidebar__actions"
                role="group"
                aria-label="Atajos para ajustar el bank"
            >
                {[ -10, 10, 50, 100 ].map((delta) => (
                    <button
                        key={delta}
                        type="button"
                        onClick={() => handleAdjust(delta)}
                        className="bank-sidebar__button"
                    >
                        {delta > 0 ? `+${delta}€` : `${delta}€`}
                    </button>
                ))}
            </div>
        </aside>
    );
};

export default BankSidebar;
