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
                <div className="bank-sidebar__title">
                    <span className="bank-sidebar__icon" aria-hidden="true">
                        💰
                    </span>
                    <div>
                        <h3>Capital disponible</h3>
                        <p>Usamos tu bank para calcular las apuestas sugeridas.</p>
                    </div>
                </div>
                <button
                    type="button"
                    className="bank-sidebar__close"
                    onClick={() => setIsSidebarOpen(false)}
                >
                    <span className="sr-only">Cerrar panel de bank</span>
                    <MdClose aria-hidden="true" />
                </button>
            </div>

            <div className="bank-sidebar__section">
                <div className="bank-sidebar__section-header">
                    <span className="bank-sidebar__section-title">Capital (Bank)</span>
                    <div className="bank-sidebar__input-group">
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
                            aria-describedby="bank-helper"
                        />
                        <span aria-hidden="true" className="bank-sidebar__currency">
                            €
                        </span>
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
            </div>

            <p id="bank-helper" className="bank-sidebar__helper">
                Combina los atajos rápidos con un valor manual para simular distintos escenarios de
                stake.
            </p>
        </aside>
    );
};

export default BankSidebar;
