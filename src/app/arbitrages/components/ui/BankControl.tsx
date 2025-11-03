// src/components/ui/BankControl.tsx
"use client";
import React from "react";
import { useLanguage } from "../../../context/LanguageProvider";

const BankControl = ({ bank, setBank }: { bank: number; setBank: (value: number) => void }) => {
    const { t } = useLanguage();

    return (
        <div className="bank-control fade-in">
            <div className="bank-row">
                <div className="bank-label">
                    <span aria-hidden>💰</span>
                    <span>{t('arbitrage.bank.capital') as string}</span>
                </div>
                <div className="bank-wrapper" style={{ marginLeft: "auto" }}>
                    <input
                        id="bankInput"
                        type="number"
                        min={0}
                        step={10}
                        value={bank}
                        onChange={(e) => setBank(Math.max(0, parseFloat(e.target.value) || 0))}
                        className="bank-input"
                        aria-label={t('arbitrage.bank.available') as string}
                    />
                    <span className="bank-currency">€</span>
                </div>
            </div>
        </div>
    );
};

export default BankControl;