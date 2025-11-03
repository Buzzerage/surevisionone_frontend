"use client";

import React from "react";
import { FiFilter, FiRotateCw, FiChevronUp, FiChevronDown, FiX } from "react-icons/fi";
import type { SportFilterOption } from "../../utils/constants";

interface SelectOption {
    value: string;
    label: string;
}

type FiltersToolbarCopy = {
    ariaLabel: string;
    refineResults: string;
    close: string;
    reset: string;
    sportLabel: string;
    sportAria: string;
    searchLabel: string;
    searchPlaceholder: string;
    bookmakerLabel: string;
    minProfitLabel: string;
    minProfitPlaceholder: string;
    adjustMinProfit: string;
    incrementMinProfit: string;
    decrementMinProfit: string;
    betTypeLabel: string;
    sortLabel: string;
};

interface FiltersToolbarProps {
    bookmakerOptions: SelectOption[];
    selectedBookmaker: string;
    onBookmakerChange: (value: string) => void;
    minProfit: string;
    onMinProfitChange: (value: string) => void;
    betType: string;
    betTypeOptions: SelectOption[];
    onBetTypeChange: (value: string) => void;
    sortOption: string;
    sortOptions: SelectOption[];
    onSortOptionChange: (value: string) => void;
    onReset: () => void;
    hasActiveFilters: boolean;
    sportOptions: SportFilterOption[];
    selectedSport: string;
    onSportChange: (value: string) => void;
    isMobileOpen: boolean;
    onCloseMobile: () => void;
    searchQuery: string;
    onSearchQueryChange: (value: string) => void;
    copy: FiltersToolbarCopy;
}

const FiltersToolbar: React.FC<FiltersToolbarProps> = ({
    bookmakerOptions,
    selectedBookmaker,
    onBookmakerChange,
    minProfit,
    onMinProfitChange,
    betType,
    betTypeOptions,
    onBetTypeChange,
    sortOption,
    sortOptions,
    onSortOptionChange,
    onReset,
    hasActiveFilters,
    sportOptions,
    selectedSport,
    onSportChange,
    isMobileOpen,
    onCloseMobile,
    searchQuery,
    onSearchQueryChange,
    copy,
}) => {
    const handleStep = (direction: "up" | "down") => {
        const current = Number.parseFloat(minProfit.replace(",", "."));
        const baseValue = Number.isNaN(current) ? 0 : current;
        const delta = direction === "up" ? 0.1 : -0.1;
        const next = Math.min(100, Math.max(0, Number((baseValue + delta).toFixed(1))));
        onMinProfitChange(next.toFixed(1));
    };

    const handleWheel = (event: React.WheelEvent<HTMLInputElement>) => {
        if (!event.shiftKey) {
            return;
        }
        event.preventDefault();
        handleStep(event.deltaY < 0 ? "up" : "down");
    };

    return (
        <section
            id="advanced-filters"
            className={`filters-toolbar${isMobileOpen ? " filters-toolbar--open" : ""}`}
            aria-label={copy.ariaLabel}
        >
            <header className="filters-toolbar__header">
                <div className="filters-toolbar__title">
                    <FiFilter aria-hidden="true" />
                    <span>{copy.refineResults}</span>
                </div>
                <button
                    type="button"
                    className="filters-toolbar__close"
                    onClick={onCloseMobile}
                >
                    <span className="sr-only">{copy.close}</span>
                    <FiX aria-hidden="true" />
                </button>
                <button
                    type="button"
                    className="filters-toolbar__reset"
                    onClick={onReset}
                    disabled={!hasActiveFilters}
                >
                    <FiRotateCw aria-hidden="true" />
                    <span>{copy.reset}</span>
                </button>
            </header>

            <div className="filters-toolbar__body">
                <div className="filters-toolbar__grid">
                    <div className="filters-toolbar__group filters-toolbar__group--sports">
                        <span className="filters-toolbar__label">{copy.sportLabel}</span>
                        <div
                            className="filters-toolbar__chip-list"
                            role="listbox"
                            aria-label={copy.sportAria}
                        >
                            {sportOptions.map((option) => {
                                const Icon = option.icon;
                                const isActive = option.key === selectedSport;
                                return (
                                    <button
                                        key={option.key}
                                        type="button"
                                        className={`filters-toolbar__chip${
                                            isActive ? " filters-toolbar__chip--active" : ""
                                        }`}
                                        onClick={() => onSportChange(option.key)}
                                        role="option"
                                        aria-selected={isActive}
                                    >
                                        <Icon aria-hidden="true" />
                                        <span>{option.name}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="filters-toolbar__group">
                        <label htmlFor="filter-search" className="filters-toolbar__label">
                            {copy.searchLabel}
                        </label>
                        <div className="filters-toolbar__control">
                            <input
                                id="filter-search"
                                type="search"
                                autoComplete="off"
                                placeholder={copy.searchPlaceholder}
                                value={searchQuery}
                                onChange={(event) => onSearchQueryChange(event.target.value)}
                            />
                        </div>
                    </div>

                    <div className="filters-toolbar__group">
                        <label htmlFor="filter-bookmaker" className="filters-toolbar__label">
                            {copy.bookmakerLabel}
                        </label>
                        <div className="filters-toolbar__control">
                            <select
                                id="filter-bookmaker"
                                value={selectedBookmaker}
                                onChange={(event) => onBookmakerChange(event.target.value)}
                            >
                                {bookmakerOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="filters-toolbar__group">
                        <label htmlFor="filter-profit" className="filters-toolbar__label">
                            {copy.minProfitLabel}
                        </label>
                        <div className="filters-toolbar__control filters-toolbar__control--number">
                            <input
                                id="filter-profit"
                                type="number"
                                min="0"
                                max="100"
                                step="0.1"
                                placeholder={copy.minProfitPlaceholder}
                                value={minProfit}
                                onChange={(event) => onMinProfitChange(event.target.value)}
                                onWheel={handleWheel}
                            />
                            <div className="filters-toolbar__steppers" role="group" aria-label={copy.adjustMinProfit}>
                                <button
                                    type="button"
                                    className="filters-toolbar__stepper-button"
                                    onClick={() => handleStep("up")}
                                    aria-label={copy.incrementMinProfit}
                                >
                                    <FiChevronUp aria-hidden="true" />
                                </button>
                                <button
                                    type="button"
                                    className="filters-toolbar__stepper-button"
                                    onClick={() => handleStep("down")}
                                    aria-label={copy.decrementMinProfit}
                                >
                                    <FiChevronDown aria-hidden="true" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="filters-toolbar__group">
                        <label htmlFor="filter-bet-type" className="filters-toolbar__label">
                            {copy.betTypeLabel}
                        </label>
                        <div className="filters-toolbar__control">
                            <select
                                id="filter-bet-type"
                                value={betType}
                                onChange={(event) => onBetTypeChange(event.target.value)}
                            >
                                {betTypeOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="filters-toolbar__group">
                        <label htmlFor="filter-sort" className="filters-toolbar__label">
                            {copy.sortLabel}
                        </label>
                        <div className="filters-toolbar__control">
                            <select
                                id="filter-sort"
                                value={sortOption}
                                onChange={(event) => onSortOptionChange(event.target.value)}
                            >
                                {sortOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export type { FiltersToolbarCopy };
export default FiltersToolbar;
