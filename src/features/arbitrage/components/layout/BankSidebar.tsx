import React from "react";
import { MdClose } from "react-icons/md";

type BankSidebarCopy = {
    ariaLabel: string;
    title: string;
    description: string;
    close: string;
    capitalLabel: string;
    shortcutsAria: string;
};

interface BankSidebarProps {
    bank: number;
    onBankChange: React.Dispatch<React.SetStateAction<number>>;
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
    copy: BankSidebarCopy;
    currencySymbol: string;
}

const BankSidebar: React.FC<BankSidebarProps> = ({
    bank,
    onBankChange,
    isSidebarOpen,
    setIsSidebarOpen,
    copy,
    currencySymbol,
}) => {
    const handleAdjust = (delta: number) => {
        onBankChange((current) => Math.max(0, current + delta));
    };

    return (
        <aside
            id="bank-sidebar"
            className={`bank-sidebar ${isSidebarOpen ? "open" : ""}`}
            aria-label={copy.ariaLabel}
        >
            <div className="bank-sidebar__header">
                <div className="bank-sidebar__title">
                    <span className="bank-sidebar__icon" aria-hidden="true">
                        💰
                    </span>
                    <div>
                        <h3>{copy.title}</h3>
                        <p>{copy.description}</p>
                    </div>
                </div>
                <button
                    type="button"
                    className="bank-sidebar__close"
                    onClick={() => setIsSidebarOpen(false)}
                >
                    <span className="sr-only">{copy.close}</span>
                    <MdClose aria-hidden="true" />
                </button>
            </div>

            <div className="bank-sidebar__section">
                <div className="bank-sidebar__section-header">
                    <span className="bank-sidebar__section-title">{copy.capitalLabel}</span>
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
                            {currencySymbol}
                        </span>
                    </div>
                </div>

                <div
                    className="bank-sidebar__actions"
                    role="group"
                    aria-label={copy.shortcutsAria}
                >
                    {[ -10, 10, 50, 100 ].map((delta) => {
                        const absolute = Math.abs(delta);
                        const prefix = delta > 0 ? "+" : "-";
                        const formatted = `${prefix}${currencySymbol}${absolute}`;

                        return (
                            <button
                                key={delta}
                                type="button"
                                onClick={() => handleAdjust(delta)}
                                className="bank-sidebar__button"
                            >
                                {formatted}
                            </button>
                        );
                    })}
                </div>
            </div>
        </aside>
    );
};

export type { BankSidebarCopy };
export default BankSidebar;
